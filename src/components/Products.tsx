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
    <section id="bots" className="py-24 md:py-32 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-brand-blue dark:text-blue-400 text-xs font-semibold tracking-wide mb-4 border border-blue-100 dark:border-blue-800">
            {t("products.title")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            {t("products.title")} <span className="text-brand-blue">{t("products.subtitle")}</span>
          </h2>
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
                className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-soft card-premium flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    {bot.imageUrl ? (<img src={bot.imageUrl} alt={bot.name} className="w-full h-full object-cover" />) : (<Icon size={24} />)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold">
                      {bot.badge}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{bot.name}</h3>
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{bot.slogan}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{bot.shortDesc}</p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {bot.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <Check size={16} className="shrink-0 mt-0.5 text-brand-blue" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {bot.returns.map((r, ri) => (
                    <div key={ri} className="rounded-lg px-2 py-3 text-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">{r.period}</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{r.value}</div>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/bots/${bot.slug}`}
                  className="w-full py-3.5 px-6 bg-brand-blue text-white text-center font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group/btn"
                >
                  {t("products.detail")}
                  <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
