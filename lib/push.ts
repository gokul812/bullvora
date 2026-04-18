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

// ─── GitHub Gist storage — no extra account needed ───────────────────────────
// Stores a single JSON document in a private gist. Free, uses existing GitHub auth.

const GIST_ID = (process.env.GITHUB_GIST_ID || "").trim();
const GITHUB_TOKEN = (process.env.GITHUB_TOKEN || "").trim();
const GIST_FILENAME = "bullvora-data.json";

interface GistData {
  subscription: webpush.PushSubscription | null;
  alerts: ServerAlert[];
  triggered: string[];
}

async function readGist(): Promise<GistData> {
  const empty: GistData = { subscription: null, alerts: [], triggered: [] };
  if (!GIST_ID || !GITHUB_TOKEN) return empty;
  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    });
    if (!res.ok) return empty;
    const data = await res.json();
    const raw = data.files?.[GIST_FILENAME]?.content;
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

async function writeGist(data: GistData): Promise<void> {
  if (!GIST_ID || !GITHUB_TOKEN) return;
  await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: "PATCH",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: { [GIST_FILENAME]: { content: JSON.stringify(data, null, 2) } },
    }),
  });
}

// ─── Subscription storage ─────────────────────────────────────────────────────

export async function storeSubscription(sub: webpush.PushSubscription): Promise<void> {
  const data = await readGist();
  await writeGist({ ...data, subscription: sub });
}

export async function getSubscription(): Promise<webpush.PushSubscription | null> {
  return (await readGist()).subscription;
}

export async function deleteSubscription(): Promise<void> {
  const data = await readGist();
  await writeGist({ ...data, subscription: null });
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
  const data = await readGist();
  await writeGist({ ...data, alerts });
}

export async function getAlerts(): Promise<ServerAlert[]> {
  return (await readGist()).alerts;
}

export async function markTriggered(id: string): Promise<void> {
  const data = await readGist();
  const triggered = [...new Set([...data.triggered, id])];
  await writeGist({ ...data, triggered });
}

export async function getTriggered(): Promise<string[]> {
  return (await readGist()).triggered;
}

// ─── Read all in one shot (used by cron to avoid multiple round-trips) ─────────

export async function getAllData(): Promise<GistData> {
  return readGist();
}

export async function saveAllData(data: GistData): Promise<void> {
  return writeGist(data);
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
    const e = err as { statusCode?: number };
    if (e?.statusCode === 410 || e?.statusCode === 404) {
      await deleteSubscription();
    }
    console.error("Push send error:", err);
    return false;
  }
}

// ─── Is storage ready? ────────────────────────────────────────────────────────

export function isStorageReady(): boolean {
  return !!(GIST_ID && GITHUB_TOKEN);
}
