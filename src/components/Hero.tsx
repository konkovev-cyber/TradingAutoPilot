import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useBots } from "@/lib/use-bots";
import type { BotData } from "@/data/bots";
import { TradingTerminal } from "./HeroTerminal";
import { MetricsStrip } from "./HeroMetrics";

function headlineReturn(bot: BotData) {
  const last = bot.returns[bot.returns.length - 1];
  return last?.value ?? "";
}

export default function Hero() {
  const { lang } = useI18n();
  const reduceMotion = useReducedMotion();
  const bots = useBots();
  const isEnglish = lang === "en";

  const copy = isEnglish
    ? {
        badge: "Buy once — no monthly subscriptions",
        markets: "Crypto + Stocks",
        titleLead: "Automate stock and crypto trading",
        titleAccent: "Lifetime access, no subscriptions",
        description:
          "Three autonomous bots trade on 20+ exchanges via API. No subscription fee and no profit commission — buy the bot once, it trades for you around the clock.",
        primary: "Calculate profit",
        secondary: "How it works",
        trust: ["Buy once — no subscriptions", "API without withdrawal rights", "Setup in 2 minutes"],
      }
    : {
        badge: "Покупка один раз — никаких абонплат",
        markets: "Crypto + Stocks",
        titleLead: "Автоматизируйте торговлю акциями и криптой",
        titleAccent: "Пожизненный доступ без подписок",
        description:
          "Три автономных робота торгуют на 20+ биржах через API. Без абонентской платы и комиссий с прибыли: покупаете робота один раз — он торгует для вас круглосуточно.",
        primary: "Рассчитать прибыль",
        secondary: "Как это работает",
        trust: ["Покупка один раз — без подписок", "API без права вывода", "Настройка за 2 минуты"],
      };

  const chips = bots.filter((b) => b.name && b.shortDesc).slice(0, 3);
  const [activeBotIndex, setActiveBotIndex] = useState(0);
  const activeBot = chips.length > 0 ? chips[activeBotIndex % chips.length] : null;

  useEffect(() => {
    if (reduceMotion || chips.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveBotIndex((index) => (index + 1) % chips.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [chips.length, reduceMotion]);

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : 0.42,
      delay: reduceMotion ? 0 : delay,
      ease: "easeOut" as const,
    },
  });

  return (
    <section className="hero relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#F8FAFC] pb-5 pt-20 dark:bg-[#080D16] md:pt-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #0B0F14 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div
          className="hero-blob absolute -right-40 -top-56 h-[760px] w-[760px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.18), rgba(37,99,235,0.10) 38%, transparent 72%)",
          }}
        />
        <div
          className="hero-blob absolute -bottom-72 left-1/4 h-[600px] w-[600px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.10), transparent 68%)",
            animationDelay: "-7s",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 lg:px-10 xl:px-14 2xl:px-16">
        <motion.div {...enter(0)} className="mb-3 flex shrink-0 flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-3.5 py-1.5 shadow-sm backdrop-blur dark:border-white/[0.12] dark:bg-white/[0.06]">
            <span className="relative flex h-1.5 w-1.5">
              <motion.span
                animate={reduceMotion ? undefined : { scale: [1, 2.4, 1], opacity: [0.65, 0, 0.65] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-emerald-500"
              />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5F6B] dark:text-slate-300">
              {copy.badge}
            </span>
          </div>
          <span className="hidden text-[10px] font-medium text-slate-400 dark:text-slate-500 sm:block">
            {copy.markets}
          </span>
        </motion.div>

        <div className="grid flex-1 items-center gap-7 lg:grid-cols-12 xl:gap-9">
          <div className="relative z-10 lg:col-span-5">
            <motion.h1
              {...enter(0.06)}
              className="mb-2.5 max-w-[600px] text-balance text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-[#0B0F14] dark:text-white sm:text-[38px] lg:text-[42px] xl:text-[46px]"
            >
              {copy.titleLead}
            </motion.h1>

            <motion.div
              {...enter(0.1)}
              className="hero-accent mb-4 text-[21px] font-semibold leading-[1.25] tracking-[-0.01em] sm:text-[23px] lg:text-[25px]"
            >
              {copy.titleAccent}
            </motion.div>

            <motion.div {...enter(0.12)} className="mb-4 min-h-[106px] max-w-[520px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeBot?.slug ?? "default"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3 }}
                >
                  {activeBot ? (
                    <>
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: activeBot.color, boxShadow: `0 0 9px ${activeBot.color}` }}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          {activeBot.name}
                        </span>
                        <span className="text-[11px] font-bold tabular-nums text-emerald-500">
                          {headlineReturn(activeBot)}
                        </span>
                      </div>
                      <p className="text-[15px] leading-[1.6] text-[#4B5563] dark:text-slate-400 lg:text-[16px]">
                        {activeBot.shortDesc}
                      </p>
                    </>
                  ) : (
                    <p className="text-[15px] leading-[1.6] text-[#4B5563] dark:text-slate-400 lg:text-[16px]">
                      {copy.description}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div {...enter(0.24)} className="mb-3 flex flex-col gap-2.5 sm:flex-row">
              <a
                href="#calculator"
                className="group inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 text-[14px] font-semibold text-white shadow-[0_12px_32px_-12px_rgba(16,185,129,0.75)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-[0_18px_38px_-12px_rgba(16,185,129,0.85)]"
              >
                {copy.primary}
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a
                href="#how"
                className="inline-flex h-[46px] items-center justify-center rounded-xl border border-black/10 px-7 text-[14px] font-medium text-[#0B0F14] transition-colors hover:bg-black/[0.03] dark:border-white/15 dark:text-white dark:hover:bg-white/[0.06]"
              >
                <BookOpen size={16} className="mr-2 opacity-50" />
                {copy.secondary}
              </a>
            </motion.div>

            <motion.div {...enter(0.3)} className="flex flex-wrap gap-x-5 gap-y-2">
              {copy.trust.map((text, i) => {
                const Icon = [Sparkles, ShieldCheck, Zap][i % 3];
                return (
                  <div
                    key={text}
                    className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
                  >
                    <Icon size={13} className="text-emerald-500" />
                    <span>{text}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <div className="relative min-w-0 lg:col-span-7">
            <TradingTerminal />
          </div>
        </div>

        <div className="mt-4 shrink-0">
          <MetricsStrip />
        </div>
      </div>
    </section>
  );
}