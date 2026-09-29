import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import { TradingTerminal } from "./HeroTerminal";
import { MetricsStrip } from "./HeroMetrics";

export default function Hero() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const c = useContent();

  const trust = [c("hero", "trust1", t("hero.trust1")), c("hero", "trust2", t("hero.trust2")), c("hero", "trust3", t("hero.trust3"))];

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
    <section className="hero relative isolate flex min-h-[70svh] w-full flex-col overflow-hidden bg-[#F8FAFC] pb-6 pt-24 dark:bg-[#080D16] md:pt-28">
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

      <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 lg:px-10">
        <motion.div {...enter(0)} className="mb-5 flex justify-center">
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
              {c("hero", "badge", t("hero.badge"))}
            </span>
          </div>
        </motion.div>

        <motion.h1
          {...enter(0.06)}
          className="mb-5 text-balance text-center text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-[#0B0F14] dark:text-white sm:text-[38px] lg:text-[44px]"
        >
          {c("hero", "title", t("hero.title"))}
        </motion.h1>

        <motion.p
          {...enter(0.12)}
          className="mx-auto mb-8 max-w-[720px] text-center text-[15px] leading-[1.7] text-[#4B5563] dark:text-slate-400 lg:text-[17px]"
        >
          {c("hero", "subtitle", t("hero.subtitle"))}
        </motion.p>

        <motion.div {...enter(0.2)} className="mb-4 flex justify-center">
          <a
            href="#bots"
            className="group inline-flex h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-9 text-[15px] font-semibold text-white shadow-[0_12px_32px_-12px_rgba(16,185,129,0.75)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-[0_18px_38px_-12px_rgba(16,185,129,0.85)]"
          >
            {c("hero", "primary", t("hero.pick"))}
            <ArrowRight
              size={16}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
          <a
            href="#how"
            className="ml-3 inline-flex h-[48px] items-center justify-center rounded-xl border border-black/10 px-7 text-[14px] font-medium text-[#0B0F14] transition-colors hover:bg-black/[0.03] dark:border-white/15 dark:text-white dark:hover:bg-white/[0.06]"
          >
            <BookOpen size={16} className="mr-2 opacity-50" />
            {c("hero", "secondary", t("hero.cta2"))}
          </a>
        </motion.div>

        <motion.div {...enter(0.26)} className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {trust.map((text, i) => {
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

        <motion.div {...enter(0.3)} className="relative mt-8 min-w-0">
          <TradingTerminal />
        </motion.div>

        <div className="mt-4 shrink-0">
          <MetricsStrip />
        </div>
      </div>
    </section>
  );
}
