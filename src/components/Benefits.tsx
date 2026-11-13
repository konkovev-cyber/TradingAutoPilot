import { motion } from "framer-motion";
import {
  IconMessageCircle2,
  IconDeviceDesktop,
} from "@tabler/icons-react";
import { useI18n } from "@/lib/i18n";
import { useContent, useLocalizedList, localize } from "@/lib/site-content";
import { BenefitVisual } from "@/components/ui/BenefitVisual";

export default function Benefits() {
  const { lang, t } = useI18n();
  const c = useContent();
  const items = useLocalizedList("benefits", "items");

  return (
    <section className="section-padding bg-white py-12 transition-colors duration-300 dark:bg-gray-900 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h2 className="heading-lg mb-3 sm:mb-4 text-gray-900 dark:text-white">{c("benefits", "title", t("benefits.title"))}</h2>
          <p className="mx-auto max-w-2xl text-sm font-normal text-gray-600 dark:text-gray-300 sm:text-base md:text-lg">
            {c("benefits", "subtitle", t("benefits.subtitle"))}
          </p>
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
            {[
              { icon: IconMessageCircle2, label: c("benefits", "formatTelegram", t("benefits.formatTelegram")) },
              { icon: IconDeviceDesktop, label: c("benefits", "formatWindows", t("benefits.formatWindows")) },
            ].map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-900/40 dark:text-emerald-200 sm:text-sm"
              >
                <f.icon size={16} className="shrink-0 text-emerald-500 dark:text-emerald-300" />
                {f.label}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-emerald-300/40 dark:border-gray-700/60 dark:bg-gray-800"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-24 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
              <BenefitVisual
                index={i}
                name={(item as any)?.icon}
                className="mb-4 h-24 w-24 transition-transform duration-300 group-hover:scale-105"
              />
              {item?.tag ? (
                <span className="mb-3 inline-block rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
                  {localize(item?.tag, "", lang)}
                </span>
              ) : null}
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{localize(item?.title, "", lang)}</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-200">{localize(item?.desc, "", lang)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
