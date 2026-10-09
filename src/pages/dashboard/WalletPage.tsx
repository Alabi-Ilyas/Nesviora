import { useState, useEffect } from "react";
import {
  Wallet as WalletIcon,
  Plus,
  Copy,
  Check,
  Trash2,
  Star,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/States";
import { walletService } from "@/services";
import { cryptoService } from "@/services/cryptoService";
import type { Wallet as WalletType, Asset } from "@/types";
import { formatCurrency, truncateAddress, copyToClipboard } from "@/utils";

const availableAssets = [
  { symbol: "BTC", name: "Bitcoin", network: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum", network: "Ethereum (ERC-20)" },
  { symbol: "USDT", name: "Tether", network: "Multi-chain" },
  { symbol: "USDC", name: "USD Coin", network: "Multi-chain" },
  { symbol: "SOL", name: "Solana", network: "Solana" },
  { symbol: "BNB", name: "BNB", network: "BNB Chain" },
  { symbol: "XRP", name: "XRP", network: "XRPL" },
  { symbol: "DOGE", name: "Dogecoin", network: "Dogecoin" },
];

export function WalletPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newAsset, setNewAsset] = useState(availableAssets[0].symbol);
  const [copied, setCopied] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [removeTarget, setRemoveTarget] = useState<WalletType | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    Promise.all([
      walletService.getWallets(user?.id || ""),
      cryptoService.getMarkets(),
    ]).then(([w, a]) => {
      setWallets(w);
      setAssets(a);
      setLoading(false);
    });
  }, [user]);

  const getPrice = (symbol: string) =>
    assets.find((a) => a.symbol === symbol)?.price || 1;

  const handleCopy = async (address: string, id: string) => {
    await copyToClipboard(address);
    setCopied(id);
    success("Address copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleHidden = (id: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = async () => {
    const asset = availableAssets.find((a) => a.symbol === newAsset);
    if (!asset) return;
    if (wallets.find((w) => w.symbol === newAsset)) {
      error(`You already have a ${newAsset} wallet.`);
      return;
    }
    setAdding(true);
    try {
      await walletService.createWallet(
        user?.id || "",
        newAsset.toLowerCase(),
        newAsset,
        asset.network,
      );
      success(`${newAsset} wallet created!`);
      setShowAdd(false);
      const updated = await walletService.getWallets(user?.id || "");
      setWallets(updated);
    } catch (e) {
      error(e instanceof Error ? e.message : "Failed to create wallet");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    try {
      await walletService.removeWallet(removeTarget.id);
      success("Wallet removed.");
      setRemoveTarget(null);
      const updated = await walletService.getWallets(user?.id || "");
      setWallets(updated);
    } catch (e) {
      error(e instanceof Error ? e.message : "Failed to remove wallet");
    }
  };

  const handleSetDefault = async (id: string) => {
    await walletService.setDefaultWallet(user?.id || "", id);
    success("Default wallet updated.");
    const updated = await walletService.getWallets(user?.id || "");
    setWallets(updated);
  };

  const totalValue = wallets.reduce(
    (s, w) => s + w.balance * getPrice(w.symbol),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vaulta-text">Wallets</h1>
          <p className="mt-1 text-sm text-vaulta-muted">
            Manage your crypto wallets and deposit addresses
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Wallet
        </Button>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-vaulta-muted">Total Wallet Value</p>
            <h2 className="mt-1 text-3xl font-bold text-vaulta-text">
              {formatCurrency(totalValue)}
            </h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vaulta-cerulean/10 text-vaulta-cerulean">
            <WalletIcon size={24} />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 skeleton rounded-nesviora" />
          ))}
        </div>
      ) : wallets.length === 0 ? (
        <EmptyState
          icon={WalletIcon}
          title="No wallets yet"
          message="Add a wallet to start receiving crypto deposits."
          action={
            <Button onClick={() => setShowAdd(true)}>
              <Plus size={16} /> Add Wallet
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {wallets.map((w) => {
            const asset = availableAssets.find((a) => a.symbol === w.symbol);
            const price = getPrice(w.symbol);
            const value = w.balance * price;
            const isHidden = hidden.has(w.id);
            return (
              <Card key={w.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vaulta-cerulean/10 text-lg font-bold text-vaulta-cerulean">
                      {assets.find((a) => a.symbol === w.symbol)?.logo ||
                        w.symbol[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-vaulta-text">
                          {w.symbol}
                        </h3>
                        {w.isDefault && (
                          <Badge className="bg-vaulta-cerulean/10 text-vaulta-cerulean">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-vaulta-muted">{asset?.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleHidden(w.id)}
                      className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"
                      aria-label="Toggle address visibility"
                    >
                      {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => handleCopy(w.address, w.id)}
                      className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"
                      aria-label="Copy address"
                    >
                      {copied === w.id ? (
                        <Check
                          size={16}
                          className="text-vaulta-spring-dark dark:text-vaulta-spring"
                        />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                    {!w.isDefault && (
                      <button
                        onClick={() => handleSetDefault(w.id)}
                        className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-warning/10 hover:text-vaulta-warning transition-colors"
                        aria-label="Set as default"
                      >
                        <Star size={16} />
                      </button>
                    )}
                    {!w.isDefault && (
                      <button
                        onClick={() => setRemoveTarget(w)}
                        className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-danger/10 hover:text-vaulta-danger transition-colors"
                        aria-label="Remove wallet"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-vaulta-muted">Balance</p>
                    <p className="text-lg font-bold text-vaulta-text">
                      {isHidden ? "••••••" : w.balance.toFixed(4)} {w.symbol}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-vaulta-muted">USD Value</p>
                    <p className="text-lg font-bold text-vaulta-text">
                      {isHidden ? "••••••" : formatCurrency(value)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-vaulta-border bg-vaulta-bg dark:bg-vaulta-dark-bg p-2.5">
                  <p className="text-xs text-vaulta-muted mb-1">
                    Deposit Address ({w.network})
                  </p>
                  <code className="text-xs text-vaulta-text break-all">
                    {isHidden
                      ? "••••••••••••••••••••••••"
                      : truncateAddress(w.address, 12)}
                  </code>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex items-start gap-2 rounded-lg border border-vaulta-warning/20 bg-vaulta-warning/5 p-4">
        <AlertCircle
          size={18}
          className="mt-0.5 shrink-0 text-vaulta-warning"
        />
        <p className="text-xs text-vaulta-muted">
          Wallet addresses are sensitive. Always verify addresses before sending
          funds. Never share your private keys. Nesviora Capital Market Limited
          does not store or have access to your private keys.
        </p>
      </div>

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add New Wallet"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-vaulta-text mb-1.5">
              Select Asset
            </label>
            <select
              value={newAsset}
              onChange={(e) => setNewAsset(e.target.value)}
              className="input-field"
            >
              {availableAssets.map((a) => (
                <option key={a.symbol} value={a.symbol}>
                  {a.symbol} - {a.name}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-vaulta-muted">
            A new deposit address will be generated for the selected asset.
          </p>
          <Button onClick={handleAdd} loading={adding} className="w-full">
            <Plus size={16} /> Create Wallet
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        title="Remove Wallet?"
        message={`Are you sure you want to remove your ${removeTarget?.symbol} wallet? Make sure you have withdrawn all funds first.`}
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}
