import { useState, useEffect } from "react";
import { Card, Badge } from "@/components/ui/StatCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { transactionService } from "@/services";
import type { Transaction } from "@/types";
import {
  formatCurrency,
  formatDateTime,
  capitalize,
  getStatusColor,
} from "@/utils";

export function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionService.getAllTransactions().then((d) => {
      setTransactions(d);
      setLoading(false);
    });
  }, []);

  const columns: Column<Transaction>[] = [
    {
      key: "id",
      header: "ID",
      render: (r) => (
        <span className="font-mono text-xs text-vaulta-muted">
          {r.id.slice(0, 12)}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      sortValue: (r) => r.type,
      render: (r) => (
        <span className="text-vaulta-text capitalize">{r.type}</span>
      ),
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
    {
      key: "createdAt",
      header: "Timestamp",
      sortable: true,
      sortValue: (r) => r.createdAt,
      render: (r) => (
        <span className="text-vaulta-muted text-xs">
          {formatDateTime(r.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vaulta-text">
          Transaction Management
        </h1>
        <p className="mt-1 text-sm text-vaulta-muted">
          Complete transaction ledger
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <p className="text-sm text-vaulta-muted">Total</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-text">
            {transactions.length}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Completed</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-spring-dark dark:text-vaulta-spring">
            {transactions.filter((t) => t.status === "completed").length}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Pending</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-warning">
            {transactions.filter((t) => t.status === "pending").length}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Volume</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-text">
            {formatCurrency(transactions.reduce((s, t) => s + t.amount, 0))}
          </h3>
        </Card>
      </div>
      <Card>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 skeleton rounded" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={transactions}
            pageSize={20}
            searchable
            searchKeys={
              ["type", "asset", "status", "reference"] as (keyof Transaction)[]
            }
            exportable
            exportFilename="all_transactions"
          />
        )}
      </Card>
    </div>
  );
}
