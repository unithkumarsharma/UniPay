'use client';
import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState('md');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [selectedUserForFund, setSelectedUserForFund] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  const [fundNote, setFundNote] = useState('');
  const [fundSuccessMsg, setFundSuccessMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [mdList, setMdList] = useState([]);
  const [distList, setDistList] = useState([]);
  const [rtlList, setRtlList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State for creating new user
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
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

      if (mdRes.success) setMdList(mdRes.users || []);
      if (distRes.success) setDistList(distRes.users || []);
      if (rtlRes.success) setRtlList(rtlRes.users || []);
    } catch (e) {
      console.error('Error fetching users:', e);
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

  const handleAddFundsToUser = async (e) => {
    e.preventDefault();
    if (!selectedUserForFund || !fundAmount) return;

    try {
      const res = await fetch('/api/wallet/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserForFund._id,
          amount: parseFloat(fundAmount),
          remark: fundNote || 'Admin Wallet Top-up',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFundSuccessMsg(`Successfully credited ₹${fundAmount} to ${selectedUserForFund.name}'s wallet!`);
        fetchUsers();
        setTimeout(() => {
          setShowFundModal(false);
          setFundSuccessMsg('');
          setFundAmount('');
          setFundNote('');
        }, 1500);
      } else {
        alert(data.error || 'Fund transfer failed');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const targetRole = activeTab === 'md' ? 'master_distributor' : activeTab === 'dist' ? 'distributor' : 'retailer';
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: targetRole,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setFormData({ name: '', shopName: '', phone: '', email: '', city: '', initialBalance: 0, password: '123456' });
        fetchUsers();
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (e) {
      alert(e.message);
    }
    setIsSubmitting(false);
  };

  // Generic Filter Function
  const filterList = (list) => {
    return list.filter((u) => {
      const matchQuery =
        !searchQuery ||
        (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.phone && u.phone.includes(searchQuery)) ||
        (u.city && u.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.userId && u.userId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchQuery && matchStatus;
    });
  };

  const mdColumns = [
    { key: 'userId', label: 'User ID' },
    { key: 'name', label: 'Partner Name' },
    { key: 'phone', label: 'Mobile' },
    { key: 'city', label: 'City' },
    {
      key: 'walletBalance',
      label: 'Wallet Balance',
      render: (r) => (
        <span style={{ fontWeight: 800, color: 'var(--success)' }}>
          ₹{(r.walletBalance || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className={`badge ${r.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
          {r.status === 'active' ? '🟢 Active' : '🔴 Blocked'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Quick Actions',
      render: (row) => (
        <div className="flex gap-sm">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setSelectedUserForFund(row);
              setShowFundModal(true);
            }}
          >
            💳 Add Funds
          </button>
          <button
            className={`btn btn-sm ${row.status === 'active' ? 'btn-danger' : 'btn-success'}`}
            onClick={() => handleToggleStatus(row._id, row.status)}
          >
            {row.status === 'active' ? '🚫 Block' : '✅ Unblock'}
          </button>
        </div>
      ),
    },
  ];

  const distColumns = [
    { key: 'userId', label: 'User ID' },
    { key: 'name', label: 'Partner Name' },
    { key: 'phone', label: 'Mobile' },
    { key: 'city', label: 'City' },
    {
      key: 'walletBalance',
      label: 'Wallet Balance',
      render: (r) => (
        <span style={{ fontWeight: 800, color: 'var(--success)' }}>
          ₹{(r.walletBalance || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className={`badge ${r.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
          {r.status === 'active' ? '🟢 Active' : '🔴 Blocked'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Quick Actions',
      render: (row) => (
        <div className="flex gap-sm">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setSelectedUserForFund(row);
              setShowFundModal(true);
            }}
          >
            💳 Add Funds
          </button>
          <button
            className={`btn btn-sm ${row.status === 'active' ? 'btn-danger' : 'btn-success'}`}
            onClick={() => handleToggleStatus(row._id, row.status)}
          >
            {row.status === 'active' ? '🚫 Block' : '✅ Unblock'}
          </button>
        </div>
      ),
    },
  ];

  const rtlColumns = [
    { key: 'userId', label: 'User ID' },
    { key: 'name', label: 'Merchant Name' },
    { key: 'shopName', label: 'Shop Name', render: (r) => r.shopName || 'Retail Shop' },
    { key: 'phone', label: 'Mobile' },
    { key: 'city', label: 'City' },
    {
      key: 'walletBalance',
      label: 'Wallet Balance',
      render: (r) => (
        <span style={{ fontWeight: 800, color: 'var(--success)' }}>
          ₹{(r.walletBalance || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className={`badge ${r.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
          {r.status === 'active' ? '🟢 Active' : '🔴 Blocked'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Quick Actions',
      render: (row) => (
        <div className="flex gap-sm">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setSelectedUserForFund(row);
              setShowFundModal(true);
            }}
          >
            💳 Add Funds
          </button>
          <button
            className={`btn btn-sm ${row.status === 'active' ? 'btn-danger' : 'btn-success'}`}
            onClick={() => handleToggleStatus(row._id, row.status)}
          >
            {row.status === 'active' ? '🚫 Block' : '✅ Unblock'}
          </button>
        </div>
      ),
    },
  ];

  const currentTabName = activeTab === 'md' ? 'Master Distributor' : activeTab === 'dist' ? 'Distributor' : 'Retailer';

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>👥 Network Partner &amp; User Management</h1>
          <p>Onboard, manage, credit wallet funds, and audit all network partners.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>➕</span> Onboard New {currentTabName}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>🏛️ Master Distributors</span>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, marginTop: '4px' }}>{mdList.length}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700 }}>🏪 Distributors</span>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--accent)', marginTop: '4px' }}>{distList.length}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 700 }}>🛒 Retail Merchants</span>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--warning)', marginTop: '4px' }}>{rtlList.length}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700 }}>🛡️ Network Security</span>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--success)', marginTop: '4px' }}>
            {mdList.length + distList.length + rtlList.length} Verified
          </div>
        </div>
      </div>

      {/* Tabs & Search Controls Bar */}
      <div style={{ background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {/* Role Tabs */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'md' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('md')}
          >
            🏛️ Master Distributors ({mdList.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'dist' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dist')}
          >
            🏪 Distributors ({distList.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'rtl' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('rtl')}
          >
            🛒 Retailers ({rtlList.length})
          </button>
        </div>

        {/* Search & Filter Inputs */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, maxWidth: '500px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search by Name, Mobile, City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontSize: '0.88rem' }}
          />
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '130px', fontSize: '0.88rem' }}
          >
            <option value="all">All Status</option>
            <option value="active">🟢 Active</option>
            <option value="blocked">🔴 Blocked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
          🔄 Loading network partners list...
        </div>
      ) : (
        <>
          {activeTab === 'md' && (
            <DataTable title="Master Distributors Directory" columns={mdColumns} data={filterList(mdList)} />
          )}

          {activeTab === 'dist' && (
            <DataTable title="City Distributors Directory" columns={distColumns} data={filterList(distList)} />
          )}

          {activeTab === 'rtl' && (
            <DataTable title="Retail Merchants Directory" columns={rtlColumns} data={filterList(rtlList)} />
          )}
        </>
      )}

      {/* Create User Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title={`Onboard New ${currentTabName}`}>
        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter partner name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {activeTab === 'rtl' && (
            <div className="form-group">
              <label className="form-label">Shop Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter shop or counter name"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              className="form-input"
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Optional)</label>
            <input
              type="email"
              className="form-input"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">City / Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter city name"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Initial Wallet Top-up (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={formData.initialBalance}
              onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Login Password</label>
            <input
              type="text"
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating User...' : `🚀 Create ${currentTabName}`}
          </button>
        </form>
      </Modal>

      {/* Direct Add Fund Modal */}
      {selectedUserForFund && (
        <Modal isOpen={showFundModal} onClose={() => setShowFundModal(false)} title={`Credit Wallet: ${selectedUserForFund.name}`}>
          {fundSuccessMsg ? (
            <div style={{ padding: '16px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
              ✅ {fundSuccessMsg}
            </div>
          ) : (
            <form onSubmit={handleAddFundsToUser}>
              <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>User: <strong>{selectedUserForFund.name}</strong> ({selectedUserForFund.userId})</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Current Balance: <strong style={{ color: 'var(--success)' }}>₹{(selectedUserForFund.walletBalance || 0).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Amount to Credit (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter amount to credit"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Remark / Reference Note</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bank IMPS Topup Credit"
                  value={fundNote}
                  onChange={(e) => setFundNote(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                💰 Credit Funds Now
              </button>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
