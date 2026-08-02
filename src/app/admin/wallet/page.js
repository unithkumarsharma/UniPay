'use client';
import { useState, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

export default function AdminWalletPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalAction, setModalAction] = useState('add'); // 'add' or 'deduct'
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user, action) => {
    setSelectedUser(user);
    setModalAction(action);
    setAmount('');
    setRemarks('');
    setShowModal(true);
  };

  const handleWalletAction = async (e) => {
    e.preventDefault();
    if (!selectedUser || !amount) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/wallet/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser._id,
          amount: parseFloat(amount),
          action: modalAction,
          description: remarks || `${modalAction === 'add' ? 'Added' : 'Deducted'} by Admin`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchUsers();
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (e) {
      alert(e.message);
    }
    setIsSubmitting(false);
  };

  const totalPool = users.reduce((sum, u) => sum + (u.walletBalance || 0), 0);

  const columns = [
    { key: 'userId', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role', render: (r) => r.role?.replace('_', ' ').toUpperCase() },
    { key: 'phone', label: 'Phone' },
    { key: 'walletBalance', label: 'Balance', render: (r) => `₹${(r.walletBalance || 0).toLocaleString('en-IN')}` },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-sm">
          <button className="btn btn-sm btn-success" onClick={() => handleOpenModal(row, 'add')}>
            + Add ₹
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => handleOpenModal(row, 'deduct')}>
            - Deduct ₹
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Wallet Management</h1>
        <p>Add or deduct balance from any user&apos;s wallet with real DB logging</p>
      </div>

      <div className="stats-grid">
        <DashboardCard icon="💰" iconColor="green" title="Total Network Pool" value={`₹${totalPool.toLocaleString('en-IN')}`} change="Real DB total" />
        <DashboardCard icon="👥" iconColor="blue" title="Active Wallets" value={users.length} change="Registered users" />
      </div>

      <DataTable title="User Wallets" columns={columns} data={users} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalAction === 'add' ? 'Add Balance to' : 'Deduct Balance from'} ${selectedUser?.name}`}
      >
        <form onSubmit={handleWalletAction}>
          <div className="form-group">
            <label className="form-label">Current Balance</label>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              ₹{(selectedUser?.walletBalance || 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Remarks / Description</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={`btn ${modalAction === 'add' ? 'btn-success' : 'btn-danger'} w-full mt-md`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : `${modalAction === 'add' ? 'Add' : 'Deduct'} Balance`}
          </button>
        </form>
      </Modal>
    </>
  );
}
