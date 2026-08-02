'use client';
import DashboardCard from '@/components/DashboardCard';

export default function SettlementsPage() {
  return (
    <>
      <div className="page-header">
        <h1>Settlements</h1>
        <p>Process commission settlements and payouts</p>
      </div>

      <div className="stats-grid">
        <DashboardCard icon="💎" iconColor="purple" title="Pending Settlements" value="₹45,000" change="12 users" />
        <DashboardCard icon="✅" iconColor="green" title="Settled This Month" value="₹2,34,500" change="89 transactions" changeType="positive" />
        <DashboardCard icon="📅" iconColor="blue" title="Next Settlement" value="Aug 5" change="Auto-scheduled" />
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Pending Payouts</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Commission settlements are processed weekly. Next batch will be processed on Aug 5, 2024.
        </p>
        <button className="btn btn-primary mt-md">Process All Settlements</button>
      </div>
    </>
  );
}
