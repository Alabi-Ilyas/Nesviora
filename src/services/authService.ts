import type { User } from '@/types';
import { api, setAccessToken } from './api';

interface Session {
  user: User;
  accessToken: string;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const s = await api.post<Session>('/auth/login', { email, password }, { auth: false });
    setAccessToken(s.accessToken);
    return s.user;
  },

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    password: string;
    referralCode?: string;
  }): Promise<User> {
    // referralCode is not used in Phase 1; the API ignores unknown fields.
    const s = await api.post<Session>('/auth/register', data, { auth: false });
    setAccessToken(s.accessToken);
    return s.user;
  },

  // Called once on page load: uses the httpOnly refresh cookie to restore the session.
  async restoreSession(): Promise<User | null> {
    try {
      const s = await api.post<Session>('/auth/refresh', {}, { auth: false, retry: false });
      setAccessToken(s.accessToken);
      return s.user;
    } catch {
      setAccessToken(null);
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout', {}, { auth: false, retry: false });
    } catch {
      /* clear local state regardless */
    }
    setAccessToken(null);
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    // Only fields the API accepts. avatar must be a real URL (not a data URI).
    const body: Record<string, unknown> = {};
    for (const key of ['firstName', 'lastName', 'phone', 'country', 'preferences'] as const) {
      if (updates[key] !== undefined) body[key] = updates[key];
    }
    if (typeof updates.avatar === 'string' && /^https?:\/\//.test(updates.avatar) && updates.avatar.length <= 500) {
      body.avatar = updates.avatar;
    }
    return api.patch<User>('/users/me', body);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await api.post<{ accessToken: string }>('/auth/change-password', { currentPassword, newPassword });
    setAccessToken(res.accessToken);
  },

  async forgotPassword(_email: string): Promise<void> {
    throw new Error('Password reset by email is not available yet. Please contact support.');
  },

  // Mirrors the roles enforced by the API (src/routes/admin.routes.js).
  hasPermission(user: User | null, permission: string): boolean {
    if (!user || user.role !== 'admin') return false;
    if (user.adminRole === 'super_admin') return true;
    const permissions: Record<string, string[]> = {
      ops_admin: ['users', 'kyc', 'investments', 'plans', 'mining', 'support', 'reports'],
      finance_admin: ['users', 'investments', 'plans', 'deposits', 'withdrawals', 'transactions', 'reports'],
      kyc_admin: ['kyc'],
      support_admin: ['users', 'support', 'notifications'],
      content_admin: ['testimonials', 'faqs', 'settings', 'assets', 'market'],
    };
    return permissions[user.adminRole || '']?.includes(permission) ?? false;
  },
};
