import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, TrendingDown, ShieldCheck } from "lucide-react";
import { cryptoService } from "@/services/cryptoService";
import { MiniSparkline } from "@/components/charts/Charts";
import { Skeleton } from "@/components/ui/States";
import type { Asset } from "@/types";
import { formatCurrency, formatCompact } from "@/utils";

export function MarketsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<
    "marketCap" | "price" | "change24h" | "volume24h"
  >("marketCap");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    cryptoService.getMarkets().then((data) => {
      setAssets(data);
      setLoading(false);
    });
  }, []);

  const filtered = assets
    .filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.symbol.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      return (a[sortKey] - b[sortKey]) * dir;
    });

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-vaulta-text">Crypto Markets</h1>
        <p className="mt-2 text-vaulta-muted">
          Live cryptocurrency prices and market data
        </p>
      </motion.div>

      <div className="mt-8 rounded-nesviora border border-vaulta-border bg-vaulta-surface shadow-vaulta-sm">
        <div className="border-b border-vaulta-border p-4">
          <div className="relative max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-vaulta-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="w-full rounded-lg border border-vaulta-border bg-vaulta-bg dark:bg-vaulta-dark-bg py-2 pl-9 pr-3 text-sm text-vaulta-text placeholder:text-vaulta-muted focus:border-vaulta-cerulean focus:outline-none focus:ring-2 focus:ring-vaulta-cerulean/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-vaulta-border">
                <th className="px-4 py-3 text-left font-semibold text-vaulta-muted">
                  #
                </th>
                <th className="px-4 py-3 text-left font-semibold text-vaulta-muted">
                  Asset
                </th>
                <th
                  className="px-4 py-3 text-right font-semibold text-vaulta-muted cursor-pointer hover:text-vaulta-text"
                  onClick={() => handleSort("price")}
                >
                  Price
                </th>
                <th
                  className="px-4 py-3 text-right font-semibold text-vaulta-muted cursor-pointer hover:text-vaulta-text"
                  onClick={() => handleSort("change24h")}
                >
                  24h Change
                </th>
                <th
                  className="px-4 py-3 text-right font-semibold text-vaulta-muted cursor-pointer hover:text-vaulta-text"
                  onClick={() => handleSort("marketCap")}
                >
                  Market Cap
                </th>
                <th
                  className="px-4 py-3 text-right font-semibold text-vaulta-muted cursor-pointer hover:text-vaulta-text"
                  onClick={() => handleSort("volume24h")}
                >
                  Volume (24h)
                </th>
                <th className="px-4 py-3 text-center font-semibold text-vaulta-muted">
                  7d Chart
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-vaulta-border last:border-0"
                    >
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <Skeleton className="h-6 w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.map((asset, i) => (
                    <tr
                      key={asset.id}
                      className="border-b border-vaulta-border last:border-0 hover:bg-vaulta-bg/50 dark:hover:bg-vaulta-dark-surface/30 transition-colors"
                    >
                      <td className="px-4 py-4 text-vaulta-muted">{i + 1}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vaulta-cerulean/10 text-sm font-bold text-vaulta-cerulean">
                            {asset.logo}
                          </div>
                          <div>
                            <p className="font-semibold text-vaulta-text">
                              {asset.name}
                            </p>
                            <p className="text-xs text-vaulta-muted">
                              {asset.symbol}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-vaulta-text">
                        {formatCurrency(
                          asset.price,
                          "USD",
                          asset.price < 1 ? 4 : 2,
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${asset.change24h >= 0 ? "text-vaulta-spring-dark dark:text-vaulta-spring" : "text-vaulta-danger"}`}
                        >
                          {asset.change24h >= 0 ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
                          )}
                          {asset.change24h >= 0 ? "+" : ""}
                          {asset.change24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-vaulta-text">
                        {formatCompact(asset.marketCap)}
                      </td>
                      <td className="px-4 py-4 text-right text-vaulta-text">
                        {formatCompact(asset.volume24h)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <MiniSparkline
                            data={asset.sparkline}
                            color={asset.change24h >= 0 ? "#0CF574" : "#EF4444"}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-lg border border-vaulta-border bg-vaulta-surface p-4">
        <ShieldCheck
          size={18}
          className="mt-0.5 shrink-0 text-vaulta-cerulean"
        />
        <p className="text-xs text-vaulta-muted">
          Market data is provided for informational purposes only and may be
          delayed. Prices are simulated in demo mode. Digital asset investments
          involve risk, including possible loss of principal.
        </p>
      </div>
    </div>
  );
}
