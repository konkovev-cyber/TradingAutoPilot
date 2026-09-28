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
    <section id="how" className="section-padding relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="pointer-events-none absolute -left-40 top-16 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="heading-lg text-gray-900 dark:text-white mb-4">{t("how.title")}</h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-500 font-normal max-w-2xl mx-auto">{t("how.subtitle")}</p>
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
                className="relative rounded-2xl border border-white/60 bg-white/70 p-8 shadow-[0_16px_44px_-16px_rgba(15,23,42,0.14)] backdrop-blur-xl card-premium overflow-hidden dark:border-white/[0.08] dark:bg-gray-950/70 dark:shadow-[0_20px_50px_-18px_rgba(0,0,0,0.6)]"
              >
                <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />
                <div className="absolute top-6 right-6 w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-extrabold shadow-md" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" }}>
                  {s.n}
                </div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 text-emerald-500" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(59,130,246,0.1) 100%)" }}>
                  <Icon size={22} />
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

