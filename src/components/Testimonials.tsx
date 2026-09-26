import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  { name: 'Алексей М.', role: 'Криптотрейдер, 3 года', text: 'Использую Grid Bot на Binance уже 4 месяца. Стабильный доход в боковике, который раньше просто сливал депо.', initials: 'АМ' },
  { name: 'Мария К.', role: 'Инвестор', text: 'DCA Bot помогает мне накапливать BTC без стресса. Настроила и забыла  бот делает свою работу.', initials: 'МК' },
  { name: 'Дмитрий В.', role: 'Full-time работа, крипто на стороне', text: 'AI Signal Bot торгует, пока я работаю. Не нужно сидеть за графиками. Сигналы адекватные.', initials: 'ДВ' },
];

export default function Testimonials() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h2 className="heading-lg text-[var(--text)] mb-4">Отзывы пользователей</h2>
          <p className="text-[var(--text-muted)] text-lg">Реальные истории трейдеров</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="glass rounded-2xl p-8 card-hover relative">
              <Quote size={32} className="text-[var(--primary)]/20 absolute top-6 right-6" />
              <p className="text-[var(--text-muted)] leading-relaxed mb-6 relative z-10">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-dim)] flex items-center justify-center text-[var(--primary)] font-bold">{t.initials}</div>
                <div>
                  <div className="font-medium text-[var(--text)]">{t.name}</div>
                  <div className="text-sm text-[var(--text-subtle)]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
