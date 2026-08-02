'use client';
import { useState, useMemo } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';

const MOCK_REPORTS_PERIODS = {
  today: {
    earning: '₹850',
    volume: '18 txns',
    change: '+8% vs yesterday',
    data: [
      { id: 'TXN882910', type: 'Mobile Prepaid 5G', amount: 299, commission: '11.96', status: 'success', time: '14:30 Today' },
      { id: 'TXN772615', type: 'DTH Premium HD', amount: 500, commission: '20.00', status: 'success', time: '12:15 Today' },
      { id: 'TXN661520', type: 'Electricity Bill BBPS', amount: 2450, commission: '18.00', status: 'success', time: '10:05 Today' },
    ],
  },
  yesterday: {
    earning: '₹1,200',
    volume: '28 txns',
    change: '+5% growth',
    data: [
      { id: 'TXN551920', type: 'DMT Instant Transfer', amount: 5000, commission: '25.00', status: 'success', time: '18:45 Yesterday' },
      { id: 'TXN441092', type: 'AEPS Cash Withdrawal', amount: 3000, commission: '15.00', status: 'success', time: '15:20 Yesterday' },
    ],
  },
  '7days': {
    earning: '₹6,800',
    volume: '195 txns',
    change: '+12% weekly avg',
    data: [
      { id: 'TXN882910', type: 'Mobile Prepaid 5G', amount: 299, commission: '11.96', status: 'success', time: 'Aug 02, 14:30' },
      { id: 'TXN772615', type: 'DTH Premium HD', amount: 500, commission: '20.00', status: 'success', time: 'Aug 02, 12:15' },
      { id: 'TXN551920', type: 'DMT Instant Transfer', amount: 5000, commission: '25.00', status: 'success', time: 'Aug 01, 18:45' },
      { id: 'TXN441092', type: 'AEPS Cash Withdrawal', amount: 3000, commission: '15.00', status: 'success', time: 'Aug 01, 15:20' },
      { id: 'TXN330911', type: 'Gas Bill Payment', amount: 1100, commission: '8.50', status: 'success', time: 'Jul 29, 11:10' },
    ],
  },
  month: {
    earning: '₹24,500',
    volume: '890 txns',
    change: '+14% growth',
    data: [
      { id: 'TXN882910', type: 'Mobile Prepaid 5G', amount: 299, commission: '11.96', status: 'success', time: 'Aug 02, 14:30' },
      { id: 'TXN772615', type: 'DTH Premium HD', amount: 500, commission: '20.00', status: 'success', time: 'Aug 02, 12:15' },
      { id: 'TXN551920', type: 'DMT Instant Transfer', amount: 5000, commission: '25.00', status: 'success', time: 'Aug 01, 18:45' },
      { id: 'TXN441092', type: 'AEPS Cash Withdrawal', amount: 3000, commission: '15.00', status: 'success', time: 'Aug 01, 15:20' },
    ],
  },
  custom: {
    earning: '₹3,400',
    volume: '92 txns',
    change: 'Custom Range Audit',
    data: [
      { id: 'TXN882910', type: 'Mobile Prepaid 5G', amount: 299, commission: '11.96', status: 'success', time: 'Aug 02, 14:30' },
      { id: 'TXN772615', type: 'DTH Premium HD', amount: 500, commission: '20.00', status: 'success', time: 'Aug 02, 12:15' },
    ],
  },
};

export default function DistReportsPage() {
  const [dateRangePreset, setDateRangePreset] = useState('month'); // 'today' | 'yesterday' | '7days' | 'month' | 'custom'
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-02');

  const currentDataset = useMemo(() => {
    return MOCK_REPORTS_PERIODS[dateRangePreset] || MOCK_REPORTS_PERIODS.month;
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
          DISTRIBUTOR REVENUE &amp; MARGIN AUDIT
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Distributor Earnings Reports
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Track retailer network volumes, earned override margins, and daily transaction ledgers.
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
          title="Distributor Commission Margin"
          value={currentDataset.earning}
          change={currentDataset.change}
          changeType="positive"
          badge={dateRangePreset.toUpperCase()}
          sparkline="0,20 10,18 20,15 30,12 40,8 50,5 60,2"
        />
        <DashboardCard
          icon="reports"
          iconColor="blue"
          title="Retailer Network Volume"
          value={currentDataset.volume}
          subtext={`Filtered for ${dateRangePreset.toUpperCase()}`}
          badge="Volume Stream"
          sparkline="0,22 10,19 20,15 30,12 40,9 50,6 60,3"
        />
      </div>

      {/* Table */}
      <DataTable
        title={`Distributor Network Transaction History (${dateRangePreset.toUpperCase()})`}
        columns={columns}
        data={currentDataset.data}
        searchable={true}
      />
    </>
  );
}
