import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://oglnushupbmxkedjfhdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbG51c2h1cGJteGtlZGpmaGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NjYyNTIsImV4cCI6MjEwMTI0MjI1Mn0.oy4CPQ9BhaaowQBjt1WPczLGiVRRWqOVizFiRLGp0RI'
);

async function testModes() {
  const modes = ['UPI', 'IMPS', 'NEFT', 'CASH', 'online', 'bank_wire', 'cash', 'UPI_QR', 'BANK_TRANSFER'];

  for (const m of modes) {
    const { data, error } = await supabase.from('fund_requests').insert([{
      request_id: `REQ_MODE_${Math.floor(Math.random() * 90000 + 10000)}`,
      user_id: '133d4683-ad2b-40ca-822c-2483d3eeadcb',
      amount: 1000,
      payment_mode: m,
      reference_no: 'UTR_TEST',
      bank_name: 'HDFC',
      remarks: `Test mode ${m}`,
      status: 'pending',
    }]).select();

    if (error) {
      console.log(`❌ Mode "${m}": FAILED ->`, error.message);
    } else {
      console.log(`✅ Mode "${m}": SUCCESS! Inserted row ID:`, data[0]?.request_id);
    }
  }
}

testModes().catch(console.error);
