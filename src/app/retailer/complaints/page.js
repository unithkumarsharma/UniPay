'use client';
import { useState } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import { complaints } from '@/data/mockData';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'txnId', label: 'Txn ID' },
  { key: 'type', label: 'Issue Type' },
  { key: 'message', label: 'Description' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
];

export default function RetailerComplaintsPage() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="page-header"><h1>Complaints</h1><p>Raise and track your complaints</p></div>
      <DataTable
        title="My Complaints"
        columns={columns}
        data={complaints.slice(0, 2)}
        actions={<button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ New Complaint</button>}
      />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Raise Complaint">
        <div className="form-group"><label className="form-label">Transaction ID</label><input type="text" className="form-input" placeholder="Enter transaction ID" /></div>
        <div className="form-group"><label className="form-label">Issue Type</label>
          <select className="form-select"><option>Recharge Failed</option><option>Amount Not Received</option><option>Wrong Amount Charged</option><option>Other</option></select>
        </div>
        <div className="form-group"><label className="form-label">Description</label>
          <textarea className="form-input" rows={3} placeholder="Describe your issue in detail" style={{ resize: 'vertical' }}></textarea>
        </div>
        <button className="btn btn-primary w-full">Submit Complaint</button>
      </Modal>
    </>
  );
}
