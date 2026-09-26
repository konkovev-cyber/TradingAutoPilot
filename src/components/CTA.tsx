import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export default function CTA() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--primary)]/10 rounded-full blur-[120px]" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
          <h2 className="heading-lg text-[var(--text)] mb-6">
            Начните зарабатывать на{' '}
            <span className="text-gradient">крипто уже сегодня</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg mb-10 max-w-2xl mx-auto">
            Без абонентской платы. Комиссия только с прибыли. Подключение за 2 минуты.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#bots" className="btn-primary px-8 py-4 rounded-xl text-base group">
              Выбрать бота
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-[var(--text-subtle)]">
            <span className="flex items-center gap-2"><Check size={14} className="text-[var(--primary)]" /> Без карты</span>
            <span className="flex items-center gap-2"><Check size={14} className="text-[var(--primary)]" /> Отмена в любой момент</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
