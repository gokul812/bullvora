"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Card,
  SectionHeader,
  RecommendationBadge,
  ScoreBadge,
  Skeleton,
} from "@/components/ui";
import { WatchlistItem, StockQuote } from "@/lib/types";
import {
  formatCurrency,
  formatPercent,
  getChangeBg,
} from "@/lib/utils";
import { BookmarkCheck, Trash2, Bell, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useWatchlist } from "@/lib/store";
import toast from "react-hot-toast";

interface WatchlistStockData {
  item: WatchlistItem;
  quote: StockQuote | null;
  score: number;
  recommendation: "BUY" | "WATCHLIST" | "AVOID";
  loading: boolean;
  error: boolean;
}

export default function WatchlistPage() {
  const { items, remove } = useWatchlist();
  const [stocks, setStocks] = useState<WatchlistStockData[]>([]);

  useEffect(() => {
    setStocks(
      items.map((item) => ({
        item,
        quote: null,
        score: 0,
        recommendation: "WATCHLIST",
        loading: true,
        error: false,
      }))
    );

    items.forEach((item, idx) => {
      fetch(`/api/stock/${encodeURIComponent(item.symbol)}`)
        .then((r) => r.json())
        .then((d) => {
          setStocks((prev) =>
            prev.map((s, i) =>
              i === idx
                ? { ...s, quote: d.quote || null, score: d.score?.totalScore || 0, recommendation: d.score?.recommendation || "WATCHLIST", loading: false }
                : s
            )
          );
        })
        .catch(() => {
          setStocks((prev) =>
            prev.map((s, i) => (i === idx ? { ...s, loading: false, error: true } : s))
          );
        });
    });
  }, [items.length]);

  const handleRemove = (symbol: string) => {
    remove(symbol);
    toast.success(`Removed ${symbol} from watchlist`);
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-blue-400" />
              Watchlist
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">{items.length} stock{items.length !== 1 ? "s" : ""} tracked</p>
          </div>
        </div>

        {items.length === 0 ? (
          <Card className="text-center py-16">
            <BookmarkCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Your watchlist is empty</p>
            <p className="text-slate-600 text-sm mt-1">
              Add stocks from the{" "}
              <Link href="/scanner" className="text-blue-400 hover:underline">Scanner</Link>{" "}
              or stock detail pages.
            </p>
          </Card>
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Change</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Score</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Signal</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Added</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map(({ item, quote, score, recommendation, loading, error }) => (
                    <tr
                      key={item.symbol}
                      className="stock-row border-b"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: "var(--bg-secondary)", color: "var(--accent-blue)" }}
                          >
                            {item.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <Link href={`/stock/${item.symbol}`} className="font-semibold text-slate-100 hover:text-blue-400 transition-colors flex items-center gap-1">
                              {item.symbol} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                            </Link>
                            <div className="text-xs text-slate-500">{item.name} · {item.exchange}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-slate-200">
                        {loading ? <Skeleton className="h-4 w-20 ml-auto" /> : error ? "—" : formatCurrency(quote?.price || 0)}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {loading ? (
                          <Skeleton className="h-4 w-16 ml-auto" />
                        ) : error ? (
                          "—"
                        ) : (
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getChangeBg(quote?.changePercent || 0)}`}>
                            {formatPercent(quote?.changePercent || 0)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right hidden md:table-cell">
                        {loading ? <Skeleton className="h-6 w-10 ml-auto" /> : error ? "—" : <ScoreBadge score={score} />}
                      </td>
                      <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                        {loading ? <Skeleton className="h-4 w-16 ml-auto" /> : error ? "—" : <RecommendationBadge rec={recommendation} />}
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs text-slate-500 hidden lg:table-cell">
                        {new Date(item.addedAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/alerts?symbol=${item.symbol}`}
                            className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:text-yellow-400 transition-colors"
                            title="Set alert"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleRemove(item.symbol)}
                            className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:text-red-400 transition-colors"
                            title="Remove from watchlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
