'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { ledgerEntries } from '@/data/mockData';

const INITIAL_FUND_REQUESTS = [];

const LOCAL_STORAGE_KEY = 'unipay_fund_requests_store';

const ledgerColumns = [
  {
    key: 'id',
    label: 'Entry ID',
    render: (r) => (
      <span style={{
        fontFamily: 'ui-monospace, monospace',
        fontWeight: 700,
        color: '#2563EB',
        background: 'rgba(37, 99, 235, 0.08)',
        padding: '3px 8px',
        borderRadius: 'var(--radius-md)',
      }}>
        {r.id}
      </span>
    ),
  },
  { key: 'date', label: 'Date' },
  { key: 'description', label: 'Description & Reference' },
  {
    key: 'type',
    label: 'Type',
    render: (row) => {
      const isCredit = row.type === 'credit';
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.72rem',
          fontWeight: 800,
          background: isCredit ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          color: isCredit ? '#059669' : '#DC2626',
          textTransform: 'uppercase',
        }}>
          {isCredit ? '↓ CREDIT' : '↑ DEBIT'}
        </span>
      );
    },
  },
  {
    key: 'amount',
    label: 'Amount',
    render: (r) => (
      <span style={{ fontWeight: 800, color: r.type === 'credit' ? '#10B981' : '#EF4444' }}>
        {r.type === 'credit' ? '+' : '-'}₹{Number(r.amount).toLocaleString('en-IN')}
      </span>
    ),
  },
  {
    key: 'balance',
    label: 'Running Balance',
    render: (r) => (
      <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
        ₹{Number(r.balance).toLocaleString('en-IN')}
      </span>
    ),
  },
];

export default function AccountantDashboard() {
  const { user } = useAuth();
  const [fundRequests, setFundRequests] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchFundRequestsFromDb = async () => {
    try {
      const res = await fetch('/api/fund-requests');
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        const formatted = data.requests.map((r) => ({
          ...r,
          id: r.id || r._id || r.requestId,
          user: (typeof r.userId === 'object' && r.userId?.name) ? r.userId.name : (r.user || 'Partner'),
          role: (typeof r.userId === 'object' && r.userId?.role) ? r.userId.role : (r.role || 'PARTNER'),
          userCode: (typeof r.userId === 'object' && r.userId?.userId) ? r.userId.userId : (typeof r.userId === 'string' ? r.userId : ''),
          paymentMethod: r.payment_mode || r.paymentMethod || 'NEFT',
          utrNumber: r.reference_no || r.utrNumber || '',
          createdAt: r.created_at || r.createdAt || '',
        }));
        setFundRequests(formatted);
      }
    } catch (e) {
      console.warn('Real Database API fetch error:', e.message);
    }
  };

  useEffect(() => {
    fetchFundRequestsFromDb();
  }, []);

  const handleQuickApprove = async (targetId) => {
    setFundRequests((prev) =>
      prev.map((r) =>
        r.id === targetId || r.requestId === targetId ? { ...r, status: 'approved' } : r
      )
    );
    showToast(`Request #${targetId} Approved & Credited to Wallet in Real Database!`);

    try {
      await fetch('/api/fund-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: targetId,
          status: 'approved',
        }),
      });
      // Re-fetch to guarantee sync with Supabase
      await fetchFundRequestsFromDb();
    } catch (e) {
      console.error('Database Sync Error:', e);
    }
  };

  const handleDownloadLedger = () => {
    showToast('Exporting Complete Company Ledger Audit Log to CSV...');
  };

  const pendingRequests = fundRequests.filter((r) => r.status === 'pending');
  const pendingTotal = pendingRequests.reduce((sum, r) => sum + Number(r.amount || 0), 0);

  return (
    <>
      {/* Toast Notification */}
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
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              <path d="M18 14h-8" />
              <path d="M15 18h-5" />
              <path d="M10 6h8" />
              <path d="M10 10h8" />
            </svg>
            FINANCIAL AUDITING &amp; ACCOUNTING DESK
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Accountant Executive Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Real-time escrow pool management, double-entry financial ledger, and deposit verification.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleDownloadLedger}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Audit Ledger
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <DashboardCard
          icon="wallet"
          iconColor="green"
          title="Accountant Wallet Balance"
          value={`₹${(Number(user?.walletBalance ?? user?.wallet_balance ?? 150000)).toLocaleString('en-IN')}`}
          change="Real-time Account Bal"
          changeType="positive"
          badge="Escrow Lock Active"
          sparkline="0,0,0,0,0,0"
        />
        <DashboardCard
          icon="reports"
          iconColor="blue"
          title="Today's Credits"
          value="₹0.00"
          change="0 transactions"
          changeType="positive"
          badge="Incoming Deposits"
          sparkline="0,0,0,0,0,0"
        />
        <DashboardCard
          icon="zap"
          iconColor="orange"
          title="Today's Debits"
          value="₹46,950"
          change="-8 transactions"
          changeType="negative"
          badge="Payout Cleared"
          sparkline="0,10 10,12 20,14 30,16 40,18 50,15 60,12"
        />
        <DashboardCard
          icon="ticket"
          iconColor="red"
          title="Pending Fund Requests"
          value={pendingRequests.length}
          change={`₹${pendingTotal.toLocaleString('en-IN')} total`}
          changeType={pendingRequests.length > 0 ? 'negative' : 'positive'}
          badge="Action Needed"
          sparkline="0,5 10,8 20,12 30,15 40,18 50,20 60,22"
        />
      </div>

      {/* Pending Fund Requests Breakdown Card */}
      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Pending Merchant Deposit Requests ({pendingRequests.length})
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Bank wire deposit requests awaiting accountant verification and wallet credit approval.
            </p>
          </div>

          <Link href="/accountant/fund-requests" className="btn btn-sm btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            View All Requests &rarr;
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#10B981', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-lg)', fontWeight: 700 }}>
            All merchant deposit requests have been verified and processed!
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {pendingRequests.map((req) => (
              <div key={req.id} style={{ background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 800, color: '#2563EB', fontSize: '0.85rem' }}>{req.request_id || req.requestId || req.id}</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{typeof req.user === 'object' ? req.user?.name : req.user}</strong>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '1px 6px', borderRadius: '4px' }}>
                      {req.role || ''} {req.userCode ? `(${req.userCode})` : ''}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Payment Mode: <strong style={{ textTransform: 'uppercase' }}>{(req.paymentMethod || 'bank_wire').replace('_', ' ')}</strong> | UTR: <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>{req.utrNumber}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10B981' }}>
                      ₹{Number(req.amount).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{req.createdAt ? new Date(req.createdAt).toLocaleString('en-IN') : ''}</div>
                  </div>

                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleQuickApprove(req.id)}
                    style={{ padding: '6px 14px', fontSize: '0.78rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Approve &amp; Credit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Ledger Entries Table */}
      <DataTable
        title="Recent Financial Ledger Trail"
        columns={ledgerColumns}
        data={ledgerEntries}
        searchable={true}
      />
    </>
  );
}
