"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  ColorType,
  LineStyle,
} from "lightweight-charts";
import { OHLCVData } from "@/lib/types";

interface Props {
  data: OHLCVData[];
  height?: number;
  supportLevel?: number;
  resistanceLevel?: number;
  ema20?: number;
  ema50?: number;
  ema200?: number;
}

export default function CandlestickChart({
  data,
  height = 320,
  supportLevel,
  resistanceLevel,
  ema20,
  ema50,
  ema200,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8",
        fontSize: 11,
        fontFamily: "var(--font-geist-mono), monospace",
      },
      grid: {
        vertLines: { color: "rgba(30,45,69,0.4)" },
        horzLines: { color: "rgba(30,45,69,0.4)" },
      },
      crosshair: {
        vertLine: { color: "rgba(59,130,246,0.5)", width: 1 },
        horzLine: { color: "rgba(59,130,246,0.5)", width: 1 },
      },
      rightPriceScale: {
        borderColor: "rgba(30,45,69,0.6)",
        scaleMargins: { top: 0.08, bottom: 0.25 },
      },
      timeScale: {
        borderColor: "rgba(30,45,69,0.6)",
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
    });

    // ── Candles ──
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderUpColor: "#10b981",
      borderDownColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toTime = (ms: number): any => Math.floor(ms / 1000);

    candleSeries.setData(
      data.map((d) => ({
        time: toTime(d.time),
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
    );

    // Support / Resistance price lines
    if (supportLevel && supportLevel > 0) {
      candleSeries.createPriceLine({
        price: supportLevel,
        color: "#10b981",
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: "S",
      });
    }
    if (resistanceLevel && resistanceLevel > 0) {
      candleSeries.createPriceLine({
        price: resistanceLevel,
        color: "#ef4444",
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: "R",
      });
    }

    // ── Volume ──
    const volSeries = chart.addSeries(HistogramSeries, {
      color: "#3b82f6",
      priceFormat: { type: "volume" },
      priceScaleId: "vol",
    });
    chart.priceScale("vol").applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
    volSeries.setData(
      data.map((d) => ({
        time: toTime(d.time),
        value: d.volume,
        color: d.close >= d.open ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)",
      }))
    );

    // ── EMA lines (flat reference lines across visible range) ──
    const firstTime = toTime(data[0].time);
    const lastTime = toTime(data[data.length - 1].time);

    const addEmaLine = (value: number, color: string, title: string) => {
      if (!value || value <= 0) return;
      const s = chart.addSeries(LineSeries, {
        color,
        lineWidth: 1,
        title,
        lastValueVisible: false,
        priceLineVisible: false,
        crosshairMarkerVisible: false,
      });
      s.setData([
        { time: firstTime, value },
        { time: lastTime, value },
      ]);
    };

    addEmaLine(ema20 ?? 0, "#f59e0b", "EMA20");
    addEmaLine(ema50 ?? 0, "#3b82f6", "EMA50");
    addEmaLine(ema200 ?? 0, "#8b5cf6", "EMA200");

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, height, supportLevel, resistanceLevel, ema20, ema50, ema200]);

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-slate-500 text-sm rounded-xl"
        style={{ height, background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
      >
        No chart data available
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: "100%", height }} />;
}
