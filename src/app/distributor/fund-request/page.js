'use client';
import { useState } from 'react';
import DataTable from '@/components/DataTable';

const INITIAL_DIST_REQUESTS = [
  {
    id: 'DST-REQ-101',
    requestId: 'DST-REQ-101',
    amount: 50000,
    method: 'Bank Transfer (RTGS)',
    utr: 'RTGS99812488',
    status: 'approved',
    date: '2026-08-01 11:20',
  },
  {
    id: 'DST-REQ-102',
    requestId: 'DST-REQ-102',
    amount: 100000,
    method: 'UPI Transfer',
    utr: 'UPI77261599',
    status: 'pending',
    date: '2026-08-02 15:10',
  },
];

export default function DistFundRequestPage() {
  const [requests, setRequests] = useState(INITIAL_DIST_REQUESTS);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Bank Transfer (RTGS)');
  const [utr, setUtr] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !utr) return;

    const newReq = {
      id: `DST-REQ-${Date.now().toString().slice(-4)}`,
      requestId: `DST-REQ-${Date.now().toString().slice(-4)}`,
      amount: Number(amount),
      method,
      utr,
      status: 'pending',
      date: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
    };

    setRequests([newReq, ...requests]);
    setAmount('');
    setUtr('');
    showToast(`✅ Master Distributor Fund Request of ₹${Number(amount).toLocaleString('en-IN')} submitted!`);
  };

  const columns = [
    {
      key: 'requestId',
      label: 'Request ID',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 700,
          color: '#2563EB',
          background: 'rgba(37, 99, 235, 0.08)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-md)',
        }}>
          {r.requestId || r.id}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount (₹)',
      render: (r) => (
        <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.95rem' }}>
          ₹{(r.amount || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    { key: 'method', label: 'Payment Mode' },
    {
      key: 'utr',
      label: 'UTR / Ref No.',
      render: (r) => (
        <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
          {r.utr || 'N/A'}
        </span>
      ),
    },
    { key: 'date', label: 'Date & Time' },
    {
      key: 'status',
      label: 'Status',
      render: (r) => {
        const isApproved = r.status === 'approved';
        const isPending = r.status === 'pending';
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            background: isApproved ? 'rgba(16, 185, 129, 0.12)' : isPending ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: isApproved ? '#059669' : isPending ? '#D97706' : '#DC2626',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isApproved ? '#10B981' : isPending ? '#F59E0B' : '#EF4444' }} />
            {r.status}
          </span>
        );
      },
    },
  ];

  return (
    <>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 9999,
          background: '#10B981',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.88rem',
          fontWeight: 700,
        }}>
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          DISTRIBUTOR BALANCE REPLENISHMENT
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Fund Request to Master Distributor
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Request high-volume balance allocation from Master Distributor / Corporate Admin.
        </p>
      </div>

      {/* Submission Card */}
      <div className="card" style={{ maxWidth: '560px', padding: '24px', borderRadius: 'var(--radius-xl)', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          Submit Distributor Fund Request
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Requested Balance Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 50000"
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
              <option value="Bank Transfer (RTGS)">Bank Transfer (RTGS / NEFT)</option>
              <option value="UPI Transfer">UPI Transfer</option>
              <option value="Company Cheque">Company Cheque / Demand Draft</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Bank UTR / Reference Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. RTGS99812488"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', fontSize: '0.9rem', fontWeight: 800 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Submit Request to Master Distributor
          </button>
        </form>
      </div>

      {/* Table */}
      <DataTable
        title="Distributor Request Audit Log"
        columns={columns}
        data={requests}
        searchable={true}
      />
    </>
  );
}
