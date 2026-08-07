'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import DataTable from '@/components/DataTable';

export default function MDFundRequestPage() {
  const { user, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'my_requests'
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [utrNumber, setUtrNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const userId = user?.id || user?.userId || 'md001_fallback';

  // Fetch My Requests (Submitted to Accountant)
  const fetchMyRequests = useCallback(async () => {
    try {
      const res = await fetch(`/api/fund-requests?userId=${userId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setMyRequests(data.requests);
      }
    } catch (e) {
      console.error(e);
    }
  }, [userId]);

  // Fetch Incoming Requests (Submitted by Distributors to MD)
  const fetchIncomingRequests = useCallback(async () => {
    try {
      const res = await fetch(`/api/fund-requests?userRole=master_distributor`);
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        const formatted = data.requests.map((r) => ({
          ...r,
          id: r.id || r.requestId,
          requestId: r.request_id || r.requestId || r.id,
          user: r.user || r.userId?.name || 'Distributor Partner',
          userCode: r.userCode || r.userId?.userId || 'DST',
          amount: Number(r.amount),
          method: r.payment_mode || r.paymentMethod || r.method,
          utr: r.reference_no || r.utrNumber || r.utr,
          status: r.status,
          date: r.created_at ? new Date(r.created_at).toLocaleString('en-IN') : (r.date || ''),
        }));
        setIncomingRequests(formatted);
      }
    } catch (e) {
      console.error('Fetch incoming distributor requests error:', e);
    }
  }, []);

  useEffect(() => {
    fetchMyRequests();
    fetchIncomingRequests();
  }, [fetchMyRequests, fetchIncomingRequests]);

  const handleSubmitMyRequest = async (e) => {
    e.preventDefault();
    if (!userId || !amount) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/fund-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userRole: 'master_distributor',
          amount: parseFloat(amount),
          paymentMethod: method,
          utrNumber,
          remarks: remarks || 'MD Wallet Request to Accountant',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAmount('');
        setUtrNumber('');
        setRemarks('');
        showToast('Fund request submitted to Corporate Accountant successfully!');
        fetchMyRequests();
      } else {
        showToast(data.error || 'Failed to submit request');
      }
    } catch (e) {
      showToast(e.message);
    }
    setIsSubmitting(false);
  };

  const handleDownlineAction = async (targetId, action) => {
    const nextStatus = action === 'approve' ? 'approved' : 'rejected';
    setActionLoading(targetId);

    // Optimistic UI update
    setIncomingRequests((prev) =>
      prev.map((r) =>
        (r.id === targetId || r.requestId === targetId) ? { ...r, status: nextStatus } : r
      )
    );

    try {
      const res = await fetch(`/api/fund-requests/${targetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          processedBy: userId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Distributor Request ${nextStatus.toUpperCase()}! Wallet credited.`);
        await refreshUserData();
        fetchIncomingRequests();
      } else {
        showToast(`Notice: ${data.error || 'Update completed'}`);
      }
    } catch (e) {
      showToast(`Network error: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const incomingColumns = [
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
      key: 'user',
      label: 'Distributor Name',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.user}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{r.userCode}</span>
        </div>
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
    { key: 'utr', label: 'UTR / Ref No.' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Action',
      render: (row) => {
        const rowKey = row.id || row.requestId;
        const isProcessing = actionLoading === rowKey;
        return row.status === 'pending' ? (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              className="btn btn-sm btn-success"
              disabled={isProcessing}
              style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={() => handleDownlineAction(rowKey, 'approve')}
            >
              ✓ Approve &amp; Credit
            </button>
            <button
              className="btn btn-sm btn-danger"
              disabled={isProcessing}
              style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={() => handleDownlineAction(rowKey, 'reject')}
            >
              ✕ Reject
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>
            {row.status === 'approved' ? 'Credited' : 'Rejected'}
          </span>
        );
      },
    },
  ];

  const myColumns = [
    { key: 'requestId', label: 'Request ID' },
    { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount?.toLocaleString('en-IN')}` },
    { key: 'paymentMethod', label: 'Method', render: (r) => r.paymentMethod?.replace('_', ' ').toUpperCase() },
    { key: 'utrNumber', label: 'UTR / Ref No.' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Date', render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '' },
  ];

  return (
    <>
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

      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1>Master Distributor Fund Requests</h1>
        <p>Approve distributor balance requests or request corporate balance from Accountant</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('incoming')}
          className={`btn ${activeTab === 'incoming' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: 700 }}
        >
          📥 Incoming Distributor Requests ({incomingRequests.filter(r => r.status === 'pending').length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('my_requests')}
          className={`btn ${activeTab === 'my_requests' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: 700 }}
        >
          📤 My Requests to Accountant
        </button>
      </div>

      {activeTab === 'incoming' && (
        <DataTable title="Incoming Distributor Fund Requests" columns={incomingColumns} data={incomingRequests} searchable={true} />
      )}

      {activeTab === 'my_requests' && (
        <>
          <div className="card mb-lg" style={{ maxWidth: 500 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>New Corporate Fund Request</h3>
            <form onSubmit={handleSubmitMyRequest}>
              <div className="form-group">
                <label className="form-label">Select Top-Up Mode</label>
                <select
                  className="form-select"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  style={{ fontWeight: 700 }}
                >
                  <option value="ONLINE">🏦 Online Company Bank Transfer (Accountant Approval via UTR)</option>
                  <option value="CASH">💵 Cash Top-Up (Company Cash Handover)</option>
                </select>
              </div>

              {method === 'ONLINE' ? (
                <div style={{ background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.2)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
                  <strong style={{ color: '#2563EB' }}>🏦 Company Bank Transfer Instructions:</strong><br />
                  Transfer funds to Company Bank Account. Enter UTR. <strong>Accountant will verify from bank statement and credit your MD wallet.</strong>
                </div>
              ) : (
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
                  <strong style={{ color: '#059669' }}>💵 Cash Handover to Company Instructions:</strong><br />
                  Give cash to Company/Admin. <strong>Accountant/Admin will approve and credit your MD wallet.</strong>
                </div>
              )}

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
                <label className="form-label">{method === 'CASH' ? 'Receipt / Cash Note Reference' : 'UTR / Reference Number'}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={method === 'CASH' ? "e.g. Cash handed to Admin/Company" : "Enter UTR number"}
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  required
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
                {isSubmitting ? 'Submitting...' : 'Submit Request to Accountant'}
              </button>
            </form>
          </div>

          <DataTable title="My Fund Requests History" columns={myColumns} data={myRequests} searchable={true} />
        </>
      )}
    </>
  );
}
