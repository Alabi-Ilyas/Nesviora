// Real API implementations for the Phase 1 features. services/index.ts overlays these
// onto the matching mock services, so pages keep calling the same method names.
// Anything not listed here (wallets, deposits, withdrawals, KYC, mining, notifications,
// referrals, FAQs, settings, audit logs) is still mock data until Phase 2.
import type { Investment, InvestmentPlan, SupportTicket, Testimonial, User } from '@/types';
import { api } from './api';

const LIST = '?limit=100';

export const phase1Investment = {
  getPlans: () => api.get<InvestmentPlan[]>('/plans'), // public: active plans only
  getAllPlans: () => api.get<InvestmentPlan[]>('/admin/plans'), // admin: includes inactive
  getInvestments: (_userId: string) => api.get<Investment[]>(`/investments${LIST}`),
  getAllInvestments: () => api.get<Investment[]>(`/admin/investments${LIST}`),
  createPlan: (plan: Omit<InvestmentPlan, 'id'>) => api.post<InvestmentPlan>('/admin/plans', plan),
  updatePlan: (id: string, updates: Partial<InvestmentPlan>) =>
    api.patch<InvestmentPlan>(`/admin/plans/${id}`, updates),
  // Investing needs deposits to work first (Phase 2).
  createInvestment: async (): Promise<Investment> => {
    throw new Error('Investing is not available yet.');
  },
};

export const phase1Support = {
  getTickets: (_userId: string) => api.get<SupportTicket[]>(`/support/tickets${LIST}`),
  createTicket: (
    _userId: string,
    data: { subject: string; category: string; priority: SupportTicket['priority']; message: string },
  ) => api.post<SupportTicket>('/support/tickets', data),
  addMessage: async (ticketId: string, sender: 'user' | 'support', text: string): Promise<void> => {
    const path = sender === 'support' ? `/admin/support/tickets/${ticketId}/messages` : `/support/tickets/${ticketId}/messages`;
    await api.post(path, { text });
  },
  getAllTickets: () => api.get<SupportTicket[]>(`/admin/support/tickets${LIST}`),
  updateTicketStatus: async (id: string, status: SupportTicket['status']): Promise<void> => {
    await api.patch(`/admin/support/tickets/${id}/status`, { status });
  },
};

export const phase1Content = {
  getTestimonials: () => api.get<Testimonial[]>('/testimonials'),
  createTestimonial: (t: Omit<Testimonial, 'id'>) => {
    const { date, ...rest } = t;
    return api.post<Testimonial>('/admin/testimonials', date ? { ...rest, date } : rest);
  },
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => {
    const { id: _ignored, ...rest } = updates as Partial<Testimonial> & { id?: string };
    if (!rest.date) delete rest.date;
    return api.patch<Testimonial>(`/admin/testimonials/${id}`, rest);
  },
  deleteTestimonial: async (id: string): Promise<void> => {
    await api.delete(`/admin/testimonials/${id}`);
  },
};

export const phase1Admin = {
  getUsers: () => api.get<User[]>(`/admin/users${LIST}`),
  updateUserStatus: async (id: string, status: User['status']): Promise<void> => {
    await api.patch(`/admin/users/${id}/status`, { status });
  },
};
