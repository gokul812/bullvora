"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, Skeleton, LiveIndicator } from "@/components/ui";
import { formatNumber, formatPercent } from "@/lib/utils";

interface IndexData {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  description: string;
}

export default function MarketOverview() {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIndices();
    const interval = setInterval(fetchIndices, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchIndices() {
    try {
      const res = await fetch("/api/market");
      const data = await res.json();
      if (data.indices) setIndices(data.indices);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Market Indices</h2>
        <LiveIndicator />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {indices.map((idx) => {
          const isUp = (idx.changePercent ?? 0) > 0;
          const isDown = (idx.changePercent ?? 0) < 0;
          return (
            <Card
              key={idx.symbol}
              className={`relative overflow-hidden transition-all hover:scale-[1.02] cursor-pointer ${
                isUp ? "glow-green" : isDown ? "glow-red" : ""
              }`}
            >
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background: isUp
                    ? "linear-gradient(135deg, #10b981, transparent)"
                    : isDown
                    ? "linear-gradient(135deg, #ef4444, transparent)"
                    : "transparent",
                }}
              />
              <div className="relative">
                <div className="text-xs text-slate-500 mb-1 truncate">{idx.name}</div>
                <div className="text-lg font-bold text-slate-100 font-mono">
                  {idx.value > 0 ? formatNumber(idx.value, 0) : "—"}
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${
                  isUp ? "text-emerald-400" : isDown ? "text-red-400" : "text-slate-400"
                }`}>
                  {isUp ? <TrendingUp className="w-3 h-3" /> : isDown ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  {idx.changePercent != null && idx.changePercent !== 0 ? formatPercent(idx.changePercent) : "—"}
                  <span className="text-slate-500 font-normal">
                    ({idx.change > 0 ? "+" : ""}{idx.change != null && idx.change !== 0 ? formatNumber(idx.change, 1) : "—"})
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
