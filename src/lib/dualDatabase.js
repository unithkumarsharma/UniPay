import { supabaseAdmin } from './supabaseAdmin.js';

const FIREBASE_RTDB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://unipay-3b9c6-default-rtdb.firebaseio.com';

function normalizePaymentMode(mode) {
  const m = (mode || '').toUpperCase().trim();
  if (m === 'RTGS') return 'RTGS';
  if (m === 'NEFT') return 'NEFT';
  if (m === 'IMPS') return 'IMPS';
  if (m === 'CASH' || m === 'CASH_TOPUP') return 'NEFT';
  return 'UPI';
}

// Helper to write to Firebase RTDB via HTTP REST API
export async function writeToFirebase(path, data, method = 'PATCH') {
  try {
    const url = `${FIREBASE_RTDB_URL}/${path}.json`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (e) {
    console.warn(`Firebase RTDB write notice (${path}):`, e.message);
    return false;
  }
}

// Helper to read from Firebase RTDB via HTTP REST API
export async function readFromFirebase(path) {
  try {
    const url = `${FIREBASE_RTDB_URL}/${path}.json`;
    const res = await fetch(url);

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn(`Firebase RTDB read notice (${path}):`, e.message);
  }
  return null;
}

/**
 * Dual DB Balance Sync (Supabase + Firebase RTDB)
 */
export async function syncBalanceDualDB(userId, newBalance) {
  const numBal = Number(newBalance);
  let supabaseSuccess = false;
  let firebaseSuccess = false;

  // 1. Write to Supabase DB
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({ wallet_balance: numBal })
      .or(`id.eq.${userId},user_id.eq.${userId}`);

    if (!error) supabaseSuccess = true;
  } catch (e) {
    console.warn('Supabase balance sync failed, engaging Firebase failover:', e.message);
  }

  // 2. Write to Firebase RTDB (Primary for live websocket broadcast)
  const fbPayload = {
    balance: numBal,
    walletBalance: numBal,
    updatedAt: Date.now(),
  };

  firebaseSuccess = await writeToFirebase(`wallets/${userId}`, fbPayload, 'PATCH');

  return { supabaseSuccess, firebaseSuccess, balance: numBal };
}

/**
 * Dual DB Fund Request Creation (Supabase + Firebase RTDB Failover)
 */
export async function createFundRequestDualDB(reqData) {
  const requestId = reqData.request_id || reqData.id || `REQ${Date.now().toString().slice(-6)}`;
  let supabaseSuccess = false;
  let firebaseSuccess = false;

  const validMode = normalizePaymentMode(reqData.payment_mode || reqData.paymentMethod);

  const dbPayload = {
    request_id: requestId,
    user_id: reqData.user_id,
    amount: Number(reqData.amount),
    payment_mode: validMode,
    reference_no: reqData.reference_no || reqData.utrNumber || `UTR${Date.now()}`,
    bank_name: reqData.bank_name || 'Company Bank Escrow',
    remarks: reqData.remarks || '',
    status: reqData.status || 'pending',
  };

  const fbPayload = {
    ...reqData,
    ...dbPayload,
    id: requestId,
    paymentMethod: reqData.payment_mode || reqData.paymentMethod || validMode,
    updated_at: new Date().toISOString(),
  };

  // 1. Supabase Insert with exact allowed payment_mode
  try {
    const { error } = await supabaseAdmin.from('fund_requests').insert([dbPayload]);
    if (!error) {
      supabaseSuccess = true;
      console.log(`✅ Fund Request #${requestId} saved to Supabase DB successfully!`);
    } else {
      console.error('Supabase fund request DB error:', error.message);
    }
  } catch (e) {
    console.warn('Supabase fund request insert failed:', e.message);
  }

  // 2. Firebase RTDB Insert
  firebaseSuccess = await writeToFirebase(`fund_requests/${requestId}`, fbPayload, 'PUT');

  return { success: supabaseSuccess || firebaseSuccess, requestId, supabaseSuccess, firebaseSuccess };
}

/**
 * Dual DB Fund Request Fetch (Supabase with Firebase RTDB Failover)
 */
export async function fetchFundRequestsDualDB(filter = {}) {
  let requests = [];

  // 1. Try Supabase
  try {
    let query = supabaseAdmin.from('fund_requests').select('*').order('created_at', { ascending: false });
    if (filter.status) query = query.eq('status', filter.status);

    const { data, error } = await query;
    if (!error && Array.isArray(data) && data.length > 0) {
      requests = data;
    }
  } catch (e) {
    console.warn('Supabase fetch failed, activating Firebase RTDB failover:', e.message);
  }

  // 2. Failover to Firebase RTDB if Supabase empty/failed
  if (requests.length === 0) {
    const fbData = await readFromFirebase('fund_requests');
    if (fbData && typeof fbData === 'object') {
      const arr = Object.values(fbData);
      if (filter.status) {
        requests = arr.filter(r => r.status === filter.status);
      } else {
        requests = arr;
      }
    }
  }

  return requests;
}
