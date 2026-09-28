import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, ShieldCheck, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useBots } from "@/lib/use-bots";
import { TradingTerminal } from "./HeroTerminal";
import { MetricsStrip } from "./HeroMetrics";

const ROTATE_MS = 5500;

export default function Hero() {
  const { lang } = useI18n();
  const reduceMotion = useReducedMotion();
  const bots = useBots();
  const isEnglish = lang === "en";

  const copy = isEnglish
    ? {
        badge: "Autonomous trading system",
        markets: "Crypto + Stocks",
        title: (
          <>
            Trade global markets.{" "}
            <span className="hero-accent">With one bot.</span>
          </>
        ),
        description:
          "CryptoSuperStock analyzes price deviations, calculates entry levels and works through limit orders. Crypto and international stocks in one automated system.",
        primary: "Choose a bot",
        secondary: "How it works",
        trust: ["API without withdrawal rights", "Setup in 2 minutes"],
      }
    : {
        badge: "Автономная торговая система",
        markets: "Crypto + Stocks",
        title: (
          <>
            Торгуйте мировыми рынками.{" "}
            <span className="hero-accent">Одним роботом.</span>
          </>
        ),
        description:
          "CryptoSuperStock анализирует отклонения цены, рассчитывает уровни входа и работает через лимитные ордера. Криптовалюты и международные акции в одной автоматической системе.",
        primary: "Выбрать робота",
        secondary: "Как это работает",
        trust: ["API без права вывода", "Настройка за 2 минуты"],
      };

  // Поочерёдное описание каждого робота с эффектным появлением
  const stories = bots.filter((b) => b.name && b.shortDesc);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (stories.length < 2) return;
    const timer = setTimeout(() => setActive((i) => (i + 1) % stories.length), ROTATE_MS);
    return () => clearTimeout(timer);
  }, [active, stories.length]);

  const current = stories.length > 0 ? stories[active % stories.length] : null;

  return (
    <section className="hero relative isolate box-border flex w-full flex-col overflow-hidden bg-[#F8FAFC] pb-12 pt-20 dark:bg-[#080D16] md:pt-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, #0B0F14 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <motion.div
          className="absolute -right-40 -top-48 h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.16),rgba(37,99,235,0.08)_35%,transparent_70%)] blur-3xl dark:opacity-90"
          animate={{ x: [0, -28, 0], y: [0, 24, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-64 left-1/3 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.09),transparent_68%)] blur-3xl dark:opacity-90"
          animate={{ x: [0, 35, 0], opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 lg:px-10 xl:px-14 2xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 flex shrink-0 items-center gap-3"
        >
          <div className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-3.5 py-1.5 shadow-sm backdrop-blur-md dark:border-white/[0.12] dark:bg-white/[0.06]">
            <span className="relative flex h-1.5 w-1.5">
              <motion.span
                animate={{ scale: [1, 2.4, 1], opacity: [0.65, 0, 0.65] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-[#10B981]"
              />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5F6B] dark:text-slate-300">{copy.badge}</span>
          </div>
          <span className="hidden text-[10px] font-medium text-slate-400 dark:text-slate-500 sm:block">{copy.markets}</span>
        </motion.div>

        <div className="hero__inner grid flex-1 content-center items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] xl:gap-14">
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mb-5 text-balance text-[42px] font-bold leading-[1.1] tracking-[-0.02em] text-[#0B0F14] dark:text-white sm:text-[46px] lg:text-[48px] xl:text-[48px]"
            >
              {copy.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.17 }}
              className="mb-7 max-w-[520px]"
            >
              {current ? (
                <>
                  <div className="min-h-[136px] sm:min-h-[108px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={current.slug}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -10, transition: { duration: reduceMotion ? 0 : 0.25 } }}
                        transition={{ duration: reduceMotion ? 0 : 0.3 }}
                      >
                        <div className="mb-2.5 flex items-center gap-2">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: current.color, boxShadow: `0 0 10px ${current.color}` }}
                          />
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0B0F14] dark:text-white">
                            {current.name}
                          </span>
                        </div>
                        <p className="text-[16px] leading-[1.6] text-[#5A5F6B] dark:text-slate-400">
                          {current.shortDesc.split(" ").map((word, i) => (
                            <Fragment key={`${current.slug}-${i}`}>
                              <motion.span
                                className="inline-block"
                                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{
                                  duration: reduceMotion ? 0 : 0.45,
                                  delay: reduceMotion ? 0 : 0.05 + i * 0.022,
                                  ease: "easeOut",
                                }}
                              >
                                {word}
                              </motion.span>{" "}
                            </Fragment>
                          ))}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {stories.length > 1 && (
                    <div className="mt-4 flex items-center gap-1.5">
                      {stories.map((b, i) => {
                        const isActive = i === active % stories.length;
                        return (
                          <button
                            key={b.slug}
                            type="button"
                            onClick={() => setActive(i)}
                            aria-label={b.name}
                            className={
                              isActive
                                ? "relative h-1 w-9 overflow-hidden rounded-full bg-black/10 transition-all duration-300 dark:bg-white/10"
                                : "relative h-1 w-2.5 rounded-full bg-black/15 transition-all duration-300 hover:bg-black/30 dark:bg-white/15 dark:hover:bg-white/30"
                            }
                          >
                            {isActive && (
                              <span
                                className="hero-progress absolute inset-y-0 left-0 w-full rounded-full"
                                style={{ backgroundColor: b.color }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[16px] leading-[1.6] text-[#5A5F6B] dark:text-slate-400">{copy.description}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26 }}
              className="mb-5 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#bots"
                className="group inline-flex h-[50px] items-center justify-center gap-2 rounded-xl bg-[#10B981] px-7 text-[14px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(16,185,129,0.65)] transition-all hover:-translate-y-0.5 hover:bg-[#0D9669] hover:shadow-[0_16px_35px_-10px_rgba(16,185,129,0.75)]"
              >
                {copy.primary}
                <ArrowRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#how"
                className="inline-flex h-[50px] items-center justify-center rounded-xl border border-black/10 px-7 text-[14px] font-medium text-[#0B0F14] transition-colors hover:bg-black/[0.03] dark:border-white/15 dark:text-white dark:hover:bg-white/[0.06]"
              >
                <BookOpen size={16} className="mr-2 opacity-50" />
                {copy.secondary}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-5"
            >
              {[
                { icon: ShieldCheck, text: copy.trust[0] },
                { icon: Zap, text: copy.trust[1] },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <item.icon size={13} className="text-[#10B981]" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative min-w-0">
            <TradingTerminal />
          </div>
        </div>

        <div className="mt-8 shrink-0">
          <MetricsStrip />
        </div>
      </div>
    </section>
  );
}