import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://oglnushupbmxkedjfhdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbG51c2h1cGJteGtlZGpmaGRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTY2NjI1MiwiZXhwIjoyMTAxMjQyMjUyfQ.XE7dvnlFe110aAl6cd_M6X9qHeBZyEdV9VxXAexP2vE'
);

async function inspectFundRequests() {
  console.log('=== INSPECTING ALL SUPABASE FUND REQUESTS ===\n');

  const { data: reqs, error } = await supabase.from('fund_requests').select('*');
  if (error) {
    console.error('Error fetching fund requests:', error.message);
    return;
  }

  console.log(`Found ${reqs.length} fund requests in Supabase DB:`);
  reqs.forEach((r, idx) => {
    console.log(`\n[${idx + 1}] ID: ${r.request_id || r.id}`);
    console.log(`    User ID: ${r.user_id}`);
    console.log(`    Amount: ₹${r.amount}`);
    console.log(`    Mode: ${r.payment_mode}`);
    console.log(`    Ref/UTR: ${r.reference_no}`);
    console.log(`    Status: ${r.status}`);
    console.log(`    Created At: ${r.created_at}`);
  });

  const { data: users } = await supabase.from('users').select('id, user_id, name, role, email');
  console.log('\n=== ALL DB USERS ===');
  users.forEach(u => console.log(`  ${u.name} | ${u.role} | user_id: ${u.user_id} | UUID: ${u.id}`));
}

inspectFundRequests().catch(console.error);
