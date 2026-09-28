import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, AlertTriangle, Share2 } from "lucide-react";
import { useBots } from "@/lib/use-bots";
import Header from "@/components/Header";
import FloatingContact from "@/components/FloatingContact";
import { useI18n } from "@/lib/i18n";
import { useSeo } from "@/lib/seo";

export default function BotDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useI18n();
  const bots = useBots();
  const bot = bots.find((b) => b.slug === slug) ?? null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useSeo({
    title: bot ? bot.name + " \u2014 Trading Auto Pilot" : "Trading Auto Pilot",
    description: bot ? bot.shortDesc : "Trading Auto Pilot trading bots",
    jsonLd: bot
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": bot.name,
          "description": bot.shortDesc,
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
        }
      : undefined,
  });

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: bot ? bot.name : "Trading Auto Pilot", url });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
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
              aria-label="Share"
            >
              <Share2 size={16} /> Share
            </button>
          </div>

          <nav className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-blue transition-colors">{t("botDetail.home")}</Link>
            <span>/</span>
            <Link to="/#bots" className="hover:text-brand-blue transition-colors">{t("nav.bots")}</Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-300">{bot ? bot.name : slug}</span>
          </nav>

          {bot ? (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-5 bg-blue-50 dark:bg-blue-950 text-brand-blue border border-blue-100 dark:border-blue-900">
                {bot.badge}
              </span>

              <h1 className="heading-xl text-gray-900 dark:text-white mb-4">{bot.name}</h1>
              <p className="text-xl sm:text-2xl font-semibold mb-6 max-w-2xl text-brand-blue">{bot.slogan}</p>

              <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-3xl mb-10">{bot.shortDesc}</p>

              <div className="grid lg:grid-cols-5 gap-8 mb-12">
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="heading-md text-gray-900 dark:text-white mb-4">{t("botDetail.about")}</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{bot.fullDesc}</p>
                  </div>
                  {bot.howItWorks.length > 0 && (

                  <div>
                    <h3 className="heading-md text-gray-900 dark:text-white mb-6">{t("botDetail.howEarn")}</h3>
                    <div className="space-y-4">
                      {bot.howItWorks.map((s, i) => (
                        <div
                          key={i}
                          className="flex gap-4 bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm card-hover"
                        >
                          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center font-bold shrink-0 text-brand-blue">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{s.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t("botDetail.income")}</h3>
                    <div className="space-y-3">
                      {bot.returns.map((r, ri) => (
                        <div
                          key={ri}
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <span className="text-sm text-gray-500 dark:text-gray-400">{r.period}</span>
                          <span className="text-lg font-bold tabular-nums text-brand-blue">{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t("botDetail.features")}</h3>
                    <ul className="space-y-2.5">
                      {bot.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                          <Check size={15} className="shrink-0 mt-0.5 text-brand-blue" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex gap-3">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-500" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t("botDetail.risks")}</div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{bot.risk}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mb-10">
                <div className="text-xs text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">{t("botDetail.pairs")}</div>
                <div className="text-gray-900 dark:text-white font-medium">{bot.pairs}</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary px-8 py-4 text-base">{t("botDetail.launch")} {bot.name}</button>
                <Link to="/" className="btn-secondary px-8 py-4 text-base">
                  <ArrowLeft size={16} /> {t("botDetail.back")}
                </Link>
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
                        <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center font-bold text-lg shrink-0 text-gray-600 dark:text-gray-300">
                          {b.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">{b.name}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">{b.badge}</div>
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