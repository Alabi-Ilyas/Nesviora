import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    firstName: string; lastName: string; email: string; phone: string;
    country: string; password: string; referralCode?: string;
  }) => Promise<User>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore the session from the httpOnly refresh cookie on first load.
  useEffect(() => {
    let active = true;
    authService.restoreSession().then((u) => {
      if (active) {
        setUser(u);
        setLoading(false);
      }
    });

    // api.ts fires this when a refresh fails (session expired, account suspended, etc.)
    const onForcedLogout = () => setUser(null);
    window.addEventListener('auth:logout', onForcedLogout);
    return () => {
      active = false;
      window.removeEventListener('auth:logout', onForcedLogout);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authService.login(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (data: {
    firstName: string; lastName: string; email: string; phone: string;
    country: string; password: string; referralCode?: string;
  }) => {
    const u = await authService.register(data);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    void authService.logout();
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
  }, []);

  const hasPermission = useCallback((permission: string) => {
    return authService.hasPermission(user, permission);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
