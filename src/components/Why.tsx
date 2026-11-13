import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";

export default function Why() {
  const { t } = useI18n();
  const c = useContent();

  return (
    <section id="why" className="section-padding bg-white py-12 transition-colors duration-300 dark:bg-gray-900 sm:py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="heading-lg mb-6 text-gray-900 dark:text-white">{c("why", "purposeTitle", t("why.purposeTitle"))}</h2>
          <p className="text-base font-normal leading-relaxed text-gray-600 dark:text-gray-200 md:text-lg">
            {c("why", "purposeText", t("why.purposeText"))}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
