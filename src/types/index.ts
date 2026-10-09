export type UserRole = 'user' | 'admin';
export type AdminRole = 'super_admin' | 'ops_admin' | 'finance_admin' | 'kyc_admin' | 'support_admin' | 'content_admin';
export type KYCStatus = 'not_submitted' | 'pending' | 'under_review' | 'verified' | 'rejected';
export type AccountStatus = 'active' | 'suspended' | 'pending' | 'deactivated';
export type TransactionType = 'deposit' | 'withdrawal' | 'investment' | 'mining' | 'transfer' | 'fee' | 'adjustment' | 'reward';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'processing' | 'cancelled' | 'rejected';
export type InvestmentStatus = 'active' | 'completed' | 'pending' | 'cancelled';
export type MiningStatus = 'active' | 'completed' | 'pending' | 'expired' | 'cancelled';
export type DepositStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';
export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'rejected' | 'cancelled';
export type SupportTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type SupportPriority = 'low' | 'medium' | 'high' | 'urgent';
export type RiskLevel = 'low' | 'medium' | 'high';
export type NotificationType = 'investment' | 'deposit' | 'withdrawal' | 'kyc' | 'security' | 'mining' | 'system';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  status: AccountStatus;
  role: UserRole;
  adminRole?: AdminRole;
  kycStatus: KYCStatus;
  createdAt: string;
  avatar?: string;
  referralCode: string;
  twoFactorEnabled: boolean;
  preferences: {
    currency: string;
    language: string;
    notifications: { email: boolean; push: boolean; sms: boolean };
  };
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  network: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  sparkline: number[];
  depositAvailable: boolean;
  withdrawAvailable: boolean;
  tradingStatus: 'active' | 'disabled';
  displayOrder: number;
}

export interface Wallet {
  id: string;
  userId: string;
  assetId: string;
  symbol: string;
  balance: number;
  address: string;
  network: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  asset: string;
  amount: number;
  fee: number;
  status: TransactionStatus;
  reference: string;
  hash?: string;
  createdAt: string;
  description?: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  durationDays: number;
  description: string;
  riskLevel: RiskLevel;
  supportedAssets: string[];
  status: 'active' | 'inactive';
  fees: number;
  terms: string;
  expectedReturnRate: number;
}

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  principal: number;
  currentValue: number;
  startDate: string;
  endDate: string;
  status: InvestmentStatus;
  fees: number;
  asset: string;
  expectedReturnRate: number;
}

export interface MiningPlan {
  id: string;
  name: string;
  asset: string;
  hashrate: string;
  durationDays: number;
  electricityFee: number;
  capacity: number;
  status: 'active' | 'inactive';
  price: number;
  description: string;
  estimatedDailyOutput: number;
}

export interface MiningContract {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  asset: string;
  hashrate: string;
  startDate: string;
  endDate: string;
  status: MiningStatus;
  totalReward: number;
  dailyReward: number;
  maintenanceFee: number;
  progress: number;
}

export interface Deposit {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  reference: string;
  status: DepositStatus;
  createdAt: string;
  note?: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  asset: string;
  destinationAddress: string;
  network: string;
  fee: number;
  status: WithdrawalStatus;
  createdAt: string;
  hash?: string;
  note?: string;
}

export interface KYCSubmission {
  id: string;
  userId: string;
  legalName: string;
  dateOfBirth: string;
  country: string;
  address: string;
  idType: string;
  idNumber: string;
  status: KYCStatus;
  submittedAt: string;
  reviewer?: string;
  reviewedAt?: string;
  note?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: string;
  priority: SupportPriority;
  status: SupportTicketStatus;
  message: string;
  createdAt: string;
  messages: { sender: 'user' | 'support'; text: string; timestamp: string }[];
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  refereeName: string;
  reward: number;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  comment: string;
  date: string;
  verified: boolean;
  isDemo: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
  metadata?: string;
}

export interface PlatformSettings {
  general: {
    platformName: string;
    timezone: string;
    defaultCurrency: string;
    maintenanceMode: boolean;
  };
  fees: {
    depositFee: number;
    withdrawalFee: number;
    investmentFee: number;
    miningFee: number;
    referralFee: number;
  };
  security: {
    twoFactorRequired: boolean;
    withdrawalVerification: boolean;
    sessionTimeout: number;
    kycRequired: boolean;
  };
}
