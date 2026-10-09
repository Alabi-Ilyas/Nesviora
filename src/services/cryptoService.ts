import type { Asset } from '@/types';
import { demoAssets } from '@/data/mockData';
import { generateSparkline } from '@/utils';

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// In production, these would call CoinGecko/CoinMarketCap API.
// For demo, we return mock data with simulated price movements.
export const cryptoService = {
  async getMarkets(): Promise<Asset[]> {
    await delay(300);
    // Simulate slight price changes
    return demoAssets.map((asset) => ({
      ...asset,
      price: asset.price * (1 + (Math.random() - 0.5) * 0.002),
      sparkline: generateSparkline(7, asset.price, asset.price * 0.02),
    }));
  },

  async getAsset(assetId: string): Promise<Asset | null> {
    await delay(200);
    return demoAssets.find((a) => a.id === assetId) || null;
  },

  async getHistoricalPrices(assetId: string, days: number): Promise<{ time: string; price: number }[]> {
    await delay(300);
    const asset = demoAssets.find((a) => a.id === assetId);
    if (!asset) return [];
    const basePrice = asset.price;
    const data: { time: string; price: number }[] = [];
    const points = days <= 1 ? 24 : days <= 7 ? 28 : days <= 30 ? 30 : 60;
    for (let i = 0; i < points; i++) {
      const volatility = basePrice * 0.03;
      const trend = i / points;
      const price = basePrice * (0.92 + trend * 0.1) + (Math.random() - 0.5) * volatility;
      data.push({
        time: new Date(Date.now() - (points - i) * (days * 86400000 / points)).toISOString(),
        price: Math.max(0, price),
      });
    }
    return data;
  },

  async getTrendingAssets(): Promise<Asset[]> {
    await delay(200);
    return [...demoAssets].sort((a, b) => b.change24h - a.change24h).slice(0, 4);
  },

  async getPortfolioChart(days: number): Promise<{ time: string; value: number }[]> {
    await delay(300);
    const data: { time: string; value: number }[] = [];
    const baseValue = 24850;
    const points = days <= 1 ? 24 : days <= 7 ? 28 : days <= 30 ? 30 : 60;
    for (let i = 0; i < points; i++) {
      const volatility = baseValue * 0.02;
      const trend = i / points;
      const value = baseValue * (0.85 + trend * 0.15) + (Math.random() - 0.5) * volatility;
      data.push({
        time: new Date(Date.now() - (points - i) * (days * 86400000 / points)).toISOString(),
        value: Math.max(0, value),
      });
    }
    return data;
  },
};
