import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowUpRight, Info } from "lucide-react";
import { type BotData } from "@/data/bots";
import { useI18n } from "@/lib/i18n";

interface BacktestTier {
  deposit: number; // 50 | 100 | 200 | 500 | 1000
  period: number; // 60 | 365
  depositLabel: string;
  subtitle: string;
  profitUsdt: string;
  profitPercent: string;
  startBalance: string;
  endBalance: string;
  openCountText?: string;
  tradesCount: number;
  winRate: string;
  profitFactor: string;
  maxDrawdown: string;
  commissions: string;
  datesLabel: string;
  dateTicks: [string, string, string, string];
  chartTitle: string;
  yTicks: number[];
  drawdownMax: string;
  drawdownScale: string;
  hasCheckpoint?: boolean;
  closures: { label: string; count: number; sum: string }[];
  coins: { pair: string; pnl: string }[];
  openPositions?: { pair: string; side: "LONG" | "SHORT"; avg: string; status: string }[];
  equityPoints: { day: number; date: string; equity: number; dd: number }[];
}

// 1. Helper: 60-day curve for 50$ & 100$ backtests (reconstructed from user's REAL #3 screenshots)
function buildCurve60Real(startBal: number, topVal: number, bottomVal: number, endBal: number, maxDd: number) {
  const dates = [
    "25.09", "29.09", "03.10", "07.10", "11.10", "15.10",
    "19.10", "23.10", "27.10", "31.10", "04.11", "08.11",
    "12.11", "16.11", "20.11", "24.11"
  ];
  // Normalized profile: starts at startBal, climbs to peak near 15.10, sharp drop around 18.10,
  // rallies back to upper range, drifts downwards in mid-Nov, touches bottomVal near end.
  const profile = [
    { p: 0.00, f: 0.38, dd: 0 },
    { p: 0.08, f: 0.52, dd: -1.2 },
    { p: 0.15, f: 0.46, dd: -4.5 },
    { p: 0.22, f: 0.65, dd: -2.0 },
    { p: 0.30, f: 0.78, dd: -1.5 },
    { p: 0.35, f: 0.96, dd: 0 }, // peak ~15.10
    { p: 0.38, f: 0.28, dd: maxDd }, // sharp plunge
    { p: 0.42, f: 0.72, dd: -12.0 },
    { p: 0.48, f: 0.88, dd: -4.0 },
    { p: 0.55, f: 0.82, dd: -8.5 },
    { p: 0.62, f: 0.68, dd: -16.0 },
    { p: 0.70, f: 0.62, dd: -22.0 },
    { p: 0.78, f: 0.48, dd: -31.0 },
    { p: 0.85, f: 0.36, dd: -38.5 },
    { p: 0.92, f: 0.18, dd: maxDd * 0.95 },
    { p: 1.00, f: 0.22, dd: maxDd * 0.90 },
  ];

  const spread = topVal - bottomVal;
  return profile.map((pt, i) => ({
    day: Math.round(pt.p * 60),
    date: dates[i % dates.length],
    equity: Math.round((bottomVal + spread * pt.f) * 100) / 100,
    dd: pt.dd,
  }));
}

// 2. Helper: 365-day curve for 50$ & 100$ backtests (winter consolidation -> massive summer rally -> autumn consolidation)
function buildCurve365Real(startBal: number, topVal: number, bottomVal: number, maxDd: number) {
  const dates = [
    "24.11", "24.12", "24.01", "24.02", "26.03", "25.04",
    "25.05", "25.06", "25.07", "25.08", "25.09", "25.10", "24.11"
  ];
  const profile = [
    { p: 0.00, f: 0.75, dd: 0 },
    { p: 0.10, f: 0.55, dd: -18.0 },
    { p: 0.20, f: 0.35, dd: -42.0 },
    { p: 0.30, f: 0.18, dd: -68.0 },
    { p: 0.35, f: 0.12, dd: maxDd }, // trough ~26.03
    { p: 0.45, f: 0.38, dd: -48.0 },
    { p: 0.55, f: 0.58, dd: -25.0 },
    { p: 0.68, f: 0.88, dd: -10.0 },
    { p: 0.74, f: 0.98, dd: 0 }, // peak ~25.07
    { p: 0.82, f: 0.82, dd: -15.0 },
    { p: 0.90, f: 0.62, dd: -44.0 },
    { p: 0.95, f: 0.42, dd: -65.0 },
    { p: 1.00, f: 0.46, dd: maxDd * 0.85 },
  ];

  const spread = topVal - bottomVal;
  return profile.map((pt, i) => ({
    day: Math.round(pt.p * 365),
    date: dates[i % dates.length],
    equity: Math.round((bottomVal + spread * pt.f) * 100) / 100,
    dd: pt.dd,
  }));
}

// 3. Helper: 60-day curve for 200$, 500$, 1000$ (with checkpoint at 31.10)
function buildCurveOld(topTick: number, bottomTick: number, maxDd: number) {
  const dates = [
    "21.09", "23.09", "25.09", "27.09", "29.09", "01.10", "03.10", "05.10",
    "07.10", "09.10", "11.10", "13.10", "15.10", "17.10", "19.10", "21.10",
    "23.10", "25.10", "27.10", "29.10", "31.10", "02.11", "04.11", "06.11",
    "08.11", "10.11", "12.11", "14.11", "16.11", "18.11", "20.11"
  ];
  const spread = topTick - bottomTick;
  const pattern = [
    { p: 0.00, frac: 0.08, dd: 0 },
    { p: 0.04, frac: 0.12, dd: -0.8 },
    { p: 0.08, frac: 0.18, dd: -1.5 },
    { p: 0.12, frac: 0.24, dd: -2.0 },
    { p: 0.16, frac: 0.32, dd: -1.2 },
    { p: 0.21, frac: 0.39, dd: -3.5 },
    { p: 0.26, frac: 0.44, dd: -2.1 },
    { p: 0.30, frac: 0.52, dd: -4.0 },
    { p: 0.34, frac: 0.59, dd: -1.8 },
    { p: 0.38, frac: 0.63, dd: -7.5 },
    { p: 0.41, frac: 0.56, dd: -14.2 },
    { p: 0.45, frac: 0.67, dd: -5.2 },
    { p: 0.50, frac: 0.74, dd: -3.1 },
    { p: 0.55, frac: 0.81, dd: -2.0 },
    { p: 0.61, frac: 0.87, dd: -1.4 },
    { p: 0.66, frac: 0.94, dd: -0.6 },
    { p: 0.69, frac: 0.79, dd: -12.8 },
    { p: 0.71, frac: 0.68, dd: maxDd },
    { p: 0.74, frac: 0.64, dd: maxDd * 0.96 },
    { p: 0.78, frac: 0.71, dd: -16.4 },
    { p: 0.82, frac: 0.78, dd: -9.8 },
    { p: 0.86, frac: 0.85, dd: -5.1 },
    { p: 0.89, frac: 0.80, dd: -13.9 },
    { p: 0.93, frac: 0.88, dd: -4.0 },
    { p: 0.97, frac: 0.96, dd: -1.2 },
    { p: 1.00, frac: 0.98, dd: 0 },
  ];

  return pattern.map((pt) => {
    const dateIdx = Math.min(Math.floor(pt.p * (dates.length - 1)), dates.length - 1);
    const equityVal = Math.round((bottomTick + spread * pt.frac) * 100) / 100;
    return {
      day: Math.round(pt.p * 60),
      date: dates[dateIdx],
      equity: equityVal,
      dd: pt.dd,
    };
  });
}

// Complete backtest catalog matching user screenshots and numbers
const BACKTEST_CATALOG: Record<string, BacktestTier> = {
  // 50$ · 60 ДНЕЙ
  "50_60": {
    deposit: 50,
    period: 60,
    depositLabel: "50.00",
    subtitle: "Bybit · REAL #3 · старт 50.00 USDT · позиций одновременно: 2 · проскальзывание ×1 · лонг и шорт",
    profitUsdt: "+17.58 USDT",
    profitPercent: "+35.17%",
    startBalance: "50.00",
    endBalance: "67.58",
    openCountText: "ещё в сделке: 2 поз. (в итог не входят)",
    tradesCount: 70,
    winRate: "100%",
    profitFactor: "—",
    maxDrawdown: "-43.1%",
    commissions: "4",
    datesLabel: "25.09.2026 — 24.11.2026 · монет: 22",
    dateTicks: ["25.09", "15.10", "04.11", "24.11"],
    chartTitle: "Баланс (с учётом плавающего результата открытых позиций)",
    yTicks: [65, 57, 50, 42, 34],
    drawdownMax: "-43.1%",
    drawdownScale: "-48%",
    hasCheckpoint: false,
    closures: [
      { label: "трейлинг-стоп", count: 62, sum: "+11.54" },
      { label: "Take Profit", count: 8, sum: "+6.04" },
    ],
    openPositions: [
      { pair: "DOT/USDT", side: "LONG", avg: "усредн. 3", status: "в позиции" },
      { pair: "NOT/USDT", side: "SHORT", avg: "усредн. 3", status: "в позиции" },
    ],
    coins: [
      { pair: "TRX/USDT", pnl: "+3.47" },
      { pair: "DOT/USDT", pnl: "+2.11" },
      { pair: "XTZ/USDT", pnl: "+1.73" },
      { pair: "TIA/USDT", pnl: "+1.53" },
      { pair: "LINK/USDT", pnl: "+1.41" },
      { pair: "DASH/USDT", pnl: "+1.39" },
      { pair: "ATOM/USDT", pnl: "+1.01" },
      { pair: "1INCH/USDT", pnl: "+0.82" },
      { pair: "HYPE/USDT", pnl: "+0.78" },
      { pair: "APT/USDT", pnl: "+0.77" },
      { pair: "SUSHI/USDT", pnl: "+0.55" },
      { pair: "NEAR/USDT", pnl: "+0.50" },
      { pair: "SEI/USDT", pnl: "+0.43" },
      { pair: "DOGE/USDT", pnl: "+0.24" },
      { pair: "ADA/USDT", pnl: "+0.23" },
      { pair: "SOL/USDT", pnl: "+0.16" },
      { pair: "ETC/USDT", pnl: "+0.14" },
      { pair: "HBAR/USDT", pnl: "+0.11" },
      { pair: "XLM/USDT", pnl: "+0.10" },
      { pair: "LTC/USDT", pnl: "+0.09" },
      { pair: "NOT/USDT", pnl: "+0.00" },
      { pair: "SUI/USDT", pnl: "+0.00" },
    ],
    equityPoints: buildCurve60Real(50, 65, 34, 67.58, -43.1),
  },

  // 50$ · 365 ДНЕЙ
  "50_365": {
    deposit: 50,
    period: 365,
    depositLabel: "50.00",
    subtitle: "Bybit · REAL #3 · старт 50.00 USDT · позиций одновременно: 2 · проскальзывание ×1 · лонг и шорт",
    profitUsdt: "+78.41 USDT",
    profitPercent: "+156.81%",
    startBalance: "50.00",
    endBalance: "128.41",
    openCountText: "ещё в сделке: 2 поз. (в итог не входят)",
    tradesCount: 233,
    winRate: "100%",
    profitFactor: "16991.73",
    maxDrawdown: "-88.7%",
    commissions: "17",
    datesLabel: "24.11.2025 — 24.11.2026 · монет: 21",
    dateTicks: ["24.11", "26.03", "25.07", "24.11"],
    chartTitle: "Баланс (с учётом плавающего результата открытых позиций)",
    yTicks: [130, 100, 75, 50, 15],
    drawdownMax: "-88.7%",
    drawdownScale: "-95%",
    hasCheckpoint: false,
    closures: [
      { label: "трейлинг-стоп", count: 198, sum: "+49.71" },
      { label: "Take Profit", count: 35, sum: "+28.69" },
    ],
    openPositions: [
      { pair: "APT/USDT", side: "LONG", avg: "усредн. 3", status: "в позиции" },
      { pair: "NOT/USDT", side: "SHORT", avg: "усредн. 3", status: "в позиции" },
    ],
    coins: [
      { pair: "DASH/USDT", pnl: "+8.54" },
      { pair: "TRX/USDT", pnl: "+7.88" },
      { pair: "ADA/USDT", pnl: "+6.12" },
      { pair: "1INCH/USDT", pnl: "+5.15" },
      { pair: "ATOM/USDT", pnl: "+4.30" },
      { pair: "HYPE/USDT", pnl: "+4.22" },
      { pair: "LTC/USDT", pnl: "+4.10" },
      { pair: "XLM/USDT", pnl: "+3.95" },
      { pair: "XTZ/USDT", pnl: "+3.88" },
      { pair: "NEAR/USDT", pnl: "+3.72" },
      { pair: "HBAR/USDT", pnl: "+3.65" },
      { pair: "NOT/USDT", pnl: "+3.20" },
      { pair: "ETC/USDT", pnl: "+3.10" },
      { pair: "DOT/USDT", pnl: "+2.95" },
      { pair: "TIA/USDT", pnl: "+2.55" },
      { pair: "SEI/USDT", pnl: "+2.40" },
      { pair: "SOL/USDT", pnl: "+2.35" },
      { pair: "LINK/USDT", pnl: "+2.30" },
      { pair: "APT/USDT", pnl: "+2.15" },
      { pair: "SUI/USDT", pnl: "+1.95" },
      { pair: "DOGE/USDT", pnl: "+1.95" },
    ],
    equityPoints: buildCurve365Real(50, 130, 15, -88.7),
  },

  // 100$ · 60 ДНЕЙ
  "100_60": {
    deposit: 100,
    period: 60,
    depositLabel: "100.00",
    subtitle: "Bybit · REAL #3 · старт 100.00 USDT · позиций одновременно: 5 · проскальзывание ×1 · лонг и шорт",
    profitUsdt: "+36.41 USDT",
    profitPercent: "+36.41%",
    startBalance: "100.00",
    endBalance: "136.41",
    openCountText: "ещё в сделке: 4 поз. (в итог не входят)",
    tradesCount: 131,
    winRate: "99%",
    profitFactor: "74075.97",
    maxDrawdown: "-79.9%",
    commissions: "8",
    datesLabel: "25.09.2026 — 24.11.2026 · монет: 22",
    dateTicks: ["25.09", "15.10", "04.11", "24.11"],
    chartTitle: "Баланс (с учётом плавающего результата открытых позиций)",
    yTicks: [127, 99, 72, 44, 17],
    drawdownMax: "-79.9%",
    drawdownScale: "-90%",
    hasCheckpoint: false,
    closures: [
      { label: "трейлинг-стоп", count: 111, sum: "+21.85" },
      { label: "Take Profit", count: 20, sum: "+14.55" },
    ],
    openPositions: [
      { pair: "1INCH/USDT", side: "LONG", avg: "усредн. 3", status: "в позиции" },
      { pair: "ADA/USDT", side: "LONG", avg: "усредн. 3", status: "в позиции" },
      { pair: "DOT/USDT", side: "LONG", avg: "усредн. 3", status: "в позиции" },
      { pair: "SUSHI/USDT", side: "LONG", avg: "усредн. 3", status: "в позиции" },
    ],
    coins: [
      { pair: "APT/USDT", pnl: "+4.03" },
      { pair: "TRX/USDT", pnl: "+3.47" },
      { pair: "DOT/USDT", pnl: "+2.80" },
      { pair: "ATOM/USDT", pnl: "+2.55" },
      { pair: "DASH/USDT", pnl: "+2.31" },
      { pair: "LINK/USDT", pnl: "+2.26" },
      { pair: "NEAR/USDT", pnl: "+2.11" },
      { pair: "LTC/USDT", pnl: "+2.08" },
      { pair: "ADA/USDT", pnl: "+1.82" },
      { pair: "XTZ/USDT", pnl: "+1.79" },
      { pair: "TIA/USDT", pnl: "+1.65" },
      { pair: "DOGE/USDT", pnl: "+1.59" },
      { pair: "ETC/USDT", pnl: "+1.47" },
      { pair: "SEI/USDT", pnl: "+1.37" },
      { pair: "SOL/USDT", pnl: "+1.11" },
      { pair: "XLM/USDT", pnl: "+0.94" },
      { pair: "SUSHI/USDT", pnl: "+0.82" },
      { pair: "HYPE/USDT", pnl: "+0.80" },
      { pair: "1INCH/USDT", pnl: "+0.58" },
      { pair: "NOT/USDT", pnl: "+0.53" },
      { pair: "HBAR/USDT", pnl: "+0.24" },
      { pair: "SUI/USDT", pnl: "+0.10" },
    ],
    equityPoints: buildCurve60Real(100, 127, 17, 136.41, -79.9),
  },

  // 100$ · 365 ДНЕЙ
  "100_365": {
    deposit: 100,
    period: 365,
    depositLabel: "100.00",
    subtitle: "Bybit · REAL #3 · старт 100.00 USDT · позиций одновременно: 4 · проскальзывание ×1 · лонг и шорт",
    profitUsdt: "+85.35 USDT",
    profitPercent: "+85.35%",
    startBalance: "100.00",
    endBalance: "185.35",
    openCountText: "ещё в сделке: 4 поз. (в итог не входят)",
    tradesCount: 308,
    winRate: "99%",
    profitFactor: "589.22",
    maxDrawdown: "-81.5%",
    commissions: "19",
    datesLabel: "24.11.2025 — 24.11.2026 · монет: 22",
    dateTicks: ["24.11", "26.03", "25.07", "24.11"],
    chartTitle: "Баланс (с учётом плавающего результата открытых позиций)",
    yTicks: [122, 95, 67, 39, 11],
    drawdownMax: "-81.5%",
    drawdownScale: "-93%",
    hasCheckpoint: false,
    closures: [
      { label: "трейлинг-стоп", count: 256, sum: "+53.54" },
      { label: "Take Profit", count: 52, sum: "+31.81" },
    ],
    openPositions: [
      { pair: "ADA/USDT", side: "LONG", avg: "усредн. 3", status: "в позиции" },
      { pair: "APT/USDT", side: "LONG", avg: "усредн. 3", status: "в позиции" },
      { pair: "SUSHI/USDT", side: "LONG", avg: "усредн. 3", status: "в позиции" },
      { pair: "LINK/USDT", side: "SHORT", avg: "усредн. 1", status: "в позиции" },
    ],
    coins: [
      { pair: "TRX/USDT", pnl: "+8.88" },
      { pair: "DASH/USDT", pnl: "+8.15" },
      { pair: "ADA/USDT", pnl: "+6.51" },
      { pair: "HYPE/USDT", pnl: "+5.42" },
      { pair: "1INCH/USDT", pnl: "+5.41" },
      { pair: "LTC/USDT", pnl: "+4.71" },
      { pair: "ATOM/USDT", pnl: "+4.46" },
      { pair: "HBAR/USDT", pnl: "+4.17" },
      { pair: "XLM/USDT", pnl: "+4.09" },
      { pair: "XTZ/USDT", pnl: "+4.02" },
      { pair: "NEAR/USDT", pnl: "+3.91" },
      { pair: "ETC/USDT", pnl: "+3.42" },
      { pair: "NOT/USDT", pnl: "+3.28" },
      { pair: "DOT/USDT", pnl: "+3.04" },
      { pair: "TIA/USDT", pnl: "+2.64" },
      { pair: "SEI/USDT", pnl: "+2.48" },
      { pair: "SOL/USDT", pnl: "+2.43" },
      { pair: "LINK/USDT", pnl: "+2.39" },
      { pair: "APT/USDT", pnl: "+2.28" },
      { pair: "SUI/USDT", pnl: "+2.01" },
      { pair: "DOGE/USDT", pnl: "+1.62" },
      { pair: "SUSHI/USDT", pnl: "+0.00" },
    ],
    equityPoints: buildCurve365Real(100, 122, 11, -81.5),
  },

  // 200$ · 60 ДНЕЙ
  "200_60": {
    deposit: 200,
    period: 60,
    depositLabel: "200.00",
    subtitle: "Автоподбор · Bybit · REAL #3 · старт 200.00 USDT · позиций одновременно: 3 · проскальзывание ×1",
    profitUsdt: "+381.64 USDT",
    profitPercent: "+190.82%",
    startBalance: "200.00",
    endBalance: "581.64",
    tradesCount: 477,
    winRate: "100%",
    profitFactor: "—",
    maxDrawdown: "-20.8%",
    commissions: "63",
    datesLabel: "21.09.2026 — 20.11.2026 · монет: 20",
    dateTicks: ["21.09", "11.10", "31.10", "20.11"],
    chartTitle: "Баланс (с учётом закрытых сделок)",
    yTicks: [534, 443, 351, 260, 169],
    drawdownMax: "-20.8%",
    drawdownScale: "-21%",
    hasCheckpoint: true,
    closures: [{ label: "Take Profit", count: 477, sum: "+381.64" }],
    coins: [
      { pair: "ETH/USDT", pnl: "+30.19" },
      { pair: "BNB/USDT", pnl: "+28.53" },
      { pair: "BTC/USDT", pnl: "+25.58" },
      { pair: "NAORIS/USDT", pnl: "+25.13" },
      { pair: "AVAX/USDT", pnl: "+25.02" },
      { pair: "LIT/USDT", pnl: "+23.60" },
      { pair: "BMT/USDT", pnl: "+20.65" },
      { pair: "XMR/USDT", pnl: "+20.39" },
      { pair: "ICNT/USDT", pnl: "+19.91" },
      { pair: "AKE/USDT", pnl: "+18.37" },
      { pair: "LINK/USDT", pnl: "+17.47" },
      { pair: "SKY/USDT", pnl: "+17.34" },
      { pair: "CYBER/USDT", pnl: "+16.78" },
      { pair: "UNI/USDT", pnl: "+16.63" },
      { pair: "VVV/USDT", pnl: "+15.75" },
      { pair: "MMT/USDT", pnl: "+15.54" },
      { pair: "ZEC/USDT", pnl: "+14.95" },
      { pair: "IRYS/USDT", pnl: "+13.95" },
      { pair: "PIEVERSE/USDT", pnl: "+8.27" },
      { pair: "PIPPIN/USDT", pnl: "+7.61" },
    ],
    equityPoints: buildCurveOld(534, 169, -20.8),
  },

  // 500$ · 60 ДНЕЙ
  "500_60": {
    deposit: 500,
    period: 60,
    depositLabel: "500.00",
    subtitle: "Автоподбор · Bybit · REAL #3 · старт 500.00 USDT · позиций одновременно: 3 · проскальзывание ×1",
    profitUsdt: "+954.18 USDT",
    profitPercent: "+190.84%",
    startBalance: "500.00",
    endBalance: "1454.18",
    tradesCount: 477,
    winRate: "100%",
    profitFactor: "—",
    maxDrawdown: "-20.8%",
    commissions: "156",
    datesLabel: "21.09.2026 — 20.11.2026 · монет: 20",
    dateTicks: ["21.09", "11.10", "31.10", "20.11"],
    chartTitle: "Баланс (с учётом закрытых сделок)",
    yTicks: [1335, 1107, 879, 650, 422],
    drawdownMax: "-20.8%",
    drawdownScale: "-21%",
    hasCheckpoint: true,
    closures: [{ label: "Take Profit", count: 477, sum: "+954.18" }],
    coins: [
      { pair: "ETH/USDT", pnl: "+75.49" },
      { pair: "BNB/USDT", pnl: "+71.33" },
      { pair: "BTC/USDT", pnl: "+63.95" },
      { pair: "NAORIS/USDT", pnl: "+62.82" },
      { pair: "AVAX/USDT", pnl: "+62.55" },
      { pair: "LIT/USDT", pnl: "+59.01" },
      { pair: "BMT/USDT", pnl: "+51.62" },
      { pair: "XMR/USDT", pnl: "+50.97" },
      { pair: "ICNT/USDT", pnl: "+49.79" },
      { pair: "AKE/USDT", pnl: "+45.93" },
      { pair: "LINK/USDT", pnl: "+43.68" },
      { pair: "SKY/USDT", pnl: "+43.35" },
      { pair: "CYBER/USDT", pnl: "+41.95" },
      { pair: "UNI/USDT", pnl: "+41.58" },
      { pair: "VVV/USDT", pnl: "+39.37" },
      { pair: "MMT/USDT", pnl: "+38.86" },
      { pair: "ZEC/USDT", pnl: "+37.37" },
      { pair: "IRYS/USDT", pnl: "+34.87" },
      { pair: "PIEVERSE/USDT", pnl: "+20.68" },
      { pair: "PIPPIN/USDT", pnl: "+19.02" },
    ],
    equityPoints: buildCurveOld(1335, 422, -20.8),
  },

  // 1000$ · 60 ДНЕЙ
  "1000_60": {
    deposit: 1000,
    period: 60,
    depositLabel: "1000.00",
    subtitle: "Автоподбор · Bybit · REAL #3 · старт 1000.00 USDT · позиций одновременно: 3 · проскальзывание ×1",
    profitUsdt: "+1987.19 USDT",
    profitPercent: "+198.72%",
    startBalance: "1000.00",
    endBalance: "2987.19",
    tradesCount: 521,
    winRate: "100%",
    profitFactor: "—",
    maxDrawdown: "-24.5%",
    commissions: "304",
    datesLabel: "21.09.2026 — 20.11.2026 · монет: 20",
    dateTicks: ["21.09", "11.10", "31.10", "20.11"],
    chartTitle: "Баланс (с учётом закрытых сделок)",
    yTicks: [2964, 2417, 1869, 1322, 774],
    drawdownMax: "-24.5%",
    drawdownScale: "-26%",
    hasCheckpoint: true,
    closures: [
      { label: "Take Profit", count: 273, sum: "+1586.36" },
      { label: "трейлинг-стоп", count: 248, sum: "+400.83" },
    ],
    coins: [
      { pair: "BNB/USDT", pnl: "+180.24" },
      { pair: "ETH/USDT", pnl: "+145.48" },
      { pair: "NAORIS/USDT", pnl: "+138.65" },
      { pair: "BTC/USDT", pnl: "+126.20" },
      { pair: "AVAX/USDT", pnl: "+119.13" },
      { pair: "CYBER/USDT", pnl: "+106.95" },
      { pair: "LIT/USDT", pnl: "+104.64" },
      { pair: "BMT/USDT", pnl: "+104.02" },
      { pair: "ICNT/USDT", pnl: "+103.12" },
      { pair: "IRYS/USDT", pnl: "+98.49" },
      { pair: "AKE/USDT", pnl: "+96.26" },
      { pair: "LINK/USDT", pnl: "+92.35" },
      { pair: "VVV/USDT", pnl: "+81.47" },
      { pair: "ZEC/USDT", pnl: "+80.65" },
      { pair: "XMR/USDT", pnl: "+74.69" },
      { pair: "UNI/USDT", pnl: "+74.15" },
      { pair: "MMT/USDT", pnl: "+70.14" },
      { pair: "PIEVERSE/USDT", pnl: "+67.97" },
      { pair: "SKY/USDT", pnl: "+63.07" },
      { pair: "PIPPIN/USDT", pnl: "+59.53" },
    ],
    equityPoints: buildCurveOld(2964, 774, -24.5),
  },
};

export default function BotBacktest({ bot }: { bot: BotData }) {
  const { lang } = useI18n();

  // Active deposit state: 50 | 100 | 200 | 500 | 1000
  const [selectedDeposit, setSelectedDeposit] = useState<number>(50);
  // Active period state: 60 | 365
  const [selectedPeriod, setSelectedPeriod] = useState<number>(60);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const chartSvgRef = useRef<SVGSVGElement | null>(null);

  // Available periods for currently selected deposit
  const availablePeriods = useMemo(() => {
    if (selectedDeposit === 50 || selectedDeposit === 100) return [60, 365];
    return [60];
  }, [selectedDeposit]);

  const currentData = useMemo(() => {
    const key = `${selectedDeposit}_${selectedPeriod}`;
    return (
      BACKTEST_CATALOG[key] ||
      BACKTEST_CATALOG[`${selectedDeposit}_60`] ||
      BACKTEST_CATALOG["50_60"]
    );
  }, [selectedDeposit, selectedPeriod]);

  // Chart dimensions
  const chartWidth = 720;
  const equityHeight = 240;
  const ddHeight = 72;
  const padding = { top: 20, right: 24, bottom: 24, left: 48 };

  const innerW = chartWidth - padding.left - padding.right;
  const innerH = equityHeight - padding.top - padding.bottom;

  // Compute SVG coordinates for equity curve & drawdown
  const { equityPath, equityAreaPath, ddPath, ddAreaPath, coords, startY } = useMemo(() => {
    const pts = currentData.equityPoints;
    const minEq = currentData.yTicks[currentData.yTicks.length - 1] * 0.96;
    const maxEq = currentData.yTicks[0] * 1.04;

    const mappedCoords = pts.map((p, i) => {
      const x = padding.left + (i / (pts.length - 1)) * innerW;
      const y = padding.top + innerH - ((p.equity - minEq) / (maxEq - minEq || 1)) * innerH;
      return { x, y, point: p };
    });

    let line = `M ${mappedCoords[0].x} ${mappedCoords[0].y}`;
    for (let i = 0; i < mappedCoords.length - 1; i++) {
      const c = mappedCoords[i];
      const n = mappedCoords[i + 1];
      const mx = (c.x + n.x) / 2;
      line += ` C ${mx} ${c.y}, ${mx} ${n.y}, ${n.x} ${n.y}`;
    }

    const baselineY = equityHeight - padding.bottom;
    const area = `${line} L ${mappedCoords[mappedCoords.length - 1].x} ${baselineY} L ${mappedCoords[0].x} ${baselineY} Z`;

    // Start baseline coordinate
    const startBalNum = parseFloat(currentData.startBalance) || 50;
    const sY = padding.top + innerH - ((startBalNum - minEq) / (maxEq - minEq || 1)) * innerH;

    // Drawdown curve coordinates
    const scaleNum = Math.abs(parseFloat(currentData.drawdownScale)) || 50;
    const ddInnerH = ddHeight - 16;
    const ddTop = 10;

    const mappedDd = pts.map((p, i) => {
      const x = padding.left + (i / (pts.length - 1)) * innerW;
      const ratio = Math.abs(p.dd) / scaleNum;
      const y = ddTop + Math.min(ratio, 1) * ddInnerH;
      return { x, y, dd: p.dd };
    });

    let ddLine = `M ${mappedDd[0].x} ${mappedDd[0].y}`;
    for (let i = 0; i < mappedDd.length - 1; i++) {
      const c = mappedDd[i];
      const n = mappedDd[i + 1];
      const mx = (c.x + n.x) / 2;
      ddLine += ` C ${mx} ${c.y}, ${mx} ${n.y}, ${n.x} ${n.y}`;
    }

    const ddArea = `${ddLine} L ${mappedDd[mappedDd.length - 1].x} ${ddTop} L ${mappedDd[0].x} ${ddTop} Z`;

    return {
      equityPath: line,
      equityAreaPath: area,
      ddPath: ddLine,
      ddAreaPath: ddArea,
      coords: mappedCoords,
      startY: sY,
    };
  }, [currentData, innerW, innerH]);

  // Checkpoint line at 31.10 (71% of chart width) for 200/500/1000
  const checkpointX = padding.left + innerW * 0.71;

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!chartSvgRef.current || coords.length === 0) return;
    const rect = chartSvgRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * chartWidth;

    let nearestIdx = 0;
    let nearestDist = Infinity;
    coords.forEach((c, idx) => {
      const dist = Math.abs(c.x - relX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = idx;
      }
    });
    setHoverIndex(nearestIdx);
  };

  const activeCoord = hoverIndex !== null && coords[hoverIndex] ? coords[hoverIndex] : null;

  return (
    <section id="bot-backtests" className="mb-16 scroll-mt-24">
      {/* Outer Card with dual theme styling */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white dark:border-slate-800/90 dark:bg-[#0c0f1d] shadow-xl p-5 sm:p-7 md:p-8 transition-colors duration-200">
        
        {/* Glow ambient background in dark mode */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5"
        />

        {/* 1. Header with Title + Clean Deposit Switcher (50$ - 1000$) + Period Selector */}
        <div className="relative mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                SynchroTrade Bot — бэктест
              </h2>

              {/* Deposit Buttons: 50$ | 100$ | 200$ | 500$ | 1000$ */}
              <div className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/90 p-1 border border-slate-200/80 dark:border-slate-700/80">
                {[50, 100, 200, 500, 1000].map((val) => {
                  const isActive = selectedDeposit === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setSelectedDeposit(val);
                        if (val === 200 || val === 500 || val === 1000) {
                          setSelectedPeriod(60);
                        }
                        setHoverIndex(null);
                      }}
                      className={`rounded-lg px-2.5 sm:px-3 py-1 text-xs font-extrabold transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      ${val}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {currentData.subtitle}
            </p>
          </div>

          {/* Right badge: Interactive Period Selector (60 ДНЕЙ / 365 ДНЕЙ) */}
          <div className="flex flex-col md:items-end shrink-0">
            <div className="inline-flex items-center gap-1 rounded-2xl border-2 border-amber-500/70 dark:border-amber-400/80 bg-amber-500/10 dark:bg-amber-400/10 p-1 shadow-sm">
              {[60, 365].map((p) => {
                const isAvailable = availablePeriods.includes(p);
                const isCurrent = selectedPeriod === p;
                if (!isAvailable) return null;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setSelectedPeriod(p);
                      setHoverIndex(null);
                    }}
                    className={`rounded-xl px-3 sm:px-4 py-1 text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-150 cursor-pointer ${
                      isCurrent
                        ? "bg-amber-500 text-slate-950 shadow-sm"
                        : "text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100"
                    }`}
                  >
                    ПЕРИОД: {p === 60 ? "60 ДНЕЙ" : "365 ДНЕЙ"}
                  </button>
                );
              })}
            </div>
            <div className="mt-1.5 text-[11px] sm:text-xs font-mono text-slate-500 dark:text-slate-400">
              {currentData.datesLabel}
            </div>
          </div>
        </div>

        {/* 2. Hero Profit & Metric Stats Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedDeposit}_${selectedPeriod}`}
            initial={{ opacity: 0.8, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.15 }}
            className="mb-6"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              ПРИБЫЛЬ ПО РЕЗУЛЬТАТАМ ТЕСТА
            </div>
            
            <div className="flex flex-wrap items-baseline gap-4 sm:gap-8 mb-2">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
                {currentData.profitUsdt}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500 dark:text-emerald-400 font-mono">
                {currentData.profitPercent}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-4 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-3">
                <span>
                  Баланс:{" "}
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {currentData.startBalance} → {currentData.endBalance} USDT
                  </span>
                </span>
                {currentData.openCountText && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                    {currentData.openCountText}
                  </span>
                )}
              </div>
            </div>

            {/* 5 Compact Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
              {/* 1. Trades */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-[#12182b] p-3 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {currentData.tradesCount}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  сделок
                </div>
              </div>

              {/* 2. Win rate */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-[#12182b] p-3 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {currentData.winRate}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  в плюс
                </div>
              </div>

              {/* 3. Profit Factor */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-[#12182b] p-3 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {currentData.profitFactor}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  профит-фактор
                </div>
              </div>

              {/* 4. Max Drawdown */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-[#12182b] p-3 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-rose-500 font-mono">
                  {currentData.maxDrawdown}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  макс. просадка
                </div>
              </div>

              {/* 5. Commissions */}
              <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-[#12182b] p-3 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {currentData.commissions}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  комиссии, USDT
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 3. Main Section: Left Chart Frame & Right Coins Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: Charts (Equity & Drawdown) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#090d16] p-4 sm:p-5 shadow-sm flex flex-col justify-between h-full">
              
              <div>
                {/* Header inside Chart frame */}
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium mb-3">
                  <span className="text-slate-900 dark:text-slate-200 font-bold">
                    {currentData.chartTitle}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {currentData.depositLabel} → {currentData.endBalance} USDT
                  </span>
                </div>

                {/* Main Equity SVG Canvas */}
                <div className="relative w-full select-none">
                  <svg
                    ref={chartSvgRef}
                    viewBox={`0 0 ${chartWidth} ${equityHeight}`}
                    className="w-full h-auto cursor-crosshair touch-none"
                    onPointerMove={handlePointerMove}
                    onPointerLeave={() => setHoverIndex(null)}
                  >
                    <defs>
                      {/* Light theme gradient */}
                      <linearGradient id="backtestEquityGradLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#059669" stopOpacity="0.22" />
                        <stop offset="70%" stopColor="#059669" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                      </linearGradient>

                      {/* Dark theme gradient */}
                      <linearGradient id="backtestEquityGradDark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00FFB2" stopOpacity="0.35" />
                        <stop offset="70%" stopColor="#00FFB2" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#00FFB2" stopOpacity="0" />
                      </linearGradient>

                      <filter id="neonGlowBacktest" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Horizontal Grid lines and Y labels */}
                    {currentData.yTicks.map((tick, idx) => {
                      const y = padding.top + (idx / (currentData.yTicks.length - 1)) * innerH;
                      return (
                        <g key={tick}>
                          <line
                            x1={padding.left}
                            y1={y}
                            x2={chartWidth - padding.right}
                            y2={y}
                            className="stroke-slate-200/90 dark:stroke-white/[0.07]"
                            strokeDasharray={idx === currentData.yTicks.length - 1 ? undefined : "3 3"}
                          />
                          <text
                            x={padding.left - 8}
                            y={y + 3}
                            textAnchor="end"
                            className="fill-slate-400 dark:fill-slate-500 font-mono text-[10px]"
                          >
                            {tick}
                          </text>
                        </g>
                      );
                    })}

                    {/* Baseline at start balance */}
                    <line
                      x1={padding.left}
                      y1={startY}
                      x2={chartWidth - padding.right}
                      y2={startY}
                      className="stroke-amber-500/60 dark:stroke-amber-400/50"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <text
                      x={chartWidth - padding.right}
                      y={startY - 4}
                      textAnchor="end"
                      className="fill-amber-600 dark:fill-amber-400 font-mono text-[9px] font-semibold"
                    >
                      старт
                    </text>

                    {/* Optional Vertical Checkpoint line for 200/500/1000 */}
                    {currentData.hasCheckpoint && (
                      <>
                        <line
                          x1={checkpointX}
                          y1={padding.top}
                          x2={checkpointX}
                          y2={equityHeight - padding.bottom}
                          className="stroke-amber-500 dark:stroke-amber-400"
                          strokeWidth="1.2"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={checkpointX + 4}
                          y={padding.top + 14}
                          className="fill-amber-600 dark:fill-amber-400 font-mono text-[9px] font-semibold"
                        >
                          проверочный период →
                        </text>
                      </>
                    )}

                    {/* Equity Area Fill */}
                    <path
                      d={equityAreaPath}
                      className="fill-[url(#backtestEquityGradLight)] dark:fill-[url(#backtestEquityGradDark)]"
                    />

                    {/* Equity Main Line */}
                    <path
                      d={equityPath}
                      fill="none"
                      className="stroke-emerald-600 dark:stroke-[#00FFB2]"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#neonGlowBacktest)"
                    />

                    {/* Last End Point circle */}
                    {coords.length > 0 && (
                      <g>
                        <circle
                          cx={coords[coords.length - 1].x}
                          cy={coords[coords.length - 1].y}
                          r="5"
                          className="fill-emerald-600 dark:fill-[#00FFB2] stroke-white"
                          strokeWidth="2"
                        />
                      </g>
                    )}

                    {/* X-axis date labels */}
                    <text x={padding.left} y={equityHeight - 8} textAnchor="start" className="fill-slate-400 dark:fill-slate-500 font-mono text-[10px]">
                      {currentData.dateTicks[0]}
                    </text>
                    <text x={padding.left + innerW * 0.33} y={equityHeight - 8} textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 font-mono text-[10px]">
                      {currentData.dateTicks[1]}
                    </text>
                    <text x={currentData.hasCheckpoint ? checkpointX : padding.left + innerW * 0.67} y={equityHeight - 8} textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 font-mono text-[10px]">
                      {currentData.dateTicks[2]}
                    </text>
                    <text x={chartWidth - padding.right} y={equityHeight - 8} textAnchor="end" className="fill-slate-400 dark:fill-slate-500 font-mono text-[10px]">
                      {currentData.dateTicks[3]}
                    </text>

                    {/* Hover vertical crosshair & indicator */}
                    {activeCoord && (
                      <g>
                        <line
                          x1={activeCoord.x}
                          y1={padding.top}
                          x2={activeCoord.x}
                          y2={equityHeight - padding.bottom}
                          className="stroke-slate-400 dark:stroke-white/40"
                          strokeWidth="1.2"
                          strokeDasharray="2 2"
                        />
                        <circle
                          cx={activeCoord.x}
                          cy={activeCoord.y}
                          r="5"
                          className="fill-emerald-600 dark:fill-[#00FFB2] stroke-white"
                          strokeWidth="2"
                        />
                      </g>
                    )}
                  </svg>

                  {/* Hover Tooltip overlay */}
                  <AnimatePresence>
                    {activeCoord && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.12 }}
                        className="pointer-events-none absolute z-20 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/95 p-2.5 shadow-xl backdrop-blur-md text-xs text-slate-900 dark:text-white"
                        style={{
                          left: `${Math.min(Math.max(12, (activeCoord.x / chartWidth) * 100), 80)}%`,
                          top: `${Math.max(8, (activeCoord.y / equityHeight) * 100 - 35)}%`,
                          transform: "translate(-50%, -100%)",
                        }}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                          <Calendar size={11} />
                          <span>Дата: {activeCoord.point.date}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 font-semibold">
                          <span>Баланс:</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            ${activeCoord.point.equity.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-300 mt-0.5">
                          <span>Просадка:</span>
                          <span className="font-mono text-rose-500 font-bold">
                            {activeCoord.point.dd}%
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sub-Chart: Drawdown curve */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                  <span>
                    Просадка от максимума · максимум <span className="text-rose-500 font-bold">{currentData.drawdownMax}</span>
                  </span>
                  <span>{currentData.drawdownScale}</span>
                </div>

                <div className="relative w-full h-[72px]">
                  <svg viewBox={`0 0 ${chartWidth} ${ddHeight}`} className="w-full h-full">
                    <defs>
                      <linearGradient id="backtestDdGradLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.03" />
                      </linearGradient>
                      <linearGradient id="backtestDdGradDark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>

                    {/* Baseline 0% */}
                    <line
                      x1={padding.left}
                      y1={10}
                      x2={chartWidth - padding.right}
                      y2={10}
                      className="stroke-slate-200 dark:stroke-white/[0.12]"
                    />
                    <text x={padding.left - 6} y={13} textAnchor="end" className="fill-slate-400 dark:fill-slate-500 font-mono text-[9px]">
                      0%
                    </text>

                    {/* Bottom limit */}
                    <line
                      x1={padding.left}
                      y1={ddHeight - 6}
                      x2={chartWidth - padding.right}
                      y2={ddHeight - 6}
                      className="stroke-slate-200 dark:stroke-white/[0.06]"
                      strokeDasharray="2 2"
                    />
                    <text x={padding.left - 6} y={ddHeight - 4} textAnchor="end" className="fill-slate-400 dark:fill-slate-500 font-mono text-[9px]">
                      {currentData.drawdownScale}
                    </text>

                    {/* Checkpoint line continuation if applicable */}
                    {currentData.hasCheckpoint && (
                      <line
                        x1={checkpointX}
                        y1={10}
                        x2={checkpointX}
                        y2={ddHeight - 6}
                        className="stroke-amber-500 dark:stroke-amber-400"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Drawdown Area & Line */}
                    <path
                      d={ddAreaPath}
                      className="fill-[url(#backtestDdGradLight)] dark:fill-[url(#backtestDdGradDark)]"
                    />
                    <path d={ddPath} fill="none" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: Coins in test & Trade Closures & Open Positions */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 h-full">
            
            {/* Box 1: Монеты в тесте */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-[#12182b] p-4 sm:p-5 flex-1">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 dark:border-slate-800 pb-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Монеты в тесте ({currentData.coins.length})
                </span>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {currentData.profitUsdt}
                </span>
              </div>

              {/* 2-column coin list */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs font-mono max-h-[300px] overflow-y-auto pr-1">
                {currentData.coins.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-0.5 border-b border-slate-200/40 dark:border-slate-800/40">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">{c.pair}</span>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-1 shrink-0">
                      {c.pnl}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 2: Как закрывались сделки */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-[#12182b] p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Как закрывались сделки
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                {currentData.closures.map((cl, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span>{cl.label}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {cl.count} · {cl.sum}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 3: Ещё в сделке (в итог не входят) — if available */}
            {currentData.openPositions && currentData.openPositions.length > 0 && (
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-[#12182b] p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Ещё в сделке (в итог не входят)
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  {currentData.openPositions.map((pos, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                            pos.side === "LONG" ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        <span className="font-semibold">{pos.pair}</span>
                        <span
                          className={`text-[10px] px-1 py-0.5 rounded font-bold ${
                            pos.side === "LONG"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-500/15 text-rose-500"
                          }`}
                        >
                          {pos.side}
                        </span>
                        <span className="text-slate-400 text-[11px]">{pos.avg}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {pos.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* 4. Footer Disclaimer & CTA */}
        <div className="mt-8 pt-5 border-t border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              ПРОЦЕНТЫ ДОХОДНОСТИ И ПРОЦЕНТ ПРОСАДКИ МОЖЕТ ОТЛИЧАТЬСЯ В ЗАВИСИМОСТИ ОТ ВЫБРАННЫХ ПАРАМЕТРОВ
            </span>
          </div>

          <a
            href="https://t.me/coinsoft"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 text-xs sm:text-sm shadow-md transition-all shrink-0 w-full sm:w-auto"
          >
            <span>Запустить бота на {selectedDeposit}$</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

      </div>
    </section>
  );
}
