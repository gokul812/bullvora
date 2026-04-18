"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AppLayout from "@/components/layout/AppLayout";
import {
  Card, Badge, ScoreBadge, RecommendationBadge,
  ProgressBar, SectionHeader, Skeleton, ErrorMessage,
} from "@/components/ui";
import TradeSetupCard from "@/components/stock/TradeSetup";
import PositionSizer from "@/components/stock/PositionSizer";
import { AnalyzedStock, OHLCVData, PatternDetection } from "@/lib/types";
import {
  formatCurrency, formatPercent, formatMarketCap,
  formatVolume, getChangeColor,
} from "@/lib/utils";
import {
  ArrowLeft, BookmarkPlus, BookmarkCheck, TrendingUp,
  TrendingDown, BarChart3, Activity, Info, Flame, Shield,
  Calculator, Target, AlertCircle,
} from "lucide-react";
import { useWatchlist } from "@/lib/store";
import toast from "react-hot-toast";

// Lazy-load chart to avoid SSR issues with lightweight-charts
const CandlestickChart = dynamic(() => import("@/components/charts/CandlestickChart"), { ssr: false });

interface StockDetailData extends AnalyzedStock {
  ohlcv: OHLCVData[];
  patterns: PatternDetection;
}

type TabKey = "chart" | "technical" | "fundamental" | "score" | "setup";

export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = decodeURIComponent(params.symbol as string);

  const [data, setData] = useState<StockDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("chart");

  const { add, remove, has } = useWatchlist();
  const isWatched = has(symbol);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    fetch(`/api/stock/${encodeURIComponent(symbol)}`)
      .then((r) => r.json())
      .then((d) => { if (d.error) setError(d.error); else setData(d); })
      .catch(() => setError("Failed to load stock data"))
      .finally(() => setLoading(false));
  }, [symbol]);

  const toggleWatchlist = () => {
    if (!data) return;
    if (isWatched) { remove(symbol); toast.success(`Removed ${symbol} from watchlist`); }
    else {
      add({ symbol, name: data.quote.name, exchange: data.quote.exchange, addedAt: Date.now() });
      toast.success(`Added ${symbol} to watchlist`);
    }
  };

  if (loading) return (
    <AppLayout><div className="max-w-6xl mx-auto space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-44 w-full" />
      <div className="grid grid-cols-3 gap-4">{[0,1,2].map(i => <Skeleton key={i} className="h-40" />)}</div>
    </div></AppLayout>
  );

  if (error || !data) return (
    <AppLayout><div className="max-w-6xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <ErrorMessage message={error || "Stock not found"} />
    </div></AppLayout>
  );

  const { quote, technical, fundamental, score } = data;
  const isUp = (quote.changePercent ?? 0) >= 0;

  const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "chart", label: "Chart", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { key: "setup", label: "Trade Setup", icon: <Target className="w-3.5 h-3.5" /> },
    { key: "technical", label: "Technical", icon: <Activity className="w-3.5 h-3.5" /> },
    { key: "fundamental", label: "Fundamental", icon: <Shield className="w-3.5 h-3.5" /> },
    { key: "score", label: "AI Score", icon: <Info className="w-3.5 h-3.5" /> },
  ];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* ── Hero Header ── */}
        <Card className="mb-4 p-5"
          style={{ background: "linear-gradient(135deg, rgba(19,28,46,0.95), rgba(26,37,64,0.85))" }}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white" }}>
                {symbol.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-100">{symbol}</h1>
                  <Badge variant="blue">{quote.exchange}</Badge>
                  <RecommendationBadge rec={score.recommendation} />
                  {data.isBreakout && <Badge variant="blue"><Flame className="w-3 h-3 mr-0.5" />Breakout</Badge>}
                  {data.isUndervalued && <Badge variant="purple"><Shield className="w-3 h-3 mr-0.5" />Undervalued</Badge>}
                  {fundamental.piotroF >= 7 && (
                    <Badge variant="green">F-Score {fundamental.piotroF}/9</Badge>
                  )}
                  {data.patterns?.vcp?.detected && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.4)" }}>VCP</span>
                  )}
                  {data.patterns?.cnh?.detected && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.4)" }}>Cup & Handle</span>
                  )}
                  {data.patterns?.rectangularBreakout?.detected && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.4)" }}>Rectangular</span>
                  )}
                  {data.patterns?.athBreakout?.detected && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.4)" }}>
                      {data.patterns.athBreakout.breakoutType === "FRESH_ATH" ? "ATH Breakout!" : "Near ATH"}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 mt-0.5 text-sm">{quote.name}</p>
                <p className="text-xs text-slate-600 mt-0.5">{quote.sector} · {quote.industry}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold font-mono text-slate-100">{formatCurrency(quote.price)}</div>
                <div className={`flex items-center justify-end gap-1 mt-1 ${getChangeColor(quote.changePercent)}`}>
                  {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="font-semibold">{formatPercent(quote.changePercent)}</span>
                  <span className="text-sm opacity-75">({formatCurrency(Math.abs(quote.change))})</span>
                </div>
                {fundamental.grahamNumber && (
                  <div className={`text-xs mt-1 ${quote.price < fundamental.grahamNumber ? "text-emerald-400" : "text-slate-500"}`}>
                    Graham: {formatCurrency(fundamental.grahamNumber)}
                    {quote.price < fundamental.grahamNumber ? " ✓ Below" : " ✗ Above"}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <ScoreBadge score={score.totalScore} />
                <button onClick={toggleWatchlist}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isWatched ? "text-blue-400" : "text-slate-400 hover:text-blue-400"}`}
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                  {isWatched ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                  {isWatched ? "Watching" : "Watchlist"}
                </button>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            {[
              { label: "Open", value: formatCurrency(quote.open) },
              { label: "High", value: formatCurrency(quote.high) },
              { label: "Low", value: formatCurrency(quote.low) },
              { label: "52W High", value: formatCurrency(quote.week52High) },
              { label: "52W Low", value: formatCurrency(quote.week52Low) },
              { label: "Mkt Cap", value: formatMarketCap(quote.marketCap) },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-xs text-slate-500">{s.label}</div>
                <div className="text-sm font-mono font-semibold text-slate-200 mt-0.5">{s.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Trend + key signals strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            {
              label: "Trend", value: technical.trend,
              color: technical.trend === "BULLISH" ? "text-emerald-400" : technical.trend === "BEARISH" ? "text-red-400" : "text-slate-400",
              sub: `ADX ${technical.adx.toFixed(0)} — ${technical.adxTrend}`,
            },
            {
              label: "RSI Signal", value: technical.rsiSignal.replace("_", " "),
              color: technical.rsiSignal === "OVERBOUGHT" ? "text-red-400" : technical.rsiSignal === "OVERSOLD" ? "text-yellow-400" : "text-emerald-400",
              sub: `RSI ${technical.rsi14.toFixed(1)}`,
            },
            {
              label: "MACD", value: technical.macdCrossover !== "NONE" ? `${technical.macdCrossover} CROSS` : technical.macd.histogram > 0 ? "BULLISH" : "BEARISH",
              color: technical.macdCrossover === "BULLISH" ? "text-emerald-400" : technical.macd.histogram > 0 ? "text-emerald-300" : "text-red-400",
              sub: technical.macdCrossover !== "NONE" ? "Fresh crossover ⚡" : `Hist ${technical.macd.histogram.toFixed(2)}`,
            },
            {
              label: "Volatility (ATR)", value: `${technical.atrPercent.toFixed(1)}%`,
              color: technical.atrPercent > 4 ? "text-red-400" : technical.atrPercent > 2 ? "text-yellow-400" : "text-emerald-400",
              sub: `ATR ₹${technical.atr.toFixed(1)}`,
            },
          ].map((s) => (
            <Card key={s.label} className="py-3 px-4">
              <div className="text-xs text-slate-500 mb-1">{s.label}</div>
              <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-600 mt-0.5">{s.sub}</div>
            </Card>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-4 overflow-x-auto"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "4px", width: "fit-content" }}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key ? "text-slate-100" : "text-slate-500 hover:text-slate-300"
              }`}
              style={activeTab === tab.key ? { background: "var(--bg-secondary)" } : {}}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Chart Tab ── */}
        {activeTab === "chart" && (
          <div className="space-y-4">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <SectionHeader title="Candlestick Chart — 3 Months" icon={<BarChart3 className="w-4 h-4" />} />
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-yellow-400 inline-block"/>EMA20</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-400 inline-block"/>EMA50</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-purple-400 inline-block"/>EMA200</span>
                </div>
              </div>
              <CandlestickChart
                data={data.ohlcv || []}
                height={340}
                supportLevel={technical.supportLevel}
                resistanceLevel={technical.resistanceLevel}
                ema20={technical.ema20}
                ema50={technical.ema50}
                ema200={technical.ema200}
              />
            </Card>

            {/* Market stats below chart */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Volume", value: formatVolume(quote.volume) },
                { label: "Avg Volume", value: formatVolume(quote.avgVolume) },
                { label: "Vol Ratio", value: `${technical.volumeRatio.toFixed(2)}x` },
                { label: "Prev Close", value: formatCurrency(quote.previousClose) },
              ].map((s) => (
                <Card key={s.label} className="text-center py-3">
                  <div className="text-xs text-slate-500">{s.label}</div>
                  <div className="text-sm font-mono font-semibold text-slate-200 mt-1">{s.value}</div>
                </Card>
              ))}
            </div>

            {/* Pivot Points */}
            <Card>
              <SectionHeader title="Pivot Points (Daily)" />
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                {[
                  { label: "R3", value: technical.pivotPoints.r3, color: "text-red-300" },
                  { label: "R2", value: technical.pivotPoints.r2, color: "text-red-400" },
                  { label: "R1", value: technical.pivotPoints.r1, color: "text-orange-400" },
                  { label: "PP", value: technical.pivotPoints.pp, color: "text-slate-200" },
                  { label: "S1", value: technical.pivotPoints.s1, color: "text-lime-400" },
                  { label: "S2", value: technical.pivotPoints.s2, color: "text-emerald-400" },
                  { label: "S3", value: technical.pivotPoints.s3, color: "text-emerald-300" },
                ].map((p) => (
                  <div key={p.label} className="px-2 py-2 rounded-lg"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                    <div className="text-xs text-slate-600">{p.label}</div>
                    <div className={`font-mono font-semibold ${p.color}`}>{formatCurrency(p.value)}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Chart Pattern Analysis */}
            <Card>
              <SectionHeader title="Chart Pattern Analysis" icon={<Activity className="w-4 h-4" />} />
              {(!data.patterns || data.patterns.detectedPatterns.length === 0) ? (
                <div className="text-sm text-slate-500 py-2">No high-confidence chart patterns detected in the current timeframe.</div>
              ) : (
                <div className="space-y-3">
                  {data.patterns.vcp && (
                    <div className={`rounded-xl p-4 border ${data.patterns.vcp.detected ? "" : "opacity-40"}`}
                      style={data.patterns.vcp.detected
                        ? { background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.25)" }
                        : { background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-amber-400">VCP — Volatility Contraction Pattern</span>
                          {data.patterns.vcp.detected && <span className="text-xs px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">Detected</span>}
                        </div>
                        {data.patterns.vcp.detected && (
                          <span className="text-xs text-slate-400">Strength: <span className="text-amber-400 font-bold">{data.patterns.vcp.strength}</span>/100</span>
                        )}
                      </div>
                      {data.patterns.vcp.detected && (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div><span className="text-slate-500">Contractions</span><div className="font-mono text-slate-200 font-semibold">{data.patterns.vcp.contractions}</div></div>
                          <div><span className="text-slate-500">Pivot Point</span><div className="font-mono text-amber-300 font-semibold">{formatCurrency(data.patterns.vcp.pivotPoint)}</div></div>
                        </div>
                      )}
                      <p className="text-xs text-slate-600 mt-2">Series of price contractions with declining volume — watch for breakout above the final pivot.</p>
                    </div>
                  )}

                  {data.patterns.cnh && (
                    <div className={`rounded-xl p-4 border ${data.patterns.cnh.detected ? "" : "opacity-40"}`}
                      style={data.patterns.cnh.detected
                        ? { background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.25)" }
                        : { background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-emerald-400">Cup & Handle (CnH)</span>
                          {data.patterns.cnh.detected && <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">Detected</span>}
                        </div>
                        {data.patterns.cnh.detected && (
                          <span className="text-xs text-slate-400">Strength: <span className="text-emerald-400 font-bold">{data.patterns.cnh.strength}</span>/100</span>
                        )}
                      </div>
                      {data.patterns.cnh.detected && (
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div><span className="text-slate-500">Cup Depth</span><div className="font-mono text-slate-200 font-semibold">{data.patterns.cnh.cupDepth}%</div></div>
                          <div><span className="text-slate-500">Handle Depth</span><div className="font-mono text-slate-200 font-semibold">{data.patterns.cnh.handleDepth}%</div></div>
                          <div><span className="text-slate-500">Buy Point</span><div className="font-mono text-emerald-300 font-semibold">{formatCurrency(data.patterns.cnh.buyPoint)}</div></div>
                        </div>
                      )}
                      <p className="text-xs text-slate-600 mt-2">Rounded U-shaped base followed by a small handle. Enter on breakout above the buy point with volume.</p>
                    </div>
                  )}

                  {data.patterns.rectangularBreakout && (
                    <div className={`rounded-xl p-4 border ${data.patterns.rectangularBreakout.detected ? "" : "opacity-40"}`}
                      style={data.patterns.rectangularBreakout.detected
                        ? { background: "rgba(59,130,246,0.06)", borderColor: "rgba(59,130,246,0.25)" }
                        : { background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-blue-400">Rectangular Breakout</span>
                          {data.patterns.rectangularBreakout.detected && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-400/15 text-blue-300 border border-blue-400/30">Detected</span>}
                        </div>
                        {data.patterns.rectangularBreakout.detected && (
                          <span className="text-xs text-slate-400">Strength: <span className="text-blue-400 font-bold">{data.patterns.rectangularBreakout.strength}</span>/100</span>
                        )}
                      </div>
                      {data.patterns.rectangularBreakout.detected && (
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div><span className="text-slate-500">Resistance</span><div className="font-mono text-red-400 font-semibold">{formatCurrency(data.patterns.rectangularBreakout.resistance)}</div></div>
                          <div><span className="text-slate-500">Support</span><div className="font-mono text-emerald-400 font-semibold">{formatCurrency(data.patterns.rectangularBreakout.support)}</div></div>
                          <div><span className="text-slate-500">Breakout</span><div className="font-mono text-blue-300 font-semibold">+{data.patterns.rectangularBreakout.breakoutPercent}%</div></div>
                        </div>
                      )}
                      <p className="text-xs text-slate-600 mt-2">Price broke above horizontal consolidation range with volume confirmation.</p>
                    </div>
                  )}

                  {data.patterns.athBreakout && (
                    <div className={`rounded-xl p-4 border ${data.patterns.athBreakout.detected ? "" : "opacity-40"}`}
                      style={data.patterns.athBreakout.detected
                        ? { background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)" }
                        : { background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-red-400">ATH Breakout</span>
                          {data.patterns.athBreakout.detected && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-red-400/15 text-red-300 border border-red-400/30">
                              {data.patterns.athBreakout.breakoutType === "FRESH_ATH" ? "Fresh ATH!" : "Near ATH"}
                            </span>
                          )}
                        </div>
                        {data.patterns.athBreakout.detected && (
                          <span className="text-xs text-slate-400">Strength: <span className="text-red-400 font-bold">{data.patterns.athBreakout.strength}</span>/100</span>
                        )}
                      </div>
                      {data.patterns.athBreakout.detected && (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div><span className="text-slate-500">52W High</span><div className="font-mono text-slate-200 font-semibold">{formatCurrency(data.patterns.athBreakout.ath52w)}</div></div>
                          <div><span className="text-slate-500">Type</span><div className="font-mono text-red-300 font-semibold">{data.patterns.athBreakout.breakoutType === "FRESH_ATH" ? "Price at / above ATH" : "Within 3% of ATH"}</div></div>
                        </div>
                      )}
                      <p className="text-xs text-slate-600 mt-2">Price at or near its 52-week high — strong momentum. Breakout above ATH with volume is a powerful continuation signal.</p>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Fibonacci */}
            <Card>
              <SectionHeader title="Fibonacci Retracement Levels" />
              <div className="space-y-2">
                {[
                  { label: "0% — Swing High", value: technical.fibonacci.level0, key: "level0" },
                  { label: "23.6%", value: technical.fibonacci.level236, key: "level236" },
                  { label: "38.2% — Watch zone", value: technical.fibonacci.level382, key: "level382" },
                  { label: "50%", value: technical.fibonacci.level500, key: "level500" },
                  { label: "61.8% — Golden ratio buy zone", value: technical.fibonacci.level618, key: "level618", highlight: true },
                  { label: "78.6%", value: technical.fibonacci.level786, key: "level786" },
                  { label: "100% — Swing Low", value: technical.fibonacci.level100, key: "level100" },
                ].map((f) => {
                  const isNear = Math.abs(quote.price - f.value) / quote.price < 0.02;
                  return (
                    <div key={f.key}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg ${f.highlight ? "border" : ""}`}
                      style={f.highlight ? { background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.2)" } : { background: "var(--bg-secondary)" }}>
                      <span className={`text-xs ${f.highlight ? "text-emerald-400 font-medium" : "text-slate-500"}`}>{f.label}</span>
                      <div className="flex items-center gap-2">
                        {isNear && <span className="text-xs text-yellow-400">◀ Near</span>}
                        <span className={`font-mono text-sm ${f.highlight ? "text-emerald-300 font-bold" : "text-slate-300"}`}>{formatCurrency(f.value)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ── Trade Setup Tab ── */}
        {activeTab === "setup" && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs"
              style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-blue-300/80">
                Trade setups are AI-generated based on technical analysis. Always validate with your own research.
                Never risk more than 1-2% of capital per trade. Use limit orders at the entry zone, not market orders.
              </span>
            </div>
            <TradeSetupCard setup={score.tradeSetup} currentPrice={quote.price} />
            <PositionSizer entryPrice={score.tradeSetup.entryPrice} stopLoss={score.tradeSetup.stopLoss} />
          </div>
        )}

        {/* ── Technical Tab ── */}
        {activeTab === "technical" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <SectionHeader title="Momentum" />
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">RSI (14)</span>
                    <span className={technical.rsiSignal === "OVERBOUGHT" ? "text-red-400" : technical.rsiSignal === "OVERSOLD" ? "text-yellow-400" : "text-emerald-400"}>
                      {technical.rsi14.toFixed(1)} — {technical.rsiSignal.replace("_", " ")}
                    </span>
                  </div>
                  <ProgressBar value={technical.rsi14} max={100}
                    color={technical.rsi14 > 70 ? "red" : technical.rsi14 < 30 ? "yellow" : "green"} />
                  <div className="flex justify-between text-xs mt-0.5 text-slate-600">
                    <span>30 (Oversold)</span><span>50</span><span>70 (Overbought)</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Stochastic %K</span>
                    <span className={technical.stochasticSignal === "OVERBOUGHT" ? "text-red-400" : technical.stochasticSignal === "OVERSOLD" ? "text-yellow-400" : "text-slate-300"}>
                      {technical.stochasticK.toFixed(1)} — {technical.stochasticSignal}
                    </span>
                  </div>
                  <ProgressBar value={technical.stochasticK} max={100}
                    color={technical.stochasticK > 80 ? "red" : technical.stochasticK < 20 ? "yellow" : "blue"} />
                </div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Stochastic %D</span><span className="text-slate-300">{technical.stochasticD.toFixed(1)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">ADX (Trend strength)</span>
                  <span className={technical.adx >= 25 ? "text-emerald-400" : "text-slate-400"}>{technical.adx.toFixed(0)} — {technical.adxTrend}</span>
                </div>
              </div>
            </Card>

            <Card>
              <SectionHeader title="MACD" />
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Crossover Signal</span>
                  <Badge variant={technical.macdCrossover === "BULLISH" ? "green" : technical.macdCrossover === "BEARISH" ? "red" : "default"}>
                    {technical.macdCrossover === "NONE" ? "—" : technical.macdCrossover}
                  </Badge>
                </div>
                {[
                  { label: "MACD Line", value: technical.macd.macd, pos: technical.macd.macd > 0 },
                  { label: "Signal Line", value: technical.macd.signal, pos: technical.macd.signal > 0 },
                  { label: "Histogram", value: technical.macd.histogram, pos: technical.macd.histogram > 0 },
                ].map((m) => (
                  <div key={m.label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{m.label}</span>
                    <span className={m.pos ? "text-emerald-400" : "text-red-400"}>{m.value.toFixed(2)}</span>
                  </div>
                ))}
                <div className="text-xs text-slate-600 pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                  Bullish crossover = MACD crosses above Signal — high-conviction buy
                </div>
              </div>
            </Card>

            <Card>
              <SectionHeader title="Bollinger Bands" />
              <div className="space-y-2.5">
                {[
                  { label: "Upper Band", value: technical.bollingerBands.upper },
                  { label: "Middle (SMA20)", value: technical.bollingerBands.middle },
                  { label: "Lower Band", value: technical.bollingerBands.lower },
                ].map((b) => (
                  <div key={b.label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{b.label}</span>
                    <span className="font-mono text-slate-200">{formatCurrency(b.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                  <span className="text-slate-500">Price Position</span>
                  <Badge variant={technical.bollingerPosition === "ABOVE_UPPER" ? "red" : technical.bollingerPosition === "BELOW_LOWER" ? "yellow" : "default"}>
                    {technical.bollingerPosition.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Bandwidth (ATR%)</span>
                  <span className="text-slate-300">{technical.atrPercent.toFixed(2)}%</span>
                </div>
              </div>
            </Card>

            <Card>
              <SectionHeader title="Moving Averages" />
              <div className="space-y-2.5">
                {[
                  { label: "EMA 20", value: technical.ema20, above: technical.priceAboveEma20 },
                  { label: "EMA 50", value: technical.ema50, above: technical.priceAboveEma50 },
                  { label: "EMA 200", value: technical.ema200, above: technical.priceAboveEma200 },
                  { label: "SMA 20", value: technical.sma20, above: quote.price > technical.sma20 },
                  { label: "SMA 50", value: technical.sma50, above: quote.price > technical.sma50 },
                  { label: "SMA 200", value: technical.sma200, above: quote.price > technical.sma200 },
                ].map((ma) => (
                  <div key={ma.label} className="flex justify-between text-sm items-center">
                    <span className="text-slate-500">{ma.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-200">{formatCurrency(ma.value)}</span>
                      <span className={`text-xs ${ma.above ? "text-emerald-400" : "text-red-400"}`}>{ma.above ? "▲" : "▼"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionHeader title="Key Signals" />
              <div className="space-y-3">
                {[
                  { label: "Overall Trend", value: technical.trend, variant: (technical.trend === "BULLISH" ? "green" : technical.trend === "BEARISH" ? "red" : "default") as "green" | "red" | "default" },
                  { label: "Trend Strength", value: `${technical.trendStrength}%`, variant: "default" as "default" },
                  { label: "Golden Cross", value: technical.goldenCross ? "YES ✓" : "No", variant: (technical.goldenCross ? "green" : "default") as "green" | "default" },
                  { label: "Death Cross", value: technical.deathCross ? "YES ✗" : "No", variant: (technical.deathCross ? "red" : "default") as "red" | "default" },
                  { label: "Breakout", value: technical.breakoutDetected ? "Detected 🔥" : "None", variant: (technical.breakoutDetected ? "blue" : "default") as "blue" | "default" },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">{s.label}</span>
                    <Badge variant={s.variant}>{s.value}</Badge>
                  </div>
                ))}
                <div className="pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Support</span><span className="font-mono text-emerald-400">{formatCurrency(technical.supportLevel)}</span></div>
                  <div className="flex justify-between text-sm mt-1"><span className="text-slate-500">Resistance</span><span className="font-mono text-red-400">{formatCurrency(technical.resistanceLevel)}</span></div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── Fundamental Tab ── */}
        {activeTab === "fundamental" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Piotroski F-Score */}
            <Card className="md:col-span-2">
              <SectionHeader title="Piotroski F-Score (Quality Gauge)" icon={<Shield className="w-4 h-4" />} />
              <div className="flex items-center gap-6">
                <div className="text-center flex-shrink-0">
                  <div className={`text-5xl font-bold font-mono ${fundamental.piotroF >= 7 ? "text-emerald-400" : fundamental.piotroF >= 4 ? "text-yellow-400" : "text-red-400"}`}>
                    {fundamental.piotroF}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">out of 9</div>
                  <div className={`text-xs font-semibold mt-1 ${fundamental.piotroF >= 7 ? "text-emerald-400" : fundamental.piotroF >= 4 ? "text-yellow-400" : "text-red-400"}`}>
                    {fundamental.piotroF >= 7 ? "High Quality" : fundamental.piotroF >= 4 ? "Average" : "Weak"}
                  </div>
                </div>
                <div className="flex-1">
                  <ProgressBar value={fundamental.piotroF} max={9}
                    color={fundamental.piotroF >= 7 ? "green" : fundamental.piotroF >= 4 ? "yellow" : "red"} />
                  <div className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Scores 9 binary criteria: profitability (ROA, CFO, ROE, EPS growth), leverage (debt, liquidity, no dilution), and operating efficiency (gross margin, asset turnover).
                    <strong className="text-slate-300"> 7-9 = strong quality business. 0-3 = potential value trap.</strong>
                  </div>
                </div>
              </div>
              {fundamental.grahamNumber && (
                <div className={`mt-4 pt-4 border-t flex items-center justify-between`} style={{ borderColor: "var(--border)" }}>
                  <div>
                    <div className="text-sm font-medium text-slate-200">Graham Number (Intrinsic Value)</div>
                    <div className="text-xs text-slate-500 mt-0.5">√(22.5 × EPS × Book Value) — Benjamin Graham formula</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold font-mono text-emerald-400">{formatCurrency(fundamental.grahamNumber)}</div>
                    <div className={`text-xs font-medium mt-0.5 ${quote.price < fundamental.grahamNumber ? "text-emerald-400" : "text-red-400"}`}>
                      {quote.price < fundamental.grahamNumber
                        ? `${(((fundamental.grahamNumber - quote.price) / fundamental.grahamNumber) * 100).toFixed(1)}% Margin of Safety`
                        : `${(((quote.price - fundamental.grahamNumber) / fundamental.grahamNumber) * 100).toFixed(1)}% Above Intrinsic Value`}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <SectionHeader title="Valuation" />
              <div className="space-y-3">
                {[
                  { label: "P/E Ratio", value: fundamental.peRatio?.toFixed(1) ?? "—", note: fundamental.peRatio && fundamental.peRatio < 20 ? "✓ Attractive" : fundamental.peRatio && fundamental.peRatio > 50 ? "⚠ Expensive" : "" },
                  { label: "P/B Ratio", value: fundamental.pbRatio?.toFixed(2) ?? "—", note: fundamental.pbRatio && fundamental.pbRatio < 1 ? "✓ Below book" : "" },
                  { label: "Price/Sales", value: fundamental.priceToSales?.toFixed(2) ?? "—" },
                  { label: "EV/EBITDA", value: fundamental.evToEbitda?.toFixed(1) ?? "—" },
                  { label: "EPS", value: fundamental.eps ? formatCurrency(fundamental.eps) : "—" },
                  { label: "Book Value", value: fundamental.bookValue ? formatCurrency(fundamental.bookValue) : "—" },
                  { label: "Dividend Yield", value: fundamental.dividendYield ? `${fundamental.dividendYield.toFixed(2)}%` : "—" },
                ].map((f) => (
                  <div key={f.label} className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">{f.label}</span>
                    <div className="text-right">
                      <span className="font-mono text-slate-200">{f.value}</span>
                      {f.note && <span className="ml-2 text-xs text-emerald-400">{f.note}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionHeader title="Growth & Profitability" />
              <div className="space-y-3">
                {[
                  { label: "Revenue Growth", value: fundamental.revenueGrowth, pct: true },
                  { label: "EPS Growth", value: fundamental.epsGrowth, pct: true },
                  { label: "Profit Growth", value: fundamental.profitGrowth, pct: true },
                  { label: "ROE", value: fundamental.roe, pct: true },
                  { label: "ROA", value: fundamental.roa, pct: true },
                  { label: "Debt / Equity", value: fundamental.debtToEquity, pct: false },
                  { label: "Current Ratio", value: fundamental.currentRatio, pct: false },
                ].map((f) => (
                  <div key={f.label} className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">{f.label}</span>
                    <span className={`font-mono ${f.value !== null && f.pct && f.value < 0 ? "text-red-400" : f.value !== null && f.pct && f.value > 15 ? "text-emerald-400" : "text-slate-200"}`}>
                      {f.value !== null ? (f.pct ? `${f.value.toFixed(1)}%` : f.value.toFixed(2)) : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="md:col-span-2">
              <SectionHeader title="Cash Flow Health" />
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Operating Cashflow", value: fundamental.operatingCashflow, good: (v: number) => v > 0 },
                  { label: "Free Cashflow", value: fundamental.freeCashflow, good: (v: number) => v > 0 },
                ].map((c) => (
                  <div key={c.label}>
                    <div className="text-xs text-slate-500 mb-1">{c.label}</div>
                    {c.value !== null ? (
                      <>
                        <div className={`text-lg font-bold font-mono ${c.good(c.value) ? "text-emerald-400" : "text-red-400"}`}>
                          {c.good(c.value) ? "+" : ""}{formatMarketCap(Math.abs(c.value))}
                        </div>
                        <div className="text-xs mt-0.5 text-slate-500">{c.good(c.value) ? "Generating cash ✓" : "Cash burn ⚠"}</div>
                      </>
                    ) : <div className="text-slate-600 text-sm">Not available</div>}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── AI Score Tab ── */}
        {activeTab === "score" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <SectionHeader title="Score Breakdown" icon={<Calculator className="w-4 h-4" />} />
              <div className="space-y-4">
                {[
                  { label: "Technical (35%)", value: score.technicalScore, color: "blue" as const },
                  { label: "Fundamental (30%)", value: score.fundamentalScore, color: "green" as const },
                  { label: "Volume / Breakout (20%)", value: score.volumeBreakoutScore, color: "purple" as const },
                  { label: "Sentiment (15%)", value: score.sentimentScore, color: "yellow" as const },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">{s.label}</span>
                      <span className={`font-bold ${s.value >= 70 ? "text-emerald-400" : s.value >= 50 ? "text-yellow-400" : "text-red-400"}`}>{s.value}/100</span>
                    </div>
                    <ProgressBar value={s.value} color={s.color} />
                  </div>
                ))}
                <div className="pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">Total Score</span>
                    <ScoreBadge score={score.totalScore} />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-slate-400 text-sm">Signal Confidence</span>
                    <span className="text-slate-200 font-semibold">{score.confidence}%</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card>
                <SectionHeader title="Reasons to Consider" />
                {score.reasons.length === 0 ? <p className="text-slate-500 text-sm">No strong signals.</p> : (
                  <ul className="space-y-2">
                    {score.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>{r}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
              <Card>
                <SectionHeader title="Risks & Red Flags" />
                <ul className="space-y-2">
                  {score.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>{r}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        )}

        <div className="mt-5 p-3 rounded-xl text-xs text-yellow-500/60 text-center"
          style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.1)" }}>
          ⚠ For educational research only. Not SEBI-registered advice. Always do your own research and consult a financial advisor before investing.
        </div>
      </div>
    </AppLayout>
  );
}
