'use client';
import { useTheme } from '@/context/ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className={`${styles.icon} ${theme === 'light' ? styles.active : ''}`}>☀️</span>
      <span className={`${styles.icon} ${theme === 'dark' ? styles.active : ''}`}>🌙</span>
      <span className={`${styles.slider} ${theme === 'dark' ? styles.sliderDark : ''}`} />
    </button>
  );
}
