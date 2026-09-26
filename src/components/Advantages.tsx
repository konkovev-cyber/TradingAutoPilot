import { motion } from 'framer-motion';
import {
  Percent,
  Repeat,
  ShieldCheck,
  Clock,
  BookOpen,
  Gift,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { advantages, supportedExchanges } from '@/data/content';

const iconMap: Record<string, React.ElementType> = {
  percent: Percent,
  exchange: Repeat,
  shield: ShieldCheck,
  clock: Clock,
  book: BookOpen,
  gift: Gift,
};

export default function Advantages() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7B61FF]/4 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <span className="text-xs text-[#94A3B8] font-medium tracking-wide">ADVANTAGES</span>
          </div>
          <h2 className="heading-lg text-[#F1F5F9] mb-4">
            Why choose <span className="text-gradient-primary">Coinsofter</span>
          </h2>
          <p className="text-[#64748B] max-w-2xl mx-auto text-lg">
            We built a platform that makes automated trading simple, secure and honest.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {advantages.map((adv, i) => {
            const Icon = iconMap[adv.icon] || Percent;
            return (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card card-hover p-6 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#00FFB2]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00FFB2]/8 border border-[#00FFB2]/15 flex items-center justify-center shrink-0 group-hover:bg-[#00FFB2]/12 transition-colors">
                    <Icon className="text-[#00FFB2]" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-display font-semibold text-[#F1F5F9] mb-1.5">
                      {adv.title}
                    </h3>
                    <p className="text-sm text-[#64748B] leading-relaxed">
                      {adv.description}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-[#64748B] opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 shrink-0" />
                </div>

                {adv.icon === 'percent' && (
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00FFB2]/8 border border-[#00FFB2]/15">
                    <Lock size={12} className="text-[#00FFB2]" />
                    <span className="text-xs text-[#00FFB2] font-semibold">0% subscription</span>
                  </div>
                )}
                {adv.icon === 'shield' && (
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00FFB2]/8 border border-[#00FFB2]/15">
                    <Lock size={12} className="text-[#00FFB2]" />
                    <span className="text-xs text-[#00FFB2] font-semibold">API without withdrawal</span>
                  </div>
                )}
                {adv.icon === 'clock' && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFB2] opacity-40"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFB2]"></span>
                    </span>
                    <span className="text-xs text-[#00FFB2] font-medium">Works 24/7</span>
                  </div>
                )}
                {adv.icon === 'gift' && (
                  <div className="mt-4 text-sm font-semibold text-[#00FFB2]">
                    $5 bonus for new users
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-strong rounded-2xl p-8 overflow-hidden"
        >
          <div className="text-center mb-6">
            <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-wide">SUPPORTED EXCHANGES</h3>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0C1525] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0C1525] to-transparent z-10" />
            <div className="flex gap-6 animate-marquee">
              {[...supportedExchanges, ...supportedExchanges].map((exchange, i) => (
                <span
                  key={`${exchange}-${i}`}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] hover:border-[#00FFB2]/20 hover:bg-[#00FFB2]/5 transition-all cursor-default shrink-0"
                >
                  {exchange}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
