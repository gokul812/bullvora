"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Card,
  Badge,
  ScoreBadge,
  RecommendationBadge,
  SectionHeader,
  Skeleton,
  ProgressBar,
  LiveIndicator,
} from "@/components/ui";
import { AIRecommendation } from "@/lib/types";
import {
  formatCurrency,
  formatPercent,
  getChangeColor,
  getChangeBg,
} from "@/lib/utils";
import { Zap, TrendingUp, BookmarkPlus, BookmarkCheck, RefreshCw, Info } from "lucide-react";
import Link from "next/link";
import { useWatchlist } from "@/lib/store";
import toast from "react-hot-toast";

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [disclaimer, setDisclaimer] = useState("");
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const { add, remove, has } = useWatchlist();

  const fetchRecs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommendations");
      const data = await res.json();
      setRecs(data.recommendations || []);
      setDisclaimer(data.disclaimer || "");
      setLastUpdated(data.timestamp || Date.now());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const toggleWatchlist = (rec: AIRecommendation, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (has(rec.symbol)) {
      remove(rec.symbol);
      toast.success(`Removed ${rec.symbol} from watchlist`);
    } else {
      add({
        symbol: rec.symbol,
        name: rec.name,
        exchange: rec.exchange,
        addedAt: Date.now(),
      });
      toast.success(`Added ${rec.symbol} to watchlist`);
    }
  };

  const upside = (rec: AIRecommendation) =>
    ((rec.targetPrice - rec.price) / rec.price) * 100;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              AI Recommendations
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Top picks scored above 55 — refreshed in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <LiveIndicator />
            <button
              onClick={fetchRecs}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="mb-5 p-3 rounded-xl flex items-start gap-3"
          style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-300/80">
            These AI picks are based on a weighted score of technical signals, fundamental quality, market sentiment, and volume breakout patterns. Stocks must score above 55 to appear here.
          </p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-5">
                <Skeleton className="h-6 w-48 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            ))}
          </div>
        ) : recs.length === 0 ? (
          <Card className="text-center py-16">
            <Zap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No recommendations available</p>
            <p className="text-slate-600 text-sm mt-1">Market data is still loading. Try refreshing in a moment.</p>
            <button onClick={fetchRecs} className="mt-4 px-4 py-2 rounded-lg text-sm text-blue-400 hover:text-blue-300 transition-colors"
              style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
              Refresh
            </button>
          </Card>
        ) : (
          <div className="space-y-4">
            {recs.map((rec, idx) => (
              <Link key={rec.symbol} href={`/stock/${rec.symbol}`}>
                <Card className="hover:border-blue-500/30 transition-all cursor-pointer group p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Rank + Logo */}
                    <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-1 flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white" }}>
                        {rec.symbol.slice(0, 2)}
                      </div>
                      <div className="text-xs text-slate-600 font-mono">#{idx + 1}</div>
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-slate-100">{rec.symbol}</span>
                        <RecommendationBadge rec={rec.recommendation} />
                        <Badge variant="blue">{rec.exchange}</Badge>
                        <Badge variant="default">{rec.sector}</Badge>
                        <Badge variant="default">{rec.priceCategory}</Badge>
                      </div>
                      <p className="text-sm text-slate-400 truncate">{rec.name}</p>

                      {/* Reasons */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {rec.reasons.slice(0, 4).map((r, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full text-emerald-400"
                            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                      {rec.risks.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {rec.risks.slice(0, 2).map((r, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full text-red-400"
                              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                              ⚠ {r}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Score bars */}
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-slate-500">Confidence</span>
                            <span className="text-slate-300">{rec.confidence}%</span>
                          </div>
                          <ProgressBar value={rec.confidence} color="blue" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-slate-500">AI Score</span>
                            <span className="text-slate-300">{rec.score}/100</span>
                          </div>
                          <ProgressBar value={rec.score} color={rec.score >= 70 ? "green" : "yellow"} />
                        </div>
                      </div>
                    </div>

                    {/* Price + actions */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-xl font-bold font-mono text-slate-100">{formatCurrency(rec.price)}</div>
                        <div className={`text-sm font-semibold ${getChangeColor(rec.changePercent)}`}>
                          {formatPercent(rec.changePercent)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Target</div>
                        <div className="text-sm font-mono font-semibold text-emerald-400">{formatCurrency(rec.targetPrice)}</div>
                        <div className="text-xs text-emerald-500">
                          +{upside(rec).toFixed(1)}% upside
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ScoreBadge score={rec.score} />
                        <button
                          onClick={(e) => toggleWatchlist(rec, e)}
                          className="text-slate-500 hover:text-blue-400 transition-colors"
                        >
                          {has(rec.symbol) ? (
                            <BookmarkCheck className="w-5 h-5 text-blue-400" />
                          ) : (
                            <BookmarkPlus className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {lastUpdated > 0 && (
          <p className="text-center text-xs text-slate-600 mt-4">
            Last updated: {new Date(lastUpdated).toLocaleTimeString("en-IN")}
          </p>
        )}

        {disclaimer && (
          <div className="mt-4 p-3 rounded-xl text-xs text-yellow-500/60"
            style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.1)" }}>
            ⚠️ {disclaimer}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
