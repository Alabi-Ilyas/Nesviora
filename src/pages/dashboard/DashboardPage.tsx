import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  Pickaxe,
  DollarSign,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Coins,
  Banknote,
  PieChart as PieIcon,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard, Card } from "@/components/ui/StatCard";
import { AreaChart, PieChartComponent } from "@/components/charts/Charts";
import { Skeleton, EmptyState } from "@/components/ui/States";
import { cryptoService } from "@/services/cryptoService";
import {
  transactionService,
  investmentService,
  miningService,
} from "@/services";
import type { Transaction, Investment, MiningContract } from "@/types";
import { formatCurrency, capitalize, getStatusColor, timeAgo } from "@/utils";

const timeFilters = ["1D", "7D", "1M", "3M", "6M", "1Y", "ALL"];
const timeMap: Record<string, number> = {
  "1D": 1,
  "7D": 7,
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365,
  ALL: 730,
};

export function DashboardPage() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>(
    [],
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [mining, setMining] = useState<MiningContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("1M");

  useEffect(() => {
    Promise.all([
      cryptoService.getPortfolioChart(timeMap[timeFilter]),
      transactionService.getTransactions(user?.id || ""),
      investmentService.getInvestments(user?.id || ""),
      miningService.getContracts(user?.id || ""),
    ]).then(([chart, txns, inv, mc]) => {
      setChartData(chart);
      setTransactions(txns);
      setInvestments(inv);
      setMining(mc);
      setLoading(false);
    });
  }, [user, timeFilter]);

  const invested = investments
    .filter((i) => i.status === "active")
    .reduce((s, i) => s + i.currentValue, 0);
  const miningBalance = mining
    .filter((m) => m.status === "active")
    .reduce((s, m) => s + m.totalReward * 67000, 0);
  const availableBalance = 8250;
  const totalBalance = invested + miningBalance + availableBalance;
  const profitLoss = investments.reduce(
    (s, i) => s + (i.currentValue - i.principal),
    0,
  );

  const allocation = [
    { name: "Invested", value: invested },
    { name: "Mining", value: miningBalance },
    { name: "Available", value: availableBalance },
  ];

  const quickActions = [
    { label: "Deposit", icon: ArrowDownToLine, path: "/dashboard/deposit" },
    { label: "Withdraw", icon: ArrowUpFromLine, path: "/dashboard/withdraw" },
    { label: "Invest", icon: TrendingUp, path: "/dashboard/investments" },
    { label: "Mining", icon: Pickaxe, path: "/dashboard/mining" },
    {
      label: "Transfer",
      icon: ArrowLeftRight,
      path: "/dashboard/transactions",
    },
    { label: "Buy Crypto", icon: Coins, path: "/dashboard/deposit" },
    { label: "Sell Crypto", icon: Banknote, path: "/dashboard/withdraw" },
    { label: "Portfolio", icon: PieIcon, path: "/dashboard/portfolio" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-vaulta-text">
          Welcome back, {user?.firstName}
        </h1>
        <p className="mt-1 text-sm text-vaulta-muted">
          Here's an overview of your portfolio
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-nesviora" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Balance"
              value={formatCurrency(totalBalance)}
              icon={Wallet}
            />
            <StatCard
              title="Invested"
              value={formatCurrency(invested)}
              icon={TrendingUp}
            />
            <StatCard
              title="Available"
              value={formatCurrency(availableBalance)}
              icon={DollarSign}
            />
            <StatCard
              title="Mining Balance"
              value={formatCurrency(miningBalance)}
              icon={Pickaxe}
            />
            <StatCard
              title="Portfolio Value"
              value={formatCurrency(totalBalance)}
              icon={PieIcon}
              change="+12.4%"
              positive
            />
            <StatCard
              title="Profit/Loss"
              value={formatCurrency(profitLoss)}
              icon={TrendingUp}
              change={`+${((profitLoss / investments.reduce((s, i) => s + i.principal, 0)) * 100).toFixed(1)}%`}
              positive
            />
          </>
        )}
      </div>

      {/* Chart + Allocation */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-vaulta-text">
                Portfolio Performance
              </h2>
              <p className="text-xs text-vaulta-muted">
                Track your portfolio value over time
              </p>
            </div>
            <div className="flex gap-1">
              {timeFilters.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeFilter(tf)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    timeFilter === tf
                      ? "bg-vaulta-cerulean text-white"
                      : "text-vaulta-muted hover:text-vaulta-text"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-64 w-full rounded-nesviora" />
          ) : (
            <AreaChart data={chartData} height={280} />
          )}
        </Card>

        <Card>
          <h2 className="font-semibold text-vaulta-text mb-4">
            Asset Allocation
          </h2>
          {loading ? (
            <Skeleton className="h-48 w-full rounded-nesviora" />
          ) : (
            <>
              <PieChartComponent
                data={allocation}
                height={200}
                valuePrefix="$"
              />
              <div className="mt-4 space-y-2">
                {allocation.map((item, i) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          background: ["#006989", "#0CF574", "#FF7D00"][i],
                        }}
                      />
                      <span className="text-vaulta-text">{item.name}</span>
                    </div>
                    <span className="font-medium text-vaulta-text">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Recent transactions + Quick actions */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-vaulta-text">
              Recent Transactions
            </h2>
            <Link
              to="/dashboard/transactions"
              className="text-xs font-medium text-vaulta-cerulean hover:underline"
            >
              View all
            </Link>
          </div>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))
          ) : transactions.length === 0 ? (
            <EmptyState
              title="No transactions yet"
              message="Your transaction history will appear here."
            />
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border border-vaulta-border p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-vaulta-cerulean/10">
                      {tx.type === "deposit" ? (
                        <ArrowDownToLine
                          size={16}
                          className="text-vaulta-spring-dark dark:text-vaulta-spring"
                        />
                      ) : tx.type === "withdrawal" ? (
                        <ArrowUpFromLine
                          size={16}
                          className="text-vaulta-danger"
                        />
                      ) : tx.type === "investment" ? (
                        <TrendingUp
                          size={16}
                          className="text-vaulta-cerulean"
                        />
                      ) : tx.type === "mining" ? (
                        <Pickaxe size={16} className="text-vaulta-orange" />
                      ) : (
                        <ArrowLeftRight
                          size={16}
                          className="text-vaulta-muted"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-vaulta-text capitalize">
                        {tx.type}
                      </p>
                      <p className="text-xs text-vaulta-muted">
                        {tx.asset} - {timeAgo(tx.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-vaulta-text">
                      {formatCurrency(tx.amount)}
                    </p>
                    <span className={`text-xs ${getStatusColor(tx.status)}`}>
                      {capitalize(tx.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold text-vaulta-text mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="flex flex-col items-center gap-2 rounded-lg border border-vaulta-border p-3 transition-all hover:border-vaulta-cerulean hover:shadow-vaulta-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-vaulta-cerulean/10 text-vaulta-cerulean">
                  <action.icon size={18} />
                </div>
                <span className="text-xs font-medium text-vaulta-text">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
