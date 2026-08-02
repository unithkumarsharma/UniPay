'use client';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { fundRequests, ledgerEntries } from '@/data/mockData';

const ledgerColumns = [
  { key: 'date', label: 'Date' },
  { key: 'description', label: 'Description' },
  {
    key: 'type', label: 'Type',
    render: (row) => (
      <span className={`badge ${row.type === 'credit' ? 'badge-success' : 'badge-danger'}`}>
        {row.type.toUpperCase()}
      </span>
    ),
  },
  { key: 'amount', label: 'Amount' },
  { key: 'balance', label: 'Running Balance' },
];

export default function AccountantDashboard() {
  return (
    <>
      <div className="page-header">
        <h1>Accountant Dashboard</h1>
        <p>Financial overview and management</p>
      </div>

      <div className="stats-grid">
        <DashboardCard icon="💰" iconColor="green" title="Company Balance" value="₹50,00,000" />
        <DashboardCard icon="📥" iconColor="blue" title="Today's Credits" value="₹2,25,000" change="+12 transactions" changeType="positive" />
        <DashboardCard icon="📤" iconColor="orange" title="Today's Debits" value="₹46,950" change="-8 transactions" changeType="negative" />
        <DashboardCard icon="💳" iconColor="red" title="Pending Fund Requests" value="3" change="₹1,00,000 total" />
      </div>

      <div className="mb-lg">
        <DataTable
          title="Recent Ledger Entries"
          columns={ledgerColumns}
          data={ledgerEntries}
          actions={<button className="btn btn-sm btn-secondary">Download Ledger</button>}
        />
      </div>
    </>
  );
}
