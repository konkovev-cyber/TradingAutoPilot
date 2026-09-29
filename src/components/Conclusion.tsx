import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";

export default function Conclusion() {
  const { t } = useI18n();
  const c = useContent();

  return (
    <section className="section-padding bg-white py-16 transition-colors duration-300 dark:bg-gray-950 md:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="heading-lg mb-6 text-gray-900 dark:text-white">{c("conclusion", "title", t("conclusion.title"))}</h2>
          <p className="mb-4 text-base font-normal leading-relaxed text-gray-500 dark:text-gray-400 md:text-lg">
            {c("conclusion", "text1", t("conclusion.text1"))}
          </p>
          <p className="text-base font-normal leading-relaxed text-gray-500 dark:text-gray-400 md:text-lg">
            {c("conclusion", "text2", t("conclusion.text2"))}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
