import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://oglnushupbmxkedjfhdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbG51c2h1cGJteGtlZGpmaGRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTY2NjI1MiwiZXhwIjoyMTAxMjQyMjUyfQ.XE7dvnlFe110aAl6cd_M6X9qHeBZyEdV9VxXAexP2vE'
);

async function checkDB() {
  console.log('=== Checking Supabase Tables ===\n');

  // 1. Check users table
  const { data: users, error: usersErr } = await supabase.from('users').select('id, user_id, name, email, phone, role, wallet_balance, status');
  if (usersErr) {
    console.error('USERS TABLE ERROR:', usersErr.message);
  } else {
    console.log(`Users table: ${users.length} rows`);
    users.forEach(u => console.log(`  ${u.name} | ${u.email} | ${u.role} | bal: ${u.wallet_balance} | id: ${u.id}`));
  }

  // 2. Check transactions table
  const { data: txns, error: txnErr } = await supabase.from('transactions').select('*').limit(5);
  if (txnErr) {
    console.error('\nTRANSACTIONS TABLE ERROR:', txnErr.message);
  } else {
    console.log(`\nTransactions table: ${txns?.length || 0} rows`);
  }

  // 3. Check fund_requests table
  const { data: fundReqs, error: frErr } = await supabase.from('fund_requests').select('*').limit(5);
  if (frErr) {
    console.error('\nFUND_REQUESTS TABLE ERROR:', frErr.message);
  } else {
    console.log(`Fund Requests table: ${fundReqs?.length || 0} rows`);
  }

  // 4. Check wallet_logs table
  const { data: wlogs, error: wlErr } = await supabase.from('wallet_logs').select('*').limit(5);
  if (wlErr) {
    console.error('\nWALLET_LOGS TABLE ERROR:', wlErr.message);
  } else {
    console.log(`Wallet Logs table: ${wlogs?.length || 0} rows`);
  }
}

checkDB().catch(console.error);
