import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  Building2,
  MousePointerClick,
  ShieldCheck,
  BookOpen,
  Headset,
  MessageCircle,
  Monitor,
  LucideIcon,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent, useLocalizedList, localize } from "@/lib/site-content";

const ICON_MAP: Record<string, LucideIcon> = {
  "badge-dollar-sign": BadgeDollarSign,
  "building-2": Building2,
  "mouse-pointer-click": MousePointerClick,
  "shield-check": ShieldCheck,
  "book-open": BookOpen,
  headset: Headset,
  "message-circle": MessageCircle,
  monitor: Monitor,
};
const DEFAULT_ICONS: LucideIcon[] = [
  BadgeDollarSign,
  Building2,
  MousePointerClick,
  ShieldCheck,
  BookOpen,
  Headset,
];

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
          <p className="mx-auto max-w-2xl text-sm font-normal text-gray-500 dark:text-gray-400 sm:text-base md:text-lg">
            {c("benefits", "subtitle", t("benefits.subtitle"))}
          </p>
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
            {[
              { icon: MessageCircle, label: c("benefits", "formatTelegram", t("benefits.formatTelegram")) },
              { icon: Monitor, label: c("benefits", "formatWindows", t("benefits.formatWindows")) },
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
          {items.map((item, i) => {
            const iconKey = String((item as any)?.icon ?? "").toLowerCase();
            const Icon = ICON_MAP[iconKey] ?? DEFAULT_ICONS[i] ?? BadgeDollarSign;
            return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-emerald-300/40 dark:border-gray-700/60 dark:bg-gray-800"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-24 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300">
                <Icon size={22} />
              </div>
              {item?.tag ? (
                <span className="mb-3 inline-block rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
                  {localize(item?.tag, "", lang)}
                </span>
              ) : null}
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{localize(item?.title, "", lang)}</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-200">{localize(item?.desc, "", lang)}</p>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
