'use client';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { recentTransactions } from '@/data/mockData';

const columns = [
  { key: 'id', label: 'Txn ID' },
  { key: 'type', label: 'Type' },
  { key: 'user', label: 'User' },
  { key: 'amount', label: 'Amount' },
  { key: 'commission', label: 'Commission' },
  { key: 'status', label: 'Status' },
  { key: 'time', label: 'Time' },
];

export default function AdminReportsPage() {
  return (
    <>
      <div className="page-header">
        <h1>Reports</h1>
        <p>View detailed reports and analytics</p>
      </div>

      <div className="stats-grid">
        <DashboardCard icon="📊" iconColor="blue" title="Total Transactions" value="45,230" change="+12% this month" changeType="positive" />
        <DashboardCard icon="💰" iconColor="green" title="Total Revenue" value="₹18,45,000" change="+8% this month" changeType="positive" />
        <DashboardCard icon="💎" iconColor="purple" title="Commission Paid" value="₹2,34,500" change="To all levels" />
        <DashboardCard icon="📈" iconColor="orange" title="Net Profit" value="₹5,67,800" change="+22% this month" changeType="positive" />
      </div>

      <div className="flex gap-sm mb-lg">
        <select className="form-select" style={{ maxWidth: 180 }}>
          <option>Today</option>
          <option>Yesterday</option>
          <option>Last 7 Days</option>
          <option>This Month</option>
          <option>Last Month</option>
          <option>Custom Range</option>
        </select>
        <select className="form-select" style={{ maxWidth: 180 }}>
          <option>All Services</option>
          <option>Mobile Recharge</option>
          <option>DTH Recharge</option>
          <option>Bill Payment</option>
          <option>Money Transfer</option>
        </select>
        <button className="btn btn-primary btn-sm">Export CSV</button>
      </div>

      <DataTable title="Transaction Report" columns={columns} data={recentTransactions} />
    </>
  );
}
