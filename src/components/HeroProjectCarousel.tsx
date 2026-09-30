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
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d1130]/80 p-5 shadow-[0_28px_80px_-32px_rgba(99,102,241,0.65)] backdrop-blur-xl sm:p-7"
    >
      <div aria-hidden="true" className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/35 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
      <div aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

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
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-300/20 to-violet-500/30 text-cyan-200 shadow-[0_0_36px_rgba(34,211,238,0.18)]">
                  <Icon size={26} />
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100">
                  {current.eyebrow}
                </span>
              </div>
              <h2 className="max-w-sm text-2xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-3xl">{current.title}</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">{current.desc}</p>
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
                    className={`h-2.5 rounded-full transition-all ${active === index ? "w-7 bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.8)]" : "w-2.5 bg-white/25 hover:bg-white/50"}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => goTo(active - 1)}
                  aria-label={t("carousel.prev")}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white transition-colors hover:bg-white/[0.13]"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => goTo(active + 1)}
                  aria-label={t("carousel.next")}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white transition-colors hover:bg-white/[0.13]"
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
