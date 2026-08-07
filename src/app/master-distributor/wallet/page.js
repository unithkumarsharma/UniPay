'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import Link from 'next/link';

const FALLBACK_DISTRIBUTORS = [
  { id: 'dst001_fallback', userId: 'DST001', name: 'Ram', role: 'distributor', phone: '9876543213', walletBalance: 50000, city: 'Noida', status: 'active' },
];

export default function MDWalletPage() {
  const { user, refreshUserData } = useAuth();
  const [distributors, setDistributors] = useState(FALLBACK_DISTRIBUTORS);
  const [showModal, setShowModal] = useState(false);
  const [selectedDist, setSelectedDist] = useState(null);
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const userId = user?.id || user?.userId || 'md001_fallback';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchDistributors = useCallback(async () => {
    try {
      const res = await fetch(`/api/users?role=distributor&parentId=${userId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.users) && data.users.length > 0) {
        const formatted = data.users.map(u => ({ ...u, id: u.id || u.userId }));
        setDistributors(formatted);
      }
    } catch (e) {
      console.warn('Fetch distributors notice:', e.message);
    }
  }, [userId]);

  useEffect(() => {
    fetchDistributors();
  }, [fetchDistributors]);

  const handleOpenTransfer = (dist) => {
    setSelectedDist(dist);
    setAmount('');
    setRemarks('');
    setShowModal(true);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const receiverId = selectedDist?.id || selectedDist?.userId;
    const numAmount = parseFloat(amount);

    if (!userId || !receiverId || isNaN(numAmount) || numAmount <= 0) return;

    if (numAmount > (user?.walletBalance || 0)) {
      showToast('⚠️ Insufficient wallet balance!');
      return;
    }

    setIsSubmitting(true);

    // Optimistic UI Update
    setDistributors((prev) =>
      prev.map((d) => {
        const did = d.id || d.userId;
        if (did === receiverId) {
          return { ...d, walletBalance: Number(d.walletBalance || 0) + numAmount };
        }
        return d;
      })
    );

    setShowModal(false);
    showToast(`₹${numAmount.toLocaleString('en-IN')} transferred to ${selectedDist.name} successfully!`);

    try {
      const res = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId,
          receiverId,
          amount: numAmount,
          remarks: remarks || 'MD Downline Transfer',
        }),
      });

      const data = await res.json();
      if (data.success) {
        await refreshUserData();
        fetchDistributors();
      } else {
        showToast(`API notice: ${data.error || 'Transfer failed'}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalDistBalance = distributors.reduce((sum, d) => sum + (Number(d.walletBalance) || 0), 0);

  const transferColumns = [
    {
      key: 'userId',
      label: 'Distributor ID',
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
    { key: 'name', label: 'Distributor Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    {
      key: 'walletBalance',
      label: 'Wallet Balance',
      render: (r) => (
        <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '0.95rem' }}>
          ₹{(Number(r.walletBalance) || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Quick Transfer',
      render: (row) => (
        <button
          className="btn btn-sm btn-primary"
          style={{ padding: '5px 12px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          onClick={() => handleOpenTransfer(row)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Send Funds ₹
        </button>
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

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          MASTER DISTRIBUTOR WALLET MANAGEMENT
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Master Wallet &amp; Downline Allocation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Instantly disburse working capital to distributors or request corporate top-up from Corporate Accountant.
        </p>
      </div>

      {/* Main Card */}
      <div className="card" style={{
        padding: '24px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
        color: '#FFFFFF',
        marginBottom: '28px',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9, fontWeight: 700, marginBottom: '4px' }}>
              Master Available Balance
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
              ₹{(Number(user?.walletBalance) || 0).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '4px' }}>
              Role: <strong>Master Distributor</strong> ({user?.userId || 'MD001'})
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/master-distributor/fund-request"
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>📥</span> Request Funds from Accountant
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <DashboardCard
          icon="wallet"
          iconColor="blue"
          title="Distributors Network Pool"
          value={`₹${totalDistBalance.toLocaleString('en-IN')}`}
          change="Aggregated downline balance"
          badge="Distributor Pool"
          sparkline="0,20 10,18 20,15 30,12 40,8 50,4 60,1"
        />
        <DashboardCard
          icon="users"
          iconColor="green"
          title="Active Distributors"
          value={distributors.length}
          change="Assigned regional partners"
          badge="Network Tier"
          sparkline="0,5 10,8 20,12 30,15 40,18 50,20 60,22"
        />
      </div>

      {/* Table */}
      <DataTable title="My Assigned Distributors" columns={transferColumns} data={distributors} searchable={true} />

      {/* Transfer Modal */}
      {showModal && selectedDist && (
        <Modal title={`Transfer Funds to ${selectedDist?.name}`} onClose={() => setShowModal(false)}>
          <form onSubmit={handleTransfer}>
            <div style={{ background: 'var(--bg-secondary)', padding: '14px 18px', borderRadius: 'var(--radius-lg)', marginBottom: '18px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Target Partner: <strong>{selectedDist.name}</strong> ({selectedDist.userId || selectedDist.id})
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Partner Current Balance: <strong style={{ color: 'var(--success)' }}>₹{(Number(selectedDist.walletBalance) || 0).toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Your Available Balance: <strong style={{ color: '#2563EB' }}>₹{(Number(user?.walletBalance) || 0).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Transfer Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                max={user?.walletBalance || 50000}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Remarks (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Master Fund Credit"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Transferring...' : `Transfer ₹${Number(amount || 0).toLocaleString('en-IN')} Now`}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
