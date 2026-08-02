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

export default function DistReportsPage() {
  return (
    <>
      <div className="page-header"><h1>Reports</h1><p>View your earnings and transaction reports</p></div>
      <div className="stats-grid">
        <DashboardCard icon="💰" iconColor="green" title="Monthly Earning" value="₹24,500" change="+14% growth" changeType="positive" />
        <DashboardCard icon="💳" iconColor="blue" title="Total Transactions" value="890" change="This month" />
      </div>
      <DataTable title="Transaction History" columns={columns} data={recentTransactions} />
    </>
  );
}
