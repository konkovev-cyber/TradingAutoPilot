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
      className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {metrics.map((m, i) => {
        const Icon = m.icon;
        return (
          <div
            key={i}
            className="bg-white dark:bg-[#15171C] rounded-2xl border border-black/5 dark:border-white/10 p-5 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon size={22} className="text-[#10B981]" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[#0A0A0A] dark:text-white font-bold text-sm mb-1">{m.value}</div>
                <div className="text-[#5A5F6B] dark:text-slate-400 text-xs leading-relaxed">{m.description}</div>
              </div>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}