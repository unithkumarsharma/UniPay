'use client';
import { useState, useEffect, useMemo } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';

export default function DistributorReportsPage() {
  const [dateRangePreset, setDateRangePreset] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [rawTxns, setRawTxns] = useState([]);

  // Reset state to fresh default 'all' whenever page mounts
  useEffect(() => {
    setDateRangePreset('all');
    setFromDate('');
    setToDate('');
  }, []);

  useEffect(() => {
    async function fetchTxns() {
      try {
        const res = await fetch('/api/transactions');
        const data = await res.json();
        if (data.success && Array.isArray(data.transactions)) {
          setRawTxns(data.transactions);
        }
      } catch (e) {}
    }
    fetchTxns();
  }, []);

  const filteredTxns = useMemo(() => {
    if (dateRangePreset === 'all') return rawTxns;

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
        return rawTxns;
    }

    return rawTxns.filter((r) => {
      if (!r.created_at && !r.date) return true;
      const d = new Date(r.created_at || r.date);
      return d >= startDate && d < endDate;
    });
  }, [rawTxns, dateRangePreset, fromDate, toDate]);

  const totalVolume = useMemo(() => filteredTxns.reduce((sum, r) => sum + (Number(r.amount) || 0), 0), [filteredTxns]);
  const distMargin = useMemo(() => (totalVolume * 0.01).toFixed(2), [totalVolume]);

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
    { key: 'user', label: 'Retailer', render: (r) => r.user || 'Retailer Partner' },
    { key: 'type', label: 'Service Category', render: (r) => r.type || 'Recharge' },
    {
      key: 'amount',
      label: 'Volume (₹)',
      render: (r) => (
        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
          ₹{(r.amount || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'distMargin',
      label: 'Distributor Margin',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 700,
          color: '#10B981',
          background: 'rgba(16, 185, 129, 0.08)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-md)',
        }}>
          +₹{(Number(r.amount || 0) * 0.01).toFixed(2)}
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
          SUPABASE DB • DISTRIBUTOR NETWORK PERFORMANCE
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Distributor Sales &amp; Commission Reports
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Track retailer sales volume, distributor commission overrides, and business growth.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <DashboardCard title="Retailer Network Volume" value={`₹${totalVolume.toLocaleString('en-IN')}`} subtitle="Downline Sales Volume" change="Live DB" changeType="positive" />
        <DashboardCard title="Distributor Commission" value={`₹${Number(distMargin).toLocaleString('en-IN')}`} subtitle="1.0% Cut" change="Real Time" changeType="positive" />
        <DashboardCard title="Retailer Orders" value={filteredTxns.length.toString()} subtitle="Total Transactions" change="Verified" changeType="neutral" />
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
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Filter Period:</span>
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

      <DataTable title="Retailer Transactions Log" columns={columns} data={filteredTxns} searchable searchField="txnId" />
    </>
  );
}
