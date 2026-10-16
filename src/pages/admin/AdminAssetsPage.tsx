import { useState, useEffect } from "react";
import { Coins, Plus, Edit, Search } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cryptoService } from "@/services/cryptoService";
import type { Asset } from "@/types";
import { formatCurrency, formatCompact, capitalize } from "@/utils";

export function AdminAssetsPage() {
  const { success } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Asset | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cryptoService.getMarkets().then((d) => {
      setAssets(d);
      setLoading(false);
    });
  }, []);

  const filtered = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vaulta-text">
            Asset Management
          </h1>
          <p className="mt-1 text-sm text-vaulta-muted">
            Configure crypto assets
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          <Plus size={16} /> Add Asset
        </Button>
      </div>

      <Card>
        <div className="relative max-w-xs mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-vaulta-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="input-field pl-9"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-vaulta-border">
                <th className="px-3 py-2 text-left font-semibold text-vaulta-muted">
                  Asset
                </th>
                <th className="px-3 py-2 text-left font-semibold text-vaulta-muted">
                  Network
                </th>
                <th className="px-3 py-2 text-right font-semibold text-vaulta-muted">
                  Price
                </th>
                <th className="px-3 py-2 text-right font-semibold text-vaulta-muted">
                  Market Cap
                </th>
                <th className="px-3 py-2 text-center font-semibold text-vaulta-muted">
                  Deposit
                </th>
                <th className="px-3 py-2 text-center font-semibold text-vaulta-muted">
                  Withdraw
                </th>
                <th className="px-3 py-2 text-center font-semibold text-vaulta-muted">
                  Trading
                </th>
                <th className="px-3 py-2 text-right font-semibold text-vaulta-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={8} className="px-3 py-3">
                        <div className="h-8 skeleton rounded" />
                      </td>
                    </tr>
                  ))
                : filtered.map((asset) => (
                    <tr
                      key={asset.id}
                      className="border-b border-vaulta-border last:border-0 hover:bg-vaulta-bg/30 dark:hover:bg-vaulta-dark-surface/30 transition-colors"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-vaulta-cerulean/10 text-xs font-bold text-vaulta-cerulean">
                            {asset.logo}
                          </div>
                          <div>
                            <p className="font-semibold text-vaulta-text">
                              {asset.symbol}
                            </p>
                            <p className="text-xs text-vaulta-muted">
                              {asset.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-vaulta-text">
                        {asset.network}
                      </td>
                      <td className="px-3 py-3 text-right text-vaulta-text">
                        {formatCurrency(
                          asset.price,
                          "USD",
                          asset.price < 1 ? 4 : 2,
                        )}
                      </td>
                      <td className="px-3 py-3 text-right text-vaulta-muted">
                        {formatCompact(asset.marketCap)}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Badge
                          className={
                            asset.depositAvailable
                              ? "bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring"
                              : "bg-vaulta-muted/15 text-vaulta-muted"
                          }
                        >
                          {asset.depositAvailable ? "On" : "Off"}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Badge
                          className={
                            asset.withdrawAvailable
                              ? "bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring"
                              : "bg-vaulta-muted/15 text-vaulta-muted"
                          }
                        >
                          {asset.withdrawAvailable ? "On" : "Off"}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Badge
                          className={
                            asset.tradingStatus === "active"
                              ? "bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring"
                              : "bg-vaulta-muted/15 text-vaulta-muted"
                          }
                        >
                          {capitalize(asset.tradingStatus)}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          onClick={() => {
                            setEditing(asset);
                            setShowForm(true);
                          }}
                          className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Asset" : "Add Asset"}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Name
              </label>
              <input defaultValue={editing?.name} className="input-field" />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Symbol
              </label>
              <input defaultValue={editing?.symbol} className="input-field" />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Network
              </label>
              <input defaultValue={editing?.network} className="input-field" />
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Display Order
              </label>
              <input
                type="number"
                defaultValue={editing?.displayOrder}
                className="input-field"
              />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-2 text-sm text-vaulta-text cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={editing?.depositAvailable}
                className="rounded border-vaulta-border"
              />{" "}
              Deposit
            </label>
            <label className="flex items-center gap-2 text-sm text-vaulta-text cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={editing?.withdrawAvailable}
                className="rounded border-vaulta-border"
              />{" "}
              Withdraw
            </label>
            <label className="flex items-center gap-2 text-sm text-vaulta-text cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={editing?.tradingStatus === "active"}
                className="rounded border-vaulta-border"
              />{" "}
              Trading
            </label>
          </div>
          <Button
            onClick={() => {
              success("Asset updated!");
              setShowForm(false);
            }}
            className="w-full"
          >
            {editing ? "Update Asset" : "Add Asset"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
