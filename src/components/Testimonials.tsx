import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import { testimonials } from '@/data/content';

const colorMap: Record<string, string> = {
  primary: 'bg-[#00FFB2]/10 text-[#00FFB2] border-[#00FFB2]/20',
  secondary: 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/20',
  accent: 'bg-[#7B61FF]/10 text-[#7B61FF] border-[#7B61FF]/20',
};

export default function Testimonials() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#7B61FF]/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Star size={12} className="text-[#00FFB2] fill-[#00FFB2]" />
            <span className="text-xs text-[#94A3B8] font-medium tracking-wide">TESTIMONIALS</span>
          </div>
          <h2 className="heading-lg text-[#F1F5F9] mb-4">
            What our <span className="text-gradient-primary">users say</span>
          </h2>
          <p className="text-[#64748B] max-w-2xl mx-auto text-lg">
            Real stories from traders and investors who automated their trading with Coinsofter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              className="glass-card card-hover p-6 relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 right-0 h-px ${
                t.color === 'primary' ? 'bg-gradient-to-r from-transparent via-[#00FFB2]/40 to-transparent' :
                t.color === 'secondary' ? 'bg-gradient-to-r from-transparent via-[#00D4FF]/40 to-transparent' :
                'bg-gradient-to-r from-transparent via-[#7B61FF]/40 to-transparent'
              }`} />

              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={14} className="text-[#00FFB2] fill-[#00FFB2]" />
                ))}
              </div>

              <p className="text-sm text-[#E2E8F0] leading-relaxed mb-6 min-h-[90px]">
                {`"`}{t.text}{`"`}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${colorMap[t.color]}`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F1F5F9]">{t.name}</div>
                  <div className="text-xs text-[#64748B]">{t.role}</div>
                </div>
                <div className="ml-auto">
                  <TrendingUp size={16} className="text-[#00FFB2]/40" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
