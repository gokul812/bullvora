import { NextRequest, NextResponse } from "next/server";
import { fetchMultipleQuotes, fetchHistoricalData, fetchFundamentals } from "@/lib/api/yahoo-finance";
import { runTechnicalAnalysis } from "@/lib/analysis/technical";
import { parseFundamentals, isUndervalued, isHighGrowth } from "@/lib/analysis/fundamental";
import { computeStockScore, computeSentimentScore } from "@/lib/analysis/scoring";
import { detectChartPatterns } from "@/lib/analysis/patterns";
import { INDIAN_STOCKS } from "@/lib/data/indian-stocks";
import { getPriceCategory, getPriceCategoryKey } from "@/lib/utils";
import { AnalyzedStock, ScannerFilters } from "@/lib/types";

export const dynamic = "force-dynamic";

// How many stocks to fully analyze per request (cap protects response time)
const MAX_PER_PAGE = 60;

async function analyzeStocks(stockList: typeof INDIAN_STOCKS, offset = 0, pageSize = MAX_PER_PAGE) {
  const page = stockList.slice(offset, offset + pageSize);
  const yahooSymbols = page.map((s) => s.yahooSymbol);
  const quotes = await fetchMultipleQuotes(yahooSymbols);

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const analyzed: AnalyzedStock[] = [];

  for (const stock of page) {
    const quote = quotes.get(stock.yahooSymbol);
    if (!quote || quote.price === 0) continue;

    try {
      const [ohlcv, fundamentalsRaw] = await Promise.all([
        fetchHistoricalData(stock.yahooSymbol, threeMonthsAgo),
        fetchFundamentals(stock.yahooSymbol),
      ]);

      const technical = runTechnicalAnalysis(ohlcv);
      const fundamental = parseFundamentals(fundamentalsRaw as Record<string, unknown>);
      const sentiment = computeSentimentScore(
        quote.changePercent,
        quote.changePercent > 0.5 ? "UP" : quote.changePercent < -0.5 ? "DOWN" : "SIDEWAYS"
      );
      const score = computeStockScore(quote, technical, fundamental, sentiment);
      const patterns = detectChartPatterns(ohlcv, quote.week52High || 0);

      analyzed.push({
        quote,
        technical,
        fundamental,
        sentiment,
        score,
        patterns,
        priceCategory: getPriceCategory(quote.price),
        priceCategoryKey: getPriceCategoryKey(quote.price),
        isBreakout: technical.breakoutDetected,
        isUndervalued: isUndervalued(fundamental),
        isHighGrowth: isHighGrowth(fundamental),
        lastUpdated: Date.now(),
      });
    } catch {
      // skip failed stocks silently
    }
  }

  return analyzed;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit      = Math.min(parseInt(searchParams.get("limit") || "50"), MAX_PER_PAGE);
  const offset     = parseInt(searchParams.get("offset") || "0");
  const nifty50Only = searchParams.get("nifty50") === "true";
  const sector     = searchParams.get("sector") || "All Sectors";

  try {
    let stockList = INDIAN_STOCKS;
    if (nifty50Only) stockList = INDIAN_STOCKS.filter((s) => s.isNifty50);
    if (sector && sector !== "All Sectors") stockList = stockList.filter((s) => s.sector === sector);

    const analyzed = await analyzeStocks(stockList, offset, limit);
    const sorted   = analyzed.sort((a, b) => b.score.totalScore - a.score.totalScore);

    return NextResponse.json({
      stocks: sorted,
      total: sorted.length,
      totalAvailable: stockList.length,
      offset,
      hasMore: offset + limit < stockList.length,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("Scanner GET error:", err);
    return NextResponse.json({ error: "Scanner failed", stocks: [], total: 0, hasMore: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const filters: ScannerFilters & { offset?: number; pageSize?: number } = body;

  try {
    let stockList = INDIAN_STOCKS;

    if (filters.sector && filters.sector !== "All Sectors")
      stockList = stockList.filter((s) => s.sector === filters.sector);
    if (filters.exchange && filters.exchange !== "ALL")
      stockList = stockList.filter((s) => s.exchange === filters.exchange);

    const offset   = filters.offset   ?? 0;
    const pageSize = Math.min(filters.pageSize ?? 50, MAX_PER_PAGE);

    const pageStocks = stockList.slice(offset, offset + pageSize);
    const yahooSymbols = pageStocks.map((s) => s.yahooSymbol);
    const quotes = await fetchMultipleQuotes(yahooSymbols);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const analyzed: AnalyzedStock[] = [];

    for (const stock of pageStocks) {
      const quote = quotes.get(stock.yahooSymbol);
      if (!quote || quote.price === 0) continue;

      if (filters.priceMin !== undefined && quote.price < filters.priceMin) continue;
      if (filters.priceMax !== undefined && quote.price > filters.priceMax) continue;

      try {
        const [ohlcv, fundamentalsRaw] = await Promise.all([
          fetchHistoricalData(stock.yahooSymbol, threeMonthsAgo),
          fetchFundamentals(stock.yahooSymbol),
        ]);

        const technical  = runTechnicalAnalysis(ohlcv);
        const fundamental = parseFundamentals(fundamentalsRaw as Record<string, unknown>);
        const sentiment  = computeSentimentScore(
          quote.changePercent,
          quote.changePercent > 0.5 ? "UP" : quote.changePercent < -0.5 ? "DOWN" : "SIDEWAYS"
        );
        const score = computeStockScore(quote, technical, fundamental, sentiment);
        const patterns = detectChartPatterns(ohlcv, quote.week52High || 0);

        if (filters.minScore       !== undefined  && score.totalScore   < filters.minScore)      continue;
        if (filters.recommendation && filters.recommendation !== "ALL"  && score.recommendation !== filters.recommendation) continue;
        if (filters.breakoutOnly   && !technical.breakoutDetected)  continue;
        if (filters.undervaluedOnly && !isUndervalued(fundamental)) continue;
        if (filters.highGrowthOnly  && !isHighGrowth(fundamental))  continue;

        // Pattern-specific filters
        if (filters.pattern && filters.pattern !== "ALL") {
          if (filters.pattern === "VCP"         && !patterns.vcp?.detected)                continue;
          if (filters.pattern === "CNH"         && !patterns.cnh?.detected)                continue;
          if (filters.pattern === "RECTANGULAR" && !patterns.rectangularBreakout?.detected) continue;
          if (filters.pattern === "ATH_BREAKOUT" && !patterns.athBreakout?.detected)       continue;
        }

        analyzed.push({
          quote, technical, fundamental, sentiment, score, patterns,
          priceCategory:    getPriceCategory(quote.price),
          priceCategoryKey: getPriceCategoryKey(quote.price),
          isBreakout:    technical.breakoutDetected,
          isUndervalued: isUndervalued(fundamental),
          isHighGrowth:  isHighGrowth(fundamental),
          lastUpdated:   Date.now(),
        });
      } catch {
        // skip
      }
    }

    const sortBy    = filters.sortBy  || "score";
    const sortDir   = filters.sortDir || "desc";
    const mult      = sortDir === "desc" ? -1 : 1;

    const sorted = analyzed.sort((a, b) => {
      switch (sortBy) {
        case "score":     return mult * (b.score.totalScore       - a.score.totalScore);
        case "price":     return mult * (b.quote.price            - a.quote.price);
        case "change":    return mult * (b.quote.changePercent    - a.quote.changePercent);
        case "volume":    return mult * (b.quote.volume           - a.quote.volume);
        case "marketCap": return mult * (b.quote.marketCap        - a.quote.marketCap);
        default:          return mult * (b.score.totalScore       - a.score.totalScore);
      }
    });

    return NextResponse.json({
      stocks:         sorted,
      total:          sorted.length,
      totalAvailable: stockList.length,
      offset,
      hasMore:        offset + pageSize < stockList.length,
      timestamp:      Date.now(),
    });
  } catch (err) {
    console.error("Scanner POST error:", err);
    return NextResponse.json({ error: "Scanner failed", stocks: [], total: 0, hasMore: false }, { status: 500 });
  }
}
