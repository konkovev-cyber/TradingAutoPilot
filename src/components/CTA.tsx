import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CTA() {
  const { t } = useI18n();
  const c = useContent();

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-12 shadow-[0_20px_60px_-16px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:p-16 dark:border-white/[0.08] dark:bg-gray-950/70 dark:shadow-[0_24px_70px_-20px_rgba(0,0,0,0.6)]"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -left-16 bottom-0 h-48 w-56 rounded-full bg-indigo-400/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-5">
            {c("cta", "title", t("cta.title"))}
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto">{c("cta", "subtitle", t("cta.subtitle"))}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => scrollToId("bots")} className="btn-primary px-8 py-4 text-base">
              {c("cta", "btn1", t("cta.btn1"))}
              <ArrowRight size={18} />
            </button>
            <button onClick={() => scrollToId("faq")} className="btn-secondary px-8 py-4 text-base">
              {c("cta", "btn2", t("cta.btn2"))}
            </button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-8">{c("cta", "trust", t("cta.trust"))}</p>
        </motion.div>
      </div>
    </section>
  );
}
