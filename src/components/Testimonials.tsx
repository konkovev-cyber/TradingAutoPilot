import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { testimonials } from '@/data/content';

const colorMap: Record<string, string> = {
  primary: 'bg-[#00FFB2]/10 text-[#00FFB2] border-[#00FFB2]/20',
  secondary: 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/20',
  accent: 'bg-[#7B61FF]/10 text-[#7B61FF] border-[#7B61FF]/20',
};

export default function Testimonials() {
  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#E6EDF7] mb-4">
            Отзывы пользователей
          </h2>
          <p className="text-[#8B95A7] max-w-2xl mx-auto">
            Реальные истории трейдеров и инвесторов, которые автоматизировали
            торговлю с Coinsofter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 card-hover"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={16} className="text-[#00FFB2] fill-[#00FFB2]" />
                ))}
              </div>
              <p className="text-sm text-[#E6EDF7] leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${colorMap[t.color]}`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#E6EDF7]">{t.name}</div>
                  <div className="text-xs text-[#8B95A7]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
