'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import styles from './login.module.css';

const ROLES = [
  { key: 'admin', label: 'Admin', icon: '👑', desc: 'Full system control', defaultEmail: 'admin@unipay.com', defaultPhone: '9999900001' },
  { key: 'accountant', label: 'Accountant', icon: '📊', desc: 'Financial management', defaultEmail: 'accountant@unipay.com', defaultPhone: '9999900002' },
  { key: 'master_distributor', label: 'Master Distributor', icon: '🏛️', desc: 'Vikram Singh', defaultEmail: 'vikramsingh@unipay.com', defaultPhone: '9999900003' },
  { key: 'distributor', label: 'Distributor', icon: '🏪', desc: 'Ankit Kumar', defaultEmail: 'ankitkumar@unipay.com', defaultPhone: '9999900004' },
  { key: 'retailer', label: 'Retailer', icon: '🛒', desc: 'Suresh Yadav', defaultEmail: 'sureshyadav@unipay.com', defaultPhone: '9999900005' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [phoneOrEmail, setPhoneOrEmail] = useState('admin@unipay.com');
  const [password, setPassword] = useState('unipay@980');
  const [isLogging, setIsLogging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, getRolePath } = useAuth();
  const router = useRouter();

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    const roleObj = ROLES.find((r) => r.key === roleKey);
    if (roleObj) {
      setPhoneOrEmail(roleObj.defaultEmail);
      setPassword('unipay@980');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsLogging(true);
    setErrorMsg('');

    const res = await login(selectedRole, { phoneOrEmail, password });

    if (res.success && res.user) {
      router.push(getRolePath(res.user.role));
    } else {
      setErrorMsg(res.error || 'Login failed. Please check credentials.');
    }
    setIsLogging(false);
  };

  const activeRoleObj = ROLES.find(r => r.key === selectedRole);

  return (
    <div className={styles.container}>
      {/* Background decoration */}
      <div className={styles.bgDecor}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>

      {/* Back to Home Button */}
      <Link href="/" className={styles.backHomeBtn}>
        ← Back to Home
      </Link>

      {/* Theme toggle */}
      <div className={styles.themeToggle}>
        <ThemeToggle />
      </div>

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <img src="/logo.png" alt="UniPay" className={styles.logo} />
          <h1 className={styles.title}>UniPay</h1>
          <p className={styles.subtitle}>Smart Payment, Seamless Suvidha</p>
        </div>

        {/* Role Selection */}
        <div className={styles.roleSection}>
          <p className={styles.roleLabel}>Select your role to continue</p>
          <div className={styles.roleGrid}>
            {ROLES.map((role) => (
              <button
                key={role.key}
                type="button"
                className={`${styles.roleCard} ${selectedRole === role.key ? styles.roleActive : ''}`}
                onClick={() => handleRoleSelect(role.key)}
              >
                <span className={styles.roleIcon}>{role.icon}</span>
                <span className={styles.roleName}>{role.label}</span>
                <span className={styles.roleDesc}>{role.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className={styles.formSection}>
          {errorMsg && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              fontSize: '0.82rem',
              fontWeight: 500,
              textAlign: 'center',
            }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Mobile Number / Email ID</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. sureshyadav@unipay.com"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Password</label>
            <input
              type="password"
              className={styles.formInput}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={!selectedRole || isLogging}
          >
            {isLogging ? (
              <span className={styles.spinner}></span>
            ) : (
              <>Login as {activeRoleObj?.label || '...'}</>
            )}
          </button>

          <div style={{
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-hover)',
            border: '1px solid var(--border-color)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginTop: '8px',
          }}>
            🔑 <strong>Demo Credentials:</strong> <code>{activeRoleObj?.defaultEmail}</code> | Pass: <code>unipay@980</code>
          </div>
        </form>
      </div>
    </div>
  );
}
