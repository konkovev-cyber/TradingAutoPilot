import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { bots } from '@/data/bots';

export default function Products() {
  return (
    <section id="bots" className="section-padding relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.07]" style={{ background: '#00FFB2' }} />
      <div className="absolute bottom-1/4 right-0 w-[360px] h-[360px] rounded-full blur-[110px] opacity-10" style={{ background: '#7B61FF' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold tracking-widest text-[var(--primary)] mb-6">
            НАШИ РОБОТЫ
          </span>
          <h2 className="heading-lg text-[var(--text)] mb-4">
            Три робота  <span className="text-gradient">три стратегии</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
            Каждый бот  самостоятельная торговая система. Купите один раз и торгуйте без абонентской платы.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-7">
          {bots.map((bot, i) => (
            <motion.div
              key={bot.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="group relative glass rounded-3xl p-7 card-hover flex flex-col overflow-hidden"
              style={{ borderTop: `3px solid ${bot.color}` }}
            >
              <div
                className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-[70px] opacity-60"
                style={{ background: bot.colorDim }}
              />

              <div className="relative flex-1">
                <span
                  className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide mb-5"
                  style={{ background: bot.colorDim, color: bot.color }}
                >
                  {bot.badge}
                </span>

                <h3 className="text-2xl font-display font-bold text-[var(--text)] mb-2">{bot.name}</h3>
                <p className="text-sm font-semibold mb-4 leading-snug" style={{ color: bot.color }}>
                  {bot.slogan}
                </p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">{bot.shortDesc}</p>

                <ul className="space-y-2.5 mb-7">
                  {bot.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                      <Check size={15} className="shrink-0 mt-0.5" style={{ color: bot.color }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative grid grid-cols-3 gap-2 mb-6">
                {bot.returns.map((r) => (
                  <div key={r.period} className="rounded-xl px-2 py-2.5 text-center" style={{ background: bot.colorDim }}>
                    <div className="text-[10px] text-[var(--text-subtle)] mb-0.5">{r.period}</div>
                    <div className="text-base font-display font-bold tabular-nums" style={{ color: bot.color }}>{r.value}</div>
                  </div>
                ))}
              </div>

              <Link
                to={`/bots/${bot.slug}`}
                className="btn-primary w-full py-3.5 text-sm group/btn"
                style={{ background: `linear-gradient(135deg, ${bot.color}, ${bot.color}CC)` }}
              >
                Подробнее о боте
                <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
