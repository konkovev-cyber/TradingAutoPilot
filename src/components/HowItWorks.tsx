import { motion } from "framer-motion";
import { UserPlus, KeyRound, Bot, TrendingUp, type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const iconMap: Record<string, LucideIcon> = {
  "01": UserPlus,
  "02": KeyRound,
  "03": Bot,
  "04": TrendingUp,
};

export default function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how" className="section-padding bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">{t("how.title")}</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t("how.subtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {t("how.steps").map((s: { n: string; title: string; desc: string }, i: number) => {
            const Icon = iconMap[s.n] || Bot;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-white dark:bg-gray-950 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm card-premium overflow-hidden"
              >
                <div className="absolute top-6 right-6 w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-extrabold shadow-md" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" }}>
                  {s.n}
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.12) 100%)" }}>
                  <Icon size={22} className="text-brand-blue" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
