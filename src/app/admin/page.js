'use client';
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

export default function AdminDashboard() {
  return (
    <>
      {/* ===== EXECUTIVE HEADER WITH SYSTEM STATUS ===== */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span>
            🔴 LIVE COMMAND CENTER | 99.99% Uptime
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>Executive Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Real-time settlement ledger, network volume, and system health.</p>
        </div>

        {/* Quick Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/admin/wallet" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>💳</span> Wallet Pool
          </Link>
          <Link href="/admin/users" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>👥</span> Partner Network
          </Link>
          <Link href="/admin/services" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚡</span> Service Control
          </Link>
        </div>
      </div>

      {/* ===== FINANCIAL OVERVIEW POOL BANNER ===== */}
      <div style={{
        background: 'var(--primary-gradient)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        color: '#FFFFFF',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>Total Bank Reserve Pool</span>
            <div style={{ fontSize: '2.1rem', fontWeight: 900, marginTop: '4px', letterSpacing: '-0.02em' }}>₹1,24,50,000</div>
            <span style={{ fontSize: '0.78rem', background: 'rgba(255, 255, 255, 0.2)', padding: '2px 8px', borderRadius: '4px', marginTop: '6px', display: 'inline-block' }}>🔒 Escrow Lock Active</span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>Today&apos;s Gross Volume</span>
            <div style={{ fontSize: '2.1rem', fontWeight: 900, marginTop: '4px', letterSpacing: '-0.02em' }}>₹45,20,850</div>
            <span style={{ fontSize: '0.78rem', color: '#6EE7B7', fontWeight: 700 }}>↑ +18.4% vs yesterday</span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>Admin Net Revenue</span>
            <div style={{ fontSize: '2.1rem', fontWeight: 900, marginTop: '4px', letterSpacing: '-0.02em' }}>₹1,35,620</div>
            <span style={{ fontSize: '0.78rem', color: '#6EE7B7', fontWeight: 700 }}>⚡ Real-time Commission</span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>System Outlets</span>
            <div style={{ fontSize: '2.1rem', fontWeight: 900, marginTop: '4px', letterSpacing: '-0.02em' }}>102,450</div>
            <span style={{ fontSize: '0.78rem', background: 'rgba(255, 255, 255, 0.2)', padding: '2px 8px', borderRadius: '4px', marginTop: '6px', display: 'inline-block' }}>🌐 All India Active</span>
          </div>
        </div>
      </div>

      {/* ===== PRIMARY STATS GRID ===== */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <DashboardCard
          icon="👥"
          iconColor="blue"
          title="Total User Accounts"
          value={adminStats.totalUsers.toLocaleString()}
          change="+12% this month"
          changeType="positive"
        />
        <DashboardCard
          icon="⚡"
          iconColor="green"
          title="Today's Transactions"
          value={adminStats.todayTransactions.toLocaleString()}
          change="+8.4% vs yesterday"
          changeType="positive"
        />
        <DashboardCard
          icon="💰"
          iconColor="orange"
          title="Today's Total Margin"
          value={`₹${adminStats.todayRevenue.toLocaleString('en-IN')}`}
          change="+15.2% vs yesterday"
          changeType="positive"
        />
        <DashboardCard
          icon="🛍️"
          iconColor="purple"
          title="Active Live Services"
          value={`${adminStats.activeServices} Services`}
          change="30+ BBPS Operators"
          changeType="positive"
        />
      </div>

      {/* ===== NETWORK DISTRIBUTION HIERARCHY ===== */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <DashboardCard
          icon="🏛️"
          iconColor="blue"
          title="Master Distributors"
          value={adminStats.totalMDs}
          change="Zone Level Partners"
        />
        <DashboardCard
          icon="🏪"
          iconColor="green"
          title="Distributors"
          value={adminStats.totalDistributors}
          change="City Level Partners"
        />
        <DashboardCard
          icon="🛒"
          iconColor="orange"
          title="Retail Merchants"
          value={adminStats.totalRetailers.toLocaleString()}
          change="Active Shop Counters"
        />
        <DashboardCard
          icon="📩"
          iconColor="red"
          title="Pending Tickets"
          value={adminStats.pendingComplaints}
          change="Fast Resolution Active"
          changeType="negative"
        />
      </div>

      {/* ===== OPERATOR SYSTEM HEALTH & QUICK ACTIONS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* System Health */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🟢</span> Gateway &amp; API Health Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '4px' }}>
                <span>📱 Prepaid Recharge Switch (Jio/Airtel/Vi)</span>
                <span style={{ color: 'var(--success)' }}>99.98%</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '99.98%', height: '100%', background: 'var(--success)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '4px' }}>
                <span>💡 BBPS Bill Payment Biller NPCI</span>
                <span style={{ color: 'var(--success)' }}>99.92%</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '99.92%', height: '100%', background: 'var(--success)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '4px' }}>
                <span>🏦 DMT Money Transfer IMPS Switch</span>
                <span style={{ color: 'var(--success)' }}>100.00%</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--success)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '4px' }}>
                <span>🏧 AEPS Aadhaar Biometric ATM</span>
                <span style={{ color: 'var(--warning)' }}>98.50%</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '98.5%', height: '100%', background: 'var(--warning)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🚀</span> Quick Command Shortcuts
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Link href="/admin/wallet" style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)' }}>
              <span>➕</span> Add Fund Top-up
            </Link>
            <Link href="/admin/users" style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)' }}>
              <span>👤</span> Add New Merchant
            </Link>
            <Link href="/admin/commission" style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)' }}>
              <span>📈</span> Set Margin Slabs
            </Link>
            <Link href="/admin/complaints" style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)' }}>
              <span>📩</span> Resolve Complaints
            </Link>
          </div>
        </div>
      </div>

      {/* ===== RECENT TRANSACTIONS LEDGER TABLE ===== */}
      <DataTable
        title="Live System Transaction Ledger"
        columns={txnColumns}
        data={recentTransactions}
        actions={
          <Link href="/admin/reports" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Full Audit Logs →
          </Link>
        }
      />
    </>
  );
}
