"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("glass-card p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({
  variant = "default",
  className,
  children,
}: {
  variant?: "default" | "buy" | "watch" | "avoid" | "green" | "red" | "yellow" | "blue" | "purple";
  className?: string;
  children: ReactNode;
}) {
  const variantClasses = {
    default: "bg-slate-700/50 text-slate-300 border border-slate-600/50",
    buy: "badge-buy",
    watch: "badge-watch",
    avoid: "badge-avoid",
    green: "bg-emerald-400/15 text-emerald-400 border border-emerald-400/20",
    red: "bg-red-400/15 text-red-400 border border-red-400/20",
    yellow: "bg-yellow-400/15 text-yellow-400 border border-yellow-400/20",
    blue: "bg-blue-400/15 text-blue-400 border border-blue-400/20",
    purple: "bg-purple-400/15 text-purple-400 border border-purple-400/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 70 ? "score-high" : score >= 50 ? "score-medium" : "score-low";
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold", cls)}>
      {score}
    </span>
  );
}

export function RecommendationBadge({ rec }: { rec: "BUY" | "WATCHLIST" | "AVOID" }) {
  const variantMap = { BUY: "buy" as const, WATCHLIST: "watch" as const, AVOID: "avoid" as const };
  return <Badge variant={variantMap[rec]}>{rec}</Badge>;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded", className)} />;
}

export function LiveIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
      <span className="text-xs text-emerald-400 font-medium">LIVE</span>
    </div>
  );
}

export function TrendArrow({ value, showPercent = true }: { value: number; showPercent?: boolean }) {
  if (value > 0) {
    return (
      <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
        ▲ {showPercent ? `${Math.abs(value).toFixed(2)}%` : ""}
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="text-red-400 font-semibold flex items-center gap-0.5">
        ▼ {showPercent ? `${Math.abs(value).toFixed(2)}%` : ""}
      </span>
    );
  }
  return <span className="text-slate-400">—</span>;
}

export function ProgressBar({
  value,
  max = 100,
  color = "blue",
  className,
}: {
  value: number;
  max?: number;
  color?: "blue" | "green" | "red" | "yellow" | "purple";
  className?: string;
}) {
  const percent = Math.min(100, (value / max) * 100);
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  return (
    <div className={cn("progress-bar", className)}>
      <div
        className={cn("progress-fill", colorClasses[color])}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px bg-slate-800", className)} />;
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className={cn("border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin", sizes[size])} />
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="glass-card p-4 border-red-500/20 bg-red-500/5">
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
  icon,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon && <div className="text-blue-400">{icon}</div>}
        <div>
          <h2 className="text-base font-semibold text-slate-100">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export { default as StockSearchInput } from "./StockSearchInput";
