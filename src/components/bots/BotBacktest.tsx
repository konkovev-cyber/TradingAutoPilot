import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Percent,
  ShieldCheck,
  Activity,
  Layers,
  DollarSign,
  Info,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import {
  botText,
  colorDimFrom,
  getDefaultBacktests,
  type BotData,
  type BotBacktestPeriod,
  type BacktestPoint,
} from "@/data/bots";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";

export default function BotBacktest({ bot }: { bot: BotData }) {
  const { lang } = useI18n();
  const c = useContent();
  const b = botText(bot, lang);

  // Retrieve backtest periods or fallback to defaults
  const periods: BotBacktestPeriod[] = useMemo(() => {
    if (b.backtests && b.backtests.length > 0) return b.backtests;
    return getDefaultBacktests(b.slug);
  }, [b.backtests, b.slug]);

  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string>(
    periods[2]?.period || periods[0]?.period || "6M"
  );
  const [deposit, setDeposit] = useState<number>(1000);

  // Interactive chart hover state
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const chartSvgRef = useRef<SVGSVGElement | null>(null);

  const activePeriod = useMemo(() => {
    return periods.find((p) => p.period === selectedPeriodKey) || periods[0];
  }, [periods, selectedPeriodKey]);

  // Scaled calculations based on deposit slider
  const roiMultiplier = activePeriod ? 1 + activePeriod.roiValue / 100 : 1.78;
  const finalBalance = Math.round(deposit * roiMultiplier);
  const profitAmount = Math.max(0, finalBalance - deposit);

  // Chart coordinate mapping
  const chartWidth = 800;
  const chartHeight = 260;
  const padding = { top: 25, right: 30, bottom: 35, left: 55 };

  const points = activePeriod?.points || [];

  const chartData = useMemo(() => {
    if (!points || points.length === 0) return { path: "", area: "", coords: [], minEquity: 0, maxEquity: 1 };

    // Scale points to current deposit
    const scale = deposit / 1000;
    const scaledPoints = points.map((p) => ({
      ...p,
      scaledEquity: Math.round(p.equity * scale),
      scaledPnl: Math.round(p.pnl * scale),
    }));

    const equities = scaledPoints.map((p) => p.scaledEquity);
    const minEquity = Math.min(...equities) * 0.98;
    const maxEquity = Math.max(...equities) * 1.02;

    const innerW = chartWidth - padding.left - padding.right;
    const innerH = chartHeight - padding.top - padding.bottom;

    const coords = scaledPoints.map((p, i) => {
      const x = padding.left + (i / (scaledPoints.length - 1)) * innerW;
      const y = padding.top + innerH - ((p.scaledEquity - minEquity) / (maxEquity - minEquity || 1)) * innerH;
      return { x, y, point: p };
    });

    // Build smooth cubic bezier SVG path
    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const mx = (curr.x + next.x) / 2;
      path += ` C ${mx} ${curr.y}, ${mx} ${next.y}, ${next.x} ${next.y}`;
    }

    const lastCoord = coords[coords.length - 1];
    const firstCoord = coords[0];
    const bottomY = chartHeight - padding.bottom;
    const area = `${path} L ${lastCoord.x} ${bottomY} L ${firstCoord.x} ${bottomY} Z`;

    return { path, area, coords, minEquity, maxEquity };
  }, [points, deposit]);

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!chartSvgRef.current || chartData.coords.length === 0) return;
    const rect = chartSvgRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const relX = ((clientX - rect.left) / rect.width) * chartWidth;

    // Find nearest point
    let nearestIdx = 0;
    let nearestDist = Infinity;
    chartData.coords.forEach((c, idx) => {
      const dist = Math.abs(c.x - relX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = idx;
      }
    });
    setHoverIndex(nearestIdx);
  };

  const handlePointerLeave = () => {
    setHoverIndex(null);
  };

  const activeCoord = hoverIndex !== null && chartData.coords[hoverIndex] ? chartData.coords[hoverIndex] : null;

  const botColor = b.color || "#00FFB2";
  const glow = botColor === "#00FFB2" ? "rgba(0, 255, 178, 0.2)" : colorDimFrom(botColor);

  return (
    <section id="bot-backtests" className="mb-16 scroll-mt-24">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-8 shadow-soft transition-all dark:border-slate-800/80 dark:bg-[#131b2e]">
        {/* Glow corner */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: botColor }}
        />

        {/* Header */}
        <div className="relative mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={14} />
                {c("botDetail", "backtestBadge", "Подтверждённая эффективность")}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                Historical Backtest
              </span>
            </div>
            <h2 className="heading-lg text-gray-900 dark:text-white">
              {c("botDetail", "backtestTitle", "Бэктесты и динамика доходности")}
            </h2>
            <p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
              {c("botDetail", "backtestSubtitle", "Прозрачные результаты тестирования торгового алгоритма на реальных исторических данных. Выберите период и укажите планируемый депозит для расчёта потенциальной прибыли.")}
            </p>
          </div>

          {/* Period Selection Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-gray-100 p-1.5 dark:bg-gray-800/80 border border-gray-200/80 dark:border-white/5">
            {periods.map((p) => {
              const active = p.period === selectedPeriodKey;
              return (
                <button
                  key={p.period}
                  onClick={() => {
                    setSelectedPeriodKey(p.period);
                    setHoverIndex(null);
                  }}
                  className={`relative rounded-xl px-3.5 py-1.5 text-xs font-bold tracking-wide transition-all ${
                    active
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                  style={{
                    backgroundColor: active ? (botColor === "#00FFB2" ? "#059669" : botColor) : "transparent",
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Deposit Range Slider */}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-emerald-500" />
              <label htmlFor="deposit-slider" className="text-sm font-semibold text-gray-900 dark:text-white">
                {c("botDetail", "depositLabel", "Размер депозита для расчёта:")}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums">
                ${deposit.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {c("botDetail", "depositHint", "(стартовый капитал)")}
              </span>
            </div>
          </div>

          {/* Slider input */}
          <input
            id="deposit-slider"
            type="range"
            min={100}
            max={20000}
            step={100}
            value={deposit}
            onChange={(e) => {
              setDeposit(Number(e.target.value));
              setHoverIndex(null);
            }}
            className="w-full h-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          {/* Quick preset chips */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">
              {c("botDetail", "quickSelect", "Быстрый выбор:")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[500, 1000, 2500, 5000, 10000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setDeposit(preset);
                    setHoverIndex(null);
                  }}
                  className={`rounded-lg px-2.5 py-1 font-semibold border transition-all ${
                    deposit === preset
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5 Core Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-8">
          {/* Card 1: Total Profit / ROI */}
          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 dark:border-emerald-500/20 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
              <span>{c("botDetail", "roiLabel", "Доходность (ROI)")}</span>
              <TrendingUp size={16} />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {activePeriod.roi}
            </div>
            <div className="mt-1 text-xs font-medium text-emerald-800/80 dark:text-emerald-300/80 tabular-nums">
              +${profitAmount.toLocaleString()} к депозиту
            </div>
          </div>

          {/* Card 2: Win Rate */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              <span>{c("botDetail", "winRateLabel", "Win Rate")}</span>
              <Percent size={14} className="text-cyan-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
              {activePeriod.winRate}
            </div>
            <div className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
              {c("botDetail", "winRateHint", "прибыльных сделок")}
            </div>
          </div>

          {/* Card 3: Max Drawdown */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              <span>{c("botDetail", "drawdownLabel", "Макс. просадка")}</span>
              <ShieldCheck size={14} className="text-indigo-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
              {activePeriod.maxDrawdown}
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {c("botDetail", "drawdownHint", "контроль риска")}
            </div>
          </div>

          {/* Card 4: Profit Factor */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              <span>{c("botDetail", "profitFactorLabel", "Профит-фактор")}</span>
              <Activity size={14} className="text-violet-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
              {activePeriod.profitFactor}
            </div>
            <div className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
              {c("botDetail", "profitFactorHint", "валовая прибыль / убыток")}
            </div>
          </div>

          {/* Card 5: Trades count */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              <span>{c("botDetail", "tradesLabel", "Всего сделок")}</span>
              <Layers size={14} className="text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
              {activePeriod.tradesCount}
            </div>
            <div className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
              {c("botDetail", "tradesHint", "за выбранный период")}
            </div>
          </div>
        </div>

        {/* Dynamic Interactive SVG Chart */}
        <div className="relative rounded-2xl border border-gray-200/90 bg-gray-950 p-4 sm:p-6 shadow-inner">
          {/* Chart top meta readout */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: botColor }} />
              <span className="font-semibold text-white">Кривая роста капитала (Equity Curve)</span>
              <span className="text-gray-500">· Период: {activePeriod.label}</span>
            </div>
            <div className="text-gray-400 font-mono text-[11px]">
              Наведите курсор на график для детальной информации
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full overflow-hidden select-none">
            <svg
              ref={chartSvgRef}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto cursor-crosshair touch-none"
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={botColor} stopOpacity="0.38" />
                  <stop offset="85%" stopColor={botColor} stopOpacity="0.03" />
                  <stop offset="100%" stopColor={botColor} stopOpacity="0" />
                </linearGradient>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid lines */}
              <line
                x1={padding.left}
                y1={padding.top}
                x2={chartWidth - padding.right}
                y2={padding.top}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 4"
              />
              <line
                x1={padding.left}
                y1={(padding.top + (chartHeight - padding.bottom)) / 2}
                x2={chartWidth - padding.right}
                y2={(padding.top + (chartHeight - padding.bottom)) / 2}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 4"
              />
              <line
                x1={padding.left}
                y1={chartHeight - padding.bottom}
                x2={chartWidth - padding.right}
                y2={chartHeight - padding.bottom}
                stroke="rgba(255,255,255,0.12)"
              />

              {/* Y Axis labels */}
              <text
                x={padding.left - 8}
                y={padding.top + 4}
                textAnchor="end"
                className="fill-gray-500 font-mono text-[10px]"
              >
                ${Math.round(chartData.maxEquity).toLocaleString()}
              </text>
              <text
                x={padding.left - 8}
                y={(padding.top + (chartHeight - padding.bottom)) / 2 + 3}
                textAnchor="end"
                className="fill-gray-500 font-mono text-[10px]"
              >
                ${Math.round((chartData.maxEquity + chartData.minEquity) / 2).toLocaleString()}
              </text>
              <text
                x={padding.left - 8}
                y={chartHeight - padding.bottom}
                textAnchor="end"
                className="fill-gray-500 font-mono text-[10px]"
              >
                ${Math.round(chartData.minEquity).toLocaleString()}
              </text>

              {/* Area fill */}
              {chartData.area && (
                <path d={chartData.area} fill="url(#equityGradient)" />
              )}

              {/* Main curve */}
              {chartData.path && (
                <path
                  d={chartData.path}
                  fill="none"
                  stroke={botColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="url(#neonGlow)"
                />
              )}

              {/* X Axis dates */}
              {chartData.coords.length > 0 && (
                <>
                  <text
                    x={chartData.coords[0].x}
                    y={chartHeight - 12}
                    textAnchor="start"
                    className="fill-gray-500 font-mono text-[10px]"
                  >
                    {chartData.coords[0].point.date}
                  </text>
                  <text
                    x={chartData.coords[Math.floor(chartData.coords.length / 2)].x}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    className="fill-gray-500 font-mono text-[10px]"
                  >
                    {chartData.coords[Math.floor(chartData.coords.length / 2)].point.date}
                  </text>
                  <text
                    x={chartData.coords[chartData.coords.length - 1].x}
                    y={chartHeight - 12}
                    textAnchor="end"
                    className="fill-gray-500 font-mono text-[10px]"
                  >
                    {chartData.coords[chartData.coords.length - 1].point.date}
                  </text>
                </>
              )}

              {/* Active hover vertical cursor & dot */}
              {activeCoord && (
                <g>
                  <line
                    x1={activeCoord.x}
                    y1={padding.top}
                    x2={activeCoord.x}
                    y2={chartHeight - padding.bottom}
                    stroke="rgba(255, 255, 255, 0.45)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={activeCoord.x}
                    cy={activeCoord.y}
                    r="6"
                    fill={botColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    filter="url(#neonGlow)"
                  />
                </g>
              )}
            </svg>

            {/* Dynamic Floating Tooltip */}
            <AnimatePresence>
              {activeCoord && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute z-20 rounded-xl border border-white/20 bg-gray-900/95 p-3 shadow-2xl backdrop-blur-md text-xs text-white"
                  style={{
                    left: `${Math.min(
                      Math.max(10, (activeCoord.x / chartWidth) * 100),
                      82
                    )}%`,
                    top: `${Math.max(8, (activeCoord.y / chartHeight) * 100 - 32)}%`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
                    <Calendar size={12} />
                    <span>{activeCoord.point.date}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 font-semibold">
                    <span>Баланс:</span>
                    <span className="text-white font-mono font-bold text-sm">
                      ${(activeCoord.point.scaledEquity ?? activeCoord.point.equity).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-emerald-400 font-semibold mt-0.5">
                    <span>Прибыль:</span>
                    <span className="font-mono">
                      +${(activeCoord.point.scaledPnl ?? activeCoord.point.pnl).toLocaleString()}
                    </span>
                  </div>
                  {activeCoord.point.trade && (
                    <div className="mt-1 pt-1 border-t border-white/10 text-[10px] text-cyan-300">
                      {activeCoord.point.trade}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Note and Direct CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-start gap-2.5 text-xs text-gray-500 dark:text-gray-400 max-w-2xl">
            <Info size={16} className="text-gray-400 shrink-0 mt-0.5" />
            <span>
              {c("botDetail", "chartDisclaimer", "Бэктесты рассчитаны на реальных исторических данных биржевых котировок с учётом стандартных комиссий мейкер/тейкер. Результаты приведены в демонстрационных целях и не гарантируют будущую доходность.")}
            </span>
          </div>

          <a
            href="#main"
            className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold shrink-0 w-full sm:w-auto"
            style={{
              backgroundColor: botColor === "#00FFB2" ? "#059669" : botColor,
            }}
          >
            <span>Выбрать {b.name}</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
