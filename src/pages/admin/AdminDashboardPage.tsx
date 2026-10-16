import { useState, useEffect } from "react";
import {
  Users,
  FileCheck,
  TrendingUp,
  Pickaxe,
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  Activity,
} from "lucide-react";
import { StatCard, Card } from "@/components/ui/StatCard";
import {
  AreaChart,
  BarChartComponent,
  PieChartComponent,
} from "@/components/charts/Charts";
import { Skeleton } from "@/components/ui/States";
import {
  adminService,
  depositService,
  withdrawalService,
  transactionService,
} from "@/services";
import type { User, Deposit, Withdrawal } from "@/types";
import { formatCurrency, formatCompact } from "@/utils";

export function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userGrowth, setUserGrowth] = useState<
    { time: string; value: number }[]
  >([]);
  const [txVolume, setTxVolume] = useState<{ name: string; value: number }[]>(
    [],
  );

  useEffect(() => {
    Promise.all([
      adminService.getUsers(),
      depositService.getAllDeposits(),
      withdrawalService.getAllWithdrawals(),
      transactionService.getAllTransactions(),
    ]).then(([u, d, w]) => {
      setUsers(u);
      setDeposits(d);
      setWithdrawals(w);
      const growth = Array.from({ length: 12 }).map((_, i) => ({
        time: new Date(Date.now() - (11 - i) * 30 * 86400000).toISOString(),
        value: Math.floor(80 + i * 12 + Math.random() * 20),
      }));
      setUserGrowth(growth);
      setTxVolume([
        { name: "Mon", value: 120000 + Math.random() * 50000 },
        { name: "Tue", value: 95000 + Math.random() * 50000 },
        { name: "Wed", value: 150000 + Math.random() * 50000 },
        { name: "Thu", value: 110000 + Math.random() * 50000 },
        { name: "Fri", value: 180000 + Math.random() * 50000 },
        { name: "Sat", value: 85000 + Math.random() * 50000 },
        { name: "Sun", value: 72000 + Math.random() * 50000 },
      ]);
      setLoading(false);
    });
  }, []);

  const totalDeposits = deposits
    .filter((d) => d.status === "confirmed")
    .reduce((s, d) => s + d.amount, 0);
  const totalWithdrawals = withdrawals
    .filter((w) => w.status === "completed")
    .reduce((s, w) => s + w.amount, 0);
  const pendingKYC = users.filter(
    (u) => u.kycStatus === "pending" || u.kycStatus === "under_review",
  ).length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const platformFees = totalDeposits * 0.02;

  const revenueData = [
    { name: "Jan", value: 12000 },
    { name: "Feb", value: 15000 },
    { name: "Mar", value: 18000 },
    { name: "Apr", value: 22000 },
    { name: "May", value: 28000 },
    { name: "Jun", value: 32000 },
    { name: "Jul", value: 35000 },
    { name: "Aug", value: 42000 },
    { name: "Sep", value: 48000 },
  ];

  const assetDistribution = [
    { name: "BTC", value: 35 },
    { name: "ETH", value: 25 },
    { name: "USDT", value: 20 },
    { name: "SOL", value: 10 },
    { name: "Other", value: 10 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vaulta-text">Admin Overview</h1>
        <p className="mt-1 text-sm text-vaulta-muted">
          Platform analytics and key metrics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-vaulta" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={String(users.length)}
              icon={Users}
              change={`+${activeUsers} active`}
              positive
            />
            <StatCard
              title="Pending KYC"
              value={String(pendingKYC)}
              icon={FileCheck}
            />
            <StatCard
              title="Total Deposits"
              value={formatCurrency(totalDeposits)}
              icon={ArrowDownToLine}
              change="+12.5%"
              positive
            />
            <StatCard
              title="Total Withdrawals"
              value={formatCurrency(totalWithdrawals)}
              icon={ArrowUpFromLine}
            />
            <StatCard
              title="Active Investments"
              value="245"
              icon={TrendingUp}
              change="+8.2%"
              positive
            />
            <StatCard title="Mining Contracts" value="89" icon={Pickaxe} />
            <StatCard
              title="Platform Fees"
              value={formatCurrency(platformFees)}
              icon={DollarSign}
              change="+15.3%"
              positive
            />
            <StatCard
              title="Daily Volume"
              value={formatCompact(185000)}
              icon={Activity}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="font-semibold text-vaulta-text mb-4">User Growth</h2>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <AreaChart data={userGrowth} height={280} valuePrefix="" />
          )}
        </Card>
        <Card>
          <h2 className="font-semibold text-vaulta-text mb-4">
            Asset Distribution
          </h2>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <PieChartComponent
              data={assetDistribution}
              height={200}
              valuePrefix=""
            />
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-vaulta-text mb-4">
            Transaction Volume (7 days)
          </h2>
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <BarChartComponent data={txVolume} height={240} valuePrefix="$" />
          )}
        </Card>
        <Card>
          <h2 className="font-semibold text-vaulta-text mb-4">
            Platform Revenue
          </h2>
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <AreaChart data={revenueData} height={240} color="#0CF574" />
          )}
        </Card>
      </div>
    </div>
  );
}
