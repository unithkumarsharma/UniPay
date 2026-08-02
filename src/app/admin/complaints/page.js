'use client';
import { useState } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

const INITIAL_ADMIN_COMPLAINTS = [
  {
    id: 'CMP-1001',
    user: 'Rahul Sharma (Retailer)',
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
    user: 'Amit Gupta (Distributor)',
    txnId: 'TXN772615',
    type: 'BBPS Payment Pending',
    message: 'Electricity bill payment of ₹1,450 shown pending for 3 hours.',
    priority: 'MEDIUM',
    status: 'in_progress',
    date: '2026-08-02 11:15',
    reply: 'Under verification with state electricity board NPCI switch.',
  },
  {
    id: 'CMP-1003',
    user: 'Vikram Singh (Master Dist)',
    txnId: 'TXN551920',
    type: 'DMT Transfer Delayed',
    message: 'Money transfer of ₹5,000 to SBI account pending receipt.',
    priority: 'HIGH',
    status: 'resolved',
    date: '2026-08-01 16:45',
    reply: 'Resolved. Bank IMPS reference UTR998124 generated and credited.',
  },
  {
    id: 'CMP-1004',
    user: 'Pooja Verma (Retailer)',
    txnId: 'TXN441092',
    type: 'AEPS Withdrawal Dispute',
    message: 'Biometric biometric withdrawal ₹2,000 debited from customer but wallet not updated.',
    priority: 'HIGH',
    status: 'open',
    date: '2026-08-01 10:20',
    reply: '',
  },
];

export default function AdminComplaintsPage() {
  const [complaintList, setComplaintList] = useState(INITIAL_ADMIN_COMPLAINTS);
  const [filter, setFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Resolution Form State
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState('resolved');
  const [refundAmount, setRefundAmount] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleResolveTicket = (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const updatedList = complaintList.map((c) => {
      if (c.id === selectedTicket.id) {
        return {
          ...c,
          status: newStatus,
          reply: replyText || `Official Admin Response: Ticket processed and updated to ${newStatus.toUpperCase()}.${refundAmount ? ` Refund of ₹${refundAmount} credited to wallet.` : ''}`,
        };
      }
      return c;
    });

    setComplaintList(updatedList);
    setSuccessMsg(`Ticket #${selectedTicket.id} updated successfully!`);
    setTimeout(() => {
      setSelectedTicket(null);
      setSuccessMsg('');
      setReplyText('');
      setRefundAmount('');
    }, 1500);
  };

  const filteredData = complaintList.filter((c) => {
    if (filter === 'open') return c.status === 'open';
    if (filter === 'in_progress') return c.status === 'in_progress';
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  const columns = [
    { key: 'id', label: 'Ticket ID' },
    { key: 'user', label: 'Merchant / Partner' },
    { key: 'txnId', label: 'Txn ID' },
    { key: 'type', label: 'Category' },
    {
      key: 'priority',
      label: 'Priority',
      render: (row) => (
        <span className={`badge ${row.priority === 'HIGH' ? 'badge-danger' : 'badge-info'}`}>
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
          {row.status === 'resolved' ? '✅ Resolved' : row.status === 'in_progress' ? '⏳ In Progress' : '🔴 Open'}
        </span>
      ),
    },
    { key: 'date', label: 'Submitted Date' },
    {
      key: 'actions',
      label: 'Action',
      render: (row) => (
        <div className="flex gap-sm">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setSelectedTicket(row);
              setNewStatus(row.status === 'resolved' ? 'resolved' : 'resolved');
              setReplyText(row.reply || '');
            }}
          >
            ⚙️ Manage / Reply
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>🛠️ Admin Grievance &amp; Complaint Resolution Center</h1>
          <p>Review merchant disputes, issue wallet refunds, and update resolution tickets in real-time.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Total Complaints</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>{complaintList.length}</div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 700 }}>Pending Open</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--danger)', marginTop: '4px' }}>
            {complaintList.filter((c) => c.status === 'open').length}
          </div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 700 }}>Under Investigation</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--warning)', marginTop: '4px' }}>
            {complaintList.filter((c) => c.status === 'in_progress').length}
          </div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700 }}>Resolved &amp; Settled</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
            {complaintList.filter((c) => c.status === 'resolved').length}
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
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
          ✅ Resolved ({complaintList.filter((c) => c.status === 'resolved').length})
        </button>
      </div>

      {/* Complaints Table */}
      <DataTable title="All Merchant Support Tickets" columns={columns} data={filteredData} />

      {/* Manage Ticket Modal */}
      {selectedTicket && (
        <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Resolve Ticket #${selectedTicket.id}`}>
          {successMsg ? (
            <div style={{ padding: '16px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
              ✅ {successMsg}
            </div>
          ) : (
            <form onSubmit={handleResolveTicket}>
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Merchant: <strong>{selectedTicket.user}</strong></div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Transaction ID: <strong>{selectedTicket.txnId}</strong></div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>
                  Description: &quot;{selectedTicket.message}&quot;
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Update Ticket Status</label>
                <select className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="resolved">✅ Mark as RESOLVED &amp; Close Ticket</option>
                  <option value="in_progress">⏳ Mark as IN PROGRESS (Investigating)</option>
                  <option value="open">🔴 Mark as OPEN</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Wallet Refund Credit (Optional ₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 299 (Auto-credit to Merchant Wallet)"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Admin Reply Note</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Enter official resolution notes for the merchant..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                💾 Save &amp; Update Ticket Status
              </button>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
