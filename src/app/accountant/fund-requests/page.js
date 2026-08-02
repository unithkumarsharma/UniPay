'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import DataTable from '@/components/DataTable';

export default function FundRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/fund-requests');
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      const res = await fetch(`/api/fund-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          processedBy: user?._id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchRequests();
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const columns = [
    { key: 'requestId', label: 'Request ID' },
    { key: 'userId', label: 'Requested By', render: (r) => `${r.userId?.name || 'User'} (${r.userId?.userId || ''})` },
    { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount?.toLocaleString('en-IN')}` },
    { key: 'paymentMethod', label: 'Payment Method', render: (r) => r.paymentMethod?.replace('_', ' ').toUpperCase() },
    { key: 'utrNumber', label: 'UTR / Ref No.' },
    { key: 'createdAt', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleString('en-IN') },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) =>
        row.status === 'pending' ? (
          <div className="flex gap-sm">
            <button className="btn btn-sm btn-success" onClick={() => handleAction(row._id, 'approve')}>
              Approve &amp; Credit ₹
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => handleAction(row._id, 'reject')}>
              Reject
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Processed</span>
        ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Fund Requests</h1>
        <p>Approve or reject fund loading requests with instant wallet credit</p>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading requests from database...</div>
      ) : (
        <DataTable title="All Fund Requests" columns={columns} data={requests} />
      )}
    </>
  );
}
