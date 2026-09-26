import { motion } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, ShieldCheck, Lock, Repeat, Activity } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import LiveDashboard from './LiveDashboard';

const trustBadges = [
  { icon: ShieldCheck, label: 'API-ключи без права вывода' },
  { icon: Lock, label: 'Шифрование AES-256' },
  { icon: Repeat, label: '10+ бирж' },
  { icon: Activity, label: '99.9% uptime' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid-animated opacity-60" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00FFB2]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#7B61FF]/10 rounded-full blur-[120px]" />

      {/* Animated market flow lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
        <motion.path
          d="M 0 300 Q 200 250 400 280 T 800 260 T 1200 240 T 1600 250"
          stroke="#00FFB2"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        />
        <motion.path
          d="M 0 500 Q 300 450 600 480 T 1200 460 T 1600 470"
          stroke="#00D4FF"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 1 }}
        />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse-glow" />
              <span className="text-xs text-[#8B95A7]">
                Комиссия только с прибыли · Без абонплаты
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] text-[#E6EDF7] mb-6">
              Торговые боты для криптобирж.{' '}
              <span className="text-gradient-primary">Прибыль 24/7</span> без вашего участия
            </h1>

            <p className="text-lg text-[#8B95A7] mb-8 max-w-xl leading-relaxed">
              Coinsofter автоматизирует торговлю на Binance, Bybit, OKX и других
              биржах. Без абонплаты. Комиссия только с прибыли. Подключение за 2
              минуты.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="btn-primary px-8 py-4 rounded-xl text-base flex items-center justify-center gap-2">
                Создать бота бесплатно
                <ArrowRight size={20} />
              </button>
              <button className="btn-secondary px-8 py-4 rounded-xl text-base flex items-center justify-center gap-2">
                <Play size={18} />
                Посмотреть демо
              </button>
            </div>

            {/* Earned counter */}
            <div className="glass rounded-2xl px-6 py-4 inline-flex items-center gap-3 mb-8">
              <TrendingUp className="text-[#00FFB2]" size={20} />
              <div>
                <div className="text-xs text-[#8B95A7]">Уже заработано пользователями</div>
                <div className="text-xl font-display font-bold text-[#00FFB2]">
                  <AnimatedCounter value={2847391} prefix="$" />
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <Icon className="text-[#00FFB2] shrink-0" size={16} />
                    <span className="text-xs text-[#8B95A7] leading-tight">{badge.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: live dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="animate-float">
              <LiveDashboard />
            </div>
            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -left-4 top-1/4 glass-strong rounded-xl px-3 py-2 hidden sm:block"
            >
              <div className="text-[10px] text-[#8B95A7]">Активные боты</div>
              <div className="text-sm font-bold text-[#00D4FF]">12 400+</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -right-4 bottom-1/4 glass-strong rounded-xl px-3 py-2 hidden sm:block"
            >
              <div className="text-[10px] text-[#8B95A7]">Uptime</div>
              <div className="text-sm font-bold text-[#00FFB2]">99.9%</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
