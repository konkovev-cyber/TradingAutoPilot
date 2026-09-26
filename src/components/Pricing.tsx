import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { pricingPlans } from '@/data/content';

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-50" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-[#7B61FF]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00FFB2]/3 rounded-full blur-[80px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles size={12} className="text-[#00FFB2]" />
            <span className="text-xs text-[#94A3B8] font-medium tracking-wide">PRICING</span>
          </div>
          <h2 className="heading-lg text-[#F1F5F9] mb-4">
            Pay only for <span className="text-gradient-primary">results</span>
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto mb-8 text-lg">
            No subscription. You pay a commission only when you profit. Switch plans anytime.
          </p>

          <div className="inline-flex items-center gap-1.5 p-1.5 glass rounded-full">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !yearly ? 'bg-[#00FFB2]/15 text-[#00FFB2] shadow-sm' : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                yearly ? 'bg-[#00FFB2]/15 text-[#00FFB2] shadow-sm' : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              Yearly
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00FFB2]/20 text-[#00FFB2] font-bold">-20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? 'glass-strong border-[#00FFB2]/25 glow-primary'
                  : 'glass-card'
              }`}
            >
              {plan.highlight && (
                <>
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#00FFB2]/20 via-transparent to-transparent opacity-50" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#00FFB2]/50 to-transparent" />
                </>
              )}

              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00FFB2] to-[#00D4FF] text-[#050A14] text-xs font-bold shadow-lg">
                  <Crown size={12} />
                  Popular
                </div>
              )}

              <div className="relative">
                <div className="flex items-center gap-2.5 mb-3">
                  {plan.highlight ? (
                    <Zap className="text-[#00FFB2]" size={18} />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10" />
                  )}
                  <h3 className="text-xl font-display font-bold text-[#F1F5F9]">
                    {plan.name}
                  </h3>
                </div>
                <p className="text-sm text-[#64748B] mb-6 min-h-[40px]">
                  {plan.description}
                </p>

                <div className="mb-6">
                  {plan.price === 'Custom' ? (
                    <span className="text-3xl font-display font-bold text-[#F1F5F9]">
                      Custom
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-display font-bold text-[#F1F5F9]">
                        {plan.price === '0' ? '0' : plan.price}
                      </span>
                      {plan.price !== '0' && (
                        <span className="text-sm text-[#64748B] ml-1">
                          {yearly ? '/year' : '/month'}
                        </span>
                      )}
                      {plan.price === '0' && (
                        <span className="text-sm text-[#64748B] ml-1">forever</span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold mb-7 transition-all ${
                    plan.highlight ? 'btn-primary shadow-lg shadow-[#00FFB2]/15' : 'btn-secondary'
                  }`}
                >
                  {plan.cta}
                </button>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-[#94A3B8]">
                      <Check size={14} className="text-[#00FFB2] shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
