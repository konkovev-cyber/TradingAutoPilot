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
    <section id="project" className="hero relative isolate overflow-hidden bg-[#07091b] pb-16 pt-28 text-white md:pb-24 md:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(116,90,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(116,90,255,0.08) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
        <div className="absolute -left-40 -top-56 h-[620px] w-[620px] rounded-full bg-cyan-400/20 blur-[130px]" />
        <div className="absolute -right-40 top-24 h-[620px] w-[620px] rounded-full bg-violet-600/35 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[760px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div {...enter(0)} className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-white/[0.06] px-4 py-2 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <motion.span animate={reduceMotion ? undefined : { scale: [1, 2.4, 1], opacity: [0.7, 0, 0.7] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full bg-cyan-300" />
              <span className="relative h-2 w-2 rounded-full bg-cyan-300" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-cyan-100">{c("hero", "badge", t("hero.badge"))}</span>
          </div>

          <h1 className="text-balance text-4xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Trading<span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">AutoPilot</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {c("hero", "subtitle", t("hero.subtitle"))}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#bots" className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 text-sm font-bold text-slate-950 shadow-[0_18px_45px_-16px_rgba(34,211,238,0.85)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-16px_rgba(34,211,238,0.9)]">
              {c("hero", "primary", t("hero.pick"))}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href="https://t.me/coinsofter" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-8 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/[0.12]">
              <Send size={17} className="text-cyan-200" />
              {t("cta.contactBtn")}
            </a>
          </div>
        </motion.div>

        <motion.div {...enter(0.2)} className="mx-auto mt-10 max-w-4xl">
          <HeroProjectCarousel />
        </motion.div>

        <motion.div {...enter(0.3)} className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {trust.map((text, index) => {
            const Icon = [ShieldCheck, Zap, Sparkles][index % 3];
            return (
              <span key={text} className="flex items-center gap-2 text-xs text-slate-300">
                <Icon size={15} className="text-cyan-300" />
                {text}
              </span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
