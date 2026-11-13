import { motion } from "framer-motion";
import { Clock, Brain, Zap, Workflow, ShieldCheck, type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent, useLocalizedList, localize } from "@/lib/site-content";
import { IconTile } from "@/components/ui/IconTile";

const icons: LucideIcon[] = [Clock, Brain, Zap, Workflow, ShieldCheck];

export default function Advantages() {
  const { lang, t } = useI18n();
  const c = useContent();
  const items = useLocalizedList("advantages", "items");

  return (
    <section className="section-padding bg-gray-50 py-12 sm:py-16 md:py-20 transition-colors duration-300 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-12 text-center"
        >
          <h2 className="heading-lg mb-4 text-gray-900 dark:text-white">{c("advantages", "title", t("advantages.title"))}</h2>
        </motion.div>

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-soft transition-all hover:-translate-y-0.5 dark:border-gray-700/60 dark:bg-gray-800"
            >
              <IconTile
                name={(item as any)?.icon}
                fallback={icons[i % icons.length]}
                index={i}
                size={22}
                className="mb-4 h-12 w-12 shadow-[0_10px_24px_-12px_rgba(16,185,129,0.6)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
              />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{localize(item?.title, "", lang)}</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-200">{localize(item?.desc, "", lang)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
