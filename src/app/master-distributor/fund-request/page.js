'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import DataTable from '@/components/DataTable';

export default function MDFundRequestPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [utrNumber, setUtrNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = user?.id || user?._id;

  const fetchRequests = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/fund-requests?userId=${userId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !amount) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/fund-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: parseFloat(amount),
          paymentMethod: method,
          utrNumber,
          remarks,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAmount('');
        setUtrNumber('');
        setRemarks('');
        fetchRequests();
        alert('Fund request submitted to Admin!');
      } else {
        alert(data.error || 'Failed to submit request');
      }
    } catch (e) {
      alert(e.message);
    }
    setIsSubmitting(false);
  };

  const columns = [
    { key: 'requestId', label: 'Request ID' },
    { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount?.toLocaleString('en-IN')}` },
    { key: 'paymentMethod', label: 'Method', render: (r) => r.paymentMethod?.replace('_', ' ').toUpperCase() },
    { key: 'utrNumber', label: 'UTR / Ref No.' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString('en-IN') },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Fund Request</h1>
        <p>Request balance from Admin with real approval workflow</p>
      </div>

      <div className="card mb-lg" style={{ maxWidth: 500 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>New Fund Request</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
              <option value="upi">UPI</option>
              <option value="cash">Cash / Offline</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">UTR / Reference Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter UTR or UPI ref number"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Remarks (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Any remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      <DataTable title="My Fund Requests" columns={columns} data={requests} />
    </>
  );
}
