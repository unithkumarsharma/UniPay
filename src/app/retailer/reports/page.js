'use client';
import { useState, useMemo } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';

const MOCK_RETAILER_PERIODS = {
  today: {
    todayComm: '₹156',
    monthComm: '₹156',
    totalComm: '₹28,450',
    data: [
      { id: 'TXN882910', type: 'Mobile Prepaid 5G', amount: 299, commission: '11.96', status: 'success', time: '14:30 Today' },
      { id: 'TXN772615', type: 'DTH Premium HD', amount: 500, commission: '20.00', status: 'success', time: '12:15 Today' },
    ],
  },
  yesterday: {
    todayComm: '₹210',
    monthComm: '₹366',
    totalComm: '₹28,450',
    data: [
      { id: 'TXN551920', type: 'DMT Instant Transfer', amount: 5000, commission: '25.00', status: 'success', time: '18:45 Yesterday' },
      { id: 'TXN441092', type: 'AEPS Cash Withdrawal', amount: 3000, commission: '15.00', status: 'success', time: '15:20 Yesterday' },
    ],
  },
  '7days': {
    todayComm: '₹1,120',
    monthComm: '₹1,120',
    totalComm: '₹28,450',
    data: [
      { id: 'TXN882910', type: 'Mobile Prepaid 5G', amount: 299, commission: '11.96', status: 'success', time: 'Aug 02, 14:30' },
      { id: 'TXN772615', type: 'DTH Premium HD', amount: 500, commission: '20.00', status: 'success', time: 'Aug 02, 12:15' },
      { id: 'TXN551920', type: 'DMT Instant Transfer', amount: 5000, commission: '25.00', status: 'success', time: 'Aug 01, 18:45' },
      { id: 'TXN441092', type: 'AEPS Cash Withdrawal', amount: 3000, commission: '15.00', status: 'success', time: 'Aug 01, 15:20' },
    ],
  },
  month: {
    todayComm: '₹156',
    monthComm: '₹4,230',
    totalComm: '₹28,450',
    data: [
      { id: 'TXN882910', type: 'Mobile Prepaid 5G', amount: 299, commission: '11.96', status: 'success', time: 'Aug 02, 14:30' },
      { id: 'TXN772615', type: 'DTH Premium HD', amount: 500, commission: '20.00', status: 'success', time: 'Aug 02, 12:15' },
      { id: 'TXN551920', type: 'DMT Instant Transfer', amount: 5000, commission: '25.00', status: 'success', time: 'Aug 01, 18:45' },
      { id: 'TXN441092', type: 'AEPS Cash Withdrawal', amount: 3000, commission: '15.00', status: 'success', time: 'Aug 01, 15:20' },
    ],
  },
  custom: {
    todayComm: '₹540',
    monthComm: '₹540',
    totalComm: '₹28,450',
    data: [
      { id: 'TXN882910', type: 'Mobile Prepaid 5G', amount: 299, commission: '11.96', status: 'success', time: 'Aug 02, 14:30' },
      { id: 'TXN772615', type: 'DTH Premium HD', amount: 500, commission: '20.00', status: 'success', time: 'Aug 02, 12:15' },
    ],
  },
};

export default function RetailerReportsPage() {
  const [dateRangePreset, setDateRangePreset] = useState('month'); // 'today' | 'yesterday' | '7days' | 'month' | 'custom'
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-02');

  const currentDataset = useMemo(() => {
    return MOCK_RETAILER_PERIODS[dateRangePreset] || MOCK_RETAILER_PERIODS.month;
  }, [dateRangePreset]);

  const columns = [
    {
      key: 'id',
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
          {r.id}
        </span>
      ),
    },
    { key: 'type', label: 'Service Category' },
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
          ₹{r.commission}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => {
        const isSuccess = r.status === 'success';
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            background: isSuccess ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: isSuccess ? '#059669' : '#DC2626',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isSuccess ? '#10B981' : '#EF4444' }} />
            {r.status}
          </span>
        );
      },
    },
    { key: 'time', label: 'Time' },
  ];

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          RETAILER COMMISSION &amp; EARNINGS ANALYTICS
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Reports &amp; Earnings Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Track daily transaction commissions, recharge margins, and commission payouts.
        </p>
      </div>

      {/* Date Preset Filter Bar */}
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
            Select Date Horizon:
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

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <DashboardCard
          icon="commission"
          iconColor="green"
          title="Period Commission"
          value={currentDataset.todayComm}
          change={`Filtered for ${dateRangePreset.toUpperCase()}`}
          changeType="positive"
          badge={dateRangePreset.toUpperCase()}
          sparkline="0,20 10,18 20,15 30,12 40,8 50,5 60,2"
        />
        <DashboardCard
          icon="reports"
          iconColor="blue"
          title="Period Earning Accumulation"
          value={currentDataset.monthComm}
          change="+12% growth"
          changeType="positive"
          badge="Accumulated"
          sparkline="0,22 10,19 20,15 30,12 40,9 50,6 60,3"
        />
        <DashboardCard
          icon="wallet"
          iconColor="purple"
          title="All-Time Commission Earned"
          value={currentDataset.totalComm}
          subtext="Total Lifetime Earnings"
          badge="Lifetime Total"
          sparkline="0,15 10,15 20,12 30,14 40,10 50,8 60,4"
        />
      </div>

      {/* Table */}
      <DataTable
        title={`My Detailed Commission History (${dateRangePreset.toUpperCase()})`}
        columns={columns}
        data={currentDataset.data}
        searchable={true}
      />
    </>
  );
}
