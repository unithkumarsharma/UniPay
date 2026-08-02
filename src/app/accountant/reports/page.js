'use client';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { recentTransactions } from '@/data/mockData';

const columns = [
  { key: 'id', label: 'Txn ID' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'commission', label: 'Commission' },
  { key: 'status', label: 'Status' },
  { key: 'time', label: 'Time' },
];

export default function AccountantReportsPage() {
  return (
    <>
      <div className="page-header">
        <h1>Financial Reports</h1>
        <p>Detailed financial analytics and summaries</p>
      </div>

      <div className="stats-grid">
        <DashboardCard icon="📊" iconColor="blue" title="Monthly Revenue" value="₹18,45,000" change="+15% vs last month" changeType="positive" />
        <DashboardCard icon="💸" iconColor="green" title="Monthly Expenses" value="₹12,30,000" change="API + Commissions" />
        <DashboardCard icon="📈" iconColor="orange" title="Net Profit" value="₹6,15,000" change="+22% growth" changeType="positive" />
        <DashboardCard icon="🏦" iconColor="purple" title="Outstanding" value="₹85,000" change="From 8 users" changeType="negative" />
      </div>

      <DataTable title="Transaction Summary" columns={columns} data={recentTransactions} />
    </>
  );
}
