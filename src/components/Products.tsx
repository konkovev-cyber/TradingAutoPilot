import { motion } from "framer-motion";
import { useBots } from "@/lib/use-bots";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import BotCard from "@/components/bots/BotCard";

export default function Products() {
  const { t } = useI18n();
  const bots = useBots();
  const c = useContent();

  return (
    <section id="bots" className="robots relative block w-full bg-white py-16 transition-colors duration-300 dark:bg-gray-950 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="heading-lg text-gray-900 dark:text-white mb-4">
            {t("products.title")}
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-500 max-w-2xl mx-auto font-normal">
            {t("products.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {bots.map((bot, i) => (
            <motion.div
              key={bot.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex min-w-0"
            >
              <BotCard bot={bot} />
            </motion.div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl mx-auto text-center text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
          {c("products", "disclaimer", t("products.disclaimer"))}
        </p>
      </div>
    </section>
  );
}
