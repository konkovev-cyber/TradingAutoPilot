import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import { useBots } from "@/lib/use-bots";
import { botText } from "@/data/bots";
import { BotAvatar, BotReturns } from "@/components/bots/BotCard";

export default function Products() {
  const { t, lang } = useI18n();
  const c = useContent();
  const bots = useBots();

  return (
    <section id="bots" className="section-padding bg-gray-50 py-16 transition-colors duration-300 dark:bg-gray-900 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="heading-lg mb-4 text-gray-900 dark:text-white">{c("tryIt", "title", t("tryIt.title"))}</h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500 dark:text-gray-400 md:text-lg">
            {c("tryIt", "subtitle", t("tryIt.subtitle"))}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[c("tryIt", "bullet1", t("tryIt.bullet1")), c("tryIt", "bullet2", t("tryIt.bullet2"))].map((text, index) => (
              <span key={index} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                <Check size={16} className="text-emerald-500" />
                {text}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {bots.map((bot, index) => {
            const b = botText(bot, lang);
            const accent = bot.color === "#00FFB2" ? "#00c98d" : bot.color;
            return (
              <motion.div
                key={bot.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 p-6 shadow-soft-lg backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-[#0d1130]/80 dark:shadow-[0_28px_80px_-32px_rgba(99,102,241,0.55)] sm:p-7"
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${bot.color}, transparent)` }} />
                <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl" style={{ background: bot.colorDim }} />

                <div className="relative mb-5 flex items-center gap-4">
                  <BotAvatar bot={bot} size={52} />
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-gray-900 dark:text-white sm:text-xl">{b.name}</h3>
                    <div className="mt-0.5 truncate text-xs font-semibold" style={{ color: accent }}>{b.badge}</div>
                  </div>
                </div>

                <p className="relative mb-3 text-sm font-medium leading-snug text-gray-800 dark:text-gray-200">{b.slogan}</p>
                <p className="relative mb-5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{b.shortDesc}</p>

                <div className="relative mb-6">
                  <BotReturns bot={bot} />
                </div>

                <Link
                  to={`/bots/${bot.slug}`}
                  className="relative mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500/60"
                  style={{ background: accent, boxShadow: `0 14px 34px -14px ${bot.colorDim.replace("0.12", "0.7")}` }}
                >
                  {t("products.detail")}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://t.me/coinsofter"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base"
          >
            {t("cta.contactBtn")}
            <ArrowRight size={18} />
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">{c("products", "disclaimer", t("products.disclaimer"))}</p>
      </div>
    </section>
  );
}
