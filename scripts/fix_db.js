import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  'https://oglnushupbmxkedjfhdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbG51c2h1cGJteGtlZGpmaGRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTY2NjI1MiwiZXhwIjoyMTAxMjQyMjUyfQ.XE7dvnlFe110aAl6cd_M6X9qHeBZyEdV9VxXAexP2vE'
);

async function fixDB() {
  const hash = await bcrypt.hash('unipay@980', 10);

  console.log('=== FIXING ALL SUPABASE DB USERS ===\n');

  // 1. Fix Surya (Admin) - email should also respond to surya@unipay.com
  const { error: e1 } = await supabase.from('users')
    .update({ email: 'admin@unipay.com', phone: '9876543210', name: 'Surya (Admin)', wallet_balance: 200000, password_hash: hash, user_id: 'ADM001' })
    .eq('id', '3d790ac7-850b-4377-b540-83dc9ce29829');
  console.log('Admin Surya:', e1 ? `ERROR: ${e1.message}` : 'FIXED ✅');

  // 2. Fix Ram (Distributor) - email was ankitkumar@unipay.com, needs ram@unipay.com
  const { error: e2 } = await supabase.from('users')
    .update({ email: 'ram@unipay.com', phone: '9876543213', name: 'Ram (Distributor)', wallet_balance: 50000, password_hash: hash, user_id: 'DST001' })
    .eq('id', '40832945-bc1c-44dd-b2ea-79098b5c2214');
  console.log('Distributor Ram:', e2 ? `ERROR: ${e2.message}` : 'FIXED ✅');

  // 3. Fix Rohan (Retailer) - email was sureshyadav@unipay.com, needs rohan@unipay.com
  const { error: e3 } = await supabase.from('users')
    .update({ email: 'rohan@unipay.com', phone: '9876543214', name: 'Rohan (Retailer)', wallet_balance: 20000, password_hash: hash, user_id: 'RTL001' })
    .eq('id', '34a7fb3f-caa3-4275-b0b4-db1bd67a8275');
  console.log('Retailer Rohan:', e3 ? `ERROR: ${e3.message}` : 'FIXED ✅');

  // 4. Fix Ajay (MD) - email was vikramsingh@unipay.com, needs ajay@unipay.com
  const { error: e4 } = await supabase.from('users')
    .update({ email: 'ajay@unipay.com', phone: '9876543212', name: 'Ajay (MD)', wallet_balance: 100000, password_hash: hash, user_id: 'MD001' })
    .eq('id', '133d4683-ad2b-40ca-822c-2483d3eeadcb');
  console.log('MD Ajay:', e4 ? `ERROR: ${e4.message}` : 'FIXED ✅');

  // 5. Fix Unith (Accountant)
  const { error: e5 } = await supabase.from('users')
    .update({ email: 'accountant@unipay.com', phone: '9876543211', name: 'Unith (Accountant)', wallet_balance: 150000, password_hash: hash, user_id: 'ACC001' })
    .eq('id', 'b8acbfca-565b-4420-b62d-491cda173eec');
  console.log('Accountant Unith:', e5 ? `ERROR: ${e5.message}` : 'FIXED ✅');

  // 6. Add Mohan (Retailer 2) if not exists
  const { data: mohanCheck } = await supabase.from('users').select('id').eq('email', 'mohan@unipay.com').maybeSingle();
  if (!mohanCheck) {
    const { error: e6 } = await supabase.from('users').insert([{
      user_id: 'RTL002',
      name: 'Mohan (Retailer)',
      email: 'mohan@unipay.com',
      phone: '9876543215',
      role: 'retailer',
      wallet_balance: 20000,
      password_hash: hash,
      status: 'active',
      shop_name: 'Mohan Digital Seva',
      city: 'Noida',
      state: 'UP',
    }]);
    console.log('Retailer Mohan INSERT:', e6 ? `ERROR: ${e6.message}` : 'ADDED ✅');
  } else {
    console.log('Retailer Mohan: Already exists ✅');
  }

  // Verify final state
  console.log('\n=== FINAL VERIFICATION ===\n');
  const { data: all } = await supabase.from('users').select('id, user_id, name, email, phone, role, wallet_balance');
  all.forEach(u => console.log(`  ${u.name} | ${u.email} | ${u.role} | ₹${u.wallet_balance} | id: ${u.id}`));

  console.log('\n✅ ALL DONE! Database is now clean and correct.');
}

fixDB().catch(console.error);
