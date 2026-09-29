import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";

export default function PricingNote() {
  const { t } = useI18n();
  const c = useContent();

  return (
    <section id="pricing" className="section-padding bg-gray-50 py-16 transition-colors duration-300 dark:bg-gray-900 md:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-8 shadow-[0_20px_60px_-16px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:p-12 dark:border-white/[0.08] dark:bg-gray-950/70 dark:shadow-[0_24px_70px_-20px_rgba(0,0,0,0.6)]"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl mb-6">
            {c("pricing", "title", t("pricing.title"))}
          </h2>
          <p className="mb-4 text-base leading-relaxed text-gray-500 dark:text-gray-400 md:text-lg">
            {c("pricing", "text1", t("pricing.text1"))}
          </p>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 md:text-lg">
            {c("pricing", "text2", t("pricing.text2"))}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
