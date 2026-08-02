'use client';
import { useState } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';

const MOCK_SETTLEMENTS = [
  {
    id: 'SET-8001',
    user: 'Suresh Yadav',
    userId: 'RTL001',
    role: 'RETAILER',
    amount: 12500,
    bankName: 'HDFC Bank',
    accountNo: '•••• 4892',
    ifsc: 'HDFC0000123',
    status: 'pending',
    date: '2026-08-02',
  },
  {
    id: 'SET-8002',
    user: 'Ankit Kumar',
    userId: 'DST001',
    role: 'DISTRIBUTOR',
    amount: 32500,
    bankName: 'State Bank of India',
    accountNo: '•••• 9912',
    ifsc: 'SBIN0004567',
    status: 'pending',
    date: '2026-08-02',
  },
  {
    id: 'SET-8003',
    user: 'Vikram Singh',
    userId: 'MD001',
    role: 'MASTER DISTRIBUTOR',
    amount: 234500,
    bankName: 'ICICI Bank',
    accountNo: '•••• 1102',
    ifsc: 'ICIC0009876',
    status: 'settled',
    date: '2026-08-01',
  },
];

export default function SettlementsPage() {
  const [settlementList, setSettlementList] = useState(MOCK_SETTLEMENTS);

  const handleProcessBatch = () => {
    const updated = settlementList.map((s) => ({ ...s, status: 'settled' }));
    setSettlementList(updated);
    alert('All pending commission settlements have been processed and dispatched to Escrow Bank Gateway!');
  };

  const handleSingleSettlement = (id) => {
    const updated = settlementList.map((s) => (s.id === id ? { ...s, status: 'settled' } : s));
    setSettlementList(updated);
    alert(`Settlement ${id} processed successfully!`);
  };

  const columns = [
    {
      key: 'id',
      label: 'Settlement ID',
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
      label: 'Partner Merchant',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.user}</div>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '1px 6px', borderRadius: '4px' }}>
            {r.role} ({r.userId})
          </span>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Settlement Amount (₹)',
      render: (r) => (
        <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.95rem' }}>
          ₹{r.amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'bankName',
      label: 'Bank Account Details',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{r.bankName}</div>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {r.accountNo} | {r.ifsc}
          </span>
        </div>
      ),
    },
    { key: 'date', label: 'Batch Date' },
    {
      key: 'status',
      label: 'Status',
      render: (r) => {
        const isSettled = r.status === 'settled';
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            background: isSettled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: isSettled ? '#059669' : '#D97706',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isSettled ? '#10B981' : '#F59E0B' }} />
            {isSettled ? 'Settled' : 'Pending Batch'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Action',
      render: (row) =>
        row.status === 'pending' ? (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'nowrap', minWidth: 'max-content' }}>
            <button
              className="btn btn-sm btn-success"
              style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={() => handleSingleSettlement(row.id)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Process Payout
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Dispatched</span>
        ),
    },
  ];

  const pendingAmount = settlementList
    .filter((s) => s.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const settledAmount = settlementList
    .filter((s) => s.status === 'settled')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            COMMISSION PAYOUT &amp; BANK SETTLEMENT DESK
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Commission Settlements &amp; Bank Payouts
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Process partner commission payouts, execute batch NEFT/IMPS bank settlements, and audit bank references.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleProcessBatch}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Process All Pending Settlements
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <DashboardCard
          icon="commission"
          iconColor="purple"
          title="Pending Settlement Pool"
          value={`₹${pendingAmount.toLocaleString('en-IN')}`}
          subtext="Awaiting Weekly Batch"
          badge="Pending Pool"
          sparkline="0,18 10,14 20,16 30,12 40,9 50,6 60,3"
        />
        <DashboardCard
          icon="wallet"
          iconColor="green"
          title="Settled This Month"
          value={`₹${settledAmount.toLocaleString('en-IN')}`}
          change="89 transactions cleared"
          changeType="positive"
          badge="Escrow Dispatched"
          sparkline="0,20 10,18 20,15 30,12 40,8 50,5 60,2"
        />
        <DashboardCard
          icon="zap"
          iconColor="blue"
          title="Next Batch Dispatch"
          value="Aug 5, 2026"
          subtext="Auto Scheduled 23:30 IST"
          badge="Auto-Scheduled"
          sparkline="0,15 10,15 20,10 30,10 40,5 50,5 60,5"
        />
      </div>

      {/* Settlement Directory Table */}
      <DataTable
        title="Pending &amp; Processed Merchant Payout Batches"
        columns={columns}
        data={settlementList}
        searchable={true}
      />
    </>
  );
}
