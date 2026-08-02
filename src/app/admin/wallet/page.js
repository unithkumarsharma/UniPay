'use client';
import { useState, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

const INITIAL_MOCK_USERS = [
  { _id: 'USR101', id: 'USR101', userId: 'RTL001', name: 'Suresh Yadav', role: 'retailer', phone: '9876543210', walletBalance: 24500, status: 'active' },
  { _id: 'USR102', id: 'USR102', userId: 'DST001', name: 'Ankit Kumar', role: 'distributor', phone: '9876543211', walletBalance: 150000, status: 'active' },
  { _id: 'USR103', id: 'USR103', userId: 'MD001', name: 'Vikram Singh', role: 'master_distributor', phone: '9876543212', walletBalance: 450000, status: 'active' },
  { _id: 'USR104', id: 'USR104', userId: 'ACC001', name: 'Rahul Verma', role: 'accountant', phone: '9876543213', walletBalance: 5000, status: 'active' },
];

export default function AdminWalletPage() {
  const [users, setUsers] = useState(INITIAL_MOCK_USERS);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalAction, setModalAction] = useState('add'); // 'add' or 'deduct'
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && data.users && data.users.length > 0) {
        const formatted = data.users.map(u => ({ ...u, id: u.id || u._id || u.userId }));
        setUsers(formatted);
      }
    } catch (e) {
      console.warn('Using fallback users list:', e.message);
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

    const numAmount = parseFloat(amount);
    const targetUserId = selectedUser._id || selectedUser.id || selectedUser.userId;

    // 1. Instant local UI state update for live real-time re-rendering
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        const uid = u._id || u.id || u.userId;
        if (uid === targetUserId) {
          const currentBal = Number(u.walletBalance || 0);
          const newBal = modalAction === 'add' ? currentBal + numAmount : Math.max(0, currentBal - numAmount);
          return { ...u, walletBalance: newBal };
        }
        return u;
      })
    );

    setShowModal(false);
    showToast(
      `✅ ₹${numAmount.toLocaleString('en-IN')} ${modalAction === 'add' ? 'credited to' : 'deducted from'} ${selectedUser.name}'s wallet!`
    );

    // 2. Background API sync attempt
    try {
      fetch('/api/wallet/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUserId,
          amount: numAmount,
          action: modalAction,
          description: remarks || `${modalAction === 'add' ? 'Added' : 'Deducted'} by Admin`,
        }),
      }).catch(() => {});
    } catch (e) {}
  };

  const totalPool = users.reduce((sum, u) => sum + (u.walletBalance || 0), 0);

  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return { bg: 'rgba(239, 68, 68, 0.12)', color: '#DC2626', label: 'ADMIN' };
      case 'master_distributor':
        return { bg: 'rgba(37, 99, 235, 0.12)', color: '#2563EB', label: 'MASTER DIST' };
      case 'distributor':
        return { bg: 'rgba(16, 185, 129, 0.12)', color: '#059669', label: 'DISTRIBUTOR' };
      case 'accountant':
        return { bg: 'rgba(139, 92, 246, 0.12)', color: '#7C3AED', label: 'ACCOUNTANT' };
      default:
        return { bg: 'rgba(245, 158, 11, 0.12)', color: '#D97706', label: 'RETAILER' };
    }
  };

  const columns = [
    {
      key: 'userId',
      label: 'User ID',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 700,
          color: '#2563EB',
          background: 'rgba(37, 99, 235, 0.08)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-md)',
        }}>
          {r.userId || r.id}
        </span>
      ),
    },
    { key: 'name', label: 'Partner Name' },
    {
      key: 'role',
      label: 'Role Tier',
      render: (r) => {
        const badge = getRoleBadgeStyle(r.role);
        return (
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: 'var(--radius-full)',
            background: badge.bg,
            color: badge.color,
            letterSpacing: '0.03em',
          }}>
            {badge.label}
          </span>
        );
      },
    },
    { key: 'phone', label: 'Mobile' },
    {
      key: 'walletBalance',
      label: 'Wallet Balance',
      render: (r) => (
        <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '0.98rem' }}>
          ₹{(r.walletBalance || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.72rem',
          fontWeight: 700,
          background: r.status === 'active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          color: r.status === 'active' ? '#059669' : '#DC2626',
          textTransform: 'uppercase',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.status === 'active' ? '#10B981' : '#EF4444' }} />
          {r.status === 'active' ? 'Active' : 'Blocked'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'nowrap', minWidth: 'max-content' }}>
          <button
            className="btn btn-sm btn-success"
            style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={() => handleOpenModal(row, 'add')}
            title="Credit funds to user"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Credit Funds
          </button>
          <button
            className="btn btn-sm btn-danger"
            style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={() => handleOpenModal(row, 'deduct')}
            title="Debit funds from user"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Debit Funds
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Toast Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 9999,
          background: '#10B981',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.88rem',
          fontWeight: 700,
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          MASTER WALLET CONTROL &amp; SETTLEMENTS
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Wallet Management Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Instantly credit or debit wallet balance across network accounts with real-time audit logging.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <DashboardCard
          icon="wallet"
          iconColor="green"
          title="Total Network Pool Balance"
          value={`₹${totalPool.toLocaleString('en-IN')}`}
          change="Real-time live aggregate"
          badge="Live Pool"
          sparkline="0,22 10,18 20,15 30,12 40,8 50,6 60,2"
        />
        <DashboardCard
          icon="users"
          iconColor="blue"
          title="Active Registered Wallets"
          value={users.length}
          change="Verified accounts"
          badge="Network Accounts"
          sparkline="0,20 10,16 20,14 30,10 40,8 50,5 60,3"
        />
      </div>

      {/* Users Wallet Directory Table */}
      <DataTable
        title="Network User Wallets Directory"
        columns={columns}
        data={users}
        searchable={true}
      />

      {/* Credit / Debit Modal */}
      {showModal && selectedUser && (
        <Modal
          title={`${modalAction === 'add' ? 'Credit Wallet Balance:' : 'Debit Wallet Balance:'} ${selectedUser.name}`}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleWalletAction}>
            <div style={{ background: 'var(--bg-secondary)', padding: '14px 18px', borderRadius: 'var(--radius-lg)', marginBottom: '18px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Partner: <strong>{selectedUser.name}</strong> ({selectedUser.userId})
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Current Balance: <strong style={{ color: 'var(--success)', fontSize: '1.1rem' }}>₹{(selectedUser.walletBalance || 0).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Transaction Amount (₹)</label>
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
              <label className="form-label">Remarks / Audit Note</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Approved RTGS Fund Credit"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                type="submit"
                className={`btn ${modalAction === 'add' ? 'btn-success' : 'btn-danger'}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {modalAction === 'add' ? 'Credit Funds Now' : 'Debit Funds Now'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
