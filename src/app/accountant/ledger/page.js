'use client';
import { useState } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { ledgerEntries as initialLedger } from '@/data/mockData';

export default function LedgerPage() {
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-02');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredEntries = initialLedger.filter((entry) => {
    if (typeFilter === 'Credit') return entry.type === 'credit';
    if (typeFilter === 'Debit') return entry.type === 'debit';
    return true;
  });

  const columns = [
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
    { key: 'date', label: 'Date & Time' },
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
      label: 'Amount (₹)',
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

  const handleExportCSV = () => {
    alert('Exporting General Ledger Statements to CSV...');
  };

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            </svg>
            DOUBLE ENTRY FINANCIAL LEDGER &amp; AUDIT TRAIL
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Company General Ledger
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Immutable audit record of all platform credit inflows, commission debits, and escrow bank balances.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleExportCSV}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV Ledger
        </button>
      </div>

      {/* Primary KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <DashboardCard
          icon="reports"
          iconColor="green"
          title="Gross Credit Inflows"
          value="₹45,20,850"
          change="+18% volume"
          changeType="positive"
          badge="Credit Stream"
          sparkline="0,20 10,18 20,14 30,10 40,8 50,4 60,1"
        />
        <DashboardCard
          icon="zap"
          iconColor="red"
          title="Gross Debit Outflows"
          value="₹40,10,200"
          change="-12% payouts"
          changeType="negative"
          badge="Debit Stream"
          sparkline="0,10 10,12 20,14 30,16 40,18 50,15 60,12"
        />
        <DashboardCard
          icon="wallet"
          iconColor="blue"
          title="Closing Reserve Balance"
          value="₹5,10,650"
          subtext="Audited Escrow Balance"
          badge="Closing Pool"
          sparkline="0,15 10,15 20,12 30,14 40,10 50,8 60,4"
        />
      </div>

      {/* Controls & Date Filter Bar */}
      <div style={{ background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Date &amp; Type Filter:
          </span>

          <input
            type="date"
            className="form-input"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ width: '150px', fontSize: '0.82rem', padding: '6px 10px' }}
          />

          <input
            type="date"
            className="form-input"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ width: '150px', fontSize: '0.82rem', padding: '6px 10px' }}
          />

          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ width: '150px', fontSize: '0.82rem' }}
          >
            <option value="All">All Entry Types</option>
            <option value="Credit">Credit Only</option>
            <option value="Debit">Debit Only</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <DataTable
        title="Double-Entry Ledger Audit Log"
        columns={columns}
        data={filteredEntries}
        searchable={true}
      />
    </>
  );
}
