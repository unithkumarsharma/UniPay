import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { processWalletTransaction } from '@/lib/supabaseDB';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('transactions')
      .select(`
        *,
        users!transactions_user_id_fkey(id, user_id, name, role, phone, shop_name)
      `)
      .order('created_at', { ascending: false })
      .limit(200);

    if (userId) query = query.eq('user_id', userId);
    if (type) query = query.eq('type', type);
    if (status) query = query.eq('status', status);

    const { data: transactions, error } = await query;

    if (error) {
      console.error('Fetch transactions error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const formattedTxns = (transactions || []).map((txn) => ({
      ...txn,
      txnId: txn.txn_id,
      userId: txn.users ? {
        id: txn.users.id,
        userId: txn.users.user_id,
        name: txn.users.name,
        role: txn.users.role,
        phone: txn.users.phone,
        shopName: txn.users.shop_name,
      } : null,
      amount: Number(txn.amount),
      commission: Number(txn.commission || 0),
      balanceBefore: Number(txn.balance_before || 0),
      balanceAfter: Number(txn.balance_after || 0),
      serviceDetails: {
        operator: txn.service_operator,
        mobile: txn.service_mobile,
        accountNo: txn.service_account_no,
        planAmount: Number(txn.service_plan_amount || 0),
        apiTxnId: txn.api_txn_id,
        serviceName: txn.service_name,
      },
      commissionBreakup: {
        retailer: Number(txn.retailer_commission || 0),
        distributor: Number(txn.distributor_commission || 0),
        masterDistributor: Number(txn.master_distributor_commission || 0),
        admin: Number(txn.admin_commission || 0),
      },
    }));

    return NextResponse.json({ success: true, count: formattedTxns.length, transactions: formattedTxns });
  } catch (error) {
    console.error('GET transactions error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, type, amount, serviceDetails } = await request.json();

    const numAmount = parseFloat(amount);
    if (!userId || !type || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'User ID, transaction type, and valid amount required' },
        { status: 400 }
      );
    }

    // 1. Fetch User from Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'User not found in database' }, { status: 404 });
    }

    if (user.status === 'blocked') {
      return NextResponse.json({ success: false, error: 'User account is blocked' }, { status: 403 });
    }

    const currentBalance = Number(user.wallet_balance || 0);

    if (currentBalance < numAmount) {
      return NextResponse.json(
        { success: false, error: 'Insufficient wallet balance for this transaction' },
        { status: 400 }
      );
    }

    // 2. Fetch Commission Slab for this service
    let retailerComm = 1.5;
    let distMargin = 0.5;
    let mdMargin = 0.5;
    let adminProfit = 0.5;

    const { data: slab } = await supabaseAdmin
      .from('commission_slabs')
      .select('*')
      .or(`service_type.eq.${type},operator.eq.${serviceDetails?.operator || ''}`)
      .limit(1)
      .maybeSingle();

    if (slab) {
      retailerComm = Number(slab.retailer_comm || 1.5);
      distMargin = Number(slab.distributor_comm || 0.5);
      mdMargin = Number(slab.master_distributor_comm || 0.5);
      adminProfit = Number(slab.admin_comm || 0.5);
    }

    // Deduct net amount (transaction amount - retailer instant cashback/commission)
    const netDeduction = numAmount - retailerComm;
    const txnId = `TXN${Date.now().toString().slice(-6)}`;

    // 3. Process Atomic Wallet Debit for Retailer
    const debitResult = await processWalletTransaction({
      userId: user.id,
      type: 'debit',
      amount: netDeduction,
      description: `${type.toUpperCase()} - ${serviceDetails?.operator || 'Service'} (${serviceDetails?.mobile || serviceDetails?.accountNo || ''})`,
      referenceId: txnId,
    });

    // 4. Create Transaction Record in Supabase
    const { data: txn, error: txnError } = await supabaseAdmin
      .from('transactions')
      .insert([
        {
          txn_id: txnId,
          user_id: user.id,
          type,
          amount: numAmount,
          commission: retailerComm,
          status: 'success',
          balance_before: currentBalance,
          balance_after: debitResult.newBalance,
          service_operator: serviceDetails?.operator || null,
          service_mobile: serviceDetails?.mobile || null,
          service_account_no: serviceDetails?.accountNo || null,
          service_plan_amount: serviceDetails?.planAmount || numAmount,
          api_txn_id: `API_${Date.now()}`,
          service_name: serviceDetails?.serviceName || type,
          retailer_commission: retailerComm,
          distributor_commission: distMargin,
          master_distributor_commission: mdMargin,
          admin_commission: adminProfit,
        },
      ])
      .select()
      .single();

    if (txnError) {
      console.error('Transaction insert error:', txnError);
    }

    // 5. Pay Distributor Margin if Parent User Exists in Supabase
    if (user.parent_id) {
      try {
        const { data: dist } = await supabaseAdmin
          .from('users')
          .select('id, parent_id, name')
          .eq('id', user.parent_id)
          .single();

        if (dist && distMargin > 0) {
          await processWalletTransaction({
            userId: dist.id,
            type: 'credit',
            amount: distMargin,
            description: `Commission Margin for ${txnId} from ${user.name}`,
            referenceId: txnId,
          });

          // Pay Master Distributor Margin if Parent MD Exists
          if (dist.parent_id && mdMargin > 0) {
            const { data: md } = await supabaseAdmin
              .from('users')
              .select('id, name')
              .eq('id', dist.parent_id)
              .single();

            if (md) {
              await processWalletTransaction({
                userId: md.id,
                type: 'credit',
                amount: mdMargin,
                description: `Commission Margin for ${txnId} from ${dist.name}`,
                referenceId: txnId,
              });
            }
          }
        }
      } catch (commErr) {
        console.warn('Commission distribution note:', commErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction processed successfully!',
      transaction: {
        ...txn,
        txnId: txn?.txn_id || txnId,
      },
      newBalance: debitResult.newBalance,
    });
  } catch (error) {
    console.error('POST transaction error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
