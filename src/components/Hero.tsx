import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Zap, Globe, LineChart } from 'lucide-react';
import { bots } from '@/data/bots';

const chips = [
  { icon: LineChart, label: 'Сотни сделок в день' },
  { icon: Globe, label: 'Акции + крипта' },
  { icon: Zap, label: 'ИИ-модули' },
  { icon: Globe, label: '24/7 мониторинг' },
];

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden">
      {/* glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[140px] opacity-20" style={{ background: 'radial-gradient(ellipse, #00FFB2 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 -left-40 w-[420px] h-[420px] rounded-full blur-[120px] opacity-10" style={{ background: '#7B61FF' }} />
      <div className="absolute top-1/3 -right-40 w-[420px] h-[420px] rounded-full blur-[120px] opacity-10" style={{ background: '#00D4FF' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-7"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse-glow text-[var(--primary)]" />
              <span className="text-xs font-medium text-[var(--text-muted)]">3 робота  BYBIT  Binance  OKX</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-xl text-[var(--text)] mb-6"
            >
              Три торговых робота.{' '}
              <span className="text-gradient">Прибыль 24/7</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg text-[var(--text-muted)] mb-10 max-w-lg leading-relaxed"
            >
              Гибрид акций и крипты, торговый пулемёт и охота за Pump &amp; Dump.
              Выберите своего робота  он торгует, пока вы занимаетесь своими делами.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <a href="#bots" className="btn-primary px-8 py-4 text-base group">
                Смотреть ботов
                <span className="transition-transform group-hover:translate-x-1"></span>
              </a>
              <a href="#how" className="btn-secondary px-8 py-4 text-base">
                Как это работает
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {['Без абонплаты  покупка навсегда', 'Подключение за 2 минуты', 'API без права вывода'].map((c) => (
                <span key={c} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-[var(--text-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                  {c}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right visual: terminal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-8 rounded-[2rem] blur-3xl opacity-25" style={{ background: 'linear-gradient(135deg, #00FFB2, #00D4FF, #7B61FF)' }} />

            <div className="relative glass-strong rounded-3xl p-6 animate-float">
              {/* window bar */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6A]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD93D]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2]" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary-dim)] text-[var(--primary)] font-semibold tracking-wide">LIVE</span>
              </div>

              <div className="text-xs text-[var(--text-muted)] mb-1">Прибыль за сегодня</div>
              <div className="text-3xl font-display font-bold text-[var(--primary)] tabular-nums mb-1">+$1,247.83</div>
              <div className="text-xs text-[var(--primary)] mb-5"> 12.4% за 24ч</div>

              {/* bars */}
              <div className="flex items-end gap-1.5 h-24 mb-5">
                {[35, 55, 40, 70, 48, 66, 52, 80, 58, 74, 60, 88, 70, 88, 72, 95].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.6 + i * 0.04, duration: 0.5, ease: 'easeOut' }}
                    className="flex-1 rounded-t"
                    style={{ background: i % 3 === 0 ? 'var(--primary)' : i % 5 === 0 ? 'var(--danger)' : 'var(--secondary)', opacity: 0.85, minHeight: 8 }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--border)]">
                <div>
                  <div className="text-[10px] text-[var(--text-subtle)]">Win Rate</div>
                  <div className="text-sm font-semibold text-[var(--primary)]">78.3%</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-subtle)]">Сделок</div>
                  <div className="text-sm font-semibold text-[var(--text)]">847</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-subtle)]">Аптайм</div>
                  <div className="text-sm font-semibold text-[var(--text)]">99.9%</div>
                </div>
              </div>
            </div>

            {/* floating chips */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute -left-4 top-8 glass-strong rounded-xl px-4 py-2.5 hidden lg:block animate-float"
            >
              <div className="text-[10px] text-[var(--text-subtle)]">MEGAGRID-AI</div>
              <div className="text-sm font-bold" style={{ color: '#FF4D6A' }}>+142 сделки</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="absolute -right-4 bottom-16 glass-strong rounded-xl px-4 py-2.5 hidden lg:block animate-float"
              style={{ animationDelay: '1.2s' }}
            >
              <div className="text-[10px] text-[var(--text-subtle)]">SMARTIX</div>
              <div className="text-sm font-semibold" style={{ color: '#7B61FF' }}>Short BTC/USDT +4.2%</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
