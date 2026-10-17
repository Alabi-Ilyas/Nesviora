import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  DollarSign,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  LifeBuoy,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { StatCard, Card } from "@/components/ui/StatCard";
import { PieChartComponent } from "@/components/charts/Charts";
import { Skeleton, EmptyState } from "@/components/ui/States";
import { transactionService, investmentService, walletService } from "@/services";
import type { Transaction, Investment } from "@/types";
import { formatCurrency, formatDate, capitalize, getStatusColor, timeAgo } from "@/utils";

const quickActions = [
  { label: "Deposit", icon: ArrowDownToLine, path: "/dashboard/deposit" },
  { label: "Withdraw", icon: ArrowUpFromLine, path: "/dashboard/withdraw" },
  { label: "Invest", icon: TrendingUp, path: "/dashboard/investments" },
  { label: "Wallet", icon: Wallet, path: "/dashboard/wallet" },
  { label: "Transactions", icon: ArrowLeftRight, path: "/dashboard/transactions" },
  { label: "Support", icon: LifeBuoy, path: "/dashboard/support" },
];

// Everything on this page comes from the API: wallet balance, investments and the ledger.
export function DashboardPage() {
  const { user } = useAuth();
  const { error } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [available, setAvailable] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      transactionService.getTransactions(user?.id || ""),
      investmentService.getInvestments(user?.id || ""),
      walletService.getWallets(user?.id || ""),
    ])
      .then(([txns, inv, wallets]) => {
        setTransactions(txns);
        setInvestments(inv);
        setAvailable(wallets[0]?.balance ?? 0);
      })
      .catch((e) => error(e instanceof Error ? e.message : "Could not load your dashboard"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const active = investments.filter((i) => i.status === "active");
  const invested = active.reduce((s, i) => s + i.currentValue, 0);
  const profitLoss = active.reduce((s, i) => s + (i.currentValue - i.principal), 0);
  const totalBalance = available + invested;
  const allocation = [
    { name: "Invested", value: invested },
    { name: "Available", value: available },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vaulta-text">Welcome back, {user?.firstName}</h1>
        <p className="mt-1 text-sm text-vaulta-muted">Here's an overview of your account</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-nesviora" />)
        ) : (
          <>
            <StatCard title="Total Balance" value={formatCurrency(totalBalance)} icon={Wallet} />
            <StatCard title="Available" value={formatCurrency(available)} icon={DollarSign} />
            <StatCard title="Invested" value={formatCurrency(invested)} icon={TrendingUp} />
            <StatCard title="Profit/Loss" value={formatCurrency(profitLoss)} icon={TrendingUp} positive={profitLoss >= 0} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-vaulta-text">Active Investments</h2>
            <Link to="/dashboard/investments" className="text-xs font-medium text-vaulta-cerulean hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <Skeleton className="h-40 w-full rounded-nesviora" />
          ) : active.length === 0 ? (
            <EmptyState
              title="No active investments"
              message="Deposit funds, then choose a plan to start investing."
            />
          ) : (
            <div className="space-y-2">
              {active.slice(0, 5).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between rounded-lg border border-vaulta-border p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-vaulta-text">{inv.planName}</p>
                    <p className="text-xs text-vaulta-muted">Ends {formatDate(inv.endDate)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-vaulta-text">{formatCurrency(inv.currentValue)}</p>
                    <p className="text-xs text-vaulta-muted">Principal {formatCurrency(inv.principal)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold text-vaulta-text mb-4">Allocation</h2>
          {loading ? (
            <Skeleton className="h-48 w-full rounded-nesviora" />
          ) : totalBalance === 0 ? (
            <EmptyState title="Nothing to show yet" message="Your allocation appears after your first deposit." />
          ) : (
            <>
              <PieChartComponent data={allocation} height={200} valuePrefix="$" />
              <div className="mt-4 space-y-2">
                {allocation.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: ["#006989", "#0CF574"][i] }} />
                      <span className="text-vaulta-text">{item.name}</span>
                    </div>
                    <span className="font-medium text-vaulta-text">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-vaulta-text">Recent Transactions</h2>
            <Link to="/dashboard/transactions" className="text-xs font-medium text-vaulta-cerulean hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)
          ) : transactions.length === 0 ? (
            <EmptyState title="No transactions yet" message="Your transaction history will appear here." />
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-lg border border-vaulta-border p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-vaulta-text capitalize">{tx.type}</p>
                    <p className="text-xs text-vaulta-muted">
                      {tx.asset} - {timeAgo(tx.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-vaulta-text">{formatCurrency(tx.amount)}</p>
                    <span className={`text-xs ${getStatusColor(tx.status)}`}>{capitalize(tx.status)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold text-vaulta-text mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="flex flex-col items-center gap-2 rounded-lg border border-vaulta-border p-3 transition-all hover:border-vaulta-cerulean hover:shadow-vaulta-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-vaulta-cerulean/10 text-vaulta-cerulean">
                  <action.icon size={18} />
                </div>
                <span className="text-xs font-medium text-vaulta-text">{action.label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
