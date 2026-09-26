import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, AlertTriangle, Layers } from 'lucide-react';
import { getBot, bots } from '@/data/bots';
import Header from '@/components/Header';
import BackToTop from '@/components/BackToTop';

export default function BotDetailPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const bot = getBot(window.location.pathname.split('/').pop() || '');

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-8">
            <ArrowLeft size={16} /> Все роботы
          </Link>

          {bot ? (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span
                className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide mb-5"
                style={{ background: bot.colorDim, color: bot.color }}
              >
                {bot.badge}
              </span>

              <h1 className="heading-xl text-[var(--text)] mb-4">{bot.name}</h1>
              <p className="text-xl sm:text-2xl font-semibold mb-6 max-w-2xl" style={{ color: bot.color }}>
                {bot.slogan}
              </p>

              <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-3xl mb-10">{bot.shortDesc}</p>

              <div className="grid lg:grid-cols-5 gap-8 mb-12">
                <div className="lg:col-span-3 space-y-6">
                  <div className="glass rounded-3xl p-7">
                    <h3 className="heading-md text-[var(--text)] mb-4">О роботе</h3>
                    <p className="text-[var(--text-muted)] leading-relaxed">{bot.fullDesc}</p>
                  </div>

                  <div>
                    <h3 className="heading-md text-[var(--text)] mb-6">Как робот зарабатывает</h3>
                    <div className="space-y-4">
                      {bot.howItWorks.map((s, i) => (
                        <div key={s.title} className="flex gap-4 glass rounded-2xl p-5 card-hover">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold shrink-0"
                            style={{ background: bot.colorDim, color: bot.color }}
                          >
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-[var(--text)] mb-1">{s.title}</h4>
                            <p className="text-sm text-[var(--text-muted)]">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-display font-bold text-[var(--text)] mb-4">Доходность</h3>
                    <div className="space-y-3">
                      {bot.returns.map((r) => (
                        <div key={r.period} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: bot.colorDim }}>
                          <span className="text-sm text-[var(--text-muted)]">{r.period}</span>
                          <span className="text-lg font-display font-bold tabular-nums" style={{ color: bot.color }}>{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-5">
                    <h3 className="text-sm font-display font-bold text-[var(--text)] mb-3">Ключевые особенности</h3>
                    <ul className="space-y-2.5">
                      {bot.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                          <Check size={15} className="shrink-0 mt-0.5" style={{ color: bot.color }} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass rounded-2xl p-5 flex gap-3">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5 text-[var(--danger)]" />
                    <div>
                      <div className="text-sm font-semibold text-[var(--text)] mb-1">Риски</div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{bot.risk}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 mb-10">
                <div className="text-xs text-[var(--text-subtle)] mb-1 uppercase tracking-wider">Торгуемые активы</div>
                <div className="text-[var(--text)] font-medium">{bot.pairs}</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary px-8 py-4 text-base" style={{ background: `linear-gradient(135deg, ${bot.color}, ${bot.color}CC)` }}>
                  Запустить {bot.name}
                </button>
                <Link to="/" className="btn-secondary px-8 py-4 text-base">
                  <ArrowLeft size={16} /> Все роботы
                </Link>
              </div>

              <div className="mt-16 pt-10 border-t border-[var(--border)]">
                <h3 className="text-lg font-display font-bold text-[var(--text)] mb-6">Другие роботы</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {bots.filter((b) => b.slug !== bot.slug).map((b) => (
                    <Link key={b.slug} to={`/bots/${b.slug}`} className="glass rounded-2xl p-5 card-hover flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0" style={{ background: b.colorDim, color: b.color }}>
                        {b.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--text)] text-sm">{b.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">{b.badge}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-32">
              <p className="text-[var(--text-muted)] mb-6">Робот не найден</p>
              <Link to="/" className="btn-primary">На главную</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
