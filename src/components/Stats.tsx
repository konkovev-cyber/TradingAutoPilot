import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

const stats = [
  { value: 12400, suffix: '+', label: 'ктивных пользователей' },
  { value: 58, prefix: '$', suffix: 'M+', label: 'бъём торгов' },
  { value: 999, suffix: '%', label: 'Uptime', decimal: true },
  { value: 847, suffix: '+', label: 'Сделок в день', subLabel: 'в среднем' },
];

export default function Stats() {
  return (
    <section className="section-padding relative overflow-hidden py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00FFB2]/4 rounded-full blur-[100px]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center relative group"
            >
              {/* Divider */}
              {i < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/5" />
              )}

              <div className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gradient-primary mb-2 tabular-nums">
                {stat.decimal ? (
                  <span>99.9%</span>
                ) : (
                  <AnimatedCounter value={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix || ''} />
                )}
              </div>
              <div className="text-sm text-[#94A3B8] font-medium">{stat.label}</div>
              {stat.subLabel && (
                <div className="text-xs text-[#64748B] mt-1">{stat.subLabel}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
