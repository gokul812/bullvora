import { TechnicalIndicators, FundamentalData, SentimentData, StockScore, StockQuote } from "@/lib/types";
import { clampScore, getRecommendation } from "@/lib/utils";
import { buildTradeSetup } from "@/lib/analysis/technical";

export function computeStockScore(
  quote: StockQuote,
  technical: TechnicalIndicators,
  fundamental: FundamentalData,
  sentiment: SentimentData
): StockScore {
  // Professional weights:
  // Technical momentum 35% | Fundamental quality 30% | Volume/Breakout 20% | Sentiment 15%
  const volBreakoutScore = computeVolumeBreakoutScore(technical);

  const totalScore = clampScore(
    technical.technicalScore * 0.35 +
    fundamental.fundamentalScore * 0.30 +
    volBreakoutScore * 0.20 +
    sentiment.sentimentScore * 0.15
  );

  const recommendation = getRecommendation(totalScore);
  const reasons = buildReasons(quote, technical, fundamental, sentiment, totalScore);
  const risks = buildRisks(quote, technical, fundamental, sentiment);
  const confidence = computeConfidence(technical, fundamental);
  const tradeSetup = buildTradeSetup(quote.price, technical);

  return {
    totalScore,
    technicalScore: technical.technicalScore,
    fundamentalScore: fundamental.fundamentalScore,
    sentimentScore: sentiment.sentimentScore,
    volumeBreakoutScore: volBreakoutScore,
    recommendation,
    confidence,
    reasons,
    risks,
    tradeSetup,
  };
}

function computeVolumeBreakoutScore(technical: TechnicalIndicators): number {
  let score = 50;
  if (technical.breakoutDetected) score += 25;
  if (technical.volumeRatio > 3) score += 15;
  else if (technical.volumeRatio > 2) score += 10;
  else if (technical.volumeRatio > 1.5) score += 5;
  else if (technical.volumeRatio < 0.5) score -= 15;
  if (technical.goldenCross) score += 10;
  if (technical.deathCross) score -= 15;
  if (technical.macdCrossover === "BULLISH") score += 10;
  else if (technical.macdCrossover === "BEARISH") score -= 10;
  return clampScore(score);
}

function buildReasons(
  quote: StockQuote,
  technical: TechnicalIndicators,
  fundamental: FundamentalData,
  sentiment: SentimentData,
  score: number
): string[] {
  const r: string[] = [];

  // Trade setup quality
  if (technical.macdCrossover === "BULLISH")
    r.push("MACD bullish crossover — fresh buy signal on momentum");
  if (technical.goldenCross)
    r.push("Golden cross (EMA50 > EMA200) — long-term bullish structure confirmed");
  if (technical.breakoutDetected)
    r.push(`Volume breakout above resistance with ${(technical.volumeRatio).toFixed(1)}x average volume`);

  // RSI context (professional interpretation)
  if (technical.rsiSignal === "OVERSOLD")
    r.push(`RSI at ${technical.rsi14.toFixed(0)} — oversold, potential mean-reversion bounce`);
  else if (technical.rsiSignal === "BULLISH_ZONE" && technical.trend === "BULLISH")
    r.push(`RSI ${technical.rsi14.toFixed(0)} in healthy bullish zone — trend continuation likely`);

  // ADX trend strength
  if (technical.adx >= 25 && technical.trend === "BULLISH")
    r.push(`Strong trending market (ADX ${technical.adx.toFixed(0)}) — high-conviction directional move`);

  // Stochastic
  if (technical.stochasticSignal === "OVERSOLD" && technical.trend === "BULLISH")
    r.push("Stochastic oversold in uptrend — pullback buy opportunity");

  // Fundamental quality signals
  if (fundamental.piotroF >= 7)
    r.push(`Piotroski F-Score ${fundamental.piotroF}/9 — high-quality profitable business`);
  if (fundamental.grahamNumber && fundamental.grahamNumber > quote.price)
    r.push(`Trading below Graham Number ₹${fundamental.grahamNumber.toFixed(0)} — margin of safety exists`);
  if (fundamental.roe !== null && (fundamental.roe > 1 ? fundamental.roe : fundamental.roe * 100) > 20)
    r.push(`ROE ${(fundamental.roe > 1 ? fundamental.roe : fundamental.roe * 100).toFixed(1)}% — superior capital efficiency`);
  if (fundamental.revenueGrowth !== null) {
    const rg = fundamental.revenueGrowth > 1 ? fundamental.revenueGrowth : fundamental.revenueGrowth * 100;
    if (rg > 15) r.push(`Revenue growing ${rg.toFixed(1)}% YoY — strong business momentum`);
  }
  if (fundamental.peRatio !== null && fundamental.peRatio > 0 && fundamental.peRatio < 20)
    r.push(`PE ratio ${fundamental.peRatio.toFixed(1)}x — attractively valued vs sector`);
  if (fundamental.currentRatio !== null && fundamental.currentRatio > 1.5)
    r.push("Strong current ratio — no near-term liquidity stress");

  if (r.length === 0) {
    if (score >= 65) r.push("Multiple technical and fundamental factors aligned positively");
    else if (score >= 45) r.push("Mixed signals — awaiting confirmation before entry");
    else r.push("Weak setup — no high-conviction entry signal present");
  }
  return r.slice(0, 5);
}

function buildRisks(
  quote: StockQuote,
  technical: TechnicalIndicators,
  fundamental: FundamentalData,
  sentiment: SentimentData
): string[] {
  const r: string[] = [];

  if (technical.rsiSignal === "OVERBOUGHT")
    r.push(`RSI ${technical.rsi14.toFixed(0)} — overbought, high risk of pullback. Avoid chasing`);
  if (technical.macdCrossover === "BEARISH")
    r.push("MACD bearish crossover — momentum turning negative, distribution phase");
  if (technical.deathCross)
    r.push("Death cross (EMA50 < EMA200) — long-term bearish, avoid longs");
  if (!technical.priceAboveEma200)
    r.push("Price below 200 EMA — long-term trend is bearish. Higher risk");
  if (technical.adx < 15 && technical.trend === "NEUTRAL")
    r.push("Choppy sideways market (low ADX) — false signals likely, wait for trend");
  if (technical.volumeRatio < 0.5)
    r.push("Very low volume — weak conviction, easy to manipulate price");

  if (fundamental.debtToEquity !== null && fundamental.debtToEquity > 2)
    r.push(`Debt/Equity ${fundamental.debtToEquity.toFixed(1)}x — high leverage risk in rising rate environment`);
  if (fundamental.peRatio !== null && fundamental.peRatio > 60)
    r.push(`PE ${fundamental.peRatio.toFixed(0)}x — expensive valuation leaves no margin of safety`);
  if (fundamental.piotroF <= 3)
    r.push(`Piotroski F-Score ${fundamental.piotroF}/9 — weak business fundamentals`);
  if (fundamental.currentRatio !== null && fundamental.currentRatio < 1)
    r.push("Current ratio below 1 — potential short-term liquidity risk");

  if (quote.changePercent < -3)
    r.push(`Down ${Math.abs(quote.changePercent).toFixed(1)}% today — possible negative catalyst, check news`);

  // Market-wide
  r.push("Always use stop loss. Market-wide risks: RBI policy, FII flows, global macro");

  return r.slice(0, 4);
}

function computeConfidence(technical: TechnicalIndicators, fundamental: FundamentalData): number {
  let aligned = 0;
  const checks = [
    technical.trend === "BULLISH",
    technical.macdCrossover === "BULLISH" || technical.macd.histogram > 0,
    technical.rsiSignal !== "OVERBOUGHT",
    technical.priceAboveEma50,
    technical.priceAboveEma200,
    technical.adx >= 20,
    technical.volumeRatio > 1,
    fundamental.peRatio !== null,
    fundamental.roe !== null,
    fundamental.piotroF >= 5,
  ];
  checks.forEach((c) => { if (c) aligned++; });
  return clampScore(40 + (aligned / checks.length) * 60);
}

export function computeSentimentScore(
  changePercent: number,
  marketTrend: "UP" | "DOWN" | "SIDEWAYS"
): SentimentData {
  let score = 50;
  // Price action as sentiment proxy (real sentiment would need news API)
  if (changePercent > 4) score += 20;
  else if (changePercent > 2) score += 12;
  else if (changePercent > 0.5) score += 6;
  else if (changePercent < -4) score -= 20;
  else if (changePercent < -2) score -= 12;
  else if (changePercent < -0.5) score -= 6;

  if (marketTrend === "UP") score += 8;
  else if (marketTrend === "DOWN") score -= 8;

  score = clampScore(score);
  return {
    overallSentiment: score >= 58 ? "BULLISH" : score <= 42 ? "BEARISH" : "NEUTRAL",
    sentimentScore: score,
    newsCount: 0,
    positiveNews: 0,
    negativeNews: 0,
    marketTrend,
    niftyTrend: marketTrend,
  };
}
