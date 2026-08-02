'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

const INITIAL_COMPLAINTS = [
  {
    id: 'CMP-1001',
    txnId: 'TXN882910',
    type: 'Recharge Failed - Debited',
    message: 'Amount ₹299 debited for Jio recharge but mobile plan not updated.',
    priority: 'HIGH',
    status: 'open',
    date: '2026-08-02 14:30',
    reply: '',
  },
  {
    id: 'CMP-1002',
    txnId: 'TXN772615',
    type: 'BBPS Payment Pending',
    message: 'Electricity bill payment of ₹1,450 shown pending for 3 hours.',
    priority: 'MEDIUM',
    status: 'in_progress',
    date: '2026-08-02 11:15',
    reply: 'Our technical team is verifying biller NPCI gateway confirmation.',
  },
  {
    id: 'CMP-1003',
    txnId: 'TXN551920',
    type: 'DMT Transfer Delayed',
    message: 'Money transfer of ₹5,000 to SBI account pending receipt.',
    priority: 'HIGH',
    status: 'resolved',
    date: '2026-08-01 16:45',
    reply: 'Resolved. Bank IMPS reference UTR998124 generated and credited.',
  },
];

export default function RetailerComplaintsPage() {
  const { user } = useAuth();
  const [complaintList, setComplaintList] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Form State
  const [txnId, setTxnId] = useState('');
  const [issueType, setIssueType] = useState('Recharge Failed - Debited');
  const [priority, setPriority] = useState('HIGH');
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const userId = user?.id || user?._id;

  const fetchComplaints = async () => {
    try {
      const url = userId ? `/api/complaints?userId=${userId}` : '/api/complaints';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.complaints)) {
        setComplaintList(data.complaints);
      }
    } catch (e) {
      console.error('Fetch complaints error:', e);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [userId]);

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'RTL001',
          transactionId: txnId || `TXN${Math.floor(100000 + Math.random() * 900000)}`,
          issueType,
          priority,
          description: message || 'Issue reported regarding transaction status.',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Ticket raised successfully!`);
        fetchComplaints();
        setTimeout(() => {
          setShowNewModal(false);
          setSuccessMsg('');
          setTxnId('');
          setMessage('');
        }, 1200);
      }
    } catch (err) {
      console.error('Create complaint error:', err);
    }
  };

  const filteredData = complaintList.filter((c) => {
    if (filter === 'open') return c.status === 'open';
    if (filter === 'in_progress') return c.status === 'in_progress';
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  const columns = [
    { key: 'id', label: 'Ticket ID' },
    { key: 'txnId', label: 'Txn ID' },
    { key: 'type', label: 'Issue Category' },
    {
      key: 'priority',
      label: 'Priority',
      render: (row) => (
        <span
          className={`badge ${
            row.priority === 'HIGH' ? 'badge-danger' : row.priority === 'MEDIUM' ? 'badge-warning' : 'badge-info'
          }`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={`badge ${
            row.status === 'resolved'
              ? 'badge-success'
              : row.status === 'in_progress'
              ? 'badge-warning'
              : 'badge-danger'
          }`}
        >
          {row.status === 'resolved' ? 'Resolved' : row.status === 'in_progress' ? 'In Progress' : 'Open'}
        </span>
      ),
    },
    { key: 'date', label: 'Created At' },
    {
      key: 'actions',
      label: 'Details',
      render: (row) => (
        <button className="btn btn-secondary btn-sm" onClick={() => setSelectedTicket(row)}>
          👁️ View Ticket
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>📩 Merchant Helpdesk &amp; Complaints</h1>
          <p>Raise tickets for failed recharges, bill payments, and track instant refunds.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>➕</span> Raise New Ticket
        </button>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Total Complaints</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>{complaintList.length}</div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 700 }}>Open Issues</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--danger)', marginTop: '4px' }}>
            {complaintList.filter((c) => c.status === 'open').length}
          </div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 700 }}>In Progress</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--warning)', marginTop: '4px' }}>
            {complaintList.filter((c) => c.status === 'in_progress').length}
          </div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700 }}>Resolved &amp; Refunded</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
            {complaintList.filter((c) => c.status === 'resolved').length}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-sm mb-lg">
        <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('all')}>
          All Tickets ({complaintList.length})
        </button>
        <button className={`btn btn-sm ${filter === 'open' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('open')}>
          🔴 Open ({complaintList.filter((c) => c.status === 'open').length})
        </button>
        <button className={`btn btn-sm ${filter === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('in_progress')}>
          ⏳ In Progress ({complaintList.filter((c) => c.status === 'in_progress').length})
        </button>
        <button className={`btn btn-sm ${filter === 'resolved' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('resolved')}>
          Resolved ({complaintList.filter((c) => c.status === 'resolved').length})
        </button>
      </div>

      {/* Tickets Table */}
      <DataTable title="My Support Tickets" columns={columns} data={filteredData} />

      {/* Raise New Complaint Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Raise Support Complaint Ticket">
        {successMsg ? (
          <div style={{ padding: '16px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
            {successMsg}
          </div>
        ) : (
          <form onSubmit={handleCreateComplaint}>
            <div className="form-group">
              <label className="form-label">Transaction Reference ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. TXN882910"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Issue Category</label>
              <select className="form-select" value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                <option>Recharge Failed - Debited</option>
                <option>BBPS Bill Payment Pending</option>
                <option>DMT Money Transfer Delayed</option>
                <option>AEPS Cash Withdrawal Pending</option>
                <option>Wallet Fund Top-up Dispute</option>
                <option>Other Operational Query</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="HIGH">🔴 High Priority (Urgent Refund Required)</option>
                <option value="MEDIUM">🟡 Medium Priority (Standard Query)</option>
                <option value="LOW">🔵 Low Priority (General Question)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Describe your issue in detail (Operator name, debited amount, mobile number...)"
                style={{ resize: 'vertical' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              🚀 Submit Ticket to Admin
            </button>
          </form>
        )}
      </Modal>

      {/* Ticket Details View Modal */}
      {selectedTicket && (
        <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Ticket #${selectedTicket.id}`}>
          <div style={{ lineHeight: '1.7', color: 'var(--text-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Txn ID:</span> <strong>{selectedTicket.txnId}</strong>
              </div>
              <span className={`badge ${selectedTicket.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>
                {selectedTicket.status.toUpperCase()}
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
              <strong>Category:</strong> {selectedTicket.type}
            </p>
            <p style={{ fontSize: '0.9rem', marginBottom: '16px', background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <strong>Merchant Description:</strong> {selectedTicket.message}
            </p>

            {selectedTicket.reply ? (
              <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--success)' }}>
                <strong>💬 Support Official Reply:</strong>
                <p style={{ marginTop: '4px', fontSize: '0.9rem' }}>{selectedTicket.reply}</p>
              </div>
            ) : (
              <div style={{ background: 'var(--warning-light)', color: 'var(--warning)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                ⏳ <strong>Status:</strong> Assigned to Support Desk. Officer review in progress.
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
