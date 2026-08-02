'use client';
import DataTable from '@/components/DataTable';
import { complaints } from '@/data/mockData';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'user', label: 'User' },
  { key: 'txnId', label: 'Txn ID' },
  { key: 'type', label: 'Type' },
  { key: 'message', label: 'Message' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
  {
    key: 'actions', label: 'Actions',
    render: (row) => (
      <div className="flex gap-sm">
        {row.status !== 'resolved' && (
          <button className="btn btn-sm btn-success">Resolve</button>
        )}
        <button className="btn btn-sm btn-secondary">View</button>
      </div>
    ),
  },
];

export default function AdminComplaintsPage() {
  return (
    <>
      <div className="page-header">
        <h1>Complaints</h1>
        <p>View and resolve user complaints</p>
      </div>

      <div className="flex gap-sm mb-lg">
        <button className="btn btn-sm btn-primary">All (4)</button>
        <button className="btn btn-sm btn-secondary">Open (2)</button>
        <button className="btn btn-sm btn-secondary">In Progress (1)</button>
        <button className="btn btn-sm btn-secondary">Resolved (1)</button>
      </div>

      <DataTable title="All Complaints" columns={columns} data={complaints} />
    </>
  );
}
