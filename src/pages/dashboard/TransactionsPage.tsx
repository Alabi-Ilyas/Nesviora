import { useState, useEffect } from "react";
import {
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Pickaxe,
  Coins,
  DollarSign,
  Award,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/States";
import { transactionService } from "@/services";
import type { Transaction } from "@/types";
import {
  formatCurrency,
  formatDateTime,
  capitalize,
  getStatusColor,
} from "@/utils";

const typeIcons: Record<string, typeof ArrowDownToLine> = {
  deposit: ArrowDownToLine,
  withdrawal: ArrowUpFromLine,
  investment: TrendingUp,
  mining: Pickaxe,
  transfer: ArrowLeftRight,
  fee: DollarSign,
  adjustment: Coins,
  reward: Award,
};

const filters = ["all", "completed", "pending", "failed"] as const;

export function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  useEffect(() => {
    transactionService.getTransactions(user?.id || "").then((data) => {
      setTransactions(data);
      setLoading(false);
    });
  }, [user]);

  const filtered = transactions.filter(
    (t) => filter === "all" || t.status === filter,
  );

  const totalIn = transactions
    .filter((t) => t.type === "deposit" && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions
    .filter((t) => t.type === "withdrawal" && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);
  const totalFees = transactions.reduce((s, t) => s + t.fee, 0);

  const columns: Column<Transaction>[] = [
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      sortValue: (r) => r.createdAt,
      render: (r) => (
        <span className="text-vaulta-muted text-xs">
          {formatDateTime(r.createdAt)}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      sortValue: (r) => r.type,
      render: (r) => {
        const Icon = typeIcons[r.type] || ArrowLeftRight;
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-vaulta-cerulean/10">
              <Icon size={14} className="text-vaulta-cerulean" />
            </div>
            <span className="text-vaulta-text capitalize">{r.type}</span>
          </div>
        );
      },
    },
    {
      key: "asset",
      header: "Asset",
      sortable: true,
      sortValue: (r) => r.asset,
      render: (r) => <span className="text-vaulta-text">{r.asset}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      sortValue: (r) => r.amount,
      render: (r) => (
        <span className="font-semibold text-vaulta-text">
          {formatCurrency(r.amount)}
        </span>
      ),
    },
    {
      key: "fee",
      header: "Fee",
      render: (r) => (
        <span className="text-vaulta-muted">{formatCurrency(r.fee)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <Badge className={getStatusColor(r.status)}>
          {capitalize(r.status)}
        </Badge>
      ),
    },
    {
      key: "reference",
      header: "Reference",
      render: (r) => (
        <span className="font-mono text-xs text-vaulta-muted">
          {r.reference}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vaulta-text">Transactions</h1>
        <p className="mt-1 text-sm text-vaulta-muted">
          Complete transaction history
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-vaulta-muted">Total Deposited</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-spring-dark dark:text-vaulta-spring">
            {formatCurrency(totalIn)}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Total Withdrawn</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-danger">
            {formatCurrency(totalOut)}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Total Fees</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-text">
            {formatCurrency(totalFees)}
          </h3>
        </Card>
      </div>

      <div className="flex gap-1 border-b border-vaulta-border">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative px-4 py-2.5 text-sm font-medium capitalize transition-colors ${filter === f ? "text-vaulta-cerulean" : "text-vaulta-muted hover:text-vaulta-text"}`}
          >
            {f}
            {filter === f && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-vaulta-cerulean" />
            )}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 skeleton rounded" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions found"
            message="Transactions will appear here once you start using your account."
          />
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            pageSize={10}
            searchable
            searchKeys={
              ["type", "asset", "status", "reference"] as (keyof Transaction)[]
            }
            exportable
            exportFilename="transactions"
          />
        )}
      </Card>
    </div>
  );
}
