import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative glass-strong rounded-3xl p-12 text-center overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00FFB2]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#7B61FF]/10 rounded-full blur-[80px]" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#E6EDF7] mb-4">
              Начните зарабатывать на крипте уже сегодня
            </h2>
            <p className="text-[#8B95A7] mb-8 max-w-xl mx-auto">
              Без вложений. Комиссия только с прибыли. Подключение за 2 минуты — и
              бот работает 24/7.
            </p>
            <button className="btn-primary px-8 py-4 rounded-xl text-base inline-flex items-center gap-2">
              Создать бота бесплатно
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
