import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1e12) return `₹${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `₹${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`;
    if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)}L`;
    return `₹${value.toFixed(2)}`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number | null | undefined, decimals = 2): string {
  if (value == null || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number | null | undefined, decimals = 2): string {
  if (value == null || isNaN(value)) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatVolume(value: number): string {
  if (value >= 1e7) return `${(value / 1e7).toFixed(2)}Cr`;
  if (value >= 1e5) return `${(value / 1e5).toFixed(2)}L`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

export function formatMarketCap(value: number): string {
  if (value >= 1e12) return `₹${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `₹${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`;
  return `₹${formatNumber(value)}`;
}

export function getPriceCategory(price: number): string {
  if (price < 100) return "Under ₹100";
  if (price < 200) return "₹100–₹200";
  if (price < 500) return "₹200–₹500";
  if (price < 1000) return "₹500–₹1000";
  if (price < 2000) return "₹1000–₹2000";
  return "₹2000+";
}

export function getPriceCategoryKey(price: number): string {
  if (price < 100) return "under_100";
  if (price < 200) return "100_200";
  if (price < 500) return "200_500";
  if (price < 1000) return "500_1000";
  if (price < 2000) return "1000_2000";
  return "2000_plus";
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}

export function getScoreClass(score: number): string {
  if (score >= 70) return "score-high";
  if (score >= 50) return "score-medium";
  return "score-low";
}

export function getRecommendation(score: number): "BUY" | "WATCHLIST" | "AVOID" {
  if (score >= 65) return "BUY";
  if (score >= 45) return "WATCHLIST";
  return "AVOID";
}

export function getChangeColor(change: number): string {
  if (change > 0) return "text-emerald-400";
  if (change < 0) return "text-red-400";
  return "text-slate-400";
}

export function getChangeBg(change: number): string {
  if (change > 0) return "bg-emerald-400/10 text-emerald-400";
  if (change < 0) return "bg-red-400/10 text-red-400";
  return "bg-slate-400/10 text-slate-400";
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}
