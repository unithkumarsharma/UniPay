'use client';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { recentTransactions } from '@/data/mockData';

const columns = [
  { key: 'id', label: 'Txn ID' },
  { key: 'type', label: 'Type' },
  { key: 'user', label: 'User' },
  { key: 'amount', label: 'Amount' },
  { key: 'commission', label: 'My Margin' },
  { key: 'status', label: 'Status' },
  { key: 'time', label: 'Time' },
];

export default function MDDashboard() {
  return (
    <>
      <div className="page-header">
        <h1>Master Distributor Dashboard</h1>
        <p>Your distribution network overview</p>
      </div>

      {/* Wallet Card */}
      <div className="wallet-card mb-lg">
        <div className="wallet-label">Available Balance</div>
        <div className="wallet-balance">₹2,50,000</div>
        <div className="wallet-actions">
          <button className="wallet-btn">Add Funds</button>
          <button className="wallet-btn">Transfer</button>
        </div>
      </div>

      <div className="stats-grid">
        <DashboardCard icon="🏪" iconColor="blue" title="My Distributors" value="8" change="+2 this month" changeType="positive" />
        <DashboardCard icon="💳" iconColor="green" title="Today's Transactions" value="456" change="+12% vs yesterday" changeType="positive" />
        <DashboardCard icon="💎" iconColor="purple" title="Today's Margin" value="₹3,450" change="From all transactions" />
        <DashboardCard icon="📈" iconColor="orange" title="Monthly Earning" value="₹85,600" change="+18% growth" changeType="positive" />
      </div>

      <DataTable title="Recent Transactions" columns={columns} data={recentTransactions.slice(0, 5)} />
    </>
  );
}
