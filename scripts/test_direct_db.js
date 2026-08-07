import fs from 'fs';
import path from 'path';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  lines.forEach(l => {
    const parts = l.split('=');
    if (parts.length >= 2) {
      process.env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
}

import { createFundRequestDualDB, fetchFundRequestsDualDB } from '../src/lib/dualDatabase.js';

async function testDirect() {
  console.log('=== TEST 1: Direct DB Insert MD Request ===');
  const reqData = {
    request_id: `REQ_TEST_${Date.now().toString().slice(-4)}`,
    user_id: '133d4683-ad2b-40ca-822c-2483d3eeadcb', // MD Ajay UUID
    amount: 88000,
    payment_mode: 'ONLINE',
    reference_no: 'UTR_MD_DIRECT_101',
    bank_name: 'Company HDFC Escrow',
    remarks: 'MD Direct DB Corporate Deposit',
    status: 'pending',
  };

  const res = await createFundRequestDualDB(reqData);
  console.log('Insert Result:', res);

  console.log('\n=== TEST 2: Direct DB Fetch All Requests ===');
  const all = await fetchFundRequestsDualDB();
  console.log(`Fetched ${all.length} requests from DB:`);
  all.forEach(r => console.log(`  Req #${r.request_id || r.id} | User: ${r.user_id} | Amount: ₹${r.amount} | Status: ${r.status}`));
}

testDirect().catch(console.error);
