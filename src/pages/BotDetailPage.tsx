import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, AlertTriangle, Share2, Send, ShieldCheck } from "lucide-react";
import { useBots } from "@/lib/use-bots";
import Header from "@/components/Header";
import FloatingContact from "@/components/FloatingContact";
import BotCard from "@/components/bots/BotCard";
import BotStrategySteps from "@/components/bots/BotStrategySteps";
import BotStats from "@/components/bots/BotStats";
import BotTradeExample from "@/components/bots/BotTradeExample";
import Calculator from "@/components/Calculator";
import FAQ from "@/components/FAQ";
import Compare from "@/components/Compare";
import { useI18n } from "@/lib/i18n";
import { useSeo } from "@/lib/seo";
import { botText, colorDimFrom } from "@/data/bots";

export default function BotDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useI18n();
  const bots = useBots();
  const bot = bots.find((b) => b.slug === slug) ?? null;
  const [copied, setCopied] = useState(false);

  const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useSeo({
    title: bot ? botText(bot, lang).name + " — TradingAutoPilot" : "TradingAutoPilot",
    description: bot ? botText(bot, lang).shortDesc : "TradingAutoPilot trading bots",
    jsonLd: bot
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": botText(bot, lang).name,
          "description": botText(bot, lang).shortDesc,
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
        }
      : undefined,
  });

  const share = async () => {
    const url = window.location.href;
    if (isTouch && navigator.share) {
      try {
        await navigator.share({ title: bot ? botText(bot, lang).name : "TradingAutoPilot", url });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard unavailable
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header />
      <main id="main" className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={16} /> {t("botDetail.back")}
            </Link>
            <button
              onClick={share}
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={copied ? t("botDetail.copied") : t("botDetail.share")}
            >
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              {copied ? t("botDetail.copied") : t("botDetail.share")}
            </button>
          </div>

          <nav className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-blue transition-colors">{t("botDetail.home")}</Link>
            <span>/</span>
            <Link to="/#bots" className="hover:text-brand-blue transition-colors">{t("nav.bots")}</Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-300">{bot ? botText(bot, lang).name : slug}</span>
          </nav>

          {bot ? (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="grid lg:grid-cols-5 gap-8 mb-12">
                <div className="lg:col-span-3 min-w-0">
                  <div className="mb-5">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900"
                      style={{ background: colorDimFrom(bot.color), color: bot.color === "#00FFB2" ? "#00c98d" : bot.color }}
                    >
                      {botText(bot, lang).badge}
                    </span>
                  </div>

                  <h1 className="heading-xl text-gray-900 dark:text-white mb-4 min-w-0 break-words">{botText(bot, lang).name}</h1>
                  <p className="text-xl sm:text-2xl font-semibold mb-6 max-w-2xl" style={{ color: bot.color === "#00FFB2" ? "#00c98d" : bot.color }}>
                    {botText(bot, lang).slogan}
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-3xl mb-8">{botText(bot, lang).shortDesc}</p>

                  <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm mb-8">
                    <h3 className="heading-md text-gray-900 dark:text-white mb-4">{t("botDetail.about")}</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{botText(bot, lang).fullDesc}</p>
                  </div>

                  {botText(bot, lang).howItWorks.length > 0 && (
                    <div className="mb-8">
                      <h3 className="heading-md text-gray-900 dark:text-white mb-6">{t("botDetail.howEarn")}</h3>
                      <BotStrategySteps bot={bot} />
                    </div>
                  )}

                  <BotTradeExample bot={bot} />
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <BotStats bot={bot} />

                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t("botDetail.features")}</h3>
                    <ul className="space-y-2.5">
                      {botText(bot, lang).features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                          <Check size={15} className="shrink-0 mt-0.5" style={{ color: bot.color === "#00FFB2" ? "#00c98d" : bot.color }} />
                          <span className="min-w-0">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex gap-3">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-500" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t("botDetail.risks")}</div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{botText(bot, lang).risk}</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">{t("botDetail.pairs")}</div>
                    <div className="text-gray-900 dark:text-white font-medium">{botText(bot, lang).pairs}</div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex gap-3">
                    <ShieldCheck size={18} className="shrink-0 mt-0.5 text-emerald-500" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t("botDetail.safetyTitle")}</div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t("botDetail.safety")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <a
                  href="https://t.me/coinsofter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-base"
                >
                  <Send size={18} />
                  {t("botDetail.contactCta")}
                </a>
                <Link to="/#bots" className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4 text-base">
                  <ArrowLeft size={16} /> {t("botDetail.back")}
                </Link>
              </div>

              <div className="mb-16">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{t("botDetail.fits")}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {bots
                    .filter((b) => b.slug !== bot.slug)
                    .map((b) => (
                      <BotCard key={b.slug} bot={b} compact />
                    ))}
                </div>
              </div>

              <div className="mb-16 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <Calculator initialSlug={bot.slug} ctaTarget="#main" />
              </div>

              <div className="mb-16">
                <Compare />
              </div>

              <div className="rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <FAQ />
              </div>

              <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{t("botDetail.others")}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {bots
                    .filter((b) => b.slug !== bot.slug)
                    .map((b) => (
                      <Link
                        key={b.slug}
                        to={`/bots/${b.slug}`}
                        className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm card-hover flex items-center gap-4"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0"
                          style={{ background: colorDimFrom(b.color), color: b.color === "#00FFB2" ? "#00c98d" : b.color }}
                        >
                          {botText(b, lang).name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">{botText(b, lang).name}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">{botText(b, lang).badge}</div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-32">
              <p className="text-gray-500 dark:text-gray-400 mb-6">{t("botDetail.notFound")}</p>
              <Link to="/" className="btn-primary">{t("botDetail.backHome")}</Link>
            </div>
          )}
        </div>
      </main>
      <FloatingContact />
    </div>
  );
}
