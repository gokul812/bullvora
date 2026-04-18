"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, RefreshCw, Settings, X } from "lucide-react";
import { INDIAN_STOCKS } from "@/lib/data/indian-stocks";

export default function Header() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof INDIAN_STOCKS>([]);
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length < 1) { setResults([]); return; }
    const lower = q.toLowerCase();
    const found = INDIAN_STOCKS.filter(
      (s) =>
        s.symbol.toLowerCase().includes(lower) ||
        s.name.toLowerCase().includes(lower) ||
        s.sector.toLowerCase().includes(lower)
    ).slice(0, 8);
    setResults(found);
  };

  const goToStock = (symbol: string) => {
    setQuery("");
    setResults([]);
    setShowSearch(false);
    router.push(`/stock/${symbol}`);
  };

  return (
    <header
      className="fixed top-0 left-60 right-0 h-14 flex items-center px-5 gap-4 z-30"
      style={{ background: "rgba(15, 22, 35, 0.95)", borderBottom: "1px solid var(--border)", backdropFilter: "blur(12px)" }}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search stocks (RELIANCE, TCS, HDFC...)"
            value={query}
            onChange={(e) => { handleSearch(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(""); setResults([]); }} className="text-slate-500 hover:text-slate-300">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {showSearch && results.length > 0 && (
          <div
            className="absolute top-full mt-1 w-full rounded-lg overflow-hidden shadow-xl z-50"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-bright)" }}
          >
            {results.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => goToStock(stock.symbol)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: "var(--bg-secondary)", color: "var(--accent-blue)" }}>
                  {stock.symbol.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-200 truncate">{stock.symbol}</div>
                  <div className="text-xs text-slate-500 truncate">{stock.name}</div>
                </div>
                <div className="text-xs text-slate-600">{stock.exchange}</div>
              </button>
            ))}
          </div>
        )}

        {showSearch && query.length > 0 && results.length === 0 && (
          <div
            className="absolute top-full mt-1 w-full rounded-lg p-3 shadow-xl z-50"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-bright)" }}
          >
            <p className="text-sm text-slate-500 text-center">No stocks found</p>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => window.location.reload()}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors relative">
          <Bell className="w-4 h-4" />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-400" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Backdrop for search */}
      {showSearch && (query.length > 0 || results.length > 0) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowSearch(false); setResults([]); }} />
      )}
    </header>
  );
}
