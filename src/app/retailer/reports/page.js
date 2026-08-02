'use client';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { recentTransactions } from '@/data/mockData';

const columns = [
  { key: 'id', label: 'Txn ID' },
  { key: 'type', label: 'Service' },
  { key: 'amount', label: 'Amount' },
  { key: 'commission', label: 'Commission' },
  { key: 'status', label: 'Status' },
  { key: 'time', label: 'Time' },
];

export default function RetailerReportsPage() {
  return (
    <>
      <div className="page-header"><h1>Reports &amp; Earnings</h1><p>Track your commission earnings</p></div>
      <div className="stats-grid">
        <DashboardCard icon="💰" iconColor="green" title="Today's Commission" value="₹156" change="24 transactions" changeType="positive" />
        <DashboardCard icon="📈" iconColor="blue" title="This Month" value="₹4,230" change="+12% vs last month" changeType="positive" />
        <DashboardCard icon="📊" iconColor="purple" title="Total Earned" value="₹28,450" change="All time" />
      </div>
      <DataTable title="Commission Details" columns={columns} data={recentTransactions} />
    </>
  );
}
