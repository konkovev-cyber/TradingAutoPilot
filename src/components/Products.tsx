import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, TrendingUp, ShieldCheck, Gauge } from "lucide-react";
import { bots } from "@/data/bots";
import { useI18n } from "@/lib/i18n";

const iconMap: Record<string, any> = {
  cryptosuperstock: Gauge,
  "megagrid-ai": TrendingUp,
  smartix: ShieldCheck,
};

export default function Products() {
  const { t } = useI18n();

  return (
    <section id="bots" className="section-padding relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.06]" style={{ background: "var(--primary)" }} />
      <div className="absolute bottom-1/4 right-0 w-[360px] h-[360px] rounded-full blur-[110px] opacity-[0.05]" style={{ background: "var(--accent)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold tracking-widest text-[var(--primary)] mb-6 gradient-border">
            {t("products.title")}
          </span>
          <h2 className="heading-lg text-[var(--text)] mb-4">
            {t("products.title")} <span className="text-gradient">{t("products.subtitle")}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-7">
          {bots.map((bot, i) => {
            const Icon = iconMap[bot.slug] || TrendingUp;
            const isHit = bot.slug === "megagrid-ai";
            return (
              <motion.div
                key={bot.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                whileHover={{ y: -10 }}
                className="group relative glass rounded-3xl p-7 gradient-border flex flex-col"
              >
                {isHit && (
                  <span className="absolute -top-3 right-5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide text-[var(--bg)] badge-glow"
                    style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
                    {t("products.hit")}
                  </span>
                )}

                <div className="absolute -bottom-6 -right-6 opacity-[0.06]">
                  <Icon size={140} style={{ color: "var(--primary)" }} />
                </div>

                <div className="relative flex-1">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl border border-[var(--border)] flex items-center justify-center">
                      <Icon size={22} className="text-[var(--primary)]" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-[var(--text-subtle)]">{bot.badge}</div>
                      <h3 className="text-xl font-display font-bold text-[var(--text)]">{bot.name}</h3>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-[var(--text)] mb-3 leading-snug">{bot.slogan}</p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">{bot.shortDesc}</p>

                  <ul className="space-y-2.5 mb-7">
                    {bot.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                        <Check size={15} className="shrink-0 mt-0.5 text-[var(--primary)]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative grid grid-cols-3 gap-2 mb-6">
                  {bot.returns.map((r) => (
                    <div key={r.period} className="rounded-xl px-2 py-2.5 text-center bg-[var(--surface)] border border-[var(--border)]">
                      <div className="text-[10px] text-[var(--text-subtle)] mb-0.5">{r.period}</div>
                      <div className="text-base font-display font-bold tabular-nums text-[var(--text)]">{r.value}</div>
                    </div>
                  ))}
                </div>

                <Link to={`/bots/${bot.slug}`} className="btn-primary w-full py-3.5 text-sm group/btn shine">
                  {t("products.detail")}
                  <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
