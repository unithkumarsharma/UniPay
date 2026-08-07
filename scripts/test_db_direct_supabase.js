import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://oglnushupbmxkedjfhdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbG51c2h1cGJteGtlZGpmaGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NjYyNTIsImV4cCI6MjEwMTI0MjI1Mn0.oy4CPQ9BhaaowQBjt1WPczLGiVRRWqOVizFiRLGp0RI'
);

async function test() {
  const { data, error } = await supabase.from('fund_requests').insert([{
    request_id: `REQ_TEST_${Date.now().toString().slice(-4)}`,
    user_id: '133d4683-ad2b-40ca-822c-2483d3eeadcb', // MD Ajay
    amount: 50000,
    payment_mode: 'ONLINE',
    reference_no: 'UTR_TEST_101',
    bank_name: 'HDFC Bank',
    remarks: 'Test MD Request',
    status: 'pending',
  }]).select();

  if (error) {
    console.error('❌ Supabase Anon Insert Failed:', error.message);
  } else {
    console.log('✅ Supabase Anon Insert Succeeded! Row:', data);
  }
}

test().catch(console.error);
