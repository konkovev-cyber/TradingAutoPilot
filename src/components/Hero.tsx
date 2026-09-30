import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Send, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import HeroProjectCarousel from "./HeroProjectCarousel";

export default function Hero() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const c = useContent();
  const trust = [c("hero", "trust1", t("hero.trust1")), c("hero", "trust2", t("hero.trust2")), c("hero", "trust3", t("hero.trust3"))];
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.46, delay: reduceMotion ? 0 : delay, ease: "easeOut" as const },
  });

  return (
    <section id="project" className="hero-reference relative isolate overflow-hidden bg-white pb-20 pt-28 text-slate-900 transition-colors dark:bg-[#07091b] dark:text-white md:pt-36">
      <div aria-hidden="true" className="hero-reference-wave pointer-events-none absolute inset-x-0 top-0 h-[260px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-[#092d49] dark:via-[#15134e] dark:to-[#341b76]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-20" style={{ backgroundImage: "linear-gradient(rgba(25,74,150,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(25,74,150,0.4) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-44 h-96 w-96 rounded-full bg-violet-400/15 blur-[110px] dark:bg-violet-500/30" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-10">
        <motion.div {...enter(0)} className="max-w-2xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700 dark:border-white/15 dark:bg-white/[0.08] dark:text-cyan-100">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.85)]" />
            {c("hero", "badge", t("hero.badge"))}
          </span>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-slate-900 dark:text-white sm:text-5xl lg:text-[56px]">
            Торговые боты для криптобирж
            <span className="block bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-cyan-300 dark:via-blue-300 dark:to-violet-300">и акций</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            {c("hero", "subtitle", t("hero.subtitle"))}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#bots" className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-[0_18px_40px_-16px_rgba(37,99,235,0.7)] transition-all hover:-translate-y-0.5">
              {c("hero", "primary", t("hero.pick"))}<ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href="https://t.me/coinsofter" target="_blank" rel="noopener noreferrer" className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.12]">
              <Send size={16} className="text-blue-600 dark:text-cyan-300" />{t("cta.contactBtn")}
            </a>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
            {trust.map((text, index) => {
              const Icon = [ShieldCheck, Zap, Sparkles][index % 3];
              return <span key={text} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Icon size={14} className="text-blue-600 dark:text-cyan-300" />{text}</span>;
            })}
          </div>
        </motion.div>

        <motion.div {...enter(0.18)} className="relative lg:pt-8">
          <HeroProjectCarousel />
        </motion.div>
      </div>
    </section>
  );
}
