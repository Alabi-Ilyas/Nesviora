import type {
  User,
  Asset,
  Wallet,
  Transaction,
  InvestmentPlan,
  Investment,
  MiningPlan,
  MiningContract,
  Deposit,
  Withdrawal,
  KYCSubmission,
  AccountStatus,
  SupportPriority,
  SupportTicketStatus,
  Notification,
  SupportTicket,
  Referral,
  Testimonial,
  FAQ,
  AuditLog,
  PlatformSettings,
} from "@/types";

// Deterministic pseudo-random for demo data
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRandom(42);
const firstNames = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "William",
  "Elizabeth",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
  "Daniel",
  "Nancy",
  "Matthew",
  "Lisa",
  "Anthony",
  "Betty",
  "Donald",
  "Sandra",
  "Mark",
  "Ashley",
  "Paul",
  "Emily",
  "Steven",
  "Donna",
  "Andrew",
  "Michelle",
  "Kenneth",
  "Carol",
  "George",
  "Amanda",
  "Kevin",
  "Dorothy",
  "Brian",
  "Melissa",
  "Edward",
  "Deborah",
  "Ronald",
  "Stephanie",
  "Timothy",
  "Rebecca",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
];
const countries = [
  "United States",
  "United Kingdom",
  "Nigeria",
  "Germany",
  "Canada",
  "Australia",
  "France",
  "Japan",
  "Brazil",
  "India",
  "South Africa",
  "Singapore",
  "UAE",
  "Netherlands",
  "Spain",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

// Demo user
export const demoUser: User = {
  id: "usr_demo",
  firstName: "Demo",
  lastName: "Investor",
  email: "demo@nesviora.test",
  phone: "+1 555 0123",
  country: "United States",
  status: "active",
  role: "user",
  kycStatus: "verified",
  createdAt: "2024-06-15T10:00:00Z",
  referralCode: "NESVIORA-DEMO2024",
  twoFactorEnabled: true,
  preferences: {
    currency: "USD",
    language: "English",
    notifications: { email: true, push: true, sms: false },
  },
};

export const demoAdmin: User = {
  id: "adm_demo",
  firstName: "Admin",
  lastName: "Manager",
  email: "admin@nesviora.test",
  phone: "+1 555 0199",
  country: "United States",
  status: "active",
  role: "admin",
  adminRole: "super_admin",
  kycStatus: "verified",
  createdAt: "2024-01-01T00:00:00Z",
  referralCode: "NESVIORA-ADMIN",
  twoFactorEnabled: true,
  preferences: {
    currency: "USD",
    language: "English",
    notifications: { email: true, push: true, sms: false },
  },
};

// Crypto assets
export const demoAssets: Asset[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    logo: "₿",
    network: "Bitcoin",
    price: 67234.5,
    change24h: 2.34,
    marketCap: 1325000000000,
    volume24h: 28500000000,
    sparkline: [65100, 65800, 66200, 65500, 66800, 67100, 67234],
    depositAvailable: true,
    withdrawAvailable: true,
    tradingStatus: "active",
    displayOrder: 1,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    logo: "Ξ",
    network: "Ethereum",
    price: 3445.2,
    change24h: 1.87,
    marketCap: 414000000000,
    volume24h: 15200000000,
    sparkline: [3380, 3400, 3420, 3390, 3430, 3440, 3445],
    depositAvailable: true,
    withdrawAvailable: true,
    tradingStatus: "active",
    displayOrder: 2,
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    logo: "₮",
    network: "Multi-chain",
    price: 1.0,
    change24h: 0.01,
    marketCap: 110000000000,
    volume24h: 45000000000,
    sparkline: [1.0, 1.0, 1.001, 0.999, 1.0, 1.0, 1.0],
    depositAvailable: true,
    withdrawAvailable: true,
    tradingStatus: "active",
    displayOrder: 3,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    logo: "◎",
    network: "Solana",
    price: 168.45,
    change24h: 4.52,
    marketCap: 78000000000,
    volume24h: 3200000000,
    sparkline: [161, 163, 165, 162, 166, 167, 168],
    depositAvailable: true,
    withdrawAvailable: true,
    tradingStatus: "active",
    displayOrder: 4,
  },
  {
    id: "binancecoin",
    name: "BNB",
    symbol: "BNB",
    logo: "B",
    network: "BNB Chain",
    price: 585.3,
    change24h: -0.84,
    marketCap: 86000000000,
    volume24h: 1800000000,
    sparkline: [595, 590, 588, 592, 587, 586, 585],
    depositAvailable: true,
    withdrawAvailable: true,
    tradingStatus: "active",
    displayOrder: 5,
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    logo: "X",
    network: "XRPL",
    price: 0.5234,
    change24h: 1.23,
    marketCap: 29000000000,
    volume24h: 1100000000,
    sparkline: [0.515, 0.518, 0.52, 0.517, 0.521, 0.522, 0.523],
    depositAvailable: true,
    withdrawAvailable: true,
    tradingStatus: "active",
    displayOrder: 6,
  },
  {
    id: "usd-coin",
    name: "USD Coin",
    symbol: "USDC",
    logo: "₵",
    network: "Multi-chain",
    price: 1.0,
    change24h: 0.0,
    marketCap: 34000000000,
    volume24h: 5200000000,
    sparkline: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    depositAvailable: true,
    withdrawAvailable: true,
    tradingStatus: "active",
    displayOrder: 7,
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    logo: "Ð",
    network: "Dogecoin",
    price: 0.1432,
    change24h: 3.67,
    marketCap: 20000000000,
    volume24h: 950000000,
    sparkline: [0.138, 0.14, 0.141, 0.139, 0.142, 0.143, 0.143],
    depositAvailable: true,
    withdrawAvailable: true,
    tradingStatus: "active",
    displayOrder: 8,
  },
];

// Demo wallets
export const demoWallets: Wallet[] = [
  {
    id: "w1",
    userId: "usr_demo",
    assetId: "bitcoin",
    symbol: "BTC",
    balance: 0.1845,
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Bitcoin",
    isDefault: true,
  },
  {
    id: "w2",
    userId: "usr_demo",
    assetId: "ethereum",
    symbol: "ETH",
    balance: 2.156,
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bF51",
    network: "Ethereum (ERC-20)",
    isDefault: false,
  },
  {
    id: "w3",
    userId: "usr_demo",
    assetId: "tether",
    symbol: "USDT",
    balance: 8250.0,
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bF51",
    network: "Ethereum (ERC-20)",
    isDefault: false,
  },
  {
    id: "w4",
    userId: "usr_demo",
    assetId: "solana",
    symbol: "SOL",
    balance: 12.8,
    address: "7Np41oeYqPefeNQEHSv1uDh7zix2fS7BvY5z5k2wXr3J",
    network: "Solana",
    isDefault: false,
  },
  {
    id: "w5",
    userId: "usr_demo",
    assetId: "binancecoin",
    symbol: "BNB",
    balance: 3.2,
    address: "bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6z8r5gvsu",
    network: "BNB Chain",
    isDefault: false,
  },
];

// Investment plans
export const demoInvestmentPlans: InvestmentPlan[] = [
  {
    id: "plan_starter",
    name: "STARTER",
    minAmount: 100,
    maxAmount: 499,
    durationDays: 30,
    description:
      "Perfect for beginners exploring digital asset investments with a modest starting capital.",
    riskLevel: "low",
    supportedAssets: ["BTC", "ETH", "USDT"],
    status: "active",
    fees: 1.5,
    terms:
      "Principal returned at end of term. Returns credited daily. Early exit incurs 5% fee.",
    expectedReturnRate: 8,
  },
  {
    id: "plan_growth",
    name: "GROWTH",
    minAmount: 500,
    maxAmount: 2499,
    durationDays: 60,
    description:
      "Designed for investors ready to grow their portfolio with a balanced approach.",
    riskLevel: "medium",
    supportedAssets: ["BTC", "ETH", "USDT", "SOL", "BNB"],
    status: "active",
    fees: 2.0,
    terms:
      "Principal returned at end of term. Returns credited daily. Early exit incurs 5% fee.",
    expectedReturnRate: 14,
  },
  {
    id: "plan_pro",
    name: "PRO",
    minAmount: 2500,
    maxAmount: 9999,
    durationDays: 90,
    description:
      "For experienced investors seeking higher potential returns through diversified strategies.",
    riskLevel: "high",
    supportedAssets: ["BTC", "ETH", "USDT", "SOL", "BNB", "XRP"],
    status: "active",
    fees: 2.5,
    terms:
      "Principal returned at end of term. Returns credited daily. Early exit incurs 8% fee.",
    expectedReturnRate: 22,
  },
  {
    id: "plan_elite",
    name: "ELITE",
    minAmount: 10000,
    maxAmount: 100000,
    durationDays: 120,
    description:
      "Premium investment plan for high-net-worth individuals with dedicated portfolio management.",
    riskLevel: "high",
    supportedAssets: ["BTC", "ETH", "USDT", "SOL", "BNB", "XRP", "DOGE"],
    status: "active",
    fees: 3.0,
    terms:
      "Principal returned at end of term. Returns credited daily. Early exit incurs 10% fee.",
    expectedReturnRate: 30,
  },
];

// Mining plans
export const demoMiningPlans: MiningPlan[] = [
  {
    id: "mine_asic",
    name: "ASIC Bitcoin Mining",
    asset: "BTC",
    hashrate: "100 TH/s",
    durationDays: 365,
    electricityFee: 0.05,
    capacity: 100,
    status: "active",
    price: 299,
    description:
      "Industry-leading ASIC miners dedicated to Bitcoin mining with optimal efficiency.",
    estimatedDailyOutput: 0.00012,
  },
  {
    id: "mine_cloud",
    name: "Cloud Mining Starter",
    asset: "BTC",
    hashrate: "50 TH/s",
    durationDays: 180,
    electricityFee: 0.04,
    capacity: 500,
    status: "active",
    price: 149,
    description:
      "Entry-level cloud mining contract with no hardware setup required.",
    estimatedDailyOutput: 0.00006,
  },
  {
    id: "mine_eth",
    name: "Ethereum Staking",
    asset: "ETH",
    hashrate: "N/A",
    durationDays: 365,
    electricityFee: 0,
    capacity: 1000,
    status: "active",
    price: 199,
    description:
      "Participate in Ethereum network validation through staking infrastructure.",
    estimatedDailyOutput: 0.0035,
  },
  {
    id: "mine_pro",
    name: "Pro Bitcoin Mining",
    asset: "BTC",
    hashrate: "500 TH/s",
    durationDays: 365,
    electricityFee: 0.045,
    capacity: 50,
    status: "active",
    price: 1299,
    description:
      "High-capacity Bitcoin mining contract with premium hardware allocation.",
    estimatedDailyOutput: 0.0006,
  },
  {
    id: "mine_lite",
    name: "Lite Cloud Mining",
    asset: "BTC",
    hashrate: "10 TH/s",
    durationDays: 90,
    electricityFee: 0.06,
    capacity: 1000,
    status: "active",
    price: 49,
    description:
      "Short-term trial cloud mining contract to experience mining rewards.",
    estimatedDailyOutput: 0.000012,
  },
];

// Generate demo investments
export const demoInvestments: Investment[] = [
  {
    id: "inv1",
    userId: "usr_demo",
    planId: "plan_growth",
    planName: "GROWTH",
    principal: 5000,
    currentValue: 5350,
    startDate: "2024-08-01T00:00:00Z",
    endDate: "2024-09-30T00:00:00Z",
    status: "active",
    fees: 100,
    asset: "USDT",
    expectedReturnRate: 14,
  },
  {
    id: "inv2",
    userId: "usr_demo",
    planId: "plan_starter",
    planName: "STARTER",
    principal: 200,
    currentValue: 212,
    startDate: "2024-07-15T00:00:00Z",
    endDate: "2024-08-14T00:00:00Z",
    status: "completed",
    fees: 3,
    asset: "USDT",
    expectedReturnRate: 8,
  },
  {
    id: "inv3",
    userId: "usr_demo",
    planId: "plan_pro",
    planName: "PRO",
    principal: 3000,
    currentValue: 3150,
    startDate: "2024-09-01T00:00:00Z",
    endDate: "2024-11-30T00:00:00Z",
    status: "active",
    fees: 75,
    asset: "BTC",
    expectedReturnRate: 22,
  },
  {
    id: "inv4",
    userId: "usr_demo",
    planId: "plan_growth",
    planName: "GROWTH",
    principal: 1000,
    currentValue: 1020,
    startDate: "2024-09-20T00:00:00Z",
    endDate: "2024-11-19T00:00:00Z",
    status: "pending",
    fees: 20,
    asset: "ETH",
    expectedReturnRate: 14,
  },
  {
    id: "inv5",
    userId: "usr_demo",
    planId: "plan_elite",
    planName: "ELITE",
    principal: 12000,
    currentValue: 12500,
    startDate: "2024-09-10T00:00:00Z",
    endDate: "2025-01-08T00:00:00Z",
    status: "active",
    fees: 360,
    asset: "BTC",
    expectedReturnRate: 30,
  },
];

// Mining contracts
export const demoMiningContracts: MiningContract[] = [
  {
    id: "mc1",
    userId: "usr_demo",
    planId: "mine_asic",
    planName: "ASIC Bitcoin Mining",
    asset: "BTC",
    hashrate: "100 TH/s",
    startDate: "2024-08-01T00:00:00Z",
    endDate: "2025-07-31T00:00:00Z",
    status: "active",
    totalReward: 0.0068,
    dailyReward: 0.00012,
    maintenanceFee: 0.05,
    progress: 17,
  },
  {
    id: "mc2",
    userId: "usr_demo",
    planId: "mine_eth",
    planName: "Ethereum Staking",
    asset: "ETH",
    hashrate: "N/A",
    startDate: "2024-09-01T00:00:00Z",
    endDate: "2025-08-31T00:00:00Z",
    status: "active",
    totalReward: 0.105,
    dailyReward: 0.0035,
    maintenanceFee: 0,
    progress: 10,
  },
  {
    id: "mc3",
    userId: "usr_demo",
    planId: "mine_lite",
    planName: "Lite Cloud Mining",
    asset: "BTC",
    hashrate: "10 TH/s",
    startDate: "2024-07-01T00:00:00Z",
    endDate: "2024-09-29T00:00:00Z",
    status: "completed",
    totalReward: 0.00108,
    dailyReward: 0.000012,
    maintenanceFee: 0.06,
    progress: 100,
  },
];

// Generate demo transactions
function generateTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  const types: Transaction["type"][] = [
    "deposit",
    "withdrawal",
    "investment",
    "mining",
    "transfer",
    "fee",
    "reward",
  ];
  const assets = ["BTC", "ETH", "USDT", "SOL", "BNB", "USDC"];
  const statuses: Transaction["status"][] = [
    "completed",
    "completed",
    "completed",
    "pending",
    "failed",
  ];
  for (let i = 0; i < 25; i++) {
    const type = pick(types);
    const asset = pick(assets);
    const amount = Math.round(rand() * 10000) / 100 + 10;
    txns.push({
      id: `tx_${i}`,
      userId: "usr_demo",
      type,
      asset,
      amount,
      fee: Math.round(amount * 0.02 * 100) / 100,
      status: pick(statuses),
      reference: `VLT${Date.now().toString(36).toUpperCase()}${i}`,
      hash: `0x${Math.random().toString(16).slice(2, 18)}`,
      createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    });
  }
  return txns.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export const demoTransactions: Transaction[] = generateTransactions();

// Deposits
export const demoDeposits: Deposit[] = [
  {
    id: "dep1",
    userId: "usr_demo",
    amount: 5000,
    currency: "USDT",
    method: "Crypto Transfer",
    reference: "VLTDEP001",
    status: "confirmed",
    createdAt: "2024-08-01T10:00:00Z",
  },
  {
    id: "dep2",
    userId: "usr_demo",
    amount: 2000,
    currency: "USDT",
    method: "Bank Transfer",
    reference: "VLTDEP002",
    status: "confirmed",
    createdAt: "2024-07-15T14:00:00Z",
  },
  {
    id: "dep3",
    userId: "usr_demo",
    amount: 10000,
    currency: "USDT",
    method: "Crypto Transfer",
    reference: "VLTDEP003",
    status: "pending",
    createdAt: "2024-09-25T09:00:00Z",
  },
];

// Withdrawals
export const demoWithdrawals: Withdrawal[] = [
  {
    id: "wd1",
    userId: "usr_demo",
    amount: 1500,
    asset: "USDT",
    destinationAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bF51",
    network: "ERC-20",
    fee: 5,
    status: "completed",
    createdAt: "2024-08-20T12:00:00Z",
    hash: "0xabc123",
  },
  {
    id: "wd2",
    userId: "usr_demo",
    amount: 500,
    asset: "BTC",
    destinationAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Bitcoin",
    fee: 0.0001,
    status: "pending",
    createdAt: "2024-09-28T16:00:00Z",
  },
];

// KYC submission
export const demoKYC: KYCSubmission = {
  id: "kyc1",
  userId: "usr_demo",
  legalName: "Demo Investor",
  dateOfBirth: "1990-05-15",
  country: "United States",
  address: "123 Investment Blvd, New York, NY 10001",
  idType: "Passport",
  idNumber: "P12345678",
  status: "verified",
  submittedAt: "2024-06-16T10:00:00Z",
  reviewer: "admin@nesviora.test",
  reviewedAt: "2024-06-17T14:00:00Z",
};

// Notifications
export const demoNotifications: Notification[] = [
  {
    id: "n1",
    userId: "usr_demo",
    type: "investment",
    title: "Investment Active",
    message: "Your GROWTH plan investment of $5,000 is now active.",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "n2",
    userId: "usr_demo",
    type: "deposit",
    title: "Deposit Confirmed",
    message: "Your deposit of 5,000 USDT has been confirmed.",
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "n3",
    userId: "usr_demo",
    type: "mining",
    title: "Mining Reward",
    message: "You earned 0.00012 BTC from your ASIC mining contract.",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "n4",
    userId: "usr_demo",
    type: "security",
    title: "New Login",
    message: "A new login was detected from Chrome on Windows.",
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "n5",
    userId: "usr_demo",
    type: "withdrawal",
    title: "Withdrawal Pending",
    message: "Your withdrawal request of 500 BTC is being processed.",
    read: false,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "n6",
    userId: "usr_demo",
    type: "system",
    title: "Platform Update",
    message:
      "Nesviora Capital Market Limited platform has been updated with new features.",
    read: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

// Support tickets
export const demoTickets: SupportTicket[] = [
  {
    id: "tk1",
    userId: "usr_demo",
    subject: "Deposit confirmation delay",
    category: "Deposits",
    priority: "high",
    status: "open",
    message: "My deposit has been pending for 24 hours. Can you check?",
    createdAt: "2024-09-25T10:00:00Z",
    messages: [
      {
        sender: "user",
        text: "My deposit has been pending for 24 hours.",
        timestamp: "2024-09-25T10:00:00Z",
      },
    ],
  },
  {
    id: "tk2",
    userId: "usr_demo",
    subject: "How to change withdrawal address",
    category: "Withdrawals",
    priority: "medium",
    status: "resolved",
    message: "I need to update my withdrawal address.",
    createdAt: "2024-08-15T14:00:00Z",
    messages: [
      {
        sender: "user",
        text: "I need to update my withdrawal address.",
        timestamp: "2024-08-15T14:00:00Z",
      },
      {
        sender: "support",
        text: "You can update it in Settings > Security > Withdrawal Addresses.",
        timestamp: "2024-08-15T15:00:00Z",
      },
    ],
  },
];

// Referrals
export const demoReferrals: Referral[] = [
  {
    id: "ref1",
    referrerId: "usr_demo",
    refereeId: "usr_42",
    refereeName: "Sarah Johnson",
    reward: 25,
    status: "completed",
    createdAt: "2024-07-20T00:00:00Z",
  },
  {
    id: "ref2",
    referrerId: "usr_demo",
    refereeId: "usr_87",
    refereeName: "Michael Chen",
    reward: 25,
    status: "completed",
    createdAt: "2024-08-10T00:00:00Z",
  },
  {
    id: "ref3",
    referrerId: "usr_demo",
    refereeId: "usr_103",
    refereeName: "Emily Davis",
    reward: 0,
    status: "pending",
    createdAt: "2024-09-15T00:00:00Z",
  },
];

// Testimonials (clearly marked as demo)
export const demoTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah K.",
    country: "United States",
    comment:
      "Nesviora Capital Market Limited has made crypto investing straightforward. The dashboard is clear and the investment plans are well-structured.",
    date: "2024-08-15",
    verified: true,
    isDemo: true,
  },
  {
    id: "t2",
    name: "Michael T.",
    country: "Germany",
    comment:
      "The mining contracts are easy to understand and monitor. I appreciate the transparent fee structure.",
    date: "2024-07-20",
    verified: true,
    isDemo: true,
  },
  {
    id: "t3",
    name: "Amina B.",
    country: "Nigeria",
    comment:
      "Great platform for getting started with digital assets. The KYC process was smooth and support was helpful.",
    date: "2024-09-01",
    verified: true,
    isDemo: true,
  },
];

// FAQs
export const demoFAQs: FAQ[] = [
  {
    id: "f1",
    question: "How do I create an account?",
    answer:
      'Click "Create Account" on the homepage, fill in your details, and follow the onboarding steps to set up your profile.',
    category: "Account",
  },
  {
    id: "f2",
    question: "What is KYC and why is it required?",
    answer:
      "KYC (Know Your Customer) is a verification process required by regulations to verify your identity. It helps protect against fraud and ensures platform security.",
    category: "KYC",
  },
  {
    id: "f3",
    question: "How long does KYC verification take?",
    answer:
      "KYC verification typically takes 24-48 hours after you submit all required documents.",
    category: "KYC",
  },
  {
    id: "f4",
    question: "What investment plans are available?",
    answer:
      "We offer STARTER ($100+), GROWTH ($500+), PRO ($2,500+), and ELITE ($10,000+) plans with different durations and risk levels.",
    category: "Investments",
  },
  {
    id: "f5",
    question: "Are returns guaranteed?",
    answer:
      "No. Digital asset investments involve risk, including possible loss of principal. Past performance is not indicative of future results.",
    category: "Investments",
  },
  {
    id: "f6",
    question: "How do deposits work?",
    answer:
      "You can deposit via bank transfer, crypto transfer, or card. Navigate to the Deposit page, choose your method, and follow the instructions.",
    category: "Deposits",
  },
  {
    id: "f7",
    question: "How long do withdrawals take?",
    answer:
      "Withdrawals are processed within 24-48 hours after approval. Crypto withdrawals may take additional time depending on network congestion.",
    category: "Withdrawals",
  },
  {
    id: "f8",
    question: "What are the withdrawal fees?",
    answer:
      "Withdrawal fees vary by asset and network. You can view the fee for each withdrawal before confirming the transaction.",
    category: "Fees",
  },
  {
    id: "f9",
    question: "How does mining work?",
    answer:
      "Mining contracts allow you to earn crypto rewards by allocating hashpower. You purchase a contract, and rewards are credited daily based on the contract terms.",
    category: "Mining",
  },
  {
    id: "f10",
    question: "Is my account secure?",
    answer:
      "We use industry-standard security including 2FA, encryption, and cold storage for assets. We recommend enabling 2FA for additional protection.",
    category: "Security",
  },
  {
    id: "f11",
    question: "Can I cancel an investment?",
    answer:
      "You can exit investments early, but early exit fees may apply depending on the plan terms.",
    category: "Investments",
  },
  {
    id: "f12",
    question: "What cryptocurrencies are supported?",
    answer:
      "We support BTC, ETH, USDT, SOL, BNB, XRP, USDC, and DOGE for deposits, withdrawals, and trading.",
    category: "Crypto",
  },
];

// Platform settings
export const demoSettings: PlatformSettings = {
  general: {
    platformName: "Nesviora Capital Market Limited",
    timezone: "UTC",
    defaultCurrency: "USD",
    maintenanceMode: false,
  },
  fees: {
    depositFee: 0,
    withdrawalFee: 1.0,
    investmentFee: 2.0,
    miningFee: 5.0,
    referralFee: 25,
  },
  security: {
    twoFactorRequired: false,
    withdrawalVerification: true,
    sessionTimeout: 30,
    kycRequired: true,
  },
};

// Generate admin demo users
function generateAdminUsers(): User[] {
  const users: User[] = [demoUser];
  const kycStatuses: KYCSubmission["status"][] = [
    "verified",
    "pending",
    "under_review",
    "rejected",
    "not_submitted",
  ];
  const accountStatuses: AccountStatus[] = [
    "active",
    "active",
    "active",
    "suspended",
    "pending",
  ];
  for (let i = 0; i < 120; i++) {
    const fn = pick(firstNames);
    const ln = pick(lastNames);
    users.push({
      id: `usr_${i + 1}`,
      firstName: fn,
      lastName: ln,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
      phone: `+1 555 ${String(1000 + i).slice(-4)}`,
      country: pick(countries),
      status: pick(accountStatuses),
      role: "user",
      kycStatus: pick(kycStatuses),
      createdAt: new Date(Date.now() - (i + 5) * 86400000 * 3).toISOString(),
      referralCode: `NESVIORA-${fn.toUpperCase()}${i}`,
      twoFactorEnabled: rand() > 0.5,
      preferences: {
        currency: "USD",
        language: "English",
        notifications: { email: true, push: rand() > 0.5, sms: rand() > 0.5 },
      },
    });
  }
  return users;
}

export const adminDemoUsers: User[] = generateAdminUsers();

// Admin deposits
function generateAdminDeposits(): Deposit[] {
  const deps: Deposit[] = [...demoDeposits];
  const methods = ["Crypto Transfer", "Bank Transfer", "Card Payment"];
  const statuses: Deposit["status"][] = [
    "pending",
    "confirmed",
    "failed",
    "cancelled",
  ];
  for (let i = 0; i < 40; i++) {
    const user = adminDemoUsers[i + 5];
    deps.push({
      id: `dep_admin_${i}`,
      userId: user.id,
      amount: Math.round(rand() * 50000) / 100 + 100,
      currency: pick(["USDT", "BTC", "ETH", "USDC"]),
      method: pick(methods),
      reference: `VLTDEP${1000 + i}`,
      status: pick(statuses),
      createdAt: new Date(Date.now() - i * 3600000 * 6).toISOString(),
    });
  }
  return deps;
}

export const adminDemoDeposits: Deposit[] = generateAdminDeposits();

// Admin withdrawals
function generateAdminWithdrawals(): Withdrawal[] {
  const wds: Withdrawal[] = [...demoWithdrawals];
  const statuses: Withdrawal["status"][] = [
    "pending",
    "processing",
    "completed",
    "rejected",
  ];
  for (let i = 0; i < 30; i++) {
    const user = adminDemoUsers[i + 10];
    wds.push({
      id: `wd_admin_${i}`,
      userId: user.id,
      amount: Math.round(rand() * 20000) / 100 + 50,
      asset: pick(["USDT", "BTC", "ETH"]),
      destinationAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
      network: pick(["ERC-20", "Bitcoin", "TRC-20"]),
      fee: Math.round(rand() * 10 * 100) / 100,
      status: pick(statuses),
      createdAt: new Date(Date.now() - i * 3600000 * 8).toISOString(),
    });
  }
  return wds;
}

export const adminDemoWithdrawals: Withdrawal[] = generateAdminWithdrawals();

// Admin KYC submissions
function generateAdminKYCs(): KYCSubmission[] {
  const kycs: KYCSubmission[] = [{ ...demoKYC, userId: "usr_demo" }];
  const statuses: KYCSubmission["status"][] = [
    "pending",
    "under_review",
    "verified",
    "rejected",
  ];
  const idTypes = ["Passport", "Driver License", "National ID"];
  for (let i = 0; i < 25; i++) {
    const user = adminDemoUsers[i + 20];
    kycs.push({
      id: `kyc_admin_${i}`,
      userId: user.id,
      legalName: `${user.firstName} ${user.lastName}`,
      dateOfBirth: `19${80 + Math.floor(rand() * 20)}-0${1 + Math.floor(rand() * 9)}-${10 + Math.floor(rand() * 28)}`,
      country: user.country,
      address: `${100 + Math.floor(rand() * 900)} Main St, ${user.country}`,
      idType: pick(idTypes),
      idNumber: `${pick(["P", "D", "N"])}${Math.floor(rand() * 10000000)}`,
      status: pick(statuses),
      submittedAt: new Date(Date.now() - i * 3600000 * 12).toISOString(),
    });
  }
  return kycs;
}

export const adminDemoKYCs: KYCSubmission[] = generateAdminKYCs();

// Admin support tickets
function generateAdminTickets(): SupportTicket[] {
  const tickets: SupportTicket[] = [...demoTickets];
  const categories = [
    "Account",
    "Deposits",
    "Withdrawals",
    "Investments",
    "Mining",
    "Security",
    "KYC",
    "Fees",
  ];
  const priorities: SupportPriority[] = ["low", "medium", "high", "urgent"];
  const statuses: SupportTicketStatus[] = [
    "open",
    "in_progress",
    "resolved",
    "closed",
  ];
  const subjects = [
    "Cannot login",
    "Deposit not showing",
    "Withdrawal delay",
    "Investment question",
    "Mining contract issue",
    "2FA problem",
    "KYC document upload",
    "Fee inquiry",
  ];
  for (let i = 0; i < 35; i++) {
    const user = adminDemoUsers[i + 15];
    tickets.push({
      id: `tk_admin_${i}`,
      userId: user.id,
      subject: pick(subjects),
      category: pick(categories),
      priority: pick(priorities),
      status: pick(statuses),
      message: "I need help with my account.",
      createdAt: new Date(Date.now() - i * 3600000 * 5).toISOString(),
      messages: [
        {
          sender: "user",
          text: "I need help with my account.",
          timestamp: new Date(Date.now() - i * 3600000 * 5).toISOString(),
        },
      ],
    });
  }
  return tickets;
}

export const adminDemoTickets: SupportTicket[] = generateAdminTickets();

// Audit logs
export const demoAuditLogs: AuditLog[] = [
  {
    id: "al1",
    adminId: "adm_demo",
    adminName: "Admin Manager",
    action: "KYC Approved",
    target: "usr_demo",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    ip: "192.168.1.1",
  },
  {
    id: "al2",
    adminId: "adm_demo",
    adminName: "Admin Manager",
    action: "Withdrawal Approved",
    target: "wd1",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    ip: "192.168.1.1",
  },
  {
    id: "al3",
    adminId: "adm_demo",
    adminName: "Admin Manager",
    action: "Investment Plan Edited",
    target: "plan_growth",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    ip: "192.168.1.1",
  },
  {
    id: "al4",
    adminId: "adm_demo",
    adminName: "Admin Manager",
    action: "User Suspended",
    target: "usr_15",
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    ip: "192.168.1.1",
  },
  {
    id: "al5",
    adminId: "adm_demo",
    adminName: "Admin Manager",
    action: "Settings Updated",
    target: "platform_settings",
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    ip: "192.168.1.1",
  },
  {
    id: "al6",
    adminId: "adm_demo",
    adminName: "Admin Manager",
    action: "Admin Login",
    target: "system",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    ip: "192.168.1.1",
  },
];

// Admin notifications
export const adminDemoNotifications: Notification[] = [
  {
    id: "an1",
    userId: "adm_demo",
    type: "system",
    title: "New KYC Submission",
    message: "A new KYC submission requires review.",
    read: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "an2",
    userId: "adm_demo",
    type: "withdrawal",
    title: "Withdrawal Request",
    message: "A new withdrawal request of $500 BTC is pending approval.",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "an3",
    userId: "adm_demo",
    type: "deposit",
    title: "New Deposit",
    message: "A new deposit of 10,000 USDT is pending confirmation.",
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "an4",
    userId: "adm_demo",
    type: "system",
    title: "New Support Ticket",
    message: "A new high-priority support ticket has been created.",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];
