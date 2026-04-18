import { NextRequest, NextResponse } from "next/server";
import {
  getSubscription,
  getAlerts,
  getTriggered,
  markTriggered,
  sendPushNotification,
  isStorageReady,
} from "@/lib/push";
import { fetchStockQuote } from "@/lib/api/yahoo-finance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called by Vercel Cron — protected by CRON_SECRET header
export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET || "bullvora-cron-2025"}`;
  if (secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStorageReady()) {
    return NextResponse.json({ skipped: "Storage not configured" });
  }

  const [subscription, alerts, triggered] = await Promise.all([
    getSubscription(),
    getAlerts(),
    getTriggered(),
  ]);

  if (!subscription) {
    return NextResponse.json({ skipped: "No push subscription registered" });
  }

  const triggeredSet = new Set(triggered);
  const active = alerts.filter((a) => !triggeredSet.has(a.id));

  if (active.length === 0) {
    return NextResponse.json({ checked: 0, fired: 0 });
  }

  // Deduplicate symbols to minimise Yahoo Finance calls
  const symbolMap = new Map<string, typeof active>();
  for (const alert of active) {
    const arr = symbolMap.get(alert.yahooSymbol) || [];
    arr.push(alert);
    symbolMap.set(alert.yahooSymbol, arr);
  }

  let fired = 0;

  for (const [yahooSymbol, symbolAlerts] of symbolMap.entries()) {
    let quote;
    try {
      quote = await fetchStockQuote(yahooSymbol);
    } catch {
      continue;
    }
    if (!quote || !quote.price) continue;

    const price = quote.price;
    const volRatio = quote.volume / (quote.avgVolume || quote.volume);

    for (const alert of symbolAlerts) {
      let triggered = false;
      let notifBody = "";

      if (alert.type === "PRICE_ABOVE" && price >= alert.targetValue) {
        triggered = true;
        notifBody = `${alert.symbol} is ₹${price.toFixed(2)} — above your target of ₹${alert.targetValue}`;
      } else if (alert.type === "PRICE_BELOW" && price <= alert.targetValue) {
        triggered = true;
        notifBody = `${alert.symbol} is ₹${price.toFixed(2)} — below your target of ₹${alert.targetValue}`;
      } else if (alert.type === "VOLUME_SPIKE" && volRatio >= alert.targetValue) {
        triggered = true;
        notifBody = `${alert.symbol} volume is ${volRatio.toFixed(1)}x average — spike detected`;
      }

      if (triggered) {
        const sent = await sendPushNotification(subscription, {
          title: `Bullvora Alert — ${alert.name}`,
          body: notifBody,
          url: `/alerts`,
          alertId: alert.id,
        });
        if (sent) {
          await markTriggered(alert.id);
          fired++;
        }
      }
    }
  }

  return NextResponse.json({ checked: active.length, fired, timestamp: Date.now() });
}
