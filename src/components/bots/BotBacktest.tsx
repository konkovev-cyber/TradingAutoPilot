import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Info,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";
import { type BotData } from "@/data/bots";
import { useI18n } from "@/lib/i18n";

// Exact backtest datasets from the user's real screenshots (60-day period: 21.09.2026 - 20.11.2026)
interface BacktestTier {
  deposit: number; // 200 | 500 | 1000
  depositLabel: string;
  profitUsdt: string;
  profitPercent: string;
  startBalance: string;
  endBalance: string;
  stillInTradeCount: number;
  tradesCount: number;
  winRate: string;
  profitFactor: string;
  maxDrawdown: string;
  commissions: string;
  // Chart axis limits
  yTicks: number[];
  drawdownMax: string;
  drawdownScale: string;
  // Trade closures
  closures: { label: string; count: number; sum: string }[];
  // Positions still in trade
  openPositions: { pair: string; side: "LONG" | "SHORT"; avg: number; status: string }[];
  // 20 coins with profit
  coins: { pair: string; pnl: string }[];
  // Precise curve morphology
  equityPoints: { day: number; date: string; equity: number; dd: number }[];
}

const BACKTEST_DATA: Record<number, BacktestTier> = {
  1000: {
    deposit: 1000,
    depositLabel: "1000.00",
    profitUsdt: "+ 1987.19 USDT",
    profitPercent: "+198.72%",
    startBalance: "1000.00",
    endBalance: "2987.19",
    stillInTradeCount: 2,
    tradesCount: 521,
    winRate: "100%",
    profitFactor: "—",
    maxDrawdown: "-24.5%",
    commissions: "304 USDT",
    yTicks: [2964, 2417, 1869, 1322, 774],
    drawdownMax: "-24.5%",
    drawdownScale: "-26%",
    closures: [
      { label: "Take Profit", count: 273, sum: "+1586.36" },
      { label: "трейлинг-стоп", count: 248, sum: "+400.83" },
    ],
    openPositions: [
      { pair: "VVV/USDT", side: "LONG", avg: 3, status: "в позиции" },
      { pair: "XMR/USDT", side: "LONG", avg: 3, status: "в позиции" },
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
    equityPoints: buildCurve(1000, 2964, 774, -24.5),
  },
  500: {
    deposit: 500,
    depositLabel: "500.00",
    profitUsdt: "+ 954.18 USDT",
    profitPercent: "+190.84%",
    startBalance: "500.00",
    endBalance: "1454.18",
    stillInTradeCount: 3,
    tradesCount: 477,
    winRate: "100%",
    profitFactor: "—",
    maxDrawdown: "-20.8%",
    commissions: "156 USDT",
    yTicks: [1335, 1107, 879, 650, 422],
    drawdownMax: "-20.8%",
    drawdownScale: "-21%",
    closures: [{ label: "Take Profit", count: 477, sum: "+954.18" }],
    openPositions: [
      { pair: "VVV/USDT", side: "LONG", avg: 3, status: "в позиции" },
      { pair: "BTC/USDT", side: "LONG", avg: 3, status: "в позиции" },
      { pair: "CYBER/USDT", side: "SHORT", avg: 2, status: "в позиции" },
    ],
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
    equityPoints: buildCurve(500, 1335, 422, -20.8),
  },
  200: {
    deposit: 200,
    depositLabel: "200.00",
    profitUsdt: "+ 381.64 USDT",
    profitPercent: "+190.82%",
    startBalance: "200.00",
    endBalance: "581.64",
    stillInTradeCount: 3,
    tradesCount: 477,
    winRate: "100%",
    profitFactor: "—",
    maxDrawdown: "-20.8%",
    commissions: "63 USDT",
    yTicks: [534, 443, 351, 260, 169],
    drawdownMax: "-20.8%",
    drawdownScale: "-21%",
    closures: [{ label: "Take Profit", count: 477, sum: "+381.64" }],
    openPositions: [
      { pair: "VVV/USDT", side: "LONG", avg: 3, status: "в позиции" },
      { pair: "BTC/USDT", side: "LONG", avg: 3, status: "в позиции" },
      { pair: "CYBER/USDT", side: "SHORT", avg: 2, status: "в позиции" },
    ],
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
    equityPoints: buildCurve(200, 534, 169, -20.8),
  },
};

// Generates smooth curve matching the exact visual morphology of the backtest screenshots
function buildCurve(startBal: number, topTick: number, bottomTick: number, maxDd: number) {
  const points: { day: number; date: string; equity: number; dd: number }[] = [];
  const totalDays = 60;
  const spread = topTick - bottomTick;

  const dates = [
    "21.09", "23.09", "25.09", "27.09", "29.09", "01.10", "03.10", "05.10",
    "07.10", "09.10", "11.10", "13.10", "15.10", "17.10", "19.10", "21.10",
    "23.10", "25.10", "27.10", "29.10", "31.10", "02.11", "04.11", "06.11",
    "08.11", "10.11", "12.11", "14.11", "16.11", "18.11", "20.11"
  ];

  // Precise fractional trajectory reconstructed from image
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
    { p: 0.41, frac: 0.56, dd: -14.2 }, // dip around 11.10
    { p: 0.45, frac: 0.67, dd: -5.2 },
    { p: 0.50, frac: 0.74, dd: -3.1 },
    { p: 0.55, frac: 0.81, dd: -2.0 },
    { p: 0.61, frac: 0.87, dd: -1.4 },
    { p: 0.66, frac: 0.94, dd: -0.6 }, // local peak before checkpoint
    { p: 0.69, frac: 0.79, dd: -12.8 },
    { p: 0.71, frac: 0.68, dd: maxDd }, // 31.10 checkpoint vertical line
    { p: 0.74, frac: 0.64, dd: maxDd * 0.96 },
    { p: 0.78, frac: 0.71, dd: -16.4 },
    { p: 0.82, frac: 0.78, dd: -9.8 },
    { p: 0.86, frac: 0.85, dd: -5.1 },
    { p: 0.89, frac: 0.80, dd: -13.9 }, // mid-November dip
    { p: 0.93, frac: 0.88, dd: -4.0 },
    { p: 0.97, frac: 0.96, dd: -1.2 },
    { p: 1.00, frac: 0.98, dd: 0 },
  ];

  for (let i = 0; i < pattern.length; i++) {
    const pt = pattern[i];
    const dateIdx = Math.min(Math.floor(pt.p * (dates.length - 1)), dates.length - 1);
    const equityVal = Math.round((bottomTick + spread * pt.frac) * 100) / 100;
    points.push({
      day: Math.round(pt.p * totalDays),
      date: dates[dateIdx],
      equity: equityVal,
      dd: pt.dd,
    });
  }

  return points;
}

export default function BotBacktest({ bot }: { bot: BotData }) {
  const { lang } = useI18n();

  // Active deposit state: 200 | 500 | 1000 USDT (default 500 as in user's prompt screenshot)
  const [selectedDeposit, setSelectedDeposit] = useState<number>(500);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const chartSvgRef = useRef<SVGSVGElement | null>(null);

  const currentData = useMemo(() => {
    return BACKTEST_DATA[selectedDeposit] || BACKTEST_DATA[500];
  }, [selectedDeposit]);

  // Coordinate dimensions for SVG
  const chartWidth = 720;
  const equityHeight = 220;
  const ddHeight = 70;
  const padding = { top: 20, right: 24, bottom: 24, left: 48 };

  const innerW = chartWidth - padding.left - padding.right;
  const innerH = equityHeight - padding.top - padding.bottom;

  // Compute SVG coordinates for equity curve & drawdown
  const { equityPath, equityAreaPath, ddPath, ddAreaPath, coords } = useMemo(() => {
    const pts = currentData.equityPoints;
    const minEq = currentData.yTicks[currentData.yTicks.length - 1] * 0.98;
    const maxEq = currentData.yTicks[0] * 1.02;

    const mappedCoords = pts.map((p, i) => {
      const x = padding.left + (i / (pts.length - 1)) * innerW;
      const y = padding.top + innerH - ((p.equity - minEq) / (maxEq - minEq || 1)) * innerH;
      return { x, y, point: p };
    });

    // Build equity line
    let line = `M ${mappedCoords[0].x} ${mappedCoords[0].y}`;
    for (let i = 0; i < mappedCoords.length - 1; i++) {
      const c = mappedCoords[i];
      const n = mappedCoords[i + 1];
      const mx = (c.x + n.x) / 2;
      line += ` C ${mx} ${c.y}, ${mx} ${n.y}, ${n.x} ${n.y}`;
    }

    const baselineY = equityHeight - padding.bottom;
    const area = `${line} L ${mappedCoords[mappedCoords.length - 1].x} ${baselineY} L ${mappedCoords[0].x} ${baselineY} Z`;

    // Drawdown curve coordinates
    const minDdVal = selectedDeposit === 1000 ? -26 : -21;
    const ddInnerH = ddHeight - 16;
    const ddTop = 10;

    const mappedDd = pts.map((p, i) => {
      const x = padding.left + (i / (pts.length - 1)) * innerW;
      const ratio = Math.abs(p.dd) / Math.abs(minDdVal);
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
    };
  }, [currentData, selectedDeposit, innerW, innerH]);

  // Checkpoint line at 31.10 (71% of chart width)
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
      {/* Outer Card with dual theme styling (solid dark navy like in screenshot, or clean white in light) */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white dark:border-slate-800/90 dark:bg-[#0c0f1d] shadow-2xl p-5 sm:p-7 md:p-8 transition-colors duration-200">
        
        {/* Glow ambient background in dark mode */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5"
        />

        {/* 1. Header with Title + "ПЕРИОД: 60 ДНЕЙ" Badge (Exact to screenshot) */}
        <div className="relative mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                SynchroTrade Bot — бэктест
              </h2>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Автоподбор · Bybit · REAL #3 · старт {currentData.depositLabel} USDT · позиций одновременно: 3 · проскальзывание ×1
            </p>
          </div>

          {/* Right badge: ПЕРИОД: 60 ДНЕЙ */}
          <div className="flex flex-col md:items-end shrink-0">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-amber-500/70 dark:border-amber-400/80 bg-amber-500/10 dark:bg-amber-400/10 px-5 py-2 shadow-sm">
              <span className="text-xs sm:text-sm font-black tracking-wider text-amber-700 dark:text-amber-300 uppercase">
                ПЕРИОД: 60 ДНЕЙ
              </span>
            </div>
            <div className="mt-1.5 text-[11px] sm:text-xs font-mono text-slate-500 dark:text-slate-400">
              21.09.2026 — 20.11.2026 · монет: 20
            </div>
          </div>
        </div>

        {/* 2. Slider & Selector: 200$ | 500$ | 1000$ */}
        <div className="mb-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-[#12182b] p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <DollarSign size={20} />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Размер депозита для бэктеста:
                </span>
                <span className="ml-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  ${selectedDeposit} USDT
                </span>
              </div>
            </div>

            {/* Quick Clickable Buttons for 200$, 500$, 1000$ */}
            <div className="flex items-center gap-2">
              {[200, 500, 1000].map((val) => {
                const isActive = selectedDeposit === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setSelectedDeposit(val);
                      setHoverIndex(null);
                    }}
                    className={`relative rounded-xl px-4 py-1.5 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105"
                        : "bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50"
                    }`}
                  >
                    ${val}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Range Slider snapping to 200, 500, 1000 */}
          <div className="relative pt-1 px-1">
            <input
              type="range"
              min={200}
              max={1000}
              step={100}
              value={selectedDeposit}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val <= 350) setSelectedDeposit(200);
                else if (val <= 750) setSelectedDeposit(500);
                else setSelectedDeposit(1000);
                setHoverIndex(null);
              }}
              className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-2 px-1">
              <span
                onClick={() => setSelectedDeposit(200)}
                className={`cursor-pointer transition-colors ${selectedDeposit === 200 ? "font-bold text-emerald-600 dark:text-emerald-400 underline decoration-2" : "hover:text-slate-300"}`}
              >
                $200
              </span>
              <span
                onClick={() => setSelectedDeposit(500)}
                className={`cursor-pointer transition-colors ${selectedDeposit === 500 ? "font-bold text-emerald-600 dark:text-emerald-400 underline decoration-2" : "hover:text-slate-300"}`}
              >
                $500
              </span>
              <span
                onClick={() => setSelectedDeposit(1000)}
                className={`cursor-pointer transition-colors ${selectedDeposit === 1000 ? "font-bold text-emerald-600 dark:text-emerald-400 underline decoration-2" : "hover:text-slate-300"}`}
              >
                $1000
              </span>
            </div>
          </div>
        </div>

        {/* 3. Hero Profit & Metric Stats Section (Animated on deposit change) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDeposit}
            initial={{ opacity: 0.7, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0.7 }}
            transition={{ duration: 0.18 }}
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
              <div>
                Баланс: <span className="font-mono font-bold text-slate-900 dark:text-white">{currentData.startBalance} → {currentData.endBalance} USDT</span>
              </div>
              <div className="text-slate-500 dark:text-slate-400 italic">
                ещё в сделке: {currentData.stillInTradeCount} поз. (в итог не входят)
              </div>
            </div>

            {/* 5 Compact Stats Cards (100% match screenshot) */}
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

        {/* 4. Main Section: Left Chart Frame & Right Coins Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Charts (Equity & Drawdown) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-[#090d16] p-4 sm:p-5 shadow-inner">
              
              {/* Header inside Chart frame */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3">
                <span className="text-slate-200 font-semibold">
                  Баланс (с учётом плавающего результата открытых позиций)
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
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
                    <linearGradient id="backtestEquityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00FFB2" stopOpacity="0.35" />
                      <stop offset="70%" stopColor="#00FFB2" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#00FFB2" stopOpacity="0" />
                    </linearGradient>
                    <filter id="neonGlowBacktest" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Horizontal Grid lines and Y labels (matching exact screenshot ticks) */}
                  {currentData.yTicks.map((tick, idx) => {
                    const y = padding.top + (idx / (currentData.yTicks.length - 1)) * innerH;
                    return (
                      <g key={tick}>
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={chartWidth - padding.right}
                          y2={y}
                          stroke="rgba(255,255,255,0.07)"
                          strokeDasharray={idx === currentData.yTicks.length - 1 ? undefined : "3 3"}
                        />
                        <text
                          x={padding.left - 8}
                          y={y + 3}
                          textAnchor="end"
                          className="fill-slate-500 font-mono text-[10px]"
                        >
                          {tick}
                        </text>
                      </g>
                    );
                  })}

                  {/* Vertical Checkpoint line at 31.10 */}
                  <line
                    x1={checkpointX}
                    y1={padding.top}
                    x2={checkpointX}
                    y2={equityHeight - padding.bottom}
                    stroke="#F59E0B"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={checkpointX + 4}
                    y={padding.top + 14}
                    className="fill-amber-400 font-mono text-[9px] font-semibold"
                  >
                    проверочный период →
                  </text>

                  {/* Equity Area Fill */}
                  <path d={equityAreaPath} fill="url(#backtestEquityGrad)" />

                  {/* Equity Main Line */}
                  <path
                    d={equityPath}
                    fill="none"
                    stroke="#00FFB2"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#neonGlowBacktest)"
                  />

                  {/* "старт" label at right baseline */}
                  <text
                    x={chartWidth - padding.right}
                    y={equityHeight - padding.bottom - 4}
                    textAnchor="end"
                    className="fill-emerald-400 font-mono text-[9px]"
                  >
                    старт
                  </text>

                  {/* Last End Point pulsing circle */}
                  {coords.length > 0 && (
                    <g>
                      <circle
                        cx={coords[coords.length - 1].x}
                        cy={coords[coords.length - 1].y}
                        r="5"
                        fill="#00FFB2"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  {/* X-axis date labels */}
                  <text x={padding.left} y={equityHeight - 6} textAnchor="start" className="fill-slate-500 font-mono text-[10px]">
                    21.09
                  </text>
                  <text x={padding.left + innerW * 0.33} y={equityHeight - 6} textAnchor="middle" className="fill-slate-500 font-mono text-[10px]">
                    11.10
                  </text>
                  <text x={checkpointX} y={equityHeight - 6} textAnchor="middle" className="fill-amber-400 font-mono text-[10px]">
                    31.10
                  </text>
                  <text x={chartWidth - padding.right} y={equityHeight - 6} textAnchor="end" className="fill-slate-500 font-mono text-[10px]">
                    20.11
                  </text>

                  {/* Hover vertical crosshair & indicator */}
                  {activeCoord && (
                    <g>
                      <line
                        x1={activeCoord.x}
                        y1={padding.top}
                        x2={activeCoord.x}
                        y2={equityHeight - padding.bottom}
                        stroke="rgba(255, 255, 255, 0.4)"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                      />
                      <circle
                        cx={activeCoord.x}
                        cy={activeCoord.y}
                        r="5"
                        fill="#00FFB2"
                        stroke="#ffffff"
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
                      className="pointer-events-none absolute z-20 rounded-xl border border-slate-700 bg-slate-900/95 p-2.5 shadow-2xl backdrop-blur-md text-xs text-white"
                      style={{
                        left: `${Math.min(Math.max(12, (activeCoord.x / chartWidth) * 100), 80)}%`,
                        top: `${Math.max(8, (activeCoord.y / equityHeight) * 100 - 35)}%`,
                        transform: "translate(-50%, -100%)",
                      }}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                        <Calendar size={11} />
                        <span>Дата: {activeCoord.point.date}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 font-semibold">
                        <span>Баланс:</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          ${activeCoord.point.equity.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-[11px] text-slate-300 mt-0.5">
                        <span>Просадка:</span>
                        <span className="font-mono text-rose-400">
                          {activeCoord.point.dd}%
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sub-Chart: Drawdown curve */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>
                    Просадка от максимума · максимум <span className="text-rose-400 font-bold">{currentData.drawdownMax}</span>
                  </span>
                  <span>{currentData.drawdownScale}</span>
                </div>

                <div className="relative w-full h-[70px]">
                  <svg viewBox={`0 0 ${chartWidth} ${ddHeight}`} className="w-full h-full">
                    <defs>
                      <linearGradient id="backtestDdGrad" x1="0" y1="0" x2="0" y2="1">
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
                      stroke="rgba(255,255,255,0.12)"
                    />
                    <text x={padding.left - 6} y={13} textAnchor="end" className="fill-slate-500 font-mono text-[9px]">
                      0%
                    </text>

                    {/* Bottom limit */}
                    <line
                      x1={padding.left}
                      y1={ddHeight - 6}
                      x2={chartWidth - padding.right}
                      y2={ddHeight - 6}
                      stroke="rgba(255,255,255,0.06)"
                      strokeDasharray="2 2"
                    />
                    <text x={padding.left - 6} y={ddHeight - 4} textAnchor="end" className="fill-slate-500 font-mono text-[9px]">
                      {currentData.drawdownScale}
                    </text>

                    {/* Checkpoint line continuation */}
                    <line
                      x1={checkpointX}
                      y1={10}
                      x2={checkpointX}
                      y2={ddHeight - 6}
                      stroke="#F59E0B"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />

                    {/* Drawdown Area & Line */}
                    <path d={ddAreaPath} fill="url(#backtestDdGrad)" />
                    <path d={ddPath} fill="none" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Coins in test (20) & Trade Closures */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Box 1: Монеты в тесте (20) */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-[#12182b] p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 dark:border-slate-800 pb-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Монеты в тесте (20)
                </span>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Итог: {currentData.profitUsdt.split(" ")[1]} USDT
                </span>
              </div>

              {/* 2-column coin list */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs font-mono">
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

            {/* Box 3: Ещё в сделке (в итог не входят) */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-400/[0.04] p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                Ещё в сделке (в итог не входят)
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                {currentData.openPositions.map((pos, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">{pos.pair}</span>
                      <span className="mx-1 text-slate-400">·</span>
                      <span className={pos.side === "LONG" ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-rose-500 font-bold"}>
                        {pos.side}
                      </span>
                      <span className="mx-1 text-slate-400">·</span>
                      <span className="text-slate-500 dark:text-slate-400">усредн. {pos.avg}</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">{pos.status}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* 5. Footer Disclaimer & CTA */}
        <div className="mt-8 pt-5 border-t border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <span>
              Расчёт по историческим свечам: комиссии, проскальзывание, funding и маржа учтены. Итог — по закрытым сделкам. Не гарантирует будущих результатов и не является инвестиционной рекомендацией.
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
