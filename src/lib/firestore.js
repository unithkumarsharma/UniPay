import db from './firebaseAdmin';
import dbConnect from './dbConnect';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import WalletLog from '@/models/WalletLog';
import FundRequest from '@/models/FundRequest';
import Complaint from '@/models/Complaint';
import CommissionSlab from '@/models/CommissionSlab';
import Service from '@/models/Service';
import Counter from '@/models/Counter';

// Helper to check if Firestore is configured and reachable
export function isFirestoreActive() {
  return !!db && !!process.env.FIREBASE_PROJECT_ID;
}

// ----------------------------------------------------
// 1. COUNTER LOGIC (Auto-incrementing IDs in Firestore / MongoDB)
// ----------------------------------------------------
export async function getNextSequence(name) {
  if (isFirestoreActive()) {
    const counterRef = db.collection('counters').doc(name);
    return await db.runTransaction(async (t) => {
      const doc = await t.get(counterRef);
      const newSeq = (doc.exists ? doc.data().seq || 0 : 0) + 1;
      t.set(counterRef, { seq: newSeq }, { merge: true });
      return newSeq;
    });
  } else {
    await dbConnect();
    const counter = await Counter.findByIdAndUpdate(
      name,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return counter.seq;
  }
}

// ----------------------------------------------------
// 2. USERS (Firebase Firestore / MongoDB)
// ----------------------------------------------------
export async function findUsers(query = {}) {
  if (isFirestoreActive()) {
    let ref = db.collection('users');
    if (query.role) ref = ref.where('role', '==', query.role);
    if (query.parentId) ref = ref.where('parentId', '==', query.parentId);
    if (query.phone) ref = ref.where('phone', '==', query.phone);
    if (query.email) ref = ref.where('email', '==', query.email);

    const snapshot = await ref.get();
    return snapshot.docs.map((doc) => ({ _id: doc.id, id: doc.id, ...doc.data() }));
  } else {
    await dbConnect();
    const mongoQuery = {};
    if (query.role) mongoQuery.role = query.role;
    if (query.parentId) mongoQuery.parentId = query.parentId;
    if (query.phone) mongoQuery.phone = query.phone;
    if (query.email) mongoQuery.email = query.email;

    return await User.find(mongoQuery).populate('parentId', 'name userId role').sort({ createdAt: -1 });
  }
}

export async function findUserById(id) {
  if (isFirestoreActive()) {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return null;
    return { _id: doc.id, id: doc.id, ...doc.data() };
  } else {
    await dbConnect();
    return await User.findById(id).populate('parentId', 'name userId role');
  }
}

export async function createUser(userData) {
  const prefixes = {
    admin: 'ADM',
    accountant: 'ACC',
    master_distributor: 'MD',
    distributor: 'DST',
    retailer: 'RTL',
  };
  const prefix = prefixes[userData.role] || 'USR';
  const seq = await getNextSequence(`user_${userData.role}`);
  const userId = `${prefix}${String(seq).padStart(3, '0')}`;

  const newUserObj = {
    ...userData,
    userId,
    walletBalance: parseFloat(userData.walletBalance) || 0,
    status: userData.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirestoreActive()) {
    const ref = await db.collection('users').add(newUserObj);
    return { _id: ref.id, id: ref.id, ...newUserObj };
  } else {
    await dbConnect();
    return await User.create(newUserObj);
  }
}

export async function updateUser(id, updateData) {
  const payload = { ...updateData, updatedAt: new Date().toISOString() };
  if (isFirestoreActive()) {
    await db.collection('users').doc(id).update(payload);
    return await findUserById(id);
  } else {
    await dbConnect();
    return await User.findByIdAndUpdate(id, { $set: payload }, { new: true });
  }
}

// ----------------------------------------------------
// 3. TRANSACTIONS
// ----------------------------------------------------
export async function createTransactionRecord(txnData) {
  const seq = await getNextSequence('transaction');
  const txnId = `TXN${String(seq).padStart(6, '0')}`;

  const newTxnObj = {
    ...txnData,
    txnId,
    status: txnData.status || 'success',
    createdAt: new Date().toISOString(),
  };

  if (isFirestoreActive()) {
    const ref = await db.collection('transactions').add(newTxnObj);
    return { _id: ref.id, id: ref.id, ...newTxnObj };
  } else {
    await dbConnect();
    return await Transaction.create(newTxnObj);
  }
}

export async function findTransactions(query = {}) {
  if (isFirestoreActive()) {
    let ref = db.collection('transactions');
    if (query.userId) ref = ref.where('userId', '==', query.userId);
    if (query.type) ref = ref.where('type', '==', query.type);
    if (query.status) ref = ref.where('status', '==', query.status);

    const snapshot = await ref.get();
    return snapshot.docs.map((doc) => ({ _id: doc.id, id: doc.id, ...doc.data() }));
  } else {
    await dbConnect();
    const mongoQuery = {};
    if (query.userId) mongoQuery.userId = query.userId;
    if (query.type) mongoQuery.type = query.type;
    if (query.status) mongoQuery.status = query.status;

    return await Transaction.find(mongoQuery)
      .populate('userId', 'name userId role phone shopName')
      .sort({ createdAt: -1 })
      .limit(200);
  }
}

// ----------------------------------------------------
// 4. WALLET LOGS
// ----------------------------------------------------
export async function createWalletLogRecord(logData) {
  const newLog = {
    ...logData,
    createdAt: new Date().toISOString(),
  };

  if (isFirestoreActive()) {
    const ref = await db.collection('walletLogs').add(newLog);
    return { _id: ref.id, id: ref.id, ...newLog };
  } else {
    await dbConnect();
    return await WalletLog.create(newLog);
  }
}

export async function findWalletLogs(query = {}) {
  if (isFirestoreActive()) {
    let ref = db.collection('walletLogs');
    if (query.userId) ref = ref.where('userId', '==', query.userId);

    const snapshot = await ref.get();
    return snapshot.docs.map((doc) => ({ _id: doc.id, id: doc.id, ...doc.data() }));
  } else {
    await dbConnect();
    const mongoQuery = {};
    if (query.userId) mongoQuery.userId = query.userId;

    return await WalletLog.find(mongoQuery)
      .populate('userId', 'name userId role')
      .populate('performedBy', 'name userId role')
      .sort({ createdAt: -1 })
      .limit(100);
  }
}

// ----------------------------------------------------
// 5. FUND REQUESTS
// ----------------------------------------------------
export async function createFundRequestRecord(reqData) {
  const seq = await getNextSequence('fund_request');
  const requestId = `FR${String(seq).padStart(6, '0')}`;

  const newReq = {
    ...reqData,
    requestId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  if (isFirestoreActive()) {
    const ref = await db.collection('fundRequests').add(newReq);
    return { _id: ref.id, id: ref.id, ...newReq };
  } else {
    await dbConnect();
    return await FundRequest.create(newReq);
  }
}

export async function findFundRequests(query = {}) {
  if (isFirestoreActive()) {
    let ref = db.collection('fundRequests');
    if (query.userId) ref = ref.where('userId', '==', query.userId);
    if (query.status) ref = ref.where('status', '==', query.status);

    const snapshot = await ref.get();
    return snapshot.docs.map((doc) => ({ _id: doc.id, id: doc.id, ...doc.data() }));
  } else {
    await dbConnect();
    const mongoQuery = {};
    if (query.userId) mongoQuery.userId = query.userId;
    if (query.status) mongoQuery.status = query.status;

    return await FundRequest.find(mongoQuery)
      .populate('userId', 'name userId role phone city')
      .populate('processedBy', 'name userId role')
      .sort({ createdAt: -1 });
  }
}

export async function findFundRequestById(id) {
  if (isFirestoreActive()) {
    const doc = await db.collection('fundRequests').doc(id).get();
    if (!doc.exists) return null;
    return { _id: doc.id, id: doc.id, ...doc.data() };
  } else {
    await dbConnect();
    return await FundRequest.findById(id);
  }
}

export async function updateFundRequestRecord(id, updateData) {
  const payload = { ...updateData, updatedAt: new Date().toISOString() };
  if (isFirestoreActive()) {
    await db.collection('fundRequests').doc(id).update(payload);
    return await findFundRequestById(id);
  } else {
    await dbConnect();
    return await FundRequest.findByIdAndUpdate(id, { $set: payload }, { new: true });
  }
}
