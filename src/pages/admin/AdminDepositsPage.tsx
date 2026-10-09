import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { depositService, adminService } from "@/services";
import type { Deposit } from "@/types";
import {
  formatCurrency,
  formatDate,
  capitalize,
  getStatusColor,
} from "@/utils";

export function AdminDepositsPage() {
  const { user: admin } = useAuth();
  const { success } = useToast();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Deposit | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    depositService.getAllDeposits().then((d) => {
      setDeposits(d);
      setLoading(false);
    });
  }, []);

  const handleAction = async (status: Deposit["status"]) => {
    if (!selected) return;
    await depositService.updateDepositStatus(selected.id, status, note);
    await adminService.addAuditLog({
      adminId: admin?.id || "",
      adminName: `${admin?.firstName} ${admin?.lastName}`,
      action: `Deposit ${capitalize(status)}`,
      target: selected.id,
      ip: "192.168.1.1",
    });
    success(`Deposit ${status}.`);
    setSelected(null);
    setNote("");
    const updated = await depositService.getAllDeposits();
    setDeposits(updated);
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
      sortable: true,
      sortValue: (r) => r.method,
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
        <h1 className="text-2xl font-bold text-vaulta-text">
          Deposit Management
        </h1>
        <p className="mt-1 text-sm text-vaulta-muted">
          Review and process deposits
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <p className="text-sm text-vaulta-muted">Pending</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-warning">
            {deposits.filter((d) => d.status === "pending").length}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Confirmed</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-spring-dark dark:text-vaulta-spring">
            {deposits.filter((d) => d.status === "confirmed").length}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Failed</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-danger">
            {deposits.filter((d) => d.status === "failed").length}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-vaulta-muted">Total Value</p>
          <h3 className="mt-1 text-2xl font-bold text-vaulta-text">
            {formatCurrency(
              deposits
                .filter((d) => d.status === "confirmed")
                .reduce((s, d) => s + d.amount, 0),
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
            data={deposits}
            pageSize={15}
            searchable
            searchKeys={["reference", "method", "status"] as (keyof Deposit)[]}
            exportable
            exportFilename="deposits"
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
        title="Deposit Review"
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Reference", selected.reference],
                [
                  "Amount",
                  `${formatCurrency(selected.amount)} ${selected.currency}`,
                ],
                ["Method", selected.method],
                ["Date", formatDate(selected.createdAt)],
                ["Status", capitalize(selected.status)],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="rounded-lg border border-vaulta-border p-3"
                >
                  <p className="text-xs text-vaulta-muted">{l}</p>
                  <p className="font-semibold text-vaulta-text">{v}</p>
                </div>
              ))}
            </div>
            {selected.status === "pending" && (
              <>
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
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => handleAction("failed")}
                  >
                    <XCircle size={16} /> Reject
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleAction("confirmed")}
                  >
                    <CheckCircle size={16} /> Confirm
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
