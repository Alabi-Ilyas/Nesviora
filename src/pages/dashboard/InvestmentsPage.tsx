import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Plus, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/States";
import { Link } from "react-router-dom";
import { investmentService, walletService } from "@/services";
import type { Investment, InvestmentPlan } from "@/types";
import {
  formatCurrency,
  formatDate,
  capitalize,
  getStatusColor,
} from "@/utils";

export function InvestmentsPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<
    "active" | "completed" | "pending" | "history"
  >("active");
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investAmount, setInvestAmount] = useState("");
  const [investAsset, setInvestAsset] = useState("USD");
  const [balance, setBalance] = useState(0);
  const [creating, setCreating] = useState(false);
  const [detail, setDetail] = useState<Investment | null>(null);
  const [confirmExit, setConfirmExit] = useState<Investment | null>(null);

  useEffect(() => {
    Promise.all([
      investmentService.getInvestments(user?.id || ""),
      investmentService.getPlans(),
      walletService.getWallets(user?.id || ""),
    ])
      .then(([inv, pl, w]) => {
        setInvestments(inv);
        setPlans(pl.filter((p) => p.status === "active"));
        setBalance(w[0]?.balance ?? 0);
      })
      .catch((e) =>
        error(e instanceof Error ? e.message : "Could not load investments"),
      )
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = investments.filter((i) => {
    if (tab === "history") return true;
    return i.status === tab;
  });

  const handleCreateInvestment = async () => {
    if (!selectedPlan) return;
    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount < selectedPlan.minAmount) {
      error(`Minimum amount is ${formatCurrency(selectedPlan.minAmount)}`);
      return;
    }
    if (amount > selectedPlan.maxAmount) {
      error(`Maximum amount is ${formatCurrency(selectedPlan.maxAmount)}`);
      return;
    }
    if (amount + (amount * selectedPlan.fees) / 100 > balance) {
      error("Insufficient balance. Please make a deposit first.");
      return;
    }
    setCreating(true);
    try {
      await investmentService.createInvestment(
        user?.id || "",
        selectedPlan.id,
        amount,
        investAsset,
      );
      success("Investment created successfully!");
      setShowPlans(false);
      setSelectedPlan(null);
      setInvestAmount("");
      const [updated, w] = await Promise.all([
        investmentService.getInvestments(user?.id || ""),
        walletService.getWallets(user?.id || ""),
      ]);
      setInvestments(updated);
      setBalance(w[0]?.balance ?? 0);
    } catch (e) {
      error(e instanceof Error ? e.message : "Failed to create investment");
    } finally {
      setCreating(false);
    }
  };

  const columns: Column<Investment>[] = [
    {
      key: "planName",
      header: "Plan",
      sortable: true,
      sortValue: (r) => r.planName,
      render: (r) => (
        <span className="font-semibold text-vaulta-text">{r.planName}</span>
      ),
    },
    {
      key: "principal",
      header: "Principal",
      sortable: true,
      sortValue: (r) => r.principal,
      render: (r) => (
        <span className="text-vaulta-text">{formatCurrency(r.principal)}</span>
      ),
    },
    {
      key: "currentValue",
      header: "Current Value",
      sortable: true,
      sortValue: (r) => r.currentValue,
      render: (r) => (
        <span className="font-semibold text-vaulta-text">
          {formatCurrency(r.currentValue)}
        </span>
      ),
    },
    {
      key: "asset",
      header: "Asset",
      render: (r) => <span className="text-vaulta-text">{r.asset}</span>,
    },
    {
      key: "startDate",
      header: "Start Date",
      sortable: true,
      sortValue: (r) => r.startDate,
      render: (r) => (
        <span className="text-vaulta-muted text-xs">
          {formatDate(r.startDate)}
        </span>
      ),
    },
    {
      key: "endDate",
      header: "End Date",
      sortable: true,
      sortValue: (r) => r.endDate,
      render: (r) => (
        <span className="text-vaulta-muted text-xs">
          {formatDate(r.endDate)}
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
    {
      key: "fees",
      header: "Fees",
      render: (r) => (
        <span className="text-vaulta-muted">{formatCurrency(r.fees)}</span>
      ),
    },
  ];

  const tabs = [
    {
      key: "active" as const,
      label: "Active",
      count: investments.filter((i) => i.status === "active").length,
    },
    {
      key: "completed" as const,
      label: "Completed",
      count: investments.filter((i) => i.status === "completed").length,
    },
    {
      key: "pending" as const,
      label: "Pending",
      count: investments.filter((i) => i.status === "pending").length,
    },
    { key: "history" as const, label: "History", count: investments.length },
  ];

  const totalValue = investments
    .filter((i) => i.status === "active")
    .reduce((s, i) => s + i.currentValue, 0);
  const totalProfit = investments.reduce(
    (s, i) => s + (i.currentValue - i.principal),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vaulta-text">Investments</h1>
          <p className="mt-1 text-sm text-vaulta-muted">
            Manage your investment positions
          </p>
        </div>
        <Button onClick={() => setShowPlans(true)}>
          <Plus size={16} /> New Investment
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-vaulta-muted">Active Investments Value</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-text">
            {formatCurrency(totalValue)}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Total Profit/Loss</p>
          <h3
            className={`mt-1 text-2xl font-bold ${totalProfit >= 0 ? "text-vaulta-spring-dark dark:text-vaulta-spring" : "text-vaulta-danger"}`}
          >
            {totalProfit >= 0 ? "+" : ""}
            {formatCurrency(totalProfit)}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Total Investments</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-text">
            {investments.length}
          </h3>
        </Card>
      </div>

      <div className="flex gap-1 border-b border-vaulta-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? "text-vaulta-cerulean"
                : "text-vaulta-muted hover:text-vaulta-text"
            }`}
          >
            {t.label} ({t.count})
            {tab === t.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-vaulta-cerulean" />
            )}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 skeleton rounded" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No investments found"
            message="Start investing by choosing a plan."
            action={
              <Button onClick={() => setShowPlans(true)}>
                <Plus size={16} /> New Investment
              </Button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            pageSize={10}
            searchable
            searchKeys={["planName", "asset", "status"] as (keyof Investment)[]}
            exportable
            exportFilename="investments"
            actions={(row) => (
              <button
                onClick={() => setDetail(row)}
                className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"
              >
                <Eye size={16} />
              </button>
            )}
          />
        )}
      </Card>

      {/* Plans modal */}
      <Modal
        open={showPlans}
        onClose={() => setShowPlans(false)}
        title="Investment Plans"
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-nesviora border p-4 ${selectedPlan?.id === plan.id ? "border-vaulta-cerulean ring-1 ring-vaulta-cerulean/20" : "border-vaulta-border"}`}
            >
              <h3 className="font-bold text-vaulta-text">{plan.name}</h3>
              <p className="mt-1 text-xs text-vaulta-muted">
                {plan.durationDays} days
              </p>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-vaulta-muted">Min</span>
                  <span className="font-medium text-vaulta-text">
                    {formatCurrency(plan.minAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vaulta-muted">Max</span>
                  <span className="font-medium text-vaulta-text">
                    {formatCurrency(plan.maxAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vaulta-muted">Fees</span>
                  <span className="font-medium text-vaulta-text">
                    {plan.fees}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vaulta-muted">Risk</span>
                  <span
                    className={`font-medium ${plan.riskLevel === "low" ? "text-vaulta-spring-dark dark:text-vaulta-spring" : plan.riskLevel === "medium" ? "text-vaulta-warning" : "text-vaulta-danger"}`}
                  >
                    {plan.riskLevel}
                  </span>
                </div>
              </div>
              <Button
                variant={selectedPlan?.id === plan.id ? "primary" : "secondary"}
                size="sm"
                className="mt-3 w-full"
                onClick={() => {
                  setSelectedPlan(plan);
                  setInvestAsset(plan.supportedAssets[0] || "USD");
                  setInvestAmount(String(plan.minAmount));
                }}
              >
                {selectedPlan?.id === plan.id ? "Selected" : "Select"}
              </Button>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="mt-6 border-t border-vaulta-border pt-4 space-y-3">
            <h4 className="font-semibold text-vaulta-text">
              Investment Details
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-vaulta-muted mb-1">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className="input-field"
                  min={selectedPlan.minAmount}
                  max={selectedPlan.maxAmount}
                />
                <p className="mt-1 text-xs text-vaulta-muted">
                  Min: {formatCurrency(selectedPlan.minAmount)} / Max:{" "}
                  {formatCurrency(selectedPlan.maxAmount)}
                </p>
              </div>
              <div>
                <label className="block text-xs text-vaulta-muted mb-1">
                  Asset
                </label>
                <select
                  value={investAsset}
                  onChange={(e) => setInvestAsset(e.target.value)}
                  className="input-field"
                >
                  {(selectedPlan.supportedAssets.length > 0
                    ? selectedPlan.supportedAssets
                    : ["USD"]
                  ).map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {(() => {
              const amt = parseFloat(investAmount) || 0;
              const fee = (amt * selectedPlan.fees) / 100;
              const short = amt + fee > balance;
              return (
                <div className="rounded-lg border border-vaulta-border p-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-vaulta-muted">Available balance</span>
                    <span className="text-vaulta-text">
                      {formatCurrency(balance)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-vaulta-muted">
                      Fee ({selectedPlan.fees}%)
                    </span>
                    <span className="text-vaulta-text">
                      {formatCurrency(fee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-vaulta-text">
                      Total to be debited
                    </span>
                    <span className="text-vaulta-text">
                      {formatCurrency(amt + fee)}
                    </span>
                  </div>
                  {short && (
                    <p className="pt-1 text-xs text-vaulta-danger">
                      Your balance is too low.{" "}
                      <Link to="/dashboard/deposit" className="underline">
                        Make a deposit
                      </Link>
                    </p>
                  )}
                </div>
              );
            })()}
            <div className="rounded-lg border border-vaulta-border bg-vaulta-bg dark:bg-vaulta-dark-bg p-3 text-xs text-vaulta-muted">
              <p>
                <strong className="text-vaulta-text">Terms:</strong>{" "}
                {selectedPlan.terms}
              </p>
            </div>
            <p className="text-xs text-vaulta-muted">
              Digital asset investments involve risk. Returns are not
              guaranteed.
            </p>
            <Button
              onClick={handleCreateInvestment}
              loading={creating}
              className="w-full"
            >
              <TrendingUp size={16} /> Confirm Investment
            </Button>
          </div>
        )}
      </Modal>

      {/* Detail modal */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title="Investment Details"
        size="md"
      >
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Plan</p>
                <p className="font-semibold text-vaulta-text">
                  {detail.planName}
                </p>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Status</p>
                <Badge className={getStatusColor(detail.status)}>
                  {capitalize(detail.status)}
                </Badge>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Principal</p>
                <p className="font-semibold text-vaulta-text">
                  {formatCurrency(detail.principal)}
                </p>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Current Value</p>
                <p className="font-semibold text-vaulta-text">
                  {formatCurrency(detail.currentValue)}
                </p>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Start Date</p>
                <p className="font-semibold text-vaulta-text">
                  {formatDate(detail.startDate)}
                </p>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">End Date</p>
                <p className="font-semibold text-vaulta-text">
                  {formatDate(detail.endDate)}
                </p>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Asset</p>
                <p className="font-semibold text-vaulta-text">{detail.asset}</p>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Fees</p>
                <p className="font-semibold text-vaulta-text">
                  {formatCurrency(detail.fees)}
                </p>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Expected Return</p>
                <p className="font-semibold text-vaulta-spring-dark dark:text-vaulta-spring">
                  {detail.expectedReturnRate}%
                </p>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">P/L</p>
                <p
                  className={`font-semibold ${detail.currentValue - detail.principal >= 0 ? "text-vaulta-spring-dark dark:text-vaulta-spring" : "text-vaulta-danger"}`}
                >
                  {detail.currentValue - detail.principal >= 0 ? "+" : ""}
                  {formatCurrency(detail.currentValue - detail.principal)}
                </p>
              </div>
            </div>
            {detail.status === "active" && (
              <Button
                variant="danger"
                className="w-full"
                onClick={() => setConfirmExit(detail)}
              >
                Exit Investment Early
              </Button>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmExit}
        onClose={() => setConfirmExit(null)}
        onConfirm={() => {
          success("Investment exit requested.");
          setConfirmExit(null);
          setDetail(null);
        }}
        title="Exit Investment Early?"
        message="Early exit may incur additional fees. Are you sure you want to exit this investment?"
        confirmLabel="Exit Investment"
        danger
      />
    </div>
  );
}
