'use client';
import DataTable from '@/components/DataTable';
import { fundRequests } from '@/data/mockData';

export default function RetailerFundRequestPage() {
  const columns = [
    { key: 'id', label: 'Request ID' },
    { key: 'amount', label: 'Amount' },
    { key: 'method', label: 'Method' },
    { key: 'utr', label: 'UTR/Ref' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date' },
  ];

  return (
    <>
      <div className="page-header"><h1>Fund Request</h1><p>Request balance from your Distributor</p></div>
      <div className="card mb-lg" style={{ maxWidth: 500 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>New Fund Request</h3>
        <div className="form-group"><label className="form-label">Amount (₹)</label><input type="number" className="form-input" placeholder="Enter amount" /></div>
        <div className="form-group"><label className="form-label">Payment Method</label>
          <select className="form-select"><option>Bank Transfer</option><option>UPI</option><option>Cash (Offline)</option></select>
        </div>
        <div className="form-group"><label className="form-label">UTR / Reference</label><input type="text" className="form-input" placeholder="Enter reference number" /></div>
        <button className="btn btn-primary w-full">Submit Request</button>
      </div>
      <DataTable title="My Requests" columns={columns} data={fundRequests.slice(0, 3)} />
    </>
  );
}
