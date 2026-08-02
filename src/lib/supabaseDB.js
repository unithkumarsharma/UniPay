import { supabaseAdmin } from './supabaseAdmin.js';

/**
 * Fetch user by phone or ID from Supabase
 */
export async function getUserByPhone(phone) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user by phone:', error);
    throw error;
  }
  return data;
}

/**
 * Fetch wallet balance for a user
 */
export async function getUserWalletBalance(userId) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('wallet_balance, status')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
  return data;
}

/**
 * Execute a safe atomic wallet transaction (Debit or Credit) with ledger logging.
 */
export async function processWalletTransaction({
  userId,
  type, // 'credit' or 'debit'
  amount,
  description,
  referenceId = null,
  performedBy = null,
}) {
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Invalid transaction amount');
  }

  // Fetch current user and balance
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('id, wallet_balance, status')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    throw new Error('User not found');
  }

  if (user.status === 'blocked') {
    throw new Error('Account is blocked');
  }

  const currentBalance = Number(user.wallet_balance || 0);

  if (type === 'debit' && currentBalance < numAmount) {
    throw new Error('Insufficient wallet balance');
  }

  const newBalance = type === 'debit'
    ? currentBalance - numAmount
    : currentBalance + numAmount;

  // 1. Update User Wallet Balance
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating wallet balance:', updateError);
    throw updateError;
  }

  // 2. Add Wallet Audit Log
  const { data: walletLog, error: logError } = await supabaseAdmin
    .from('wallet_logs')
    .insert([
      {
        user_id: userId,
        type,
        amount: numAmount,
        balance_before: currentBalance,
        balance_after: newBalance,
        description,
        reference_id: referenceId,
        performed_by: performedBy,
      },
    ])
    .select()
    .single();

  if (logError) {
    console.error('Error recording wallet log:', logError);
  }

  return {
    success: true,
    previousBalance: currentBalance,
    newBalance,
    log: walletLog,
  };
}

/**
 * Create a new payment transaction record
 */
export async function createTransactionRecord(txnData) {
  const { data, error } = await supabaseAdmin
    .from('transactions')
    .insert([txnData])
    .select()
    .single();

  if (error) {
    console.error('Error creating transaction record:', error);
    throw error;
  }
  return data;
}

/**
 * Fetch transaction history for a user
 */
export async function getUserTransactions(userId, limit = 50) {
  const { data, error } = await supabaseAdmin
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
  return data;
}
