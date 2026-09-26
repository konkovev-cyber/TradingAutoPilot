import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { bots } from '@/data/bots';

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  primary: { bg: 'bg-[var(--primary-dim)]', border: 'border-[var(--primary)]/20', text: 'text-[var(--primary)]' },
  secondary: { bg: 'bg-[var(--secondary-dim)]', border: 'border-[var(--secondary)]/20', text: 'text-[var(--secondary)]' },
  accent: { bg: 'bg-[var(--accent-dim)]', border: 'border-[var(--accent)]/20', text: 'text-[var(--accent)]' },
};

export default function Products() {
  return (
    <section id="bots" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[var(--primary)]/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-[var(--accent)]/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <span className="text-xs text-[var(--text-muted)] font-medium tracking-wide">БОТЫ</span>
          </div>
          <h2 className="heading-lg text-[var(--text)] mb-4">
            Три бота для{' '}
            <span className="text-gradient">любого рынка</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
            Grid для боковика, DCA для накопления, AI Signal для тренда. Без абонплаты  покупаете один раз.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {bots.map((bot, i) => {
            const colors = colorMap[bot.color];
            return (
              <motion.div
                key={bot.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`glass rounded-2xl p-8 card-hover relative overflow-hidden ${colors.border} border`}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent" />
                
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} ${colors.border} border mb-6`}>
                  <span className={`text-xs font-medium ${colors.text}`}>{bot.tag}</span>
                </div>

                <h3 className="heading-md text-[var(--text)] mb-3">{bot.name}</h3>
                <p className="text-[var(--text-muted)] mb-6 leading-relaxed">{bot.description}</p>

                <div className={`text-3xl font-display font-bold ${colors.text} mb-2`}>{bot.benefit}</div>
                <p className="text-sm text-[var(--text-muted)] mb-8">Ключевое преимущество</p>

                <div className="space-y-3 mb-8">
                  {bot.howItWorks.slice(0, 3).map((step, si) => (
                    <div key={si} className="flex items-start gap-3">
                      <Check size={16} className={`${colors.text} shrink-0 mt-0.5`} />
                      <div>
                        <div className="text-sm font-medium text-[var(--text)]">{step.title}</div>
                        <div className="text-xs text-[var(--text-muted)]">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-8">
                  {bot.returns.slice(0, 3).map((r, ri) => (
                    <div key={ri} className="glass rounded-xl p-3 text-center">
                      <div className="text-[10px] text-[var(--text-muted)] mb-1">{r.period}</div>
                      <div className={`text-lg font-display font-bold ${colors.text}`}>{r.value}</div>
                    </div>
                  ))}
                </div>

                <button className={`w-full btn-primary flex items-center justify-center gap-2 group`}>
                  Купить {bot.name}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
