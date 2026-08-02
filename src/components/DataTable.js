'use client';
import styles from './DataTable.module.css';

export default function DataTable({ title, columns, data, actions }) {
  const getStatusClass = (status) => {
    const map = {
      success: 'success', approved: 'success', active: 'success', resolved: 'success',
      pending: 'warning', in_progress: 'warning',
      failed: 'danger', rejected: 'danger', blocked: 'danger',
      open: 'info', high: 'danger', medium: 'warning', low: 'info',
    };
    return map[status] || 'info';
  };

  return (
    <div className={styles.container}>
      {(title || actions) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {actions && <div className={styles.actions}>{actions}</div>}
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
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
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
