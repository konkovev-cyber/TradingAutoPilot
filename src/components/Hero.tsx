import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, ShieldCheck, Zap } from "lucide-react";
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
        badge: "Autonomous trading system",
        markets: "Crypto + Stocks",
        titleLead: "Trade global markets.",
        titleAccent: "With one bot.",
        description:
          "CryptoSuperStock reads price deviations, computes entry levels and works through limit orders. Crypto and international stocks inside one automated system.",
        primary: "Choose a bot",
        secondary: "How it works",
        chipsLabel: "Live strategies",
        trust: ["API without withdrawal rights", "Setup in 2 minutes"],
      }
    : {
        badge: "Автономная торговая система",
        markets: "Crypto + Stocks",
        titleLead: "Торгуйте мировыми рынками.",
        titleAccent: "Одним роботом.",
        description:
          "CryptoSuperStock анализирует отклонения цены, рассчитывает уровни входа и работает через лимитные ордера. Криптовалюты и международные акции в одной автоматической системе.",
        primary: "Выбрать робота",
        secondary: "Как это работает",
        chipsLabel: "Стратегии в работе",
        trust: ["API без права вывода", "Настройка за 2 минуты"],
      };

  const chips = bots.filter((b) => b.name && b.shortDesc).slice(0, 3);

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : 0.5,
      delay: reduceMotion ? 0 : delay,
      ease: "easeOut" as const,
    },
  });

  return (
    <section className="hero relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#F8FAFC] pb-8 pt-20 dark:bg-[#080D16] md:pt-24">
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
        <motion.div {...enter(0)} className="mb-5 flex shrink-0 flex-wrap items-center gap-3">
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

        <div className="grid flex-1 items-center gap-10 lg:grid-cols-12 xl:gap-12">
          <div className="relative z-10 lg:col-span-5">
            <motion.h1
              {...enter(0.06)}
              className="mb-4 max-w-[540px] text-balance text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-[#0B0F14] dark:text-white sm:text-[42px] lg:text-[42px] xl:text-[50px]"
            >
              {copy.titleLead}{" "}
              <span className="hero-accent">{copy.titleAccent}</span>
            </motion.h1>

            <motion.p
              {...enter(0.12)}
              className="mb-6 max-w-[520px] text-[15px] leading-[1.6] text-[#4B5563] dark:text-slate-400 lg:text-[16px]"
            >
              {copy.description}
            </motion.p>

            {chips.length > 0 && (
              <motion.div {...enter(0.18)} className="mb-6">
                <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  {copy.chipsLabel}
                </div>
                <div className="flex flex-wrap gap-2">
                  {chips.map((bot) => (
                    <a
                      key={bot.slug}
                      href="#bots"
                      className="group flex items-center gap-2 rounded-xl border border-black/[0.07] bg-white/80 px-3 py-2 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-black/[0.14] hover:shadow-[0_10px_26px_-12px_rgba(15,23,42,0.35)] dark:border-white/[0.1] dark:bg-white/[0.05] dark:hover:border-white/20"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: bot.color, boxShadow: `0 0 8px ${bot.color}` }}
                      />
                      <span className="text-[11.5px] font-semibold text-[#0B0F14] dark:text-white">
                        {bot.name}
                      </span>
                      <span className="text-[11.5px] font-bold tabular-nums text-emerald-500">
                        {headlineReturn(bot)}
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div {...enter(0.24)} className="mb-5 flex flex-col gap-3 sm:flex-row">
              <a
                href="#bots"
                className="group inline-flex h-[50px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 text-[14px] font-semibold text-white shadow-[0_12px_32px_-12px_rgba(16,185,129,0.75)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-[0_18px_38px_-12px_rgba(16,185,129,0.85)]"
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
                className="inline-flex h-[50px] items-center justify-center rounded-xl border border-black/10 px-7 text-[14px] font-medium text-[#0B0F14] transition-colors hover:bg-black/[0.03] dark:border-white/15 dark:text-white dark:hover:bg-white/[0.06]"
              >
                <BookOpen size={16} className="mr-2 opacity-50" />
                {copy.secondary}
              </a>
            </motion.div>

            <motion.div {...enter(0.3)} className="flex flex-wrap gap-5">
              {[
                { icon: ShieldCheck, text: copy.trust[0] },
                { icon: Zap, text: copy.trust[1] },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
                >
                  <item.icon size={13} className="text-emerald-500" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative min-w-0 lg:col-span-7">
            <TradingTerminal />
          </div>
        </div>

        <div className="mt-6 shrink-0">
          <MetricsStrip />
        </div>
      </div>
    </section>
  );
}