import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function FAQ() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding relative overflow-hidden">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <h2 className="heading-lg text-[var(--text)] mb-4">{t("faq.title")}</h2>
          <p className="text-[var(--text-muted)] text-lg">{t("faq.subtitle")}</p>
        </motion.div>

        <div className="space-y-3">
          {t("faq.items").map((faq: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[var(--surface-hover)] transition-colors"
              >
                <span className="font-medium text-[var(--text)] text-sm sm:text-base">{faq.q}</span>
                <ChevronDown size={18} className={`shrink-0 text-[var(--primary)] transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-[var(--text-muted)] leading-relaxed">{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
