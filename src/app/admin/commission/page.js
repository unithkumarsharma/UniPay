'use client';
import { useState } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import { commissionSlabs as initialSlabs } from '@/data/mockData';

export default function AdminCommissionPage() {
  const [slabs, setSlabs] = useState(initialSlabs);
  const [showModal, setShowModal] = useState(false);
  const [editingSlab, setEditingSlab] = useState(null);
  const [formData, setFormData] = useState({
    service: '',
    retailerComm: '₹1.50',
    distMargin: '₹0.50',
    mdMargin: '₹0.50',
    adminProfit: '₹0.50',
    total: '₹3.00',
  });

  const handleOpenEditModal = (slab) => {
    setEditingSlab(slab);
    setFormData({
      service: slab.service,
      retailerComm: slab.retailerComm,
      distMargin: slab.distMargin,
      mdMargin: slab.mdMargin,
      adminProfit: slab.adminProfit,
      total: slab.total,
    });
    setShowModal(true);
  };

  const handleOpenAddModal = () => {
    setEditingSlab(null);
    setFormData({
      service: '',
      retailerComm: '₹1.00',
      distMargin: '₹0.50',
      mdMargin: '₹0.50',
      adminProfit: '₹0.50',
      total: '₹2.50',
    });
    setShowModal(true);
  };

  const handleSaveSlab = (e) => {
    e.preventDefault();
    if (editingSlab) {
      setSlabs((prev) =>
        prev.map((s) => (s.service === editingSlab.service ? { ...formData } : s))
      );
    } else {
      setSlabs((prev) => [...prev, { ...formData }]);
    }
    setShowModal(false);
  };

  const columns = [
    {
      key: 'service',
      label: 'Service Name',
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.12)',
            color: '#7C3AED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="5" x2="5" y2="19" />
              <circle cx="6.5" cy="6.5" r="2.5" />
              <circle cx="17.5" cy="17.5" r="2.5" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.service}</span>
        </div>
      ),
    },
    {
      key: 'retailerComm',
      label: 'Retailer Margin',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 700,
          color: '#2563EB',
          background: 'rgba(37, 99, 235, 0.08)',
          padding: '3px 9px',
          borderRadius: 'var(--radius-md)',
        }}>
          {r.retailerComm}
        </span>
      ),
    },
    {
      key: 'distMargin',
      label: 'Distributor Margin',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 700,
          color: '#10B981',
          background: 'rgba(16, 185, 129, 0.08)',
          padding: '3px 9px',
          borderRadius: 'var(--radius-md)',
        }}>
          {r.distMargin}
        </span>
      ),
    },
    {
      key: 'mdMargin',
      label: 'Master Dist. Margin',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 700,
          color: '#7C3AED',
          background: 'rgba(139, 92, 246, 0.08)',
          padding: '3px 9px',
          borderRadius: 'var(--radius-md)',
        }}>
          {r.mdMargin}
        </span>
      ),
    },
    {
      key: 'adminProfit',
      label: 'Admin Net Profit',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 800,
          color: '#D97706',
          background: 'rgba(245, 158, 11, 0.12)',
          padding: '3px 10px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}>
          {r.adminProfit}
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Total Commission',
      render: (r) => (
        <span style={{
          fontWeight: 800,
          color: '#059669',
          background: 'rgba(16, 185, 129, 0.12)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.78rem',
        }}>
          {r.total}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          className="btn btn-sm btn-secondary"
          style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          onClick={() => handleOpenEditModal(row)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Slab
        </button>
      ),
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(139, 92, 246, 0.1)', color: '#7C3AED', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="5" x2="5" y2="19" />
              <circle cx="6.5" cy="6.5" r="2.5" />
              <circle cx="17.5" cy="17.5" r="2.5" />
            </svg>
            COMMISSION SLAB CONFIGURATOR
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Commission Setup &amp; Margins
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Configure commission slabs, distributor margins, and auto-calculated Admin profit split.
          </p>
        </div>
      </div>

      {/* Structured Formula Explanation Banner */}
      <div style={{
        background: 'rgba(37, 99, 235, 0.05)',
        border: '1px solid rgba(37, 99, 235, 0.2)',
        borderRadius: 'var(--radius-xl)',
        padding: '18px 22px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(37, 99, 235, 0.12)',
          color: '#2563EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563EB', marginBottom: '4px' }}>
            Automated Margin Calculation Formula
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            When a retailer executes a transaction, the total API commission is split automatically across network tiers.
            <span style={{ display: 'inline-block', marginLeft: '6px', fontWeight: 700, color: '#D97706', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
              Admin Net Profit = Total Commission - (Retailer + Distributor + MD margins)
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        title="Active Service Commission Directory"
        columns={columns}
        data={slabs}
        searchable={true}
        actions={
          <button
            className="btn btn-primary btn-sm"
            onClick={handleOpenAddModal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Commission Slab
          </button>
        }
      />

      {/* Edit / Add Commission Slab Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSlab ? `Edit Commission Slab: ${editingSlab.service}` : 'Add New Commission Slab'}
      >
        <form onSubmit={handleSaveSlab}>
          <div className="form-group">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Broadband Bill"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Retailer Margin</label>
              <input
                type="text"
                className="form-input"
                value={formData.retailerComm}
                onChange={(e) => setFormData({ ...formData, retailerComm: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Distributor Margin</label>
              <input
                type="text"
                className="form-input"
                value={formData.distMargin}
                onChange={(e) => setFormData({ ...formData, distMargin: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Master Dist. Margin</label>
              <input
                type="text"
                className="form-input"
                value={formData.mdMargin}
                onChange={(e) => setFormData({ ...formData, mdMargin: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Admin Net Profit</label>
              <input
                type="text"
                className="form-input"
                value={formData.adminProfit}
                onChange={(e) => setFormData({ ...formData, adminProfit: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Total Commission</label>
            <input
              type="text"
              className="form-input"
              value={formData.total}
              onChange={(e) => setFormData({ ...formData, total: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Save Commission Slab
          </button>
        </form>
      </Modal>
    </>
  );
}
