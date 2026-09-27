import { motion } from "framer-motion";
import { Activity, Layers, Repeat, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const icons = [Activity, Layers, Repeat, Zap];

export function MetricsStrip() {
  const { lang } = useI18n();
  const metrics = lang === "en"
    ? [
        { value: "24/7", description: "The bot monitors markets continuously" },
        { value: "Crypto + Stocks", description: "One system for digital and global assets" },
        { value: "Limit Orders", description: "Automatic entries based on market deviations" },
        { value: "2 min", description: "Connect an API key and get started" },
      ]
    : [
        { value: "24/7", description: "Робот непрерывно следит за рынком" },
        { value: "Crypto + Stocks", description: "Одна система для цифровых и мировых активов" },
        { value: "Limit Orders", description: "Автоматические входы по отклонениям рынка" },
        { value: "2 мин", description: "Подключите API-ключ и начинайте" },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.5 }}
      className="mt-0 w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/[0.1] dark:bg-[#101722]/85 dark:shadow-[0_22px_65px_rgba(0,0,0,0.28)]"
    >
      <div className="grid grid-cols-2 divide-x divide-y divide-black/[0.06] dark:divide-white/[0.08] lg:grid-cols-4 lg:divide-y-0">
        {metrics.map((metric, index) => {
          const Icon = icons[index];
          return (
            <motion.div
              key={metric.value}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 350, damping: 24 }}
              className="group relative flex min-h-[106px] items-center gap-3 px-4 py-5 transition-colors hover:bg-black/[0.025] dark:hover:bg-white/[0.035] sm:gap-4 sm:px-6"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#10B981]/15 bg-[#10B981]/10 text-[#10B981] transition-all duration-300 group-hover:scale-110 group-hover:border-[#10B981]/30 group-hover:bg-[#10B981]/15 group-hover:shadow-[0_0_24px_rgba(16,185,129,0.18)] sm:h-11 sm:w-11">
                <Icon size={19} strokeWidth={1.8} />
                <span className="absolute inset-0 rounded-xl border border-[#10B981]/30 opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-60" />
              </div>
              <div className="min-w-0">
                <div className="mb-1 truncate text-sm font-bold text-[#0A0A0A] dark:text-white">{metric.value}</div>
                <div className="text-[11px] leading-snug text-[#5A5F6B] dark:text-slate-400 sm:text-xs">{metric.description}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
