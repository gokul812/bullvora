import { NextRequest, NextResponse } from "next/server";
import { fetchStockQuote, fetchHistoricalData, fetchFundamentals } from "@/lib/api/yahoo-finance";
import { runTechnicalAnalysis } from "@/lib/analysis/technical";
import { parseFundamentals, isUndervalued, isHighGrowth } from "@/lib/analysis/fundamental";
import { computeStockScore, computeSentimentScore } from "@/lib/analysis/scoring";
import { detectChartPatterns } from "@/lib/analysis/patterns";
import { getStockBySymbol, INDIAN_STOCKS } from "@/lib/data/indian-stocks";
import { getPriceCategory, getPriceCategoryKey } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const decodedSymbol = decodeURIComponent(symbol);

    const stockMeta = getStockBySymbol(decodedSymbol)
      || INDIAN_STOCKS.find(s => s.symbol.toLowerCase() === decodedSymbol.toLowerCase());

    const yahooSymbol = stockMeta?.yahooSymbol || (decodedSymbol.includes(".") ? decodedSymbol : `${decodedSymbol}.NS`);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 6);

    const [quote, ohlcv, fundamentalsRaw] = await Promise.all([
      fetchStockQuote(yahooSymbol),
      fetchHistoricalData(yahooSymbol, threeMonthsAgo),
      fetchFundamentals(yahooSymbol),
    ]);

    if (!quote) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    const technical = runTechnicalAnalysis(ohlcv);
    const fundamental = parseFundamentals(fundamentalsRaw as Record<string, unknown>);
    const sentiment = computeSentimentScore(quote.changePercent, quote.changePercent > 0 ? "UP" : quote.changePercent < 0 ? "DOWN" : "SIDEWAYS");
    const score = computeStockScore(quote, technical, fundamental, sentiment);
    const patterns = detectChartPatterns(ohlcv, quote.week52High || 0);

    return NextResponse.json({
      quote,
      technical,
      fundamental,
      sentiment,
      score,
      patterns,
      ohlcv: ohlcv.slice(-90),
      priceCategory: getPriceCategory(quote.price),
      priceCategoryKey: getPriceCategoryKey(quote.price),
      isBreakout: technical.breakoutDetected,
      isUndervalued: isUndervalued(fundamental),
      isHighGrowth: isHighGrowth(fundamental),
      lastUpdated: Date.now(),
    });
  } catch (err) {
    console.error("Stock route error:", err);
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}
