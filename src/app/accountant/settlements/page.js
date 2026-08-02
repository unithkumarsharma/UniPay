'use client';
import { useState, useEffect, useCallback } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';

export default function SettlementsPage() {
  const [dateRangePreset, setDateRangePreset] = useState('month');
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-02');
  const [allSettlements, setAllSettlements] = useState([]);
  const [filteredSettlements, setFilteredSettlements] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch ALL settlements from Supabase
  const fetchSettlements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settlements');
      const data = await res.json();
      if (data.success && Array.isArray(data.settlements)) {
        setAllSettlements(data.settlements);
      } else {
        setAllSettlements([]);
      }
    } catch (e) {
      console.error('Fetch settlements error:', e);
      setAllSettlements([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  // Filter by date preset
  useEffect(() => {
    if (allSettlements.length === 0) {
      setFilteredSettlements([]);
      return;
    }

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
        startDate = new Date(0);
        endDate = new Date();
    }

    const filtered = allSettlements.filter((s) => {
      const d = new Date(s.created_at || s.date);
      return d >= startDate && d < endDate;
    });

    setFilteredSettlements(filtered);
  }, [allSettlements, dateRangePreset, fromDate, toDate]);

  // Process single settlement — PATCH to API then re-fetch
  const handleSingleSettlement = async (targetId) => {
    setActionLoading(targetId);

    // Optimistic update
    setAllSettlements((prev) =>
      prev.map((s) => (s.id === targetId || s.settlement_id === targetId) ? { ...s, status: 'settled' } : s)
    );

    try {
      const res = await fetch('/api/settlements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settlementId: targetId, status: 'settled' }),
      });
      const data = await res.json();

      if (data.success) {
        showToast(`Settlement #${targetId} processed — saved to database!`);
      } else {
        showToast(`Error: ${data.error || 'Settlement update failed'}`);
      }
    } catch (e) {
      console.error('Settlement PATCH error:', e);
      showToast(`Network error: ${e.message}`);
    }

    await fetchSettlements();
    setActionLoading(null);
  };

  // Process all pending settlements in batch
  const handleProcessBatch = async () => {
    const pendingItems = filteredSettlements.filter((s) => s.status === 'pending');
    if (pendingItems.length === 0) {
      showToast('No pending settlements to process.');
      return;
    }

    // Optimistic update
    setAllSettlements((prev) =>
      prev.map((s) => {
        const isPending = pendingItems.some((p) => p.id === s.id);
        return isPending ? { ...s, status: 'settled' } : s;
      })
    );

    // PATCH each one
    for (const item of pendingItems) {
      try {
        await fetch('/api/settlements', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settlementId: item.id, status: 'settled' }),
        });
      } catch (e) {
        console.error('Batch settlement error:', e);
      }
    }

    showToast(`${pendingItems.length} settlements processed — saved to database!`);
    await fetchSettlements();
  };

  const columns = [
    {
      key: 'id',
      label: 'Settlement ID',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 700,
          color: '#2563EB',
          background: 'rgba(37, 99, 235, 0.08)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-md)',
        }}>
          {r.settlement_id || r.id}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'Partner Merchant',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.user_name || r.user || 'Partner'}</div>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '1px 6px', borderRadius: '4px' }}>
            {r.user_role || r.role || 'PARTNER'} {r.user_code ? `(${r.user_code})` : ''}
          </span>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Settlement Amount (₹)',
      render: (r) => (
        <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.95rem' }}>
          ₹{(Number(r.amount) || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'bankName',
      label: 'Bank Account Details',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{r.bank_name || r.bankName || 'N/A'}</div>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {r.account_no || r.accountNo || '—'} | {r.ifsc || '—'}
          </span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Batch Date',
      render: (r) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {(r.created_at || r.date) ? new Date(r.created_at || r.date).toLocaleString('en-IN') : 'N/A'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => {
        const isSettled = r.status === 'settled';
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            background: isSettled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: isSettled ? '#059669' : '#D97706',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isSettled ? '#10B981' : '#F59E0B' }} />
            {isSettled ? 'Settled' : 'Pending Batch'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Action',
      render: (row) => {
        const rowKey = row.id || row.settlement_id;
        const isProcessing = actionLoading === rowKey;
        return row.status === 'pending' ? (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'nowrap', minWidth: 'max-content' }}>
            <button
              className="btn btn-sm btn-success"
              disabled={isProcessing}
              style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px', opacity: isProcessing ? 0.6 : 1 }}
              onClick={() => handleSingleSettlement(rowKey)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {isProcessing ? 'Processing...' : 'Process Payout'}
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>Dispatched</span>
        );
      },
    },
  ];

  // Dynamic live calculations
  const pendingAmount = filteredSettlements
    .filter((s) => s.status === 'pending')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const settledAmount = filteredSettlements
    .filter((s) => s.status === 'settled')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            SUPABASE DATABASE • COMMISSION PAYOUT &amp; BANK SETTLEMENT DESK
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Commission Settlements &amp; Bank Payouts
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Process partner commission payouts, execute batch NEFT/IMPS bank settlements, and audit bank references from Supabase Database.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleProcessBatch}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Process All Pending Settlements
        </button>
      </div>

      {/* Date Range Preset Selector Bar */}
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
            Settlement Period:
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
          icon="commission"
          iconColor="purple"
          title="Pending Settlement Pool"
          value={`₹${pendingAmount.toLocaleString('en-IN')}`}
          subtext={`Filtered for ${dateRangePreset.toUpperCase()}`}
          badge="Pending Pool"
          sparkline="0,18 10,14 20,16 30,12 40,9 50,6 60,3"
        />
        <DashboardCard
          icon="wallet"
          iconColor="green"
          title="Settled Amount"
          value={`₹${settledAmount.toLocaleString('en-IN')}`}
          change={`${filteredSettlements.filter(s => s.status === 'settled').length} batches cleared`}
          changeType="positive"
          badge="Escrow Dispatched"
          sparkline="0,20 10,18 20,15 30,12 40,8 50,5 60,2"
        />
        <DashboardCard
          icon="zap"
          iconColor="blue"
          title="Total Period Batches"
          value={`${filteredSettlements.length}`}
          subtext="Filtered Record Count"
          badge="Audit Count"
          sparkline="0,15 10,15 20,10 30,10 40,5 50,5 60,5"
        />
      </div>

      {/* Loading indicator */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Loading settlements from Supabase Database...
        </div>
      )}

      {/* Settlement Directory Table */}
      <DataTable
        title={`Merchant Payout Batches (${dateRangePreset.toUpperCase()}) — ${filteredSettlements.length} records`}
        columns={columns}
        data={filteredSettlements}
        searchable={true}
      />
    </>
  );
}
