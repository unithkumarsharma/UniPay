'use client';
import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState('md');
  const [showModal, setShowModal] = useState(false);

  const [mdList, setMdList] = useState([]);
  const [distList, setDistList] = useState([]);
  const [rtlList, setRtlList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    initialBalance: 0,
    password: '123456',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const [mdRes, distRes, rtlRes] = await Promise.all([
        fetch('/api/users?role=master_distributor').then((r) => r.json()),
        fetch('/api/users?role=distributor').then((r) => r.json()),
        fetch('/api/users?role=retailer').then((r) => r.json()),
      ]);

      if (mdRes.success) setMdList(mdRes.users);
      if (distRes.success) setDistList(distRes.users);
      if (rtlRes.success) setRtlList(rtlRes.users);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: activeTab === 'md' ? 'master_distributor' : activeTab === 'dist' ? 'distributor' : 'retailer',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setFormData({ name: '', phone: '', email: '', city: '', initialBalance: 0, password: '123456' });
        fetchUsers();
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (e) {
      alert(e.message);
    }
    setIsSubmitting(false);
  };

  const mdColumns = [
    { key: 'userId', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'walletBalance', label: 'Balance', render: (r) => `₹${(r.walletBalance || 0).toLocaleString('en-IN')}` },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Joined', render: (r) => new Date(r.createdAt).toLocaleDateString('en-IN') },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-sm">
          <button
            className={`btn btn-sm ${row.status === 'active' ? 'btn-danger' : 'btn-success'}`}
            onClick={() => handleToggleStatus(row._id, row.status)}
          >
            {row.status === 'active' ? 'Block' : 'Unblock'}
          </button>
        </div>
      ),
    },
  ];

  const distColumns = [
    { key: 'userId', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'walletBalance', label: 'Balance', render: (r) => `₹${(r.walletBalance || 0).toLocaleString('en-IN')}` },
    { key: 'parentId', label: 'Parent MD', render: (r) => r.parentId?.name || 'Admin' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          className={`btn btn-sm ${row.status === 'active' ? 'btn-danger' : 'btn-success'}`}
          onClick={() => handleToggleStatus(row._id, row.status)}
        >
          {row.status === 'active' ? 'Block' : 'Unblock'}
        </button>
      ),
    },
  ];

  const rtlColumns = [
    { key: 'userId', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'shopName', label: 'Shop Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'walletBalance', label: 'Balance', render: (r) => `₹${(r.walletBalance || 0).toLocaleString('en-IN')}` },
    { key: 'parentId', label: 'Distributor', render: (r) => r.parentId?.name || 'Direct' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          className={`btn btn-sm ${row.status === 'active' ? 'btn-danger' : 'btn-success'}`}
          onClick={() => handleToggleStatus(row._id, row.status)}
        >
          {row.status === 'active' ? 'Block' : 'Unblock'}
        </button>
      ),
    },
  ];

  const tabs = [
    { key: 'md', label: 'Master Distributors', count: mdList.length },
    { key: 'dist', label: 'Distributors', count: distList.length },
    { key: 'rtl', label: 'Retailers', count: rtlList.length },
  ];

  return (
    <>
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage all users across the distribution network with real DB storage</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-sm mb-lg" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className="btn btn-sm"
            style={{
              borderRadius: '8px 8px 0 0',
              borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
              background: activeTab === tab.key ? 'var(--primary-light)' : 'transparent',
              fontWeight: activeTab === tab.key ? 600 : 400,
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading real users from database...</div>
      ) : (
        <>
          {activeTab === 'md' && (
            <DataTable
              title="Master Distributors"
              columns={mdColumns}
              data={mdList}
              actions={
                <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                  + Add Master Distributor
                </button>
              }
            />
          )}

          {activeTab === 'dist' && (
            <DataTable
              title="Distributors"
              columns={distColumns}
              data={distList}
              actions={
                <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                  + Add Distributor
                </button>
              }
            />
          )}

          {activeTab === 'rtl' && (
            <DataTable
              title="Retailers"
              columns={rtlColumns}
              data={rtlList}
              actions={
                <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                  + Add Retailer
                </button>
              }
            />
          )}
        </>
      )}

      {/* Add User Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Add ${activeTab === 'md' ? 'Master Distributor' : activeTab === 'dist' ? 'Distributor' : 'Retailer'}`}>
        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              className="form-input"
              placeholder="Enter 10-digit mobile"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email (Optional)</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Initial Balance (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={formData.initialBalance}
              onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-md" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </Modal>
    </>
  );
}
