import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ShieldCheck, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import { TradingEngine } from "./HeroEngine";
import { MetricsStrip } from "./HeroMetrics";

export default function Hero() {
  const { t } = useI18n();
  const c = useContent();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <section className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] overflow-hidden flex items-center pt-20">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle dot grid */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{ 
            backgroundImage: "radial-gradient(circle, #0B0F14 1px, transparent 1px)", 
            backgroundSize: "24px 24px" 
          }}
        />
        {/* Blue glow top right */}
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px] opacity-20 dark:opacity-10"
          style={{ 
            background: "radial-gradient(circle at 70% 30%, rgba(37, 99, 235, 0.15) 0%, transparent 60%)",
            filter: "blur(60px)"
          }}
        />
        {/* Green glow bottom left */}
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-15 dark:opacity-8"
          style={{ 
            background: "radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.12) 0%, transparent 60%)",
            filter: "blur(80px)"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full py-12 md:py-16">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#15171C] border border-black/5 dark:border-white/10 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60 animate-ping"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
            </span>
            <span className="text-[11px] font-semibold text-[#5A5F6B] dark:text-slate-400 uppercase tracking-widest">
              Автономная торговая система
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block">
            Crypto + Stocks
          </span>
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-start">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[48px] sm:text-[56px] lg:text-[64px] font-bold text-[#0B0F14] dark:text-white leading-[0.95] tracking-tight"
            >
              Торгуйте мировыми<br />
              <span className="text-[#10B981]">рынками.</span><br />
              Одним роботом.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[17px] text-[#5A5F6B] dark:text-slate-400 leading-[1.6] max-w-[520px]"
            >
              CryptoSuperStock анализирует отклонения цены, пересчитывает уровни входа 
              и работает через лимитные ордера. Криптовалюты и международные акции 
              в одной автоматической системе.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#bots"
                className="inline-flex items-center justify-center gap-2 h-[52px] px-8 bg-[#10B981] text-white font-semibold text-[15px] rounded-xl hover:bg-[#059669] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#10B981]/20 transition-all"
              >
                {t("hero.pick")}
                <ArrowRight size={18} strokeWidth={2.5} />
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center h-[52px] px-8 text-[#0B0F14] dark:text-white font-medium text-[15px] rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
              >
                <BookOpen size={18} className="mr-2 opacity-60" />
                {t("hero.cta2")}
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              {[
                { icon: ShieldCheck, text: "API без права вывода" },
                { icon: Zap, text: "Настройка 2 минуты" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <item.icon size={14} className="text-[#10B981]" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Trading Engine Visual */}
          <div className="relative">
            <TradingEngine />
          </div>
        </div>

        {/* Metrics Strip */}
        <MetricsStrip />
      </div>
    </section>
  );
}