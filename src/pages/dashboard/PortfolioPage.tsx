import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/StatCard';
import { PieChartComponent } from '@/components/charts/Charts';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Skeleton, EmptyState } from '@/components/ui/States';
import { walletService } from '@/services';
import { cryptoService } from '@/services/cryptoService';
import type { Wallet as WalletType, Asset } from '@/types';
import { formatCurrency } from '@/utils';

export function PortfolioPage() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      walletService.getWallets(user?.id || ''),
      cryptoService.getMarkets(),
    ]).then(([w, a]) => {
      setWallets(w);
      setAssets(a);
      setLoading(false);
    });
  }, [user]);

  const getAsset = (symbol: string) => assets.find((a) => a.symbol === symbol);
  const holdings = wallets.map((w) => {
    const asset = getAsset(w.symbol);
    const price = asset?.price || 1;
    const value = w.balance * price;
    const change24h = asset?.change24h || 0;
    return { ...w, price, value, change24h, usdValue: value };
  }).filter((h) => h.balance > 0);

  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  const totalChange = holdings.reduce((s, h) => s + (h.change24h >= 0 ? 1 : -1) * h.value * Math.abs(h.change24h) / 100, 0);

  const allocation = holdings.map((h) => ({ name: h.symbol, value: h.value }));

  const columns: Column<typeof holdings[0]>[] = [
    { key: 'symbol', header: 'Asset', sortable: true, sortValue: (r) => r.symbol, render: (r) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vaulta-cerulean/10 text-sm font-bold text-vaulta-cerulean">
          {getAsset(r.symbol)?.logo || r.symbol[0]}
        </div>
        <div><p className="font-semibold text-vaulta-text">{r.symbol}</p><p className="text-xs text-vaulta-muted">{getAsset(r.symbol)?.name}</p></div>
      </div>
    )},
    { key: 'balance', header: 'Quantity', sortable: true, sortValue: (r) => r.balance, render: (r) => <span className="text-vaulta-text">{r.balance.toFixed(4)}</span> },
    { key: 'price', header: 'Price', sortable: true, sortValue: (r) => r.price, render: (r) => <span className="text-vaulta-text">{formatCurrency(r.price, 'USD', r.price < 1 ? 4 : 2)}</span> },
    { key: 'value', header: 'Value', sortable: true, sortValue: (r) => r.value, render: (r) => <span className="font-semibold text-vaulta-text">{formatCurrency(r.value)}</span> },
    { key: 'change24h', header: '24h', sortable: true, sortValue: (r) => r.change24h, render: (r) => (
      <span className={`font-medium ${r.change24h >= 0 ? 'text-vaulta-spring-dark dark:text-vaulta-spring' : 'text-vaulta-danger'}`}>
        {r.change24h >= 0 ? '+' : ''}{r.change24h.toFixed(2)}%
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vaulta-text">Portfolio</h1>
        <p className="mt-1 text-sm text-vaulta-muted">Your digital asset holdings and allocation</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-nesviora" />)
        ) : (
          <>
            <Card><div className="flex items-center justify-between"><div><p className="text-sm text-vaulta-muted">Total Portfolio Value</p><h3 className="mt-1 text-2xl font-bold text-vaulta-text">{formatCurrency(totalValue)}</h3></div><Wallet size={21} className="text-vaulta-cerulean" /></div></Card>
            <Card><div className="flex items-center justify-between"><div><p className="text-sm text-vaulta-muted">24h Change</p><h3 className={`mt-1 text-2xl font-bold ${totalChange >= 0 ? 'text-vaulta-spring-dark dark:text-vaulta-spring' : 'text-vaulta-danger'}`}>{totalChange >= 0 ? '+' : ''}{formatCurrency(totalChange)}</h3></div>{totalChange >= 0 ? <TrendingUp size={21} className="text-vaulta-spring-dark dark:text-vaulta-spring" /> : <TrendingDown size={21} className="text-vaulta-danger" />}</div></Card>
            <Card><div className="flex items-center justify-between"><div><p className="text-sm text-vaulta-muted">Assets</p><h3 className="mt-1 text-2xl font-bold text-vaulta-text">{holdings.length}</h3></div><Wallet size={21} className="text-vaulta-cerulean" /></div></Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold text-vaulta-text mb-4">Holdings</h2>
          {loading ? <Skeleton className="h-48 w-full" /> : holdings.length === 0 ? (
            <EmptyState title="No holdings yet" message="Deposit funds to start building your portfolio." />
          ) : (
            <DataTable columns={columns} data={holdings} pageSize={10} exportable exportFilename="portfolio" />
          )}
        </Card>
        <Card>
          <h2 className="font-semibold text-vaulta-text mb-4">Asset Allocation</h2>
          {loading ? <Skeleton className="h-48 w-full" /> : (
            <>
              <PieChartComponent data={allocation} height={200} valuePrefix="$" />
              <div className="mt-4 space-y-2">
                {allocation.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: ['#006989', '#0CF574', '#FF7D00', '#FFB020', '#EF4444'][i % 5] }} />
                      <span className="text-vaulta-text">{item.name}</span>
                    </div>
                    <span className="font-medium text-vaulta-text">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
