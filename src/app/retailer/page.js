'use client';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { recentTransactions } from '@/data/mockData';
import { serviceCategories } from '@/data/services';

const quickServices = serviceCategories[0].services.concat(serviceCategories[1].services.slice(0, 3));

const txnColumns = [
  { key: 'id', label: 'Txn ID' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'commission', label: 'Commission' },
  { key: 'status', label: 'Status' },
  { key: 'time', label: 'Time' },
];

export default function RetailerDashboard() {
  return (
    <>
      <div className="page-header">
        <h1>Retailer Dashboard</h1>
        <p>Welcome! Start serving your customers.</p>
      </div>

      <div className="wallet-card mb-lg">
        <div className="wallet-label">Available Balance</div>
        <div className="wallet-balance">₹12,500</div>
        <div className="wallet-actions">
          <button className="wallet-btn">Request Funds</button>
          <button className="wallet-btn">View Statement</button>
        </div>
      </div>

      <div className="stats-grid">
        <DashboardCard icon="💳" iconColor="blue" title="Today's Transactions" value="24" change="+4 vs yesterday" changeType="positive" />
        <DashboardCard icon="💰" iconColor="green" title="Today's Earning" value="₹156" change="Commission earned" />
        <DashboardCard icon="📈" iconColor="purple" title="Monthly Earning" value="₹4,230" change="+12% growth" changeType="positive" />
        <DashboardCard icon="📊" iconColor="orange" title="Success Rate" value="98.2%" change="Last 30 days" changeType="positive" />
      </div>

      {/* Quick Services */}
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 14, color: 'var(--text-primary)' }}>
        Quick Services
      </h3>
      <div className="services-grid">
        {quickServices.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <div className="service-name">{service.name}</div>
          </div>
        ))}
      </div>

      <DataTable title="Recent Transactions" columns={txnColumns} data={recentTransactions.slice(0, 5)} />
    </>
  );
}
