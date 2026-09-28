import { motion, useReducedMotion } from "framer-motion";
import { useId, useMemo } from "react";
import { Activity, ArrowUpRight, ShieldCheck } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

const POINTS: Point[] = [
  { x: 26, y: 216 },
  { x: 76, y: 198 },
  { x: 126, y: 206 },
  { x: 176, y: 172 },
  { x: 226, y: 184 },
  { x: 276, y: 146 },
  { x: 326, y: 158 },
  { x: 376, y: 116 },
  { x: 426, y: 128 },
  { x: 476, y: 86 },
  { x: 526, y: 100 },
  { x: 576, y: 58 },
  { x: 614, y: 42 },
];

const MARKERS = [
  { index: 3, label: "BUY", color: "#00E58F", bg: "rgba(0,229,143,0.18)" },
  { index: 7, label: "SELL", color: "#FF5C7A", bg: "rgba(255,92,122,0.18)" },
  { index: 11, label: "BUY", color: "#00E58F", bg: "rgba(0,229,143,0.18)" },
] as const;

function smoothPath(points: Point[]): string {
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
  const id = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();

  const areaId = `heroArea-${id}`;
  const strokeGlowId = `heroGlow-${id}`;
  const sheenId = `heroSheen-${id}`;

  const line = useMemo(() => smoothPath(POINTS), []);
  const area = useMemo(() => `${line} L 614 240 L 26 240 Z`, [line]);
  const last = POINTS[POINTS.length - 1];

  const gridYs = [64, 124, 184];
  const gridLabels = ["+80%", "+40%", "0%"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
      className="relative w-full"
    >
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[40px] blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(0,229,143,0.22), transparent 62%), radial-gradient(ellipse at 78% 88%, rgba(59,130,246,0.16), transparent 60%)",
        }}
      />

      <div className="relative flex h-[min(56vh,430px)] min-h-[320px] min-w-0 flex-col overflow-hidden rounded-[26px] border border-white/[0.09] bg-[linear-gradient(168deg,#0C131C_0%,#0A0F17_52%,#0D1520_100%)] shadow-[0_36px_90px_-28px_rgba(2,8,20,0.85)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 88% 4%, rgba(0,229,143,0.16), transparent 34%), radial-gradient(circle at 4% 100%, rgba(59,130,246,0.12), transparent 38%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <header className="relative z-10 flex h-[68px] shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] px-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <Activity size={17} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-[#7D8695]">
                Доходность портфеля
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[26px] font-bold leading-none tabular-nums text-[#00E58F] sm:text-[28px]">
                  +96.4%
                </span>
                <span className="text-[11px] font-medium text-[#7D8695]">за год</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5 sm:flex">
              {["1М", "3М", "1Г"].map((label) => (
                <span
                  key={label}
                  className={
                    label === "1Г"
                      ? "rounded-md bg-white/[0.09] px-2 py-1 text-[10px] font-semibold text-white"
                      : "rounded-md px-2 py-1 text-[10px] font-medium text-[#7D8695]"
                  }
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-[#00E58F]/25 bg-[#00E58F]/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#00E58F]">
              <span className="relative flex h-1.5 w-1.5">
                <motion.span
                  animate={reduceMotion ? undefined : { scale: [1, 2.6, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-[#00E58F]"
                />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#00E58F]" />
              </span>
              LIVE
            </div>
          </div>
        </header>

        <div
          className="relative z-10 min-h-0 flex-1 px-2 pt-3"
          role="img"
          aria-label="График доходности портфеля с отметками сделок и итоговым значением +96.4% за год"
        >
          <svg className="block h-full w-full" viewBox="0 0 640 240" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E58F" stopOpacity="0.4" />
                <stop offset="55%" stopColor="#00E58F" stopOpacity="0.09" />
                <stop offset="100%" stopColor="#00E58F" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00E58F" stopOpacity="0" />
                <stop offset="50%" stopColor="#7CFFCB" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#00E58F" stopOpacity="0" />
              </linearGradient>
              <filter id={strokeGlowId} x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>

            {gridYs.map((y, i) => (
              <g key={y}>
                <line x1="26" x2="614" y1={y} y2={y} stroke="rgba(255,255,255,0.055)" strokeWidth="1" strokeDasharray="4 6" />
                <text x="20" y={y - 5} textAnchor="end" fill="#5C6675" fontSize="9" fontWeight="500">
                  {gridLabels[i]}
                </text>
              </g>
            ))}

            <path d={area} fill={`url(#${areaId})`} />

            <motion.path
              d={line}
              fill="none"
              stroke="#00E58F"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.16"
              filter={`url(#${strokeGlowId})`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reduceMotion ? 0 : 1.9, delay: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
            />
            <motion.path
              d={line}
              fill="none"
              stroke="#00E58F"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reduceMotion ? 0 : 1.9, delay: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
            />

            {!reduceMotion && (
              <motion.path
                d={line}
                fill="none"
                stroke={`url(#${sheenId})`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="70 900"
                initial={{ strokeDashoffset: 900 }}
                animate={{ strokeDashoffset: -120 }}
                transition={{ duration: 5.5, delay: 2.4, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
              />
            )}

            {MARKERS.map(({ index, label, color, bg }, i) => {
              const p = POINTS[index];
              return (
                <motion.g
                  key={`${label}-${p.x}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 1.15 + i * 0.14 }}
                >
                  <circle cx={p.x} cy={p.y} r="7" fill={color} opacity="0.16" />
                  <circle cx={p.x} cy={p.y} r="3.2" fill="#0A0F17" stroke={color} strokeWidth="2" />
                  <rect x={p.x - 27} y={p.y - 34} width="54" height="19" rx="5" fill={bg} stroke={color} strokeOpacity="0.35" />
                  <text x={p.x} y={p.y - 24.5} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="9.5" fontWeight="700" letterSpacing="0.5">
                    {label}
                  </text>
                </motion.g>
              );
            })}

            <line x1={last.x} x2={last.x} y1={last.y + 8} y2="240" stroke="rgba(0,229,143,0.28)" strokeWidth="1" strokeDasharray="3 5" />

            <motion.circle
              cx={last.x}
              cy={last.y}
              r="11"
              fill="none"
              stroke="#00E58F"
              strokeWidth="1.2"
              animate={reduceMotion ? undefined : { opacity: [0.55, 0, 0.55], r: [9, 16, 9] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
            <circle cx={last.x} cy={last.y} r="7" fill="#00E58F" opacity="0.2" />
            <circle cx={last.x} cy={last.y} r="4.2" fill="#00E58F" />

            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 1.7 }}
            >
              <rect x={last.x - 62} y={last.y - 44} width="76" height="26" rx="8" fill="#00E58F" />
              <text x={last.x - 24} y={last.y - 31} textAnchor="middle" dominantBaseline="middle" fill="#04231A" fontSize="12" fontWeight="800">
                +96.4%
              </text>
            </motion.g>

            {MONTHS.map((month, index) => (
              <text
                key={month}
                x={26 + (588 / 11) * index}
                y="234"
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

        <footer className="relative z-10 flex h-[52px] shrink-0 items-center justify-between gap-3 border-t border-white/[0.07] px-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex items-center gap-1.5">
              <ArrowUpRight size={13} className="text-[#00E58F]" />
              <span className="text-[11px] font-semibold text-white">+71.2%</span>
              <span className="hidden text-[10px] text-[#7D8695] sm:inline">профит</span>
            </div>
            <div className="hidden items-center gap-1.5 sm:flex">
              <ShieldCheck size={13} className="text-[#7D8695]" />
              <span className="text-[11px] font-semibold text-white">4.1%</span>
              <span className="hidden text-[10px] text-[#7D8695] md:inline">просадка</span>
            </div>
            <div className="hidden items-center gap-1.5 md:flex">
              <span className="text-[11px] font-semibold text-white">99.9%</span>
              <span className="text-[10px] text-[#7D8695]">аптайм</span>
            </div>
          </div>
          <span className="shrink-0 text-[9px] italic text-white/35 sm:text-[10px]">Demo — данные симулированы</span>
        </footer>
      </div>
    </motion.div>
  );
}