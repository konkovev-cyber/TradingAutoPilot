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
                className="flex items-center gap-3.5 rounded-xl border border-white/60 bg-white/70 px-5 py-4 shadow-[0_10px_30px_-14px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300/40 hover:shadow-[0_16px_40px_-14px_rgba(16,185,129,0.25)] dark:border-white/[0.08] dark:bg-white/[0.06]"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#10B981]/20 text-[#10B981]"
                  style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.1))" }}
                >
                  <Icon size={18} />
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
