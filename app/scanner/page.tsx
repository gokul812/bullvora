"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import {
  Card,
  Badge,
  ScoreBadge,
  RecommendationBadge,
  SectionHeader,
  Skeleton,
} from "@/components/ui";
import { AnalyzedStock, ScannerFilters } from "@/lib/types";
import {
  formatCurrency,
  formatPercent,
  formatMarketCap,
  formatVolume,
  getChangeBg,
} from "@/lib/utils";
import { SECTORS as INDIAN_SECTORS } from "@/lib/data/indian-stocks";
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  Flame,
  Shield,
  ChevronUp,
  ChevronDown,
  BookmarkPlus,
  BookmarkCheck,
} from "lucide-react";
import Link from "next/link";
import { useWatchlist } from "@/lib/store";
import toast from "react-hot-toast";

const SORT_OPTIONS = [
  { value: "score", label: "AI Score" },
  { value: "change", label: "% Change" },
  { value: "price", label: "Price" },
  { value: "volume", label: "Volume" },
  { value: "marketCap", label: "Market Cap" },
];

function ScannerContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "";
  const category = searchParams.get("category") || "";

  const [stocks, setStocks] = useState<AnalyzedStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ScannerFilters>({
    sector: "All Sectors",
    exchange: "ALL",
    recommendation: "ALL",
    sortBy: "score",
    sortDir: "desc",
    breakoutOnly: category === "breakout" || filter === "breakout",
    undervaluedOnly: filter === "undervalued",
    pattern: "ALL",
  });

  const { add: addToWatchlist, remove: removeFromWatchlist, has: inWatchlist } = useWatchlist();

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    setOffset(0);
    try {
      const res = await fetch("/api/scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...filters, offset: 0, pageSize: 50 }),
      });
      const data = await res.json();
      setStocks(data.stocks || []);
      setHasMore(data.hasMore ?? false);
      setTotalAvailable(data.totalAvailable ?? 0);
      setOffset(50);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetch("/api/scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...filters, offset, pageSize: 50 }),
      });
      const data = await res.json();
      setStocks((prev) => [...prev, ...(data.stocks || [])]);
      setHasMore(data.hasMore ?? false);
      setOffset((prev) => prev + 50);
    } catch {
      // silent
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  const displayed = stocks.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.quote.symbol.toLowerCase().includes(q) ||
      s.quote.name.toLowerCase().includes(q) ||
      s.quote.sector.toLowerCase().includes(q)
    );
  });

  const handleSort = (col: string) => {
    setFilters((f) => ({
      ...f,
      sortBy: col as ScannerFilters["sortBy"],
      sortDir: f.sortBy === col && f.sortDir === "desc" ? "asc" : "desc",
    }));
  };

  const toggleWatchlist = (s: AnalyzedStock, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist(s.quote.symbol)) {
      removeFromWatchlist(s.quote.symbol);
      toast.success(`Removed ${s.quote.symbol} from watchlist`);
    } else {
      addToWatchlist({
        symbol: s.quote.symbol,
        name: s.quote.name,
        exchange: s.quote.exchange,
        addedAt: Date.now(),
      });
      toast.success(`Added ${s.quote.symbol} to watchlist`);
    }
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (filters.sortBy !== col) return null;
    return filters.sortDir === "desc" ? (
      <ChevronDown className="w-3 h-3 inline ml-0.5" />
    ) : (
      <ChevronUp className="w-3 h-3 inline ml-0.5" />
    );
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Stock Scanner</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {loading ? "Scanning..." : `${displayed.length} shown · ${totalAvailable} total in database`}
            </p>
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-slate-100 transition-colors"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Quick filter pills */}
        <div className="flex flex-wrap gap-2 mb-2">
          {[
            { label: "All", active: !filters.breakoutOnly && !filters.undervaluedOnly && filters.recommendation === "ALL" && (!filters.pattern || filters.pattern === "ALL"), onClick: () => setFilters((f) => ({ ...f, breakoutOnly: false, undervaluedOnly: false, recommendation: "ALL", pattern: "ALL" })) },
            { label: "🔥 Breakouts", active: !!filters.breakoutOnly, onClick: () => setFilters((f) => ({ ...f, breakoutOnly: true, undervaluedOnly: false, pattern: "ALL" })) },
            { label: "🛡 Undervalued", active: !!filters.undervaluedOnly, onClick: () => setFilters((f) => ({ ...f, undervaluedOnly: true, breakoutOnly: false, pattern: "ALL" })) },
            { label: "✅ BUY signals", active: filters.recommendation === "BUY", onClick: () => setFilters((f) => ({ ...f, recommendation: "BUY", breakoutOnly: false, undervaluedOnly: false, pattern: "ALL" })) },
          ].map((p) => (
            <button
              key={p.label}
              onClick={p.onClick}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: p.active ? "rgba(59,130,246,0.18)" : "var(--bg-card)",
                border: `1px solid ${p.active ? "rgba(59,130,246,0.5)" : "var(--border)"}`,
                color: p.active ? "#93c5fd" : "var(--text-muted, #94a3b8)",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Chart Pattern filter pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-slate-500 self-center">Patterns:</span>
          {[
            { label: "All Patterns", value: "ALL" as const },
            { label: "VCP", value: "VCP" as const, desc: "Volatility Contraction" },
            { label: "Cup & Handle", value: "CNH" as const, desc: "CnH Setup" },
            { label: "Rectangular", value: "RECTANGULAR" as const, desc: "Rectangular Breakout" },
            { label: "ATH Breakout", value: "ATH_BREAKOUT" as const, desc: "All-Time High" },
          ].map((p) => {
            const active = (filters.pattern || "ALL") === p.value;
            return (
              <button
                key={p.value}
                onClick={() => setFilters((f) => ({ ...f, pattern: p.value, breakoutOnly: false, undervaluedOnly: false }))}
                title={p.desc}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: active ? "rgba(139,92,246,0.18)" : "var(--bg-card)",
                  border: `1px solid ${active ? "rgba(139,92,246,0.5)" : "var(--border)"}`,
                  color: active ? "#c4b5fd" : "var(--text-muted, #94a3b8)",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Sector</label>
              <select
                value={filters.sector || "All Sectors"}
                onChange={(e) => setFilters((f) => ({ ...f, sector: e.target.value }))}
                className="w-full bg-transparent text-sm text-slate-200 border rounded-lg px-2 py-1.5 outline-none"
                style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
              >
                <option value="All Sectors">All Sectors</option>
                {INDIAN_SECTORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Exchange</label>
              <select
                value={filters.exchange || "ALL"}
                onChange={(e) => setFilters((f) => ({ ...f, exchange: e.target.value as "NSE" | "BSE" | "ALL" }))}
                className="w-full text-sm text-slate-200 border rounded-lg px-2 py-1.5 outline-none"
                style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
              >
                <option value="ALL">All</option>
                <option value="NSE">NSE</option>
                <option value="BSE">BSE</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Min Price (₹)</label>
              <input
                type="number"
                placeholder="0"
                onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value ? +e.target.value : undefined }))}
                className="w-full text-sm text-slate-200 border rounded-lg px-2 py-1.5 outline-none"
                style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Max Price (₹)</label>
              <input
                type="number"
                placeholder="No limit"
                onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value ? +e.target.value : undefined }))}
                className="w-full text-sm text-slate-200 border rounded-lg px-2 py-1.5 outline-none"
                style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
              />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="breakout"
                checked={!!filters.breakoutOnly}
                onChange={(e) => setFilters((f) => ({ ...f, breakoutOnly: e.target.checked }))}
                className="accent-blue-500"
              />
              <label htmlFor="breakout" className="text-sm text-slate-300 cursor-pointer">Breakout only</label>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="undervalued"
                checked={!!filters.undervaluedOnly}
                onChange={(e) => setFilters((f) => ({ ...f, undervaluedOnly: e.target.checked }))}
                className="accent-blue-500"
              />
              <label htmlFor="undervalued" className="text-sm text-slate-300 cursor-pointer">Undervalued only</label>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="highgrowth"
                checked={!!filters.highGrowthOnly}
                onChange={(e) => setFilters((f) => ({ ...f, highGrowthOnly: e.target.checked }))}
                className="accent-blue-500"
              />
              <label htmlFor="highgrowth" className="text-sm text-slate-300 cursor-pointer">High growth only</label>
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by symbol, name, or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          />
        </div>

        {/* Sort buttons */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs text-slate-500">Sort:</span>
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => handleSort(o.value)}
              className={`flex items-center px-2.5 py-1 rounded-lg text-xs transition-colors ${
                filters.sortBy === o.value
                  ? "text-blue-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              style={{
                background: filters.sortBy === o.value ? "rgba(59,130,246,0.1)" : "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              {o.label} <SortIcon col={o.value} />
            </button>
          ))}
        </div>

        {/* Stock Table */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Change</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Volume</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Mkt Cap</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Score</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Signal</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tags</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b" style={{ borderColor: "var(--border)" }}>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <td key={j} className="px-4 py-3.5">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : displayed.map((s) => (
                      <tr
                        key={s.quote.symbol}
                        className="stock-row border-b cursor-pointer"
                        style={{ borderColor: "var(--border)" }}
                        onClick={() => (window.location.href = `/stock/${s.quote.symbol}`)}
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ background: "var(--bg-secondary)", color: "var(--accent-blue)" }}
                            >
                              {s.quote.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-100">{s.quote.symbol}</div>
                              <div className="text-xs text-slate-500">{s.quote.exchange} · {s.quote.sector}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-slate-200">
                          {formatCurrency(s.quote.price)}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getChangeBg(s.quote.changePercent)}`}>
                            {formatPercent(s.quote.changePercent)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right text-slate-400 hidden md:table-cell">
                          {formatVolume(s.quote.volume)}
                        </td>
                        <td className="px-4 py-3.5 text-right text-slate-400 hidden lg:table-cell">
                          {formatMarketCap(s.quote.marketCap)}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <ScoreBadge score={s.score.totalScore} />
                        </td>
                        <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                          <RecommendationBadge rec={s.score.recommendation} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            {s.isBreakout && (
                              <Badge variant="blue" className="text-xs">
                                <Flame className="w-2.5 h-2.5 mr-0.5" />Breakout
                              </Badge>
                            )}
                            {s.isUndervalued && (
                              <Badge variant="purple" className="text-xs">
                                <Shield className="w-2.5 h-2.5 mr-0.5" />Value
                              </Badge>
                            )}
                            {s.isHighGrowth && (
                              <Badge variant="green" className="text-xs">
                                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />Growth
                              </Badge>
                            )}
                            {s.patterns?.vcp?.detected && (
                              <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.3)" }}>VCP</span>
                            )}
                            {s.patterns?.cnh?.detected && (
                              <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}>CnH</span>
                            )}
                            {s.patterns?.rectangularBreakout?.detected && (
                              <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }}>Rect</span>
                            )}
                            {s.patterns?.athBreakout?.detected && (
                              <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                                {s.patterns.athBreakout.breakoutType === "FRESH_ATH" ? "ATH!" : "Near ATH"}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={(e) => toggleWatchlist(s, e)}
                            className="text-slate-500 hover:text-blue-400 transition-colors"
                            title={inWatchlist(s.quote.symbol) ? "Remove from watchlist" : "Add to watchlist"}
                          >
                            {inWatchlist(s.quote.symbol) ? (
                              <BookmarkCheck className="w-4 h-4 text-blue-400" />
                            ) : (
                              <BookmarkPlus className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          {!loading && displayed.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              No stocks match your filters. Try adjusting them.
            </div>
          )}
        </Card>

        {/* Load More */}
        {!loading && hasMore && (
          <div className="mt-4 text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-all"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              {loadingMore ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading more...
                </>
              ) : (
                `Load more stocks (${totalAvailable - stocks.length} remaining)`
              )}
            </button>
          </div>
        )}
        {!loading && !hasMore && stocks.length > 0 && (
          <p className="text-center text-xs text-slate-600 mt-3">
            All {stocks.length} analyzed stocks shown
          </p>
        )}
      </div>
    </AppLayout>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={null}>
      <ScannerContent />
    </Suspense>
  );
}
