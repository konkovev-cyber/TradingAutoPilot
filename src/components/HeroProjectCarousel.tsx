import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Bot, ShieldCheck, Infinity, Rocket, ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const icons: LucideIcon[] = [Bot, ShieldCheck, Infinity, Rocket];

interface ProjectSlide {
  title: string;
  desc: string;
  eyebrow: string;
}

export default function HeroProjectCarousel() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const slides = t("hero.projectSlides") as ProjectSlide[];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (reduceMotion || paused || count < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % count), 6000);
    return () => window.clearInterval(timer);
  }, [count, paused, reduceMotion]);

  const current = useMemo(() => slides[active] ?? slides[0], [active, slides]);
  const Icon = icons[active % icons.length] ?? Bot;
  const goTo = (next: number) => setActive((next + count) % count);

  if (!current) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t("hero.carouselLabel")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/75 p-5 shadow-soft-lg backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-[#0d1130]/80 dark:shadow-[0_28px_80px_-32px_rgba(99,102,241,0.65)] sm:p-7"
    >
      <div aria-hidden="true" className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-300/25 blur-3xl dark:bg-violet-500/35" />
      <div aria-hidden="true" className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-blue-300/20 blur-3xl dark:bg-cyan-400/20" />
      <div aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent dark:via-cyan-300/70" />

      <div className="relative min-h-[264px] sm:min-h-[300px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={reduceMotion ? false : { opacity: 0, x: 18, y: 6 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -18, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.34, ease: "easeOut" }}
            className="flex min-h-[264px] flex-col justify-between sm:min-h-[300px]"
          >
            <div>
              <div className="mb-7 flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 shadow-md transition-colors dark:border-cyan-300/25 dark:from-cyan-300/20 dark:to-violet-500/30 dark:text-cyan-200 dark:shadow-[0_0_36px_rgba(34,211,238,0.18)]">
                  <Icon size={26} />
                </div>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700 transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:text-cyan-100">
                  {current.eyebrow}
                </span>
              </div>
              <h2 className="max-w-sm text-2xl font-bold leading-tight tracking-[-0.02em] text-slate-900 transition-colors dark:text-white sm:text-3xl">{current.title}</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 transition-colors dark:text-slate-300 sm:text-base">{current.desc}</p>
            </div>

            <div className="mt-7 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2" role="tablist" aria-label={t("hero.carouselLabel")}>
                {slides.map((slide, index) => (
                  <button
                    key={`${slide.title}-${index}`}
                    onClick={() => goTo(index)}
                    role="tab"
                    aria-selected={active === index}
                    aria-label={`${t("carousel.goto")} ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${active === index ? "w-7 bg-indigo-600 shadow-[0_0_14px_rgba(79,70,229,0.55)] dark:bg-cyan-300 dark:shadow-[0_0_14px_rgba(103,232,249,0.8)]" : "w-2.5 bg-blue-200 hover:bg-blue-300 dark:bg-white/25 dark:hover:bg-white/50"}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => goTo(active - 1)}
                  aria-label={t("carousel.prev")}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.13]"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => goTo(active + 1)}
                  aria-label={t("carousel.next")}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.13]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
