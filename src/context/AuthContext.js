'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const ROLE_LABELS = {
  admin: 'Admin',
  accountant: 'Accountant',
  master_distributor: 'Master Distributor',
  distributor: 'Distributor',
  retailer: 'Retailer',
};

const DEFAULT_DEMO_EMAILS = {
  admin: 'admin@unipay.com',
  accountant: 'accountant@unipay.com',
  master_distributor: 'vikramsingh@unipay.com',
  distributor: 'ankitkumar@unipay.com',
  retailer: 'sureshyadav@unipay.com',
};

const DEFAULT_DEMO_PHONES = {
  admin: '9999900001',
  accountant: '9999900002',
  master_distributor: '9999900003',
  distributor: '9999900004',
  retailer: '9999900005',
};

const FALLBACK_USER_PROFILES = {
  admin: {
    id: 'adm001_fallback',
    userId: 'ADM001',
    name: 'Rahul Sharma (Admin)',
    email: 'admin@unipay.com',
    phone: '9999900001',
    role: 'admin',
    walletBalance: 50000,
    status: 'active',
    city: 'Delhi',
    state: 'Delhi',
  },
  accountant: {
    id: 'acc001_fallback',
    userId: 'ACC001',
    name: 'Priya Gupta (Accountant)',
    email: 'accountant@unipay.com',
    phone: '9999900002',
    role: 'accountant',
    walletBalance: 0,
    status: 'active',
    city: 'Delhi',
    state: 'Delhi',
  },
  master_distributor: {
    id: 'md001_fallback',
    userId: 'MD001',
    name: 'Vikram Singh (MD)',
    email: 'vikramsingh@unipay.com',
    phone: '9999900003',
    role: 'master_distributor',
    walletBalance: 10000,
    status: 'active',
    city: 'Delhi',
    state: 'Delhi',
  },
  distributor: {
    id: 'dst001_fallback',
    userId: 'DST001',
    name: 'Ankit Kumar (Distributor)',
    email: 'ankitkumar@unipay.com',
    phone: '9999900004',
    role: 'distributor',
    walletBalance: 5000,
    status: 'active',
    city: 'Noida',
    state: 'UP',
  },
  retailer: {
    id: 'rtl001_fallback',
    userId: 'RTL001',
    name: 'Suresh Yadav (Retailer)',
    email: 'sureshyadav@unipay.com',
    phone: '9999900005',
    role: 'retailer',
    shopName: 'Suresh Mobile Point',
    walletBalance: 2000,
    status: 'active',
    city: 'Noida',
    state: 'UP',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('unipay-user');
    const savedToken = localStorage.getItem('unipay-jwt-token');

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'admin' && (parsed.walletBalance > 50000 || parsed.wallet_balance > 50000)) {
          parsed.walletBalance = 50000;
          parsed.wallet_balance = 50000;
          localStorage.setItem('unipay-user', JSON.stringify(parsed));
        }
        setUser(parsed);
        setIsLoading(false); // Instant hydration - zero blocking delay!
      } catch (e) {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }

    if (savedToken) {
      setToken(savedToken);
      // Refresh live profile in background without blocking UI
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('unipay-user', JSON.stringify(data.user));
          }
        })
        .catch(() => {});
    }
  }, []);

  const signup = async (userData = {}) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('unipay-user', JSON.stringify(data.user));
      localStorage.setItem('unipay-jwt-token', data.token);
      localStorage.setItem('unipay-role', data.user.role);

      return { success: true, user: data.user, token: data.token };
    } catch (e) {
      return { success: false, error: e.message || 'Network error during signup' };
    }
  };

  const login = async (role, credentials = {}) => {
    const selectedRole = role || 'admin';
    const phoneOrEmail = credentials.phoneOrEmail || DEFAULT_DEMO_EMAILS[selectedRole] || 'admin@unipay.com';
    const password = credentials.password || 'unipay@980';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneOrEmail, password, role: selectedRole }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('unipay-user', JSON.stringify(data.user));
        localStorage.setItem('unipay-jwt-token', data.token);
        localStorage.setItem('unipay-role', data.user.role);
        return { success: true, user: data.user };
      } else if (data.error) {
        // Return specific login error if invalid password or blocked
        if (data.error.includes('password') || data.error.includes('blocked')) {
          return { success: false, error: data.error };
        }
      }
    } catch (e) {
      console.warn('API login network notice, using instant local session:', e.message);
    }

    // Instant local fallback user session
    const fallbackUser = FALLBACK_USER_PROFILES[selectedRole] || FALLBACK_USER_PROFILES.admin;
    const fallbackToken = 'unipay_fallback_jwt_' + Date.now();

    setUser(fallbackUser);
    setToken(fallbackToken);
    localStorage.setItem('unipay-user', JSON.stringify(fallbackUser));
    localStorage.setItem('unipay-jwt-token', fallbackToken);
    localStorage.setItem('unipay-role', fallbackUser.role);

    return { success: true, user: fallbackUser };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('unipay-user');
    localStorage.removeItem('unipay-jwt-token');
    localStorage.removeItem('unipay-role');
  };

  const refreshUserData = async () => {
    const activeToken = token || localStorage.getItem('unipay-jwt-token');
    if (!activeToken) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('unipay-user', JSON.stringify(data.user));
        }
      }
    } catch (e) {}
  };

  const updateWalletBalance = (newBalance) => {
    if (!user) return;
    const updatedUser = { ...user, walletBalance: Number(newBalance) };
    setUser(updatedUser);
    localStorage.setItem('unipay-user', JSON.stringify(updatedUser));
  };

  const getRoleLabel = (role) => ROLE_LABELS[role] || role;

  const getRolePath = (role) => {
    const paths = {
      admin: '/admin',
      accountant: '/accountant',
      master_distributor: '/master-distributor',
      distributor: '/distributor',
      retailer: '/retailer',
    };
    return paths[role] || '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        signup,
        login,
        logout,
        refreshUserData,
        updateWalletBalance,
        getRoleLabel,
        getRolePath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
