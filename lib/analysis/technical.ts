import { OHLCVData, TechnicalIndicators, FibonacciLevels, PivotPoints } from "@/lib/types";
import { clampScore } from "@/lib/utils";

// ─── Core Calculations ────────────────────────────────────────────────────────

export function calculateRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff; else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
  }
  if (avgLoss === 0) return 100;
  return 100 - 100 / (1 + avgGain / avgLoss);
}

export function calculateEMA(values: number[], period: number): number[] {
  if (values.length < period) return values.map(() => values[values.length - 1] || 0);
  const k = 2 / (period + 1);
  const result: number[] = new Array(values.length).fill(0);
  let sum = 0;
  for (let i = 0; i < period; i++) sum += values[i];
  result[period - 1] = sum / period;
  for (let i = period; i < values.length; i++) {
    result[i] = values[i] * k + result[i - 1] * (1 - k);
  }
  return result;
}

export function calculateSMA(values: number[], period: number): number[] {
  const result: number[] = new Array(values.length).fill(0);
  for (let i = period - 1; i < values.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) sum += values[i - j];
    result[i] = sum / period;
  }
  return result;
}

export function calculateMACD(
  closes: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): { macd: number; signal: number; histogram: number; crossover: "BULLISH" | "BEARISH" | "NONE" } {
  if (closes.length < slowPeriod + signalPeriod) {
    return { macd: 0, signal: 0, histogram: 0, crossover: "NONE" };
  }
  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);
  const macdLine = fastEMA.map((f, i) => f - slowEMA[i]);
  const validMacd = macdLine.slice(slowPeriod - 1);
  const signalLine = calculateEMA(validMacd, signalPeriod);

  const lastMacd = validMacd[validMacd.length - 1];
  const prevMacd = validMacd[validMacd.length - 2] ?? lastMacd;
  const lastSignal = signalLine[signalLine.length - 1];
  const prevSignal = signalLine[signalLine.length - 2] ?? lastSignal;

  // Fresh crossover detection (previous bar: macd below signal, current: above = bullish)
  let crossover: "BULLISH" | "BEARISH" | "NONE" = "NONE";
  if (prevMacd <= prevSignal && lastMacd > lastSignal) crossover = "BULLISH";
  else if (prevMacd >= prevSignal && lastMacd < lastSignal) crossover = "BEARISH";

  return { macd: lastMacd, signal: lastSignal, histogram: lastMacd - lastSignal, crossover };
}

// Stochastic Oscillator %K and %D
export function calculateStochastic(
  ohlcv: OHLCVData[],
  kPeriod = 14,
  dPeriod = 3
): { k: number; d: number } {
  if (ohlcv.length < kPeriod) return { k: 50, d: 50 };
  const kValues: number[] = [];
  for (let i = kPeriod - 1; i < ohlcv.length; i++) {
    const slice = ohlcv.slice(i - kPeriod + 1, i + 1);
    const highestHigh = Math.max(...slice.map((c) => c.high));
    const lowestLow = Math.min(...slice.map((c) => c.low));
    const k = highestHigh === lowestLow ? 50 : ((ohlcv[i].close - lowestLow) / (highestHigh - lowestLow)) * 100;
    kValues.push(k);
  }
  const dValues = calculateSMA(kValues, dPeriod);
  return {
    k: kValues[kValues.length - 1],
    d: dValues[dValues.length - 1] || kValues[kValues.length - 1],
  };
}

// ADX — Average Directional Index (trend strength)
export function calculateADX(ohlcv: OHLCVData[], period = 14): number {
  if (ohlcv.length < period * 2) return 20;
  const trList: number[] = [];
  const dmPlus: number[] = [];
  const dmMinus: number[] = [];

  for (let i = 1; i < ohlcv.length; i++) {
    const { high, low, close: c } = ohlcv[i];
    const prevHigh = ohlcv[i - 1].high;
    const prevLow = ohlcv[i - 1].low;
    const prevClose = ohlcv[i - 1].close;

    trList.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)));
    const upMove = high - prevHigh;
    const downMove = prevLow - low;
    dmPlus.push(upMove > downMove && upMove > 0 ? upMove : 0);
    dmMinus.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }

  // Smooth with Wilder's smoothing
  let atr = trList.slice(0, period).reduce((a, b) => a + b, 0);
  let smoothPlus = dmPlus.slice(0, period).reduce((a, b) => a + b, 0);
  let smoothMinus = dmMinus.slice(0, period).reduce((a, b) => a + b, 0);

  const dxValues: number[] = [];
  for (let i = period; i < trList.length; i++) {
    atr = atr - atr / period + trList[i];
    smoothPlus = smoothPlus - smoothPlus / period + dmPlus[i];
    smoothMinus = smoothMinus - smoothMinus / period + dmMinus[i];
    const diPlus = (smoothPlus / atr) * 100;
    const diMinus = (smoothMinus / atr) * 100;
    const dx = diPlus + diMinus === 0 ? 0 : (Math.abs(diPlus - diMinus) / (diPlus + diMinus)) * 100;
    dxValues.push(dx);
  }

  if (dxValues.length < period) return 20;
  return dxValues.slice(-period).reduce((a, b) => a + b, 0) / period;
}

export function calculateBollingerBands(
  closes: number[],
  period = 20,
  multiplier = 2
): { upper: number; middle: number; lower: number } {
  if (closes.length < period) {
    const last = closes[closes.length - 1] || 0;
    return { upper: last * 1.05, middle: last, lower: last * 0.95 };
  }
  const slice = closes.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
  const std = Math.sqrt(variance);
  return { upper: mean + multiplier * std, middle: mean, lower: mean - multiplier * std };
}

export function calculateATR(ohlcv: OHLCVData[], period = 14): number {
  if (ohlcv.length < 2) return 0;
  const trs: number[] = [];
  for (let i = 1; i < ohlcv.length; i++) {
    const { high, low } = ohlcv[i];
    const prevClose = ohlcv[i - 1].close;
    trs.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)));
  }
  return trs.slice(-period).reduce((a, b) => a + b, 0) / Math.min(period, trs.length);
}

// ─── Fibonacci Retracements ───────────────────────────────────────────────────

export function calculateFibonacci(ohlcv: OHLCVData[], lookback = 60): FibonacciLevels {
  if (ohlcv.length < lookback) lookback = ohlcv.length;
  const recent = ohlcv.slice(-lookback);
  const swingHigh = Math.max(...recent.map((c) => c.high));
  const swingLow = Math.min(...recent.map((c) => c.low));
  const range = swingHigh - swingLow;
  return {
    level0: swingHigh,
    level236: swingHigh - 0.236 * range,
    level382: swingHigh - 0.382 * range,
    level500: swingHigh - 0.500 * range,
    level618: swingHigh - 0.618 * range,   // golden ratio — key support zone
    level786: swingHigh - 0.786 * range,
    level100: swingLow,
  };
}

// ─── Pivot Points (standard formula) ─────────────────────────────────────────

export function calculatePivotPoints(ohlcv: OHLCVData[]): PivotPoints {
  const prev = ohlcv.length >= 2 ? ohlcv[ohlcv.length - 2] : ohlcv[ohlcv.length - 1];
  const pp = (prev.high + prev.low + prev.close) / 3;
  return {
    pp,
    r1: 2 * pp - prev.low,
    r2: pp + (prev.high - prev.low),
    r3: prev.high + 2 * (pp - prev.low),
    s1: 2 * pp - prev.high,
    s2: pp - (prev.high - prev.low),
    s3: prev.low - 2 * (prev.high - pp),
  };
}

// ─── Support / Resistance via swing points ────────────────────────────────────

export function findSupportResistance(ohlcv: OHLCVData[], lookback = 50): { support: number; resistance: number } {
  const n = Math.min(lookback, ohlcv.length);
  if (n < 5) {
    const last = ohlcv[ohlcv.length - 1];
    return { support: last?.low || 0, resistance: last?.high || 0 };
  }
  const recent = ohlcv.slice(-n);
  // Find pivot highs and lows (point higher/lower than its 2 neighbours)
  const pivotHighs: number[] = [];
  const pivotLows: number[] = [];
  for (let i = 2; i < recent.length - 2; i++) {
    const c = recent[i];
    if (c.high > recent[i-1].high && c.high > recent[i-2].high &&
        c.high > recent[i+1].high && c.high > recent[i+2].high) {
      pivotHighs.push(c.high);
    }
    if (c.low < recent[i-1].low && c.low < recent[i-2].low &&
        c.low < recent[i+1].low && c.low < recent[i+2].low) {
      pivotLows.push(c.low);
    }
  }
  const lastClose = recent[recent.length - 1].close;
  const relevantHighs = pivotHighs.filter(h => h > lastClose).sort((a,b) => a-b);
  const relevantLows = pivotLows.filter(l => l < lastClose).sort((a,b) => b-a);
  return {
    resistance: relevantHighs[0] ?? Math.max(...recent.map(c => c.high)),
    support: relevantLows[0] ?? Math.min(...recent.map(c => c.low)),
  };
}

// ─── Breakout Detection ───────────────────────────────────────────────────────

export function detectBreakout(
  ohlcv: OHLCVData[],
  lookback = 20
): { detected: boolean; strength: number; resistance: number } {
  if (ohlcv.length < lookback + 1) return { detected: false, strength: 0, resistance: 0 };
  const recent = ohlcv.slice(-lookback - 1, -1);
  const current = ohlcv[ohlcv.length - 1];
  const resistance = Math.max(...recent.map((c) => c.high));
  const avgVolume = recent.reduce((a, b) => a + b.volume, 0) / recent.length;
  const volumeRatio = current.volume / (avgVolume || 1);
  const priceBreakout = current.close > resistance;
  const volumeConfirmation = volumeRatio > 1.5;
  if (!priceBreakout) return { detected: false, strength: 0, resistance };
  const breakoutPercent = ((current.close - resistance) / resistance) * 100;
  const strength = Math.min(100, breakoutPercent * 10 + (volumeConfirmation ? 30 : 0));
  return { detected: priceBreakout && volumeConfirmation, strength, resistance };
}

// ─── Main Analysis Entry Point ────────────────────────────────────────────────

export function runTechnicalAnalysis(ohlcv: OHLCVData[]): TechnicalIndicators {
  if (ohlcv.length < 5) return getDefaultTechnical();

  const closes = ohlcv.map((c) => c.close);
  const current = ohlcv[ohlcv.length - 1];

  // RSI
  const rsi = calculateRSI(closes);
  const rsiSignal: TechnicalIndicators["rsiSignal"] =
    rsi >= 70 ? "OVERBOUGHT" :
    rsi <= 30 ? "OVERSOLD" :
    rsi >= 55 ? "BULLISH_ZONE" :
    rsi <= 45 ? "BEARISH_ZONE" : "NEUTRAL";

  // Stochastic
  const { k: stochasticK, d: stochasticD } = calculateStochastic(ohlcv);
  const stochasticSignal: TechnicalIndicators["stochasticSignal"] =
    stochasticK >= 80 ? "OVERBOUGHT" : stochasticK <= 20 ? "OVERSOLD" : "NEUTRAL";

  // MACD
  const { macd, signal, histogram, crossover: macdCrossover } = calculateMACD(closes);

  // ADX
  const adx = calculateADX(ohlcv);
  const adxTrend: TechnicalIndicators["adxTrend"] = adx >= 25 ? "STRONG" : adx >= 15 ? "WEAK" : "SIDEWAYS";

  // Moving averages
  const ema20arr = calculateEMA(closes, 20);
  const ema50arr = calculateEMA(closes, 50);
  const ema200arr = calculateEMA(closes, 200);
  const sma20arr = calculateSMA(closes, 20);
  const sma50arr = calculateSMA(closes, 50);
  const sma200arr = calculateSMA(closes, 200);

  const ema20 = ema20arr[ema20arr.length - 1];
  const ema50 = ema50arr[ema50arr.length - 1];
  const ema200 = ema200arr[ema200arr.length - 1];
  const sma20 = sma20arr[sma20arr.length - 1];
  const sma50 = sma50arr[sma50arr.length - 1];
  const sma200 = sma200arr[sma200arr.length - 1];

  // Bollinger Bands
  const bb = calculateBollingerBands(closes);
  const bbRange = bb.upper - bb.lower;
  const bollingerPosition: TechnicalIndicators["bollingerPosition"] =
    current.close > bb.upper ? "ABOVE_UPPER" :
    current.close > bb.middle ? "UPPER_HALF" :
    current.close > bb.lower ? "LOWER_HALF" : "BELOW_LOWER";

  // ATR
  const atr = calculateATR(ohlcv);
  const atrPercent = (atr / current.close) * 100;

  // Volume
  const volumes = ohlcv.map((c) => c.volume);
  const avgVol = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const volumeRatio = current.volume / (avgVol || 1);

  // MA relationships
  const priceAboveEma20 = current.close > ema20;
  const priceAboveEma50 = current.close > ema50;
  const priceAboveEma200 = current.close > ema200;

  // Cross signals
  const prevEma50 = ema50arr.length > 2 ? ema50arr[ema50arr.length - 2] : ema50;
  const prevEma200 = ema200arr.length > 2 ? ema200arr[ema200arr.length - 2] : ema200;
  const goldenCross = ema50 > ema200 && prevEma50 <= prevEma200;
  const deathCross = ema50 < ema200 && prevEma50 >= prevEma200;

  // Breakout
  const { detected: breakoutDetected, strength: breakoutStrength, resistance } = detectBreakout(ohlcv);
  const { support } = findSupportResistance(ohlcv);

  // Fibonacci
  const fibonacci = calculateFibonacci(ohlcv);

  // Pivot Points
  const pivotPoints = calculatePivotPoints(ohlcv);

  // Trend determination (multi-factor)
  let bullCount = 0, bearCount = 0;
  if (priceAboveEma50) bullCount++; else bearCount++;
  if (priceAboveEma200) bullCount++; else bearCount++;
  if (histogram > 0) bullCount++; else bearCount++;
  if (rsi > 50) bullCount++; else bearCount++;
  if (current.close > sma50) bullCount++; else bearCount++;

  const trend: TechnicalIndicators["trend"] = bullCount >= 4 ? "BULLISH" : bearCount >= 4 ? "BEARISH" : "NEUTRAL";
  const trendStrength = Math.round((Math.max(bullCount, bearCount) / 5) * 100);

  // ─── Technical Score (professional trader logic) ──────────────────────────
  let technicalScore = 50;

  // Trend alignment (most important — trade with the trend)
  if (trend === "BULLISH") technicalScore += 12;
  else if (trend === "BEARISH") technicalScore -= 12;

  // RSI: Best buy zones are 40-60 (pullback in uptrend), NOT 70+ (overbought)
  if (rsi >= 40 && rsi <= 60) technicalScore += 10;  // healthy momentum zone
  else if (rsi >= 30 && rsi < 40) technicalScore += 8;  // oversold bounce opportunity
  else if (rsi > 60 && rsi < 70) technicalScore += 5;   // gaining momentum
  else if (rsi >= 70) technicalScore -= 10;             // overbought — avoid chasing
  else if (rsi < 30) technicalScore -= 5;               // may continue falling

  // MACD crossover = highest quality signal
  if (macdCrossover === "BULLISH") technicalScore += 15;
  else if (macdCrossover === "BEARISH") technicalScore -= 15;
  else if (histogram > 0 && macd > 0) technicalScore += 6;
  else if (histogram < 0 && macd < 0) technicalScore -= 6;
  else if (histogram > 0) technicalScore += 3;  // improving but below zero line

  // Stochastic — confirms RSI
  if (stochasticK <= 20 && stochasticK > stochasticD) technicalScore += 8;  // oversold + turning up
  else if (stochasticK >= 80) technicalScore -= 8;  // overbought

  // ADX trend strength
  if (adx >= 25 && trend === "BULLISH") technicalScore += 8;
  else if (adx >= 25 && trend === "BEARISH") technicalScore -= 8;
  else if (adx < 15) technicalScore -= 3;  // choppy, no clear trend

  // EMA structure
  if (priceAboveEma20 && priceAboveEma50 && priceAboveEma200) technicalScore += 8;
  else if (!priceAboveEma50 && !priceAboveEma200) technicalScore -= 8;

  // Cross signals
  if (goldenCross) technicalScore += 12;
  if (deathCross) technicalScore -= 12;

  // Breakout with volume confirmation
  if (breakoutDetected) technicalScore += 12;
  else if (current.close > resistance * 0.97) technicalScore += 4;  // approaching resistance

  // Bollinger — near lower band in uptrend = buy zone
  if (bollingerPosition === "LOWER_HALF" && trend === "BULLISH") technicalScore += 5;
  else if (bollingerPosition === "ABOVE_UPPER") technicalScore -= 5;  // extended

  // Volume surge
  if (volumeRatio > 2.5) technicalScore += 8;
  else if (volumeRatio > 1.5) technicalScore += 4;
  else if (volumeRatio < 0.5) technicalScore -= 4;

  return {
    rsi14: rsi,
    rsiSignal,
    stochasticK,
    stochasticD,
    stochasticSignal,
    macd: { macd, signal, histogram },
    macdCrossover,
    adx,
    adxTrend,
    ema20, ema50, ema200,
    sma20, sma50, sma200,
    bollingerBands: bb,
    bollingerPosition,
    atr,
    atrPercent,
    volumeRatio,
    priceAboveEma20,
    priceAboveEma50,
    priceAboveEma200,
    goldenCross,
    deathCross,
    breakoutDetected,
    breakoutStrength,
    trend,
    trendStrength,
    supportLevel: support,
    resistanceLevel: resistance,
    fibonacci,
    pivotPoints,
    technicalScore: clampScore(technicalScore),
  };
}

// ─── Trade Setup Builder ──────────────────────────────────────────────────────

export function buildTradeSetup(
  price: number,
  technical: TechnicalIndicators
): import("@/lib/types").TradeSetup {
  const { atr, supportLevel, resistanceLevel, breakoutDetected, trend, fibonacci } = technical;
  const atrSafe = atr > 0 ? atr : price * 0.02;

  // Entry logic: breakout = entry at current price, pullback = entry near EMA20/support
  let tradeType: import("@/lib/types").TradeSetup["tradeType"] = "MOMENTUM";
  let entryPrice = price;
  let entryZoneLow = price * 0.99;
  let entryZoneHigh = price * 1.005;

  if (breakoutDetected) {
    tradeType = "BREAKOUT";
    entryPrice = price;
    entryZoneLow = price * 0.995;
    entryZoneHigh = price * 1.01;
  } else if (trend === "BULLISH" && technical.priceAboveEma50) {
    // Pullback to EMA20 is the ideal entry
    tradeType = "PULLBACK_BUY";
    const ema20Entry = technical.ema20;
    entryPrice = Math.min(price, ema20Entry * 1.005);
    entryZoneLow = Math.max(supportLevel, fibonacci.level618);
    entryZoneHigh = technical.ema20 * 1.01;
  } else if (technical.rsiSignal === "OVERSOLD" || technical.stochasticSignal === "OVERSOLD") {
    tradeType = "REVERSAL";
    entryPrice = price;
    entryZoneLow = supportLevel * 0.995;
    entryZoneHigh = price * 1.005;
  }

  // Stop loss: 1.5x ATR below entry OR below nearest support — whichever is tighter for risk
  const atrSL = entryPrice - 1.5 * atrSafe;
  const supportSL = supportLevel * 0.995;
  const stopLoss = Math.max(atrSL, supportSL, entryPrice * 0.92); // never more than 8% loss

  const risk = entryPrice - stopLoss;
  const stopLossPercent = (risk / entryPrice) * 100;

  // Targets based on R:R multiples
  const target1 = entryPrice + risk * 1.5;   // 1:1.5
  const target2 = entryPrice + risk * 2.5;   // 1:2.5
  const target3 = Math.min(
    entryPrice + risk * 4.0,                  // 1:4
    resistanceLevel > entryPrice ? resistanceLevel : entryPrice + risk * 4.0
  );

  const riskRewardT2 = risk > 0 ? parseFloat(((target2 - entryPrice) / risk).toFixed(1)) : 0;

  // Timeframe based on ATR%: high volatility = swing, low = positional
  const timeframe: import("@/lib/types").TradeSetup["timeframe"] =
    breakoutDetected ? "SWING" :
    technical.atrPercent > 3 ? "SWING" :
    technical.atrPercent > 1.5 ? "POSITIONAL" : "LONG_TERM";

  return {
    entryPrice: parseFloat(entryPrice.toFixed(2)),
    entryZoneLow: parseFloat(entryZoneLow.toFixed(2)),
    entryZoneHigh: parseFloat(entryZoneHigh.toFixed(2)),
    stopLoss: parseFloat(stopLoss.toFixed(2)),
    stopLossPercent: parseFloat(stopLossPercent.toFixed(2)),
    target1: parseFloat(target1.toFixed(2)),
    target2: parseFloat(target2.toFixed(2)),
    target3: parseFloat(target3.toFixed(2)),
    riskRewardT2,
    tradeType,
    timeframe,
    atrStopLoss: parseFloat(atrSL.toFixed(2)),
    maxLossPercent: parseFloat(stopLossPercent.toFixed(2)),
    invalidationLevel: parseFloat((stopLoss * 0.995).toFixed(2)),
  };
}

function getDefaultTechnical(): TechnicalIndicators {
  const emptyFib: FibonacciLevels = { level0: 0, level236: 0, level382: 0, level500: 0, level618: 0, level786: 0, level100: 0 };
  const emptyPivot: PivotPoints = { pp: 0, r1: 0, r2: 0, r3: 0, s1: 0, s2: 0, s3: 0 };
  return {
    rsi14: 50, rsiSignal: "NEUTRAL",
    stochasticK: 50, stochasticD: 50, stochasticSignal: "NEUTRAL",
    macd: { macd: 0, signal: 0, histogram: 0 }, macdCrossover: "NONE",
    adx: 20, adxTrend: "SIDEWAYS",
    ema20: 0, ema50: 0, ema200: 0,
    sma20: 0, sma50: 0, sma200: 0,
    bollingerBands: { upper: 0, middle: 0, lower: 0 }, bollingerPosition: "LOWER_HALF",
    atr: 0, atrPercent: 0,
    volumeRatio: 1,
    priceAboveEma20: false, priceAboveEma50: false, priceAboveEma200: false,
    goldenCross: false, deathCross: false,
    breakoutDetected: false, breakoutStrength: 0,
    trend: "NEUTRAL", trendStrength: 50,
    supportLevel: 0, resistanceLevel: 0,
    fibonacci: emptyFib, pivotPoints: emptyPivot,
    technicalScore: 50,
  };
}
