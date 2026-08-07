import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://oglnushupbmxkedjfhdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbG51c2h1cGJteGtlZGpmaGRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTY2NjI1MiwiZXhwIjoyMTAxMjQyMjUyfQ.XE7dvnlFe110aAl6cd_M6X9qHeBZyEdV9VxXAexP2vE'
);

async function testQuery() {
  console.log('=== TEST 1: Foreign Key Join ===');
  const { data: d1, error: e1 } = await supabase
    .from('fund_requests')
    .select('*, users!fund_requests_user_id_fkey(id, user_id, name, role)')
    .limit(5);

  if (e1) {
    console.error('❌ JOIN QUERY FAILED:', e1.message);
  } else {
    console.log('✅ JOIN SUCCESS:', d1.length, 'rows');
  }

  console.log('\n=== TEST 2: Plain Query + Manual User Lookup ===');
  const { data: reqs, error: e2 } = await supabase
    .from('fund_requests')
    .select('*')
    .limit(10);

  if (e2) {
    console.error('❌ PLAIN QUERY FAILED:', e2.message);
  } else {
    console.log(`✅ PLAIN QUERY SUCCESS: ${reqs.length} rows found in fund_requests table.`);
    reqs.forEach(r => console.log(`  Req #${r.request_id || r.id} | User: ${r.user_id} | Amount: ₹${r.amount} | Mode: ${r.payment_mode} | Status: ${r.status}`));
  }
}

testQuery().catch(console.error);
