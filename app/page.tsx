"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import MarketOverview from "@/components/dashboard/MarketOverview";
import {
  Card,
  Badge,
  ScoreBadge,
  RecommendationBadge,
  SectionHeader,
  Skeleton,
  LiveIndicator,
} from "@/components/ui";
import { AIRecommendation, AnalyzedStock } from "@/lib/types";
import {
  formatCurrency,
  formatPercent,
  formatMarketCap,
  getChangeColor,
  getChangeBg,
} from "@/lib/utils";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Flame,
  Shield,
  ArrowRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

function MarketPulse({ stocks }: { stocks: AnalyzedStock[] }) {
  if (stocks.length === 0) return null;

  const gainers = stocks.filter((s) => s.quote.changePercent > 0).length;
  const losers = stocks.filter((s) => s.quote.changePercent < 0).length;
  const unchanged = stocks.length - gainers - losers;
  const adRatio = losers > 0 ? gainers / losers : gainers;

  const avgScore = stocks.reduce((sum, s) => sum + s.score.totalScore, 0) / stocks.length;
  const avgChange = stocks.reduce((sum, s) => sum + s.quote.changePercent, 0) / stocks.length;
  const bullish = stocks.filter((s) => ["STRONG_BUY", "BUY"].includes(s.score.recommendation)).length;
  const bullishPct = (bullish / stocks.length) * 100;

  // Composite fear-greed: 0 (extreme fear) → 100 (extreme greed)
  let sentiment = 50;
  if (adRatio > 2) sentiment += 15;
  else if (adRatio > 1.5) sentiment += 8;
  else if (adRatio < 0.5) sentiment -= 15;
  else if (adRatio < 0.8) sentiment -= 8;
  if (avgScore > 65) sentiment += 12;
  else if (avgScore < 45) sentiment -= 12;
  if (avgChange > 0.5) sentiment += 8;
  else if (avgChange < -0.5) sentiment -= 8;
  if (bullishPct > 60) sentiment += 8;
  else if (bullishPct < 30) sentiment -= 8;
  sentiment = Math.max(0, Math.min(100, sentiment));

  const zone =
    sentiment >= 75 ? { label: "Extreme Greed", color: "text-red-400", hex: "#f87171" } :
    sentiment >= 55 ? { label: "Greed", color: "text-orange-400", hex: "#fb923c" } :
    sentiment >= 45 ? { label: "Neutral", color: "text-yellow-400", hex: "#facc15" } :
    sentiment >= 25 ? { label: "Fear", color: "text-blue-400", hex: "#60a5fa" } :
    { label: "Extreme Fear", color: "text-purple-400", hex: "#c084fc" };

  return (
    <Card className="mb-5 p-0 overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-2"
        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))", borderBottom: "1px solid var(--border)" }}>
        <Activity className="w-4 h-4 text-blue-400" />
        <span className="font-semibold text-slate-100 text-sm">Market Pulse</span>
        <span className="text-xs text-slate-500 ml-auto">Fear &amp; Greed Proxy · {stocks.length} stocks</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          {/* Gauge */}
          <div className="lg:col-span-2 text-center">
            <div className="text-4xl font-black font-mono mb-1" style={{ color: zone.hex }}>
              {sentiment.toFixed(0)}
            </div>
            <div className={`text-sm font-bold ${zone.color}`}>{zone.label}</div>
            <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${sentiment}%`,
                  background: `linear-gradient(90deg, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ef4444)`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>Fear</span><span>Greed</span>
            </div>
          </div>

          {/* Stats */}
          {[
            { label: "Gainers", value: gainers, color: "text-emerald-400", sub: `${((gainers/stocks.length)*100).toFixed(0)}%` },
            { label: "Losers", value: losers, color: "text-red-400", sub: `${((losers/stocks.length)*100).toFixed(0)}%` },
            { label: "A/D Ratio", value: adRatio.toFixed(2), color: adRatio >= 1 ? "text-emerald-400" : "text-red-400", sub: adRatio >= 1.5 ? "Bullish" : adRatio < 0.7 ? "Bearish" : "Neutral" },
            { label: "Avg AI Score", value: avgScore.toFixed(0), color: avgScore >= 60 ? "text-emerald-400" : avgScore >= 50 ? "text-yellow-400" : "text-red-400", sub: avgScore >= 60 ? "Strong" : avgScore >= 50 ? "Moderate" : "Weak" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className={`text-xl font-bold font-mono ${item.color}`}>{item.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{item.label}</div>
              <div className={`text-xs ${item.color} mt-0.5`}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [topStocks, setTopStocks] = useState<AnalyzedStock[]>([]);
  const [loadingRec, setLoadingRec] = useState(true);
  const [loadingStocks, setLoadingStocks] = useState(true);

  useEffect(() => {
    fetchRecommendations();
    fetchTopStocks();
  }, []);

  async function fetchRecommendations() {
    try {
      const res = await fetch("/api/recommendations");
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch {
      // silent
    } finally {
      setLoadingRec(false);
    }
  }

  async function fetchTopStocks() {
    try {
      const res = await fetch("/api/scanner?limit=10&nifty50=true");
      const data = await res.json();
      setTopStocks(data.stocks || []);
    } catch {
      // silent
    } finally {
      setLoadingStocks(false);
    }
  }

  const gainers = [...topStocks]
    .filter((s) => s.quote.changePercent > 0)
    .sort((a, b) => b.quote.changePercent - a.quote.changePercent)
    .slice(0, 5);

  const losers = [...topStocks]
    .filter((s) => s.quote.changePercent < 0)
    .sort((a, b) => a.quote.changePercent - b.quote.changePercent)
    .slice(0, 5);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Market Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Indian equity market at a glance</p>
          </div>
          <LiveIndicator />
        </div>

        {/* Market Indices */}
        <MarketOverview />

        {/* Market Pulse — only shown once stocks are loaded */}
        {!loadingStocks && topStocks.length > 0 && <MarketPulse stocks={topStocks} />}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-1">
          {/* AI Recommendations */}
          <div className="xl:col-span-2">
            <SectionHeader
              title="AI Top Picks"
              subtitle="Stocks scoring above 55 — for research only"
              icon={<Zap className="w-4 h-4" />}
              action={
                <Link
                  href="/recommendations"
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              }
            />
            {loadingRec ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-3">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </Card>
                ))}
              </div>
            ) : recommendations.length === 0 ? (
              <Card className="text-center py-8 text-slate-500 text-sm">
                No recommendations available right now. Market data is loading.
              </Card>
            ) : (
              <div className="space-y-2">
                {recommendations.map((rec) => (
                  <Link key={rec.symbol} href={`/stock/${rec.symbol}`}>
                    <Card className="hover:border-blue-500/30 transition-all cursor-pointer group p-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: "var(--bg-secondary)", color: "var(--accent-blue)" }}
                        >
                          {rec.symbol.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-slate-100 text-sm">{rec.symbol}</span>
                            <RecommendationBadge rec={rec.recommendation} />
                            <Badge variant="blue" className="text-xs">{rec.sector}</Badge>
                          </div>
                          <p className="text-xs text-slate-500 truncate">{rec.name}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-mono font-bold text-slate-100 text-sm">
                            {formatCurrency(rec.price)}
                          </div>
                          <div className={`text-xs font-semibold ${getChangeColor(rec.changePercent)}`}>
                            {formatPercent(rec.changePercent)}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Target: {formatCurrency(rec.targetPrice)}
                          </div>
                        </div>
                        <ScoreBadge score={rec.score} />
                      </div>
                      {rec.reasons.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap gap-1">
                          {rec.reasons.slice(0, 3).map((r, i) => (
                            <span key={i} className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <SectionHeader title="Quick Actions" icon={<BarChart3 className="w-4 h-4" />} />
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { href: "/scanner?filter=breakout", label: "Breakouts", icon: Flame, color: "text-orange-400", bg: "rgba(251,146,60,0.1)" },
                { href: "/scanner?filter=undervalued", label: "Undervalued", icon: Shield, color: "text-purple-400", bg: "rgba(139,92,246,0.1)" },
                { href: "/scanner?filter=topgainers", label: "Top Gainers", icon: TrendingUp, color: "text-emerald-400", bg: "rgba(16,185,129,0.1)" },
                { href: "/scanner?filter=toplosers", label: "Top Losers", icon: TrendingDown, color: "text-red-400", bg: "rgba(239,68,68,0.1)" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Card className="text-center py-4 hover:border-slate-600 transition-all cursor-pointer group">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                        style={{ background: item.bg }}
                      >
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <p className="text-xs font-medium text-slate-300">{item.label}</p>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Scanner CTA */}
            <Link href="/scanner">
              <Card
                className="p-4 cursor-pointer hover:border-blue-500/30 transition-all"
                style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-100">Full Stock Scanner</div>
                    <div className="text-xs text-slate-500">Filter by sector, price, score</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 ml-auto" />
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Gainers / Losers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <div>
            <SectionHeader
              title="Top Gainers"
              icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
            />
            {loadingStocks ? (
              <div className="space-y-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : gainers.length === 0 ? (
              <Card className="text-center py-6 text-slate-500 text-sm">Loading market data...</Card>
            ) : (
              <div className="space-y-1.5">
                {gainers.map((s) => (
                  <Link key={s.quote.symbol} href={`/stock/${s.quote.symbol}`}>
                    <div className="stock-row flex items-center px-3 py-2.5 rounded-xl cursor-pointer"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-100">{s.quote.symbol}</span>
                          <span className="text-xs text-slate-500">{s.quote.exchange}</span>
                        </div>
                        <div className="text-xs text-slate-500 truncate">{s.quote.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-slate-200">{formatCurrency(s.quote.price)}</div>
                        <div className={`text-xs font-bold px-1.5 py-0.5 rounded ${getChangeBg(s.quote.changePercent)}`}>
                          +{s.quote.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <SectionHeader
              title="Top Losers"
              icon={<TrendingDown className="w-4 h-4 text-red-400" />}
            />
            {loadingStocks ? (
              <div className="space-y-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : losers.length === 0 ? (
              <Card className="text-center py-6 text-slate-500 text-sm">Loading market data...</Card>
            ) : (
              <div className="space-y-1.5">
                {losers.map((s) => (
                  <Link key={s.quote.symbol} href={`/stock/${s.quote.symbol}`}>
                    <div className="stock-row flex items-center px-3 py-2.5 rounded-xl cursor-pointer"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-100">{s.quote.symbol}</span>
                          <span className="text-xs text-slate-500">{s.quote.exchange}</span>
                        </div>
                        <div className="text-xs text-slate-500 truncate">{s.quote.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-slate-200">{formatCurrency(s.quote.price)}</div>
                        <div className={`text-xs font-bold px-1.5 py-0.5 rounded ${getChangeBg(s.quote.changePercent)}`}>
                          {s.quote.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Stocks Table */}
        <div className="mt-5">
          <SectionHeader
            title="Nifty 50 Snapshot"
            subtitle="AI-scored overview of top Indian stocks"
            icon={<BarChart3 className="w-4 h-4" />}
            action={
              <Link href="/scanner" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Full scanner <ArrowRight className="w-3 h-3" />
              </Link>
            }
          />
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Change</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Mkt Cap</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Score</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingStocks
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i} className="border-b" style={{ borderColor: "var(--border)" }}>
                          {Array.from({ length: 6 }).map((_, j) => (
                            <td key={j} className="px-4 py-3">
                              <Skeleton className="h-4 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : topStocks.slice(0, 8).map((s) => (
                        <tr
                          key={s.quote.symbol}
                          className="stock-row border-b cursor-pointer"
                          style={{ borderColor: "var(--border)" }}
                          onClick={() => (window.location.href = `/stock/${s.quote.symbol}`)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ background: "var(--bg-secondary)", color: "var(--accent-blue)" }}>
                                {s.quote.symbol.slice(0, 2)}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-100">{s.quote.symbol}</div>
                                <div className="text-xs text-slate-500 truncate max-w-[120px]">{s.quote.sector}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-slate-200">
                            {formatCurrency(s.quote.price)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getChangeBg(s.quote.changePercent)}`}>
                              {formatPercent(s.quote.changePercent)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-400 hidden md:table-cell">
                            {formatMarketCap(s.quote.marketCap)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <ScoreBadge score={s.score.totalScore} />
                          </td>
                          <td className="px-4 py-3 text-right hidden lg:table-cell">
                            <RecommendationBadge rec={s.score.recommendation} />
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mt-5 p-3 rounded-xl text-xs text-yellow-500/60 text-center"
          style={{ background: "rgba(245, 158, 11, 0.04)", border: "1px solid rgba(245,158,11,0.1)" }}>
          ⚠️ Bullvora is for educational and research purposes only. AI-generated scores do not constitute financial advice. Always do your own research before investing.
        </div>
      </div>
    </AppLayout>
  );
}
