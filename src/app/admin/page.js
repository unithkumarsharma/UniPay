'use client';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { adminStats, recentTransactions } from '@/data/mockData';

const txnColumns = [
  { key: 'id', label: 'Txn ID' },
  { key: 'type', label: 'Type' },
  { key: 'user', label: 'User' },
  { key: 'amount', label: 'Amount' },
  { key: 'commission', label: 'Commission' },
  { key: 'status', label: 'Status' },
  { key: 'time', label: 'Time' },
];

export default function AdminDashboard() {
  return (
    <>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here&apos;s your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <DashboardCard
          icon="👥"
          iconColor="blue"
          title="Total Users"
          value={adminStats.totalUsers.toLocaleString()}
          change="+12% this month"
          changeType="positive"
        />
        <DashboardCard
          icon="💳"
          iconColor="green"
          title="Today's Transactions"
          value={adminStats.todayTransactions.toLocaleString()}
          change="+8% vs yesterday"
          changeType="positive"
        />
        <DashboardCard
          icon="💰"
          iconColor="orange"
          title="Today's Revenue"
          value={`₹${adminStats.todayRevenue.toLocaleString('en-IN')}`}
          change="+15% vs yesterday"
          changeType="positive"
        />
        <DashboardCard
          icon="⚡"
          iconColor="purple"
          title="Active Services"
          value={adminStats.activeServices}
          change="2 new this week"
          changeType="positive"
        />
      </div>

      {/* Second row stats */}
      <div className="stats-grid">
        <DashboardCard
          icon="🏛️"
          iconColor="blue"
          title="Master Distributors"
          value={adminStats.totalMDs}
        />
        <DashboardCard
          icon="🏪"
          iconColor="green"
          title="Distributors"
          value={adminStats.totalDistributors}
        />
        <DashboardCard
          icon="🛒"
          iconColor="orange"
          title="Retailers"
          value={adminStats.totalRetailers.toLocaleString()}
        />
        <DashboardCard
          icon="📋"
          iconColor="red"
          title="Pending Complaints"
          value={adminStats.pendingComplaints}
          change="5 new today"
          changeType="negative"
        />
      </div>

      {/* Recent Transactions */}
      <DataTable
        title="Recent Transactions"
        columns={txnColumns}
        data={recentTransactions}
        actions={
          <button className="btn btn-secondary btn-sm">View All →</button>
        }
      />
    </>
  );
}
