import { motion } from "framer-motion";
import { Globe, CreditCard, ShieldCheck, BarChart3, type LucideIcon } from "lucide-react";

const trustPoints: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Globe, title: "Работает на 20+ биржах через API", desc: "Подключение за 2 минуты на любой бирже" },
  { icon: CreditCard, title: "Без абонентской платы", desc: "Покупка один раз  торгует навсегда" },
  { icon: ShieldCheck, title: "Стоп-лосс и риск-менеджмент", desc: "В каждом роботе по умолчанию" },
  { icon: BarChart3, title: "Бэктесты и прозрачная статистика", desc: "Результаты подтверждены историей" },
];

export default function Trust() {
  return (
    <section className="bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustPoints.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-3.5 rounded-xl px-5 py-4 border border-gray-100 dark:border-gray-800"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(0,255,150,0.08)" }}>
                  <Icon size={18} className="text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">{p.title}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">{p.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
