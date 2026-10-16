import type {
  Wallet, Transaction, Investment, InvestmentPlan, MiningContract, MiningPlan,
  Deposit, Withdrawal, Notification, SupportTicket, Referral, KYCSubmission,
  Testimonial, FAQ, AuditLog, PlatformSettings, User,
} from '@/types';
import {
  demoWallets, demoTransactions, demoInvestments, demoInvestmentPlans,
  demoMiningContracts, demoMiningPlans, demoDeposits, demoWithdrawals,
  demoNotifications, demoTickets, demoReferrals, demoKYC,
  demoTestimonials, demoFAQs, demoAuditLogs, demoSettings,
  adminDemoUsers, adminDemoDeposits, adminDemoWithdrawals, adminDemoKYCs,
  adminDemoTickets,
} from '@/data/mockData';
import { generateId, generateReference } from '@/utils';
import { phase1Investment, phase1Support, phase1Content, phase1Admin } from './phase1';

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// In-memory stores (simulating database)
const store = {
  wallets: [...demoWallets],
  transactions: [...demoTransactions],
  investments: [...demoInvestments],
  investmentPlans: [...demoInvestmentPlans],
  miningContracts: [...demoMiningContracts],
  miningPlans: [...demoMiningPlans],
  deposits: [...demoDeposits],
  withdrawals: [...demoWithdrawals],
  notifications: [...demoNotifications],
  tickets: [...demoTickets],
  referrals: [...demoReferrals],
  kyc: { ...demoKYC },
  testimonials: [...demoTestimonials],
  faqs: [...demoFAQs],
  auditLogs: [...demoAuditLogs],
  settings: { ...demoSettings },
  adminUsers: [...adminDemoUsers],
  adminDeposits: [...adminDemoDeposits],
  adminWithdrawals: [...adminDemoWithdrawals],
  adminKYCs: [...adminDemoKYCs],
  adminTickets: [...adminDemoTickets],
};

function addTransaction(tx: Omit<Transaction, 'id' | 'reference' | 'createdAt'>) {
  const transaction: Transaction = {
    ...tx,
    id: generateId('tx_'),
    reference: generateReference(),
    createdAt: new Date().toISOString(),
  };
  store.transactions.unshift(transaction);
  return transaction;
}

// Wallet Service
export const walletService = {
  async getWallets(userId: string): Promise<Wallet[]> {
    await delay(200);
    return store.wallets.filter((w) => w.userId === userId);
  },
  async createWallet(userId: string, assetId: string, symbol: string, network: string): Promise<Wallet> {
    await delay(300);
    const wallet: Wallet = {
      id: generateId('w_'),
      userId,
      assetId,
      symbol,
      balance: 0,
      address: `0x${Math.random().toString(16).slice(2, 42)}`,
      network,
      isDefault: store.wallets.filter((w) => w.userId === userId).length === 0,
    };
    store.wallets.push(wallet);
    return wallet;
  },
  async removeWallet(id: string): Promise<void> {
    await delay(200);
    store.wallets = store.wallets.filter((w) => w.id !== id);
  },
  async setDefaultWallet(userId: string, id: string): Promise<void> {
    await delay(200);
    store.wallets.forEach((w) => {
      w.isDefault = w.id === id;
    });
  },
};

// Transaction Service
export const transactionService = {
  async getTransactions(userId: string): Promise<Transaction[]> {
    await delay(300);
    return store.transactions.filter((t) => t.userId === userId);
  },
  async getAllTransactions(): Promise<Transaction[]> {
    await delay(300);
    return store.transactions;
  },
};

// Investment Service
export const investmentService = {
  async getPlans(): Promise<InvestmentPlan[]> {
    await delay(200);
    return store.investmentPlans;
  },
  async getAllPlans(): Promise<InvestmentPlan[]> {
    await delay(200);
    return store.investmentPlans;
  },
  async getInvestments(userId: string): Promise<Investment[]> {
    await delay(300);
    return store.investments.filter((i) => i.userId === userId);
  },
  async createInvestment(userId: string, planId: string, amount: number, asset: string): Promise<Investment> {
    await delay(500);
    const plan = store.investmentPlans.find((p) => p.id === planId);
    if (!plan) throw new Error('Investment plan not found.');
    if (amount < plan.minAmount || amount > plan.maxAmount) {
      throw new Error(`Amount must be between ${plan.minAmount} and ${plan.maxAmount}.`);
    }
    const investment: Investment = {
      id: generateId('inv_'),
      userId,
      planId,
      planName: plan.name,
      principal: amount,
      currentValue: amount,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + plan.durationDays * 86400000).toISOString(),
      status: 'active',
      fees: (amount * plan.fees) / 100,
      asset,
      expectedReturnRate: plan.expectedReturnRate,
    };
    store.investments.unshift(investment);
    addTransaction({ userId, type: 'investment', asset, amount, fee: investment.fees, status: 'completed', description: `Investment in ${plan.name} plan` });
    return investment;
  },
  async getAllInvestments(): Promise<Investment[]> {
    await delay(300);
    return store.investments;
  },
  async updatePlan(id: string, updates: Partial<InvestmentPlan>): Promise<InvestmentPlan> {
    await delay(300);
    const plan = store.investmentPlans.find((p) => p.id === id);
    if (!plan) throw new Error('Plan not found.');
    Object.assign(plan, updates);
    return plan;
  },
  async createPlan(plan: Omit<InvestmentPlan, 'id'>): Promise<InvestmentPlan> {
    await delay(300);
    const newPlan: InvestmentPlan = { ...plan, id: generateId('plan_') };
    store.investmentPlans.push(newPlan);
    return newPlan;
  },
};

// Mining Service
export const miningService = {
  async getPlans(): Promise<MiningPlan[]> {
    await delay(200);
    return store.miningPlans;
  },
  async getContracts(userId: string): Promise<MiningContract[]> {
    await delay(300);
    return store.miningContracts.filter((c) => c.userId === userId);
  },
  async purchaseContract(userId: string, planId: string): Promise<MiningContract> {
    await delay(500);
    const plan = store.miningPlans.find((p) => p.id === planId);
    if (!plan) throw new Error('Mining plan not found.');
    if (plan.status !== 'active') throw new Error('This mining plan is not currently available.');
    const contract: MiningContract = {
      id: generateId('mc_'),
      userId,
      planId,
      planName: plan.name,
      asset: plan.asset,
      hashrate: plan.hashrate,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + plan.durationDays * 86400000).toISOString(),
      status: 'active',
      totalReward: 0,
      dailyReward: plan.estimatedDailyOutput,
      maintenanceFee: plan.electricityFee,
      progress: 0,
    };
    store.miningContracts.unshift(contract);
    addTransaction({ userId, type: 'mining', asset: plan.asset, amount: plan.price, fee: 0, status: 'completed', description: `Mining contract: ${plan.name}` });
    return contract;
  },
  async updatePlan(id: string, updates: Partial<MiningPlan>): Promise<MiningPlan> {
    await delay(300);
    const plan = store.miningPlans.find((p) => p.id === id);
    if (!plan) throw new Error('Plan not found.');
    Object.assign(plan, updates);
    return plan;
  },
  async createPlan(plan: Omit<MiningPlan, 'id'>): Promise<MiningPlan> {
    await delay(300);
    const newPlan: MiningPlan = { ...plan, id: generateId('mine_') };
    store.miningPlans.push(newPlan);
    return newPlan;
  },
  async getAllContracts(): Promise<MiningContract[]> {
    await delay(300);
    return store.miningContracts;
  },
};

// Deposit Service
export const depositService = {
  async getDeposits(userId: string): Promise<Deposit[]> {
    await delay(300);
    return store.deposits.filter((d) => d.userId === userId);
  },
  async createDeposit(userId: string, data: { amount: number; currency: string; method: string }): Promise<Deposit> {
    await delay(500);
    const deposit: Deposit = {
      id: generateId('dep_'),
      userId,
      amount: data.amount,
      currency: data.currency,
      method: data.method,
      reference: generateReference('DEP'),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    store.deposits.unshift(deposit);
    addTransaction({ userId, type: 'deposit', asset: data.currency, amount: data.amount, fee: 0, status: 'pending', description: `Deposit via ${data.method}` });
    return deposit;
  },
  async getAllDeposits(): Promise<Deposit[]> {
    await delay(300);
    return [...store.deposits, ...store.adminDeposits];
  },
  async updateDepositStatus(id: string, status: Deposit['status'], note?: string): Promise<Deposit> {
    await delay(300);
    const deposit = store.adminDeposits.find((d) => d.id === id) || store.deposits.find((d) => d.id === id);
    if (!deposit) throw new Error('Deposit not found.');
    deposit.status = status;
    if (note) deposit.note = note;
    return deposit;
  },
};

// Withdrawal Service
export const withdrawalService = {
  async getWithdrawals(userId: string): Promise<Withdrawal[]> {
    await delay(300);
    return store.withdrawals.filter((w) => w.userId === userId);
  },
  async createWithdrawal(userId: string, data: { amount: number; asset: string; destinationAddress: string; network: string; fee: number }): Promise<Withdrawal> {
    await delay(500);
    const withdrawal: Withdrawal = {
      id: generateId('wd_'),
      userId,
      amount: data.amount,
      asset: data.asset,
      destinationAddress: data.destinationAddress,
      network: data.network,
      fee: data.fee,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    store.withdrawals.unshift(withdrawal);
    addTransaction({ userId, type: 'withdrawal', asset: data.asset, amount: data.amount, fee: data.fee, status: 'pending', description: `Withdrawal to ${data.destinationAddress.slice(0, 10)}...` });
    return withdrawal;
  },
  async getAllWithdrawals(): Promise<Withdrawal[]> {
    await delay(300);
    return [...store.withdrawals, ...store.adminWithdrawals];
  },
  async updateWithdrawalStatus(id: string, status: Withdrawal['status'], hash?: string, note?: string): Promise<Withdrawal> {
    await delay(300);
    const withdrawal = store.adminWithdrawals.find((w) => w.id === id) || store.withdrawals.find((w) => w.id === id);
    if (!withdrawal) throw new Error('Withdrawal not found.');
    withdrawal.status = status;
    if (hash) withdrawal.hash = hash;
    if (note) withdrawal.note = note;
    return withdrawal;
  },
};

// KYC Service
export const kycService = {
  async getKYC(userId: string): Promise<KYCSubmission | null> {
    await delay(200);
    return store.kyc.userId === userId ? store.kyc : null;
  },
  async submitKYC(userId: string, data: Omit<KYCSubmission, 'id' | 'userId' | 'status' | 'submittedAt'>): Promise<KYCSubmission> {
    await delay(500);
    store.kyc = {
      ...data,
      id: generateId('kyc_'),
      userId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    return store.kyc;
  },
  async getAllKYCs(): Promise<KYCSubmission[]> {
    await delay(300);
    return [store.kyc, ...store.adminKYCs.filter((k) => k.userId !== store.kyc.userId)];
  },
  async updateKYCStatus(id: string, status: KYCSubmission['status'], reviewer: string, note?: string): Promise<KYCSubmission> {
    await delay(300);
    const kyc = store.adminKYCs.find((k) => k.id === id);
    if (kyc) {
      kyc.status = status;
      kyc.reviewer = reviewer;
      kyc.reviewedAt = new Date().toISOString();
      if (note) kyc.note = note;
      return kyc;
    }
    if (store.kyc.id === id) {
      store.kyc.status = status;
      store.kyc.reviewer = reviewer;
      store.kyc.reviewedAt = new Date().toISOString();
      if (note) store.kyc.note = note;
      return store.kyc;
    }
    throw new Error('KYC submission not found.');
  },
};

// Notification Service
export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    await delay(200);
    return store.notifications.filter((n) => n.userId === userId);
  },
  async markAsRead(id: string): Promise<void> {
    await delay(100);
    const notif = store.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
  },
  async markAllAsRead(userId: string): Promise<void> {
    await delay(100);
    store.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
  },
  async getAllNotifications(): Promise<Notification[]> {
    return store.notifications;
  },
  async sendNotification(notif: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> {
    await delay(200);
    const notification: Notification = {
      ...notif,
      id: generateId('n_'),
      read: false,
      createdAt: new Date().toISOString(),
    };
    store.notifications.unshift(notification);
    return notification;
  },
};

// Support Service
export const supportService = {
  async getTickets(userId: string): Promise<SupportTicket[]> {
    await delay(300);
    return store.tickets.filter((t) => t.userId === userId);
  },
  async createTicket(userId: string, data: { subject: string; category: string; priority: SupportTicket['priority']; message: string }): Promise<SupportTicket> {
    await delay(500);
    const ticket: SupportTicket = {
      id: generateId('tk_'),
      userId,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: 'open',
      message: data.message,
      createdAt: new Date().toISOString(),
      messages: [{ sender: 'user', text: data.message, timestamp: new Date().toISOString() }],
    };
    store.tickets.unshift(ticket);
    return ticket;
  },
  async addMessage(ticketId: string, sender: 'user' | 'support', text: string): Promise<void> {
    await delay(200);
    const ticket = store.tickets.find((t) => t.id === ticketId);
    if (ticket) {
      ticket.messages.push({ sender, text, timestamp: new Date().toISOString() });
    }
  },
  async getAllTickets(): Promise<SupportTicket[]> {
    await delay(300);
    return [...store.tickets, ...store.adminTickets.filter((t) => !store.tickets.find((st) => st.id === t.id))];
  },
  async updateTicketStatus(id: string, status: SupportTicket['status']): Promise<void> {
    await delay(200);
    const ticket = store.tickets.find((t) => t.id === id) || store.adminTickets.find((t) => t.id === id);
    if (ticket) ticket.status = status;
  },
};

// Referral Service
export const referralService = {
  async getReferrals(userId: string): Promise<Referral[]> {
    await delay(200);
    return store.referrals.filter((r) => r.referrerId === userId);
  },
};

// Content Service
export const contentService = {
  async getTestimonials(): Promise<Testimonial[]> {
    await delay(200);
    return store.testimonials;
  },
  async getFAQs(): Promise<FAQ[]> {
    await delay(200);
    return store.faqs;
  },
  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    await delay(200);
    const t = store.testimonials.find((t) => t.id === id);
    if (!t) throw new Error('Testimonial not found.');
    Object.assign(t, updates);
    return t;
  },
  async createTestimonial(t: Omit<Testimonial, 'id'>): Promise<Testimonial> {
    await delay(200);
    const newT: Testimonial = { ...t, id: generateId('t_') };
    store.testimonials.push(newT);
    return newT;
  },
  async deleteTestimonial(id: string): Promise<void> {
    await delay(200);
    store.testimonials = store.testimonials.filter((t) => t.id !== id);
  },
  async updateFAQ(id: string, updates: Partial<FAQ>): Promise<FAQ> {
    await delay(200);
    const faq = store.faqs.find((f) => f.id === id);
    if (!faq) throw new Error('FAQ not found.');
    Object.assign(faq, updates);
    return faq;
  },
  async createFAQ(faq: Omit<FAQ, 'id'>): Promise<FAQ> {
    await delay(200);
    const newFAQ: FAQ = { ...faq, id: generateId('f_') };
    store.faqs.push(newFAQ);
    return newFAQ;
  },
  async deleteFAQ(id: string): Promise<void> {
    await delay(200);
    store.faqs = store.faqs.filter((f) => f.id !== id);
  },
};

// Admin Service
export const adminService = {
  async getUsers(): Promise<User[]> {
    await delay(300);
    return store.adminUsers;
  },
  async updateUserStatus(id: string, status: User['status']): Promise<void> {
    await delay(300);
    const user = store.adminUsers.find((u) => u.id === id);
    if (user) user.status = status;
  },
  async getAuditLogs(): Promise<AuditLog[]> {
    await delay(200);
    return store.auditLogs;
  },
  async addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const auditLog: AuditLog = {
      ...log,
      id: generateId('al_'),
      timestamp: new Date().toISOString(),
    };
    store.auditLogs.unshift(auditLog);
  },
  async getSettings(): Promise<PlatformSettings> {
    await delay(200);
    return store.settings;
  },
  async updateSettings(updates: Partial<PlatformSettings>): Promise<PlatformSettings> {
    await delay(300);
    Object.assign(store.settings, updates);
    return store.settings;
  },
};

// Settings Service
export const settingsService = {
  async getSettings(): Promise<PlatformSettings> {
    await delay(200);
    return store.settings;
  },
  async updateSettings(updates: Partial<PlatformSettings>): Promise<PlatformSettings> {
    await delay(300);
    Object.assign(store.settings, updates);
    return store.settings;
  },
};

// ---- Phase 1: real API implementations replace the mock methods of the same name ----
// Wallets, deposits, withdrawals, KYC, mining, notifications, referrals, FAQs, settings and
// audit logs remain mock until Phase 2.
Object.assign(investmentService, phase1Investment);
Object.assign(supportService, phase1Support);
Object.assign(contentService, phase1Content);
Object.assign(adminService, phase1Admin);
