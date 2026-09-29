import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useBots } from "@/lib/use-bots";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import { botText } from "@/data/bots";
import { BotAvatar, BotBadges } from "@/components/bots/BotCard";

export default function Products() {
  const { t, lang } = useI18n();
  const bots = useBots();
  const c = useContent();

  return (
    <section id="bots" className="robots relative block w-full bg-white py-16 transition-colors duration-300 dark:bg-gray-950 md:py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="heading-lg text-gray-900 dark:text-white mb-4">
            {c("products", "title", t("products.title"))}
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-normal">
            {c("products", "subtitle", t("products.subtitle"))}
          </p>
        </motion.div>

        <div className="space-y-10 md:space-y-14">
          {bots.map((bot, i) => {
            const b = botText(bot, lang);
            const accent = bot.color === "#00FFB2" ? "#00c98d" : bot.color;
            return (
              <motion.article
                key={bot.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft dark:border-gray-800 dark:bg-gray-900"
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${bot.color}, transparent)` }} />
                <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl" style={{ background: bot.colorDim }} />
                <div
                  className={`grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className="min-w-0">
                    <div className="mb-5 flex items-center gap-4">
                      <BotAvatar bot={bot} size={64} />
                      <div className="min-w-0">
                        <h3 className="truncate text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{b.name}</h3>
                        <div className="mt-1.5">
                          <BotBadges bot={bot} />
                        </div>
                      </div>
                    </div>

                    <p className="mb-3 text-lg font-semibold leading-snug" style={{ color: accent }}>
                      {b.slogan}
                    </p>
                    <p className="mb-8 text-sm leading-relaxed text-gray-500 dark:text-gray-400 md:text-base">
                      {b.shortDesc}
                    </p>

                    <Link
                      to={`/bots/${bot.slug}`}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-8 font-semibold text-white transition-all hover:-translate-y-0.5"
                      style={{ background: accent, boxShadow: `0 14px 34px -14px ${bot.colorDim.replace("0.12", "0.8")}` }}
                    >
                      {t("products.detail")}
                      <ArrowRight size={18} />
                    </Link>
                  </div>

                  <div className="relative rounded-2xl border p-6 sm:p-8" style={{ background: bot.colorDim, borderColor: bot.colorDim.replace("0.12", "0.28") }}>
                    <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: bot.color, boxShadow: `0 0 8px ${bot.color}` }} />
                      {b.strategy}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {b.returns.map((r, ri) => (
                        <div key={ri} className="rounded-xl bg-white/80 px-2 py-3 text-center dark:bg-white/10">
                          <div className="text-lg font-bold leading-tight tabular-nums" style={{ color: accent }}>
                            {r.value}
                            <span className="opacity-60">*</span>
                          </div>
                          <div className="mt-1 text-[10px] leading-tight text-gray-500 dark:text-gray-400">{r.period}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: bot.colorDim.replace("0.12", "0.28") }}>
                      <span className="min-w-0 text-xs text-gray-500 dark:text-gray-400">{b.pairs}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-12 max-w-3xl mx-auto text-center text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
          {c("products", "disclaimer", t("products.disclaimer"))}
        </p>
      </div>
    </section>
  );
}
