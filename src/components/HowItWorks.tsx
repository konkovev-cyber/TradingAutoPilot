import { motion } from 'framer-motion';
import { UserPlus, Key, Bot, TrendingUp, ArrowRight } from 'lucide-react';
import { howItWorksSteps } from '@/data/content';

const iconMap: Record<string, typeof UserPlus> = {
  'user-plus': UserPlus,
  key: Key,
  bot: Bot,
  'trending-up': TrendingUp,
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#E6EDF7] mb-4">
            Как это работает
          </h2>
          <p className="text-[#8B95A7] max-w-2xl mx-auto text-lg">
            От регистрации до первой сделки — 2 минуты. Без программирования и
            сложных настроек.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line with animated flow */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#00FFB2]/30 to-transparent" />
          <motion.div
            className="hidden lg:block absolute top-12 left-[12.5%] h-px"
            initial={{ width: '0%' }}
            whileInView={{ width: '75%' }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            style={{ background: 'linear-gradient(90deg, transparent, #00FFB2, transparent)' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, i) => {
              const Icon = iconMap[step.icon] || UserPlus;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative text-center"
                >
                  <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl glass mb-5 card-hover animate-glow-pulse">
                    <Icon className="text-[#00FFB2]" size={28} />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#00FFB2] text-[#0A0E17] text-xs font-bold flex items-center justify-center font-display">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-semibold text-[#E6EDF7] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#8B95A7] max-w-[200px] mx-auto">
                    {step.description}
                  </p>
                  {i < howItWorksSteps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-10 -right-4 text-[#00FFB2]/30" size={20} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Connection flow animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 glass rounded-2xl p-6 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Key className="text-[#8B95A7]" size={18} />
              </div>
              <span className="text-xs text-[#8B95A7]">API-ключ</span>
            </div>
            <motion.div
              className="h-px w-8 sm:w-16 bg-gradient-to-r from-[#00FFB2]/30 to-[#00FFB2]/60"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#00FFB2]/10 border border-[#00FFB2]/20 flex items-center justify-center">
                <Bot className="text-[#00FFB2]" size={18} />
              </div>
              <span className="text-xs text-[#00FFB2]">Coinsofter Bot</span>
            </div>
            <motion.div
              className="h-px w-8 sm:w-16 bg-gradient-to-r from-[#00FFB2]/60 to-[#00D4FF]/60"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center">
                <TrendingUp className="text-[#00D4FF]" size={18} />
              </div>
              <span className="text-xs text-[#00D4FF]">Сделка исполнена</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
