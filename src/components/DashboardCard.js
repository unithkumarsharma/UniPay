'use client';
import styles from './DashboardCard.module.css';

export default function DashboardCard({ icon, iconColor = 'blue', title, value, change, changeType = 'positive' }) {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value}>{value}</p>
        {change && (
          <span className={`${styles.change} ${styles[changeType]}`}>
            {changeType === 'positive' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <div className={`${styles.icon} ${styles[iconColor]}`}>
        {icon}
      </div>
    </div>
  );
}
