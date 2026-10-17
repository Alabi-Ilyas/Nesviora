import { useState, useEffect } from "react";
import { ArrowUpFromLine, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/States";
import { withdrawalService, settingsService } from "@/services";
import type { Withdrawal, PlatformSettings } from "@/types";
import {
  formatCurrency,
  formatDateTime,
  capitalize,
  getStatusColor,
} from "@/utils";

const assets = ["BTC", "ETH", "USDT", "XRP", "BNB", "SOL", "TRX", "LTC"];
const networks: Record<string, string[]> = {
  USDT: ["ERC-20", "TRC-20"],
  BTC: ["Bitcoin"],
  ETH: ["Ethereum (ERC-20)"],
  XRP: ["XRPL"],
  TRX: ["TRON"],
  LTC: ["Litecoin"],
  SOL: ["Solana"],
  BNB: ["BNB Chain (BEP-20)"],
};

export function WithdrawPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    asset: "USDT",
    amount: "",
    destination: "",
    network: "ERC-20",
    twoFactor: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      withdrawalService.getWithdrawals(user?.id || ""),
      settingsService.getSettings(),
    ]).then(([w, s]) => {
      setWithdrawals(w);
      setSettings(s);
      setLoading(false);
    });
  }, [user]);

  const fee = settings
    ? (parseFloat(form.amount || "0") * settings.fees.withdrawalFee) / 100
    : 0;
  const total = parseFloat(form.amount || "0") + fee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) {
      error("Please enter a valid amount.");
      return;
    }
    if (!form.destination) {
      error("Please enter a destination wallet address.");
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await withdrawalService.createWithdrawal(user?.id || "", {
        amount: parseFloat(form.amount),
        asset: form.asset,
        destinationAddress: form.destination,
        network: form.network,
        fee,
      });
      success("Withdrawal request submitted! It will be reviewed by our team.");
      setForm({
        asset: "USDT",
        amount: "",
        destination: "",
        network: "ERC-20",
        twoFactor: "",
      });
      const updated = await withdrawalService.getWithdrawals(user?.id || "");
      setWithdrawals(updated);
    } catch (e) {
      error(e instanceof Error ? e.message : "Failed to submit withdrawal");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Withdrawal>[] = [
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
      key: "amount",
      header: "Amount",
      sortable: true,
      sortValue: (r) => r.amount,
      render: (r) => (
        <span className="font-semibold text-vaulta-text">
          {formatCurrency(r.amount)} {r.asset}
        </span>
      ),
    },
    {
      key: "destinationAddress",
      header: "Destination",
      render: (r) => (
        <span className="font-mono text-xs text-vaulta-muted">
          {r.destinationAddress.slice(0, 10)}...{r.destinationAddress.slice(-6)}
        </span>
      ),
    },
    {
      key: "network",
      header: "Network",
      render: (r) => <span className="text-vaulta-text">{r.network}</span>,
    },
    {
      key: "fee",
      header: "Fee",
      render: (r) => (
        <span className="text-vaulta-muted">{formatCurrency(r.fee)}</span>
      ),
    },
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
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vaulta-text">Withdraw Funds</h1>
        <p className="mt-1 text-sm text-vaulta-muted">
          Withdraw funds from your Nesviora Capital Market Limited account
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold text-vaulta-text mb-4">
            Withdrawal Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                  Asset
                </label>
                <select
                  value={form.asset}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      asset: e.target.value,
                      network: networks[e.target.value]?.[0] || "",
                    })
                  }
                  className="input-field"
                >
                  {assets.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                  Network
                </label>
                <select
                  value={form.network}
                  onChange={(e) =>
                    setForm({ ...form, network: e.target.value })
                  }
                  className="input-field"
                >
                  {(networks[form.asset] || []).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                Amount
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="input-field"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <div className="mt-1.5 flex items-center justify-between text-xs text-vaulta-muted">
                <span>
                  Fee: {formatCurrency(fee)} (
                  {settings?.fees.withdrawalFee || 1}%)
                </span>
                <span>Total: {formatCurrency(total)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                Destination Wallet Address
              </label>
              <input
                type="text"
                value={form.destination}
                onChange={(e) =>
                  setForm({ ...form, destination: e.target.value })
                }
                className="input-field font-mono"
                placeholder="Enter wallet address"
              />
            </div>


            <div className="flex items-start gap-2 rounded-lg border border-vaulta-warning/20 bg-vaulta-warning/5 p-3">
              <AlertTriangle
                size={16}
                className="mt-0.5 shrink-0 text-vaulta-warning"
              />
              <div>
                <p className="text-xs font-medium text-vaulta-text">
                  Security Warning
                </p>
                <p className="text-xs text-vaulta-muted mt-0.5">
                  Always verify the destination address. Crypto transactions are
                  irreversible. Nesviora Capital Market Limited will never ask
                  for your password.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full">
              <ArrowUpFromLine size={16} /> Submit Withdrawal
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={20}
                className="text-vaulta-spring-dark dark:text-vaulta-spring"
              />
              <div>
                <p className="text-sm font-medium text-vaulta-text">
                  Withdrawal Security
                </p>
                <p className="text-xs text-vaulta-muted mt-0.5">
                  All withdrawals are reviewed by our team before processing.
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-vaulta-text mb-3">
              Withdrawal Limits
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-vaulta-muted">Daily Limit</span>
                <span className="font-medium text-vaulta-text">
                  {formatCurrency(50000)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-vaulta-muted">Monthly Limit</span>
                <span className="font-medium text-vaulta-text">
                  {formatCurrency(500000)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-vaulta-muted">Minimum</span>
                <span className="font-medium text-vaulta-text">
                  {formatCurrency(10)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-vaulta-muted">Fee</span>
                <span className="font-medium text-vaulta-text">
                  {settings?.fees.withdrawalFee || 1}%
                </span>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-vaulta-text mb-3">
              Processing Times
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-vaulta-muted">Review</span>
                <span className="font-medium text-vaulta-text">24-48h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-vaulta-muted">Crypto Transfer</span>
                <span className="font-medium text-vaulta-text">1-4h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-vaulta-muted">Crypto network</span>
                <span className="font-medium text-vaulta-text">3-5 days</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <h2 className="font-semibold text-vaulta-text mb-4">
          Withdrawal History
        </h2>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 skeleton rounded" />
            ))}
          </div>
        ) : withdrawals.length === 0 ? (
          <EmptyState
            icon={ArrowUpFromLine}
            title="No withdrawals yet"
            message="Your withdrawal history will appear here."
          />
        ) : (
          <DataTable
            columns={columns}
            data={withdrawals}
            pageSize={10}
            searchable
            exportable
            exportFilename="withdrawals"
          />
        )}
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm Withdrawal"
        message={`Withdraw ${formatCurrency(parseFloat(form.amount || "0"))} ${form.asset} to ${form.destination.slice(0, 12)}...? Fee: ${formatCurrency(fee)}. Total: ${formatCurrency(total)}.`}
        confirmLabel="Confirm Withdrawal"
      />
    </div>
  );
}
