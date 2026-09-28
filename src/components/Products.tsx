import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, TrendingUp, ShieldCheck, Gauge, type LucideIcon } from "lucide-react";
import { useBots } from "@/lib/use-bots";
import { useI18n } from "@/lib/i18n";

const iconMap: Record<string, LucideIcon> = {
  cryptosuperstock: Gauge,
  "megagrid-ai": TrendingUp,
  smartix: ShieldCheck,
};

export default function Products() {
  const { t } = useI18n();
  const bots = useBots();

  return (
    <section id="bots" className="robots relative block w-full bg-white py-16 transition-colors duration-300 dark:bg-gray-950 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="heading-lg text-gray-900 dark:text-white mb-4">
            {t("products.title")}
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-500 max-w-2xl mx-auto font-normal">
            {t("products.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {bots.map((bot, i) => {
            const Icon = iconMap[bot.slug] || TrendingUp;
            return (
              <motion.div
                key={bot.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-soft card-premium flex flex-col"
              >
                {/* Бейдж над названием  единый формат */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-block text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md" style={{ background: bot.colorDim, color: bot.color === "#00FFB2" ? "#00c98d" : bot.color }}>
                    {bot.badge}
                  </span>
                  {bot.difficulty && (
                    <span
                      className="inline-block text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md border"
                      style={
                        bot.difficultyTone === "starter"
                          ? { background: "rgba(16,185,129,0.10)", borderColor: "rgba(16,185,129,0.32)", color: "#059669" }
                          : bot.difficultyTone === "advanced"
                            ? { background: "rgba(245,158,11,0.10)", borderColor: "rgba(245,158,11,0.32)", color: "#B45309" }
                            : { background: "rgba(244,63,94,0.10)", borderColor: "rgba(244,63,94,0.32)", color: "#E11D48" }
                      }
                    >
                      {bot.difficulty}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors shrink-0">
                    {bot.imageUrl ? (<img src={bot.imageUrl} alt={bot.name} className="w-full h-full object-cover" />) : (<Icon size={24} />)}
                  </div>
                  <h3 className="text-xl md:text-[22px] font-bold text-gray-900 dark:text-white truncate leading-tight">{bot.name}</h3>
                </div>

                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{bot.slogan}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{bot.shortDesc}</p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {bot.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      <Check size={16} className="shrink-0 mt-0.5 text-brand-blue" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Плашки доходности  отдельный горизонтальный ряд перед кнопкой */}
                <div className="grid grid-cols-3 gap-2.5 mb-6">
                  {bot.returns.map((r, ri) => (
                    <div key={ri} className="rounded-lg px-2 py-2.5 text-center border" style={{ background: "rgba(0,255,150,0.08)", borderColor: "rgba(0,255,150,0.18)" }}>
                      <div className="text-[13px] font-bold text-emerald-500 tabular-nums leading-tight">{r.value}<span className="text-emerald-500/60">*</span></div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">{r.period}</div>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/bots/${bot.slug}`}
                  className="w-full h-11 px-6 bg-brand-blue text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group/btn mt-auto"
                >
                  {t("products.detail")}
                  <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-10 max-w-3xl mx-auto text-center text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
          * Историческая доходность не гарантирует будущих результатов. Торговля на бирже связана с риском, возможна просадка депозита. Показатели приведены за прошлые периоды и не являются обещанием дохода.
        </p>
      </div>
    </section>
  );
}

