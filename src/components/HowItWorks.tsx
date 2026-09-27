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
    <section id="how" className="section-padding relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <h2 className="heading-lg text-[var(--text)] mb-4">{t("how.title")}</h2>
          <p className="text-[var(--text-muted)] text-lg">{t("how.subtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t("how.steps").map((s: any, i: number) => {
            const Icon = iconMap[s.n] || Bot;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative glass rounded-2xl p-6 card-hover"
              >
                <div className="text-4xl font-display font-bold text-[var(--primary)] opacity-20 mb-4">{s.n}</div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-dim)] flex items-center justify-center">
                    <Icon size={20} className="text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-[var(--text)]">{s.title}</h3>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
