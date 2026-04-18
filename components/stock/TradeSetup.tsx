"use client";

import { TradeSetup } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  Target,
  ShieldAlert,
  TrendingUp,
  Clock,
  Zap,
  AlertTriangle,
  ArrowDownRight,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui";

interface Props {
  setup: TradeSetup;
  currentPrice: number;
}

const TRADE_TYPE_LABELS: Record<TradeSetup["tradeType"], { label: string; color: string; icon: React.ReactNode }> = {
  BREAKOUT: { label: "Breakout Trade", color: "text-blue-400", icon: <Zap className="w-3.5 h-3.5" /> },
  PULLBACK_BUY: { label: "Pullback Buy", color: "text-emerald-400", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  REVERSAL: { label: "Reversal Setup", color: "text-yellow-400", icon: <ArrowDownRight className="w-3.5 h-3.5" /> },
  MOMENTUM: { label: "Momentum Entry", color: "text-purple-400", icon: <TrendingUp className="w-3.5 h-3.5" /> },
};

const TIMEFRAME_LABELS: Record<TradeSetup["timeframe"], { label: string; desc: string }> = {
  SWING: { label: "Swing Trade", desc: "1–3 weeks holding" },
  POSITIONAL: { label: "Positional", desc: "1–3 months holding" },
  LONG_TERM: { label: "Long Term", desc: "6–18 months holding" },
};

export default function TradeSetupCard({ setup, currentPrice }: Props) {
  const tradeInfo = TRADE_TYPE_LABELS[setup.tradeType];
  const timeInfo = TIMEFRAME_LABELS[setup.timeframe];

  const pct = (val: number) => {
    const diff = ((val - setup.entryPrice) / setup.entryPrice) * 100;
    return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
  };

  const isAtEntry = currentPrice >= setup.entryZoneLow && currentPrice <= setup.entryZoneHigh;

  return (
    <Card className="p-0 overflow-hidden">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-slate-100 text-sm">Trade Setup</span>
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${tradeInfo.color}`}
            style={{ background: "rgba(255,255,255,0.05)" }}>
            {tradeInfo.icon} {tradeInfo.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-medium text-slate-300">{timeInfo.label}</span>
          <span className="text-slate-600">·</span>
          <span>{timeInfo.desc}</span>
        </div>
      </div>

      <div className="p-4">
        {/* Entry Zone banner */}
        {isAtEntry && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <p className="text-xs text-emerald-300 font-medium">Price is currently in the entry zone — valid setup</p>
          </div>
        )}

        {/* Main price levels */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Entry Zone */}
          <div className="col-span-2 rounded-xl p-3" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Entry Zone
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold font-mono text-emerald-300">{formatCurrency(setup.entryPrice)}</div>
                <div className="text-xs text-slate-500 mt-0.5">Ideal entry</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-slate-300">{formatCurrency(setup.entryZoneLow)} – {formatCurrency(setup.entryZoneHigh)}</div>
                <div className="text-xs text-slate-500 mt-0.5">Entry zone range</div>
              </div>
            </div>
          </div>

          {/* Stop Loss */}
          <div className="rounded-xl p-3" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <div className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Stop Loss
            </div>
            <div className="text-base font-bold font-mono text-red-300">{formatCurrency(setup.stopLoss)}</div>
            <div className="text-xs text-red-400/70 mt-0.5">–{setup.stopLossPercent.toFixed(1)}% from entry</div>
            <div className="text-xs text-slate-600 mt-1">ATR-based: {formatCurrency(setup.atrStopLoss)}</div>
          </div>

          {/* Invalidation */}
          <div className="rounded-xl p-3" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)" }}>
            <div className="text-xs font-semibold text-yellow-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Invalidation
            </div>
            <div className="text-base font-bold font-mono text-yellow-300">{formatCurrency(setup.invalidationLevel)}</div>
            <div className="text-xs text-yellow-400/70 mt-0.5">Exit if daily close below</div>
          </div>
        </div>

        {/* Targets */}
        <div className="space-y-2 mb-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Profit Targets</div>
          {[
            { label: "T1 — Quick profit (1:1.5 R:R)", value: setup.target1, rr: "1:1.5", color: "emerald" },
            { label: "T2 — Main target (1:2.5 R:R)", value: setup.target2, rr: "1:2.5", color: "blue" },
            { label: "T3 — Full target (1:4 R:R)", value: setup.target3, rr: "1:4", color: "purple" },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
              <div className={`w-1.5 h-8 rounded-full flex-shrink-0 bg-${t.color}-400`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-400">{t.label}</div>
              </div>
              <div className="text-right">
                <div className={`font-mono font-bold text-sm text-${t.color}-300`}>{formatCurrency(t.value)}</div>
                <div className="text-xs text-slate-500">{pct(t.value)}</div>
              </div>
              <div className={`text-xs font-bold px-2 py-0.5 rounded text-${t.color}-400`}
                style={{ background: `rgba(var(--${t.color}-rgb, 59,130,246), 0.1)` }}>
                {t.rr}
              </div>
            </div>
          ))}
        </div>

        {/* R:R Summary */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-0.5">Risk (SL hit)</div>
            <div className="text-sm font-bold text-red-400">–{setup.maxLossPercent.toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-0.5">R:R to T2</div>
            <div className={`text-sm font-bold ${setup.riskRewardT2 >= 2 ? "text-emerald-400" : "text-yellow-400"}`}>
              1:{setup.riskRewardT2}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-0.5">Max gain (T3)</div>
            <div className="text-sm font-bold text-emerald-400">{pct(setup.target3)}</div>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-3 text-center">
          ⚠ Always place stop loss before entry. Never risk more than 2% of capital per trade.
        </p>
      </div>
    </Card>
  );
}
