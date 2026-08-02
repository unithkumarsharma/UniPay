'use client';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { recentTransactions } from '@/data/mockData';

const columns = [
  { key: 'id', label: 'Txn ID' },
  { key: 'type', label: 'Type' },
  { key: 'user', label: 'Retailer' },
  { key: 'amount', label: 'Amount' },
  { key: 'commission', label: 'My Margin' },
  { key: 'status', label: 'Status' },
  { key: 'time', label: 'Time' },
];

export default function DistributorDashboard() {
  return (
    <>
      <div className="page-header">
        <h1>Distributor Dashboard</h1>
        <p>Manage your retailers and track earnings</p>
      </div>

      <div className="wallet-card mb-lg">
        <div className="wallet-label">Available Balance</div>
        <div className="wallet-balance">₹75,000</div>
        <div className="wallet-actions">
          <button className="wallet-btn">Request Funds</button>
          <button className="wallet-btn">Transfer to Retailer</button>
        </div>
      </div>

      <div className="stats-grid">
        <DashboardCard icon="🛒" iconColor="blue" title="My Retailers" value="18" change="+3 this month" changeType="positive" />
        <DashboardCard icon="💳" iconColor="green" title="Today's Transactions" value="124" change="+8% vs yesterday" changeType="positive" />
        <DashboardCard icon="💎" iconColor="purple" title="Today's Margin" value="₹890" change="From retailer txns" />
        <DashboardCard icon="📈" iconColor="orange" title="Monthly Earning" value="₹24,500" change="+14% growth" changeType="positive" />
      </div>

      <DataTable title="Recent Transactions" columns={columns} data={recentTransactions.slice(0, 5)} />
    </>
  );
}
