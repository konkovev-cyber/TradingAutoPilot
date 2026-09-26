import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { bots } from '@/data/bots';

export default function CTA() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, #00FFB2, transparent 70%)' }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="glass-strong rounded-[2rem] p-10 sm:p-14"
        >
          <h2 className="heading-lg text-[var(--text)] mb-5">
            Выберите своего <span className="text-gradient">торгового робота</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg mb-10 max-w-xl mx-auto">
            Без абонентской платы и комиссий с прибыли  покупаете робота один раз, он торгует для вас круглосуточно.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {bots.map((b) => (
              <Link
                key={b.slug}
                to={`/bots/${b.slug}`}
                className="btn-secondary px-6 py-3.5 text-sm font-semibold"
                style={{ borderColor: b.color, color: b.color }}
              >
                {b.name}
              </Link>
            ))}
          </div>

          <p className="text-xs text-[var(--text-subtle)] mt-8">
            API-ключи без права вывода  Средства остаются на вашей бирже
          </p>
        </motion.div>
      </div>
    </section>
  );
}
