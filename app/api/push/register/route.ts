import { NextRequest, NextResponse } from "next/server";
import { storeSubscription, storeAlerts, isStorageReady, ServerAlert } from "@/lib/push";
import { INDIAN_STOCKS } from "@/lib/data/indian-stocks";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription, alerts } = body as {
      subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
      alerts: Array<{
        id: string;
        symbol: string;
        type: string;
        targetValue: number;
        name: string;
        condition: string;
        triggered: boolean;
      }>;
    };

    if (!subscription?.endpoint || !subscription?.keys) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    if (!isStorageReady()) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    await storeSubscription(subscription as Parameters<typeof storeSubscription>[0]);

    // Sync non-triggered alerts to the server so the cron can check them
    const activeAlerts: ServerAlert[] = (alerts || [])
      .filter((a) => !a.triggered)
      .map((a) => {
        const meta = INDIAN_STOCKS.find((s) => s.symbol === a.symbol);
        return {
          id: a.id,
          symbol: a.symbol,
          yahooSymbol: meta?.yahooSymbol || `${a.symbol}.NS`,
          type: a.type as ServerAlert["type"],
          targetValue: a.targetValue,
          name: a.name,
          condition: a.condition,
        };
      });

    await storeAlerts(activeAlerts);

    return NextResponse.json({ ok: true, alertsSync: activeAlerts.length });
  } catch (err) {
    console.error("Push register error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
