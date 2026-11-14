import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSectionValue, useContent } from "@/lib/site-content";

export default function FAQ() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);
  const siteFaq = useSectionValue("faq");
  const c = useContent();

  const rawList = Array.isArray(siteFaq) && siteFaq.length > 0 ? siteFaq : ((t("faq.items") as any[]) || []);
  const items: Array<{ q: string; a: string }> = rawList
    .map((item: any) => ({
      q: item?.q || item?.question || "",
      a: item?.a || item?.answer || "",
    }))
    .filter((x) => x.q || x.a);

  return (
    <section id="faq" className="section-padding relative overflow-hidden bg-white py-12 dark:bg-gray-950 transition-colors duration-300 sm:py-16 md:py-20">
      <div className="pointer-events-none absolute -right-40 top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-40 bottom-16 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" aria-hidden="true" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="heading-lg text-gray-900 dark:text-white mb-3 sm:mb-4">{c("faq", "title", t("faq.title"))}</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400">{c("faq", "subtitle", t("faq.subtitle"))}</p>
        </motion.div>

        <div className="space-y-3">
          {items.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`rounded-xl border shadow-[0_10px_30px_-14px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-200 overflow-hidden dark:shadow-[0_14px_36px_-14px_rgba(0,0,0,0.5)] ${
                open === i
                  ? "border-emerald-300/50 bg-white/80 dark:border-emerald-500/25 dark:bg-gray-900/90"
                  : "border-white/60 bg-white/70 dark:border-white/[0.08] dark:bg-gray-900/70"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
                className="w-full flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-gray-400 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
                id={`faq-panel-${i}`}
                role="region"
              >
                <p className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
