import { motion } from "framer-motion";
import { Clock, Brain, Zap, Workflow, ShieldCheck, type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent, useLocalizedList, localize } from "@/lib/site-content";

const icons: LucideIcon[] = [Clock, Brain, Zap, Workflow, ShieldCheck];

export default function Advantages() {
  const { lang, t } = useI18n();
  const c = useContent();
  const items = useLocalizedList("advantages", "items");

  return (
    <section className="section-padding bg-gray-50 py-16 transition-colors duration-300 dark:bg-gray-900 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="heading-lg mb-4 text-gray-900 dark:text-white">{c("advantages", "title", t("advantages.title"))}</h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft dark:border-gray-800 dark:bg-gray-900"
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.16), rgba(59,130,246,0.10))" }}
                >
                  <Icon size={20} className="text-emerald-500" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{localize(item?.title, "", lang)}</h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{localize(item?.desc, "", lang)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
