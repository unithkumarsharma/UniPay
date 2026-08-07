'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import Link from 'next/link';

const FALLBACK_RETAILERS = [
  { id: 'rtl001_fallback', userId: 'RTL001', name: 'Rohan', role: 'retailer', phone: '9876543214', walletBalance: 20000, city: 'Noida', status: 'active' },
  { id: 'rtl002_fallback', userId: 'RTL002', name: 'Mohan', role: 'retailer', phone: '9876543215', walletBalance: 20000, city: 'Noida', status: 'active' },
];

export default function DistWalletPage() {
  const { user, refreshUserData } = useAuth();
  const [retailers, setRetailers] = useState(FALLBACK_RETAILERS);
  const [showModal, setShowModal] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const userId = user?.id || user?.userId || 'dst001_fallback';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchRetailers = useCallback(async () => {
    try {
      const res = await fetch(`/api/users?role=retailer&parentId=${userId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.users) && data.users.length > 0) {
        const formatted = data.users.map(u => ({ ...u, id: u.id || u.userId }));
        setRetailers(formatted);
      }
    } catch (e) {
      console.warn('Fetch retailers error, using default mock list:', e.message);
    }
  }, [userId]);

  useEffect(() => {
    fetchRetailers();
  }, [fetchRetailers]);

  const handleOpenTransfer = (retailer) => {
    setSelectedRetailer(retailer);
    setAmount('');
    setRemarks('');
    setShowModal(true);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const receiverId = selectedRetailer?.id || selectedRetailer?.userId;
    const numAmount = parseFloat(amount);

    if (!userId || !receiverId || isNaN(numAmount) || numAmount <= 0) return;

    if (numAmount > (user?.walletBalance || 0)) {
      showToast('⚠️ Insufficient wallet balance for this transfer!');
      return;
    }

    setIsSubmitting(true);

    // 1. Optimistic UI update
    setRetailers((prev) =>
      prev.map((r) => {
        const rid = r.id || r.userId;
        if (rid === receiverId) {
          return { ...r, walletBalance: Number(r.walletBalance || 0) + numAmount };
        }
        return r;
      })
    );

    setShowModal(false);
    showToast(`₹${numAmount.toLocaleString('en-IN')} transferred to ${selectedRetailer.name} successfully!`);

    // 2. Call API
    try {
      const res = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId,
          receiverId,
          amount: numAmount,
          remarks: remarks || 'Distributor Downline Transfer',
        }),
      });

      const data = await res.json();
      if (data.success) {
        await refreshUserData();
        fetchRetailers();
      } else {
        showToast(`Transfer API notice: ${data.error || 'Check balance'}`);
      }
    } catch (e) {
      console.error('Transfer API error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalRetailerBalance = retailers.reduce((sum, r) => sum + (Number(r.walletBalance) || 0), 0);

  const columns = [
    {
      key: 'userId',
      label: 'Retailer ID',
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
    { key: 'name', label: 'Retailer Name' },
    { key: 'phone', label: 'Mobile Number' },
    { key: 'city', label: 'City' },
    {
      key: 'walletBalance',
      label: 'Current Balance',
      render: (r) => (
        <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '0.95rem' }}>
          ₹{(Number(r.walletBalance) || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      render: (row) => (
        <button
          className="btn btn-sm btn-primary"
          style={{ padding: '5px 12px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
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
          DISTRIBUTOR WALLET &amp; DOWNLINE FUND DISBURSAL
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Wallet &amp; Downline Balance Transfer
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Transfer working capital directly to your registered retailers or request top-up from Master Distributor.
        </p>
      </div>

      {/* Main Wallet Card */}
      <div className="card" style={{
        padding: '24px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
        color: '#FFFFFF',
        marginBottom: '28px',
        boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9, fontWeight: 700, marginBottom: '4px' }}>
              My Available Wallet Balance
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
              ₹{(Number(user?.walletBalance) || 0).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '4px' }}>
              Account Role: <strong>Distributor</strong> ({user?.userId || 'DST001'})
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/distributor/fund-request"
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>📥</span> Request Funds from MD
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <DashboardCard
          icon="wallet"
          iconColor="blue"
          title="Total Retailer Network Pool"
          value={`₹${totalRetailerBalance.toLocaleString('en-IN')}`}
          change="Aggregated downline balance"
          badge="Network Capital"
          sparkline="0,20 10,18 20,15 30,12 40,8 50,4 60,1"
        />
        <DashboardCard
          icon="users"
          iconColor="green"
          title="Active Downline Retailers"
          value={retailers.length}
          change="Assigned merchants"
          badge="Active Outlets"
          sparkline="0,5 10,8 20,12 30,15 40,18 50,20 60,22"
        />
      </div>

      {/* Retailers Table */}
      <DataTable
        title="My Downline Retailer Network"
        columns={columns}
        data={retailers}
        searchable={true}
      />

      {/* Transfer Modal */}
      {showModal && selectedRetailer && (
        <Modal
          title={`Transfer Funds to ${selectedRetailer.name}`}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleTransfer}>
            <div style={{ background: 'var(--bg-secondary)', padding: '14px 18px', borderRadius: 'var(--radius-lg)', marginBottom: '18px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Receiver Retailer: <strong>{selectedRetailer.name}</strong> ({selectedRetailer.userId || selectedRetailer.id})
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Retailer Current Balance: <strong style={{ color: 'var(--success)' }}>₹{(Number(selectedRetailer.walletBalance) || 0).toLocaleString('en-IN')}</strong>
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
                placeholder="Enter amount to transfer"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                max={user?.walletBalance || 50000}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Remarks / Description (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Retailer Daily Working Capital Load"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Transferring...' : `Transfer ₹${Number(amount || 0).toLocaleString('en-IN')} Now`}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
