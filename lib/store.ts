import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WatchlistItem, PortfolioHolding, Alert } from "@/lib/types";

interface WatchlistStore {
  items: WatchlistItem[];
  add: (item: WatchlistItem) => void;
  remove: (symbol: string) => void;
  has: (symbol: string) => boolean;
  update: (symbol: string, updates: Partial<WatchlistItem>) => void;
}

export const useWatchlist = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          if (s.items.find((i) => i.symbol === item.symbol)) return s;
          return { items: [...s.items, item] };
        }),
      remove: (symbol) =>
        set((s) => ({ items: s.items.filter((i) => i.symbol !== symbol) })),
      has: (symbol) => !!get().items.find((i) => i.symbol === symbol),
      update: (symbol, updates) =>
        set((s) => ({
          items: s.items.map((i) => (i.symbol === symbol ? { ...i, ...updates } : i)),
        })),
    }),
    { name: "bullvora-watchlist" }
  )
);

interface PortfolioStore {
  holdings: PortfolioHolding[];
  add: (holding: PortfolioHolding) => void;
  remove: (symbol: string) => void;
  update: (symbol: string, updates: Partial<PortfolioHolding>) => void;
}

export const usePortfolio = create<PortfolioStore>()(
  persist(
    (set) => ({
      holdings: [],
      add: (holding) =>
        set((s) => {
          const existing = s.holdings.find((h) => h.symbol === holding.symbol);
          if (existing) {
            const totalQty = existing.quantity + holding.quantity;
            const totalInvested = existing.investedAmount + holding.investedAmount;
            return {
              holdings: s.holdings.map((h) =>
                h.symbol === holding.symbol
                  ? {
                      ...h,
                      quantity: totalQty,
                      avgBuyPrice: totalInvested / totalQty,
                      investedAmount: totalInvested,
                    }
                  : h
              ),
            };
          }
          return { holdings: [...s.holdings, holding] };
        }),
      remove: (symbol) =>
        set((s) => ({ holdings: s.holdings.filter((h) => h.symbol !== symbol) })),
      update: (symbol, updates) =>
        set((s) => ({
          holdings: s.holdings.map((h) =>
            h.symbol === symbol ? { ...h, ...updates } : h
          ),
        })),
    }),
    { name: "bullvora-portfolio" }
  )
);

interface AlertStore {
  alerts: Alert[];
  add: (alert: Alert) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
}

export const useAlerts = create<AlertStore>()(
  persist(
    (set) => ({
      alerts: [],
      add: (alert) => set((s) => ({ alerts: [...s.alerts, alert] })),
      remove: (id) =>
        set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
      toggle: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) =>
            a.id === id ? { ...a, triggered: !a.triggered } : a
          ),
        })),
    }),
    { name: "bullvora-alerts" }
  )
);
