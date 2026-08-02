'use client';
import { useState } from 'react';
import styles from './DataTable.module.css';

export default function DataTable({ title, columns, data = [], actions, searchable = false, filterTabs = null }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const getStatusClass = (status) => {
    const map = {
      success: 'success', approved: 'success', active: 'success', resolved: 'success',
      pending: 'warning', in_progress: 'warning',
      failed: 'danger', rejected: 'danger', blocked: 'danger',
      open: 'info', high: 'danger', medium: 'warning', low: 'info',
    };
    return map[status] || 'info';
  };

  const filteredData = data.filter((row) => {
    // Tab filter
    if (activeTab !== 'ALL') {
      const matchTab = Object.values(row).some(
        val => String(val).toLowerCase() === activeTab.toLowerCase()
      );
      if (!matchTab) return false;
    }
    // Search filter
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      return Object.values(row).some(
        val => String(val).toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className={styles.container}>
      {(title || actions || searchable || filterTabs) && (
        <div className={styles.header} style={{ flexDirection: 'column', gap: '14px', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            {title && (
              <h3 className={styles.title}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563EB' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
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
                        borderColor: activeTab === tab.key ? '#2563EB' : 'var(--border-color)',
                        background: activeTab === tab.key ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                        color: activeTab === tab.key ? '#2563EB' : 'var(--text-secondary)',
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
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  No matching transaction entries found
                </td>
              </tr>
            ) : (
              filteredData.map((row, i) => (
                <tr key={row.id || i}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.key === 'id' ? (
                        <span className={styles.txnId}>{row[col.key]}</span>
                      ) : col.key === 'status' || col.key === 'priority' ? (
                        <span className={`${styles.badge} ${styles[getStatusClass(row[col.key])]}`}>
                          <span className={styles.statusDot} />
                          {row[col.key]?.replace('_', ' ')}
                        </span>
                      ) : col.key === 'amount' || col.key === 'balance' ? (
                        <span className={styles.amount}>₹{Number(row[col.key]).toLocaleString('en-IN')}</span>
                      ) : col.render ? (
                        col.render(row)
                      ) : (
                        row[col.key]
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
  );
}
