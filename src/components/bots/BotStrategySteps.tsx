import React from "react";
import { Zap, ShieldCheck, Eye, Check, ChevronRight, Activity, TrendingUp, Cpu, Award } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { botText, type BotData } from "@/data/bots";

// Candlestick graphic SVG matching the screenshot
function CandlestickIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="shrink-0">
      {/* Red candle */}
      <line x1="9" y1="8" x2="9" y2="28" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <rect x="7" y="13" width="4" height="10" rx="1" fill="#ef4444" />
      {/* Green candle 1 (tall) */}
      <line x1="18" y1="6" x2="18" y2="30" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
      <rect x="16" y="10" width="4" height="15" rx="1" fill="#10b981" />
      {/* Green candle 2 (medium) */}
      <line x1="27" y1="9" x2="27" y2="27" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
      <rect x="25" y="12" width="4" height="11" rx="1" fill="#10b981" />
    </svg>
  );
}

const STEP_STYLES = [
  {
    badgeBg: "bg-cyan-400 text-slate-950",
    border: "border-cyan-500/50 hover:border-cyan-400",
    glow: "shadow-[0_0_24px_rgba(6,182,212,0.18)]",
    cardBg: "bg-gradient-to-b from-[#0a1e32] via-[#091626] to-[#07101d]",
    icon: <CandlestickIcon />,
  },
  {
    badgeBg: "bg-amber-400 text-slate-950",
    border: "border-amber-500/50 hover:border-amber-400",
    glow: "shadow-[0_0_24px_rgba(245,158,11,0.18)]",
    cardBg: "bg-gradient-to-b from-[#251d08] via-[#1a1408] to-[#120d06]",
    icon: (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
        <Zap size={26} className="fill-amber-400 text-amber-400" />
      </div>
    ),
  },
  {
    badgeBg: "bg-blue-500 text-white",
    border: "border-blue-500/50 hover:border-blue-400",
    glow: "shadow-[0_0_24px_rgba(59,130,246,0.18)]",
    cardBg: "bg-gradient-to-b from-[#0e1d3d] via-[#0a142c] to-[#060d1f]",
    icon: (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
        <ShieldCheck size={28} className="fill-blue-500/25 text-blue-400" />
      </div>
    ),
  },
  {
    badgeBg: "bg-purple-500 text-white",
    border: "border-purple-500/50 hover:border-purple-400",
    glow: "shadow-[0_0_24px_rgba(168,85,247,0.18)]",
    cardBg: "bg-gradient-to-b from-[#220f38] via-[#180a29] to-[#0f061c]",
    icon: (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
        <Eye size={26} className="text-purple-400" />
      </div>
    ),
  },
  {
    badgeBg: "bg-emerald-400 text-slate-950",
    border: "border-emerald-500/50 hover:border-emerald-400",
    glow: "shadow-[0_0_24px_rgba(16,185,129,0.18)]",
    cardBg: "bg-gradient-to-b from-[#092b1f] via-[#071f16] to-[#05140f]",
    icon: (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
          <Check size={18} className="stroke-[3.5] text-slate-950" />
        </div>
      </div>
    ),
  },
];

export default function BotStrategySteps({ bot }: { bot: BotData }) {
  const { lang } = useI18n();
  const b = botText(bot, lang);

  if (b.howItWorks.length === 0) return null;

  const isSynchro = bot.slug === "synchrobot" || bot.slug === "synchro-bot";

  return (
    <div className="space-y-6">
      {/* Bullet points for SynchroBot */}
      {isSynchro && (
        <ul className="space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2.5">
            <span className="text-slate-400 font-bold">•</span>
            <span>постоянно анализирует графики выбранных вами монет;</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-slate-400 font-bold">•</span>
            <span>находит подходящие моменты для входа и открывает позиции;</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-slate-400 font-bold">•</span>
            <span>сразу ставит на бирже защитные ордера — стоп-лосс и тейк-профит;</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-slate-400 font-bold">•</span>
            <span>сам ведёт позицию до закрытия: фиксирует прибыль и ограничивает убыток;</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-slate-400 font-bold">•</span>
            <span>присылает вам в Telegram сообщения о каждом входе и выходе — с графиком.</span>
          </li>
        </ul>
      )}

      {/* Visual Chain Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#070b16] p-4 sm:p-6 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row lg:items-stretch gap-3 lg:gap-2">
          {b.howItWorks.map((step, idx) => {
            const style = STEP_STYLES[idx % STEP_STYLES.length];
            return (
              <React.Fragment key={idx}>
                <div
                  className={`relative flex-1 flex flex-col items-center text-center rounded-2xl border ${style.border} ${style.cardBg} ${style.glow} p-4 sm:p-5 transition-all duration-200 hover:scale-[1.02]`}
                >
                  {/* Step number badge */}
                  <div
                    className={`absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs ${style.badgeBg}`}
                  >
                    {idx + 1}
                  </div>

                  {/* Icon */}
                  <div className="mt-2 mb-3 flex h-14 w-full items-center justify-center">
                    {style.icon}
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-white text-sm sm:text-base mb-1.5 leading-snug">
                    {step.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Chevron separator for desktop row */}
                {idx < b.howItWorks.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center text-slate-600 shrink-0 px-0.5">
                    <ChevronRight size={22} className="stroke-[2.5]" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
