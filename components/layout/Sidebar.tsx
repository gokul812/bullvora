"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  BookmarkCheck,
  BriefcaseBusiness,
  Bell,
  TrendingUp,
  ChevronRight,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scanner", label: "Stock Scanner", icon: Search },
  { href: "/recommendations", label: "AI Picks", icon: Zap },
  { href: "/watchlist", label: "Watchlist", icon: BookmarkCheck },
  { href: "/portfolio", label: "Portfolio", icon: BriefcaseBusiness },
  { href: "/alerts", label: "Alerts", icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 flex flex-col z-40" style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border)" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-base font-bold gradient-text-blue">Bullvora</div>
          <div className="text-xs text-slate-500">Indian Market AI</div>
        </div>
      </div>

      {/* Market Status */}
      <div className="mx-4 my-3 px-3 py-2 rounded-lg" style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.15)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
            <span className="text-xs font-medium text-emerald-400">NSE Open</span>
          </div>
          <span className="text-xs text-slate-500">9:15–15:30</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="mb-2">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-1">Market</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all duration-150 group",
                  isActive
                    ? "nav-item-active"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-blue-400" : "")} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-blue-400" />}
              </Link>
            );
          })}
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-1">Analysis</p>
          <Link
            href="/scanner?category=breakout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Breakout Stocks</span>
          </Link>
          <Link
            href="/scanner?filter=undervalued"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
          >
            <Shield className="w-4 h-4" />
            <span>Undervalued</span>
          </Link>
        </div>
      </nav>

      {/* Disclaimer */}
      <div className="mx-3 mb-3 p-3 rounded-lg" style={{ background: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245, 158, 11, 0.15)" }}>
        <p className="text-xs text-yellow-500/80 leading-relaxed">
          ⚠️ Not financial advice. DYOR before investing.
        </p>
      </div>
    </aside>
  );
}
