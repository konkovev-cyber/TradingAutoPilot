import { motion } from 'framer-motion';
import { UserPlus, Key, Bot, TrendingUp } from 'lucide-react';
import { howItWorksSteps } from '@/data/content';

const iconMap: Record<string, React.ElementType> = {
  'user-plus': UserPlus,
  key: Key,
  bot: Bot,
  'trending-up': TrendingUp,
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00D4FF]/3 rounded-full blur-[100px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <span className="text-xs text-[#94A3B8] font-medium tracking-wide">HOW IT WORKS</span>
          </div>
          <h2 className="heading-lg text-[#F1F5F9] mb-4">
            From registration to first trade  <span className="text-gradient-primary">2 minutes</span>
          </h2>
          <p className="text-[#64748B] max-w-2xl mx-auto text-lg">
            No programming or complex setup. Everything is intuitive and clear.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-14 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[#00FFB2]/20 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, i) => {
              const Icon = iconMap[step.icon] || UserPlus;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="relative text-center group"
                >
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl glass mb-6 card-hover group-hover:border-[#00FFB2]/20">
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-xl bg-gradient-to-br from-[#00FFB2] to-[#00D4FF] text-[#050A14] text-xs font-bold flex items-center justify-center font-display shadow-lg">
                      {step.step}
                    </span>
                    <Icon className="text-[#00FFB2]" size={24} />
                  </div>

                  <h3 className="text-base font-display font-semibold text-[#F1F5F9] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed max-w-[220px] mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 glass-strong rounded-2xl p-6 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
            {[
              { icon: Key, label: 'API key', color: '#94A3B8', bg: 'bg-white/5' },
              { icon: Bot, label: 'Coinsofter', color: '#00FFB2', bg: 'bg-[#00FFB2]/10' },
              { icon: TrendingUp, label: 'Trade', color: '#00D4FF', bg: 'bg-[#00D4FF]/10' },
            ].map((item, i, arr) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.bg} border border-white/10 flex items-center justify-center`}>
                    <Icon className="text-[#94A3B8]" size={20} />
                  </div>
                  <span className="text-xs text-[#64748B] hidden sm:block">{item.label}</span>
                  {i < arr.length - 1 && (
                    <motion.div
                      className="hidden sm:block text-[#00FFB2]/30"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                    >
                      <svg width="40" height="12" viewBox="0 0 40 12" className="text-[#00FFB2]/30">
                        <path d="M0 6 H30 M25 2 L32 6 L25 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
