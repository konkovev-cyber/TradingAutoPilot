import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Mail, Phone, Send, AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent, useContacts } from "@/lib/site-content";
import { useBots } from "@/lib/use-bots";
import { botText } from "@/data/bots";
import { BotAvatar } from "@/components/bots/BotCard";

export default function Products() {
  const { t, lang } = useI18n();
  const c = useContent();
  const contacts = useContacts();
  const bots = useBots();

  return (
    <section id="bots" className="section-padding bg-gray-50 py-12 sm:py-16 md:py-20 transition-colors duration-300 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-12 text-center"
        >
          <h2 className="heading-lg mb-3 sm:mb-4 text-gray-900 dark:text-white">{c("tryIt", "title", t("tryIt.title"))}</h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-gray-500 dark:text-gray-400 md:text-lg">
            {c("tryIt", "subtitle", t("tryIt.subtitle"))}
          </p>
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {[c("tryIt", "bullet1", t("tryIt.bullet1")), c("tryIt", "bullet2", t("tryIt.bullet2"))].map((text, index) => (
              <span key={index} className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <Check size={16} className="text-emerald-500 shrink-0" />
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
                className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/70 bg-white/75 p-5 shadow-soft-lg backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-[#0d1130]/80 dark:shadow-[0_28px_80px_-32px_rgba(99,102,241,0.55)] sm:p-7"
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${bot.color}, transparent)` }} />
                <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl" style={{ background: bot.colorDim }} />

                <div className="relative mb-5 flex items-center gap-4">
                  <BotAvatar bot={bot} size={52} />
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-gray-900 dark:text-white sm:text-xl">{b.name}</h3>
                    {b.badge ? (
                      <div className="mt-0.5 truncate text-xs font-semibold" style={{ color: accent }}>{b.badge}</div>
                    ) : null}
                    {bot.inDevelopment && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-amber-400/80 bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-amber-600 dark:border-amber-400/60 dark:bg-amber-400/10 dark:text-amber-300">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" aria-hidden="true" />
                        {c("products", "inDevelopment", t("products.inDevelopment"))}
                      </div>
                    )}
                  </div>
                </div>

                <p className="relative mb-3 text-sm font-medium leading-snug text-gray-800 dark:text-gray-200">{b.slogan}</p>

                {bot.slug === "synchrobot" && (
                  <div className="relative mb-5 space-y-3">
                    <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{b.fullDesc}</p>
                    {b.suitableFor && (
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        <span className="font-semibold text-gray-800 dark:text-white">Подойдёт тем, кто: </span>
                        {b.suitableFor}
                      </p>
                    )}
                    {b.exchanges && (
                      <div>
                        <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                          Доступные биржи
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {b.exchanges.split(",").map((x) => (
                            <span
                              key={x}
                              className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                            >
                              {x.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Link
                  to={`/bots/${bot.slug}`}
                  className="relative mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500/60"
                  style={{ background: accent, boxShadow: `0 14px 34px -14px ${bot.colorDim.replace("0.12", "0.7")}` }}
                >
                  {c("products", "detail", t("products.detail"))}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 sm:mt-12 flex flex-col items-stretch sm:items-center justify-center gap-3 sm:gap-4 sm:flex-row">
          <a
            href={contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
          >
            <Send size={18} />
            {c("cta", "contactBtn", t("cta.contactBtn"))}
            <ArrowRight size={18} />
          </a>
          <a
            href={contacts.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
          >
            <Phone size={18} className="text-green-600" />
            WhatsApp
          </a>
          <a
            href={contacts.email}
            className="btn-secondary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
          >
            <Mail size={18} className="text-violet-600" />
            Email
          </a>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 px-5 py-4 text-left shadow-soft dark:border-amber-400/25 dark:bg-amber-950/30 sm:px-6 sm:py-5">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500 dark:text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200/90 sm:text-sm">
            {c("products", "disclaimer", t("products.disclaimer"))}
          </p>
        </div>
      </div>
    </section>
  );
}
