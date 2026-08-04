'use client';

import { useState } from 'react';
import styles from './DataTable.module.css';
import ReceiptModal from './ReceiptModal';
import ServiceIcon from './ServiceIcon';

export default function DataTable({ 
  title, 
  columns, 
  data = [], 
  actions, 
  searchable = false, 
  filterTabs = null,
  enableReceipt = true 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const getStatusClass = (status) => {
    const map = {
      success: 'success', approved: 'success', active: 'success', resolved: 'success',
      pending: 'warning', in_progress: 'warning',
      failed: 'danger', rejected: 'danger', blocked: 'danger',
      open: 'info', high: 'danger', medium: 'warning', low: 'info',
    };
    return map[status] || 'info';
  };

  const getTypeServiceId = (typeStr) => {
    if (!typeStr) return 'default';
    const lower = String(typeStr).toLowerCase();
    if (lower.includes('prepaid') || (lower.includes('mobile') && !lower.includes('postpaid'))) return 'mobile_prepaid';
    if (lower.includes('postpaid')) return 'mobile_postpaid';
    if (lower.includes('dth') || lower.includes('tv')) return 'dth';
    if (lower.includes('electricity')) return 'electricity';
    if (lower.includes('gas')) return 'gas';
    if (lower.includes('water')) return 'water';
    if (lower.includes('money') || lower.includes('dmt') || lower.includes('transfer') || lower.includes('remittance')) return 'dmt_1';
    if (lower.includes('aeps') || lower.includes('withdrawal')) return 'aeps_withdrawal';
    if (lower.includes('pan')) return 'pan_card';
    if (lower.includes('irctc') || lower.includes('rail') || lower.includes('train')) return 'irctc_train';
    if (lower.includes('flight')) return 'flight';
    if (lower.includes('bus')) return 'bus';
    if (lower.includes('hotel')) return 'hotel';
    if (lower.includes('fastag')) return 'fastag';
    if (lower.includes('wallet')) return 'wallet_plus';
    return 'default';
  };

  // Clean raw emojis from string
  const cleanText = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
  };

  const filteredData = data.filter((row) => {
    if (activeTab !== 'ALL') {
      const matchTab = Object.values(row).some(
        val => String(val).toLowerCase() === activeTab.toLowerCase()
      );
      if (!matchTab) return false;
    }
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      return Object.values(row).some(
        val => String(val).toLowerCase().includes(query)
      );
    }
    return true;
  });

  const isTxnTable = enableReceipt && (
    columns.some(col => col.key === 'id' || col.key === 'type' || col.key === 'amount') ||
    data.some(d => d.id?.startsWith?.('TXN') || d.amount)
  );

  const hasActionCol = columns.some(col => col.key === 'action' || col.key === 'actions');
  
  const displayColumns = [...columns];
  if (isTxnTable && !hasActionCol) {
    displayColumns.push({
      key: 'auto_receipt_action',
      label: 'Tax Receipt',
      render: (row) => (
        <button
          onClick={() => setSelectedReceipt(row)}
          style={{
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            border: '1px solid var(--border-color)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print Receipt
        </button>
      )
    });
  }

  return (
    <>
      <div className={styles.container}>
        {(title || actions || searchable || filterTabs) && (
          <div className={styles.header} style={{ flexDirection: 'column', gap: '14px', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              {title && (
                <h3 className={styles.title}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  {title}
                </h3>
              )}
              {actions && <div className={styles.actions}>{actions}</div>}
            </div>

            {(searchable || filterTabs) && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                {filterTabs && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {filterTabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                          padding: '5px 14px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid',
                          borderColor: activeTab === tab.key ? 'var(--primary)' : 'var(--border-color)',
                          background: activeTab === tab.key ? 'var(--primary-light)' : 'transparent',
                          color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {tab.label} {tab.count !== undefined ? `(${tab.count})` : ''}
                      </button>
                    ))}
                  </div>
                )}

                {searchable && (
                  <div style={{ position: 'relative', minWidth: '220px', flex: '1', maxWidth: '320px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Filter by ID, user, category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                )}
              </div>
            )}
          </div>
        )}

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {displayColumns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={displayColumns.length} className={styles.empty}>
                    No matching entries found
                  </td>
                </tr>
              ) : (
                filteredData.map((row, i) => (
                  <tr key={row.id || row._id || row.requestId || i}>
                    {displayColumns.map((col) => (
                      <td key={col.key}>
                        {col.key === 'id' ? (
                          <span 
                            className={styles.txnId}
                            onClick={() => setSelectedReceipt(row)}
                            title="Click to view & print receipt"
                            style={{ cursor: 'pointer' }}
                          >
                            {row[col.key]}
                          </span>
                        ) : col.key === 'type' || col.key === 'service' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ServiceIcon id={getTypeServiceId(row[col.key])} name={row[col.key]} size={28} />
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                              {cleanText(row[col.key])}
                            </span>
                          </div>
                        ) : col.key === 'status' || col.key === 'priority' ? (
                          <span className={`${styles.badge} ${styles[getStatusClass(row[col.key])]}`}>
                            <span className={styles.statusDot} />
                            {String(row[col.key]).replace('_', ' ')}
                          </span>
                        ) : col.key === 'commission' ? (
                          <span style={{ color: 'var(--success)', fontWeight: 800 }}>
                            +₹{Number(row[col.key]).toFixed(1)}
                          </span>
                        ) : col.key === 'amount' || col.key === 'balance' ? (
                          <span className={styles.amount}>₹{Number(row[col.key]).toLocaleString('en-IN')}</span>
                        ) : col.render ? (
                          col.render(row)
                        ) : (
                          cleanText(row[col.key])
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal 
          transaction={selectedReceipt} 
          onClose={() => setSelectedReceipt(null)} 
        />
      )}
    </>
  );
}
