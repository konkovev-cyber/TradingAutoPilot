import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, ShieldCheck, Lock, Repeat, Activity } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const exchanges = ["BYBIT", "Binance", "OKX", "BingX", "Gate.io", "HTX", "Bitget", "KuCoin", "MEXC", "Kraken"];

const trust = [
  { icon: Lock, label: "hero.trust.0" },
  { icon: ShieldCheck, label: "hero.trust.1" },
  { icon: Repeat, label: "hero.trust.2" },
  { icon: Activity, label: "hero.trust.3" },
];

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-10 overflow-hidden">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full blur-[140px] opacity-[0.08]"
          style={{
            width: i === 0 ? 700 : 450,
            height: i === 0 ? 500 : 450,
            top: i === 0 ? "0%" : i === 1 ? "30%" : "auto",
            left: i === 1 ? "-10%" : "auto",
            right: i === 2 ? "-10%" : "auto",
            bottom: i === 2 ? "5%" : "auto",
            background: i === 0 ? "var(--primary)" : i === 1 ? "var(--accent)" : "var(--secondary)",
          }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-7"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse-glow" />
              <span className="text-xs font-medium text-[var(--text-muted)]">{t("hero.badge")}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-xl text-[var(--text)] mb-6"
            >
              {t("hero.title")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg text-[var(--text-muted)] mb-10 max-w-lg leading-relaxed"
            >
              {t("hero.desc")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <a href="#bots" className="btn-primary px-8 py-4 text-base group shine">
                {t("hero.cta1")}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#how" className="btn-secondary px-8 py-4 text-base">
                {t("hero.cta2")}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {t("hero.trust").map((c: string) => (
                <span key={c} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-[var(--text-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                  {c}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10"
            >
              {trust.map((tr) => (
                <div key={tr.label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass">
                  <tr.icon size={15} className="text-[var(--primary)] shrink-0" />
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">{t(tr.label)}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: terminal card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[2rem] blur-2xl opacity-20" style={{ background: "var(--primary)" }} />

            <div className="relative glass-strong rounded-3xl p-6 animate-float">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-subtle)] opacity-60" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-subtle)] opacity-40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary-dim)] text-[var(--primary)] font-semibold tracking-wide">LIVE</span>
              </div>

              <div className="text-xs text-[var(--text-muted)] mb-1">{t("hero.profit")}</div>
              <div className="text-3xl font-display font-bold text-[var(--text)] tabular-nums mb-1">+$1,247.83</div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--primary)] mb-5">
                <TrendingUp size={14} /> {t("hero.pnlLabel")}
              </div>

              <div className="flex items-end gap-1.5 h-24 mb-5">
                {[35, 55, 40, 70, 48, 66, 52, 80, 58, 74, 60, 88, 70, 88, 72, 95].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.6 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                    className="flex-1 rounded-t"
                    style={{
                      background: i > 10 ? "var(--primary)" : "var(--text-subtle)",
                      opacity: i > 10 ? 0.9 : 0.3,
                      minHeight: 6,
                    }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--border)]">
                {t("hero.stats").map((s: string) => (
                  <div key={s}>
                    <div className="text-[10px] text-[var(--text-subtle)]">{s.split(" ")[0]}</div>
                    <div className="text-sm font-semibold text-[var(--text)]">{s.split(" ")[1] || s}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Exchange ticker */}
      <div className="relative mt-14">
        <div className="marquee opacity-70">
          <div className="marquee-track">
            {[...exchanges, ...exchanges].map((ex, i) => (
              <span key={i} className="text-sm uppercase tracking-widest text-[var(--text-subtle)]">{ex}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
