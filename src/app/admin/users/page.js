'use client';
import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState('md');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // Selected User States
  const [selectedUserForFund, setSelectedUserForFund] = useState(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);

  // Fund State
  const [fundAmount, setFundAmount] = useState('');
  const [fundNote, setFundNote] = useState('');
  const [fundSuccessMsg, setFundSuccessMsg] = useState('');

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    name: '',
    shopName: '',
    phone: '',
    email: '',
    city: '',
    status: 'active',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [mdList, setMdList] = useState([]);
  const [distList, setDistList] = useState([]);
  const [rtlList, setRtlList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create User Form State
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

  // EDIT USER HANDLER
  const handleOpenEditModal = (user) => {
    setSelectedUserForEdit(user);
    setEditFormData({
      name: user.name || '',
      shopName: user.shopName || '',
      phone: user.phone || '',
      email: user.email || '',
      city: user.city || '',
      status: user.status || 'active',
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;

    try {
      const res = await fetch(`/api/users/${selectedUserForEdit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        fetchUsers();
      } else {
        alert(data.error || 'Failed to update user details');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  // DELETE USER HANDLER
  const handleDeleteUser = async () => {
    if (!selectedUserForDelete) return;

    try {
      const res = await fetch(`/api/users/${selectedUserForDelete._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        setShowDeleteConfirmModal(false);
        setSelectedUserForDelete(null);
        fetchUsers();
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (e) {
      alert(e.message);
    }
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

  const commonActions = (row) => (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'nowrap', minWidth: 'max-content' }}>
      <button
        className="btn btn-sm btn-primary"
        style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        title="Add Wallet Funds"
        onClick={() => {
          setSelectedUserForFund(row);
          setShowFundModal(true);
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
        Add Funds
      </button>

      <button
        className="btn btn-sm btn-secondary"
        style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        title="Edit User Details"
        onClick={() => handleOpenEditModal(row)}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit
      </button>

      <button
        className={`btn btn-sm ${row.status === 'active' ? 'btn-warning' : 'btn-success'}`}
        style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        title={row.status === 'active' ? 'Block User' : 'Unblock User'}
        onClick={() => handleToggleStatus(row._id, row.status)}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
        {row.status === 'active' ? 'Block' : 'Unblock'}
      </button>

      <button
        className="btn btn-sm btn-danger"
        style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        title="Delete User Permanently"
        onClick={() => {
          setSelectedUserForDelete(row);
          setShowDeleteConfirmModal(true);
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        Delete
      </button>
    </div>
  );

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
    { key: 'actions', label: 'Actions', render: commonActions },
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
    { key: 'actions', label: 'Actions', render: commonActions },
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
    { key: 'actions', label: 'Actions', render: commonActions },
  ];

  const currentTabName = activeTab === 'md' ? 'Master Distributor' : activeTab === 'dist' ? 'Distributor' : 'Retailer';

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            PARTNER NETWORK DIRECTORY
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Partner &amp; User Management Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Onboard, edit details, credit wallet funds, block or delete users across the network.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Onboard New {currentTabName}
        </button>
      </div>

      {/* Summary KPI Cards with Vector SVG Badges */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '20px 22px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }} className="glow-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Master Distributors</span>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="21" x2="21" y2="21" />
                <line x1="6" y1="18" x2="6" y2="11" />
                <line x1="10" y1="18" x2="10" y2="11" />
                <line x1="14" y1="18" x2="14" y2="11" />
                <line x1="18" y1="18" x2="18" y2="11" />
                <polygon points="12 2 20 7 4 7 12 2" />
              </svg>
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>{mdList.length}</div>
          <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>Zone Level Partners</span>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '20px 22px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }} className="glow-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Distributors</span>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#10B981', letterSpacing: '-0.03em' }}>{distList.length}</div>
          <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>City Level Partners</span>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '20px 22px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }} className="glow-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Retail Merchants</span>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#F59E0B', letterSpacing: '-0.03em' }}>{rtlList.length}</div>
          <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 600 }}>Ground Retail Shops</span>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '20px 22px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }} className="glow-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Network Security</span>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#6366F1', letterSpacing: '-0.03em' }}>
            {mdList.length + distList.length + rtlList.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6366F1', fontWeight: 600 }}>Verified KYC Accounts</span>
        </div>
      </div>

      {/* Tabs & Search Controls Bar */}
      <div style={{ background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}>
        {/* Role Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('md')}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: activeTab === 'md' ? '#2563EB' : 'var(--border-color)',
              background: activeTab === 'md' ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              color: activeTab === 'md' ? '#2563EB' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Master Distributors ({mdList.length})
          </button>

          <button
            onClick={() => setActiveTab('dist')}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: activeTab === 'dist' ? '#10B981' : 'var(--border-color)',
              background: activeTab === 'dist' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              color: activeTab === 'dist' ? '#10B981' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Distributors ({distList.length})
          </button>

          <button
            onClick={() => setActiveTab('rtl')}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: activeTab === 'rtl' ? '#F59E0B' : 'var(--border-color)',
              background: activeTab === 'rtl' ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
              color: activeTab === 'rtl' ? '#F59E0B' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Retailers ({rtlList.length})
          </button>
        </div>

        {/* Search & Filter Inputs */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, maxWidth: '480px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by Name, Mobile, City, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 34px',
                fontSize: '0.82rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '130px', fontSize: '0.82rem' }}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
          Loading network partners list...
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
            {isSubmitting ? 'Creating User...' : `Create ${currentTabName}`}
          </button>
        </form>
      </Modal>

      {/* EDIT USER DETAILS MODAL */}
      {selectedUserForEdit && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit Details: ${selectedUserForEdit.name}`}>
          <form onSubmit={handleUpdateUser}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                required
              />
            </div>

            {selectedUserForEdit.role === 'retailer' && (
              <div className="form-group">
                <label className="form-label">Shop Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.shopName}
                  onChange={(e) => setEditFormData({ ...editFormData, shopName: e.target.value })}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-input"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City / Location</label>
              <input
                type="text"
                className="form-input"
                value={editFormData.city}
                onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Status</label>
              <select
                className="form-select"
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Save Updated Details
            </button>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {selectedUserForDelete && (
        <Modal isOpen={showDeleteConfirmModal} onClose={() => setShowDeleteConfirmModal(false)} title="Confirm Delete User">
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
              Are you sure you want to delete {selectedUserForDelete.name}?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              This action cannot be undone. User account <strong>{selectedUserForDelete.userId}</strong> and access credentials will be permanently removed.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirmModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteUser}>
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Direct Add Fund Modal */}
      {selectedUserForFund && (
        <Modal isOpen={showFundModal} onClose={() => setShowFundModal(false)} title={`Credit Wallet: ${selectedUserForFund.name}`}>
          {fundSuccessMsg ? (
            <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
              {fundSuccessMsg}
            </div>
          ) : (
            <form onSubmit={handleAddFundsToUser}>
              <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>User: <strong>{selectedUserForFund.name}</strong> ({selectedUserForFund.userId})</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Current Balance: <strong style={{ color: '#059669' }}>₹{(selectedUserForFund.walletBalance || 0).toLocaleString('en-IN')}</strong>
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
                Credit Funds Now
              </button>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
