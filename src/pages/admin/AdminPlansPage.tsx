import { useState, useEffect } from "react";
import { Plus, Edit, Power, Eye } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { investmentService, miningService } from "@/services";
import type { InvestmentPlan, MiningPlan } from "@/types";
import { formatCurrency, capitalize, getStatusColor } from "@/utils";

export function AdminPlansPage() {
  const { success } = useToast();
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<InvestmentPlan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<InvestmentPlan>>({});

  useEffect(() => {
    investmentService.getPlans().then((d) => {
      setPlans(d);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (editing) {
      await investmentService.updatePlan(editing.id, form);
      success("Plan updated successfully!");
    } else {
      await investmentService.createPlan(form as Omit<InvestmentPlan, "id">);
      success("Plan created successfully!");
    }
    setShowForm(false);
    setEditing(null);
    setForm({});
    const updated = await investmentService.getPlans();
    setPlans(updated);
  };

  const handleToggle = async (plan: InvestmentPlan) => {
    const newStatus = plan.status === "active" ? "inactive" : "active";
    await investmentService.updatePlan(plan.id, { status: newStatus });
    success(`Plan ${newStatus}.`);
    const updated = await investmentService.getPlans();
    setPlans(updated);
  };

  const columns: Column<InvestmentPlan>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <span className="font-semibold text-vaulta-text">{r.name}</span>
      ),
    },
    {
      key: "minAmount",
      header: "Min",
      sortable: true,
      sortValue: (r) => r.minAmount,
      render: (r) => (
        <span className="text-vaulta-text">{formatCurrency(r.minAmount)}</span>
      ),
    },
    {
      key: "maxAmount",
      header: "Max",
      sortable: true,
      sortValue: (r) => r.maxAmount,
      render: (r) => (
        <span className="text-vaulta-text">{formatCurrency(r.maxAmount)}</span>
      ),
    },
    {
      key: "durationDays",
      header: "Duration",
      sortable: true,
      sortValue: (r) => r.durationDays,
      render: (r) => (
        <span className="text-vaulta-text">{r.durationDays} days</span>
      ),
    },
    {
      key: "riskLevel",
      header: "Risk",
      render: (r) => (
        <span
          className={`badge ${r.riskLevel === "low" ? "bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring" : r.riskLevel === "medium" ? "bg-vaulta-warning/15 text-vaulta-warning" : "bg-vaulta-danger/15 text-vaulta-danger"}`}
        >
          {r.riskLevel}
        </span>
      ),
    },
    {
      key: "fees",
      header: "Fees",
      render: (r) => <span className="text-vaulta-text">{r.fees}%</span>,
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
          <h1 className="text-2xl font-bold text-vaulta-text">
            Investment Plans
          </h1>
          <p className="mt-1 text-sm text-vaulta-muted">
            Manage investment plans
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setForm({
              name: "",
              minAmount: 100,
              maxAmount: 1000,
              durationDays: 30,
              description: "",
              riskLevel: "low",
              supportedAssets: ["BTC", "ETH", "USDT"],
              status: "active",
              fees: 2,
              terms: "",
              expectedReturnRate: 10,
            });
            setShowForm(true);
          }}
        >
          <Plus size={16} /> New Plan
        </Button>
      </div>
      <Card>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 skeleton rounded" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={plans}
            pageSize={10}
            searchable
            searchKeys={["name", "status"] as (keyof InvestmentPlan)[]}
            actions={(row) => (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditing(row);
                    setForm(row);
                    setShowForm(true);
                  }}
                  className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleToggle(row)}
                  className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-warning/10 hover:text-vaulta-warning transition-colors"
                >
                  <Power size={16} />
                </button>
              </div>
            )}
          />
        )}
      </Card>
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Plan" : "Create Plan"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Name
              </label>
              <input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                value={form.durationDays || ""}
                onChange={(e) =>
                  setForm({ ...form, durationDays: parseInt(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Min Amount
              </label>
              <input
                type="number"
                value={form.minAmount || ""}
                onChange={(e) =>
                  setForm({ ...form, minAmount: parseFloat(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Max Amount
              </label>
              <input
                type="number"
                value={form.maxAmount || ""}
                onChange={(e) =>
                  setForm({ ...form, maxAmount: parseFloat(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Fees (%)
              </label>
              <input
                type="number"
                value={form.fees || ""}
                onChange={(e) =>
                  setForm({ ...form, fees: parseFloat(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Expected Return (%)
              </label>
              <input
                type="number"
                value={form.expectedReturnRate || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    expectedReturnRate: parseFloat(e.target.value),
                  })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Risk Level
              </label>
              <select
                value={form.riskLevel || "low"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    riskLevel: e.target.value as "low" | "medium" | "high",
                  })
                }
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Status
              </label>
              <select
                value={form.status || "active"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as "active" | "inactive",
                  })
                }
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-vaulta-muted mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-vaulta-muted mb-1">
              Terms
            </label>
            <textarea
              rows={2}
              value={form.terms || ""}
              onChange={(e) => setForm({ ...form, terms: e.target.value })}
              className="input-field resize-none"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            {editing ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export function AdminMiningPage() {
  const { success } = useToast();
  const [plans, setPlans] = useState<MiningPlan[]>([]);
  const [contracts, setContracts] = useState<
    { id: string; planName: string; asset: string; status: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MiningPlan | null>(null);
  const [form, setForm] = useState<Partial<MiningPlan>>({});
  const [tab, setTab] = useState<"plans" | "contracts">("plans");

  useEffect(() => {
    Promise.all([
      miningService.getPlans(),
      miningService.getAllContracts(),
    ]).then(([p, c]) => {
      setPlans(p);
      setContracts(c);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (editing) {
      await miningService.updatePlan(editing.id, form);
      success("Mining plan updated!");
    } else {
      await miningService.createPlan(form as Omit<MiningPlan, "id">);
      success("Mining plan created!");
    }
    setShowForm(false);
    setEditing(null);
    setForm({});
    const updated = await miningService.getPlans();
    setPlans(updated);
  };

  const handleToggle = async (plan: MiningPlan) => {
    await miningService.updatePlan(plan.id, {
      status: plan.status === "active" ? "inactive" : "active",
    });
    success(`Plan ${plan.status === "active" ? "disabled" : "enabled"}.`);
    const updated = await miningService.getPlans();
    setPlans(updated);
  };

  const planColumns: Column<MiningPlan>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <span className="font-semibold text-vaulta-text">{r.name}</span>
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
      key: "durationDays",
      header: "Duration",
      sortable: true,
      sortValue: (r) => r.durationDays,
      render: (r) => (
        <span className="text-vaulta-text">{r.durationDays} days</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      sortValue: (r) => r.price,
      render: (r) => (
        <span className="font-semibold text-vaulta-text">
          {formatCurrency(r.price)}
        </span>
      ),
    },
    {
      key: "capacity",
      header: "Capacity",
      render: (r) => <span className="text-vaulta-text">{r.capacity}</span>,
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

  const contractColumns: Column<(typeof contracts)[0]>[] = [
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
      key: "planName",
      header: "Plan",
      sortable: true,
      sortValue: (r) => r.planName,
      render: (r) => <span className="text-vaulta-text">{r.planName}</span>,
    },
    {
      key: "asset",
      header: "Asset",
      render: (r) => <span className="text-vaulta-text">{r.asset}</span>,
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
          <h1 className="text-2xl font-bold text-vaulta-text">
            Mining Management
          </h1>
          <p className="mt-1 text-sm text-vaulta-muted">
            Manage mining plans and contracts
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setForm({
              name: "",
              asset: "BTC",
              hashrate: "50 TH/s",
              durationDays: 180,
              electricityFee: 0.05,
              capacity: 100,
              status: "active",
              price: 199,
              description: "",
              estimatedDailyOutput: 0.0001,
            });
            setShowForm(true);
          }}
        >
          <Plus size={16} /> New Plan
        </Button>
      </div>

      <div className="flex gap-1 border-b border-vaulta-border">
        {[
          { k: "plans", l: "Plans" },
          { k: "contracts", l: "Contracts" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as "plans" | "contracts")}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${tab === t.k ? "text-vaulta-cerulean" : "text-vaulta-muted hover:text-vaulta-text"}`}
          >
            {t.l}
            {tab === t.k && (
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
        ) : tab === "plans" ? (
          <DataTable
            columns={planColumns}
            data={plans}
            pageSize={10}
            searchable
            searchKeys={["name", "asset", "status"] as (keyof MiningPlan)[]}
            actions={(row) => (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditing(row);
                    setForm(row);
                    setShowForm(true);
                  }}
                  className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleToggle(row)}
                  className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-warning/10 hover:text-vaulta-warning transition-colors"
                >
                  <Power size={16} />
                </button>
              </div>
            )}
          />
        ) : (
          <DataTable
            columns={contractColumns}
            data={contracts}
            pageSize={15}
            searchable
            exportable
            exportFilename="mining_contracts"
          />
        )}
      </Card>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Mining Plan" : "Create Mining Plan"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Name
              </label>
              <input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Asset
              </label>
              <select
                value={form.asset || "BTC"}
                onChange={(e) => setForm({ ...form, asset: e.target.value })}
                className="input-field"
              >
                <option>BTC</option>
                <option>ETH</option>
                <option>SOL</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Hashrate
              </label>
              <input
                value={form.hashrate || ""}
                onChange={(e) => setForm({ ...form, hashrate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                value={form.durationDays || ""}
                onChange={(e) =>
                  setForm({ ...form, durationDays: parseInt(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Price
              </label>
              <input
                type="number"
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Electricity Fee
              </label>
              <input
                type="number"
                value={form.electricityFee || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    electricityFee: parseFloat(e.target.value),
                  })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Capacity
              </label>
              <input
                type="number"
                value={form.capacity || ""}
                onChange={(e) =>
                  setForm({ ...form, capacity: parseInt(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Est. Daily Output
              </label>
              <input
                type="number"
                value={form.estimatedDailyOutput || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    estimatedDailyOutput: parseFloat(e.target.value),
                  })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Status
              </label>
              <select
                value={form.status || "active"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as "active" | "inactive",
                  })
                }
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-vaulta-muted mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input-field resize-none"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            {editing ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Plus, Edit, Power, Eye } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { investmentService, miningService } from "@/services";
import type { InvestmentPlan, MiningPlan } from "@/types";
import { formatCurrency, capitalize, getStatusColor } from "@/utils";

export function AdminPlansPage() {
  const { success } = useToast();
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<InvestmentPlan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<InvestmentPlan>>({});

  useEffect(() => {
    investmentService.getPlans().then((d) => {
      setPlans(d);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (editing) {
      await investmentService.updatePlan(editing.id, form);
      success("Plan updated successfully!");
    } else {
      await investmentService.createPlan(form as Omit<InvestmentPlan, "id">);
      success("Plan created successfully!");
    }
    setShowForm(false);
    setEditing(null);
    setForm({});
    const updated = await investmentService.getPlans();
    setPlans(updated);
  };

  const handleToggle = async (plan: InvestmentPlan) => {
    const newStatus = plan.status === "active" ? "inactive" : "active";
    await investmentService.updatePlan(plan.id, { status: newStatus });
    success(`Plan ${newStatus}.`);
    const updated = await investmentService.getPlans();
    setPlans(updated);
  };

  const columns: Column<InvestmentPlan>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <span className="font-semibold text-vaulta-text">{r.name}</span>
      ),
    },
    {
      key: "minAmount",
      header: "Min",
      sortable: true,
      sortValue: (r) => r.minAmount,
      render: (r) => (
        <span className="text-vaulta-text">{formatCurrency(r.minAmount)}</span>
      ),
    },
    {
      key: "maxAmount",
      header: "Max",
      sortable: true,
      sortValue: (r) => r.maxAmount,
      render: (r) => (
        <span className="text-vaulta-text">{formatCurrency(r.maxAmount)}</span>
      ),
    },
    {
      key: "durationDays",
      header: "Duration",
      sortable: true,
      sortValue: (r) => r.durationDays,
      render: (r) => (
        <span className="text-vaulta-text">{r.durationDays} days</span>
      ),
    },
    {
      key: "riskLevel",
      header: "Risk",
      render: (r) => (
        <span
          className={`badge ${r.riskLevel === "low" ? "bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring" : r.riskLevel === "medium" ? "bg-vaulta-warning/15 text-vaulta-warning" : "bg-vaulta-danger/15 text-vaulta-danger"}`}
        >
          {r.riskLevel}
        </span>
      ),
    },
    {
      key: "fees",
      header: "Fees",
      render: (r) => <span className="text-vaulta-text">{r.fees}%</span>,
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
          <h1 className="text-2xl font-bold text-vaulta-text">
            Investment Plans
          </h1>
          <p className="mt-1 text-sm text-vaulta-muted">
            Manage investment plans
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setForm({
              name: "",
              minAmount: 100,
              maxAmount: 1000,
              durationDays: 30,
              description: "",
              riskLevel: "low",
              supportedAssets: ["BTC", "ETH", "USDT"],
              status: "active",
              fees: 2,
              terms: "",
              expectedReturnRate: 10,
            });
            setShowForm(true);
          }}
        >
          <Plus size={16} /> New Plan
        </Button>
      </div>
      <Card>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 skeleton rounded" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={plans}
            pageSize={10}
            searchable
            searchKeys={["name", "status"] as (keyof InvestmentPlan)[]}
            actions={(row) => (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditing(row);
                    setForm(row);
                    setShowForm(true);
                  }}
                  className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleToggle(row)}
                  className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-warning/10 hover:text-vaulta-warning transition-colors"
                >
                  <Power size={16} />
                </button>
              </div>
            )}
          />
        )}
      </Card>
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Plan" : "Create Plan"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Name
              </label>
              <input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                value={form.durationDays || ""}
                onChange={(e) =>
                  setForm({ ...form, durationDays: parseInt(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Min Amount
              </label>
              <input
                type="number"
                value={form.minAmount || ""}
                onChange={(e) =>
                  setForm({ ...form, minAmount: parseFloat(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Max Amount
              </label>
              <input
                type="number"
                value={form.maxAmount || ""}
                onChange={(e) =>
                  setForm({ ...form, maxAmount: parseFloat(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Fees (%)
              </label>
              <input
                type="number"
                value={form.fees || ""}
                onChange={(e) =>
                  setForm({ ...form, fees: parseFloat(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Expected Return (%)
              </label>
              <input
                type="number"
                value={form.expectedReturnRate || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    expectedReturnRate: parseFloat(e.target.value),
                  })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Risk Level
              </label>
              <select
                value={form.riskLevel || "low"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    riskLevel: e.target.value as "low" | "medium" | "high",
                  })
                }
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Status
              </label>
              <select
                value={form.status || "active"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as "active" | "inactive",
                  })
                }
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-vaulta-muted mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-vaulta-muted mb-1">
              Terms
            </label>
            <textarea
              rows={2}
              value={form.terms || ""}
              onChange={(e) => setForm({ ...form, terms: e.target.value })}
              className="input-field resize-none"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            {editing ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export function AdminMiningPage() {
  const { success } = useToast();
  const [plans, setPlans] = useState<MiningPlan[]>([]);
  const [contracts, setContracts] = useState<
    { id: string; planName: string; asset: string; status: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MiningPlan | null>(null);
  const [form, setForm] = useState<Partial<MiningPlan>>({});
  const [tab, setTab] = useState<"plans" | "contracts">("plans");

  useEffect(() => {
    Promise.all([
      miningService.getPlans(),
      miningService.getAllContracts(),
    ]).then(([p, c]) => {
      setPlans(p);
      setContracts(c);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (editing) {
      await miningService.updatePlan(editing.id, form);
      success("Mining plan updated!");
    } else {
      await miningService.createPlan(form as Omit<MiningPlan, "id">);
      success("Mining plan created!");
    }
    setShowForm(false);
    setEditing(null);
    setForm({});
    const updated = await miningService.getPlans();
    setPlans(updated);
  };

  const handleToggle = async (plan: MiningPlan) => {
    await miningService.updatePlan(plan.id, {
      status: plan.status === "active" ? "inactive" : "active",
    });
    success(`Plan ${plan.status === "active" ? "disabled" : "enabled"}.`);
    const updated = await miningService.getPlans();
    setPlans(updated);
  };

  const planColumns: Column<MiningPlan>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <span className="font-semibold text-vaulta-text">{r.name}</span>
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
      key: "durationDays",
      header: "Duration",
      sortable: true,
      sortValue: (r) => r.durationDays,
      render: (r) => (
        <span className="text-vaulta-text">{r.durationDays} days</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      sortValue: (r) => r.price,
      render: (r) => (
        <span className="font-semibold text-vaulta-text">
          {formatCurrency(r.price)}
        </span>
      ),
    },
    {
      key: "capacity",
      header: "Capacity",
      render: (r) => <span className="text-vaulta-text">{r.capacity}</span>,
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

  const contractColumns: Column<(typeof contracts)[0]>[] = [
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
      key: "planName",
      header: "Plan",
      sortable: true,
      sortValue: (r) => r.planName,
      render: (r) => <span className="text-vaulta-text">{r.planName}</span>,
    },
    {
      key: "asset",
      header: "Asset",
      render: (r) => <span className="text-vaulta-text">{r.asset}</span>,
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
          <h1 className="text-2xl font-bold text-vaulta-text">
            Mining Management
          </h1>
          <p className="mt-1 text-sm text-vaulta-muted">
            Manage mining plans and contracts
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setForm({
              name: "",
              asset: "BTC",
              hashrate: "50 TH/s",
              durationDays: 180,
              electricityFee: 0.05,
              capacity: 100,
              status: "active",
              price: 199,
              description: "",
              estimatedDailyOutput: 0.0001,
            });
            setShowForm(true);
          }}
        >
          <Plus size={16} /> New Plan
        </Button>
      </div>

      <div className="flex gap-1 border-b border-vaulta-border">
        {[
          { k: "plans", l: "Plans" },
          { k: "contracts", l: "Contracts" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as "plans" | "contracts")}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${tab === t.k ? "text-vaulta-cerulean" : "text-vaulta-muted hover:text-vaulta-text"}`}
          >
            {t.l}
            {tab === t.k && (
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
        ) : tab === "plans" ? (
          <DataTable
            columns={planColumns}
            data={plans}
            pageSize={10}
            searchable
            searchKeys={["name", "asset", "status"] as (keyof MiningPlan)[]}
            actions={(row) => (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditing(row);
                    setForm(row);
                    setShowForm(true);
                  }}
                  className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleToggle(row)}
                  className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-warning/10 hover:text-vaulta-warning transition-colors"
                >
                  <Power size={16} />
                </button>
              </div>
            )}
          />
        ) : (
          <DataTable
            columns={contractColumns}
            data={contracts}
            pageSize={15}
            searchable
            exportable
            exportFilename="mining_contracts"
          />
        )}
      </Card>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Mining Plan" : "Create Mining Plan"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Name
              </label>
              <input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Asset
              </label>
              <select
                value={form.asset || "BTC"}
                onChange={(e) => setForm({ ...form, asset: e.target.value })}
                className="input-field"
              >
                <option>BTC</option>
                <option>ETH</option>
                <option>SOL</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Hashrate
              </label>
              <input
                value={form.hashrate || ""}
                onChange={(e) => setForm({ ...form, hashrate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                value={form.durationDays || ""}
                onChange={(e) =>
                  setForm({ ...form, durationDays: parseInt(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Price
              </label>
              <input
                type="number"
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Electricity Fee
              </label>
              <input
                type="number"
                value={form.electricityFee || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    electricityFee: parseFloat(e.target.value),
                  })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Capacity
              </label>
              <input
                type="number"
                value={form.capacity || ""}
                onChange={(e) =>
                  setForm({ ...form, capacity: parseInt(e.target.value) })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Est. Daily Output
              </label>
              <input
                type="number"
                value={form.estimatedDailyOutput || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    estimatedDailyOutput: parseFloat(e.target.value),
                  })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Status
              </label>
              <select
                value={form.status || "active"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as "active" | "inactive",
                  })
                }
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-vaulta-muted mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input-field resize-none"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            {editing ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
