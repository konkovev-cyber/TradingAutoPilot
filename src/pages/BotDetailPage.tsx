import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { getBot } from '@/data/bots';

export default function BotDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const bot = getBot(slug || '');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!bot) return <div className="pt-32 text-center text-[var(--text-muted)]">Бот не найден</div>;

  if (!mounted) return null;

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-8">
          <ArrowLeft size={16} /> На главную
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="heading-lg text-[var(--text)] mb-4">{bot.name}</h1>
          <p className="text-[var(--text-muted)] text-lg mb-8">{bot.description}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-display font-bold text-[var(--text)] mb-4">Как работает</h3>
              <div className="space-y-4">
                {bot.howItWorks.map((step: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={16} className="text-[var(--primary)] shrink-0 mt-1" />
                    <div>
                      <div className="text-sm font-medium text-[var(--text)]">{step.title}</div>
                      <div className="text-xs text-[var(--text-muted)]">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-display font-bold text-[var(--text)] mb-4">Доходность</h3>
              <div className="grid grid-cols-3 gap-4">
                {bot.returns.map((r: any, i: number) => (
                  <div key={i} className="text-center">
                    <div className="text-[10px] text-[var(--text-muted)] mb-1">{r.period}</div>
                    <div className="text-2xl font-display font-bold text-[var(--primary)]">{r.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-display font-bold text-[var(--text)] mb-4">Риски</h3>
            <ul className="space-y-2">
              {bot.risks.map((risk: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                  <AlertTriangle size={16} className="text-[var(--danger)] shrink-0 mt-0.5" />
                  {risk}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-display font-bold text-[var(--text)] mb-4">FAQ</h3>
            <div className="space-y-4">
              {bot.faq.map((item: any, i: number) => (
                <div key={i}>
                  <div className="font-medium text-[var(--text)] mb-1">{item.question}</div>
                  <div className="text-sm text-[var(--text-muted)]">{item.answer}</div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary px-8 py-4 rounded-xl text-base">
            Купить {bot.name}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
