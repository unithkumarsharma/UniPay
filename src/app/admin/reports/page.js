'use client';
import { useState } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { recentTransactions as initialTransactions } from '@/data/mockData';

// Multi-color SVG service icons for table & analytics
const serviceIcons = {
  'Mobile Recharge': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  'Electricity Bill': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  'DTH Recharge': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </svg>
  ),
  'Money Transfer': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  'Gas Bill': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" />
    </svg>
  ),
  'Water Bill': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  'PAN Card': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="7" y1="8" x2="17" y2="8" />
      <line x1="7" y1="12" x2="13" y2="12" />
    </svg>
  ),
};

const financialDatasets = {
  Today: {
    labels: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    grossVolume: '₹0',
    netProfit: '₹0',
    commissionPaid: '₹0',
    avgTxnValue: '₹0',
    volPoints: '10,160 100,160 190,160 280,160 370,160 460,160',
    volPath: 'M 10,160 L 460,160 L 460,170 L 10,170 Z',
    profitPath: 'M 10,160 L 460,160 L 460,170 L 10,170 Z',
  },
  Yesterday: {
    labels: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    grossVolume: '₹0',
    netProfit: '₹0',
    commissionPaid: '₹0',
    avgTxnValue: '₹0',
    volPoints: '10,160 100,160 190,160 280,160 370,160 460,160',
    volPath: 'M 10,160 L 460,160 L 460,170 L 10,170 Z',
    profitPath: 'M 10,160 L 460,160 L 460,170 L 10,170 Z',
  },
  'Last 7 Days': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    grossVolume: '₹0',
    netProfit: '₹0',
    commissionPaid: '₹0',
    avgTxnValue: '₹0',
    volPoints: '10,160 490,160',
    volPath: 'M 10,160 L 490,160 L 490,170 L 10,170 Z',
    profitPath: 'M 10,160 L 490,160 L 490,170 L 10,170 Z',
  },
  'This Month': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    grossVolume: '₹0',
    netProfit: '₹0',
    commissionPaid: '₹0',
    avgTxnValue: '₹0',
    volPoints: '10,160 490,160',
    volPath: 'M 10,160 L 490,160 L 490,170 L 10,170 Z',
    profitPath: 'M 10,160 L 490,160 L 490,170 L 10,170 Z',
  },
  'Custom Range': {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
    grossVolume: '₹0',
    netProfit: '₹0',
    commissionPaid: '₹0',
    avgTxnValue: '₹0',
    volPoints: '10,160 480,160',
    volPath: 'M 10,160 L 480,160 L 480,170 L 10,170 Z',
    profitPath: 'M 10,160 L 480,160 L 480,170 L 10,170 Z',
  },
};

const categoryDatasets = {
  Today: [
    { name: 'Mobile & DTH Recharge', percent: 38, amount: '₹7,01,100', color: '#2563EB' },
    { name: 'Money Transfer (DMT)', percent: 28, amount: '₹5,16,600', color: '#10B981' },
    { name: 'BBPS Electricity & Gas', percent: 18, amount: '₹3,32,100', color: '#F59E0B' },
    { name: 'AEPS Cash Withdrawal', percent: 12, amount: '₹2,21,400', color: '#8B5CF6' },
    { name: 'PAN Card & Utility Cards', percent: 4, amount: '₹73,800', color: '#EF4444' },
  ],
  Yesterday: [
    { name: 'Mobile & DTH Recharge', percent: 35, amount: '₹5,88,000', color: '#2563EB' },
    { name: 'Money Transfer (DMT)', percent: 30, amount: '₹5,04,000', color: '#10B981' },
    { name: 'BBPS Electricity & Gas', percent: 20, amount: '₹3,36,000', color: '#F59E0B' },
    { name: 'AEPS Cash Withdrawal', percent: 10, amount: '₹1,68,000', color: '#8B5CF6' },
    { name: 'PAN Card & Utility Cards', percent: 5, amount: '₹84,000', color: '#EF4444' },
  ],
  'Last 7 Days': [
    { name: 'Mobile & DTH Recharge', percent: 40, amount: '₹49,80,000', color: '#2563EB' },
    { name: 'Money Transfer (DMT)', percent: 26, amount: '₹32,37,000', color: '#10B981' },
    { name: 'BBPS Electricity & Gas', percent: 16, amount: '₹19,92,000', color: '#F59E0B' },
    { name: 'AEPS Cash Withdrawal', percent: 13, amount: '₹16,18,500', color: '#8B5CF6' },
    { name: 'PAN Card & Utility Cards', percent: 5, amount: '₹6,22,500', color: '#EF4444' },
  ],
  'This Month': [
    { name: 'Mobile & DTH Recharge', percent: 36, amount: '₹1,84,32,000', color: '#2563EB' },
    { name: 'Money Transfer (DMT)', percent: 29, amount: '₹1,48,48,000', color: '#10B981' },
    { name: 'BBPS Electricity & Gas', percent: 19, amount: '₹97,28,000', color: '#F59E0B' },
    { name: 'AEPS Cash Withdrawal', percent: 11, amount: '₹56,32,000', color: '#8B5CF6' },
    { name: 'PAN Card & Utility Cards', percent: 5, amount: '₹25,60,000', color: '#EF4444' },
  ],
  'Custom Range': [
    { name: 'Mobile & DTH Recharge', percent: 42, amount: '₹17,68,200', color: '#2563EB' },
    { name: 'Money Transfer (DMT)', percent: 25, amount: '₹10,52,500', color: '#10B981' },
    { name: 'BBPS Electricity & Gas', percent: 17, amount: '₹7,15,700', color: '#F59E0B' },
    { name: 'AEPS Cash Withdrawal', percent: 11, amount: '₹4,63,100', color: '#8B5CF6' },
    { name: 'PAN Card & Utility Cards', percent: 5, amount: '₹2,10,500', color: '#EF4444' },
  ],
};

export default function AdminReportsPage() {
  const [datePreset, setDatePreset] = useState('Today');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [appliedCustomLabel, setAppliedCustomLabel] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [chartMetric, setChartMetric] = useState('gross'); // 'gross' | 'profit'
  const [dbTxns, setDbTxns] = useState([]);

  // Reset state to fresh default 'Today' whenever page mounts
  useEffect(() => {
    setDatePreset('Today');
    setIsCustomMode(false);
    setFromDate('');
    setToDate('');
    setServiceFilter('All Services');
  }, []);

  useEffect(() => {
    async function fetchTxns() {
      try {
        const res = await fetch('/api/transactions');
        const data = await res.json();
        if (data.success && Array.isArray(data.transactions)) {
          setDbTxns(data.transactions);
        }
      } catch (e) {}
    }
    fetchTxns();
  }, []);

  const activeDataset = isCustomMode
    ? financialDatasets['Custom Range']
    : (financialDatasets[datePreset] || financialDatasets.Today);

  const activeCategoryBreakdown = isCustomMode
    ? categoryDatasets['Custom Range']
    : (categoryDatasets[datePreset] || categoryDatasets.Today);

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
    {
      key: 'type',
      label: 'Service Category',
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '6px',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {serviceIcons[r.type] || serviceIcons['Mobile Recharge']}
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.type}</span>
        </div>
      ),
    },
    { key: 'user', label: 'Merchant Outlet' },
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

  const handleDatePresetChange = (val) => {
    setDatePreset(val);
    if (val === 'Custom Range') {
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
      setAppliedCustomLabel('');
    }
  };

  const handleApplyCustomRange = (e) => {
    e.preventDefault();
    if (!fromDate || !toDate) {
      alert('Please select both From Date and To Date');
      return;
    }
    setIsCustomMode(true);
    setAppliedCustomLabel(`Range: ${fromDate} to ${toDate}`);
  };

  const handleClearCustomRange = () => {
    setIsCustomMode(false);
    setDatePreset('Today');
    setAppliedCustomLabel('');
  };

  const handleExportCSV = () => {
    alert(`Exporting Audit Ledger Report for [${isCustomMode ? `${fromDate} to ${toDate}` : datePreset}] to CSV...`);
  };

  const handleExportPDF = () => {
    alert(`Generating Official Financial Audit Statement PDF for [${isCustomMode ? `${fromDate} to ${toDate}` : datePreset}]...`);
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
            FINANCIAL AUDIT &amp; TAX LEDGER
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Reports &amp; Business Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Comprehensive revenue breakdown, net margin analytics, custom date range filtering, and live transaction ledgers.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleExportPDF}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Download PDF Audit
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleExportCSV}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV Report
          </button>
        </div>
      </div>

      {/* ===== CUSTOM DATE RANGE & FILTER CONTROL BAR ===== */}
      <div style={{ background: 'var(--bg-card)', padding: '20px 24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', marginBottom: '28px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: isCustomMode ? '16px' : '0' }}>
          
          {/* Quick Date Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Time Period:
            </span>

            <select
              className="form-select"
              value={datePreset}
              onChange={(e) => handleDatePresetChange(e.target.value)}
              style={{ width: '180px', fontSize: '0.85rem', fontWeight: 600 }}
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="This Month">This Month</option>
              <option value="Custom Range">📅 Custom Date Range...</option>
            </select>

            <select
              className="form-select"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              style={{ width: '180px', fontSize: '0.85rem', fontWeight: 600 }}
            >
              <option value="All Services">All Services</option>
              <option value="Mobile Recharge">Mobile Recharge</option>
              <option value="DTH Recharge">DTH Recharge</option>
              <option value="Electricity Bill">Electricity Bill</option>
              <option value="Money Transfer">Money Transfer</option>
              <option value="PAN Card">PAN Card</option>
            </select>
          </div>

          {/* Active Range Pill */}
          {appliedCustomLabel && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700 }}>
              <span>📅 {appliedCustomLabel}</span>
              <button onClick={handleClearCustomRange} style={{ border: 'none', background: 'none', color: '#059669', cursor: 'pointer', fontWeight: 800, padding: 0 }}>✕</button>
            </div>
          )}
        </div>

        {/* CUSTOM DATE RANGE PICKER INPUTS BAR */}
        {datePreset === 'Custom Range' && (
          <form onSubmit={handleApplyCustomRange} style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>From Date:</label>
              <input
                type="date"
                className="form-input"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ width: '150px', fontSize: '0.82rem', padding: '6px 10px' }}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>To Date:</label>
              <input
                type="date"
                className="form-input"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{ width: '150px', fontSize: '0.82rem', padding: '6px 10px' }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Filter Revenue &amp; Audit
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleClearCustomRange}
            >
              Reset Filter
            </button>
          </form>
        )}
      </div>

      {/* Primary Financial KPI Cards Grid */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <DashboardCard
          icon="reports"
          iconColor="blue"
          title="Total Transactions"
          value="45,230"
          change="+12% this month"
          changeType="positive"
          badge="Network Volume"
          sparkline="0,20 10,15 20,18 30,12 40,8 50,5 60,2"
        />
        <DashboardCard
          icon="wallet"
          iconColor="green"
          title="Total Revenue Volume"
          value={activeDataset.grossVolume}
          change="+8.4% growth"
          changeType="positive"
          badge="Gross Revenue"
          sparkline="0,22 10,18 20,14 30,10 40,6 50,4 60,1"
        />
        <DashboardCard
          icon="commission"
          iconColor="purple"
          title="Commission Distributed"
          value={activeDataset.commissionPaid}
          change="Distributed across all tiers"
          badge="Payout Pool"
          sparkline="0,18 10,14 20,16 30,12 40,9 50,6 60,3"
        />
        <DashboardCard
          icon="zap"
          iconColor="orange"
          title="Net Admin Profit"
          value={activeDataset.netProfit}
          change="+22% margin yield"
          changeType="positive"
          badge="Net Margin"
          sparkline="0,24 10,19 20,15 30,11 40,7 50,3 60,1"
        />
      </div>

      {/* Graphical Financial Analytics & Distribution Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* 1. GRAPHICAL FINANCIAL CURVE CHART */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }} className="glow-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                Revenue &amp; Profit Yield Curve
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Real-time volume curve vs net margin realization.
              </p>
            </div>

            {/* Metric Switcher */}
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
              <button
                onClick={() => setChartMetric('gross')}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: chartMetric === 'gross' ? '#2563EB' : 'transparent',
                  color: chartMetric === 'gross' ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Gross Revenue
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

          {/* SVG Financial Area Chart */}
          <div style={{ width: '100%', height: '180px', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 500 180" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="40" x2="500" y2="40" stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.6" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.6" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.6" />

              <path
                d={chartMetric === 'gross' ? activeDataset.volPath : activeDataset.profitPath}
                fill={chartMetric === 'gross' ? 'url(#grossGrad)' : 'url(#netGrad)'}
              />
              <polyline
                fill="none"
                stroke={chartMetric === 'gross' ? '#2563EB' : '#10B981'}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={activeDataset.volPoints}
              />
            </svg>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
              {activeDataset.labels.map((lbl, idx) => (
                <span key={idx}>{lbl}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 2. SERVICE CATEGORY FINANCIAL BREAKDOWN METER */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }} className="glow-card">
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
              Category Financial Volume Breakdown
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Proportional distribution of gross transaction volume across services ({isCustomMode ? 'Custom Range' : datePreset}).
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeCategoryBreakdown.map((cat, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                    {cat.name}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                    {cat.amount} ({cat.percent}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${cat.percent}%`, height: '100%', background: cat.color, borderRadius: 3, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Transaction Audit Ledger Table */}
      <DataTable
        title={`Transaction Audit Ledger (${isCustomMode ? 'Custom Date Range' : datePreset})`}
        columns={columns}
        data={initialTransactions}
        searchable={true}
      />
    </>
  );
}
