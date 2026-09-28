import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Activity, Bot, BrainCircuit, Globe2, ShieldCheck, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

interface Pt { x: number; y: number }

const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

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

const TOOLTIPS = [
  { index: 4, label: "+4.2%", color: "#34D399" },
  { index: 10, label: "AI Rebalance", color: "#C084FC" },
] as const;

const ORBIT_ITEMS = [
  { label: "20+ бирж", value: "Подключено", icon: Globe2, color: "#60A5FA" },
  { label: "RISK GUARD", value: "Защищено", icon: ShieldCheck, color: "#34D399" },
] as const;

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

export function TradingTerminal() {
  const reduceMotion = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const motionOn = !reduceMotion && !isMobile;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springCfg = { stiffness: 90, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), springCfg);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -5]), springCfg);

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
        className="absolute -inset-10 rounded-[64px] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 32% 24%, rgba(16,185,129,0.34), transparent 58%), radial-gradient(ellipse at 78% 84%, rgba(99,102,241,0.32), transparent 58%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.15, ease: "easeOut" }}
        className="relative"
      >
        <motion.div
          animate={motionOn ? { y: [0, -14, 0] } : undefined}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            style={motionOn ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.14] bg-[#0B0C15] shadow-[0_30px_90px_-30px_rgba(79,70,229,0.45)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(140deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 32%, transparent 60%), radial-gradient(circle at 86% 6%, rgba(16,185,129,0.20), transparent 34%), radial-gradient(circle at 6% 96%, rgba(99,102,241,0.20), transparent 38%)",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent"
              />

              <header className="relative z-10 flex h-[62px] items-center justify-between border-b border-white/[0.08] px-5 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-300/10 text-emerald-300">
                    <Bot size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">Trading Auto Pilot</div>
                    <div className="text-[10px] text-slate-500">Crypto + Stocks · one dashboard</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <motion.span
                      animate={reduceMotion ? undefined : { scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full bg-emerald-300"
                    />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  </span>
                  AI CORE ACTIVE
                </div>
              </header>

              <div
                className="relative z-10 px-3 pb-1 pt-4"
                role="img"
                aria-label="Парящий дашборд: доходность акций и крипты растут, ИИ-ядро активно"
              >
                <svg className="block h-[min(34vh,268px)] w-full" viewBox="0 0 640 250" preserveAspectRatio="none" aria-hidden="true">
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

                  {!reduceMotion && (
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

                  {TOOLTIPS.map(({ index, label, color }, i) => {
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

                  <line x1={lastCrypto.x} x2={lastCrypto.x} y1={lastCrypto.y + 8} y2="240" stroke="rgba(0,229,143,0.3)" strokeWidth="1" strokeDasharray="3 5" />
                  <motion.circle
                    cx={lastCrypto.x}
                    cy={lastCrypto.y}
                    r="11"
                    fill="none"
                    stroke="#00E58F"
                    strokeWidth="1.2"
                    animate={reduceMotion ? undefined : { opacity: [0.6, 0, 0.6], r: [9, 16, 9] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                  />
                  <circle cx={lastCrypto.x} cy={lastCrypto.y} r="7" fill="#00E58F" opacity="0.22" />
                  <circle cx={lastCrypto.x} cy={lastCrypto.y} r="4.2" fill="#00E58F" />
                  <circle cx={lastStock.x} cy={lastStock.y} r="4" fill="#60A5FA" opacity="0.85" />

                  {MONTHS.map((month, index) => (
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
                  ))}
                </svg>
              </div>

              <footer className="relative z-10 flex h-[52px] items-center justify-between gap-3 border-t border-white/[0.08] px-5 sm:px-6">
                <div className="flex min-w-0 items-center gap-4 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#60A5FA]" />
                    <b className="text-white">Акции</b>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#00E58F]" />
                    <b className="text-white">Крипта</b>
                  </span>
                  <span className="hidden sm:inline">
                    <b className="text-emerald-300">+96.4%</b> портфель за год
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-300">
                  <Zap size={12} /> Автопилот включён
                </div>
              </footer>
            </div>

            {motionOn && (
              <div style={{ transform: "translateZ(60px)" }} className="pointer-events-none absolute inset-0">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="absolute -left-6 top-[22%] hidden items-center gap-2 rounded-xl border border-white/[0.14] bg-[#111C29]/85 px-3 py-2 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md sm:flex"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ color: "#60A5FA", backgroundColor: "#60A5FA18" }}>
                    <TrendingUp size={14} />
                  </span>
                  <span>
                    <span className="block text-[9px] font-bold tracking-[0.08em] text-slate-300">SHARES</span>
                    <span className="block text-[10px] text-slate-500">+71.2% за год</span>
                  </span>
                </motion.div>

                {ORBIT_ITEMS.map(({ label, value, icon: Icon, color }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.35 + i * 0.15 }}
                    className={`absolute hidden items-center gap-2 rounded-xl border border-white/[0.14] bg-[#111C29]/85 px-3 py-2 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md sm:flex ${
                      i === 0 ? "-right-5 top-[30%]" : "-right-3 bottom-[16%]"
                    }`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ color, backgroundColor: `${color}18` }}>
                      <Icon size={14} />
                    </span>
                    <span>
                      <span className="block text-[9px] font-bold tracking-[0.08em] text-slate-300">{label}</span>
                      <span className="block text-[10px] text-slate-500">{value}</span>
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-4 text-[9px] text-slate-500 sm:flex">
              <span className="flex items-center gap-1"><BrainCircuit size={11} className="text-violet-300" /> AI rebalancing</span>
              <span className="flex items-center gap-1"><Activity size={11} className="text-emerald-300" /> 24/7</span>
              <span className="flex items-center gap-1"><Sparkles size={11} className="text-amber-300" /> Limit orders</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default TradingTerminal;