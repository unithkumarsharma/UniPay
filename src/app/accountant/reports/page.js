'use client';
import { useState } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { recentTransactions as initialTransactions } from '@/data/mockData';

export default function AccountantReportsPage() {
  const [chartMetric, setChartMetric] = useState('revenue');

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
      label: 'Commission Paid',
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
            background: isSuccess ? 'rgba(16, 185, 129, 0.12)' : isPending ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: isSuccess ? '#059669' : isPending ? '#D97706' : '#DC2626',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isSuccess ? '#10B981' : isPending ? '#F59E0B' : '#EF4444' }} />
            {r.status}
          </span>
        );
      },
    },
    { key: 'time', label: 'Timestamp' },
  ];

  const handleExportPDF = () => {
    alert('Exporting Financial Audit Statement PDF...');
  };

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            REVENUE AUDIT &amp; PROFITABILITY ANALYTICS
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Financial Audit Reports
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Monthly profit/loss summaries, expense auditing, and outstanding merchant receivables.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleExportPDF}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Download PDF Audit
        </button>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <DashboardCard
          icon="reports"
          iconColor="blue"
          title="Monthly Gross Revenue"
          value="₹18,45,000"
          change="+15% vs last month"
          changeType="positive"
          badge="Gross Turnover"
          sparkline="0,20 10,15 20,18 30,12 40,8 50,5 60,2"
        />
        <DashboardCard
          icon="zap"
          iconColor="green"
          title="Monthly Operating Expenses"
          value="₹12,30,000"
          subtext="API Switch + Commissions"
          badge="Total Outflow"
          sparkline="0,10 10,12 20,14 30,16 40,18 50,15 60,12"
        />
        <DashboardCard
          icon="wallet"
          iconColor="orange"
          title="Net Profit Realized"
          value="₹6,15,000"
          change="+22% profit yield"
          changeType="positive"
          badge="Net Margin"
          sparkline="0,24 10,19 20,15 30,11 40,7 50,3 60,1"
        />
        <DashboardCard
          icon="ticket"
          iconColor="red"
          title="Outstanding Receivables"
          value="₹85,000"
          change="8 Accounts Pending"
          changeType="negative"
          badge="Receivables Queue"
          sparkline="0,5 10,8 20,12 30,15 40,18 50,20 60,22"
        />
      </div>

      {/* Graphical Financial Curve */}
      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }} className="glow-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Financial Profit &amp; Expense Realization Curve
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Monthly financial yield performance comparison.
            </p>
          </div>

          <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
            <button
              onClick={() => setChartMetric('revenue')}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: chartMetric === 'revenue' ? '#2563EB' : 'transparent',
                color: chartMetric === 'revenue' ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Revenue
            </button>
            <button
              onClick={() => setChartMetric('profit')}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: chartMetric === 'profit' ? '#10B981' : 'transparent',
                color: chartMetric === 'profit' ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Net Margin
            </button>
          </div>
        </div>

        <div style={{ width: '100%', height: '180px', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 500 180" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="accRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="accProfGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line x1="0" y1="40" x2="500" y2="40" stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.6" />
            <line x1="0" y1="90" x2="500" y2="90" stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.6" />
            <line x1="0" y1="140" x2="500" y2="140" stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.6" />

            <path
              d={chartMetric === 'revenue' ? 'M 10,140 L 100,120 L 190,70 L 280,45 L 370,60 L 460,25 L 460,170 L 10,170 Z' : 'M 10,155 L 100,140 L 190,95 L 280,70 L 370,85 L 460,50 L 460,170 L 10,170 Z'}
              fill={chartMetric === 'revenue' ? 'url(#accRevGrad)' : 'url(#accProfGrad)'}
            />
            <polyline
              fill="none"
              stroke={chartMetric === 'revenue' ? '#2563EB' : '#10B981'}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="10,140 100,120 190,70 280,45 370,60 460,25"
            />
          </svg>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>
      </div>

      {/* Transaction Summary Table */}
      <DataTable
        title="Audited Transaction Ledger Summary"
        columns={columns}
        data={initialTransactions}
        searchable={true}
      />
    </>
  );
}
