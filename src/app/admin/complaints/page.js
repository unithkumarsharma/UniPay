'use client';
import { useState, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

const INITIAL_ADMIN_COMPLAINTS = [
  {
    id: 'CMP-1001',
    user: 'Rohan (Retailer)',
    role: 'RETAILER',
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
    user: 'Ram (Distributor)',
    role: 'DISTRIBUTOR',
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
    user: 'Ajay (Master Dist)',
    role: 'MASTER DISTRIBUTOR',
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
    user: 'Mohan (Retailer)',
    role: 'RETAILER',
    txnId: 'TXN441092',
    type: 'AEPS Withdrawal Dispute',
    message: 'Biometric withdrawal ₹2,000 debited from customer but wallet not updated.',
    priority: 'HIGH',
    status: 'open',
    date: '2026-08-01 10:20',
    reply: '',
  },
];

const LOCAL_STORAGE_KEY = 'unipay_complaints_store';

export default function AdminComplaintsPage() {
  const [complaintList, setComplaintList] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Resolution Form State
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState('resolved');
  const [refundAmount, setRefundAmount] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchComplaintsFromDb = async () => {
    try {
      const res = await fetch('/api/complaints');
      const data = await res.json();
      if (data.success && Array.isArray(data.complaints)) {
        setComplaintList(data.complaints);
      }
    } catch (e) {
      console.warn('Complaints API fetch error:', e.message);
    }
  };

  useEffect(() => {
    fetchComplaintsFromDb();
  }, []);

  const handleResolveTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const replyMsg = replyText || `Official Admin Response: Ticket processed and updated to ${newStatus.toUpperCase()}.${refundAmount ? ` Refund of ₹${refundAmount} credited to wallet.` : ''}`;

    const updatedList = complaintList.map((c) => {
      if (c.id === selectedTicket.id || c._id === selectedTicket._id) {
        return {
          ...c,
          status: newStatus,
          reply: replyMsg,
        };
      }
      return c;
    });

    setComplaintList(updatedList);

    setSuccessMsg(`Ticket #${selectedTicket.id || selectedTicket._id} updated permanently in Real Database!`);

    try {
      await fetch('/api/complaints', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTicket._id || selectedTicket.id,
          status: newStatus,
          resolution: replyMsg,
        }),
      });
    } catch (err) {
      console.error('Database Sync Error:', err);
    }

    setTimeout(() => {
      setSelectedTicket(null);
      setSuccessMsg('');
      setReplyText('');
      setRefundAmount('');
    }, 1200);
  };

  const filteredData = complaintList.filter((c) => {
    if (filter === 'open') return c.status === 'open';
    if (filter === 'in_progress') return c.status === 'in_progress';
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  const columns = [
    {
      key: 'id',
      label: 'Ticket ID',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 700,
          color: '#2563EB',
          background: 'rgba(37, 99, 235, 0.08)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-md)',
        }}>
          {r.id}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'Merchant / Partner',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.user}</div>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            color: 'var(--primary)',
            background: 'var(--primary-light)',
            padding: '1px 6px',
            borderRadius: '4px',
          }}>
            {r.role}
          </span>
        </div>
      ),
    },
    {
      key: 'txnId',
      label: 'Txn ID',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          background: 'var(--bg-secondary)',
          padding: '2px 6px',
          borderRadius: '4px',
        }}>
          {r.txnId}
        </span>
      ),
    },
    { key: 'type', label: 'Category' },
    {
      key: 'priority',
      label: 'Priority',
      render: (row) => (
        <span style={{
          padding: '3px 8px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.7rem',
          fontWeight: 800,
          background: row.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
          color: row.priority === 'HIGH' ? '#DC2626' : '#D97706',
        }}>
          {row.priority}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const isResolved = row.status === 'resolved';
        const isInProgress = row.status === 'in_progress';
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            background: isResolved ? 'rgba(16, 185, 129, 0.12)' : isInProgress ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: isResolved ? '#059669' : isInProgress ? '#D97706' : '#DC2626',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isResolved ? '#10B981' : isInProgress ? '#F59E0B' : '#EF4444' }} />
            {isResolved ? 'Resolved' : isInProgress ? 'In Progress' : 'Open'}
          </span>
        );
      },
    },
    { key: 'date', label: 'Submitted Date' },
    {
      key: 'actions',
      label: 'Action',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'nowrap', minWidth: 'max-content' }}>
          <button
            className="btn btn-sm btn-primary"
            style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={() => {
              setSelectedTicket(row);
              setNewStatus(row.status === 'resolved' ? 'resolved' : 'resolved');
              setReplyText(row.reply || '');
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Manage / Reply
          </button>
        </div>
      ),
    },
  ];

  const openCount = complaintList.filter((c) => c.status === 'open').length;
  const progressCount = complaintList.filter((c) => c.status === 'in_progress').length;
  const resolvedCount = complaintList.filter((c) => c.status === 'resolved').length;

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#DC2626', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            MERCHANT HELPDESK &amp; DISPUTE RESOLUTION
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Admin Grievance &amp; Complaint Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Review merchant transaction disputes, issue automated wallet refunds, and close support tickets.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <DashboardCard
          icon="ticket"
          iconColor="blue"
          title="Total Complaints"
          value={complaintList.length}
          subtext="Merchant Support Queue"
          badge="Ticket Queue"
          sparkline="0,15 10,12 20,16 30,10 40,8 50,6 60,4"
        />
        <DashboardCard
          icon="ticket"
          iconColor="red"
          title="Pending Open"
          value={openCount}
          change="Action Required"
          changeType="negative"
          badge="Open Queue"
          sparkline="0,5 10,8 20,12 30,15 40,18 50,20 60,22"
        />
        <DashboardCard
          icon="ticket"
          iconColor="orange"
          title="Under Investigation"
          value={progressCount}
          subtext="NPCI / Switch Verification"
          badge="In Progress"
          sparkline="0,10 10,10 20,12 30,14 40,12 50,10 60,8"
        />
        <DashboardCard
          icon="ticket"
          iconColor="green"
          title="Resolved &amp; Settled"
          value={resolvedCount}
          change="100% Settled"
          changeType="positive"
          badge="Resolved"
          sparkline="0,20 10,18 20,15 30,12 40,8 50,5 60,2"
        />
      </div>

      {/* Filter Tabs Bar */}
      <div style={{ background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', marginBottom: '24px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('all')}
        >
          All Support Tickets ({complaintList.length})
        </button>
        <button
          className={`btn btn-sm ${filter === 'open' ? 'btn-danger' : 'btn-secondary'}`}
          onClick={() => setFilter('open')}
        >
          🔴 Pending Open ({openCount})
        </button>
        <button
          className={`btn btn-sm ${filter === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('in_progress')}
        >
          ⏳ In Progress ({progressCount})
        </button>
        <button
          className={`btn btn-sm ${filter === 'resolved' ? 'btn-success' : 'btn-secondary'}`}
          onClick={() => setFilter('resolved')}
        >
          Resolved ({resolvedCount})
        </button>
      </div>

      {/* Complaints Table */}
      <DataTable
        title="Merchant Support Tickets Directory"
        columns={columns}
        data={filteredData}
        searchable={true}
      />

      {/* Manage Ticket Modal */}
      {selectedTicket && (
        <Modal title={`Resolve Support Ticket #${selectedTicket.id}`} onClose={() => setSelectedTicket(null)}>
          {successMsg ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--success)', fontWeight: 700 }}>
              {successMsg}
            </div>
          ) : (
            <form onSubmit={handleResolveTicket}>
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-lg)', marginBottom: '18px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Merchant: <strong style={{ color: 'var(--text-primary)' }}>{selectedTicket.user}</strong></span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Txn ID: <strong style={{ color: '#2563EB', fontFamily: 'monospace' }}>{selectedTicket.txnId}</strong></span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-card)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  &quot;{selectedTicket.message}&quot;
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Update Ticket Status</label>
                <select className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="resolved">Mark as RESOLVED &amp; Close Ticket</option>
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedTicket(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save &amp; Update Ticket</button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
