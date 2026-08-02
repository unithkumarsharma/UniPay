'use client';
import { useState } from 'react';
import Link from 'next/link';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
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

const mockAuditLogs = [
  { id: 1, text: 'NPCI BBPS switch ping returned 32ms status OK', time: 'Just now', type: 'system' },
  { id: 2, text: 'Auto-reconciliation approved for UTR #987654321 (₹20,000)', time: '3 mins ago', type: 'financial' },
  { id: 3, text: 'New Retail Merchant onboarding request submitted from Jaipur', time: '7 mins ago', type: 'user' },
  { id: 4, text: 'IMPS Money Transfer switch operating at 100% success rate', time: '12 mins ago', type: 'system' },
  { id: 5, text: 'Commission slab updated for AEPS Cash Withdrawal by Admin', time: '25 mins ago', type: 'admin' },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('today');
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);
  const [healthPings, setHealthPings] = useState({
    recharge: 18,
    bbps: 32,
    dmt: 14,
    aeps: 65,
  });

  const handleRefreshHealth = () => {
    setIsRefreshingHealth(true);
    setTimeout(() => {
      setHealthPings({
        recharge: Math.floor(Math.random() * 15) + 12,
        bbps: Math.floor(Math.random() * 25) + 20,
        dmt: Math.floor(Math.random() * 10) + 10,
        aeps: Math.floor(Math.random() * 30) + 45,
      });
      setIsRefreshingHealth(false);
    }, 600);
  };

  // Adjust stats dynamically based on selected timeRange filter
  const multiplier = timeRange === 'today' ? 1 : timeRange === 'week' ? 6.5 : timeRange === 'month' ? 26 : 310;
  const grossVolume = (4520850 * multiplier).toLocaleString('en-IN');
  const adminRevenue = (135620 * multiplier).toLocaleString('en-IN');
  const totalTxns = Math.round(adminStats.todayTransactions * multiplier).toLocaleString('en-IN');

  const filterTabs = [
    { key: 'ALL', label: 'All Transactions', count: recentTransactions.length },
    { key: 'success', label: 'Success', count: recentTransactions.filter(t => t.status === 'success').length },
    { key: 'pending', label: 'Pending', count: recentTransactions.filter(t => t.status === 'pending').length },
    { key: 'failed', label: 'Failed', count: recentTransactions.filter(t => t.status === 'failed').length },
  ];

  return (
    <>
      {/* ===== EXECUTIVE HEADER WITH SYSTEM STATUS & RANGE SELECTOR ===== */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <span className="status-dot-pulse"></span>
            LIVE FINANCIAL COMMAND CENTER | 99.99% Uptime
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Executive Admin Command Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>Real-time settlement ledger, network volume, and system gateway health.</p>
        </div>

        {/* Header Right Actions & Time Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Time Selector Pills */}
          <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: '7 Days' },
              { id: 'month', label: '30 Days' },
              { id: 'year', label: 'YTD' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTimeRange(item.id)}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: timeRange === item.id ? 'var(--primary-gradient)' : 'transparent',
                  color: timeRange === item.id ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <Link href="/admin/wallet" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>💳</span> Fund Pool
          </Link>
          <Link href="/admin/users" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>👥</span> Network
          </Link>
        </div>
      </div>

      {/* ===== EXECUTIVE FINANCIAL RESERVE POOL BANNER ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #059669 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        color: '#FFFFFF',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        {/* Subtle Backdrop Pattern Glow */}
        <div style={{ position: 'absolute', top: '-40%', right: '-10%', width: '350px', height: '350px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '50%', blur: '40px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40%', left: '-10%', width: '300px', height: '300px', background: 'rgba(5, 150, 105, 0.2)', borderRadius: '50%', blur: '40px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>Total Bank Reserve Pool</span>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '4px', letterSpacing: '-0.02em' }}>₹1,24,50,000</div>
            <span style={{ fontSize: '0.76rem', background: 'rgba(255, 255, 255, 0.2)', padding: '3px 10px', borderRadius: 'var(--radius-full)', marginTop: '8px', display: 'inline-block', fontWeight: 600 }}>
              🔒 Escrow Reserve Active
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>Gross Network Volume ({timeRange.toUpperCase()})</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '4px', letterSpacing: '-0.02em' }}>₹{grossVolume}</div>
            <span style={{ fontSize: '0.76rem', color: '#6EE7B7', fontWeight: 700 }}>↑ +18.4% vs previous period</span>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>Admin Net Revenue ({timeRange.toUpperCase()})</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '4px', letterSpacing: '-0.02em' }}>₹{adminRevenue}</div>
            <span style={{ fontSize: '0.76rem', color: '#6EE7B7', fontWeight: 700 }}>⚡ Real-time Margin Auto-Split</span>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>Active Merchant Outlets</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '4px', letterSpacing: '-0.02em' }}>102,450</div>
            <span style={{ fontSize: '0.76rem', background: 'rgba(255, 255, 255, 0.2)', padding: '3px 10px', borderRadius: 'var(--radius-full)', marginTop: '8px', display: 'inline-block', fontWeight: 600 }}>
              🌐 28 States &amp; 8 UTs
            </span>
          </div>
        </div>
      </div>

      {/* ===== PRIMARY STATS GRID ===== */}
      <div style={{ marginBottom: '12px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📊</span> Financial &amp; Network Key Performance Indicators
        </h2>
        <div className="stats-grid" style={{ marginBottom: '24px' }}>
          <DashboardCard
            icon="👥"
            iconColor="blue"
            title="Total Registered Accounts"
            value={adminStats.totalUsers.toLocaleString()}
            change="+12% this month"
            changeType="positive"
            badge="Verified KYC"
          />
          <DashboardCard
            icon="⚡"
            iconColor="green"
            title="Transaction Volume Count"
            value={totalTxns}
            change="+8.4% growth"
            changeType="positive"
            badge="Live Switch"
          />
          <DashboardCard
            icon="💰"
            iconColor="orange"
            title="Total Net Margin Earned"
            value={`₹${adminRevenue}`}
            change="+15.2% yield"
            changeType="positive"
            badge="Net Income"
          />
          <DashboardCard
            icon="🛍️"
            iconColor="purple"
            title="Active Operational Services"
            value={`${adminStats.activeServices} Services`}
            change="30+ BBPS Operators"
            changeType="positive"
            badge="100% Available"
          />
        </div>
      </div>

      {/* ===== NETWORK HIERARCHY DISTRIBUTION ===== */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <DashboardCard
          icon="🏛️"
          iconColor="blue"
          title="Master Distributors (MD)"
          value={adminStats.totalMDs}
          subtext="Zone Level Financial Partners"
          badge="Tier 1"
        />
        <DashboardCard
          icon="🏪"
          iconColor="green"
          title="Distributors (DST)"
          value={adminStats.totalDistributors}
          subtext="City Level Operations"
          badge="Tier 2"
        />
        <DashboardCard
          icon="🛒"
          iconColor="orange"
          title="Retail Merchants (RTL)"
          value={adminStats.totalRetailers.toLocaleString()}
          subtext="Active Ground Retail Counters"
          badge="Tier 3"
        />
        <DashboardCard
          icon="📩"
          iconColor="red"
          title="Pending Dispute Tickets"
          value={adminStats.pendingComplaints}
          change="-4 tickets resolved"
          changeType="negative"
          badge="Support Queue"
        />
      </div>

      {/* ===== GATEWAY HEALTH, VOLUME BREAKDOWN & AUDIT FEED GRID ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>

        {/* 1. GATEWAY & API SWITCH HEALTH MONITOR */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }} className="glow-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🟢</span> Live Gateway Switch Health
            </h3>
            <button
              onClick={handleRefreshHealth}
              disabled={isRefreshingHealth}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ animation: isRefreshingHealth ? 'spin 0.6s linear infinite' : 'none' }}>🔄</span> Ping Test
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>📱 Prepaid Mobile Switch (Jio/Airtel/Vi)</span>
                <span style={{ color: 'var(--success)' }}>99.98% ({healthPings.recharge}ms)</span>
              </div>
              <div style={{ width: '100%', height: 7, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '99.98%', height: '100%', background: 'var(--success)', borderRadius: 4 }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>💡 BBPS Bill Payment Biller NPCI</span>
                <span style={{ color: 'var(--success)' }}>99.92% ({healthPings.bbps}ms)</span>
              </div>
              <div style={{ width: '100%', height: 7, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '99.92%', height: '100%', background: 'var(--success)', borderRadius: 4 }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>🏦 Money Transfer (DMT) IMPS Switch</span>
                <span style={{ color: 'var(--success)' }}>100.00% ({healthPings.dmt}ms)</span>
              </div>
              <div style={{ width: '100%', height: 7, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--success)', borderRadius: 4 }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>🏧 AEPS Aadhaar Biometric ATM Switch</span>
                <span style={{ color: 'var(--warning)' }}>98.50% ({healthPings.aeps}ms)</span>
              </div>
              <div style={{ width: '100%', height: 7, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '98.5%', height: '100%', background: 'var(--warning)', borderRadius: 4 }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SERVICE VOLUME DISTRIBUTION */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }} className="glow-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📈</span> Category Volume Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                <span>📱 Mobile &amp; DTH Recharge</span>
                <span style={{ fontWeight: 700 }}>42% (₹19,00,000)</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', background: '#2563EB', borderRadius: 4 }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                <span>💡 BBPS Electricity &amp; Utilities</span>
                <span style={{ fontWeight: 700 }}>28% (₹12,65,000)</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '28%', height: '100%', background: '#059669', borderRadius: 4 }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                <span>🏦 Direct Money Transfer (DMT)</span>
                <span style={{ fontWeight: 700 }}>20% (₹9,04,000)</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '20%', height: '100%', background: '#D97706', borderRadius: 4 }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                <span>🏧 AEPS Cash Withdrawal</span>
                <span style={{ fontWeight: 700 }}>10% (₹4,51,000)</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '10%', height: '100%', background: '#8B5CF6', borderRadius: 4 }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. REAL-TIME AUDIT & EVENT STREAM */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }} className="glow-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📜</span> Live System Audit Log
            </h3>
            <span style={{ fontSize: '0.72rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              Auto-sync
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto' }}>
            {mockAuditLogs.map((log) => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                <span style={{ fontSize: '0.9rem' }}>
                  {log.type === 'financial' ? '💵' : log.type === 'system' ? '⚙️' : log.type === 'user' ? '👤' : '🛡️'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.3 }}>{log.text}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '2px', display: 'block' }}>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ===== QUICK COMMAND MATRIX SHORTCUTS ===== */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🚀</span> Quick Command Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <Link href="/admin/wallet" style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-lg)', textDecoration: 'none', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease' }} className="glow-card">
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>💳</div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Add Fund Top-Up</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Credit Master Balance</div>
          </Link>

          <Link href="/admin/users" style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-lg)', textDecoration: 'none', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease' }} className="glow-card">
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>👤</div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Add Partner Merchant</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Onboard MD / DST / RTL</div>
          </Link>

          <Link href="/admin/commission" style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-lg)', textDecoration: 'none', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease' }} className="glow-card">
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>📈</div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Margin &amp; Slabs</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Configure Commissions</div>
          </Link>

          <Link href="/admin/complaints" style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-lg)', textDecoration: 'none', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease' }} className="glow-card">
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>📩</div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Dispute Resolution</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Resolve Open Tickets</div>
          </Link>

          <Link href="/admin/reports" style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-lg)', textDecoration: 'none', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease' }} className="glow-card">
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>📊</div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Audit &amp; Reports</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Download GST &amp; Ledger</div>
          </Link>

          <Link href="/admin/services" style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-lg)', textDecoration: 'none', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease' }} className="glow-card">
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>⚡</div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Service Switches</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Enable/Disable APIs</div>
          </Link>
        </div>
      </div>

      {/* ===== RECENT TRANSACTIONS LEDGER TABLE ===== */}
      <DataTable
        title="Live System Transaction Ledger"
        columns={txnColumns}
        data={recentTransactions}
        searchable={true}
        filterTabs={filterTabs}
        actions={
          <Link href="/admin/reports" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Full Ledger Logs →
          </Link>
        }
      />
    </>
  );
}
