import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";

export default function PricingNote() {
  const { t } = useI18n();
  const c = useContent();

  return (
    <section id="pricing" className="section-padding bg-gray-50 py-12 transition-colors duration-300 dark:bg-gray-900 sm:py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-5 shadow-[0_20px_60px_-16px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:p-8 md:p-12 dark:border-white/[0.08] dark:bg-gray-950/70 dark:shadow-[0_24px_70px_-20px_rgba(0,0,0,0.6)]"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl mb-4 sm:mb-6">
            {c("pricing", "title", t("pricing.title"))}
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base md:text-lg">
            {c("pricing", "text1", t("pricing.text1"))}
          </p>
          <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base md:text-lg">
            {c("pricing", "text2", t("pricing.text2"))}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
