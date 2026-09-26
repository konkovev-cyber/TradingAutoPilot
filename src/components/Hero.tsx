import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, ShieldCheck, Lock, Repeat, Activity, Zap } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import LiveDashboard from './LiveDashboard';

const trustBadges = [
  { icon: ShieldCheck, label: 'API keys without withdrawal' },
  { icon: Lock, label: 'AES-256 encryption' },
  { icon: Repeat, label: '10+ exchanges' },
  { icon: Activity, label: '99.9% uptime' },
];

export default function Hero() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const }
    }
  };

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-80" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00FFB2]/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 -left-48 w-[400px] h-[400px] bg-[#7B61FF]/8 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-[#00D4FF]/5 rounded-full blur-[120px]" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,178,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,178,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
        }}
      />

      <motion.div
        className="absolute top-32 right-1/4 w-3 h-3 rounded-full bg-[#00FFB2]/40 blur-[1px]"
        animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-48 right-1/3 w-2 h-2 rounded-full bg-[#00D4FF]/30 blur-[1px]"
        animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-64 left-1/4 w-2.5 h-2.5 rounded-full bg-[#7B61FF]/30 blur-[1px]"
        animate={{ y: [0, -25, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FFB2" stopOpacity="0" />
            <stop offset="50%" stopColor="#00FFB2" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00FFB2" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#00D4FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M -100 350 Q 200 280 400 320 T 900 300 T 1400 330 T 1800 310"
          stroke="url(#wave1)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
        />
        <motion.path
          d="M -100 480 Q 300 430 600 460 T 1200 440 T 1800 470"
          stroke="url(#wave2)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 1.5 }}
        />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          <div>
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFB2] opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFB2]"></span>
              </span>
              <span className="text-xs text-[#94A3B8] font-medium">
                Profit-based fee only  No subscription
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="heading-xl text-[#F1F5F9] mb-6">
              Trading bots for crypto exchanges.{" "}
              <span className="text-gradient-primary animate-gradient">
                24/7 profit
              </span>
              <br />
              without your involvement
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-[#94A3B8] mb-10 max-w-lg leading-relaxed">
              Coinsofter automates trading on Binance, Bybit, OKX and other exchanges. No subscription. Profit-based fee only. Set up in 2 minutes.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="btn-primary px-8 py-4 rounded-xl text-base flex items-center justify-center gap-2 shadow-xl shadow-[#00FFB2]/15 group">
                Create a bot for free
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button className="btn-secondary px-8 py-4 rounded-xl text-base flex items-center justify-center gap-2">
                <Play size={16} className="text-[#00FFB2]" fill="currentColor" />
                Watch demo
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-strong rounded-2xl px-6 py-4 inline-flex items-center gap-4 mb-10 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00FFB2]/10 border border-[#00FFB2]/20 flex items-center justify-center">
                  <TrendingUp className="text-[#00FFB2]" size={18} />
                </div>
                <div>
                  <div className="text-xs text-[#64748B]">Already earned by users</div>
                  <div className="text-2xl font-display font-bold text-[#00FFB2] tabular-nums">
                    <AnimatedCounter value={2847391} prefix="$" />
                  </div>
                </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex items-center gap-2">
                <Zap className="text-[#00D4FF]" size={16} />
                <span className="text-sm text-[#94A3B8]">
                  <span className="text-[#00D4FF] font-semibold">12,400+</span> active bots
                </span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass">
                    <Icon className="text-[#00FFB2] shrink-0" size={14} />
                    <span className="text-xs text-[#94A3B8] leading-tight">{badge.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' as const, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FFB2]/10 via-[#00D4FF]/5 to-[#7B61FF]/10 rounded-3xl blur-3xl scale-110" />
            <div className="relative animate-float">
              <LiveDashboard />
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -left-6 top-1/4 glass-strong rounded-xl px-4 py-3 hidden lg:block"
            >
              <div className="text-[10px] text-[#64748B] mb-1">Active bots</div>
              <div className="text-lg font-display font-bold text-[#00D4FF]">12,400+</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9px] text-[#00FFB2]">+23% this month</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -right-4 bottom-1/3 glass-strong rounded-xl px-4 py-3 hidden lg:block"
            >
              <div className="text-[10px] text-[#64748B] mb-1">Uptime</div>
              <div className="text-lg font-display font-bold text-[#00FFB2]">99.9%</div>
              <div className="w-full h-1 rounded-full bg-white/5 mt-2">
                <div className="h-full rounded-full bg-gradient-to-r from-[#00FFB2] to-[#00D4FF]" style={{ width: "99.9%" }} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-strong rounded-xl px-5 py-3 flex items-center gap-3 hidden lg:flex"
            >
              <div className="w-8 h-8 rounded-full bg-[#00FFB2]/15 flex items-center justify-center">
                <TrendingUp className="text-[#00FFB2]" size={14} />
              </div>
              <div>
                <div className="text-xs text-[#94A3B8]">Trade closed</div>
                <div className="text-sm font-semibold text-[#00FFB2]">+ $127.43  BTC/USDT</div>
              </div>
              <div className="text-[10px] text-[#64748B] ml-2">just now</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] text-[#64748B] uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-[#64748B]/30 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1 h-1 rounded-full bg-[#00FFB2]"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
