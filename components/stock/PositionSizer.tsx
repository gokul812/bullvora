"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { Calculator, IndianRupee, Percent, TrendingDown, Package } from "lucide-react";

interface Props {
  entryPrice: number;
  stopLoss: number;
}

export default function PositionSizer({ entryPrice, stopLoss }: Props) {
  const [accountSize, setAccountSize] = useState("500000");
  const [riskPercent, setRiskPercent] = useState("2");

  const account = parseFloat(accountSize) || 0;
  const risk = parseFloat(riskPercent) || 2;

  const riskAmount = (account * risk) / 100;
  const slDistance = Math.max(entryPrice - stopLoss, 0.01);
  const slPercent = (slDistance / entryPrice) * 100;
  const shares = Math.floor(riskAmount / slDistance);
  const investment = shares * entryPrice;
  const maxLoss = shares * slDistance;
  const portfolioWeight = account > 0 ? (investment / account) * 100 : 0;

  const isValid = shares > 0 && investment > 0 && investment <= account;

  return (
    <Card className="p-0 overflow-hidden">
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.06))", borderBottom: "1px solid var(--border)" }}
      >
        <Calculator className="w-4 h-4 text-emerald-400" />
        <span className="font-semibold text-slate-100 text-sm">Position Sizing Calculator</span>
        <span className="text-xs text-slate-500 ml-auto">Risk-based sizing</span>
      </div>

      <div className="p-4">
        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-500 flex items-center gap-1 mb-1">
              <IndianRupee className="w-3 h-3" /> Portfolio Size (₹)
            </label>
            <input
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(e.target.value)}
              className="w-full text-sm font-mono text-slate-200 border rounded-lg px-3 py-2 outline-none"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
              placeholder="500000"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 flex items-center gap-1 mb-1">
              <Percent className="w-3 h-3" /> Risk per Trade (%)
            </label>
            <input
              type="number"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
              min="0.5"
              max="5"
              step="0.5"
              className="w-full text-sm font-mono text-slate-200 border rounded-lg px-3 py-2 outline-none"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
            />
          </div>
        </div>

        {/* Risk presets */}
        <div className="flex gap-1.5 mb-4">
          {[["0.5", "Conservative"], ["1", "Moderate"], ["2", "Standard"], ["3", "Aggressive"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setRiskPercent(val)}
              className={`flex-1 py-1 rounded text-xs transition-colors ${
                riskPercent === val ? "text-blue-300 font-semibold" : "text-slate-500 hover:text-slate-300"
              }`}
              style={{
                background: riskPercent === val ? "rgba(59,130,246,0.15)" : "var(--bg-secondary)",
                border: `1px solid ${riskPercent === val ? "rgba(59,130,246,0.3)" : "var(--border)"}`,
              }}
            >
              {val}% {label}
            </button>
          ))}
        </div>

        {/* Reference prices */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="flex justify-between px-3 py-2 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <span className="text-slate-500">Entry Price</span>
            <span className="font-mono text-slate-200">{formatCurrency(entryPrice)}</span>
          </div>
          <div className="flex justify-between px-3 py-2 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <span className="text-slate-500">Stop Loss</span>
            <span className="font-mono text-red-400">{formatCurrency(stopLoss)}</span>
          </div>
          <div className="flex justify-between px-3 py-2 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <span className="text-slate-500">SL Distance</span>
            <span className="font-mono text-slate-300">{formatCurrency(slDistance)} ({slPercent.toFixed(1)}%)</span>
          </div>
          <div className="flex justify-between px-3 py-2 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <span className="text-slate-500">Max Risk ₹</span>
            <span className="font-mono text-red-400">{formatCurrency(riskAmount)}</span>
          </div>
        </div>

        {/* Output */}
        <div
          className="rounded-xl p-4"
          style={{
            background: isValid ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.04)",
            border: `1px solid ${isValid ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.15)"}`,
          }}
        >
          {!isValid ? (
            <p className="text-sm text-red-400 text-center py-2">
              {shares === 0 ? "Adjust inputs — stop loss too close to entry" :
               investment > account ? "Position exceeds portfolio size" :
               "Enter valid portfolio size"}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-0.5 flex items-center gap-1">
                  <Package className="w-3 h-3" /> Shares to Buy
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-300">{shares.toLocaleString("en-IN")}</div>
                <div className="text-xs text-slate-500 mt-0.5">shares of stock</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" /> Capital to Deploy
                </div>
                <div className="text-2xl font-bold font-mono text-blue-300">{formatCurrency(investment)}</div>
                <div className="text-xs text-slate-500 mt-0.5">{portfolioWeight.toFixed(1)}% of portfolio</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> Max Loss (if SL hit)
                </div>
                <div className="text-lg font-bold font-mono text-red-400">{formatCurrency(maxLoss)}</div>
                <div className="text-xs text-slate-500 mt-0.5">{risk}% of portfolio</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Portfolio Allocation</div>
                <div className="text-lg font-bold font-mono text-slate-200">{portfolioWeight.toFixed(1)}%</div>
                <div className={`text-xs mt-0.5 ${portfolioWeight > 20 ? "text-yellow-400" : "text-slate-500"}`}>
                  {portfolioWeight > 20 ? "⚠ High concentration" : "Diversification safe"}
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-600 mt-3 text-center leading-relaxed">
          Formula: Shares = (Portfolio × Risk%) ÷ Stop-Loss-Distance<br />
          Recommended: max 2% risk per trade, max 20% in a single stock
        </p>
      </div>
    </Card>
  );
}
