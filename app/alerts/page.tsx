"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { Card, SectionHeader, Badge, StockSearchInput } from "@/components/ui";
import { Alert } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Bell, Plus, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react";
import { useAlerts } from "@/lib/store";
import toast from "react-hot-toast";
import { INDIAN_STOCKS } from "@/lib/data/indian-stocks";

const ALERT_TYPES: { value: Alert["type"]; label: string }[] = [
  { value: "PRICE_ABOVE", label: "Price rises above" },
  { value: "PRICE_BELOW", label: "Price falls below" },
  { value: "VOLUME_SPIKE", label: "Volume spike (ratio)" },
  { value: "BREAKOUT", label: "Breakout detected" },
];

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function AlertsContent() {
  const searchParams = useSearchParams();
  const prefilledSymbol = searchParams.get("symbol") || "";

  const { alerts, add, remove, toggle } = useAlerts();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    symbol: prefilledSymbol.toUpperCase(),
    type: "PRICE_ABOVE" as Alert["type"],
    targetValue: "",
  });

  useEffect(() => {
    if (prefilledSymbol) setShowAdd(true);
  }, [prefilledSymbol]);

  const handleAdd = () => {
    if (!form.symbol || !form.targetValue) {
      toast.error("Fill in all fields");
      return;
    }
    const stockMeta = INDIAN_STOCKS.find((s) => s.symbol === form.symbol.toUpperCase().trim());
    const symbol = form.symbol.toUpperCase().trim();
    const targetValue = parseFloat(form.targetValue);

    const alertType = ALERT_TYPES.find((t) => t.value === form.type);
    const condition = `${alertType?.label} ${targetValue}`;

    add({
      id: generateId(),
      symbol,
      name: stockMeta?.name || symbol,
      type: form.type,
      condition,
      targetValue,
      currentValue: 0,
      triggered: false,
      createdAt: Date.now(),
    });

    toast.success(`Alert set for ${symbol}`);
    setForm({ symbol: "", type: "PRICE_ABOVE", targetValue: "" });
    setShowAdd(false);
  };

  const handleRemove = (id: string) => {
    remove(id);
    toast.success("Alert removed");
  };

  const alertsBySymbol = alerts.reduce<Record<string, Alert[]>>((acc, a) => {
    acc[a.symbol] = acc[a.symbol] || [];
    acc[a.symbol].push(a);
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              Alerts
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">{alerts.length} alert{alerts.length !== 1 ? "s" : ""} configured</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          >
            <Plus className="w-4 h-4" /> New Alert
          </button>
        </div>

        {/* Info */}
        <div className="mb-4 p-3 rounded-xl flex items-start gap-3"
          style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
          <Bell className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-300/70">
            Alerts are stored locally in your browser. They are currently for reference only — live push notifications require a backend integration.
          </p>
        </div>

        {/* Add modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
            <Card className="w-full max-w-sm mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100">New Alert</h3>
                <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Stock (search by name or symbol)</label>
                  <StockSearchInput
                    value={form.symbol}
                    onChange={(symbol) => setForm((f) => ({ ...f, symbol }))}
                    placeholder="e.g. Reliance Power, RPOWER…"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Alert Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Alert["type"] }))}
                    className="w-full text-sm text-slate-200 border rounded-lg px-3 py-2 outline-none"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                  >
                    {ALERT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">
                    {form.type === "VOLUME_SPIKE" ? "Volume Ratio (e.g. 2 = 2x avg)" : "Target Price (₹)"}
                  </label>
                  <input
                    type="number"
                    value={form.targetValue}
                    onChange={(e) => setForm((f) => ({ ...f, targetValue: e.target.value }))}
                    placeholder={form.type === "VOLUME_SPIKE" ? "2.0" : "2500"}
                    min="0"
                    step="0.01"
                    className="w-full text-sm text-slate-200 border rounded-lg px-3 py-2 outline-none"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowAdd(false)}
                    className="flex-1 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    className="flex-1 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                  >
                    Set Alert
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {alerts.length === 0 ? (
          <Card className="text-center py-16">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No alerts configured</p>
            <p className="text-slate-600 text-sm mt-1">Set price alerts to track key levels for any stock.</p>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white mx-auto"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              <Plus className="w-4 h-4" /> New Alert
            </button>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(alertsBySymbol).map(([symbol, symbolAlerts]) => (
              <Card key={symbol}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--bg-secondary)", color: "var(--accent-blue)" }}>
                    {symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100">{symbol}</div>
                    <div className="text-xs text-slate-500">{symbolAlerts[0].name}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {symbolAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${alert.triggered ? "opacity-50" : ""}`}
                      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                    >
                      <Bell className={`w-4 h-4 flex-shrink-0 ${alert.triggered ? "text-slate-600" : "text-yellow-400"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-200">{alert.condition}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {alert.type.includes("PRICE") ? formatCurrency(alert.targetValue) : `${alert.targetValue}x`}
                          {" · "}
                          {new Date(alert.createdAt).toLocaleDateString("en-IN")}
                        </div>
                      </div>
                      <Badge variant={alert.triggered ? "default" : "yellow"}>
                        {alert.triggered ? "Triggered" : "Active"}
                      </Badge>
                      <button
                        onClick={() => toggle(alert.id)}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                        title={alert.triggered ? "Mark active" : "Mark triggered"}
                      >
                        {alert.triggered ? (
                          <ToggleLeft className="w-5 h-5" />
                        ) : (
                          <ToggleRight className="w-5 h-5 text-emerald-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleRemove(alert.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function AlertsPage() {
  return (
    <Suspense fallback={null}>
      <AlertsContent />
    </Suspense>
  );
}
