import { NextResponse } from "next/server";
import { fetchMultipleQuotes, fetchHistoricalData, fetchFundamentals } from "@/lib/api/yahoo-finance";
import { runTechnicalAnalysis } from "@/lib/analysis/technical";
import { parseFundamentals } from "@/lib/analysis/fundamental";
import { computeStockScore, computeSentimentScore } from "@/lib/analysis/scoring";
import { INDIAN_STOCKS, getNifty50Stocks } from "@/lib/data/indian-stocks";
import { getPriceCategory, getPriceCategoryKey } from "@/lib/utils";
import { AIRecommendation } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const topStocks = [
      ...getNifty50Stocks().slice(0, 20),
      ...INDIAN_STOCKS.filter((s) => !s.isNifty50).slice(0, 15),
    ];

    const yahooSymbols = topStocks.map((s) => s.yahooSymbol);
    const quotes = await fetchMultipleQuotes(yahooSymbols);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const scored: AIRecommendation[] = [];

    for (const stock of topStocks) {
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

        if (score.totalScore >= 55) {
          const targetMultiplier =
            score.recommendation === "BUY" ? 1.10 + (score.totalScore - 55) * 0.003
              : 1.05;

          const ts = score.tradeSetup;
          scored.push({
            symbol: quote.symbol,
            name: quote.name,
            exchange: quote.exchange,
            score: score.totalScore,
            recommendation: score.recommendation,
            price: quote.price,
            changePercent: quote.changePercent,
            targetPrice: ts ? Math.round(ts.target2) : Math.round(quote.price * targetMultiplier),
            stopLoss: ts ? ts.stopLoss : Math.round(quote.price * 0.92),
            riskReward: ts ? ts.riskRewardT2 : 2,
            reasons: score.reasons,
            risks: score.risks,
            sector: quote.sector,
            priceCategory: getPriceCategory(quote.price),
            confidence: score.confidence,
            piotroF: fundamental.piotroF,
            grahamNumber: fundamental.grahamNumber,
            tradeType: ts ? ts.tradeType : "BREAKOUT",
            timestamp: Date.now(),
          });
        }
      } catch {
        // Skip
      }
    }

    const top5 = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return NextResponse.json({
      recommendations: top5,
      total: top5.length,
      timestamp: Date.now(),
      disclaimer:
        "These AI-generated recommendations are for educational purposes only and do not constitute financial advice. Past performance does not guarantee future results. Please do your own research before investing.",
    });
  } catch (err) {
    console.error("Recommendations error:", err);
    return NextResponse.json(
      {
        recommendations: [],
        total: 0,
        error: "Failed to generate recommendations",
        disclaimer: "AI recommendations temporarily unavailable.",
      },
      { status: 200 }
    );
  }
}
