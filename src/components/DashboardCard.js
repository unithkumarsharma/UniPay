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
  zap: (
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
  reports: (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  commission: (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
    icon === '👥' || icon === 'users' ? iconMap.users :
    icon === '⚡' || icon === 'lightning' ? iconMap.lightning :
    icon === 'zap' ? iconMap.zap :
    icon === '💰' || icon === 'wallet' ? iconMap.wallet :
    icon === '🛍️' || icon === 'services' ? iconMap.services :
    icon === '🏛️' || icon === 'masterDistributor' ? iconMap.masterDistributor :
    icon === '🏪' || icon === 'distributor' ? iconMap.distributor :
    icon === '🛒' || icon === 'retailer' ? iconMap.retailer :
    icon === '📊' || icon === 'reports' ? iconMap.reports :
    icon === '💎' || icon === 'commission' ? iconMap.commission :
    icon === '📩' || icon === 'ticket' ? iconMap.ticket : null
  );

  return (
    <div className={styles.card}>
      {/* Header Row: Icon + Title on left, Badge on right */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          {renderedIcon && (
            <div className={`${styles.icon} ${styles[iconColor]}`}>
              {renderedIcon}
            </div>
          )}
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
