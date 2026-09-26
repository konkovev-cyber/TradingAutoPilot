import { motion } from 'framer-motion';
import { AlertTriangle, Check } from 'lucide-react';

const problems = [
  'ы не можете следить за рынком 24/7.',
  'ока смотрите на один график  движение на другом.',
  'моции мешают принимать решения.',
  'учная торговля отнимает всё свободное время.',
];

const solutions = [
  'Coinsofter делает это за вас.',
  'оты сканируют рынок по всем парам одновременно.',
  'Стратегии исполняются без эмоций  строго по алгоритму.',
  'ы занимаетесь своими делами, а бот зарабатывает.',
];

export default function ProblemSolution() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-2xl p-8 border-[#FF4D6A]/10 relative overflow-hidden"
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF4D6A]/30 to-transparent" />

            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-[#FF4D6A]/10 border border-[#FF4D6A]/20 flex items-center justify-center">
                <AlertTriangle className="text-[#FF4D6A]" size={18} />
              </div>
              <h3 className="text-lg font-display font-bold text-[#F1F5F9]">роблема</h3>
            </div>
            <ul className="space-y-4">
              {problems.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#94A3B8] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6A] shrink-0 mt-1.5" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="glass rounded-2xl p-8 border-[#00FFB2]/10 relative overflow-hidden"
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FFB2]/30 to-transparent" />
            {/* Glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#00FFB2]/5 rounded-full blur-[40px]" />

            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-[#00FFB2]/10 border border-[#00FFB2]/20 flex items-center justify-center">
                <Check className="text-[#00FFB2]" size={18} />
              </div>
              <h3 className="text-lg font-display font-bold text-[#F1F5F9]">ешение</h3>
            </div>
            <ul className="space-y-4 relative">
              {solutions.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#94A3B8] leading-relaxed">
                  <Check size={14} className="text-[#00FFB2] shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
