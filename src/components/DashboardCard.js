'use client';
import styles from './DashboardCard.module.css';

export default function DashboardCard({ icon, iconColor = 'blue', title, value, change, changeType = 'positive', subtext, badge, sparkline }) {
  return (
    <div className={styles.card}>
      <div className={styles.info} style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <h3 className={styles.title}>{title}</h3>
          {badge && (
            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
              {badge}
            </span>
          )}
        </div>
        <p className={styles.value}>{value}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {change && (
            <span className={`${styles.change} ${styles[changeType]}`}>
              {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '•'} {change}
            </span>
          )}
          {subtext && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              {subtext}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <div className={`${styles.icon} ${styles[iconColor]}`}>
          {icon}
        </div>
        {sparkline && (
          <svg width="60" height="24" viewBox="0 0 60 24" style={{ overflow: 'visible' }}>
            <polyline
              fill="none"
              stroke={changeType === 'positive' ? '#10B981' : changeType === 'negative' ? '#EF4444' : '#3B82F6'}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparkline}
            />
          </svg>
        )}
      </div>
    </div>
  );
}
