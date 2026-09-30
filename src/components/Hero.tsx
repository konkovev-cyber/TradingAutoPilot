import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Send, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import { useBots } from "@/lib/use-bots";
import { botText } from "@/data/bots";
import { BotAvatar } from "./bots/BotCard";
import HeroProjectCarousel from "./HeroProjectCarousel";

function WaveShape({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path
        d="M0,96 C240,178 460,42 720,110 C980,178 1200,56 1440,96 L1440,0 L0,0 Z"
        fill="url(#heroWaveGradient)"
      />
      <defs>
        <linearGradient id="heroWaveGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Hero() {
  const { t, lang } = useI18n();
  const reduceMotion = useReducedMotion();
  const c = useContent();
  const bots = useBots();
  const trust = [c("hero", "trust1", t("hero.trust1")), c("hero", "trust2", t("hero.trust2")), c("hero", "trust3", t("hero.trust3"))];
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.46, delay: reduceMotion ? 0 : delay, ease: "easeOut" as const },
  });

  return (
    <section id="project" className="relative isolate overflow-hidden bg-white pb-14 pt-[210px] text-slate-900 transition-colors dark:bg-[#07091b] dark:text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[190px] overflow-hidden">
        <div className={`absolute inset-y-0 left-0 flex w-[200%] ${reduceMotion ? "" : "hero-wave-track"}`}>
          <WaveShape className="h-full w-1/2" />
          <WaveShape className="h-full w-1/2" />
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob animate-float-slow left-[-140px] top-1/3 h-[380px] w-[380px] bg-blue-400/10 dark:bg-cyan-400/10" />
        <div className="blob animate-float right-[-120px] top-24 h-[340px] w-[340px] bg-violet-400/10 dark:bg-violet-500/15" />
        <div className="blob animate-float-slow bottom-[-60px] left-1/3 h-[300px] w-[300px] bg-indigo-400/[0.07] dark:bg-blue-500/10" style={{ animationDelay: "-6s" }} />
        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(30,64,175,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,64,175,0.4) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <motion.div {...enter(0)} className="max-w-xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700 shadow-sm dark:border-white/15 dark:bg-white/[0.08] dark:text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.85)]" />
              {c("hero", "badge", t("hero.badge"))}
            </span>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-slate-900 dark:text-white sm:text-[44px]">
              Торговые боты для криптобирж
              <span className="block bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-cyan-300 dark:via-blue-300 dark:to-violet-300">и акций</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {c("hero", "subtitle", t("hero.subtitle"))}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#bots" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-[0_18px_40px_-16px_rgba(37,99,235,0.7)] transition-all hover:-translate-y-0.5">
                {c("hero", "primary", t("hero.pick"))}
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a href="https://t.me/coinsofter" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.12]">
                <Send size={16} className="text-blue-600 dark:text-cyan-300" />
                {t("cta.contactBtn")}
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {trust.map((text, index) => {
                const Icon = [ShieldCheck, Zap, Sparkles][index % 3];
                return <span key={text} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Icon size={14} className="text-blue-600 dark:text-cyan-300" />{text}</span>;
              })}
            </div>
          </motion.div>

          <motion.div {...enter(0.18)}>
            <HeroProjectCarousel />
          </motion.div>
        </div>

        <motion.div {...enter(0.26)} className="mt-10">
          <div className="grid gap-3 sm:grid-cols-3">
            {bots.map((bot) => {
              const b = botText(bot, lang);
              const accent = bot.color === "#00FFB2" ? "#00c98d" : bot.color;
              return (
                <Link
                  key={bot.slug}
                  to={`/bots/${bot.slug}`}
                  className="group flex min-w-0 items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3.5 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.05] dark:hover:border-white/25"
                >
                  <BotAvatar bot={bot} size={42} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: bot.color, boxShadow: `0 0 8px ${bot.color}` }} />
                      <span className="truncate text-sm font-bold text-slate-900 dark:text-white">{b.name}</span>
                    </div>
                    <div className="mt-0.5 truncate text-xs">
                      <span style={{ color: accent }}>{b.badge}</span>
                      <span className="text-slate-400 dark:text-gray-500"> · {b.strategy}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
