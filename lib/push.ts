import webpush from "web-push";

// ─── VAPID config ─────────────────────────────────────────────────────────────

export const VAPID_PUBLIC_KEY = (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "").trim();

const VAPID_PRIVATE_KEY = (process.env.VAPID_PRIVATE_KEY || "").trim();
const VAPID_EMAIL = (process.env.VAPID_EMAIL || "mailto:admin@bullvora.app").trim();

// Lazy VAPID init — only configure when actually sending to avoid build-time errors
let vapidReady = false;
function ensureVapid() {
  if (vapidReady || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return;
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  vapidReady = true;
}

// ─── Upstash Redis — thin REST client, no SDK needed ─────────────────────────

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || "";
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";

async function redis(command: (string | number)[]): Promise<unknown> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  const res = await fetch(UPSTASH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const json = await res.json();
  return json.result ?? null;
}

// ─── Subscription storage ─────────────────────────────────────────────────────

export async function storeSubscription(sub: webpush.PushSubscription): Promise<void> {
  await redis(["SET", "bullvora:subscription", JSON.stringify(sub)]);
}

export async function getSubscription(): Promise<webpush.PushSubscription | null> {
  const raw = await redis(["GET", "bullvora:subscription"]);
  if (!raw) return null;
  try { return JSON.parse(raw as string); } catch { return null; }
}

export async function deleteSubscription(): Promise<void> {
  await redis(["DEL", "bullvora:subscription"]);
}

// ─── Alert storage ────────────────────────────────────────────────────────────

export interface ServerAlert {
  id: string;
  symbol: string;
  yahooSymbol: string;
  type: "PRICE_ABOVE" | "PRICE_BELOW" | "VOLUME_SPIKE" | "BREAKOUT";
  targetValue: number;
  name: string;
  condition: string;
}

export async function storeAlerts(alerts: ServerAlert[]): Promise<void> {
  await redis(["SET", "bullvora:alerts", JSON.stringify(alerts)]);
}

export async function getAlerts(): Promise<ServerAlert[]> {
  const raw = await redis(["GET", "bullvora:alerts"]);
  if (!raw) return [];
  try { return JSON.parse(raw as string); } catch { return []; }
}

export async function markTriggered(id: string): Promise<void> {
  await redis(["SADD", "bullvora:triggered", id]);
}

export async function getTriggered(): Promise<string[]> {
  const raw = await redis(["SMEMBERS", "bullvora:triggered"]);
  return Array.isArray(raw) ? (raw as string[]) : [];
}

export async function clearTriggered(id: string): Promise<void> {
  await redis(["SREM", "bullvora:triggered", id]);
}

// ─── Send Web Push ────────────────────────────────────────────────────────────

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  alertId?: string;
}

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: PushPayload
): Promise<boolean> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.error("VAPID keys not configured");
    return false;
  }
  ensureVapid();
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (err: unknown) {
    // Subscription expired or revoked — clean up
    const e = err as { statusCode?: number };
    if (e?.statusCode === 410 || e?.statusCode === 404) {
      await deleteSubscription();
    }
    console.error("Push send error:", err);
    return false;
  }
}

// ─── Is Upstash configured? ───────────────────────────────────────────────────

export function isStorageReady(): boolean {
  return !!(UPSTASH_URL && UPSTASH_TOKEN);
}
