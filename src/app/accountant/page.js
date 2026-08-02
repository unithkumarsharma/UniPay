'use client';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { ledgerEntries } from '@/data/mockData';

const ledgerColumns = [
  {
    key: 'id',
    label: 'Entry ID',
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
  { key: 'date', label: 'Date' },
  { key: 'description', label: 'Description & Reference' },
  {
    key: 'type',
    label: 'Type',
    render: (row) => {
      const isCredit = row.type === 'credit';
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.72rem',
          fontWeight: 800,
          background: isCredit ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          color: isCredit ? '#059669' : '#DC2626',
          textTransform: 'uppercase',
        }}>
          {isCredit ? '↓ CREDIT' : '↑ DEBIT'}
        </span>
      );
    },
  },
  {
    key: 'amount',
    label: 'Amount',
    render: (r) => (
      <span style={{ fontWeight: 800, color: r.type === 'credit' ? '#10B981' : '#EF4444' }}>
        {r.type === 'credit' ? '+' : '-'}₹{Number(r.amount).toLocaleString('en-IN')}
      </span>
    ),
  },
  {
    key: 'balance',
    label: 'Running Balance',
    render: (r) => (
      <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
        ₹{Number(r.balance).toLocaleString('en-IN')}
      </span>
    ),
  },
];

export default function AccountantDashboard() {
  const handleDownloadLedger = () => {
    alert('Exporting Complete Company Ledger Audit Log to CSV...');
  };

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              <path d="M18 14h-8" />
              <path d="M15 18h-5" />
              <path d="M10 6h8" />
              <path d="M10 10h8" />
            </svg>
            FINANCIAL AUDITING &amp; ACCOUNTING DESK
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Accountant Executive Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Real-time escrow pool management, double-entry financial ledger, and deposit verification.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleDownloadLedger}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Audit Ledger
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <DashboardCard
          icon="wallet"
          iconColor="green"
          title="Company Reserve Pool"
          value="₹50,00,000"
          change="+12% reserve yield"
          changeType="positive"
          badge="Escrow Lock Active"
          sparkline="0,20 10,18 20,14 30,10 40,8 50,4 60,1"
        />
        <DashboardCard
          icon="reports"
          iconColor="blue"
          title="Today's Credits"
          value="₹2,25,000"
          change="+12 transactions"
          changeType="positive"
          badge="Incoming Deposits"
          sparkline="0,22 10,19 20,15 30,12 40,9 50,6 60,3"
        />
        <DashboardCard
          icon="zap"
          iconColor="orange"
          title="Today's Debits"
          value="₹46,950"
          change="-8 transactions"
          changeType="negative"
          badge="Payout Cleared"
          sparkline="0,10 10,12 20,14 30,16 40,18 50,15 60,12"
        />
        <DashboardCard
          icon="ticket"
          iconColor="red"
          title="Pending Fund Requests"
          value="3"
          change="₹1,00,000 total"
          changeType="negative"
          badge="Action Needed"
          sparkline="0,5 10,8 20,12 30,15 40,18 50,20 60,22"
        />
      </div>

      {/* Recent Ledger Entries Table */}
      <DataTable
        title="Recent Financial Ledger Trail"
        columns={ledgerColumns}
        data={ledgerEntries}
        searchable={true}
      />
    </>
  );
}
