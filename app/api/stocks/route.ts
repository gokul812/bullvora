import { NextRequest, NextResponse } from "next/server";
import { INDIAN_STOCKS, SECTORS, searchStocks, getNifty50Stocks, getNifty500Stocks } from "@/lib/data/indian-stocks";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q        = searchParams.get("q") || "";
  const sector   = searchParams.get("sector") || "";
  const exchange = searchParams.get("exchange") || "";
  const nifty50  = searchParams.get("nifty50") === "true";
  const nifty500 = searchParams.get("nifty500") === "true";
  const limit    = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset   = parseInt(searchParams.get("offset") || "0");

  let stocks = INDIAN_STOCKS;

  if (nifty50)           stocks = getNifty50Stocks();
  else if (nifty500)     stocks = getNifty500Stocks();

  if (sector && sector !== "All Sectors")
    stocks = stocks.filter((s) => s.sector === sector);

  if (exchange && exchange !== "ALL")
    stocks = stocks.filter((s) => s.exchange === exchange);

  if (q) {
    const lower = q.toLowerCase();
    stocks = stocks.filter(
      (s) =>
        s.symbol.toLowerCase().includes(lower) ||
        s.name.toLowerCase().includes(lower) ||
        s.sector.toLowerCase().includes(lower)
    );
  }

  const total = stocks.length;
  const page  = stocks.slice(offset, offset + limit);

  return NextResponse.json({
    stocks: page,
    total,
    offset,
    limit,
    sectors: SECTORS,
    timestamp: Date.now(),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { q = "", limit = 10 } = body as { q?: string; limit?: number };

  const results = searchStocks(q, Math.min(limit, 30));

  return NextResponse.json({ stocks: results, total: results.length });
}
