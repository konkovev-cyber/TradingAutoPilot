import React from "react";
import { BarChart3, Crosshair, Sliders, Trophy, ChevronRight, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import { botText, type BotData } from "@/data/bots";

const TRADE_STEP_STYLES = [
  {
    badgeBg: "bg-cyan-500 text-white dark:bg-cyan-400 dark:text-slate-950",
    border: "border-cyan-200 hover:border-cyan-400 dark:border-cyan-500/50 dark:hover:border-cyan-400",
    glow: "shadow-sm hover:shadow-cyan-100 dark:shadow-[0_0_24px_rgba(6,182,212,0.18)]",
    cardBg: "bg-white dark:bg-gradient-to-b dark:from-[#0a1e32] dark:via-[#091626] dark:to-[#07101d]",
    icon: (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
        <BarChart3 size={26} className="text-cyan-600 dark:text-cyan-400" />
      </div>
    ),
  },
  {
    badgeBg: "bg-amber-500 text-white dark:bg-amber-400 dark:text-slate-950",
    border: "border-amber-200 hover:border-amber-400 dark:border-amber-500/50 dark:hover:border-amber-400",
    glow: "shadow-sm hover:shadow-amber-100 dark:shadow-[0_0_24px_rgba(245,158,11,0.18)]",
    cardBg: "bg-white dark:bg-gradient-to-b dark:from-[#251d08] dark:via-[#1a1408] dark:to-[#120d06]",
    icon: (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
        <Crosshair size={26} className="text-amber-600 dark:text-amber-400" />
      </div>
    ),
  },
  {
    badgeBg: "bg-blue-600 text-white dark:bg-blue-500 dark:text-white",
    border: "border-blue-200 hover:border-blue-400 dark:border-blue-500/50 dark:hover:border-blue-400",
    glow: "shadow-sm hover:shadow-blue-100 dark:shadow-[0_0_24px_rgba(59,130,246,0.18)]",
    cardBg: "bg-white dark:bg-gradient-to-b dark:from-[#0e1d3d] dark:via-[#0a142c] dark:to-[#060d1f]",
    icon: (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
        <Sliders size={26} className="text-blue-600 dark:text-blue-400" />
      </div>
    ),
  },
  {
    badgeBg: "bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950",
    border: "border-emerald-200 hover:border-emerald-400 dark:border-emerald-500/50 dark:hover:border-emerald-400",
    glow: "shadow-sm hover:shadow-emerald-100 dark:shadow-[0_0_24px_rgba(16,185,129,0.18)]",
    cardBg: "bg-white dark:bg-gradient-to-b dark:from-[#092b1f] dark:via-[#071f16] dark:to-[#05140f]",
    icon: (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
        <Trophy size={26} className="fill-emerald-500/15 dark:fill-emerald-400/20 text-emerald-600 dark:text-emerald-400" />
      </div>
    ),
  },
];

export default function BotTradeExample({ bot }: { bot: BotData }) {
  const { t, lang } = useI18n();
  const c = useContent();
  const b = botText(bot, lang);

  if (b.exampleTrade.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#070b16] p-5 sm:p-7 shadow-sm dark:shadow-2xl transition-colors">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {c("botDetail", "exampleTitle", t("botDetail.exampleTitle"))}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {c("botDetail", "exampleNote", t("botDetail.exampleNote"))}
        </p>
      </div>

      {/* Visual Chain of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row lg:items-stretch gap-3 lg:gap-2">
        {b.exampleTrade.map((step, idx) => {
          const style = TRADE_STEP_STYLES[idx % TRADE_STEP_STYLES.length];
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

                {/* Graphical Icon */}
                <div className="mt-2 mb-3 flex h-14 w-full items-center justify-center">
                  {style.icon}
                </div>

                {/* Title */}
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-1.5 leading-snug">
                  {step.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Chevron separator for desktop row */}
              {idx < b.exampleTrade.length - 1 && (
                <div className="hidden lg:flex items-center justify-center text-slate-400 dark:text-slate-600 shrink-0 px-0.5">
                  <ChevronRight size={22} className="stroke-[2.5]" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom note */}
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <ArrowRight size={14} className="shrink-0 text-slate-400 dark:text-slate-500" />
        <span>{c("botDetail", "examplePrinciple", t("botDetail.examplePrinciple"))}</span>
      </div>
    </div>
  );
}
