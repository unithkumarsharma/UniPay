import fetch from 'node-fetch';

async function testMdRequest() {
  console.log('=== TEST 1: Submit MD Fund Request to Accountant ===');
  const res1 = await fetch('http://localhost:3000/api/fund-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: '133d4683-ad2b-40ca-822c-2483d3eeadcb', // MD Ajay UUID
      userRole: 'master_distributor',
      amount: 75000,
      paymentMethod: 'ONLINE',
      utrNumber: 'UTR_MD_TEST_998',
      remarks: 'MD Corporate Bank Deposit',
    }),
  });
  const d1 = await res1.json();
  console.log('MD Submit Response:', d1);

  console.log('\n=== TEST 2: Accountant Fetch All Online Requests ===');
  const res2 = await fetch('http://localhost:3000/api/fund-requests?targetRole=accountant');
  const d2 = await res2.json();
  console.log(`Accountant Received ${d2.requests?.length} Requests:`);
  d2.requests?.forEach(r => {
    console.log(`  [Req #${r.requestId}] ${r.user} (${r.role}) -> Amount: ₹${r.amount} | Target: ${r.target_approver_role} | Status: ${r.status}`);
  });
}

testMdRequest().catch(console.error);
