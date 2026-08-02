'use client';
import DataTable from '@/components/DataTable';
import { commissionSlabs } from '@/data/mockData';

export default function AdminCommissionPage() {
  const columns = [
    { key: 'service', label: 'Service' },
    { key: 'retailerComm', label: 'Retailer' },
    { key: 'distMargin', label: 'Distributor' },
    { key: 'mdMargin', label: 'Master Dist.' },
    { key: 'adminProfit', label: 'Admin Profit' },
    { key: 'total', label: 'Total Commission' },
    {
      key: 'actions', label: 'Actions',
      render: () => <button className="btn btn-sm btn-secondary">Edit</button>,
    },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Commission Setup</h1>
        <p>Configure commission slabs for each service across all levels</p>
      </div>

      <div className="card mb-lg" style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
          💡 <strong>How it works:</strong> When a retailer performs a transaction, the total commission is split between all levels.
          Admin profit is automatically calculated as: Total Commission - (Retailer + Distributor + MD margins).
        </p>
      </div>

      <DataTable
        title="Commission Slabs"
        columns={columns}
        data={commissionSlabs}
        actions={<button className="btn btn-primary btn-sm">+ Add Slab</button>}
      />
    </>
  );
}
