import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";

export default function CTA() {
  const { t } = useI18n();
  const c = useContent();

  return (
    <section id="questions" className="section-padding bg-gray-50 py-16 transition-colors duration-300 dark:bg-gray-900 md:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-10 shadow-[0_20px_60px_-16px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:p-14 dark:border-white/[0.08] dark:bg-gray-950/70 dark:shadow-[0_24px_70px_-20px_rgba(0,0,0,0.6)]"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -left-16 bottom-0 h-48 w-56 rounded-full bg-indigo-400/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-5">
            {c("questions", "title", t("questions.title"))}
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto">
            {c("questions", "subtitle", t("questions.subtitle"))}
          </p>
          <a
            href="https://t.me/coinsofter"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base"
          >
            <Send size={18} />
            {c("questions", "btn", t("questions.btn"))}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
