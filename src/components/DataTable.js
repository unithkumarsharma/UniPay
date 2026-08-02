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
        <div className={styles.header} style={{ flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {actions && <div className={styles.actions}>{actions}</div>}
          </div>

          {(searchable || filterTabs) && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
              {filterTabs && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {filterTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        padding: '4px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
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
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search logs, IDs, users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 12px 6px 32px',
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
                  No matching data found
                </td>
              </tr>
            ) : (
              filteredData.map((row, i) => (
                <tr key={row.id || i}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.key === 'status' || col.key === 'priority' ? (
                        <span className={`${styles.badge} ${styles[getStatusClass(row[col.key])]}`}>
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
