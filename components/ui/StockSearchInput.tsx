"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { INDIAN_STOCKS } from "@/lib/data/indian-stocks";
import { NSEStock } from "@/lib/types";

interface Props {
  value: string;
  onChange: (symbol: string, meta?: NSEStock) => void;
  placeholder?: string;
}

export default function StockSearchInput({ value, onChange, placeholder = "Search symbol or name…" }: Props) {
  const [query, setQuery]       = useState(value);
  const [results, setResults]   = useState<NSEStock[]>([]);
  const [open, setOpen]         = useState(false);
  const [selected, setSelected] = useState<NSEStock | null>(null);
  const containerRef            = useRef<HTMLDivElement>(null);

  // Keep query in sync if parent resets value
  useEffect(() => {
    if (!value) { setQuery(""); setSelected(null); }
  }, [value]);

  const handleInput = (raw: string) => {
    const q = raw.toUpperCase();
    setQuery(q);
    setSelected(null);

    if (q.length < 1) { setResults([]); setOpen(false); return; }

    const lower = q.toLowerCase();
    const matched = INDIAN_STOCKS.filter(
      (s) =>
        s.symbol.toLowerCase().startsWith(lower) ||
        s.name.toLowerCase().includes(lower) ||
        s.symbol.toLowerCase().includes(lower)
    ).slice(0, 10);

    setResults(matched);
    setOpen(true);

    // Also propagate raw text so user can type any symbol not in list
    onChange(q);
  };

  const pick = (stock: NSEStock) => {
    setQuery(stock.symbol);
    setSelected(stock);
    setResults([]);
    setOpen(false);
    onChange(stock.symbol, stock);
  };

  const clear = () => {
    setQuery("");
    setSelected(null);
    setResults([]);
    setOpen(false);
    onChange("");
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2"
        style={{ background: "var(--bg-secondary)", borderColor: open ? "var(--accent-blue)" : "var(--border)" }}>
        <Search className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => query.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none uppercase"
        />
        {query && (
          <button onClick={clear} className="text-slate-500 hover:text-slate-300 flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Selected meta pill */}
      {selected && (
        <p className="text-xs text-emerald-400 mt-1 ml-1">{selected.name} · {selected.exchange} · {selected.sector}</p>
      )}
      {/* Unknown symbol hint */}
      {!selected && query.length >= 2 && results.length === 0 && (
        <p className="text-xs text-slate-500 mt-1 ml-1">
          Not in suggestions — will try to fetch <span className="text-blue-400">{query}.NS</span> from market
        </p>
      )}

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-2xl z-50"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-bright)" }}>
          {results.map((stock) => (
            <button
              key={stock.symbol}
              onMouseDown={() => pick(stock)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 text-left transition-colors"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: "var(--bg-secondary)", color: "var(--accent-blue)" }}>
                {stock.symbol.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-200">{stock.symbol}</div>
                <div className="text-xs text-slate-500 truncate">{stock.name}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-slate-500">{stock.exchange}</div>
                <div className="text-xs text-slate-600">{stock.sector}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
