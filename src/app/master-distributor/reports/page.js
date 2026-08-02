'use client';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { recentTransactions } from '@/data/mockData';

const columns = [
  { key: 'id', label: 'Txn ID' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'commission', label: 'My Margin' },
  { key: 'status', label: 'Status' },
  { key: 'time', label: 'Time' },
];

export default function MDReportsPage() {
  return (
    <>
      <div className="page-header">
        <h1>Reports</h1>
        <p>View your earning and transaction reports</p>
      </div>

      <div className="stats-grid">
        <DashboardCard icon="💰" iconColor="green" title="This Month Earning" value="₹85,600" change="+18% growth" changeType="positive" />
        <DashboardCard icon="💳" iconColor="blue" title="Total Transactions" value="2,340" change="This month" />
        <DashboardCard icon="📊" iconColor="purple" title="Avg Daily Earning" value="₹2,850" />
      </div>

      <DataTable title="Transaction History" columns={columns} data={recentTransactions} />
    </>
  );
}
