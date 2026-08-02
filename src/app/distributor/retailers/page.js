'use client';
import { useState } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import { retailers } from '@/data/mockData';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'shopName', label: 'Shop' },
  { key: 'phone', label: 'Phone' },
  { key: 'city', label: 'City' },
  { key: 'balance', label: 'Balance' },
  { key: 'status', label: 'Status' },
  {
    key: 'actions', label: 'Actions',
    render: () => (
      <div className="flex gap-sm">
        <button className="btn btn-sm btn-success">Transfer ₹</button>
        <button className="btn btn-sm btn-secondary">View</button>
      </div>
    ),
  },
];

export default function DistRetailersPage() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="page-header">
        <h1>My Retailers</h1>
        <p>Manage retailers under your network</p>
      </div>

      <DataTable
        title="Retailers"
        columns={columns}
        data={retailers.filter(r => r.parentDist === 'DST001')}
        actions={<button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Retailer</button>}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Retailer">
        <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" placeholder="Enter full name" /></div>
        <div className="form-group"><label className="form-label">Shop Name</label><input type="text" className="form-input" placeholder="Enter shop name" /></div>
        <div className="form-group"><label className="form-label">Mobile Number</label><input type="tel" className="form-input" placeholder="Enter mobile" /></div>
        <div className="form-group"><label className="form-label">City</label><input type="text" className="form-input" placeholder="Enter city" /></div>
        <div className="form-group"><label className="form-label">Initial Balance (₹)</label><input type="number" className="form-input" placeholder="0" /></div>
        <button className="btn btn-primary w-full mt-md">Create Retailer</button>
      </Modal>
    </>
  );
}
