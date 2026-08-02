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

const DEFAULT_DEMO_PHONES = {
  admin: '9876543210',
  accountant: '9876543211',
  master_distributor: '9876543212',
  distributor: '9876543213',
  retailer: '9876543214',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure DB is seeded on app startup
    fetch('/api/seed').catch(() => {});

    const savedUser = localStorage.getItem('unipay-user');
    const savedToken = localStorage.getItem('unipay-jwt-token');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
    if (savedToken) {
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (role, credentials = {}) => {
    try {
      const phoneOrEmail = credentials.phoneOrEmail || DEFAULT_DEMO_PHONES[role] || '9876543210';
      const password = credentials.password || '123456';

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneOrEmail, password, role }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('unipay-user', JSON.stringify(data.user));
        localStorage.setItem('unipay-jwt-token', data.token);
        localStorage.setItem('unipay-role', data.user.role);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('unipay-user');
    localStorage.removeItem('unipay-jwt-token');
    localStorage.removeItem('unipay-role');
  };

  const refreshUserData = async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`/api/users/${user._id}`);
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('unipay-user', JSON.stringify(data.user));
      }
    } catch (e) {}
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
        login,
        logout,
        refreshUserData,
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
