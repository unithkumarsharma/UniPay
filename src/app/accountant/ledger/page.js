'use client';
import DataTable from '@/components/DataTable';
import { ledgerEntries } from '@/data/mockData';

const columns = [
  { key: 'id', label: 'Entry ID' },
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

export default function LedgerPage() {
  return (
    <>
      <div className="page-header">
        <h1>Company Ledger</h1>
        <p>Complete debit/credit record of all transactions</p>
      </div>

      <div className="flex gap-sm mb-lg">
        <input type="date" className="form-input" style={{ maxWidth: 180 }} />
        <input type="date" className="form-input" style={{ maxWidth: 180 }} />
        <select className="form-select" style={{ maxWidth: 150 }}>
          <option>All Types</option>
          <option>Credit</option>
          <option>Debit</option>
        </select>
        <button className="btn btn-primary btn-sm">Filter</button>
        <button className="btn btn-secondary btn-sm">Export</button>
      </div>

      <DataTable title="Ledger Entries" columns={columns} data={ledgerEntries} />
    </>
  );
}
