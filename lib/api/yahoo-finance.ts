import YahooFinanceClass from "yahoo-finance2";
import { OHLCVData, StockQuote } from "@/lib/types";
import { INDIAN_STOCKS } from "@/lib/data/indian-stocks";

// v3 requires instantiation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const yf = new (YahooFinanceClass as any)({
  suppressNotices: ["yahooSurvey"],
  validation: { logErrors: false },
});

export async function fetchStockQuote(yahooSymbol: string): Promise<StockQuote | null> {
  try {
    const meta = INDIAN_STOCKS.find(
      (s) => s.yahooSymbol === yahooSymbol || s.symbol === yahooSymbol
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await yf.quote(yahooSymbol);
    if (!result) return null;

    return {
      symbol: meta?.symbol || yahooSymbol.replace(".NS", "").replace(".BO", ""),
      name: result.longName || result.shortName || meta?.name || yahooSymbol,
      exchange: yahooSymbol.endsWith(".NS") ? "NSE" : "BSE",
      price: result.regularMarketPrice ?? 0,
      change: result.regularMarketChange ?? 0,
      changePercent: result.regularMarketChangePercent ?? 0,
      open: result.regularMarketOpen ?? 0,
      high: result.regularMarketDayHigh ?? 0,
      low: result.regularMarketDayLow ?? 0,
      previousClose: result.regularMarketPreviousClose ?? 0,
      volume: result.regularMarketVolume ?? 0,
      avgVolume: result.averageDailyVolume3Month ?? result.averageDailyVolume10Day ?? 0,
      marketCap: result.marketCap ?? 0,
      sector: meta?.sector || result.sector || "Unknown",
      industry: result.industry || meta?.sector || "Unknown",
      week52High: result.fiftyTwoWeekHigh ?? 0,
      week52Low: result.fiftyTwoWeekLow ?? 0,
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

export async function fetchMultipleQuotes(
  yahooSymbols: string[]
): Promise<Map<string, StockQuote>> {
  const results = new Map<string, StockQuote>();

  const batchSize = 5;
  for (let i = 0; i < yahooSymbols.length; i += batchSize) {
    const batch = yahooSymbols.slice(i, i + batchSize);
    const promises = batch.map((sym) => fetchStockQuote(sym).then((q) => ({ sym, q })));
    const resolved = await Promise.allSettled(promises);

    for (const r of resolved) {
      if (r.status === "fulfilled" && r.value.q) {
        results.set(r.value.sym, r.value.q);
      }
    }

    if (i + batchSize < yahooSymbols.length) {
      await new Promise((res) => setTimeout(res, 200));
    }
  }

  return results;
}

export async function fetchHistoricalData(
  yahooSymbol: string,
  period1: Date,
  period2: Date = new Date()
): Promise<OHLCVData[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await yf.chart(yahooSymbol, {
      period1,
      period2,
      interval: "1d",
    });

    if (!result?.quotes) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result.quotes
      .filter((q: any) => q.open != null && q.close != null)
      .map((q: any) => ({
        time: new Date(q.date).getTime(),
        open: q.open ?? 0,
        high: q.high ?? 0,
        low: q.low ?? 0,
        close: q.close ?? 0,
        volume: q.volume ?? 0,
      }));
  } catch {
    return [];
  }
}

export async function fetchFundamentals(yahooSymbol: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await yf.quoteSummary(yahooSymbol, {
      modules: [
        "defaultKeyStatistics",
        "financialData",
        "summaryDetail",
        "incomeStatementHistory",
        "balanceSheetHistory",
      ],
    });
    return result ?? null;
  } catch {
    return null;
  }
}

export async function fetchMarketIndex(symbol: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await yf.quote(symbol);
    if (!result) return null;
    return {
      symbol,
      value: result.regularMarketPrice ?? 0,
      change: result.regularMarketChange ?? 0,
      changePercent: result.regularMarketChangePercent ?? 0,
      high: result.regularMarketDayHigh ?? 0,
      low: result.regularMarketDayLow ?? 0,
    };
  } catch {
    return null;
  }
}
