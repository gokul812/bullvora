import { NextResponse } from "next/server";
import { fetchMarketIndex } from "@/lib/api/yahoo-finance";
import { MARKET_INDICES } from "@/lib/data/indian-stocks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const results = await Promise.allSettled(
      MARKET_INDICES.map(async (idx) => {
        const data = await fetchMarketIndex(idx.symbol);
        return { ...idx, ...(data || {}) };
      })
    );

    const indices = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => (r as PromiseFulfilledResult<typeof MARKET_INDICES[0] & { value?: number; change?: number; changePercent?: number }>).value);

    return NextResponse.json({ indices, timestamp: Date.now() });
  } catch (err) {
    console.error("Market route error:", err);
    return NextResponse.json(
      { indices: getFallbackIndices(), timestamp: Date.now() },
      { status: 200 }
    );
  }
}

function getFallbackIndices() {
  return MARKET_INDICES.map((idx) => ({
    ...idx,
    value: idx.name === "NIFTY 50" ? 22500 : idx.name === "SENSEX" ? 74000 : 48000,
    change: 0,
    changePercent: 0,
    high: 0,
    low: 0,
  }));
}
