'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { rtdb, ref, onValue } from '@/lib/firebase';

const AuthContext = createContext();

const ROLE_LABELS = {
  admin: 'Admin',
  accountant: 'Accountant',
  master_distributor: 'Master Distributor',
  distributor: 'Distributor',
  retailer: 'Retailer',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore session from sessionStorage
  useEffect(() => {
    const savedToken = sessionStorage.getItem('unipay-token');
    const savedRole = sessionStorage.getItem('unipay-role');
    const savedUserId = sessionStorage.getItem('unipay-userId');

    if (savedToken && savedUserId) {
      setToken(savedToken);
      fetchUserFromDB(savedToken, savedUserId, savedRole).finally(() => setIsLoading(false));
    } else {
      const legacyToken = localStorage.getItem('unipay-jwt-token');
      const legacyUser = localStorage.getItem('unipay-user');
      if (legacyToken && legacyUser) {
        try {
          const parsed = JSON.parse(legacyUser);
          const uid = parsed.id || parsed.userId;
          const uRole = parsed.role;
          sessionStorage.setItem('unipay-token', legacyToken);
          if (uid) sessionStorage.setItem('unipay-userId', uid);
          if (uRole) sessionStorage.setItem('unipay-role', uRole);
          setToken(legacyToken);
          fetchUserFromDB(legacyToken, uid, uRole).finally(() => {
            localStorage.removeItem('unipay-user');
            localStorage.removeItem('unipay-jwt-token');
            localStorage.removeItem('unipay-role');
            setIsLoading(false);
          });
        } catch {
          localStorage.removeItem('unipay-user');
          localStorage.removeItem('unipay-jwt-token');
          localStorage.removeItem('unipay-role');
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  // FIREBASE REALTIME DATABASE LISTENER FOR ZERO-LATENCY BALANCE SYNC
  useEffect(() => {
    if (!user) return;
    const uKey = user.id || user.userId || user.user_id;
    if (!uKey) return;

    try {
      const balanceRef = ref(rtdb, `wallets/${uKey}`);
      const unsubscribe = onValue(balanceRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data && data.balance !== undefined) {
            const liveBal = Number(data.balance);
            setUser((prev) => {
              if (prev && prev.walletBalance !== liveBal) {
                console.log(`🔥 FIREBASE RTDB LIVE BALANCE SYNC: ₹${liveBal}`);
                return { ...prev, walletBalance: liveBal };
              }
              return prev;
            });
          }
        }
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase RTDB listener notice:', e.message);
    }
  }, [user?.id, user?.userId, user?.user_id]);

  // Fetch fresh user profile from Supabase via /api/auth/me
  const fetchUserFromDB = async (authToken, userId, role) => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (role) params.append('role', role);

      const res = await fetch(`/api/auth/me?${params.toString()}`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          return data.user;
        }
      }
    } catch (e) {
      console.warn('DB user fetch error:', e.message);
    }
    return null;
  };

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
      sessionStorage.setItem('unipay-token', data.token);
      sessionStorage.setItem('unipay-userId', data.user.id || data.user.userId);
      sessionStorage.setItem('unipay-role', data.user.role);

      return { success: true, user: data.user, token: data.token };
    } catch (e) {
      return { success: false, error: e.message || 'Network error during signup' };
    }
  };

  const login = async (role, credentials = {}) => {
    const selectedRole = role || 'admin';
    const DEFAULT_EMAILS = {
      admin: 'admin@unipay.com',
      accountant: 'accountant@unipay.com',
      master_distributor: 'ajay@unipay.com',
      distributor: 'ram@unipay.com',
      retailer: 'rohan@unipay.com',
    };
    const phoneOrEmail = credentials.phoneOrEmail || DEFAULT_EMAILS[selectedRole] || 'admin@unipay.com';
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
        sessionStorage.setItem('unipay-token', data.token);
        sessionStorage.setItem('unipay-userId', data.user.id || data.user.userId);
        sessionStorage.setItem('unipay-role', data.user.role);

        return { success: true, user: data.user };
      } else if (data.error) {
        return { success: false, error: data.error };
      }
    } catch (e) {
      console.warn('Login API network error:', e.message);
    }

    return { success: false, error: 'Login failed. Check your connection and try again.' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('unipay-token');
    sessionStorage.removeItem('unipay-userId');
    sessionStorage.removeItem('unipay-role');
    localStorage.removeItem('unipay-user');
    localStorage.removeItem('unipay-jwt-token');
    localStorage.removeItem('unipay-role');
  };

  const refreshUserData = useCallback(async () => {
    const activeToken = token || sessionStorage.getItem('unipay-token');
    const userId = user?.id || user?.userId || sessionStorage.getItem('unipay-userId');
    const userRole = user?.role || sessionStorage.getItem('unipay-role');
    await fetchUserFromDB(activeToken, userId, userRole);
  }, [token, user?.id, user?.userId, user?.role]);

  const updateWalletBalance = useCallback(async (newBalance) => {
    if (!user) return;
    const numBal = Number(newBalance);
    setUser(prev => ({ ...prev, walletBalance: numBal }));

    try {
      const userId = user.id || user.userId;
      await fetch('/api/wallet/sync-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newBalance: numBal }),
      });
    } catch (e) {
      console.warn('Balance sync notice:', e.message);
    }
  }, [user]);

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
