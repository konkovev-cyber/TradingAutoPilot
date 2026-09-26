import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CTA() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-[#00FFB2]/8 via-[#00D4FF]/5 to-[#7B61FF]/8 rounded-full blur-[100px]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative glass-strong rounded-3xl p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Gradient orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#00FFB2]/8 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#7B61FF]/8 rounded-full blur-[60px]" />

          {/* Border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#00FFB2]/10 via-transparent to-transparent opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#00FFB2]/40 to-transparent" />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FFB2]/8 border border-[#00FFB2]/20 mb-8"
            >
              <CheckCircle2 size={14} className="text-[#00FFB2]" />
              <span className="text-xs text-[#00FFB2] font-medium">рисоединяйтесь к 12 000+ трейдерам</span>
            </motion.div>

            <h2 className="heading-lg text-[#F1F5F9] mb-5 max-w-2xl mx-auto">
              ачните зарабатывать на{' '}
              <span className="text-gradient-primary">крипто с сегодня</span>
            </h2>
            <p className="text-[#94A3B8] mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              ез вложений. омиссия только с прибыли. одключение за 2 минуты  и бот работает 24/7.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="btn-primary px-10 py-4 rounded-xl text-base shadow-xl shadow-[#00FFB2]/20 group">
                Создать бота бесплатно
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button className="btn-secondary px-8 py-4 rounded-xl text-base">
                Связаться с нами
              </button>
            </div>

            {/* Trust line */}
            <p className="mt-8 text-xs text-[#64748B]">
              е требуется карта для начала  тмена в любой момент
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
