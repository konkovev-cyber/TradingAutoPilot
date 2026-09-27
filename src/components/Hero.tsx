import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ShieldCheck, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { TradingEngine } from "./HeroEngine";
import { MetricsStrip } from "./HeroMetrics";

export default function Hero() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <section className="relative bg-[#F8FAFC] dark:bg-[#0B1120] overflow-hidden flex items-center py-8 md:py-12">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dot grid - subtle */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, #0B0F14 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        {/* Blue glow top right */}
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] opacity-15 dark:opacity-10"
          style={{ background: "radial-gradient(circle at 75% 25%, rgba(37, 99, 235, 0.15) 0%, transparent 55%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 flex items-center gap-3"
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#15171C] border border-black/10 dark:border-white/10 shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60 animate-ping"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
            </span>
            <span className="text-[10px] font-semibold text-[#5A5F6B] dark:text-slate-400 uppercase tracking-widest">
              Автономная торговая система
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block">
            Crypto + Stocks
          </span>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[45%_55%] gap-10 lg:gap-14 items-center">
          {/* Left */}
          <div>
            {/* Headline - 3 lines */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[44px] sm:text-[52px] lg:text-[58px] font-bold text-[#0B0F14] dark:text-white leading-[0.98] tracking-tight mb-5"
            >
              Торгуйте мировыми<br />
              рынками.<br />
              <span className="text-[#10B981]">Одним роботом.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[16px] text-[#5A5F6B] dark:text-slate-400 leading-[1.6] max-w-[460px] mb-7"
            >
              CryptoSuperStock анализирует отклонения цены, пересчитывает уровни входа и работает через лимитные ордера.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              <a
                href="#bots"
                className="inline-flex items-center justify-center gap-2 h-[50px] px-7 bg-[#10B981] text-white font-semibold text-[14px] rounded-xl hover:bg-[#059669] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#10B981]/20 transition-all"
              >
                {t("hero.pick")}
                <ArrowRight size={16} strokeWidth={2.5} />
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center h-[50px] px-7 text-[#0B0F14] dark:text-white font-medium text-[14px] rounded-xl border border-black/10 dark:border-white/15 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
              >
                <BookOpen size={16} className="mr-2 opacity-50" />
                {t("hero.cta2")}
              </a>
            </motion.div>

            {/* Trust points */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-5"
            >
              {[
                { icon: ShieldCheck, text: "API без права вывода" },
                { icon: Zap, text: "Настройка 2 минуты" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <item.icon size={13} className="text-[#10B981]" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Trading Engine */}
          <div className="relative">
            <TradingEngine />
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-8">
          <MetricsStrip />
        </div>
      </div>
    </section>
  );
}