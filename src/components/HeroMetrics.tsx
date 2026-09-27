import { motion } from "framer-motion";
import { Activity, Layers, Repeat, Zap } from "lucide-react";

const metrics = [
  {
    icon: Activity,
    value: "24/7",
    label: "Автоматический мониторинг",
    description: "Робот работает круглосуточно без перерывов"
  },
  {
    icon: Layers,
    value: "Crypto + Stocks",
    label: "Единая система",
    description: "Криптовалюты и международные акции в одном роботе"
  },
  {
    icon: Repeat,
    value: "Limit Orders",
    label: "Автоматическое размещение",
    description: "Умные ордера на основе отклонений от среднего"
  },
  {
    icon: Zap,
    value: "2 мин",
    label: "Быстрое подключение",
    description: "API-ключ без права вывода, настройка за минуты"
  }
];

export function MetricsStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mt-8 bg-white dark:bg-[#15171C] rounded-2xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-black/5 dark:divide-white/10">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="flex items-center gap-4 px-6 py-5 group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-[#10B981]/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Icon size={20} className="text-[#10B981]" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <div className="text-[#0A0A0A] dark:text-white font-bold text-sm mb-0.5">{m.value}</div>
                <div className="text-[#5A5F6B] dark:text-slate-400 text-xs leading-snug">{m.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}