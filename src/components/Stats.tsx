import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

const stats = [
  { value: 12400, suffix: '+', label: 'Активных пользователей' },
  { value: 58, prefix: '$', suffix: 'M+', label: 'Объём торгов' },
  { value: 999, suffix: '%', label: 'Uptime', decimal: true },
];

export default function Stats() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00FFB2]/5 rounded-full blur-[100px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl sm:text-6xl font-display font-bold text-gradient-primary mb-2">
                {stat.decimal ? (
                  <span>99.9%</span>
                ) : (
                  <AnimatedCounter value={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix || ''} />
                )}
              </div>
              <div className="text-sm text-[#8B95A7]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
