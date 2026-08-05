'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import DataTable from '@/components/DataTable';

export default function DistFundRequestPage() {
  const { user, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'my_requests'
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('NEFT');
  const [utr, setUtr] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const userId = user?.id || user?.userId || 'dst001_fallback';

  // Fetch My Requests (Submitted to MD)
  const fetchMyRequests = useCallback(async () => {
    try {
      const url = `/api/fund-requests?userId=${userId}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        const formatted = data.requests.map((r) => ({
          id: r.id || r.requestId,
          requestId: r.request_id || r.requestId || r.id,
          amount: Number(r.amount),
          method: r.payment_mode || r.paymentMethod || r.method,
          utr: r.reference_no || r.utrNumber || r.utr,
          status: r.status,
          date: r.created_at ? new Date(r.created_at).toLocaleString('en-IN') : (r.date || ''),
        }));
        setMyRequests(formatted);
      }
    } catch (e) {
      console.error('Fetch my fund requests error:', e);
    }
  }, [userId]);

  // Fetch Incoming Requests (Submitted by Retailers to Distributor)
  const fetchIncomingRequests = useCallback(async () => {
    try {
      const url = `/api/fund-requests?userRole=distributor`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        const formatted = data.requests.map((r) => ({
          ...r,
          id: r.id || r.requestId,
          requestId: r.request_id || r.requestId || r.id,
          user: r.user || r.userId?.name || 'Retailer Partner',
          userCode: r.userCode || r.userId?.userId || 'RTL',
          amount: Number(r.amount),
          method: r.payment_mode || r.paymentMethod || r.method,
          utr: r.reference_no || r.utrNumber || r.utr,
          status: r.status,
          date: r.created_at ? new Date(r.created_at).toLocaleString('en-IN') : (r.date || ''),
        }));
        setIncomingRequests(formatted);
      }
    } catch (e) {
      console.error('Fetch incoming retailer fund requests error:', e);
    }
  }, []);

  useEffect(() => {
    fetchMyRequests();
    fetchIncomingRequests();
  }, [fetchMyRequests, fetchIncomingRequests]);

  const handleSubmitMyRequest = async (e) => {
    e.preventDefault();
    if (!amount || !utr) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/fund-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userRole: 'distributor',
          amount: Number(amount),
          paymentMethod: method,
          utrNumber: utr,
          bankName: 'HDFC Bank',
          remarks: 'Distributor Wallet Request to MD',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAmount('');
        setUtr('');
        showToast(`Fund Request submitted to Master Distributor (MD) successfully!`);
        fetchMyRequests();
      } else {
        showToast(data.error || 'Failed to submit request');
      }
    } catch (err) {
      showToast('Network error while submitting request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Approve or Reject for Downline Retailer Request
  const handleDownlineAction = async (targetId, action) => {
    const nextStatus = action === 'approve' ? 'approved' : 'rejected';
    setActionLoading(targetId);

    // 1. Optimistic UI update
    setIncomingRequests((prev) =>
      prev.map((r) =>
        (r.id === targetId || r.requestId === targetId) ? { ...r, status: nextStatus } : r
      )
    );

    // 2. Call API
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
        showToast(`Retailer Fund Request ${nextStatus.toUpperCase()}! Wallet credited.`);
        await refreshUserData();
        fetchIncomingRequests();
      } else {
        showToast(`Notice: ${data.error || 'Update completed'}`);
      }
    } catch (e) {
      console.error(e);
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
      label: 'Retailer Name',
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
    { key: 'method', label: 'Mode' },
    {
      key: 'utr',
      label: 'UTR / Ref No.',
      render: (r) => (
        <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
          {r.utr || 'N/A'}
        </span>
      ),
    },
    { key: 'date', label: 'Date' },
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

  const myRequestColumns = [
    { key: 'requestId', label: 'Request ID' },
    { key: 'amount', label: 'Amount (₹)', render: (r) => `₹${r.amount?.toLocaleString('en-IN')}` },
    { key: 'method', label: 'Payment Mode' },
    { key: 'utr', label: 'UTR / Ref No.' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
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
          DISTRIBUTOR FUND REQUESTS &amp; APPROVALS
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Fund Requests &amp; Downline Approvals
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Approve pending retailer balance requests or submit fund replenishment requests to Master Distributor.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('incoming')}
          className={`btn ${activeTab === 'incoming' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
        >
          <span>📥</span> Incoming Retailer Requests ({incomingRequests.filter(r => r.status === 'pending').length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('my_requests')}
          className={`btn ${activeTab === 'my_requests' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
        >
          <span>📤</span> My Requests to MD
        </button>
      </div>

      {/* 1. INCOMING RETAILER REQUESTS TAB */}
      {activeTab === 'incoming' && (
        <DataTable
          title="Incoming Retailer Fund Requests"
          columns={incomingColumns}
          data={incomingRequests}
          searchable={true}
        />
      )}

      {/* 2. MY REQUESTS TO MD TAB */}
      {activeTab === 'my_requests' && (
        <>
          <div className="card" style={{ maxWidth: '560px', padding: '24px', borderRadius: 'var(--radius-xl)', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Submit Fund Request to Master Distributor (MD)
            </h3>

            <form onSubmit={handleSubmitMyRequest}>
              <div className="form-group">
                <label className="form-label">Requested Amount (₹)</label>
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
                  <option value="RTGS / NEFT Transfer">RTGS / NEFT Transfer</option>
                  <option value="UPI Transfer">UPI Transfer</option>
                  <option value="Cheque / DD">Company Cheque / DD</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">UTR / Reference Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. UTR991823719"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" style={{ padding: '12px', fontWeight: 800 }} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request to MD'}
              </button>
            </form>
          </div>

          <DataTable
            title="My Submitted Fund Requests History"
            columns={myRequestColumns}
            data={myRequests}
            searchable={true}
          />
        </>
      )}
    </>
  );
}
