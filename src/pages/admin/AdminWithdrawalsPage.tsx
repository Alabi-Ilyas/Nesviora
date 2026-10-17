import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { withdrawalService, adminService } from "@/services";
import type { Withdrawal } from "@/types";
import {
  formatCurrency,
  formatDate,
  capitalize,
  getStatusColor,
  truncateAddress,
} from "@/utils";

export function AdminWithdrawalsPage() {
  const { user: admin } = useAuth();
  const { success, error } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Withdrawal | null>(null);
  const [hash, setHash] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    withdrawalService.getAllWithdrawals().then((d) => {
      setWithdrawals(d);
      setLoading(false);
    });
  }, []);

  const handleAction = async (status: Withdrawal["status"]) => {
    if (!selected) return;
    try {
      await withdrawalService.updateWithdrawalStatus(
        selected.id,
        status,
        hash || undefined,
        note || undefined,
      );
    } catch (e) {
      error(e instanceof Error ? e.message : "Could not update the withdrawal");
      return;
    }
    await adminService.addAuditLog({
      adminId: admin?.id || "",
      adminName: `${admin?.firstName} ${admin?.lastName}`,
      action: `Withdrawal ${capitalize(status)}`,
      target: selected.id,
      ip: "192.168.1.1",
      metadata: hash || note,
    });
    success(`Withdrawal ${status}.`);
    setSelected(null);
    setHash("");
    setNote("");
    const updated = await withdrawalService.getAllWithdrawals();
    setWithdrawals(updated);
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
          {truncateAddress(r.destinationAddress)}
        </span>
      ),
    },
    {
      key: "network",
      header: "Network",
      render: (r) => <span className="text-vaulta-text">{r.network}</span>,
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
        <h1 className="text-2xl font-bold text-vaulta-text">
          Withdrawal Management
        </h1>
        <p className="mt-1 text-sm text-vaulta-muted">
          Review and process withdrawal requests
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <p className="text-sm text-vaulta-muted">Pending</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-warning">
            {withdrawals.filter((w) => w.status === "pending").length}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Processing</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-cerulean">
            {withdrawals.filter((w) => w.status === "processing").length}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Completed</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-spring-dark dark:text-vaulta-spring">
            {withdrawals.filter((w) => w.status === "completed").length}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Total Value</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-text">
            {formatCurrency(
              withdrawals
                .filter((w) => w.status === "completed")
                .reduce((s, w) => s + w.amount, 0),
            )}
          </h3>
        </Card>
      </div>

      <Card>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 skeleton rounded" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={withdrawals}
            pageSize={15}
            searchable
            searchKeys={["id", "asset", "status"] as (keyof Withdrawal)[]}
            exportable
            exportFilename="withdrawals"
            actions={(row) => (
              <button
                onClick={() => setSelected(row)}
                className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"
              >
                <Eye size={16} />
              </button>
            )}
          />
        )}
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Withdrawal Review"
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                [
                  "Amount",
                  `${formatCurrency(selected.amount)} ${selected.asset}`,
                ],
                ["Fee", formatCurrency(selected.fee)],
                ["Network", selected.network],
                [
                  "Destination",
                  truncateAddress(selected.destinationAddress, 16),
                ],
                ["Date", formatDate(selected.createdAt)],
                ["Status", capitalize(selected.status)],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="rounded-lg border border-vaulta-border p-3"
                >
                  <p className="text-xs text-vaulta-muted">{l}</p>
                  <p className="font-semibold text-vaulta-text break-all">
                    {v}
                  </p>
                </div>
              ))}
            </div>
            {selected.hash && (
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Transaction Hash</p>
                <p className="font-mono text-xs text-vaulta-text break-all">
                  {selected.hash}
                </p>
              </div>
            )}
            {(selected.status === "pending" ||
              selected.status === "processing") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                    Transaction Hash
                  </label>
                  <input
                    value={hash}
                    onChange={(e) => setHash(e.target.value)}
                    className="input-field font-mono text-xs"
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                    Internal Note
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="input-field resize-none"
                    placeholder="Add a note..."
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleAction("rejected")}
                  >
                    <XCircle size={14} /> Reject
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAction("processing")}
                  >
                    <Clock size={14} /> Processing
                  </Button>
                  <Button size="sm" onClick={() => handleAction("completed")}>
                    <CheckCircle size={14} /> Complete
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
