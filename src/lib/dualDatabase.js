import { supabaseAdmin } from './supabaseAdmin';

const FIREBASE_RTDB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://unipay-3b9c6-default-rtdb.firebaseio.com';

/**
 * Universal Dual-Database Failover & Sync Engine
 * Primary: Supabase SQL DB
 * Secondary / Failover & Live Broadcast: Firebase Realtime Database
 */

// Helper to write to Firebase RTDB via HTTP REST API
export async function writeToFirebase(path, data, method = 'PATCH') {
  try {
    const url = `${FIREBASE_RTDB_URL}/${path}.json`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timeout);
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

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

  const payload = {
    ...reqData,
    request_id: requestId,
    id: requestId,
    updated_at: new Date().toISOString(),
  };

  // 1. Supabase Insert
  try {
    const { error } = await supabaseAdmin.from('fund_requests').insert([payload]);
    if (!error) supabaseSuccess = true;
  } catch (e) {
    console.warn('Supabase fund request insert failed, writing to Firebase RTDB:', e.message);
  }

  // 2. Firebase RTDB Insert
  firebaseSuccess = await writeToFirebase(`fund_requests/${requestId}`, payload, 'PUT');

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
