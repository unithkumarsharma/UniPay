'use client';
import { useAuth } from '@/context/AuthContext';
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
  const { user } = useAuth();

  return (
    <>
      <div className="page-header">
        <h1>Distributor Dashboard</h1>
        <p>Manage your retailers and track earnings</p>
      </div>

      <div className="wallet-card mb-lg">
        <div className="wallet-label">Available Balance</div>
        <div className="wallet-balance">₹{(user?.walletBalance ?? user?.wallet_balance ?? 50000).toLocaleString('en-IN')}</div>
        <div className="wallet-actions">
          <button className="wallet-btn" onClick={() => window.location.href = '/distributor/fund-request'}>Request Funds</button>
          <button className="wallet-btn" onClick={() => window.location.href = '/distributor/wallet'}>Transfer to Retailer</button>
        </div>
      </div>

      <div className="stats-grid">
        <DashboardCard icon="🛒" iconColor="blue" title="My Retailers" value="2" change="Active Roster" changeType="positive" />
        <DashboardCard icon="💳" iconColor="green" title="Today's Transactions" value="0" change="0% vs yesterday" changeType="positive" />
        <DashboardCard icon="💎" iconColor="purple" title="Today's Margin" value="₹0.00" change="From retailer txns" />
        <DashboardCard icon="📈" iconColor="orange" title="Monthly Earning" value="₹0.00" change="0% growth" changeType="positive" />
      </div>

      <DataTable title="Recent Transactions" columns={columns} data={recentTransactions.slice(0, 5)} />
    </>
  );
}
