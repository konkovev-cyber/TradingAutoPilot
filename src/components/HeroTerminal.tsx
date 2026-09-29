import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Activity, Bot, Globe2, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

interface Pt { x: number; y: number }

const STOCK_POINTS: Pt[] = [
  { x: 24, y: 198 },
  { x: 76, y: 188 },
  { x: 128, y: 176 },
  { x: 180, y: 168 },
  { x: 232, y: 152 },
  { x: 284, y: 144 },
  { x: 336, y: 128 },
  { x: 388, y: 118 },
  { x: 440, y: 102 },
  { x: 492, y: 92 },
  { x: 544, y: 76 },
  { x: 596, y: 62 },
];

const CRYPTO_POINTS: Pt[] = [
  { x: 24, y: 212 },
  { x: 76, y: 190 },
  { x: 128, y: 206 },
  { x: 180, y: 156 },
  { x: 232, y: 178 },
  { x: 284, y: 118 },
  { x: 336, y: 148 },
  { x: 388, y: 88 },
  { x: 440, y: 114 },
  { x: 492, y: 62 },
  { x: 544, y: 86 },
  { x: 596, y: 40 },
];

function smoothPath(points: Pt[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const t = 0.19;
    const c1x = p1.x + (p2.x - p0.x) * t;
    const c1y = p1.y + (p2.y - p0.y) * t;
    const c2x = p2.x - (p3.x - p1.x) * t;
    const c2y = p2.y - (p3.y - p1.y) * t;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const chipCls =
  "flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white/85 px-3 py-2 shadow-[0_14px_34px_-16px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-white/[0.12] dark:bg-[#111C29]/85 dark:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)]";

function iconTileCls(color: string) {
  return { color, background: `linear-gradient(135deg, ${color}33, ${color}0d)` };
}

export function TradingTerminal() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const id = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();

  const months: string[] = t("hero.chart.months");
  const tooltips = [
    { index: 4, label: t("hero.terminal.tooltip1"), color: "#34D399" },
    { index: 10, label: t("hero.terminal.tooltip2"), color: "#C084FC" },
  ] as const;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const motionOn = !reduceMotion && !isMobile;
  const decorOn = motionOn;
  const pulseColor = theme === "dark" ? "#00E58F" : "#0080FF";

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springCfg = { stiffness: 120, damping: 16, mass: 0.5 };
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), springCfg);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -8]), springCfg);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!motionOn) return;
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my, motionOn]
  );

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const stockLine = useMemo(() => smoothPath(STOCK_POINTS), []);
  const cryptoLine = useMemo(() => smoothPath(CRYPTO_POINTS), []);
  const stockArea = useMemo(() => `${stockLine} L 596 240 L 24 240 Z`, [stockLine]);
  const cryptoArea = useMemo(() => `${cryptoLine} L 596 240 L 24 240 Z`, [cryptoLine]);

  const stockAreaId = `stockArea-${id}`;
  const cryptoAreaId = `cryptoArea-${id}`;
  const glowId = `glow-${id}`;
  const edgeId = `edge-${id}`;

  const lastStock = STOCK_POINTS[STOCK_POINTS.length - 1];
  const lastCrypto = CRYPTO_POINTS[CRYPTO_POINTS.length - 1];

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative w-full"
      style={{ perspective: 1400 }}
    >
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[64px] opacity-60 blur-3xl dark:opacity-90"
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, rgba(16,185,129,0.30), transparent 60%), radial-gradient(ellipse at 76% 82%, rgba(99,102,241,0.26), transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.15, ease: "easeOut" }}
        className="relative"
      >
        <motion.div
          animate={decorOn ? { y: [0, -14, 0] } : undefined}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            style={motionOn ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
            className="relative"
          >
            <div
              className="pointer-events-none absolute -top-3 right-0 z-20"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className={`${chipCls} !py-1.5`}>
                <span className="relative flex h-1.5 w-1.5">
                  <motion.span
                    animate={decorOn ? { scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] } : undefined}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-emerald-500"
                  />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-emerald-300">
                  {t("hero.terminal.aiLive")}
                </span>
              </div>
            </div>

            <div
              className="pointer-events-none absolute left-0 top-10 z-20 hidden sm:block"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className={chipCls}>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={iconTileCls("#60A5FA")}>
                  <TrendingUp size={14} />
                </span>
                <span>
                  <span className="block text-[9px] font-bold tracking-[0.08em] text-slate-500 dark:text-slate-300">{t("hero.terminal.stocks")}</span>
                  <span className="block text-[10px] font-semibold text-slate-700 dark:text-white">{t("hero.terminal.stocksYear")}</span>
                </span>
              </div>
            </div>

            <div
              className="pointer-events-none absolute right-0 bottom-16 z-20 hidden sm:block"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className={chipCls}>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={iconTileCls("#34D399")}>
                  <ShieldCheck size={14} />
                </span>
                <span>
                  <span className="block text-[9px] font-bold tracking-[0.08em] text-slate-500 dark:text-slate-300">{t("hero.terminal.stopLoss")}</span>
                  <span className="block text-[10px] font-semibold text-slate-700 dark:text-white">{t("hero.terminal.stopLossNote")}</span>
                </span>
              </div>
            </div>

            <div
              className="pointer-events-none absolute -left-2 bottom-24 z-20 hidden sm:block"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className={chipCls}>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={iconTileCls("#60A5FA")}>
                  <Globe2 size={14} />
                </span>
                <span>
                  <span className="block text-[9px] font-bold tracking-[0.08em] text-slate-500 dark:text-slate-300">{t("hero.terminal.exchanges")}</span>
                  <span className="block text-[10px] font-semibold text-slate-700 dark:text-white">{t("hero.terminal.connected")}</span>
                </span>
              </div>
            </div>

            <div className="relative z-10 px-2 pb-4 pt-7">
              <svg
                className="block h-[min(38vh,320px)] w-full"
                viewBox="0 0 640 250"
                preserveAspectRatio="none"
                role="img"
                aria-label={t("hero.terminal.ariaLabel")}
              >
                <defs>
                  <linearGradient id={stockAreaId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.34" />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id={cryptoAreaId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E58F" stopOpacity="0.36" />
                    <stop offset="100%" stopColor="#00E58F" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id={edgeId} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
                    <stop offset="50%" stopColor="#C7D2FE" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
                  </linearGradient>
                  <filter id={glowId} x="-25%" y="-25%" width="150%" height="150%">
                    <feGaussianBlur stdDeviation="5" />
                  </filter>
                </defs>

                <path d={stockArea} fill={`url(#${stockAreaId})`} />
                <path d={cryptoArea} fill={`url(#${cryptoAreaId})`} />

                <motion.path
                  d={stockLine}
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="9"
                  strokeLinecap="round"
                  opacity="0.14"
                  filter={`url(#${glowId})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 1.6, delay: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
                />
                <motion.path
                  d={stockLine}
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 1.6, delay: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
                />

                <motion.path
                  d={cryptoLine}
                  fill="none"
                  stroke="#00E58F"
                  strokeWidth="10"
                  strokeLinecap="round"
                  opacity="0.18"
                  filter={`url(#${glowId})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 1.8, delay: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
                />
                <motion.path
                  d={cryptoLine}
                  fill="none"
                  stroke="#00E58F"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 1.8, delay: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
                />

                {decorOn && (
                  <motion.path
                    d={cryptoLine}
                    fill="none"
                    stroke={`url(#${edgeId})`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="80 900"
                    initial={{ strokeDashoffset: 900 }}
                    animate={{ strokeDashoffset: -140 }}
                    transition={{ duration: 5, delay: 2.6, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                  />
                )}

                {!isMobile && tooltips.map(({ index, label, color }, i) => {
                  const p = CRYPTO_POINTS[index];
                  const w = label.length * 5.6 + 18;
                  return (
                    <motion.g
                      key={label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 1.4 + i * 0.18 }}
                    >
                      <circle cx={p.x} cy={p.y} r="7" fill={color} opacity="0.18" />
                      <circle cx={p.x} cy={p.y} r="3.2" fill="#0B0C15" stroke={color} strokeWidth="2" />
                      <rect x={p.x - w / 2} y={p.y - 36} width={w} height="20" rx="6" fill="rgba(12,16,26,0.86)" stroke={color} strokeOpacity="0.4" />
                      <text x={p.x} y={p.y - 26} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="9.5" fontWeight="700">
                        {label}
                      </text>
                    </motion.g>
                  );
                })}

                <line x1={lastCrypto.x} x2={lastCrypto.x} y1={lastCrypto.y + 8} y2="240" stroke={pulseColor} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 5" />
                {decorOn && (
                  <motion.circle
                    cx={lastCrypto.x}
                    cy={lastCrypto.y}
                    r="11"
                    fill="none"
                    stroke={pulseColor}
                    strokeWidth="1.2"
                    animate={{ opacity: [0.6, 0, 0.6], r: [9, 16, 9] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <circle cx={lastCrypto.x} cy={lastCrypto.y} r="7" fill={pulseColor} opacity="0.22" />
                <circle cx={lastCrypto.x} cy={lastCrypto.y} r="4.2" fill={pulseColor} />
                <circle cx={lastStock.x} cy={lastStock.y} r="4" fill="#60A5FA" opacity="0.85" />

                {months.map((month, index) =>
                  isMobile && index % 2 !== 0 ? null : (
                    <text
                      key={month}
                      x={24 + (572 / 11) * index}
                      y="245"
                      textAnchor="middle"
                      fill="#5C6675"
                      fontSize="9"
                      fontWeight="500"
                    >
                      {month}
                    </text>
                  )
                )}
              </svg>
            </div>

            <div
              className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center"
              style={{ transform: "translateZ(40px)" }}
            >
              <div className={chipCls}>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#60A5FA]" />
                  <b className="text-[10px] font-semibold text-slate-700 dark:text-white">{t("hero.terminal.stocksLegend")}</b>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#00E58F]" />
                  <b className="text-[10px] font-semibold text-slate-700 dark:text-white">{t("hero.terminal.cryptoLegend")}</b>
                </span>
                <span className="hidden items-center gap-1.5 sm:flex">
                  <Bot size={12} className="text-emerald-500" />
                  <b className="text-[10px] font-semibold text-emerald-500">+96.4%</b>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{t("hero.terminal.portfolioYear")}</span>
                </span>
                <span className="hidden items-center gap-1 text-[10px] font-medium text-emerald-500 md:flex">
                  <Zap size={12} /> {t("hero.terminal.autopilot")}
                </span>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-2 hidden justify-center sm:flex">
              <span className="flex items-center gap-2 text-[9px] text-slate-400 dark:text-slate-500">
                <Activity size={11} className="text-emerald-500" /> {t("hero.terminal.hoverHint")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default TradingTerminal;