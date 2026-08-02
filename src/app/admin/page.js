'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import { adminStats, recentTransactions } from '@/data/mockData';

const txnColumns = [
  { key: 'id', label: 'Txn ID' },
  { key: 'type', label: 'Service Category' },
  { key: 'user', label: 'Merchant / User' },
  { key: 'amount', label: 'Volume (₹)' },
  { key: 'commission', label: 'Margin (₹)' },
  { key: 'status', label: 'Status' },
  { key: 'time', label: 'Timestamp' },
];

const chartDataSets = {
  '24h': {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    volumePoints: '10,140 90,130 170,85 250,40 330,65 410,20 490,30',
    volumePath: 'M 10,140 L 90,130 L 170,85 L 250,40 L 330,65 L 410,20 L 490,30 L 490,170 L 10,170 Z',
    marginPath: 'M 10,155 L 90,145 L 170,110 L 250,75 L 330,95 L 410,55 L 490,65 L 490,170 L 10,170 Z',
    totalVolume: '₹45,20,850',
    totalRevenue: '₹1,35,620',
    peak: '₹7,80,000 / hr',
    efficiency: '99.98%',
  },
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    volumePoints: '10,130 90,100 170,110 250,55 330,45 410,70 490,25',
    volumePath: 'M 10,130 L 90,100 L 170,110 L 250,55 L 330,45 L 410,70 L 490,25 L 490,170 L 10,170 Z',
    marginPath: 'M 10,145 L 90,120 L 170,130 L 250,85 L 330,75 L 410,95 L 490,60 L 490,170 L 10,170 Z',
    totalVolume: '₹2,93,85,000',
    totalRevenue: '₹8,81,500',
    peak: '₹48,50,000 / day',
    efficiency: '99.99%',
  },
  '30d': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    volumePoints: '10,140 170,90 330,50 490,15',
    volumePath: 'M 10,140 L 170,90 L 330,50 L 490,15 L 490,170 L 10,170 Z',
    marginPath: 'M 10,155 L 170,115 L 330,80 L 490,40 L 490,170 L 10,170 Z',
    totalVolume: '₹11,75,40,000',
    totalRevenue: '₹35,26,200',
    peak: '₹3,10,00,000 / wk',
    efficiency: '99.97%',
  },
  '1y': {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    volumePoints: '10,150 170,110 330,60 490,10',
    volumePath: 'M 10,150 L 170,110 L 330,60 L 490,10 L 490,170 L 10,170 Z',
    marginPath: 'M 10,160 L 170,130 L 330,85 L 490,30 L 490,170 L 10,170 Z',
    totalVolume: '₹141,00,00,000',
    totalRevenue: '₹4,23,00,000',
    peak: '₹38,00,00,000 / qtr',
    efficiency: '99.99%',
  },
};

export default function AdminDashboard() {
  const [chartRange, setChartRange] = useState('7d');
  const [chartMetric, setChartMetric] = useState('volume'); // 'volume' | 'revenue'
  const [isStreaming, setIsStreaming] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // null | 'topup' | 'merchant' | 'broadcast'
  const [modalSuccessMsg, setModalSuccessMsg] = useState('');

  // Interactive Health Latency state
  const [healthPings, setHealthPings] = useState({
    recharge: 16,
    bbps: 28,
    dmt: 12,
    aeps: 54,
  });

  // Simulated Audit Log Stream
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, text: 'NPCI BBPS switch ping returned 28ms status OK', time: 'Just now', type: 'system' },
    { id: 2, text: 'Auto-reconciliation approved for UTR #987654321 (₹20,000)', time: '2 mins ago', type: 'financial' },
    { id: 3, text: 'New Retail Merchant onboarding request received from Jaipur', time: '5 mins ago', type: 'user' },
    { id: 4, text: 'IMPS Money Transfer switch operating at 100% success rate', time: '10 mins ago', type: 'system' },
  ]);

  // Simulated WebSocket Live Data Stream
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const randomLogTypes = ['system', 'financial', 'user'];
      const randomLogs = [
        { text: 'AEPS biometric transaction auto-settled for RTL001', type: 'financial' },
        { text: 'Prepaid API Switch latency optimized (14ms response)', type: 'system' },
        { text: 'New Merchant KYC verified from Delhi Zone', type: 'user' },
        { text: 'Bank Reserve Pool auto-synced with Escrow Account', type: 'financial' },
      ];
      const selected = randomLogs[Math.floor(Math.random() * randomLogs.length)];
      setAuditLogs(prev => [
        { id: Date.now(), text: selected.text, time: 'Just now', type: selected.type },
        ...prev.slice(0, 5),
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const handlePingTest = () => {
    setHealthPings({
      recharge: Math.floor(Math.random() * 12) + 10,
      bbps: Math.floor(Math.random() * 20) + 18,
      dmt: Math.floor(Math.random() * 8) + 8,
      aeps: Math.floor(Math.random() * 25) + 40,
    });
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    setModalSuccessMsg('Action completed successfully!');
    setTimeout(() => {
      setModalSuccessMsg('');
      setActiveModal(null);
    }, 1200);
  };

  const activeChart = chartDataSets[chartRange];

  const filterTabs = [
    { key: 'ALL', label: 'All Logs', count: recentTransactions.length },
    { key: 'success', label: 'Success', count: recentTransactions.filter(t => t.status === 'success').length },
    { key: 'pending', label: 'Pending', count: recentTransactions.filter(t => t.status === 'pending').length },
    { key: 'failed', label: 'Failed', count: recentTransactions.filter(t => t.status === 'failed').length },
  ];

  return (
    <>
      {/* ===== NEXT-GEN EXECUTIVE HERO HEADER ===== */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '5px 14px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <span className="status-dot-pulse"></span>
            FINTECH COMMAND CENTER | 99.99% SYSTEM UPTIME
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Executive Admin Control Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Real-time financial settlement, multi-gateway health, and automated margin analytics.
          </p>
        </div>

        {/* Live Streaming Toggle & Quick Modal Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: isStreaming ? 'var(--primary-light)' : 'var(--bg-card)',
              color: isStreaming ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: isStreaming ? '#10B981' : '#94A3B8' }} />
            {isStreaming ? 'Live Stream: ACTIVE' : 'Stream: PAUSED'}
          </button>

          <button onClick={() => setActiveModal('topup')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>➕</span> Fund Top-Up
          </button>
          <button onClick={() => setActiveModal('merchant')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>👤</span> Onboard Merchant
          </button>
          <button onClick={() => setActiveModal('broadcast')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📢</span> Alert Broadcast
          </button>
        </div>
      </div>

      {/* ===== FINTECH HERO MESH GRADIENT BANNER ===== */}
      <div className="mesh-gradient-hero" style={{
        borderRadius: 'var(--radius-xl)',
        padding: '30px 36px',
        marginBottom: '28px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '24px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>Total Escrow Reserve Pool</span>
            <div style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px', letterSpacing: '-0.03em' }}>₹1,24,50,000</div>
            <span style={{ fontSize: '0.76rem', background: 'var(--success-light)', color: 'var(--success)', padding: '3px 10px', borderRadius: 'var(--radius-full)', marginTop: '8px', display: 'inline-block', fontWeight: 700 }}>
              🔒 Bank Escrow Lock Active
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>Today&apos;s Gross Settlement</span>
            <div style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--primary)', marginTop: '4px', letterSpacing: '-0.03em' }}>₹45,20,850</div>
            <span style={{ fontSize: '0.76rem', color: 'var(--success)', fontWeight: 700 }}>↑ +18.4% vs yesterday</span>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>Admin Net Revenue Margin</span>
            <div style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--accent)', marginTop: '4px', letterSpacing: '-0.03em' }}>₹1,35,620</div>
            <span style={{ fontSize: '0.76rem', color: 'var(--success)', fontWeight: 700 }}>⚡ Auto-Commission Split</span>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>Active Merchant Outlets</span>
            <div style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px', letterSpacing: '-0.03em' }}>102,450</div>
            <span style={{ fontSize: '0.76rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 'var(--radius-full)', marginTop: '8px', display: 'inline-block', fontWeight: 700 }}>
              🌐 All-India Active
            </span>
          </div>
        </div>
      </div>

      {/* ===== INTERACTIVE FINANCIAL ANALYTICS CHART WIDGET ===== */}
      <div className="chart-container" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Financial Growth &amp; Margin Analytics
              </h2>
              {/* Metric Switcher Pills */}
              <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
                <button
                  onClick={() => setChartMetric('volume')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: chartMetric === 'volume' ? 'var(--primary)' : 'transparent',
                    color: chartMetric === 'volume' ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  Gross Volume
                </button>
                <button
                  onClick={() => setChartMetric('revenue')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: chartMetric === 'revenue' ? 'var(--accent)' : 'transparent',
                    color: chartMetric === 'revenue' ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  Net Margin
                </button>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Real-time transaction volume curve and net platform earnings.
            </p>
          </div>

          {/* Time Range Filter Buttons */}
          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
            {[
              { id: '24h', label: '24 Hours' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '1y', label: '1 Year' },
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setChartRange(range.id)}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: chartRange === range.id ? 'var(--bg-card)' : 'transparent',
                  color: chartRange === range.id ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: chartRange === range.id ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Key Figures Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', padding: '14px 18px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Period Total Volume</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{activeChart.totalVolume}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Period Net Revenue</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>{activeChart.totalRevenue}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Peak Throughput</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{activeChart.peak}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Switch Efficiency</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success)' }}>{activeChart.efficiency}</div>
          </div>
        </div>

        {/* Interactive SVG Area Chart Visualization */}
        <div style={{ width: '100%', height: '200px', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 500 180" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="marginGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Background Lines */}
            <line x1="0" y1="40" x2="500" y2="40" stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.6" />
            <line x1="0" y1="85" x2="500" y2="85" stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.6" />
            <line x1="0" y1="130" x2="500" y2="130" stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.6" />

            {/* Area Path Fill */}
            <path
              d={chartMetric === 'volume' ? activeChart.volumePath : activeChart.marginPath}
              fill={chartMetric === 'volume' ? 'url(#volumeGrad)' : 'url(#marginGrad)'}
            />

            {/* Polyline Curve */}
            <polyline
              fill="none"
              stroke={chartMetric === 'volume' ? '#2563EB' : '#10B981'}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={activeChart.volumePoints}
            />
          </svg>

          {/* Chart X-Axis Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
            {activeChart.labels.map((label, idx) => (
              <span key={idx}>{label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== PRIMARY STATS GRID WITH SPARKLINES ===== */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📊</span> Network Core KPIs
        </h2>
        <div className="stats-grid">
          <DashboardCard
            icon="users"
            iconColor="blue"
            title="Total Registered Accounts"
            value={adminStats.totalUsers.toLocaleString()}
            change="+12% this month"
            changeType="positive"
            badge="Verified KYC"
            sparkline="0,20 10,15 20,18 30,12 40,8 50,14 60,4"
          />
          <DashboardCard
            icon="lightning"
            iconColor="green"
            title="Today's Transactions"
            value={adminStats.todayTransactions.toLocaleString()}
            change="+8.4% growth"
            changeType="positive"
            badge="Live Switch"
            sparkline="0,22 10,18 20,12 30,14 40,8 50,6 60,2"
          />
          <DashboardCard
            icon="wallet"
            iconColor="orange"
            title="Today's Margin Revenue"
            value={`₹${adminStats.todayRevenue.toLocaleString('en-IN')}`}
            change="+15.2% yield"
            changeType="positive"
            badge="Net Income"
            sparkline="0,24 10,20 20,16 30,12 40,10 50,6 60,3"
          />
          <DashboardCard
            icon="services"
            iconColor="purple"
            title="Active Operational Services"
            value={`${adminStats.activeServices} Services`}
            change="30+ BBPS Operators"
            changeType="positive"
            badge="100% Online"
            sparkline="0,15 10,15 20,10 30,10 40,5 50,5 60,5"
          />
        </div>
      </div>

      {/* ===== NETWORK HIERARCHY DISTRIBUTION ===== */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <DashboardCard
          icon="masterDistributor"
          iconColor="blue"
          title="Master Distributors (MD)"
          value={adminStats.totalMDs}
          subtext="Zone Partners"
          badge="Tier 1"
          sparkline="0,18 10,16 20,12 30,14 40,10 50,8 60,4"
        />
        <DashboardCard
          icon="distributor"
          iconColor="green"
          title="Distributors (DST)"
          value={adminStats.totalDistributors}
          subtext="City Partners"
          badge="Tier 2"
          sparkline="0,20 10,18 20,14 30,10 40,8 50,6 60,2"
        />
        <DashboardCard
          icon="retailer"
          iconColor="orange"
          title="Retail Merchants (RTL)"
          value={adminStats.totalRetailers.toLocaleString()}
          subtext="Ground Counters"
          badge="Tier 3"
          sparkline="0,22 10,19 20,15 30,11 40,7 50,5 60,1"
        />
        <DashboardCard
          icon="ticket"
          iconColor="red"
          title="Dispute Complaints"
          value={adminStats.pendingComplaints}
          change="-4 resolved"
          changeType="negative"
          badge="Support Queue"
          sparkline="0,5 10,8 20,12 30,15 40,18 50,20 60,22"
        />
      </div>

      {/* ===== SYSTEM GATEWAY SWITCH, VOLUME & AUDIT FEED ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>

        {/* 1. GATEWAY & API LATENCY MONITOR */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }} className="glow-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🟢</span> Live Gateway Switch Latency
            </h3>
            <button
              onClick={handlePingTest}
              style={{
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              🔄 Refresh Ping
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>📱 Mobile Recharge Switch</span>
                <span style={{ color: 'var(--success)' }}>99.98% ({healthPings.recharge}ms)</span>
              </div>
              <div style={{ width: '100%', height: 7, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '99.98%', height: '100%', background: 'var(--success)', borderRadius: 4 }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>💡 BBPS Electricity &amp; Utility</span>
                <span style={{ color: 'var(--success)' }}>99.92% ({healthPings.bbps}ms)</span>
              </div>
              <div style={{ width: '100%', height: 7, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '99.92%', height: '100%', background: 'var(--success)', borderRadius: 4 }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>🏦 Money Transfer IMPS</span>
                <span style={{ color: 'var(--success)' }}>100.00% ({healthPings.dmt}ms)</span>
              </div>
              <div style={{ width: '100%', height: 7, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--success)', borderRadius: 4 }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>🏧 AEPS Aadhaar Biometric ATM</span>
                <span style={{ color: 'var(--warning)' }}>98.50% ({healthPings.aeps}ms)</span>
              </div>
              <div style={{ width: '100%', height: 7, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '98.5%', height: '100%', background: 'var(--warning)', borderRadius: 4 }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. REAL-TIME AUDIT STREAM FEED */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }} className="glow-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📜</span> Live System Audit Log Feed
            </h3>
            <span style={{ fontSize: '0.72rem', background: isStreaming ? 'var(--success-light)' : 'var(--bg-secondary)', color: isStreaming ? 'var(--success)' : 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              {isStreaming ? '⚡ Live Ticker' : 'Paused'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '210px', overflowY: 'auto' }}>
            {auditLogs.map((log) => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', animation: 'fadeIn 0.3s ease' }}>
                <span style={{ fontSize: '0.95rem' }}>
                  {log.type === 'financial' ? '💵' : log.type === 'system' ? '⚙️' : log.type === 'user' ? '👤' : '🛡️'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.3 }}>{log.text}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '2px', display: 'block' }}>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ===== SYSTEM TRANSACTION LEDGER TABLE ===== */}
      <DataTable
        title="Live System Transaction Ledger"
        columns={txnColumns}
        data={recentTransactions}
        searchable={true}
        filterTabs={filterTabs}
        actions={
          <Link href="/admin/reports" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Full Audit Logs →
          </Link>
        }
      />

      {/* ===== INTERACTIVE QUICK MODALS ===== */}

      {/* 1. Fund Top-up Modal */}
      {activeModal === 'topup' && (
        <Modal title="➕ Master Fund Top-up" onClose={() => setActiveModal(null)}>
          {modalSuccessMsg ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--success)', fontWeight: 700 }}>
              ✅ {modalSuccessMsg}
            </div>
          ) : (
            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label className="form-label">Select Partner Account</label>
                <select className="form-select" required>
                  <option value="">Choose Master Distributor / Distributor...</option>
                  <option value="MD001">MD001 - Vikram Singh (Delhi)</option>
                  <option value="MD002">MD002 - Raj Patel (Mumbai)</option>
                  <option value="DST001">DST001 - Ankit Kumar (Noida)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Top-Up Amount (₹)</label>
                <input type="number" className="form-input" placeholder="e.g. 50000" min="100" required />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select className="form-select">
                  <option>Bank Wire / RTGS</option>
                  <option>UPI Settlement</option>
                  <option>Escrow Direct Credit</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Process Top-Up</button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* 2. Onboard Merchant Modal */}
      {activeModal === 'merchant' && (
        <Modal title="👤 Quick Partner Onboarding" onClose={() => setActiveModal(null)}>
          {modalSuccessMsg ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--success)', fontWeight: 700 }}>
              ✅ {modalSuccessMsg}
            </div>
          ) : (
            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label className="form-label">Partner Tier</label>
                <select className="form-select" required>
                  <option value="MD">Master Distributor (MD)</option>
                  <option value="DST">Distributor (DST)</option>
                  <option value="RTL">Retail Merchant (RTL)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="Merchant full name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" placeholder="10-digit mobile number" required />
              </div>
              <div className="form-group">
                <label className="form-label">City / State</label>
                <input type="text" className="form-input" placeholder="Location e.g. Jaipur, RJ" required />
              </div>
              <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Merchant Account</button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* 3. Broadcast Alert Modal */}
      {activeModal === 'broadcast' && (
        <Modal title="📢 System Alert Broadcast" onClose={() => setActiveModal(null)}>
          {modalSuccessMsg ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--success)', fontWeight: 700 }}>
              ✅ {modalSuccessMsg}
            </div>
          ) : (
            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label className="form-label">Notice Headline</label>
                <input type="text" className="form-input" placeholder="e.g. Scheduled Bank Maintenance Notice" required />
              </div>
              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <select className="form-select">
                  <option>All Network Merchants (MD + DST + RTL)</option>
                  <option>Master Distributors Only</option>
                  <option>Retailers Only</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message Details</label>
                <textarea className="form-input" rows="3" placeholder="Enter broadcast announcement message..." required />
              </div>
              <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Broadcast Notice</button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
