import React from "react";
import { Layers, Coins, MousePointerClick, LineChart, BellRing, ChevronRight } from "lucide-react";
import { type BotData } from "@/data/bots";

const CAPABILITY_CARDS = [
  {
    num: 1,
    title: "3 биржи и до 5 аккаунтов",
    desc: "Bybit, OKX, BingX. До 5 аккаунтов одновременно: demo и реальные",
    badgeBg: "bg-cyan-500 text-white dark:bg-cyan-400 dark:text-slate-950",
    border: "border-cyan-200 hover:border-cyan-400 dark:border-cyan-500/50 dark:hover:border-cyan-400",
    glow: "shadow-sm hover:shadow-cyan-100 dark:shadow-[0_0_24px_rgba(6,182,212,0.18)]",
    cardBg: "bg-white dark:bg-gradient-to-b dark:from-[#0a1e32] dark:via-[#091626] dark:to-[#07101d]",
    icon: (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
        <Layers size={26} className="text-cyan-600 dark:text-cyan-400" />
      </div>
    ),
  },
  {
    num: 2,
    title: "Гибкий выбор монет",
    desc: "Списком или вручную с индивидуальной настройкой каждой пары",
    badgeBg: "bg-amber-500 text-white dark:bg-amber-400 dark:text-slate-950",
    border: "border-amber-200 hover:border-amber-400 dark:border-amber-500/50 dark:hover:border-amber-400",
    glow: "shadow-sm hover:shadow-amber-100 dark:shadow-[0_0_24px_rgba(245,158,11,0.18)]",
    cardBg: "bg-white dark:bg-gradient-to-b dark:from-[#251d08] dark:via-[#1a1408] dark:to-[#120d06]",
    icon: (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
        <Coins size={26} className="text-amber-600 dark:text-amber-400" />
      </div>
    ),
  },
  {
    num: 3,
    title: "Закрытие в 1 клик",
    desc: "Мгновенное закрытие позиции по любой монете одной кнопкой",
    badgeBg: "bg-rose-500 text-white",
    border: "border-rose-200 hover:border-rose-400 dark:border-rose-500/50 dark:hover:border-rose-400",
    glow: "shadow-sm hover:shadow-rose-100 dark:shadow-[0_0_24px_rgba(244,63,94,0.18)]",
    cardBg: "bg-white dark:bg-gradient-to-b dark:from-[#2d0f19] dark:via-[#200a12] dark:to-[#14060b]",
    icon: (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/15 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
        <MousePointerClick size={26} className="text-rose-600 dark:text-rose-400" />
      </div>
    ),
  },
  {
    num: 4,
    title: "Статистика и журнал",
    desc: "Открытые позиции, история сделок, PnL и «живой» журнал работы",
    badgeBg: "bg-purple-600 text-white dark:bg-purple-500 dark:text-white",
    border: "border-purple-200 hover:border-purple-400 dark:border-purple-500/50 dark:hover:border-purple-400",
    glow: "shadow-sm hover:shadow-purple-100 dark:shadow-[0_0_24px_rgba(168,85,247,0.18)]",
    cardBg: "bg-white dark:bg-gradient-to-b dark:from-[#220f38] dark:via-[#180a29] dark:to-[#0f061c]",
    icon: (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
        <LineChart size={26} className="text-purple-600 dark:text-purple-400" />
      </div>
    ),
  },
  {
    num: 5,
    title: "Надёжные уведомления",
    desc: "Отчёты в Telegram не теряются даже при временном обрыве связи",
    badgeBg: "bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950",
    border: "border-emerald-200 hover:border-emerald-400 dark:border-emerald-500/50 dark:hover:border-emerald-400",
    glow: "shadow-sm hover:shadow-emerald-100 dark:shadow-[0_0_24px_rgba(16,185,129,0.18)]",
    cardBg: "bg-white dark:bg-gradient-to-b dark:from-[#092b1f] dark:via-[#071f16] dark:to-[#05140f]",
    icon: (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
        <BellRing size={26} className="text-emerald-600 dark:text-emerald-400" />
      </div>
    ),
  },
];

export default function BotCapabilities({ bot }: { bot: BotData }) {
  const isSynchro = bot.slug === "synchrobot" || bot.slug === "synchro-bot";

  if (!isSynchro) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Что умеет бот:
        </h3>
        <ul className="space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2.5">
            <span className="text-slate-400 font-bold">•</span>
            <span>
              работать с тремя биржами и подключать <strong>несколько аккаунтов</strong> (до 5), в том числе demo и реальный;
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-slate-400 font-bold">•</span>
            <span>
              выбирать монеты списком или вводить вручную и настраивать каждую монету отдельно;
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-slate-400 font-bold">•</span>
            <span>
              мгновенно закрывать позицию по одной монете одной кнопкой;
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-slate-400 font-bold">•</span>
            <span>
              показывать открытые позиции, историю сделок, статистику и «живой» журнал работы;
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-slate-400 font-bold">•</span>
            <span>
              надёжно доставлять уведомления — они не теряются, даже если на время пропала связь.
            </span>
          </li>
        </ul>
      </div>

      {/* Visual Chain Banner with Light & Dark Theme Support */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#070b16] p-4 sm:p-6 shadow-sm dark:shadow-2xl transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row lg:items-stretch gap-3 lg:gap-2">
          {CAPABILITY_CARDS.map((card, idx) => (
            <React.Fragment key={idx}>
              <div
                className={`relative flex-1 flex flex-col items-center text-center rounded-2xl border ${card.border} ${card.cardBg} ${card.glow} p-4 sm:p-5 transition-all duration-200 hover:scale-[1.02]`}
              >
                {/* Number badge */}
                <div
                  className={`absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs ${card.badgeBg}`}
                >
                  {card.num}
                </div>

                {/* Icon */}
                <div className="mt-2 mb-3 flex h-14 w-full items-center justify-center">
                  {card.icon}
                </div>

                {/* Title */}
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-1.5 leading-snug">
                  {card.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              {/* Chevron separator for desktop row */}
              {idx < CAPABILITY_CARDS.length - 1 && (
                <div className="hidden lg:flex items-center justify-center text-slate-400 dark:text-slate-600 shrink-0 px-0.5">
                  <ChevronRight size={22} className="stroke-[2.5]" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
