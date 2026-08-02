'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

export default function MDWalletPage() {
  const { user, refreshUserData } = useAuth();
  const [distributors, setDistributors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDist, setSelectedDist] = useState(null);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDistributors = async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`/api/users?role=distributor&parentId=${user._id}`);
      const data = await res.json();
      if (data.success) {
        setDistributors(data.users);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDistributors();
  }, [user]);

  const handleOpenTransfer = (dist) => {
    setSelectedDist(dist);
    setAmount('');
    setShowModal(true);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!user?._id || !selectedDist?._id || !amount) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user._id,
          receiverId: selectedDist._id,
          amount: parseFloat(amount),
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setShowModal(false);
        await refreshUserData();
        fetchDistributors();
      } else {
        alert(data.error || 'Transfer failed');
      }
    } catch (e) {
      alert(e.message);
    }
    setIsSubmitting(false);
  };

  const transferColumns = [
    { key: 'userId', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'walletBalance', label: 'Balance', render: (r) => `₹${(r.walletBalance || 0).toLocaleString('en-IN')}` },
    {
      key: 'actions',
      label: 'Quick Transfer',
      render: (row) => (
        <button className="btn btn-sm btn-primary" onClick={() => handleOpenTransfer(row)}>
          Send ₹
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Wallet &amp; Transfer</h1>
        <p>Manage balance and transfer funds downline to your distributors</p>
      </div>

      <div className="wallet-card mb-lg">
        <div className="wallet-label">Available Balance</div>
        <div className="wallet-balance">₹{(user?.walletBalance || 0).toLocaleString('en-IN')}</div>
      </div>

      <DataTable title="My Distributors" columns={transferColumns} data={distributors} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Transfer Funds to ${selectedDist?.name}`}>
        <form onSubmit={handleTransfer}>
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
              max={user?.walletBalance || 0}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-md" disabled={isSubmitting}>
            {isSubmitting ? 'Transferring...' : `Transfer ₹${amount || 0}`}
          </button>
        </form>
      </Modal>
    </>
  );
}
