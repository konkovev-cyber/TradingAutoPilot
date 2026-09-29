import { motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import BotCarousel from "@/components/bots/BotCarousel";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CTA() {
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
          className="relative mb-10 text-center"
        >
          <h2 className="heading-lg mb-4 text-gray-900 dark:text-white">{c("cta", "carouselTitle", t("cta.carouselTitle"))}</h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500 dark:text-gray-400 md:text-lg">
            {c("cta", "carouselSubtitle", t("cta.carouselSubtitle"))}
          </p>
        </motion.div>

        <BotCarousel />

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button onClick={() => scrollToId("bots")} className="btn-primary px-8 py-4 text-base">
            {c("cta", "btn1", t("cta.btn1"))}
            <ArrowRight size={18} />
          </button>
          <a
            href="https://t.me/coinsofter"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 px-8 py-4 text-base"
          >
            <Send size={18} />
            {c("cta", "contactBtn", t("cta.contactBtn"))}
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">{c("cta", "trust", t("cta.trust"))}</p>
      </div>
    </section>
  );
}
