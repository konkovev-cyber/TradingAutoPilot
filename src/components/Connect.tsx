import { motion } from "framer-motion";
import { Bot, Cable, SlidersHorizontal, Play, ShieldCheck, LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent, useLocalizedList, localize } from "@/lib/site-content";

const STEP_ICONS: Record<string, LucideIcon> = {
  bot: Bot,
  plug: Cable,
  settings: SlidersHorizontal,
  play: Play,
};
const DEFAULT_ICONS: LucideIcon[] = [Bot, Cable, SlidersHorizontal, Play];

export default function Connect() {
  const { lang, t } = useI18n();
  const c = useContent();
  const steps = useLocalizedList("connect", "steps");

  return (
    <section id="how" className="section-padding bg-gray-50 py-12 transition-colors duration-300 dark:bg-gray-900 sm:py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h2 className="heading-lg mb-3 sm:mb-4 text-gray-900 dark:text-white">{c("connect", "title", t("how.title"))}</h2>
          <p className="mx-auto max-w-2xl text-sm font-normal text-gray-500 dark:text-gray-400 sm:text-base md:text-lg">
            {c("connect", "subtitle", t("how.subtitle"))}
          </p>
        </motion.div>

        <ol className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
          {steps.map((step, i) => {
            const iconKey = String((step as any)?.icon ?? "");
            const Icon = STEP_ICONS[iconKey] ?? DEFAULT_ICONS[i] ?? Bot;
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-3.5 sm:gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-soft dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand-blue dark:bg-blue-950">
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <div className="mb-0.5 flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-blue dark:text-cyan-400">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{localize(step?.title, "", lang)}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{localize(step?.desc, "", lang)}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-emerald-200/50 bg-emerald-50/60 px-5 py-4 dark:border-emerald-500/25 dark:bg-emerald-900/15"
        >
          <ShieldCheck size={18} className="shrink-0 text-emerald-500" />
          <p className="text-sm text-gray-700 dark:text-gray-300">{c("connect", "note", t("how.apiNote"))}</p>
        </motion.div>
      </div>
    </section>
  );
}
