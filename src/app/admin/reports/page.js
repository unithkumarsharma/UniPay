'use client';
import { useState } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { recentTransactions as initialTransactions } from '@/data/mockData';

export default function AdminReportsPage() {
  const [dateFilter, setDateFilter] = useState('Today');
  const [serviceFilter, setServiceFilter] = useState('All Services');

  const columns = [
    {
      key: 'id',
      label: 'Txn ID',
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
      key: 'type',
      label: 'Service Type',
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '6px',
            background: 'rgba(37, 99, 235, 0.1)',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.type}</span>
        </div>
      ),
    },
    { key: 'user', label: 'Merchant / User' },
    {
      key: 'amount',
      label: 'Amount',
      render: (r) => (
        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
          ₹{(r.amount || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'commission',
      label: 'Commission Paid',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 700,
          color: '#10B981',
          background: 'rgba(16, 185, 129, 0.08)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-md)',
        }}>
          ₹{r.commission}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => {
        const isSuccess = r.status === 'success';
        const isPending = r.status === 'pending';
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            background: isSuccess ? 'rgba(16, 185, 129, 0.12)' : isPending ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: isSuccess ? '#059669' : isPending ? '#D97706' : '#DC2626',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isSuccess ? '#10B981' : isPending ? '#F59E0B' : '#EF4444' }} />
            {r.status}
          </span>
        );
      },
    },
    { key: 'time', label: 'Time' },
  ];

  const handleExportCSV = () => {
    alert('Exporting Transaction Audit Report to CSV file...');
  };

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            REAL-TIME SYSTEM ANALYTICS &amp; AUDIT LEDGER
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Reports &amp; Business Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Track volume metrics, net profit margins, commission payouts, and live audit ledgers.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <DashboardCard
          icon="reports"
          iconColor="blue"
          title="Total Transactions"
          value="45,230"
          change="+12% this month"
          changeType="positive"
          badge="Network Volume"
          sparkline="0,20 10,15 20,18 30,12 40,8 50,5 60,2"
        />
        <DashboardCard
          icon="wallet"
          iconColor="green"
          title="Total Revenue Volume"
          value="₹18,45,000"
          change="+8% this month"
          changeType="positive"
          badge="Gross Revenue"
          sparkline="0,22 10,18 20,14 30,10 40,6 50,4 60,1"
        />
        <DashboardCard
          icon="commission"
          iconColor="purple"
          title="Commission Distributed"
          value="₹2,34,500"
          change="Distributed across all tiers"
          badge="Payout Pool"
          sparkline="0,18 10,14 20,16 30,12 40,9 50,6 60,3"
        />
        <DashboardCard
          icon="zap"
          iconColor="orange"
          title="Net Admin Profit"
          value="₹5,67,800"
          change="+22% this month"
          changeType="positive"
          badge="Net Margin"
          sparkline="0,24 10,19 20,15 30,11 40,7 50,3 60,1"
        />
      </div>

      {/* Controls & Export Bar */}
      <div style={{ background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          <select
            className="form-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ width: '160px', fontSize: '0.85rem' }}
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="Custom Range">Custom Range</option>
          </select>

          <select
            className="form-select"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            style={{ width: '180px', fontSize: '0.85rem' }}
          >
            <option value="All Services">All Services</option>
            <option value="Mobile Recharge">Mobile Recharge</option>
            <option value="DTH Recharge">DTH Recharge</option>
            <option value="Electricity Bill">Electricity Bill</option>
            <option value="Money Transfer">Money Transfer</option>
            <option value="PAN Card">PAN Card</option>
          </select>
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
          Export CSV Report
        </button>
      </div>

      {/* Transaction Report Table */}
      <DataTable
        title="Transaction Audit Ledger"
        columns={columns}
        data={initialTransactions}
        searchable={true}
      />
    </>
  );
}
