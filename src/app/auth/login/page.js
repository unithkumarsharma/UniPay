'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import styles from './login.module.css';

const ROLES = [
  { key: 'admin', label: 'Admin', icon: '👑', desc: 'Full system control', defaultPhone: '9876543210' },
  { key: 'accountant', label: 'Accountant', icon: '📊', desc: 'Financial management', defaultPhone: '9876543211' },
  { key: 'master_distributor', label: 'Master Distributor', icon: '🏛️', desc: 'State/Zone level', defaultPhone: '9876543212' },
  { key: 'distributor', label: 'Distributor', icon: '🏪', desc: 'City/District level', defaultPhone: '9876543213' },
  { key: 'retailer', label: 'Retailer', icon: '🛒', desc: 'Shop level operations', defaultPhone: '9876543214' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [phoneOrEmail, setPhoneOrEmail] = useState('9876543210');
  const [password, setPassword] = useState('123456');
  const [isLogging, setIsLogging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, getRolePath } = useAuth();
  const router = useRouter();

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    const roleObj = ROLES.find((r) => r.key === roleKey);
    if (roleObj) {
      setPhoneOrEmail(roleObj.defaultPhone);
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

  return (
    <div className={styles.container}>
      {/* Background decoration */}
      <div className={styles.bgDecor}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>

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
            <label className={styles.formLabel}>Mobile Number / Email</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Enter mobile or email"
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
              <>Login as {selectedRole ? ROLES.find(r => r.key === selectedRole)?.label : '...'}</>
            )}
          </button>

          <p className={styles.demoNote}>
            🔐 Real DB Auth Active — Default password: <code>123456</code>
          </p>
        </form>
      </div>
    </div>
  );
}
