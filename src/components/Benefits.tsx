import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useContent, useLocalizedList, localize } from "@/lib/site-content";

export default function Benefits() {
  const { lang, t } = useI18n();
  const c = useContent();
  const items = useLocalizedList("benefits", "items");

  return (
    <section className="section-padding bg-white py-12 transition-colors duration-300 dark:bg-gray-950 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h2 className="heading-lg mb-3 sm:mb-4 text-gray-900 dark:text-white">{c("benefits", "title", t("benefits.title"))}</h2>
          <p className="mx-auto max-w-2xl text-sm font-normal text-gray-500 dark:text-gray-400 sm:text-base md:text-lg">
            {c("benefits", "subtitle", t("benefits.subtitle"))}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-emerald-300/40 dark:border-gray-800 dark:bg-gray-900"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-24 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
              {item?.tag ? (
                <span className="mb-3 inline-block rounded-md bg-gray-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  {localize(item?.tag, "", lang)}
                </span>
              ) : null}
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{localize(item?.title, "", lang)}</h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{localize(item?.desc, "", lang)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
