import { motion } from "framer-motion";
import { ArrowRight, Check, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import BotCarousel from "@/components/bots/BotCarousel";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function TryIt() {
  const { t } = useI18n();
  const c = useContent();

  return (
    <section className="section-padding bg-gray-50 py-16 transition-colors duration-300 dark:bg-gray-900 md:py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="heading-lg mb-4 text-gray-900 dark:text-white">{c("tryIt", "title", t("tryIt.title"))}</h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500 dark:text-gray-400 md:text-lg">
            {c("tryIt", "subtitle", t("tryIt.subtitle"))}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[c("tryIt", "bullet1", t("tryIt.bullet1")), c("tryIt", "bullet2", t("tryIt.bullet2"))].map((text) => (
              <span key={text} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                <Check size={16} className="text-emerald-500" />
                {text}
              </span>
            ))}
          </div>
        </motion.div>

        <BotCarousel />

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://t.me/coinsofter"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base"
          >
            <Send size={18} />
            {c("cta", "contactBtn", t("cta.contactBtn"))}
          </a>
          <button onClick={() => scrollToId("bots")} className="btn-secondary inline-flex items-center gap-2 px-8 py-4 text-base">
            {c("tryIt", "btn", t("tryIt.btn"))}
            <ArrowRight size={18} />
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">{c("cta", "trust", t("cta.trust"))}</p>
      </div>
    </section>
  );
}
