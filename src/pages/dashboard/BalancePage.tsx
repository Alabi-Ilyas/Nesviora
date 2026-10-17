import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { walletService, transactionService } from "@/services";
import type { Transaction } from "@/types";
import { formatCurrency, formatDate, capitalize, getStatusColor } from "@/utils";

// One USD balance per user. Deposits add to it (after admin approval); withdrawals and investments spend it.
export function BalancePage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [recent, setRecent] = useState<Transaction[]>([]);

  useEffect(() => {
    walletService.getWallets(user?.id || "").then((w) => setBalance(w[0]?.balance ?? 0));
    transactionService.getTransactions(user?.id || "").then((t) => setRecent(t.slice(0, 8)));
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vaulta-text">Wallet</h1>
        <p className="mt-1 text-sm text-vaulta-muted">Your available balance and latest activity.</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-vaulta-cerulean/10 text-vaulta-cerulean">
              <WalletIcon size={21} />
            </div>
            <div>
              <p className="text-sm text-vaulta-muted">Available balance</p>
              <p className="text-3xl font-bold text-vaulta-text">{balance === null ? "…" : formatCurrency(balance)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/dashboard/deposit"><Button><ArrowDownToLine size={16} /> Deposit</Button></Link>
            <Link to="/dashboard/withdraw"><Button variant="secondary"><ArrowUpFromLine size={16} /> Withdraw</Button></Link>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold text-vaulta-text">Recent activity</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-vaulta-muted">No activity yet.</p>
        ) : (
          <div className="divide-y divide-vaulta-border">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate text-vaulta-text">{t.description || capitalize(t.type)}</p>
                  <p className="text-xs text-vaulta-muted">{formatDate(t.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-vaulta-text">{formatCurrency(t.amount)}</span>
                  <Badge className={getStatusColor(t.status)}>{capitalize(t.status)}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
