export interface StockQuote {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  sector: string;
  industry: string;
  week52High: number;
  week52Low: number;
  timestamp: number;
}

export interface OHLCVData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FibonacciLevels {
  level0: number;    // 0% (swing high)
  level236: number;  // 23.6%
  level382: number;  // 38.2%
  level500: number;  // 50%
  level618: number;  // 61.8% — golden ratio, key buy zone
  level786: number;  // 78.6%
  level100: number;  // 100% (swing low)
}

export interface PivotPoints {
  pp: number;   // pivot point
  r1: number;   // resistance 1
  r2: number;   // resistance 2
  r3: number;   // resistance 3
  s1: number;   // support 1
  s2: number;   // support 2
  s3: number;   // support 3
}

export interface TechnicalIndicators {
  rsi14: number;
  rsiSignal: "OVERSOLD" | "NEUTRAL" | "OVERBOUGHT" | "BULLISH_ZONE" | "BEARISH_ZONE";
  stochasticK: number;
  stochasticD: number;
  stochasticSignal: "OVERSOLD" | "NEUTRAL" | "OVERBOUGHT";
  macd: { macd: number; signal: number; histogram: number };
  macdCrossover: "BULLISH" | "BEARISH" | "NONE";  // fresh crossover
  adx: number;         // trend strength 0-100, >25 = trending
  adxTrend: "STRONG" | "WEAK" | "SIDEWAYS";
  ema20: number;
  ema50: number;
  ema200: number;
  sma20: number;
  sma50: number;
  sma200: number;
  bollingerBands: { upper: number; middle: number; lower: number };
  bollingerPosition: "ABOVE_UPPER" | "UPPER_HALF" | "LOWER_HALF" | "BELOW_LOWER";
  atr: number;
  atrPercent: number;  // ATR as % of price — volatility measure
  volumeRatio: number;
  priceAboveEma20: boolean;
  priceAboveEma50: boolean;
  priceAboveEma200: boolean;
  goldenCross: boolean;
  deathCross: boolean;
  breakoutDetected: boolean;
  breakoutStrength: number;
  trend: "BULLISH" | "BEARISH" | "NEUTRAL";
  trendStrength: number;   // 0-100
  supportLevel: number;
  resistanceLevel: number;
  fibonacci: FibonacciLevels;
  pivotPoints: PivotPoints;
  technicalScore: number;
}

export interface FundamentalData {
  peRatio: number | null;
  pbRatio: number | null;
  eps: number | null;
  epsGrowth: number | null;
  revenueGrowth: number | null;
  profitGrowth: number | null;
  debtToEquity: number | null;
  roe: number | null;
  roce: number | null;
  roa: number | null;
  dividendYield: number | null;
  bookValue: number | null;
  priceToSales: number | null;
  currentRatio: number | null;
  promoterHolding: number | null;
  fiiHolding: number | null;
  diiHolding: number | null;
  piotroF: number;           // Piotroski F-Score 0-9 (7+ = strong quality)
  grahamNumber: number | null; // Intrinsic value estimate
  evToEbitda: number | null;
  operatingCashflow: number | null;
  freeCashflow: number | null;
  fundamentalScore: number;
}

export interface SentimentData {
  overallSentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  sentimentScore: number;
  newsCount: number;
  positiveNews: number;
  negativeNews: number;
  marketTrend: "UP" | "DOWN" | "SIDEWAYS";
  niftyTrend: "UP" | "DOWN" | "SIDEWAYS";
}

export interface TradeSetup {
  entryPrice: number;
  entryZoneLow: number;
  entryZoneHigh: number;
  stopLoss: number;
  stopLossPercent: number;
  target1: number;         // 1:1.5 R:R
  target2: number;         // 1:2.5 R:R
  target3: number;         // 1:4 R:R (or key resistance)
  riskRewardT2: number;    // R:R ratio to T2
  tradeType: "BREAKOUT" | "PULLBACK_BUY" | "REVERSAL" | "MOMENTUM";
  timeframe: "SWING" | "POSITIONAL" | "LONG_TERM";
  atrStopLoss: number;     // ATR-based SL for reference
  maxLossPercent: number;
  invalidationLevel: number; // if price closes below this, trade is invalid
}

export interface StockScore {
  totalScore: number;
  technicalScore: number;
  fundamentalScore: number;
  sentimentScore: number;
  volumeBreakoutScore: number;
  recommendation: "BUY" | "WATCHLIST" | "AVOID";
  confidence: number;
  reasons: string[];
  risks: string[];
  tradeSetup: TradeSetup;
}

export interface AnalyzedStock {
  quote: StockQuote;
  technical: TechnicalIndicators;
  fundamental: FundamentalData;
  sentiment: SentimentData;
  score: StockScore;
  patterns: PatternDetection;
  priceCategory: string;
  priceCategoryKey: string;
  isBreakout: boolean;
  isUndervalued: boolean;
  isHighGrowth: boolean;
  lastUpdated: number;
}

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
}

export interface SectorPerformance {
  sector: string;
  changePercent: number;
  topStock: string;
  stockCount: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  addedAt: number;
  alertPrice?: number;
  notes?: string;
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  investedAmount: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  sector: string;
  buyDate?: string; // ISO date string e.g. "2024-01-15"
}

export interface Alert {
  id: string;
  symbol: string;
  name: string;
  type: "PRICE_ABOVE" | "PRICE_BELOW" | "VOLUME_SPIKE" | "BREAKOUT" | "NEWS";
  condition: string;
  targetValue: number;
  currentValue: number;
  triggered: boolean;
  createdAt: number;
}

export interface AIRecommendation {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  score: number;
  recommendation: "BUY" | "WATCHLIST" | "AVOID";
  price: number;
  changePercent: number;
  targetPrice: number;
  stopLoss: number;
  riskReward: number;
  reasons: string[];
  risks: string[];
  sector: string;
  priceCategory: string;
  confidence: number;
  piotroF: number;
  grahamNumber: number | null;
  tradeType: string;
  timestamp: number;
}

export interface PatternDetection {
  vcp: {
    detected: boolean;
    strength: number;
    contractions: number;
    pivotPoint: number;
  } | null;
  cnh: {
    detected: boolean;
    strength: number;
    cupDepth: number;
    handleDepth: number;
    buyPoint: number;
  } | null;
  rectangularBreakout: {
    detected: boolean;
    strength: number;
    resistance: number;
    support: number;
    breakoutPercent: number;
  } | null;
  athBreakout: {
    detected: boolean;
    strength: number;
    ath52w: number;
    breakoutType: "FRESH_ATH" | "NEAR_ATH";
  } | null;
  detectedPatterns: string[];
}

export interface ScannerFilters {
  priceMin?: number;
  priceMax?: number;
  sector?: string;
  exchange?: "NSE" | "BSE" | "ALL";
  minScore?: number;
  recommendation?: "BUY" | "WATCHLIST" | "AVOID" | "ALL";
  breakoutOnly?: boolean;
  undervaluedOnly?: boolean;
  highGrowthOnly?: boolean;
  pattern?: "VCP" | "CNH" | "RECTANGULAR" | "ATH_BREAKOUT" | "ALL";
  sortBy?: "score" | "price" | "change" | "volume" | "marketCap";
  sortDir?: "asc" | "desc";
}

export interface NSEStock {
  symbol: string;
  name: string;
  yahooSymbol: string;
  sector: string;
  exchange: "NSE" | "BSE";
  isNifty50: boolean;
  isNifty500: boolean;
}
