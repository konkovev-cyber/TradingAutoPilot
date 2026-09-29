import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent, useLocalizedList, localize } from "@/lib/site-content";

export default function Connect() {
  const { lang, t } = useI18n();
  const c = useContent();
  const steps = useLocalizedList("connect", "steps");

  return (
    <section id="how" className="section-padding bg-gray-50 py-16 transition-colors duration-300 dark:bg-gray-900 md:py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="heading-lg mb-4 text-gray-900 dark:text-white">{c("connect", "title", t("how.title"))}</h2>
          <p className="mx-auto max-w-2xl text-base font-normal text-gray-500 dark:text-gray-400 md:text-lg">
            {c("connect", "subtitle", t("how.subtitle"))}
          </p>
        </motion.div>

        <ol className="grid gap-4 sm:grid-cols-2">
          {steps.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-brand-blue dark:bg-blue-950">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="min-w-0">
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{localize(step?.title, "", lang)}</h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{localize(step?.desc, "", lang)}</p>
              </div>
            </motion.li>
          ))}
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
