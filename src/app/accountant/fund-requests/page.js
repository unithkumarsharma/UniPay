'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';

const MOCK_FUND_REQUESTS_PERIODS = {
  today: [
    {
      id: 'FR-9901',
      _id: 'FR-9901',
      requestId: 'FR-9901',
      user: 'Suresh Yadav',
      userId: 'RTL001',
      role: 'RETAILER',
      amount: 50000,
      paymentMethod: 'bank_wire',
      utrNumber: 'UTR998124891',
      createdAt: '2026-08-02 12:45',
      status: 'pending',
    },
  ],
  yesterday: [
    {
      id: 'FR-9902',
      _id: 'FR-9902',
      requestId: 'FR-9902',
      user: 'Ankit Kumar',
      userId: 'DST001',
      role: 'DISTRIBUTOR',
      amount: 100000,
      paymentMethod: 'upi_transfer',
      utrNumber: 'UPI772615102',
      createdAt: '2026-08-01 11:30',
      status: 'pending',
    },
  ],
  '7days': [
    {
      id: 'FR-9901',
      _id: 'FR-9901',
      requestId: 'FR-9901',
      user: 'Suresh Yadav',
      userId: 'RTL001',
      role: 'RETAILER',
      amount: 50000,
      paymentMethod: 'bank_wire',
      utrNumber: 'UTR998124891',
      createdAt: '2026-08-02 12:45',
      status: 'pending',
    },
    {
      id: 'FR-9902',
      _id: 'FR-9902',
      requestId: 'FR-9902',
      user: 'Ankit Kumar',
      userId: 'DST001',
      role: 'DISTRIBUTOR',
      amount: 100000,
      paymentMethod: 'upi_transfer',
      utrNumber: 'UPI772615102',
      createdAt: '2026-08-01 11:30',
      status: 'pending',
    },
    {
      id: 'FR-9903',
      _id: 'FR-9903',
      requestId: 'FR-9903',
      user: 'Vikram Singh',
      userId: 'MD001',
      role: 'MASTER DISTRIBUTOR',
      amount: 250000,
      paymentMethod: 'imps_deposit',
      utrNumber: 'IMPS55192099',
      createdAt: '2026-07-28 16:15',
      status: 'approved',
    },
  ],
  month: [
    {
      id: 'FR-9901',
      _id: 'FR-9901',
      requestId: 'FR-9901',
      user: 'Suresh Yadav',
      userId: 'RTL001',
      role: 'RETAILER',
      amount: 50000,
      paymentMethod: 'bank_wire',
      utrNumber: 'UTR998124891',
      createdAt: '2026-08-02 12:45',
      status: 'pending',
    },
    {
      id: 'FR-9902',
      _id: 'FR-9902',
      requestId: 'FR-9902',
      user: 'Ankit Kumar',
      userId: 'DST001',
      role: 'DISTRIBUTOR',
      amount: 100000,
      paymentMethod: 'upi_transfer',
      utrNumber: 'UPI772615102',
      createdAt: '2026-08-01 11:30',
      status: 'pending',
    },
    {
      id: 'FR-9903',
      _id: 'FR-9903',
      requestId: 'FR-9903',
      user: 'Vikram Singh',
      userId: 'MD001',
      role: 'MASTER DISTRIBUTOR',
      amount: 250000,
      paymentMethod: 'imps_deposit',
      utrNumber: 'IMPS55192099',
      createdAt: '2026-07-28 16:15',
      status: 'approved',
    },
  ],
  custom: [
    {
      id: 'FR-9901',
      _id: 'FR-9901',
      requestId: 'FR-9901',
      user: 'Suresh Yadav',
      userId: 'RTL001',
      role: 'RETAILER',
      amount: 50000,
      paymentMethod: 'bank_wire',
      utrNumber: 'UTR998124891',
      createdAt: '2026-08-02 12:45',
      status: 'pending',
    },
  ],
};

const LOCAL_STORAGE_KEY = 'unipay_fund_requests_store';

export default function FundRequestsPage() {
  const { user } = useAuth();
  const [dateRangePreset, setDateRangePreset] = useState('month'); // 'today' | 'yesterday' | '7days' | 'month' | 'custom'
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-02');
  const [requests, setRequests] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    let dataset = MOCK_FUND_REQUESTS_PERIODS[dateRangePreset] || MOCK_FUND_REQUESTS_PERIODS.month;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${dateRangePreset}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dataset = parsed;
          }
        } catch (e) {}
      }
    }
    setRequests(dataset);
  }, [dateRangePreset]);

  const handleAction = async (targetId, action) => {
    const nextStatus = action === 'approve' ? 'approved' : 'rejected';

    setRequests((prevRequests) => {
      const updated = prevRequests.map((r) => {
        if (r.id === targetId || r._id === targetId || r.requestId === targetId) {
          return { ...r, status: nextStatus };
        }
        return r;
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_${dateRangePreset}`, JSON.stringify(updated));
      }
      return updated;
    });

    showToast(`Request #${targetId} marked as ${nextStatus.toUpperCase()} permanently!`);

    try {
      fetch(`/api/fund-requests/${targetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          processedBy: user?._id,
        }),
      }).catch(() => {});
    } catch (e) {}
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
          {r.requestId || r.id || r._id}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'Requested By',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.user || r.userId?.name || 'Partner Merchant'}</div>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '1px 6px', borderRadius: '4px' }}>
            {r.role || r.userId?.userId || 'PARTNER'}
          </span>
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
    {
      key: 'paymentMethod',
      label: 'Payment Mode',
      render: (r) => (
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          background: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-sm)',
          textTransform: 'uppercase',
        }}>
          {(r.paymentMethod || 'bank_wire').replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'utrNumber',
      label: 'UTR / Ref No.',
      render: (r) => (
        <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
          {r.utrNumber || 'N/A'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date & Time',
      render: (r) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {r.createdAt ? new Date(r.createdAt).toLocaleString('en-IN') : 'Just now'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => {
        const isApproved = r.status === 'approved';
        const isRejected = r.status === 'rejected';
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            background: isApproved ? 'rgba(16, 185, 129, 0.12)' : isRejected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: isApproved ? '#059669' : isRejected ? '#DC2626' : '#D97706',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isApproved ? '#10B981' : isRejected ? '#EF4444' : '#F59E0B' }} />
            {r.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => {
        const rowKey = row.id || row._id || row.requestId;
        return row.status === 'pending' ? (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'nowrap', minWidth: 'max-content' }}>
            <button
              className="btn btn-sm btn-success"
              style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={() => handleAction(rowKey, 'approve')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Approve &amp; Credit
            </button>
            <button
              className="btn btn-sm btn-danger"
              style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={() => handleAction(rowKey, 'reject')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Reject
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>
            {row.status === 'approved' ? 'Credited' : 'Rejected'}
          </span>
        );
      },
    },
  ];

  // Dynamic live calculations from requests state
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const totalVolume = requests.reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <>
      {/* Toast Banner */}
      {toastMessage && (
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
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            MERCHANT BANK DEPOSIT VERIFICATION
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Fund Deposit Requests
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Verify bank wire UTR numbers and approve instant wallet load requests across the partner network.
          </p>
        </div>
      </div>

      {/* Date Range Preset Selector Bar */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        marginBottom: '24px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginRight: '6px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Request Date Range:
          </span>

          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: '7days', label: 'Last 7 Days' },
            { id: 'month', label: 'This Month' },
            { id: 'custom', label: 'Custom Range' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setDateRangePreset(preset.id)}
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: dateRangePreset === preset.id ? '#2563EB' : 'var(--border-color)',
                background: dateRangePreset === preset.id ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                color: dateRangePreset === preset.id ? '#2563EB' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {dateRangePreset === 'custom' && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>From:</span>
              <input
                type="date"
                className="form-input"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ width: '135px', padding: '4px 8px', fontSize: '0.8rem' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>To:</span>
              <input
                type="date"
                className="form-input"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{ width: '135px', padding: '4px 8px', fontSize: '0.8rem' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <DashboardCard
          icon="wallet"
          iconColor="blue"
          title="Total Deposit Volume"
          value={`₹${totalVolume.toLocaleString('en-IN')}`}
          subtext={`Filtered for ${dateRangePreset.toUpperCase()}`}
          badge="Deposit Volume"
          sparkline="0,20 10,18 20,14 30,10 40,8 50,4 60,1"
        />
        <DashboardCard
          icon="ticket"
          iconColor="orange"
          title="Pending Verification"
          value={pendingCount}
          change={pendingCount > 0 ? `${pendingCount} Action Required` : 'All Verified'}
          changeType={pendingCount > 0 ? 'negative' : 'positive'}
          badge="Pending Review"
          sparkline="0,5 10,8 20,12 30,15 40,18 50,20 60,22"
        />
        <DashboardCard
          icon="zap"
          iconColor="green"
          title="Approved &amp; Credited"
          value={approvedCount}
          change="Auto Wallet Credit"
          changeType="positive"
          badge="Cleared"
          sparkline="0,15 10,15 20,12 30,14 40,10 50,8 60,4"
        />
      </div>

      {/* Requests Directory Table */}
      <DataTable
        title={`Merchant Deposit Requests Directory (${dateRangePreset.toUpperCase()})`}
        columns={columns}
        data={requests}
        searchable={true}
      />
    </>
  );
}
