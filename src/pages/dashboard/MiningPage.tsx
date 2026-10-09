import { useState, useEffect } from "react";
import { Pickaxe, Plus, Eye, Zap, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { AreaChart } from "@/components/charts/Charts";
import { EmptyState } from "@/components/ui/States";
import { miningService } from "@/services";
import type { MiningContract, MiningPlan } from "@/types";
import {
  formatCurrency,
  formatDate,
  capitalize,
  getStatusColor,
} from "@/utils";

export function MiningPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [contracts, setContracts] = useState<MiningContract[]>([]);
  const [plans, setPlans] = useState<MiningPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MiningPlan | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [detail, setDetail] = useState<MiningContract | null>(null);
  const [confirmPurchase, setConfirmPurchase] = useState(false);

  useEffect(() => {
    Promise.all([
      miningService.getContracts(user?.id || ""),
      miningService.getPlans(),
    ]).then(([c, p]) => {
      setContracts(c);
      setPlans(p.filter((pl) => pl.status === "active"));
      setLoading(false);
    });
  }, [user]);

  const activeContracts = contracts.filter((c) => c.status === "active");
  const totalReward = contracts.reduce((s, c) => s + c.totalReward, 0);
  const totalDaily = activeContracts.reduce((s, c) => s + c.dailyReward, 0);

  const handlePurchase = async () => {
    if (!selectedPlan) return;
    setPurchasing(true);
    try {
      await miningService.purchaseContract(user?.id || "", selectedPlan.id);
      success("Mining contract purchased successfully!");
      setShowPlans(false);
      setSelectedPlan(null);
      setConfirmPurchase(false);
      const updated = await miningService.getContracts(user?.id || "");
      setContracts(updated);
    } catch (e) {
      error(e instanceof Error ? e.message : "Failed to purchase contract");
    } finally {
      setPurchasing(false);
    }
  };

  const rewardData = Array.from({ length: 14 }).map((_, i) => ({
    time: new Date(Date.now() - (13 - i) * 86400000).toISOString(),
    value: totalDaily * (0.8 + Math.random() * 0.4),
  }));

  const columns: Column<MiningContract>[] = [
    {
      key: "planName",
      header: "Contract",
      sortable: true,
      sortValue: (r) => r.planName,
      render: (r) => (
        <span className="font-semibold text-vaulta-text">{r.planName}</span>
      ),
    },
    {
      key: "asset",
      header: "Asset",
      render: (r) => <span className="text-vaulta-text">{r.asset}</span>,
    },
    {
      key: "hashrate",
      header: "Hashrate",
      render: (r) => <span className="text-vaulta-text">{r.hashrate}</span>,
    },
    {
      key: "dailyReward",
      header: "Daily Reward",
      sortable: true,
      sortValue: (r) => r.dailyReward,
      render: (r) => (
        <span className="font-medium text-vaulta-spring-dark dark:text-vaulta-spring">
          {r.dailyReward} {r.asset}
        </span>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      sortable: true,
      sortValue: (r) => r.progress,
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 rounded-full bg-vaulta-border overflow-hidden">
            <div
              className="h-full bg-vaulta-cerulean"
              style={{ width: `${r.progress}%` }}
            />
          </div>
          <span className="text-xs text-vaulta-muted">{r.progress}%</span>
        </div>
      ),
    },
    {
      key: "endDate",
      header: "Expiry",
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vaulta-text">Mining</h1>
          <p className="mt-1 text-sm text-vaulta-muted">
            Your mining contracts and activity
          </p>
        </div>
        <Button onClick={() => setShowPlans(true)}>
          <Plus size={16} /> New Contract
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-vaulta-muted">Total Mining Balance</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-text">
            {formatCurrency(totalReward * 67000)}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Active Contracts</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-text">
            {activeContracts.length}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Daily Reward</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-spring-dark dark:text-vaulta-spring">
            {totalDaily.toFixed(6)}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Total Rewards</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-text">
            {totalReward.toFixed(6)}
          </h3>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold text-vaulta-text mb-4">
          Mining Activity (14 days)
        </h2>
        <AreaChart
          data={rewardData}
          height={200}
          color="#FF7D00"
          valuePrefix=""
        />
      </Card>

      <Card>
        <h2 className="font-semibold text-vaulta-text mb-4">
          Mining Contracts
        </h2>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 skeleton rounded" />
            ))}
          </div>
        ) : contracts.length === 0 ? (
          <EmptyState
            icon={Pickaxe}
            title="No mining contracts yet"
            message="Purchase a mining plan to start earning rewards."
            action={
              <Button onClick={() => setShowPlans(true)}>
                <Plus size={16} /> Browse Plans
              </Button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={contracts}
            pageSize={10}
            searchable
            searchKeys={
              ["planName", "asset", "status"] as (keyof MiningContract)[]
            }
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
        title="Mining Plans"
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-nesviora border p-4 ${selectedPlan?.id === plan.id ? "border-vaulta-cerulean ring-1 ring-vaulta-cerulean/20" : "border-vaulta-border"}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-vaulta-orange/10 text-vaulta-orange">
                  <Pickaxe size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-vaulta-text">{plan.name}</h3>
                  <p className="text-xs text-vaulta-muted">{plan.asset}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-vaulta-muted">
                    <Zap size={12} /> Hashrate
                  </span>
                  <span className="font-medium text-vaulta-text">
                    {plan.hashrate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-vaulta-muted">
                    <Clock size={12} /> Duration
                  </span>
                  <span className="font-medium text-vaulta-text">
                    {plan.durationDays} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vaulta-muted">Price</span>
                  <span className="font-medium text-vaulta-text">
                    {formatCurrency(plan.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vaulta-muted">Est. Daily</span>
                  <span className="font-medium text-vaulta-spring-dark dark:text-vaulta-spring">
                    {plan.estimatedDailyOutput} {plan.asset}
                  </span>
                </div>
              </div>
              <Button
                variant={selectedPlan?.id === plan.id ? "primary" : "secondary"}
                size="sm"
                className="mt-3 w-full"
                onClick={() => setSelectedPlan(plan)}
              >
                {selectedPlan?.id === plan.id ? "Selected" : "Select"}
              </Button>
            </div>
          ))}
        </div>
        {selectedPlan && (
          <div className="mt-4 border-t border-vaulta-border pt-4">
            <p className="text-xs text-vaulta-muted mb-3">
              Mining estimates are not guarantees of profit. Actual rewards
              depend on network conditions.
            </p>
            <Button onClick={() => setConfirmPurchase(true)} className="w-full">
              <Pickaxe size={16} /> Purchase for{" "}
              {formatCurrency(selectedPlan.price)}
            </Button>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmPurchase}
        onClose={() => setConfirmPurchase(false)}
        onConfirm={handlePurchase}
        title="Confirm Purchase"
        message={`Purchase ${selectedPlan?.name} for ${formatCurrency(selectedPlan?.price || 0)}? This will create a ${selectedPlan?.durationDays}-day mining contract.`}
        confirmLabel="Confirm Purchase"
      />

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title="Contract Details"
        size="md"
      >
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Contract", detail.planName],
                ["Asset", detail.asset],
                ["Hashrate", detail.hashrate],
                ["Daily Reward", `${detail.dailyReward} ${detail.asset}`],
                [
                  "Total Reward",
                  `${detail.totalReward.toFixed(6)} ${detail.asset}`,
                ],
                ["Maintenance Fee", `$${detail.maintenanceFee}/kWh`],
                ["Start Date", formatDate(detail.startDate)],
                ["End Date", formatDate(detail.endDate)],
                ["Progress", `${detail.progress}%`],
                ["Status", capitalize(detail.status)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-vaulta-border p-3"
                >
                  <p className="text-xs text-vaulta-muted">{label}</p>
                  <p className="font-semibold text-vaulta-text">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
