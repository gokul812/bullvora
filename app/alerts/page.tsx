"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { Card, SectionHeader, Badge, StockSearchInput } from "@/components/ui";
import { Alert } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  Bell, BellOff, Plus, Trash2, X, ToggleLeft, ToggleRight,
  CheckCircle, AlertCircle, RefreshCw, Wifi,
} from "lucide-react";
import { useAlerts } from "@/lib/store";
import toast from "react-hot-toast";
import { INDIAN_STOCKS } from "@/lib/data/indian-stocks";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

const ALERT_TYPES: { value: Alert["type"]; label: string }[] = [
  { value: "PRICE_ABOVE", label: "Price rises above" },
  { value: "PRICE_BELOW", label: "Price falls below" },
  { value: "VOLUME_SPIKE", label: "Volume spike (ratio)" },
  { value: "BREAKOUT", label: "Breakout detected" },
];

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

type PushStatus = "idle" | "requesting" | "subscribed" | "denied" | "unsupported" | "syncing";

function AlertsContent() {
  const searchParams = useSearchParams();
  const prefilledSymbol = searchParams.get("symbol") || "";

  const { alerts, add, remove, toggle } = useAlerts();
  const [showAdd, setShowAdd] = useState(false);
  const [pushStatus, setPushStatus] = useState<PushStatus>("idle");
  const [syncStatus, setSyncStatus] = useState<"idle" | "ok" | "error" | "no_storage">("idle");
  const [form, setForm] = useState({
    symbol: prefilledSymbol.toUpperCase(),
    type: "PRICE_ABOVE" as Alert["type"],
    targetValue: "",
  });

  useEffect(() => {
    if (prefilledSymbol) setShowAdd(true);
  }, [prefilledSymbol]);

  // Check current push permission state on mount
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPushStatus("unsupported");
      return;
    }
    const perm = Notification.permission;
    if (perm === "denied") { setPushStatus("denied"); return; }

    // Check if already subscribed
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription()
    ).then((sub) => {
      if (sub) setPushStatus("subscribed");
    }).catch(() => {});
  }, []);

  // ─── Browser-side price polling (works while tab is open) ──────────────────
  // Checks active alerts every 2 minutes; fires native notifications if triggered.
  useEffect(() => {
    if (pushStatus !== "subscribed") return;
    if (Notification.permission !== "granted") return;

    const checkPrices = async () => {
      const active = alerts.filter((a) => !a.triggered);
      if (active.length === 0) return;

      const symbols = [...new Set(active.map((a) => {
        const meta = INDIAN_STOCKS.find((s) => s.symbol === a.symbol);
        return meta?.yahooSymbol || `${a.symbol}.NS`;
      }))];

      for (const yahooSymbol of symbols) {
        try {
          const res = await fetch(`/api/stock/${encodeURIComponent(yahooSymbol)}`);
          if (!res.ok) continue;
          const data = await res.json();
          const price: number = data?.quote?.price;
          const volume: number = data?.quote?.volume;
          const avgVolume: number = data?.quote?.avgVolume || volume;
          const volRatio = volume / avgVolume;
          if (!price) continue;

          const symbol = yahooSymbol.replace(/\.(NS|BO)$/, "");
          for (const alert of active.filter((a) => a.symbol === symbol)) {
            let hit = false;
            let body = "";
            if (alert.type === "PRICE_ABOVE" && price >= alert.targetValue) {
              hit = true;
              body = `${symbol} is ₹${price.toFixed(2)} — above your target of ₹${alert.targetValue}`;
            } else if (alert.type === "PRICE_BELOW" && price <= alert.targetValue) {
              hit = true;
              body = `${symbol} is ₹${price.toFixed(2)} — below your target of ₹${alert.targetValue}`;
            } else if (alert.type === "VOLUME_SPIKE" && volRatio >= alert.targetValue) {
              hit = true;
              body = `${symbol} volume is ${volRatio.toFixed(1)}x average`;
            }
            if (hit) {
              toggle(alert.id); // mark triggered in local store
              new Notification(`Bullvora Alert — ${alert.name}`, { body, tag: alert.id, icon: "/globe.svg" });
            }
          }
        } catch {
          // skip failed fetches silently
        }
      }
    };

    checkPrices(); // immediate check on mount / status change
    const interval = setInterval(checkPrices, 2 * 60 * 1000); // every 2 minutes
    return () => clearInterval(interval);
  }, [pushStatus, alerts, toggle]);

  // Sync alerts to server whenever they change and we're subscribed
  const syncToServer = useCallback(async () => {
    if (pushStatus !== "subscribed") return;
    if (!("serviceWorker" in navigator)) return;

    setSyncStatus("idle");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) return;

      const res = await fetch("/api/push/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: sub.toJSON(),
          alerts: alerts.filter((a) => !a.triggered),
        }),
      });

      const data = await res.json();
      if (res.status === 503) {
        setSyncStatus("no_storage");
      } else if (res.ok) {
        setSyncStatus("ok");
      } else {
        setSyncStatus("error");
        console.error("Sync error:", data.error);
      }
    } catch (err) {
      setSyncStatus("error");
      console.error("Sync failed:", err);
    }
  }, [pushStatus, alerts]);

  useEffect(() => {
    if (pushStatus === "subscribed") syncToServer();
  }, [pushStatus, syncToServer]);

  const enablePushNotifications = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      toast.error("Push notifications not supported in this browser");
      return;
    }
    if (!VAPID_PUBLIC_KEY) {
      toast.error("Push key not configured — check env vars");
      return;
    }

    setPushStatus("requesting");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPushStatus("denied");
        toast.error("Notification permission denied");
        return;
      }

      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      setPushStatus("syncing");

      const res = await fetch("/api/push/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: sub.toJSON(),
          alerts: alerts.filter((a) => !a.triggered),
        }),
      });

      const data = await res.json();
      if (res.status === 503) {
        setSyncStatus("no_storage");
        toast("Subscribed! Set up Upstash to enable server-side checking.", { icon: "⚠️" });
      } else if (res.ok) {
        setSyncStatus("ok");
        toast.success(`Push notifications enabled! ${data.alertsSync} alerts synced.`);
      } else {
        toast.error("Subscription saved locally but server sync failed");
      }

      setPushStatus("subscribed");
    } catch (err) {
      console.error("Push subscription error:", err);
      setPushStatus("idle");
      toast.error("Failed to enable notifications");
    }
  };

  const disablePushNotifications = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      setPushStatus("idle");
      setSyncStatus("idle");
      toast.success("Push notifications disabled");
    } catch {
      toast.error("Failed to disable");
    }
  };

  const handleAdd = () => {
    if (!form.symbol || !form.targetValue) { toast.error("Fill in all fields"); return; }
    const stockMeta = INDIAN_STOCKS.find((s) => s.symbol === form.symbol.toUpperCase().trim());
    const symbol = form.symbol.toUpperCase().trim();
    const targetValue = parseFloat(form.targetValue);
    const alertType = ALERT_TYPES.find((t) => t.value === form.type);

    add({
      id: generateId(),
      symbol,
      name: stockMeta?.name || symbol,
      type: form.type,
      condition: `${alertType?.label} ${targetValue}`,
      targetValue,
      currentValue: 0,
      triggered: false,
      createdAt: Date.now(),
    });

    toast.success(`Alert set for ${symbol}`);
    setForm({ symbol: "", type: "PRICE_ABOVE", targetValue: "" });
    setShowAdd(false);
  };

  const handleRemove = (id: string) => { remove(id); toast.success("Alert removed"); };

  const alertsBySymbol = alerts.reduce<Record<string, Alert[]>>((acc, a) => {
    acc[a.symbol] = acc[a.symbol] || [];
    acc[a.symbol].push(a);
    return acc;
  }, {});

  const activeCount = alerts.filter((a) => !a.triggered).length;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              Alerts
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {activeCount} active · {alerts.length} total
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          >
            <Plus className="w-4 h-4" /> New Alert
          </button>
        </div>

        {/* Push Notification Status Card */}
        <Card className="mb-4">
          <SectionHeader title="Push Notifications" icon={<Wifi className="w-4 h-4" />} />

          {pushStatus === "unsupported" && (
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(100,116,139,0.1)", border: "1px solid rgba(100,116,139,0.2)" }}>
              <BellOff className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Not supported in this browser</p>
                <p className="text-xs text-slate-600 mt-0.5">Use Chrome, Edge, or Firefox on desktop/Android for push notifications.</p>
              </div>
            </div>
          )}

          {pushStatus === "denied" && (
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-400 font-medium">Notifications blocked</p>
                <p className="text-xs text-slate-500 mt-0.5">Go to browser site settings → allow notifications for this site, then refresh.</p>
              </div>
            </div>
          )}

          {(pushStatus === "idle" || pushStatus === "requesting" || pushStatus === "syncing") && (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-300">Get notified the moment a price alert fires — even when the tab is closed.</p>
                <p className="text-xs text-slate-500 mt-1">Works via Web Push. No email or phone number needed.</p>
              </div>
              <button
                onClick={enablePushNotifications}
                disabled={pushStatus === "requesting" || pushStatus === "syncing"}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white flex-shrink-0 disabled:opacity-60 transition-all"
                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
              >
                {pushStatus === "requesting" || pushStatus === "syncing" ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Setting up...</>
                ) : (
                  <><Bell className="w-4 h-4" /> Enable Push</>
                )}
              </button>
            </div>
          )}

          {pushStatus === "subscribed" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-emerald-400 font-medium">Push notifications active</span>
                </div>
                <button
                  onClick={disablePushNotifications}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <BellOff className="w-3.5 h-3.5" /> Disable
                </button>
              </div>

              {/* Sync status */}
              <div className="flex items-center gap-2">
                {syncStatus === "ok" && (
                  <span className="text-xs text-emerald-500 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> {activeCount} alert{activeCount !== 1 ? "s" : ""} synced — server will check every 15 min
                  </span>
                )}
                {syncStatus === "no_storage" && (
                  <div className="flex-1 p-3 rounded-lg text-xs" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                    <p className="text-amber-400 font-medium mb-1">Upstash not configured — browser-only mode</p>
                    <p className="text-slate-500">Alerts fire while this tab is open. For background push (when tab is closed), add Upstash to Vercel:</p>
                    <p className="text-slate-400 font-mono mt-1 text-xs">vercel.com → Storage → Create KV Database → Connect</p>
                  </div>
                )}
                {syncStatus === "error" && (
                  <span className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Sync failed — retrying on next change
                  </span>
                )}
                {syncStatus === "idle" && (
                  <span className="text-xs text-slate-600">Syncing alerts to server...</span>
                )}
                <button
                  onClick={syncToServer}
                  className="ml-auto text-slate-600 hover:text-slate-400 transition-colors"
                  title="Re-sync alerts"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Add Alert Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
            <Card className="w-full max-w-sm mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100">New Alert</h3>
                <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Stock</label>
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
                    {ALERT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
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
                    min="0" step="0.01"
                    className="w-full text-sm text-slate-200 border rounded-lg px-3 py-2 outline-none"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowAdd(false)}
                    className="flex-1 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                  >Cancel</button>
                  <button
                    onClick={handleAdd}
                    className="flex-1 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                  >Set Alert</button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Alert List */}
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
                      <button onClick={() => toggle(alert.id)} className="text-slate-500 hover:text-slate-300 transition-colors" title="Toggle status">
                        {alert.triggered ? <ToggleLeft className="w-5 h-5" /> : <ToggleRight className="w-5 h-5 text-emerald-400" />}
                      </button>
                      <button onClick={() => handleRemove(alert.id)} className="text-slate-600 hover:text-red-400 transition-colors">
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
