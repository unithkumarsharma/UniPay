'use client';
import styles from './DashboardCard.module.css';

// Professional Fintech SVG Icons
const iconMap = {
  users: (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  lightning: (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  wallet: (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  services: (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  masterDistributor: (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="21" x2="21" y2="21" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7 12 2" />
    </svg>
  ),
  distributor: (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  retailer: (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  ticket: (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

export default function DashboardCard({
  icon,
  iconColor = 'blue',
  title,
  value,
  change,
  changeType = 'positive',
  subtext,
  badge,
  sparkline
}) {
  // If icon is a key in iconMap, use the SVG icon; otherwise render icon prop if provided
  const renderedIcon = typeof icon === 'string' && iconMap[icon] ? iconMap[icon] : (
    // Fallback emoji to SVG mappings
    icon === '👥' ? iconMap.users :
    icon === '⚡' ? iconMap.lightning :
    icon === '💰' ? iconMap.wallet :
    icon === '🛍️' ? iconMap.services :
    icon === '🏛️' ? iconMap.masterDistributor :
    icon === '🏪' ? iconMap.distributor :
    icon === '🛒' ? iconMap.retailer :
    icon === '📩' ? iconMap.ticket : icon
  );

  return (
    <div className={styles.card}>
      {/* Header Row: Icon + Title on left, Badge on right */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={`${styles.icon} ${styles[iconColor]}`}>
            {renderedIcon}
          </div>
          <h3 className={styles.title}>{title}</h3>
        </div>
        {badge && (
          <span className={styles.badge}>
            {badge}
          </span>
        )}
      </div>

      {/* Metric Value */}
      <div className={styles.value}>{value}</div>

      {/* Footer Row: Change/Subtext on left, Sparkline graph on right */}
      <div className={styles.footer}>
        <div>
          {change ? (
            <span className={`${styles.change} ${styles[changeType]}`}>
              {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '•'} {change}
            </span>
          ) : subtext ? (
            <span className={styles.subtext}>{subtext}</span>
          ) : null}
        </div>

        {sparkline && (
          <svg width="64" height="22" viewBox="0 0 60 24" style={{ overflow: 'visible' }}>
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
