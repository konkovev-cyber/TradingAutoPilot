import { motion } from 'framer-motion';
import {
  Percent,
  Repeat,
  ShieldCheck,
  Clock,
  BookOpen,
  Gift,
  Lock,
} from 'lucide-react';
import { advantages, supportedExchanges } from '@/data/content';

const iconMap: Record<string, typeof Percent> = {
  percent: Percent,
  exchange: Repeat,
  shield: ShieldCheck,
  clock: Clock,
  book: BookOpen,
  gift: Gift,
};

export default function Advantages() {
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#E6EDF7] mb-4">
            Почему Coinsofter
          </h2>
          <p className="text-[#8B95A7] max-w-2xl mx-auto text-lg">
            Мы создали платформу, которая делает автоматизацию торговли простой,
            безопасной и честной.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((adv, i) => {
            const Icon = iconMap[adv.icon] || Percent;
            const isClock = adv.icon === 'clock';
            const isGift = adv.icon === 'gift';
            const isPercent = adv.icon === 'percent';
            const isShield = adv.icon === 'shield';
            return (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="glass rounded-2xl p-6 card-hover relative overflow-hidden"
              >
                {/* Special accent backgrounds */}
                {isPercent && (
                  <div className="absolute top-0 right-0 text-6xl font-display font-bold text-[#00FFB2]/5 select-none">0%</div>
                )}
                {isShield && (
                  <div className="absolute top-2 right-3">
                    <Lock className="text-[#00FFB2]/10" size={48} />
                  </div>
                )}
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#00FFB2]/10 border border-[#00FFB2]/20 mb-4 ${isClock ? 'animate-glow-pulse' : ''}`}>
                    {isGift ? (
                      <div className="animate-coin" style={{ transformStyle: 'preserve-3d' }}>
                        <Gift className="text-[#00FFB2]" size={22} />
                      </div>
                    ) : (
                      <Icon className="text-[#00FFB2]" size={22} />
                    )}
                  </div>
                  <h3 className="text-lg font-display font-semibold text-[#E6EDF7] mb-2">
                    {adv.title}
                  </h3>
                  <p className="text-sm text-[#8B95A7] leading-relaxed">
                    {adv.description}
                  </p>
                  {isPercent && (
                    <div className="mt-3 text-2xl font-display font-bold text-[#00FFB2]">0% абонплаты</div>
                  )}
                  {isShield && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#00FFB2]/10 border border-[#00FFB2]/20">
                      <Lock size={12} className="text-[#00FFB2]" />
                      <span className="text-xs text-[#00FFB2] font-medium">API без права вывода</span>
                    </div>
                  )}
                  {adv.icon === 'book' && (
                    <div className="mt-3 text-sm text-[#00FFB2] font-semibold">50+ гайдов</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Exchange logos row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 glass rounded-2xl p-8"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-display font-semibold text-[#E6EDF7]">
              Поддерживаемые биржи
            </h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {supportedExchanges.map((exchange) => (
              <span
                key={exchange}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-[#8B95A7] hover:text-[#E6EDF7] hover:border-[#00FFB2]/20 transition-all"
              >
                {exchange}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
