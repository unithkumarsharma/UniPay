'use client';
import DashboardCard from '@/components/DashboardCard';

export default function DistWalletPage() {
  return (
    <>
      <div className="page-header"><h1>Wallet &amp; Transfer</h1><p>Manage balance and transfer to retailers</p></div>
      <div className="wallet-card mb-lg">
        <div className="wallet-label">Available Balance</div>
        <div className="wallet-balance">₹75,000</div>
        <div className="wallet-actions"><button className="wallet-btn">Request Funds</button><button className="wallet-btn">Transfer</button></div>
      </div>
      <div className="stats-grid">
        <DashboardCard icon="📤" iconColor="blue" title="Transferred Today" value="₹12,000" change="To 5 retailers" />
        <DashboardCard icon="📥" iconColor="green" title="Received Today" value="₹30,000" change="From MD" changeType="positive" />
      </div>
    </>
  );
}
