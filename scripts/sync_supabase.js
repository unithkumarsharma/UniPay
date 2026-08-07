import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oglnushupbmxkedjfhdp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbG51c2h1cGJteGtlZGpmaGRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTY2NjI1MiwiZXhwIjoyMTAxMjQyMjUyfQ.XE7dvnlFe110aAl6cd_M6X9qHeBZyEdV9VxXAexP2vE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching all users from remote Supabase DB...');
  const { data: users, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  console.log('Existing Supabase DB Users:', users.map(u => ({ email: u.email, name: u.name, bal: u.wallet_balance })));

  const updates = [
    { email: 'admin@unipay.com', name: 'Surya (Admin)', wallet_balance: 200000, phone: '9876543210', role: 'admin' },
    { email: 'surya@unipay.com', name: 'Surya (Admin)', wallet_balance: 200000, phone: '9876543210', role: 'admin' },
    { email: 'accountant@unipay.com', name: 'Unith (Accountant)', wallet_balance: 150000, phone: '9876543211', role: 'accountant' },
    { email: 'unith@unipay.com', name: 'Unith (Accountant)', wallet_balance: 150000, phone: '9876543211', role: 'accountant' },
    { email: 'ajay@unipay.com', name: 'Ajay (MD)', wallet_balance: 100000, phone: '9876543212', role: 'master_distributor' },
    { email: 'vikramsingh@unipay.com', name: 'Ajay (MD)', wallet_balance: 100000, phone: '9876543212', role: 'master_distributor' },
    { email: 'ram@unipay.com', name: 'Ram (Distributor)', wallet_balance: 50000, phone: '9876543213', role: 'distributor' },
    { email: 'ankitkumar@unipay.com', name: 'Ram (Distributor)', wallet_balance: 50000, phone: '9876543213', role: 'distributor' },
    { email: 'rohan@unipay.com', name: 'Rohan (Retailer)', wallet_balance: 20000, phone: '9876543214', role: 'retailer', shop_name: 'Rohan Mobile Point' },
    { email: 'sureshyadav@unipay.com', name: 'Rohan (Retailer)', wallet_balance: 20000, phone: '9876543214', role: 'retailer', shop_name: 'Rohan Mobile Point' },
    { email: 'mohan@unipay.com', name: 'Mohan (Retailer)', wallet_balance: 20000, phone: '9876543215', role: 'retailer', shop_name: 'Mohan Digital Seva' },
  ];

  for (const item of updates) {
    const { data: existing } = await supabase.from('users').select('*').eq('email', item.email).maybeSingle();
    if (existing) {
      console.log(`Updating existing user in Supabase DB: ${item.email}`);
      await supabase.from('users').update({
        name: item.name,
        wallet_balance: item.wallet_balance,
        phone: item.phone,
        shop_name: item.shop_name || existing.shop_name || '',
      }).eq('id', existing.id);
    } else {
      console.log(`Inserting new user into Supabase DB: ${item.email}`);
      await supabase.from('users').insert([{
        user_id: item.role.toUpperCase().slice(0,3) + Date.now().toString().slice(-3),
        name: item.name,
        email: item.email,
        phone: item.phone,
        role: item.role,
        wallet_balance: item.wallet_balance,
        status: 'active',
        shop_name: item.shop_name || '',
      }]);
    }
  }

  // Clear transactions and wallet_logs in remote Supabase DB
  try {
    const { data: txns } = await supabase.from('transactions').select('id');
    if (txns && txns.length > 0) {
      for (const t of txns) {
        await supabase.from('transactions').delete().eq('id', t.id);
      }
      console.log('Cleared Supabase transactions');
    }
  } catch (e) {
    console.warn('Transactions clear notice:', e.message);
  }

  try {
    const { data: logs } = await supabase.from('wallet_logs').select('id');
    if (logs && logs.length > 0) {
      for (const l of logs) {
        await supabase.from('wallet_logs').delete().eq('id', l.id);
      }
      console.log('Cleared Supabase wallet_logs');
    }
  } catch (e) {
    console.warn('Wallet logs clear notice:', e.message);
  }

  console.log('✅ Supabase Remote DB Successfully Updated & Seeded!');
}

run();
