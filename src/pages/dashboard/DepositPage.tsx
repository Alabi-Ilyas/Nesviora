import { useState, useEffect } from "react";
import {
  ArrowDownToLine,
  Copy,
  Check,
  Upload,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/States";
import { depositService } from "@/services";
import type { Deposit } from "@/types";
import {
  formatCurrency,
  formatDate,
  capitalize,
  getStatusColor,
  truncateAddress,
  copyToClipboard,
} from "@/utils";

const methods = [
  {
    id: "crypto",
    label: "Cryptocurrency transfer",
    desc: "Send an approved asset on the selected network",
  },
];

const currencies = ["BTC", "ETH", "USDT", "XRP", "BNB", "SOL", "TRX", "LTC"];

export function DepositPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const method = "crypto";
  const [currency, setCurrency] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    depositService.getDeposits(user?.id || "").then((data) => {
      setDeposits(data);
      setLoading(false);
    });
  }, [user]);

  const depositAddresses: Record<string, string> = {
    BTC: "bc1q7k6755v2699z6t9g4fh66y07wppm6vq70zpd5e",
    ETH: "0x6066b8B57fD39fa0cD2A675071F0ECC9D106B7A7",
    USDT: "0x6066b8B57fD39fa0cD2A675071F0ECC9D106B7A7",
    XRP: "rHctioEZmMg3ZDbYpZWzebNX83rriDnPss",
    BNB: "0x6066b8B57fD39fa0cD2A675071F0ECC9D106B7A7",
    SOL: "4qLc3YR3EmHyvGHycGr7L1iKbkj4VK5jA6CXbB4wLjt7",
    TRX: "TRVzp55xm4PD9aJdVTyk7JVR7firshZHX7",
    LTC: "LPq35joqf7WgPz4w9CtwLG1Xk7iH1eszzh",
  };
  const depositAddress = depositAddresses[currency];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      error("Please enter a valid amount.");
      return;
    }
    setSubmitting(true);
    try {
      await depositService.createDeposit(user?.id || "", {
        amount: amt,
        currency,
        method:
          methods.find((m) => m.id === method)?.label || "Crypto Transfer",
      });
      success(
        "Deposit submitted successfully! Your deposit is pending confirmation.",
      );
      setAmount("");
      setUploaded(false);
      const updated = await depositService.getDeposits(user?.id || "");
      setDeposits(updated);
    } catch (e) {
      error(e instanceof Error ? e.message : "Failed to submit deposit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(depositAddress);
    setCopied(true);
    success("Address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const columns: Column<Deposit>[] = [
    {
      key: "reference",
      header: "Reference",
      sortable: true,
      sortValue: (r) => r.reference,
      render: (r) => (
        <span className="font-mono text-xs text-vaulta-text">
          {r.reference}
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
          {formatCurrency(r.amount)} {r.currency}
        </span>
      ),
    },
    {
      key: "method",
      header: "Method",
      render: (r) => <span className="text-vaulta-text">{r.method}</span>,
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      sortValue: (r) => r.createdAt,
      render: (r) => (
        <span className="text-vaulta-muted text-xs">
          {formatDate(r.createdAt)}
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
        <h1 className="text-2xl font-bold text-vaulta-text">Deposit Funds</h1>
        <p className="mt-1 text-sm text-vaulta-muted">
          Add approved cryptocurrency assets to your Nesviora Capital Market
          Limited account
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Deposit form */}
        <Card className="lg:col-span-2">
          <h2 className="font-semibold text-vaulta-text mb-4">
            Deposit Details
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-vaulta-text mb-2">
              Asset and Network
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {methods.map((m) => (
                <button
                  key={m.id}
                  className={`rounded-lg border p-3 text-left transition-all ${method === m.id ? "border-vaulta-cerulean bg-vaulta-cerulean/5" : "border-vaulta-border hover:border-vaulta-cerulean"}`}
                >
                  <p className="text-sm font-medium text-vaulta-text">
                    {m.label}
                  </p>
                  <p className="text-xs text-vaulta-muted mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="input-field"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {method === "crypto" || method === "wallet" ? (
              <div className="rounded-lg border border-vaulta-border bg-vaulta-bg dark:bg-vaulta-dark-bg p-4">
                <p className="text-sm font-medium text-vaulta-text mb-2">
                  Deposit Address
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded-lg border border-vaulta-border bg-vaulta-surface px-3 py-2 text-sm text-vaulta-text">
                    {depositAddress}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="rounded-lg border border-vaulta-border p-2 text-vaulta-muted hover:border-vaulta-cerulean hover:text-vaulta-cerulean transition-colors"
                  >
                    {copied ? (
                      <Check
                        size={16}
                        className="text-vaulta-spring-dark dark:text-vaulta-spring"
                      />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-vaulta-muted">
                  Send only {currency} to this address. Sending other assets may
                  result in permanent loss.
                </p>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-vaulta-cerulean/5 px-3 py-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white">
                    <div className="grid grid-cols-5 gap-px">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-2 ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-vaulta-muted">
                    Scan QR code to deposit
                  </p>
                </div>
              </div>
            ) : method === "bank" ? (
              <div className="rounded-lg border border-vaulta-border bg-vaulta-bg dark:bg-vaulta-dark-bg p-4 space-y-2 text-sm">
                <p className="font-medium text-vaulta-text">
                  Bank Transfer Details
                </p>
                <div className="flex justify-between">
                  <span className="text-vaulta-muted">Bank</span>
                  <span className="text-vaulta-text">First National Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vaulta-muted">Account Name</span>
                  <span className="text-vaulta-text">
                    Nesviora Capital Market Limited Inc.
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vaulta-muted">Account Number</span>
                  <span className="text-vaulta-text">0123456789</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vaulta-muted">Routing</span>
                  <span className="text-vaulta-text">021000021</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vaulta-muted">Reference</span>
                  <span className="text-vaulta-text font-mono">
                    VLT-{user?.id?.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-vaulta-border bg-vaulta-bg dark:bg-vaulta-dark-bg p-4">
                <p className="text-sm text-vaulta-muted">
                  You will be redirected to our payment provider to complete
                  your card payment securely.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                Upload Receipt (Optional)
              </label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-vaulta-border py-3 text-sm text-vaulta-muted hover:border-vaulta-cerulean transition-colors">
                <Upload size={16} />
                {uploaded ? "Receipt uploaded" : "Click to upload"}
                <input
                  type="file"
                  className="hidden"
                  onChange={() => setUploaded(true)}
                  accept="image/*,.pdf"
                />
              </label>
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-vaulta-warning/20 bg-vaulta-warning/5 p-3">
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0 text-vaulta-warning"
              />
              <p className="text-xs text-vaulta-muted">
                Only blockchain receipt and authorized verification can confirm
                a deposit. Do not send unsupported assets or networks.
              </p>
            </div>

            <Button type="submit" loading={submitting} className="w-full">
              <ArrowDownToLine size={16} /> Submit Deposit
            </Button>
          </form>
        </Card>

        {/* Deposit history */}
        <Card>
          <h2 className="font-semibold text-vaulta-text mb-4">
            Recent Deposits
          </h2>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 skeleton rounded" />
              ))}
            </div>
          ) : deposits.length === 0 ? (
            <EmptyState
              icon={ArrowDownToLine}
              title="No deposits yet"
              message="Your deposit history will appear here."
            />
          ) : (
            <div className="space-y-2">
              {deposits.slice(0, 5).map((d) => (
                <div
                  key={d.id}
                  className="rounded-lg border border-vaulta-border p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-vaulta-text">
                      {formatCurrency(d.amount)} {d.currency}
                    </span>
                    <Badge className={getStatusColor(d.status)}>
                      {capitalize(d.status)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-vaulta-muted">
                    {d.method} - {formatDate(d.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold text-vaulta-text mb-4">Deposit History</h2>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 skeleton rounded" />
            ))}
          </div>
        ) : deposits.length === 0 ? (
          <EmptyState icon={ArrowDownToLine} title="No deposits yet" />
        ) : (
          <DataTable
            columns={columns}
            data={deposits}
            pageSize={10}
            searchable
            searchKeys={["reference", "method", "status"] as (keyof Deposit)[]}
            exportable
            exportFilename="deposits"
          />
        )}
      </Card>
    </div>
  );
}
