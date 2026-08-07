import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://oglnushupbmxkedjfhdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbG51c2h1cGJteGtlZGpmaGRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTY2NjI1MiwiZXhwIjoyMTAxMjQyMjUyfQ.XE7dvnlFe110aAl6cd_M6X9qHeBZyEdV9VxXAexP2vE'
);

async function verifyAllTables() {
  console.log('=== VERIFYING SUPABASE DATABASE TABLES ===\n');

  const tables = ['users', 'wallet_logs', 'transactions', 'fund_requests', 'complaints', 'services', 'commissions', 'settlements'];

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true });
      if (error) {
        console.warn(`⚠️ Table '${table}' check note:`, error.message);
      } else {
        console.log(`✅ Table '${table}' exists and active.`);
      }
    } catch (e) {
      console.error(`❌ Table '${table}' failed:`, e.message);
    }
  }

  console.log('\n=== DB TABLE AUDIT COMPLETE ===');
}

verifyAllTables().catch(console.error);
