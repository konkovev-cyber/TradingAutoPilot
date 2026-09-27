import { motion } from "framer-motion";
import { UserPlus, KeyRound, Bot, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const iconMap: Record<string, any> = {
  "01": UserPlus,
  "02": KeyRound,
  "03": Bot,
  "04": TrendingUp,
};

export default function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how" className="section-padding bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">{t("how.title")}</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t("how.subtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {t("how.steps").map((s: any, i: number) => {
            const Icon = iconMap[s.n] || Bot;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm card-hover"
              >
                <div className="text-5xl font-bold text-gray-200 mb-6">{s.n}</div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-brand-blue" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
