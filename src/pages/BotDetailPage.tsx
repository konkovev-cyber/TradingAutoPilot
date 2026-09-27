import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { getBot, bots } from '@/data/bots';
import Header from '@/components/Header';
import FloatingContact from '@/components/FloatingContact';
import { useI18n } from '@/lib/i18n';

export default function BotDetailPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const { t } = useI18n();
  const slug = window.location.pathname.split("/").pop() || "";
  const bot = getBot(slug);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8">
            <ArrowLeft size={16} /> {t("botDetail.back")}
          </Link>

          {bot ? (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-5 bg-blue-50 text-brand-blue border border-blue-100">
                {bot.badge}
              </span>

              <h1 className="heading-xl text-gray-900 mb-4">{bot.name}</h1>
              <p className="text-xl sm:text-2xl font-semibold mb-6 max-w-2xl text-brand-blue">
                {bot.slogan}
              </p>

              <p className="text-gray-500 text-lg leading-relaxed max-w-3xl mb-10">{bot.shortDesc}</p>

              <div className="grid lg:grid-cols-5 gap-8 mb-12">
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                    <h3 className="heading-md text-gray-900 mb-4">{t("botDetail.about")}</h3>
                    <p className="text-gray-500 leading-relaxed">{bot.fullDesc}</p>
                  </div>

                  <div>
                    <h3 className="heading-md text-gray-900 mb-6">{t("botDetail.howEarn")}</h3>
                    <div className="space-y-4">
                      {bot.howItWorks.map((s, i) => (
                        <div key={i} className="flex gap-4 bg-white rounded-xl p-6 border border-gray-100 shadow-sm card-hover">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center font-bold shrink-0 text-brand-blue">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{s.title}</h4>
                            <p className="text-sm text-gray-500">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">{t("botDetail.income")}</h3>
                    <div className="space-y-3">
                      {bot.returns.map((r) => (
                        <div key={r.period} className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50">
                          <span className="text-sm text-gray-500">{r.period}</span>
                          <span className="text-lg font-bold tabular-nums text-brand-blue">{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">{t("botDetail.features")}</h3>
                    <ul className="space-y-2.5">
                      {bot.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-gray-500">
                          <Check size={15} className="shrink-0 mt-0.5 text-brand-blue" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex gap-3">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-500" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-1">{t("botDetail.risks")}</div>
                      <p className="text-xs text-gray-500 leading-relaxed">{bot.risk}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-10">
                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">{t("botDetail.pairs")}</div>
                <div className="text-gray-900 font-medium">{bot.pairs}</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary px-8 py-4 text-base">
                  {t("botDetail.launch")} {bot.name}
                </button>
                <Link to="/" className="btn-secondary px-8 py-4 text-base">
                  <ArrowLeft size={16} /> {t("botDetail.back")}
                </Link>
              </div>

              <div className="mt-16 pt-10 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">{t("botDetail.others")}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {bots.filter((b) => b.slug !== bot.slug).map((b) => (
                    <Link key={b.slug} to={`/bots/${b.slug}`} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm card-hover flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center font-bold text-lg shrink-0 text-gray-600">
                        {b.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{b.name}</div>
                        <div className="text-xs text-gray-400">{b.badge}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-32">
              <p className="text-gray-500 mb-6">{t("botDetail.notFound")}</p>
              <Link to="/" className="btn-primary">{t("botDetail.backHome")}</Link>
            </div>
          )}
        </div>
      </main>
      <FloatingContact />
    </div>
  );
}
