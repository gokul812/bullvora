import { FundamentalData } from "@/lib/types";
import { clampScore } from "@/lib/utils";

// ─── Piotroski F-Score (0-9) ──────────────────────────────────────────────────
// 9 binary signals testing profitability, leverage/liquidity, and operating efficiency
// Score 7-9: Strong quality | 4-6: Average | 0-3: Weak / distressed

function computePiotroF(params: {
  roa: number | null;
  operatingCashflow: number | null;
  roe: number | null;
  revenueGrowth: number | null;
  earningsGrowth: number | null;
  debtToEquity: number | null;
  currentRatio: number | null;
  grossMargin: number | null;
}): number {
  let f = 0;
  const { roa, operatingCashflow, roe, revenueGrowth, earningsGrowth, debtToEquity, currentRatio, grossMargin } = params;

  // PROFITABILITY (4 points)
  if (roa !== null && roa > 0) f++;                                           // ROA positive
  if (operatingCashflow !== null && operatingCashflow > 0) f++;               // CFO positive
  if (roe !== null && (roe > 1 ? roe : roe * 100) > 10) f++;                 // ROE > 10%
  if (earningsGrowth !== null && earningsGrowth > 0) f++;                     // EPS growing

  // LEVERAGE / LIQUIDITY (3 points)
  if (debtToEquity !== null && debtToEquity < 1) f++;                        // Low leverage
  if (currentRatio !== null && currentRatio > 1) f++;                        // Liquid
  if (revenueGrowth !== null && revenueGrowth > 0) f++;                      // Revenue growing (proxy for no dilution)

  // OPERATING EFFICIENCY (2 points)
  if (grossMargin !== null && grossMargin > 0.2) f++;                        // Gross margin > 20%
  if (roa !== null && roe !== null && roa > 0.05) f++;                       // Asset efficiency

  return Math.min(f, 9);
}

// ─── Graham Number ─────────────────────────────────────────────────────────────
// Intrinsic value = sqrt(22.5 × EPS × Book Value Per Share)
// Price below Graham Number = margin of safety (Benjamin Graham's formula)

function computeGrahamNumber(eps: number | null, bookValue: number | null): number | null {
  if (!eps || eps <= 0 || !bookValue || bookValue <= 0) return null;
  return Math.sqrt(22.5 * eps * bookValue);
}

// ─── Main Parser ──────────────────────────────────────────────────────────────

export function parseFundamentals(raw: Record<string, unknown> | null | undefined): FundamentalData {
  if (!raw) return getDefaultFundamentals();

  const stats = (raw.defaultKeyStatistics as Record<string, unknown>) || {};
  const financial = (raw.financialData as Record<string, unknown>) || {};
  const summary = (raw.summaryDetail as Record<string, unknown>) || {};
  const income = (raw.incomeStatementHistory as Record<string, unknown>) || {};

  const getVal = (obj: Record<string, unknown>, key: string): number | null => {
    const v = obj[key];
    if (v == null) return null;
    if (typeof v === "number") return v;
    if (typeof v === "object" && v !== null && "raw" in v) return (v as { raw: number }).raw;
    return null;
  };

  const trailingPE = getVal(summary, "trailingPE");
  const forwardPE = getVal(summary, "forwardPE");
  const pbRatio = getVal(stats, "priceToBook");
  const eps = getVal(stats, "trailingEps");
  const bookValue = getVal(stats, "bookValue");
  const roeRaw = getVal(financial, "returnOnEquity");
  const roaRaw = getVal(financial, "returnOnAssets");
  const debtToEquity = getVal(financial, "debtToEquity");
  const revenueGrowth = getVal(financial, "revenueGrowth");
  const earningsGrowth = getVal(financial, "earningsGrowth");
  const dividendYield = getVal(summary, "dividendYield") ?? getVal(summary, "trailingAnnualDividendYield");
  const priceToSales = getVal(summary, "priceToSalesTrailing12Months");
  const currentRatio = getVal(financial, "currentRatio");
  const grossMargins = getVal(financial, "grossMargins");
  const operatingCashflow = getVal(financial, "operatingCashflow");
  const freeCashflow = getVal(financial, "freeCashflow");
  const evToEbitda = getVal(stats, "enterpriseToEbitda");

  // Normalise percentage fields (Yahoo returns as decimal e.g. 0.18 = 18%)
  const roe = roeRaw !== null ? roeRaw * 100 : null;
  const roa = roaRaw !== null ? roaRaw * 100 : null;
  const revenueGrowthPct = revenueGrowth !== null ? revenueGrowth * 100 : null;
  const earningsGrowthPct = earningsGrowth !== null ? earningsGrowth * 100 : null;
  const dividendYieldPct = dividendYield !== null ? dividendYield * 100 : null;
  const grossMarginPct = grossMargins !== null ? grossMargins : null; // already 0-1

  const piotroF = computePiotroF({
    roa: roaRaw,
    operatingCashflow,
    roe: roeRaw,
    revenueGrowth,
    earningsGrowth,
    debtToEquity,
    currentRatio,
    grossMargin: grossMarginPct,
  });

  const grahamNumber = computeGrahamNumber(eps, bookValue);

  const fundamentalScore = computeFundamentalScore({
    peRatio: trailingPE,
    pbRatio,
    roe,
    roa,
    revenueGrowth: revenueGrowthPct,
    earningsGrowth: earningsGrowthPct,
    debtToEquity,
    currentRatio,
    piotroF,
    grahamNumber,
    freeCashflow,
  });

  return {
    peRatio: trailingPE ?? forwardPE ?? null,
    pbRatio,
    eps,
    epsGrowth: earningsGrowthPct,
    revenueGrowth: revenueGrowthPct,
    profitGrowth: earningsGrowthPct,
    debtToEquity,
    roe,
    roce: null,
    roa,
    dividendYield: dividendYieldPct,
    bookValue,
    priceToSales,
    currentRatio,
    promoterHolding: null,
    fiiHolding: null,
    diiHolding: null,
    piotroF,
    grahamNumber,
    evToEbitda,
    operatingCashflow,
    freeCashflow,
    fundamentalScore,
  };
}

function computeFundamentalScore(params: {
  peRatio: number | null;
  pbRatio: number | null;
  roe: number | null;
  roa: number | null;
  revenueGrowth: number | null;
  earningsGrowth: number | null;
  debtToEquity: number | null;
  currentRatio: number | null;
  piotroF: number;
  grahamNumber: number | null;
  freeCashflow: number | null;
}): number {
  let score = 50;
  const { peRatio, pbRatio, roe, roa, revenueGrowth, earningsGrowth, debtToEquity, currentRatio, piotroF, freeCashflow } = params;

  // ── Piotroski F-Score (most reliable quality signal) ──
  if (piotroF >= 8) score += 18;
  else if (piotroF >= 6) score += 10;
  else if (piotroF >= 4) score += 2;
  else score -= 12;

  // ── Valuation ──
  if (peRatio !== null && peRatio > 0) {
    if (peRatio < 12) score += 14;       // deeply undervalued
    else if (peRatio < 20) score += 10;  // fairly valued
    else if (peRatio < 35) score += 4;   // growth premium acceptable
    else if (peRatio < 60) score -= 4;
    else score -= 14;                    // expensive
  }

  if (pbRatio !== null && pbRatio > 0) {
    if (pbRatio < 1) score += 10;        // trading below book value
    else if (pbRatio < 2) score += 6;
    else if (pbRatio < 4) score += 2;
    else if (pbRatio > 10) score -= 8;
  }

  // ── Profitability ──
  if (roe !== null) {
    if (roe > 25) score += 14;           // exceptional ROE (Buffett quality)
    else if (roe > 18) score += 10;
    else if (roe > 12) score += 5;
    else if (roe < 5) score -= 10;
  }

  if (roa !== null) {
    if (roa > 15) score += 8;
    else if (roa > 8) score += 4;
    else if (roa < 2) score -= 6;
  }

  // ── Growth ──
  if (revenueGrowth !== null) {
    if (revenueGrowth > 25) score += 10;
    else if (revenueGrowth > 15) score += 6;
    else if (revenueGrowth > 5) score += 2;
    else if (revenueGrowth < 0) score -= 10;
  }

  if (earningsGrowth !== null) {
    if (earningsGrowth > 30) score += 10;
    else if (earningsGrowth > 20) score += 6;
    else if (earningsGrowth > 10) score += 3;
    else if (earningsGrowth < 0) score -= 12;
  }

  // ── Balance Sheet Health ──
  if (debtToEquity !== null) {
    if (debtToEquity < 0.2) score += 10;   // virtually debt-free
    else if (debtToEquity < 0.5) score += 6;
    else if (debtToEquity < 1) score += 2;
    else if (debtToEquity > 2) score -= 10;
    else score -= 4;
  }

  if (currentRatio !== null) {
    if (currentRatio > 2) score += 6;
    else if (currentRatio > 1.5) score += 3;
    else if (currentRatio < 1) score -= 8;
  }

  // ── Free Cash Flow (businesses that generate real cash) ──
  if (freeCashflow !== null && freeCashflow > 0) score += 6;
  else if (freeCashflow !== null && freeCashflow < 0) score -= 4;

  return clampScore(score);
}

export function getDefaultFundamentals(): FundamentalData {
  return {
    peRatio: null, pbRatio: null, eps: null,
    epsGrowth: null, revenueGrowth: null, profitGrowth: null,
    debtToEquity: null, roe: null, roce: null, roa: null,
    dividendYield: null, bookValue: null, priceToSales: null, currentRatio: null,
    promoterHolding: null, fiiHolding: null, diiHolding: null,
    piotroF: 5, grahamNumber: null, evToEbitda: null,
    operatingCashflow: null, freeCashflow: null,
    fundamentalScore: 50,
  };
}

export function isUndervalued(fundamental: FundamentalData, sectorPE = 25): boolean {
  const { peRatio, pbRatio, roe, grahamNumber } = fundamental;
  let signals = 0;
  if (peRatio !== null && peRatio > 0 && peRatio < sectorPE * 0.7) signals++;
  if (pbRatio !== null && pbRatio > 0 && pbRatio < 1.5) signals++;
  if (roe !== null && (roe > 1 ? roe : roe * 100) > 15) signals++;
  if (grahamNumber !== null && grahamNumber > 0) signals++;  // has intrinsic value
  return signals >= 2;
}

export function isHighGrowth(fundamental: FundamentalData): boolean {
  const { revenueGrowth, profitGrowth, epsGrowth } = fundamental;
  let signals = 0;
  if (revenueGrowth !== null && revenueGrowth > 15) signals++;
  if (profitGrowth !== null && profitGrowth > 15) signals++;
  if (epsGrowth !== null && epsGrowth > 15) signals++;
  return signals >= 2;
}
