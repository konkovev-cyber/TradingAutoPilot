import { motion } from "framer-motion";
import { useId } from "react";

const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

// An illustrative curve, not a record of trades or verified historical returns.
// The two drawdowns are deliberate and the chart is not connected to market data.
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
  { x: 150, y: 200, label: "BUY", color: "#00B96B", background: "rgba(0,185,107,0.2)" },
  { x: 300, y: 165, label: "SELL", color: "#FF6666", background: "rgba(255,77,77,0.2)" },
  { x: 480, y: 60, label: "BUY", color: "#00B96B", background: "rgba(0,185,107,0.2)" },
] as const;

export function TradingTerminal() {
  // Unique per instance so the SVG fill also works if this component is rendered twice.
  const gradientId = useId().replace(/:/g, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2 }}
      className="mx-auto w-full max-w-[640px]"
    >
      <div className="box-border flex h-[440px] min-w-0 flex-col gap-1 overflow-hidden rounded-[24px] border border-white/10 bg-[#0F141C] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] sm:p-7">
        <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-white/[0.06]">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#A9B2C0]">
              Доходность портфеля
            </p>
            <div className="flex items-baseline gap-2.5">
              <span className="text-[28px] font-bold leading-none tabular-nums text-[#45D49A]">+96.4%</span>
              <span className="text-xs text-[#A9B2C0]">за год</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-md bg-[#00B96B]/10 px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-[#45D49A]">
            <span className="relative h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-[#45D49A] motion-safe:animate-pulse" />
            </span>
            LIVE <span className="text-[#A9B2C0]"> DEMO</span>
          </div>
        </div>

        <div className="min-h-0 flex-1" role="img" aria-label="Демонстрационный график роста с двумя просадками и метками BUY и SELL. Данные симулированы.">
          <svg className="block h-full w-full" viewBox="0 0 600 300" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00B96B" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00B96B" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[60, 120, 180, 240].map((y) => (
              <line key={y} x1="20" x2="580" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            ))}

            <path d={`${curve} L 580 264 L 20 264 Z`} fill={`url(#${gradientId})`} />
            <path d={curve} fill="none" stroke="#00B96B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {markers.map(({ x, y, label, color, background }) => (
              <g key={`${label}-${x}`}>
                <circle cx={x} cy={y} r="3.5" fill="#0F141C" stroke={color} strokeWidth="2" />
                <rect x={x - 29} y={y - 26} width="58" height="18" rx="4" fill={background} />
                <text
                  x={x}
                  y={y - 17}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={color}
                  className="text-[17px] font-semibold sm:text-[9px]"
                >
                  {label === "BUY" ? " BUY" : " SELL"}
                </text>
              </g>
            ))}

            <circle cx="580" cy="30" r="9" fill="#00B96B" opacity="0.24" className="motion-safe:animate-pulse" />
            <circle cx="580" cy="30" r="5" fill="#00B96B" stroke="#0F141C" strokeWidth="2" />

            {months.map((month, index) => (
              <text
                key={month}
                x={20 + (560 / 11) * index}
                y="287"
                textAnchor="middle"
                fill="#A9B2C0"
                className={`${index % 2 === 1 ? "hidden sm:block" : ""} text-[20px] sm:text-[10px]`}
              >
                {month}
              </text>
            ))}
          </svg>
        </div>

        <div className="flex h-[24px] shrink-0 items-center justify-between gap-2 border-t border-white/[0.06] text-[#A9B2C0]">
          <span className="whitespace-nowrap text-[10px] sm:text-[11px]">
            <span className="sm:hidden">Просадка 4.1%</span>
            <span className="hidden sm:inline">Макс. просадка 4.1% <span className="px-1"></span> Аптайм 99.9%</span>
          </span>
          <span className="whitespace-nowrap text-right text-[9px] italic">
            <span className="sm:hidden">Демо  симуляция</span>
            <span className="hidden sm:inline">Demo  данные симулированы</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}