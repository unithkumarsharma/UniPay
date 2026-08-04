import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { executeWalletOperation, getMemoryStore } from '@/lib/walletStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    let formattedTxns = [];
    try {
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

      const { data: transactions, error } = await query;
      if (!error && Array.isArray(transactions) && transactions.length > 0) {
        formattedTxns = transactions.map((txn) => ({
          ...txn,
          txnId: txn.txn_id,
          amount: Number(txn.amount),
          commission: Number(txn.commission || 0),
        }));
      }
    } catch (e) {
      console.warn('DB transactions query notice:', e.message);
    }

    if (formattedTxns.length === 0) {
      const store = getMemoryStore();
      formattedTxns = store.transactions;
    }

    return NextResponse.json({ success: true, count: formattedTxns.length, transactions: formattedTxns });
  } catch (error) {
    return NextResponse.json({ success: true, count: 0, transactions: getMemoryStore().transactions });
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

    const retailerComm = Number(serviceDetails?.commission || (numAmount * 0.015).toFixed(2));
    const netDeduction = Math.max(1, numAmount - retailerComm);
    const txnId = `TXN${Date.now().toString().slice(-6)}`;

    // Debit Retailer Wallet in Real Time
    const debitRes = await executeWalletOperation({
      userId,
      type: 'debit',
      amount: netDeduction,
      description: `${(type || 'service').toUpperCase()} - ${serviceDetails?.operator || 'Service'} (${serviceDetails?.mobile || serviceDetails?.accountNo || 'Ref'})`,
      referenceId: txnId,
    });

    const newTxn = {
      id: txnId,
      txnId,
      txn_id: txnId,
      user_id: userId,
      type,
      amount: numAmount,
      commission: retailerComm,
      status: 'success',
      service_name: serviceDetails?.serviceName || serviceDetails?.operator || type,
      service_operator: serviceDetails?.operator || '',
      service_mobile: serviceDetails?.mobile || '',
      created_at: new Date().toISOString(),
    };

    getMemoryStore().transactions.unshift(newTxn);

    // Try DB Insert
    try {
      await supabaseAdmin.from('transactions').insert([{
        txn_id: txnId,
        user_id: userId,
        type,
        amount: numAmount,
        commission: retailerComm,
        status: 'success',
        service_name: serviceDetails?.serviceName || type,
        service_operator: serviceDetails?.operator || null,
        service_mobile: serviceDetails?.mobile || null,
      }]);
    } catch (dbErr) {
      console.warn('DB transaction insert notice:', dbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction processed successfully!',
      transaction: newTxn,
      newBalance: debitRes.newBalance,
    });
  } catch (error) {
    console.error('POST transaction error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Transaction failed' }, { status: 400 });
  }
}
