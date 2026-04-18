"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Card,
  SectionHeader,
  ProgressBar,
  StockSearchInput,
} from "@/components/ui";
import { NSEStock } from "@/lib/types";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend as RechartsLegend,
} from "recharts";
import { PortfolioHolding } from "@/lib/types";
import {
  formatCurrency,
  formatPercent,
  getChangeColor,
} from "@/lib/utils";
import {
  BriefcaseBusiness,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  X,
  RefreshCw,
  Activity,
  Award,
  AlertTriangle,
  PieChart as PieIcon,
} from "lucide-react";
import { usePortfolio } from "@/lib/store";
import toast from "react-hot-toast";
import { INDIAN_STOCKS } from "@/lib/data/indian-stocks";

interface AddHoldingForm {
  symbol: string;
  quantity: string;
  avgBuyPrice: string;
  buyDate: string;
}

// ── Portfolio analytics helpers ──────────────────────────────────────────────

function computeCAGR(invested: number, current: number, buyDate: string): number | null {
  const start = new Date(buyDate).getTime();
  const now = Date.now();
  const years = (now - start) / (365.25 * 24 * 60 * 60 * 1000);
  if (years < 0.01 || invested <= 0) return null;
  return (Math.pow(current / invested, 1 / years) - 1) * 100;
}

function computePortfolioStats(holdings: PortfolioHolding[]) {
  if (holdings.length === 0) return null;

  const totalInvested = holdings.reduce((s, h) => s + h.investedAmount, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.currentValue, 0);

  // Weighted avg CAGR (only holdings with buy dates)
  const holdingsWithDate = holdings.filter((h) => h.buyDate);
  let weightedCAGR: number | null = null;
  if (holdingsWithDate.length > 0) {
    let wSum = 0;
    let weightTotal = 0;
    for (const h of holdingsWithDate) {
      const cagr = computeCAGR(h.investedAmount, h.currentValue, h.buyDate!);
      if (cagr !== null) {
        wSum += cagr * h.investedAmount;
        weightTotal += h.investedAmount;
      }
    }
    weightedCAGR = weightTotal > 0 ? wSum / weightTotal : null;
  }

  // Cross-sectional volatility proxy: std-dev of individual pnlPercent returns
  const returns = holdings.map((h) => h.pnlPercent);
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / Math.max(returns.length - 1, 1);
  const volatility = Math.sqrt(variance);

  // Max drawdown proxy: worst single holding loss as % of total portfolio
  const worstLoss = holdings.reduce((worst, h) => (h.pnl < worst ? h.pnl : worst), 0);
  const maxDrawdown = totalInvested > 0 ? (worstLoss / totalInvested) * 100 : 0;

  // Sharpe proxy: portfolio return / cross-sectional volatility (risk-free ≈ 6.5% India)
  const portfolioReturn = totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0;
  const riskFreeRate = 6.5;
  const sharpe = volatility > 0 ? (portfolioReturn - riskFreeRate) / volatility : null;

  // Largest position weight
  const largestWeight = holdings.reduce((max, h) =>
    totalCurrent > 0 ? Math.max(max, (h.currentValue / totalCurrent) * 100) : max, 0);

  // Best and worst holdings
  const best = [...holdings].sort((a, b) => b.pnlPercent - a.pnlPercent)[0];
  const worst = [...holdings].sort((a, b) => a.pnlPercent - b.pnlPercent)[0];

  // HHI diversification score (0=perfect, 10000=one stock)
  const hhi = totalCurrent > 0
    ? holdings.reduce((sum, h) => sum + Math.pow((h.currentValue / totalCurrent) * 100, 2), 0)
    : 10000;
  // Normalize to 0-100 where 100 = perfectly diversified
  const diversificationScore = holdings.length <= 1 ? 0 : Math.max(0, 100 - Math.sqrt(hhi / holdings.length));

  return { weightedCAGR, volatility, maxDrawdown, sharpe, largestWeight, best, worst, diversificationScore, portfolioReturn };
}

const DONUT_COLORS = [
  "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444",
  "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: { pct: number } }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-xs shadow-xl"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <p className="font-semibold text-slate-200">{payload[0].name}</p>
      <p className="text-slate-400">{payload[0].payload.pct.toFixed(1)}%</p>
    </div>
  );
}

function SectorDonut({ breakdown, totalCurrent }: { breakdown: Record<string, number>; totalCurrent: number }) {
  const data = Object.entries(breakdown)
    .sort(([, a], [, b]) => b - a)
    .map(([sector, value]) => ({
      name: sector,
      value,
      pct: totalCurrent > 0 ? (value / totalCurrent) * 100 : 0,
    }));

  if (data.length === 0) return null;

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip content={<CustomTooltip />} />
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="mt-2 space-y-1.5">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
              <span className="text-slate-400 truncate">{item.name}</span>
            </div>
            <span className="text-slate-300 font-semibold ml-2">{item.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const { holdings, add, remove, update } = usePortfolio();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<AddHoldingForm>({
    symbol: "", quantity: "", avgBuyPrice: "",
    buyDate: new Date().toISOString().slice(0, 10),
  });
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(false);

  const totalInvested = holdings.reduce((s, h) => s + h.investedAmount, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalPnl = totalCurrent - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  const stats = computePortfolioStats(holdings);

  const refreshPrices = async () => {
    if (holdings.length === 0) return;
    setLoadingPrices(true);
    for (const h of holdings) {
      try {
        const res = await fetch(`/api/stock/${encodeURIComponent(h.symbol)}`);
        const data = await res.json();
        if (data.quote?.price) {
          const currentPrice = data.quote.price;
          const currentValue = currentPrice * h.quantity;
          update(h.symbol, {
            currentPrice,
            currentValue,
            pnl: currentValue - h.investedAmount,
            pnlPercent: ((currentValue - h.investedAmount) / h.investedAmount) * 100,
          });
        }
      } catch {
        // skip
      }
    }
    setLoadingPrices(false);
    toast.success("Prices refreshed");
  };

  useEffect(() => {
    refreshPrices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async () => {
    if (!form.symbol || !form.quantity || !form.avgBuyPrice) {
      toast.error("Fill in all fields");
      return;
    }
    const stockMeta = INDIAN_STOCKS.find(
      (s) => s.symbol === form.symbol.toUpperCase().trim()
    );
    const symbol = form.symbol.toUpperCase().trim();
    const qty = parseFloat(form.quantity);
    const avgPrice = parseFloat(form.avgBuyPrice);
    const invested = qty * avgPrice;

    setFetchingPrice(true);
    let currentPrice = avgPrice;
    try {
      const res = await fetch(`/api/stock/${encodeURIComponent(symbol)}`);
      const data = await res.json();
      if (data.quote?.price) currentPrice = data.quote.price;
    } catch {
      // use avg price as fallback
    }
    setFetchingPrice(false);

    const currentValue = currentPrice * qty;

    add({
      symbol,
      name: stockMeta?.name || symbol,
      exchange: (stockMeta?.exchange as "NSE" | "BSE") || "NSE",
      quantity: qty,
      avgBuyPrice: avgPrice,
      currentPrice,
      investedAmount: invested,
      currentValue,
      pnl: currentValue - invested,
      pnlPercent: ((currentValue - invested) / invested) * 100,
      sector: stockMeta?.sector || "Unknown",
      buyDate: form.buyDate || undefined,
    });

    toast.success(`Added ${symbol} to portfolio`);
    setForm({ symbol: "", quantity: "", avgBuyPrice: "", buyDate: new Date().toISOString().slice(0, 10) });
    setShowAdd(false);
  };

  const handleRemove = (symbol: string) => {
    remove(symbol);
    toast.success(`Removed ${symbol}`);
  };

  const sectorBreakdown = holdings.reduce<Record<string, number>>((acc, h) => {
    acc[h.sector] = (acc[h.sector] || 0) + h.currentValue;
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BriefcaseBusiness className="w-5 h-5 text-blue-400" />
              Portfolio
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">{holdings.length} holding{holdings.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshPrices}
              disabled={loadingPrices}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <RefreshCw className={`w-3 h-3 ${loadingPrices ? "animate-spin" : ""}`} />
              {loadingPrices ? "Refreshing..." : "Refresh Prices"}
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              <Plus className="w-4 h-4" /> Add Holding
            </button>
          </div>
        </div>

        {/* Add form modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
            <Card className="w-full max-w-sm mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100">Add Holding</h3>
                <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Stock (search by name or symbol)</label>
                  <StockSearchInput
                    value={form.symbol}
                    onChange={(symbol, meta?: NSEStock) =>
                      setForm((f) => ({ ...f, symbol }))
                    }
                    placeholder="e.g. Reliance Power, RPOWER, TCS…"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                    placeholder="10"
                    min="1"
                    className="w-full text-sm text-slate-200 border rounded-lg px-3 py-2 outline-none"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Avg Buy Price (₹)</label>
                  <input
                    type="number"
                    value={form.avgBuyPrice}
                    onChange={(e) => setForm((f) => ({ ...f, avgBuyPrice: e.target.value }))}
                    placeholder="2500"
                    min="0"
                    className="w-full text-sm text-slate-200 border rounded-lg px-3 py-2 outline-none"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Buy Date (for CAGR)</label>
                  <input
                    type="date"
                    value={form.buyDate}
                    onChange={(e) => setForm((f) => ({ ...f, buyDate: e.target.value }))}
                    className="w-full text-sm text-slate-200 border rounded-lg px-3 py-2 outline-none"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowAdd(false)}
                    className="flex-1 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={fetchingPrice}
                    className="flex-1 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                  >
                    {fetchingPrice ? "Fetching..." : "Add"}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {holdings.length === 0 ? (
          <Card className="text-center py-16">
            <BriefcaseBusiness className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No holdings yet</p>
            <p className="text-slate-600 text-sm mt-1">Add your first holding to track P&L and performance.</p>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white mx-auto"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              <Plus className="w-4 h-4" /> Add Holding
            </button>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Invested", value: formatCurrency(totalInvested), color: "text-slate-200" },
                { label: "Current Value", value: formatCurrency(totalCurrent), color: "text-slate-200" },
                {
                  label: "Total P&L",
                  value: `${totalPnl >= 0 ? "+" : ""}${formatCurrency(totalPnl)}`,
                  color: totalPnl >= 0 ? "text-emerald-400" : "text-red-400",
                },
                {
                  label: "P&L %",
                  value: formatPercent(totalPnlPercent),
                  color: totalPnlPercent >= 0 ? "text-emerald-400" : "text-red-400",
                },
              ].map((s) => (
                <Card key={s.label} className="text-center">
                  <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                  <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
                </Card>
              ))}
            </div>

            {/* Analytics Row */}
            {stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {/* CAGR */}
                <Card className="text-center">
                  <div className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3" /> CAGR
                  </div>
                  {stats.weightedCAGR !== null ? (
                    <div className={`text-lg font-bold font-mono ${stats.weightedCAGR >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {stats.weightedCAGR >= 0 ? "+" : ""}{stats.weightedCAGR.toFixed(1)}%
                    </div>
                  ) : (
                    <div className="text-lg font-bold font-mono text-slate-500">—</div>
                  )}
                  <div className="text-xs text-slate-600 mt-0.5">Annualised return</div>
                </Card>

                {/* Sharpe Ratio */}
                <Card className="text-center">
                  <div className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                    <Award className="w-3 h-3" /> Sharpe Ratio
                  </div>
                  {stats.sharpe !== null ? (
                    <div className={`text-lg font-bold font-mono ${stats.sharpe >= 1 ? "text-emerald-400" : stats.sharpe >= 0 ? "text-yellow-400" : "text-red-400"}`}>
                      {stats.sharpe.toFixed(2)}
                    </div>
                  ) : (
                    <div className="text-lg font-bold font-mono text-slate-500">—</div>
                  )}
                  <div className="text-xs text-slate-600 mt-0.5">{stats.sharpe !== null && stats.sharpe >= 1 ? "Good risk-adj return" : "Risk-adj return"}</div>
                </Card>

                {/* Max Drawdown */}
                <Card className="text-center">
                  <div className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                    <TrendingDown className="w-3 h-3" /> Max Drawdown
                  </div>
                  <div className={`text-lg font-bold font-mono ${stats.maxDrawdown < -10 ? "text-red-400" : stats.maxDrawdown < 0 ? "text-yellow-400" : "text-emerald-400"}`}>
                    {stats.maxDrawdown.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">Worst holding loss</div>
                </Card>

                {/* Volatility */}
                <Card className="text-center">
                  <div className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Volatility
                  </div>
                  <div className={`text-lg font-bold font-mono ${stats.volatility > 20 ? "text-red-400" : stats.volatility > 10 ? "text-yellow-400" : "text-emerald-400"}`}>
                    {stats.volatility.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">Return dispersion</div>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Holdings Table */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="overflow-hidden p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Qty</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Avg</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">LTP</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">P&L</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {holdings.map((h) => (
                          <tr key={h.symbol} className="stock-row border-b" style={{ borderColor: "var(--border)" }}>
                            <td className="px-4 py-3.5">
                              <div className="font-semibold text-slate-100">{h.symbol}</div>
                              <div className="text-xs text-slate-500">{h.sector}</div>
                              {h.buyDate && <div className="text-xs text-slate-600">{h.buyDate}</div>}
                            </td>
                            <td className="px-4 py-3.5 text-right text-slate-300 font-mono">{h.quantity}</td>
                            <td className="px-4 py-3.5 text-right text-slate-400 font-mono hidden sm:table-cell">
                              {formatCurrency(h.avgBuyPrice)}
                            </td>
                            <td className="px-4 py-3.5 text-right font-mono text-slate-200">
                              {formatCurrency(h.currentPrice)}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <div className={`font-mono text-sm font-bold ${getChangeColor(h.pnl)}`}>
                                {h.pnl >= 0 ? "+" : ""}{formatCurrency(h.pnl)}
                              </div>
                              <div className={`text-xs ${getChangeColor(h.pnlPercent)}`}>
                                {formatPercent(h.pnlPercent)}
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => handleRemove(h.symbol)}
                                className="text-slate-600 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Best / Worst performer */}
                {stats && holdings.length >= 2 && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-3.5" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                      <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> Best Performer
                      </div>
                      <div className="font-bold text-slate-100">{stats.best.symbol}</div>
                      <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                        {formatPercent(stats.best.pnlPercent)}
                      </div>
                      <div className="text-xs text-slate-500">{formatCurrency(stats.best.pnl)} P&L</div>
                    </div>
                    <div className="rounded-xl p-3.5" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <div className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" /> Worst Performer
                      </div>
                      <div className="font-bold text-slate-100">{stats.worst.symbol}</div>
                      <div className="text-lg font-bold font-mono text-red-400 mt-0.5">
                        {formatPercent(stats.worst.pnlPercent)}
                      </div>
                      <div className="text-xs text-slate-500">{formatCurrency(stats.worst.pnl)} P&L</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right sidebar */}
              <div className="space-y-4">
                {/* Sector Breakdown */}
                <Card>
                  <SectionHeader title="Sector Allocation" icon={<PieIcon className="w-3.5 h-3.5" />} />
                  <SectorDonut breakdown={sectorBreakdown} totalCurrent={totalCurrent} />
                </Card>

                {/* Portfolio Health */}
                {stats && (
                  <Card>
                    <SectionHeader title="Portfolio Health" />
                    <div className="space-y-3">
                      {/* Diversification */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">Diversification</span>
                          <span className={`font-semibold ${stats.diversificationScore > 60 ? "text-emerald-400" : stats.diversificationScore > 30 ? "text-yellow-400" : "text-red-400"}`}>
                            {stats.diversificationScore.toFixed(0)}/100
                          </span>
                        </div>
                        <ProgressBar
                          value={stats.diversificationScore}
                          color={stats.diversificationScore > 60 ? "green" : stats.diversificationScore > 30 ? "yellow" : "red"}
                        />
                      </div>

                      {[
                        {
                          label: "Largest Position",
                          value: `${stats.largestWeight.toFixed(1)}%`,
                          status: stats.largestWeight > 30 ? "⚠ High concentration" : "Healthy",
                          color: stats.largestWeight > 30 ? "text-yellow-400" : "text-emerald-400",
                        },
                        {
                          label: "Holdings Count",
                          value: `${holdings.length}`,
                          status: holdings.length >= 10 ? "Well diversified" : holdings.length >= 5 ? "Moderate" : "Concentrated",
                          color: holdings.length >= 10 ? "text-emerald-400" : holdings.length >= 5 ? "text-yellow-400" : "text-red-400",
                        },
                        {
                          label: "Sectors",
                          value: `${Object.keys(sectorBreakdown).length}`,
                          status: Object.keys(sectorBreakdown).length >= 4 ? "Diversified" : "Concentrate",
                          color: Object.keys(sectorBreakdown).length >= 4 ? "text-emerald-400" : "text-yellow-400",
                        },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-1.5 border-t" style={{ borderColor: "var(--border)" }}>
                          <span className="text-xs text-slate-500">{item.label}</span>
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-200 font-mono">{item.value}</span>
                            <div className={`text-xs ${item.color}`}>{item.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-4 text-center">
              Sharpe ratio uses 6.5% Indian risk-free rate. CAGR requires buy date. Volatility = cross-sectional return dispersion. Not financial advice.
            </p>
          </>
        )}
      </div>
    </AppLayout>
  );
}
