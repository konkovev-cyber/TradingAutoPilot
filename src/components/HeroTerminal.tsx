import { motion } from "framer-motion";
import { useId } from "react";

const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

// Иллюстративная кривая: данные статичны и не являются историей торгов.
const curve = [
  "M 20 240",
  "C 38 239, 45 214, 60 220",
  "C 76 225, 85 239, 100 235",
  "C 122 230, 130 202, 150 200",
  "C 170 197, 180 186, 200 180",
  "C 226 170, 232 134, 250 130",
  "C 268 127, 280 163, 300 165",
  "C 322 165, 340 125, 360 120",
  "C 385 116, 397 94, 420 90",
  "C 445 84, 458 64, 480 60",
  "C 505 54, 515 49, 540 45",
  "C 558 42, 569 34, 580 30",
].join(" ");

const markers = [
  { x: 150, y: 200, label: " BUY", color: "#00B96B", background: "rgba(0,185,107,0.15)" },
  { x: 300, y: 165, label: " SELL", color: "#FF5A5F", background: "rgba(255,77,77,0.15)" },
  { x: 480, y: 60, label: " BUY", color: "#00B96B", background: "rgba(0,185,107,0.15)" },
] as const;

export function TradingTerminal() {
  const id = useId().replace(/:/g, "");
  const gradientId = `areaGradient-${id}`;
  const glowFilterId = `chartGlow-${id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      className="relative w-full"
    >
      <motion.div
        aria-hidden="true"
        className="absolute -inset-5 rounded-[36px] bg-[radial-gradient(ellipse_at_center,rgba(0,185,107,0.18),rgba(37,99,235,0.08)_38%,transparent_72%)] blur-2xl"
        animate={{ opacity: [0.55, 0.85, 0.55], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative box-border flex h-[440px] min-w-0 flex-col gap-1 overflow-hidden rounded-[24px] border border-white/[0.12] bg-[#0F141C] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[24px] opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(circle at 86% 8%, rgba(0,185,107,0.12), transparent 30%), radial-gradient(circle at 8% 100%, rgba(37,99,235,0.1), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.045), transparent 28%)",
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#00B96B]/70 to-transparent" />

        <header className="relative z-10 flex h-[52px] shrink-0 items-center justify-between border-b border-white/[0.08]">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-[1px] text-[#8A8F99]">
              Доходность портфеля
            </p>
            <div className="flex items-baseline gap-2.5">
              <span className="text-[28px] font-bold leading-none tabular-nums text-[#00D084]">+96.4%</span>
              <span className="text-xs font-normal text-[#8A8F99]">за год</span>
            </div>
          </div>

          <motion.div
            animate={{ boxShadow: ["0 0 0 rgba(0,185,107,0)", "0 0 22px rgba(0,185,107,0.18)", "0 0 0 rgba(0,185,107,0)"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-[#00B96B]/20 bg-[rgba(0,185,107,0.1)] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#00D084]"
          >
            <span className="relative flex h-1.5 w-1.5">
              <motion.span
                animate={{ scale: [1, 2.4, 1], opacity: [0.75, 0, 0.75] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-[#00D084]"
              />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[#00D084]" />
            </span>
            LIVE
          </motion.div>
        </header>

        <div
          className="relative z-10 h-[300px] min-h-0 shrink-0"
          role="img"
          aria-label="График доходности портфеля с двумя просадками и тремя отметками сделок"
        >
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute left-0 top-3 z-10 hidden items-center gap-2 rounded-lg border border-white/[0.09] bg-[#151D28]/85 px-2.5 py-1.5 text-[9px] font-medium tracking-wide text-[#AEB8C5] shadow-lg backdrop-blur-md sm:flex"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#00D084] shadow-[0_0_10px_rgba(0,208,132,0.9)]" />
            AI ENGINE ACTIVE
          </motion.div>

          <svg className="block h-[300px] w-full" viewBox="0 0 600 300" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00B96B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00B96B" stopOpacity="0" />
              </linearGradient>
              <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>

            {[60, 120, 180, 240].map((y) => (
              <line key={y} x1="20" x2="580" y1={y} y2={y} stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
            ))}

            <path d={`${curve} L 580 300 L 20 300 Z`} fill={`url(#${gradientId})`} />
            <motion.path
              d={curve}
              fill="none"
              stroke="#00D084"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.12"
              filter={`url(#${glowFilterId})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.12 }}
              transition={{ duration: 1.8, delay: 0.35, ease: "easeOut" }}
            />
            <motion.path
              d={curve}
              fill="none"
              stroke="#00D084"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, delay: 0.35, ease: "easeOut" }}
            />

            <motion.line
              x1="20"
              x2="20"
              y1="24"
              y2="262"
              stroke="#75F5C1"
              strokeWidth="1"
              opacity="0"
              animate={{ x1: [20, 580], x2: [20, 580], opacity: [0, 0.35, 0] }}
              transition={{ duration: 4.5, delay: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />

            {markers.map(({ x, y, label, color, background }, index) => (
              <motion.g
                key={`${label}-${x}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 1.05 + index * 0.16 }}
              >
                <rect x={x - 22} y={y - 24} width="44" height="18" rx="4" fill={background} />
                <text x={x} y={y - 15} textAnchor="middle" dominantBaseline="middle" fill={color} className="text-[9px] font-semibold">
                  {label}
                </text>
              </motion.g>
            ))}

            <motion.circle
              cx="580"
              cy="30"
              fill="none"
              stroke="#00D084"
              strokeWidth="1"
              animate={{ r: [8, 15, 8], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
            <circle cx="580" cy="30" r="6" fill="#00D084" opacity="0.22" />
            <circle cx="580" cy="30" r="4" fill="#00D084" />

            {months.map((month, index) => (
              <text key={month} x={20 + (560 / 11) * index} y="285" textAnchor="middle" fill="#8A8F99" className="text-[10px]">
                {month}
              </text>
            ))}
          </svg>
        </div>

        <footer className="relative z-10 flex h-[24px] shrink-0 items-center justify-between gap-2 text-[#8A8F99]">
          <span className="whitespace-nowrap text-[10px] sm:text-[11px]">
            <span className="sm:hidden">4.1%  Аптайм 99.9%</span>
            <span className="hidden sm:inline">Макс. просадка 4.1%  Аптайм 99.9%</span>
          </span>
          <span className="whitespace-nowrap text-right text-[8px] italic sm:text-[9px]">
            <span className="sm:hidden">Demo  симуляция</span>
            <span className="hidden sm:inline">Demo  данные симулированы</span>
          </span>
        </footer>
      </div>
    </motion.div>
  );
}
