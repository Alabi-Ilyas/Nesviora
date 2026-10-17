/* eslint-disable @typescript-eslint/no-unused-vars */
// Real API implementations for Phase 2: wallet balance, deposits, withdrawals, transactions, investing.
// services/index.ts overlays these onto the matching mock services, so pages keep the same method names.
// Money model: one USD balance per user. Deposit.amount is what the user sent (in `currency`);
// the USD value credited is set by an admin when confirming.
import type { Deposit, Investment, PlatformSettings, Transaction, Wallet, Withdrawal } from '@/types';
import { api } from './api';

const LIST = '?limit=100';

export const phase2Wallet = {
  // The wallet page has one entry: the USD balance.
  getWallets: async (userId: string): Promise<Wallet[]> => {
    const { balance } = await api.get<{ balance: number }>('/wallet');
    return [{ id: 'usd-balance', userId, assetId: 'usd', symbol: 'USD', balance, address: '', network: '', isDefault: true }];
  },
  getBalance: async (): Promise<number> => (await api.get<{ balance: number }>('/wallet')).balance,
};

export const phase2Transaction = {
  getTransactions: (_userId: string) => api.get<Transaction[]>(`/transactions${LIST}`),
  getAllTransactions: () => api.get<Transaction[]>(`/admin/transactions${LIST}`),
};

export const phase2Deposit = {
  getDeposits: (_userId: string) => api.get<Deposit[]>(`/deposits${LIST}`),
  createDeposit: (_userId: string, data: { amount: number; currency: string; method: string }) =>
    api.post<Deposit>('/deposits', data),
  getAllDeposits: () => api.get<Deposit[]>(`/admin/deposits${LIST}`),
  // creditedAmount = USD value to credit; required by the API when status is "confirmed".
  updateDepositStatus: (id: string, status: Deposit['status'], note?: string, creditedAmount?: number) =>
    api.patch<Deposit>(`/admin/deposits/${id}`, { status, note: note || undefined, creditedAmount }),
};

export const phase2Withdrawal = {
  getWithdrawals: (_userId: string) => api.get<Withdrawal[]>(`/withdrawals${LIST}`),
  // The server computes the fee itself; any fee sent from here would be ignored.
  createWithdrawal: (
    _userId: string,
    data: { amount: number; asset: string; destinationAddress: string; network: string; fee: number },
  ) => {
    const { fee: _fee, ...body } = data;
    return api.post<Withdrawal>('/withdrawals', body);
  },
  getAllWithdrawals: () => api.get<Withdrawal[]>(`/admin/withdrawals${LIST}`),
  updateWithdrawalStatus: (id: string, status: Withdrawal['status'], hash?: string, note?: string) =>
    api.patch<Withdrawal>(`/admin/withdrawals/${id}`, { status, hash: hash || undefined, note: note || undefined }),
};

export const phase2Investment = {
  createInvestment: (_userId: string, planId: string, amount: number, asset: string) =>
    api.post<Investment>('/investments', { planId, amount, asset }),
};

export const phase2Settings = {
  // Real fees/limits from the server, merged over the remaining mock settings.
  getSettings: async (base: PlatformSettings): Promise<PlatformSettings> => {
    const s = await api.get<{ fees: { depositFee: number; withdrawalFee: number; investmentFee: number } }>('/settings', { auth: false });
    return { ...base, fees: { ...base.fees, ...s.fees } };
  },
};
