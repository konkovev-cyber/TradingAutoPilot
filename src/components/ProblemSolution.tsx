import { motion } from 'framer-motion';
import { AlertTriangle, Check } from 'lucide-react';

const problems = [
  'Вы не можете следить за рынком 24/7.',
  'Пока смотрите один график — движение на другом.',
  'Эмоции мешают принимать решения.',
  'Ручная торговля отнимает всё свободное время.',
];

const solutions = [
  'Coinsofter делает это за вас.',
  'Боты сканируют рынок по всем парам одновременно.',
  'Стратегии исполняются без эмоций — строго по алгоритму.',
  'Вы занимаетесь своими делами, а бот зарабатывает.',
];

export default function ProblemSolution() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-8 border-[#FF4D6A]/15"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FF4D6A]/10 border border-[#FF4D6A]/20 flex items-center justify-center">
                <AlertTriangle className="text-[#FF4D6A]" size={20} />
              </div>
              <h3 className="text-xl font-display font-bold text-[#E6EDF7]">Проблема</h3>
            </div>
            <ul className="space-y-4">
              {problems.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#8B95A7] leading-relaxed">
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
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-2xl p-8 border-[#00FFB2]/15"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#00FFB2]/10 border border-[#00FFB2]/20 flex items-center justify-center">
                <Check className="text-[#00FFB2]" size={20} />
              </div>
              <h3 className="text-xl font-display font-bold text-[#E6EDF7]">Решение</h3>
            </div>
            <ul className="space-y-4">
              {solutions.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#8B95A7] leading-relaxed">
                  <Check className="text-[#00FFB2] shrink-0 mt-0.5" size={16} />
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
