import { OHLCVData, PatternDetection } from "@/lib/types";

export function detectChartPatterns(
  ohlcv: OHLCVData[],
  week52High: number
): PatternDetection {
  if (ohlcv.length < 20) {
    return { vcp: null, cnh: null, rectangularBreakout: null, athBreakout: null, detectedPatterns: [] };
  }

  const vcp = detectVCP(ohlcv);
  const cnh = detectCupAndHandle(ohlcv);
  const rectangularBreakout = detectRectangularBreakout(ohlcv);
  const athBreakout = detectATHBreakout(ohlcv, week52High);

  const detectedPatterns: string[] = [];
  if (vcp?.detected) detectedPatterns.push("VCP");
  if (cnh?.detected) detectedPatterns.push("CnH");
  if (rectangularBreakout?.detected) detectedPatterns.push("Rectangular");
  if (athBreakout?.detected) detectedPatterns.push("ATH Breakout");

  return { vcp, cnh, rectangularBreakout, athBreakout, detectedPatterns };
}

// ─── VCP — Volatility Contraction Pattern ────────────────────────────────────
// Classic Minervini setup: series of price contractions with declining volume,
// each smaller than the last, ending near the final pivot point.

function detectVCP(ohlcv: OHLCVData[]): PatternDetection["vcp"] {
  const lookback = Math.min(65, ohlcv.length);
  const data = ohlcv.slice(-lookback);

  const pivotHighs: { idx: number; price: number; vol: number }[] = [];
  const pivotLows: { idx: number; price: number }[] = [];

  for (let i = 2; i < data.length - 2; i++) {
    if (
      data[i].high > data[i - 1].high &&
      data[i].high > data[i - 2].high &&
      data[i].high > data[i + 1].high &&
      data[i].high > data[i + 2].high
    ) {
      pivotHighs.push({ idx: i, price: data[i].high, vol: data[i].volume });
    }
    if (
      data[i].low < data[i - 1].low &&
      data[i].low < data[i - 2].low &&
      data[i].low < data[i + 1].low &&
      data[i].low < data[i + 2].low
    ) {
      pivotLows.push({ idx: i, price: data[i].low });
    }
  }

  if (pivotHighs.length < 2) {
    return { detected: false, strength: 0, contractions: 0, pivotPoint: 0 };
  }

  // Count successive declining pivot highs
  let contractionsFound = 0;
  let volumeDecreasing = true;
  for (let i = 1; i < pivotHighs.length; i++) {
    if (pivotHighs[i].price < pivotHighs[i - 1].price) contractionsFound++;
    if (pivotHighs[i].vol > pivotHighs[i - 1].vol) volumeDecreasing = false;
  }

  // Each contraction range should shrink
  const ranges: number[] = [];
  for (let i = 0; i < Math.min(pivotHighs.length, pivotLows.length); i++) {
    const lo = pivotLows[i]?.price ?? pivotHighs[i].price * 0.92;
    ranges.push(pivotHighs[i].price - lo);
  }
  const rangesDecreasing = ranges.length >= 2 && ranges.every((r, i) => i === 0 || r < ranges[i - 1] * 1.1);

  // Current price should be near the most recent pivot (breakout setup)
  const lastHigh = pivotHighs[pivotHighs.length - 1].price;
  const currentPrice = data[data.length - 1].close;
  const nearPivot = currentPrice >= lastHigh * 0.95 && currentPrice <= lastHigh * 1.06;

  // Recent volume should be contracting (drying up before breakout)
  const avgVolRecent = data.slice(-10).reduce((a, b) => a + b.volume, 0) / 10;
  const avgVolEarlier = data.slice(-30, -10).reduce((a, b) => a + b.volume, 0) / 20;
  const volumeContraction = avgVolRecent < avgVolEarlier * 0.85;

  const detected =
    contractionsFound >= 2 &&
    (volumeDecreasing || rangesDecreasing) &&
    nearPivot &&
    (volumeContraction || volumeDecreasing);

  const strength = detected
    ? Math.min(100,
        30 +
        contractionsFound * 12 +
        (volumeDecreasing ? 20 : 0) +
        (rangesDecreasing ? 15 : 0) +
        (volumeContraction ? 10 : 0) +
        (nearPivot ? 5 : 0)
      )
    : 0;

  return {
    detected,
    strength,
    contractions: contractionsFound,
    pivotPoint: parseFloat(lastHigh.toFixed(2)),
  };
}

// ─── Cup and Handle ───────────────────────────────────────────────────────────
// O'Neil/Minervini: rounded U-shaped base followed by a short drift-down handle,
// then breakout above the handle pivot on volume.

function detectCupAndHandle(ohlcv: OHLCVData[]): PatternDetection["cnh"] {
  const lookback = Math.min(100, ohlcv.length);
  if (lookback < 40) {
    return { detected: false, strength: 0, cupDepth: 0, handleDepth: 0, buyPoint: 0 };
  }
  const data = ohlcv.slice(-lookback);
  const n = data.length;

  // Left lip: max in first 40% of data
  const firstPart = data.slice(0, Math.floor(n * 0.4));
  const leftLipPrice = Math.max(...firstPart.map((b) => b.high));

  // Cup base: min in middle 50%
  const midStart = Math.floor(n * 0.2);
  const midEnd = Math.floor(n * 0.75);
  const middle = data.slice(midStart, midEnd);
  const cupBottomPrice = Math.min(...middle.map((b) => b.low));

  const cupDepthPct = ((leftLipPrice - cupBottomPrice) / leftLipPrice) * 100;
  if (cupDepthPct < 10 || cupDepthPct > 55) {
    return { detected: false, strength: 0, cupDepth: parseFloat(cupDepthPct.toFixed(1)), handleDepth: 0, buyPoint: 0 };
  }

  // Right lip: max in last 40%
  const lastPart = data.slice(Math.floor(n * 0.6));
  const rightLipPrice = Math.max(...lastPart.map((b) => b.high));

  const lipGapPct = Math.abs(rightLipPrice - leftLipPrice) / leftLipPrice * 100;
  if (lipGapPct > 15) {
    return { detected: false, strength: 0, cupDepth: parseFloat(cupDepthPct.toFixed(1)), handleDepth: 0, buyPoint: 0 };
  }

  // Handle: last 5-20 bars show a small consolidation/pullback from right lip
  const handleWindow = Math.min(20, Math.floor(n * 0.2));
  const handleBars = data.slice(-handleWindow);
  const handleHigh = Math.max(...handleBars.map((b) => b.high));
  const handleLow = Math.min(...handleBars.map((b) => b.low));
  const handleDepthPct = ((handleHigh - handleLow) / handleHigh) * 100;

  // Handle must be in upper half of cup (above cup midpoint)
  const cupMidpoint = (leftLipPrice + cupBottomPrice) / 2;
  const handleAboveMidpoint = handleLow > cupMidpoint;

  // Cup bottom should be rounded: multiple bars near the base
  const bottomThreshold = cupBottomPrice * 1.08;
  const bottomBars = middle.filter((b) => b.low <= bottomThreshold).length;
  const isRounded = bottomBars >= 4;

  // Volume should be declining in the handle vs the cup
  const cupVol = data.slice(midStart, midEnd).reduce((a, b) => a + b.volume, 0) / middle.length;
  const handleVol = handleBars.reduce((a, b) => a + b.volume, 0) / handleBars.length;
  const handleVolDeclining = handleVol < cupVol * 0.9;

  const detected =
    handleDepthPct >= 3 &&
    handleDepthPct <= 20 &&
    handleAboveMidpoint &&
    isRounded;

  const strength = detected
    ? Math.min(100,
        40 +
        (isRounded ? 15 : 0) +
        (handleAboveMidpoint ? 10 : 0) +
        (handleVolDeclining ? 15 : 0) +
        Math.max(0, 20 - lipGapPct * 1.5)
      )
    : 0;

  return {
    detected,
    strength,
    cupDepth: parseFloat(cupDepthPct.toFixed(1)),
    handleDepth: parseFloat(handleDepthPct.toFixed(1)),
    buyPoint: parseFloat(handleHigh.toFixed(2)),
  };
}

// ─── Rectangular Breakout ─────────────────────────────────────────────────────
// Price consolidates in a tight horizontal range with multiple resistance touches,
// then breaks above with expanding volume.

function detectRectangularBreakout(ohlcv: OHLCVData[]): PatternDetection["rectangularBreakout"] {
  const consolidationBars = Math.min(40, ohlcv.length - 1);
  if (consolidationBars < 10) {
    return { detected: false, strength: 0, resistance: 0, support: 0, breakoutPercent: 0 };
  }

  const consolidation = ohlcv.slice(-(consolidationBars + 1), -1);
  const current = ohlcv[ohlcv.length - 1];

  const resistance = Math.max(...consolidation.map((b) => b.high));
  const support = Math.min(...consolidation.map((b) => b.low));
  const rangePct = ((resistance - support) / resistance) * 100;

  // A valid rectangle has a tight range (2–18%)
  if (rangePct > 18 || rangePct < 2) {
    return { detected: false, strength: 0, resistance: parseFloat(resistance.toFixed(2)), support: parseFloat(support.toFixed(2)), breakoutPercent: 0 };
  }

  // Count distinct resistance and support touches
  const resTol = resistance * 0.015;
  const supTol = support * 0.015;
  const resistanceTouches = consolidation.filter((b) => b.high >= resistance - resTol).length;
  const supportTouches = consolidation.filter((b) => b.low <= support + supTol).length;

  if (resistanceTouches < 2) {
    return { detected: false, strength: 0, resistance: parseFloat(resistance.toFixed(2)), support: parseFloat(support.toFixed(2)), breakoutPercent: 0 };
  }

  const avgVolume = consolidation.reduce((a, b) => a + b.volume, 0) / consolidation.length;
  const volumeRatio = current.volume / (avgVolume || 1);
  const breakoutPercent = ((current.close - resistance) / resistance) * 100;
  const priceBreakout = current.close > resistance * 1.002;
  const volumeConfirmed = volumeRatio > 1.3;

  const detected = priceBreakout && volumeConfirmed;
  const strength = detected
    ? Math.min(100,
        25 +
        resistanceTouches * 8 +
        supportTouches * 5 +
        (volumeRatio > 2.5 ? 30 : volumeRatio > 1.8 ? 20 : 12) +
        Math.min(10, breakoutPercent * 2)
      )
    : 0;

  return {
    detected,
    strength,
    resistance: parseFloat(resistance.toFixed(2)),
    support: parseFloat(support.toFixed(2)),
    breakoutPercent: parseFloat(breakoutPercent.toFixed(2)),
  };
}

// ─── ATH Breakout ─────────────────────────────────────────────────────────────
// Price breaks above or is very close to its 52-week / all-time high with
// above-average volume — momentum continuation setup.

function detectATHBreakout(
  ohlcv: OHLCVData[],
  week52High: number
): PatternDetection["athBreakout"] {
  if (ohlcv.length < 5) {
    return { detected: false, strength: 0, ath52w: week52High, breakoutType: "NEAR_ATH" };
  }

  const current = ohlcv[ohlcv.length - 1];
  const recentHigh = Math.max(...ohlcv.map((b) => b.high));
  const ath = Math.max(week52High || 0, recentHigh);

  const avgVolume = ohlcv.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;
  const volumeRatio = current.volume / (avgVolume || 1);

  const pctFromATH = ath > 0 ? ((ath - current.close) / ath) * 100 : 100;

  let breakoutType: "FRESH_ATH" | "NEAR_ATH" = "NEAR_ATH";
  let detected = false;

  if (current.close >= ath * 0.997 && volumeRatio > 1.2) {
    breakoutType = "FRESH_ATH";
    detected = true;
  } else if (pctFromATH <= 3 && volumeRatio > 0.9) {
    breakoutType = "NEAR_ATH";
    detected = true;
  }

  const strength = detected
    ? Math.min(100,
        (breakoutType === "FRESH_ATH" ? 55 : 35) +
        Math.min(25, volumeRatio * 8) +
        Math.max(0, 20 - pctFromATH * 6)
      )
    : 0;

  return {
    detected,
    strength,
    ath52w: parseFloat(ath.toFixed(2)),
    breakoutType,
  };
}
