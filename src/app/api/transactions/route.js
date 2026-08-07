import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { executeWalletOperation, getMemoryStore } from '@/lib/walletStore';

const UUID_MAP = {
  'md001_fallback': '133d4683-ad2b-40ca-822c-2483d3eeadcb',
  'MD001': '133d4683-ad2b-40ca-822c-2483d3eeadcb',
  'dst001_fallback': '40832945-bc1c-44dd-b2ea-79098b5c2214',
  'DST001': '40832945-bc1c-44dd-b2ea-79098b5c2214',
  'rtl001_fallback': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',
  'RTL001': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',
  'rtl002_fallback': '3263eec7-ee31-436b-b08e-1ef111169164',
  'RTL002': '3263eec7-ee31-436b-b08e-1ef111169164',
  'acc001_fallback': 'b8acbfca-565b-4420-b62d-491cda173eec',
  'ACC001': 'b8acbfca-565b-4420-b62d-491cda173eec',
  'adm001_fallback': '3d790ac7-850b-4377-b540-83dc9ce29829',
  'ADM001': '3d790ac7-850b-4377-b540-83dc9ce29829',
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawUserId = searchParams.get('userId');
    const type = searchParams.get('type');

    const userId = UUID_MAP[rawUserId] || rawUserId;

    let formattedTxns = [];
    try {
      let query = supabaseAdmin
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (userId) query = query.eq('user_id', userId);
      if (type) query = query.eq('type', type);

      const { data: transactions, error } = await query;
      if (!error && Array.isArray(transactions) && transactions.length > 0) {
        const { data: allUsers } = await supabaseAdmin.from('users').select('id, user_id, name, role');
        const userMap = new Map((allUsers || []).map(u => [u.id, u]));

        formattedTxns = transactions.map((txn) => {
          const u = userMap.get(txn.user_id);
          return {
            ...txn,
            id: txn.txn_id || txn.id,
            txnId: txn.txn_id,
            user: u?.name || 'Retailer Partner',
            role: u?.role?.toUpperCase() || 'RETAILER',
            userCode: u?.user_id || 'RTL',
            amount: Number(txn.amount),
            commission: Number(txn.commission || 0),
            date: txn.created_at ? new Date(txn.created_at).toLocaleString('en-IN') : 'Just now',
          };
        });
      }
    } catch (e) {
      console.warn('DB transactions query notice:', e.message);
    }

    if (formattedTxns.length === 0) {
      const store = getMemoryStore();
      formattedTxns = store.transactions;
      if (rawUserId || userId) {
        formattedTxns = formattedTxns.filter(t => t.user_id === userId || t.user_id === rawUserId);
      }
    }

    return NextResponse.json({ success: true, count: formattedTxns.length, transactions: formattedTxns });
  } catch (error) {
    return NextResponse.json({ success: true, count: 0, transactions: getMemoryStore().transactions });
  }
}

export async function POST(request) {
  try {
    const { userId: rawUserId, type, amount, serviceDetails } = await request.json();

    const numAmount = parseFloat(amount);
    if (!rawUserId || !type || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'User ID, transaction type, and valid amount required' },
        { status: 400 }
      );
    }

    const userId = UUID_MAP[rawUserId] || rawUserId;
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
      }]);
    } catch (e) {
      console.warn('Supabase transaction insert notice:', e.message);
    }

    return NextResponse.json({
      success: true,
      message: `${type.toUpperCase()} transaction executed successfully`,
      transaction: newTxn,
      newBalance: debitRes.newBalance,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Transaction failed' }, { status: 400 });
  }
}
