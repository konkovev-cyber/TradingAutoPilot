import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, ShieldCheck, Lock, Repeat, Activity, Zap } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import LiveDashboard from './LiveDashboard';

const trustBadges = [
  { icon: ShieldCheck, label: 'Без права вывода' },
  { icon: Lock, label: 'AES-256' },
  { icon: Repeat, label: '10+ бирж' },
  { icon: Activity, label: '99.9% uptime' },
];

export default function Hero() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isInView) controls.start('visible');
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
  };

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 -left-48 w-[400px] h-[400px] bg-[var(--accent)]/8 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-[var(--secondary)]/5 rounded-full blur-[120px]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(0,255,178,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,178,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={controls} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-40"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span></span>
              <span className="text-xs text-[var(--text-muted)] font-medium">Боты торгуют 24/7</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="heading-xl text-[var(--text)] mb-6">
              Три бота для{' '}
              <span className="text-gradient">любой стратегии</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-[var(--text-muted)] mb-10 max-w-lg leading-relaxed">
              Grid Bot для боковика, DCA Bot для накопления, AI Signal для тренда. Подключение за 2 минуты.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="/#bots" className="btn-primary px-8 py-4 rounded-xl text-base group">
                Выбрать бота
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
              <button className="btn-secondary px-8 py-4 rounded-xl text-base group">
                <Play size={16} className="text-[var(--primary)]" fill="currentColor" />
                Смотреть демо
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-strong rounded-2xl px-6 py-4 inline-flex items-center gap-4 mb-10 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary-dim)] border border-[var(--primary)]/20 flex items-center justify-center">
                  <TrendingUp className="text-[var(--primary)]" size={18} />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)]">Заработано пользователями</div>
                  <div className="text-2xl font-display font-bold text-[var(--primary)] tabular-nums">
                    <AnimatedCounter value={2847391} prefix="$" />
                  </div>
                </div>
              </div>
              <div className="w-px h-10 bg-[var(--border)]" />
              <div className="flex items-center gap-2">
                <Zap className="text-[var(--secondary)]" size={16} />
                <span className="text-sm text-[var(--text-muted)]"><span className="text-[var(--secondary)] font-semibold">12,400+</span> ботов</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass">
                    <Icon className="text-[var(--primary)] shrink-0" size={14} />
                    <span className="text-xs text-[var(--text-muted)] leading-tight">{badge.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' as const, delay: 0.3 }} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-[var(--secondary)]/5 to-[var(--accent)]/10 rounded-3xl blur-3xl scale-110" />
            <div className="relative animate-float">
              <LiveDashboard />
            </div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.5 }} className="absolute -left-6 top-1/4 glass-strong rounded-xl px-4 py-3 hidden lg:block">
              <div className="text-[10px] text-[var(--text-muted)] mb-1">Активных ботов</div>
              <div className="text-lg font-display font-bold text-[var(--secondary)]">12,400+</div>
              <div className="text-[9px] text-[var(--primary)]">+23% за месяц</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.5 }} className="absolute -right-4 bottom-1/3 glass-strong rounded-xl px-4 py-3 hidden lg:block">
              <div className="text-[10px] text-[var(--text-muted)] mb-1">Uptime</div>
              <div className="text-lg font-display font-bold text-[var(--primary)]">99.9%</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-[var(--text-muted)]/30 flex items-start justify-center p-1.5">
          <motion.div className="w-1 h-1 rounded-full bg-[var(--primary)]" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </motion.div>
    </section>
  );
}
