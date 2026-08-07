'use client';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import DataTable from '@/components/DataTable';

export default function RetailerTransactionsPage() {
  const { user } = useAuth();
  const [liveTransactions, setLiveTransactions] = useState([]);
  const [dateRangePreset, setDateRangePreset] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Reset state to fresh default 'all' whenever page mounts
  useEffect(() => {
    setDateRangePreset('all');
    setFromDate('');
    setToDate('');
  }, []);

  useEffect(() => {
    async function fetchTxns() {
      try {
        const uId = user?.id || user?.userId || 'rtl001_fallback';
        const res = await fetch(`/api/transactions?userId=${uId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.transactions)) {
          setLiveTransactions(data.transactions);
        }
      } catch (e) {}
    }
    fetchTxns();
  }, [user]);

  const currentDataset = useMemo(() => {
    if (dateRangePreset === 'all') return liveTransactions;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let startDate, endDate;
    switch (dateRangePreset) {
      case 'today':
        startDate = startOfToday;
        endDate = new Date(startOfToday.getTime() + 86400000);
        break;
      case 'yesterday':
        startDate = new Date(startOfToday.getTime() - 86400000);
        endDate = startOfToday;
        break;
      case '7days':
        startDate = new Date(startOfToday.getTime() - 7 * 86400000);
        endDate = new Date(startOfToday.getTime() + 86400000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(startOfToday.getTime() + 86400000);
        break;
      case 'custom':
        startDate = fromDate ? new Date(fromDate) : new Date(0);
        endDate = toDate ? new Date(new Date(toDate).getTime() + 86400000) : new Date();
        break;
      default:
        return liveTransactions;
    }

    return liveTransactions.filter((r) => {
      if (!r.created_at && !r.date) return true;
      const d = new Date(r.created_at || r.date);
      return d >= startDate && d < endDate;
    });
  }, [liveTransactions, dateRangePreset, fromDate, toDate]);

  const columns = [
    {
      key: 'txnId',
      label: 'Txn ID',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 700,
          color: '#2563EB',
          background: 'rgba(37, 99, 235, 0.08)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-md)',
        }}>
          {r.txnId || r.id}
        </span>
      ),
    },
    { key: 'type', label: 'Service Category', render: (r) => r.type || 'Mobile Recharge' },
    {
      key: 'amount',
      label: 'Amount (₹)',
      render: (r) => (
        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
          ₹{(r.amount || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'commission',
      label: 'Commission Earned',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 700,
          color: '#10B981',
          background: 'rgba(16, 185, 129, 0.08)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-md)',
        }}>
          +₹{r.commission || 0}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.72rem',
          fontWeight: 700,
          background: 'rgba(16, 185, 129, 0.12)',
          color: '#059669',
          textTransform: 'uppercase',
        }}>
          SUCCESS
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date & Time',
      render: (r) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {r.date || (r.created_at ? new Date(r.created_at).toLocaleString('en-IN') : 'Just now')}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
          REALTIME DB PASSBOOK • LIVE TRANSACTIONS LOG
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          My Transaction History &amp; Passbook
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Audit all your successful recharges, BBPS payments, DMT transfers, and AEPS withdrawals.
        </p>
      </div>

      {/* Date Filter Bar */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Filter Date:</span>
          {['all', 'today', 'yesterday', '7days', 'month'].map((p) => (
            <button
              key={p}
              onClick={() => setDateRangePreset(p)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: dateRangePreset === p ? 'var(--primary)' : 'var(--bg-secondary)',
                color: dateRangePreset === p ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {p === 'all' ? 'All Time' : p === 'today' ? 'Today' : p === 'yesterday' ? 'Yesterday' : p === '7days' ? 'Last 7 Days' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        title="Transaction Records"
        columns={columns}
        data={currentDataset}
        searchable
        searchField="txnId"
      />
    </>
  );
}
