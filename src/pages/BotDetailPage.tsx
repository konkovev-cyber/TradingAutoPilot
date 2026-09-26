import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, AlertTriangle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { getBot } from '@/data/bots';
import GridVisual from '@/components/GridVisual';
import DcaVisual from '@/components/DcaVisual';
import AiSignalVisual from '@/components/AiSignalVisual';

const colorMap = {
  primary: { text: 'text-[#00FFB2]', bg: 'bg-[#00FFB2]/10', border: 'border-[#00FFB2]/20', btn: 'btn-primary' },
  secondary: { text: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10', border: 'border-[#00D4FF]/20', btn: 'btn-secondary' },
  accent: { text: 'text-[#7B61FF]', bg: 'bg-[#7B61FF]/10', border: 'border-[#7B61FF]/20', btn: 'btn-secondary' },
};

function BotVisual({ slug, color }: { slug: string; color: 'primary' | 'secondary' | 'accent' }) {
  if (slug === 'grid-bot') return <GridVisual color={color} />;
  if (slug === 'dca-bot') return <DcaVisual color={color} />;
  return <AiSignalVisual color={color} />;
}

export default function BotDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const bot = slug ? getBot(slug) : undefined;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!bot) return <Navigate to="/" replace />;

  const colors = colorMap[bot.color];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className={`absolute top-0 left-1/4 w-96 h-96 ${colors.bg} rounded-full blur-[120px] opacity-30`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#8B95A7] hover:text-[#E6EDF7] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Назад
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`inline-flex items-center px-3 py-1 rounded-full ${colors.bg} ${colors.border} border mb-4`}>
                <span className={`text-xs font-medium ${colors.text}`}>{bot.tag}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#E6EDF7] mb-4">
                {bot.name}
              </h1>
              <p className="text-lg text-[#8B95A7] mb-6">{bot.description}</p>
              <div className={`text-base font-medium ${colors.text} mb-8`}>
                {bot.benefit}
              </div>
              <button className={`${colors.btn} px-8 py-4 rounded-xl text-base inline-flex items-center gap-2`}>
                Запустить {bot.name} бесплатно
                <ArrowRight size={20} />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-strong rounded-2xl p-6 h-64"
            >
              <BotVisual slug={bot.slug} color={bot.color} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#E6EDF7] mb-12 text-center">
            Как работает {bot.name}
          </h2>
          <div className="space-y-6">
            {bot.howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-5"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl glass flex items-center justify-center text-lg font-display font-bold text-[#00FFB2]">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-[#E6EDF7] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#8B95A7]">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parameters */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#E6EDF7] mb-12 text-center">
            Параметры настройки
          </h2>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">Параметр</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">Значение</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">Описание</th>
                  </tr>
                </thead>
                <tbody>
                  {bot.parameters.map((param, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      <td className="px-6 py-4 text-sm font-medium text-[#E6EDF7]">{param.name}</td>
                      <td className={`px-6 py-4 text-sm ${colors.text} font-semibold`}>{param.value}</td>
                      <td className="px-6 py-4 text-sm text-[#8B95A7]">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Trade examples */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#E6EDF7] mb-12 text-center">
            Примеры сделок
          </h2>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">Дата</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">Пара</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">Вход</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">Выход</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">PnL</th>
                  </tr>
                </thead>
                <tbody>
                  {bot.trades.map((trade, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-[#8B95A7]">{trade.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-[#E6EDF7]">{trade.pair}</td>
                      <td className="px-6 py-4 text-sm text-right text-[#8B95A7]">{trade.entry}</td>
                      <td className="px-6 py-4 text-sm text-right text-[#8B95A7]">{trade.exit}</td>
                      <td className={`px-6 py-4 text-sm text-right font-medium ${trade.pnlPositive ? 'text-[#00FFB2]' : 'text-[#FF4D6A]'}`}>
                        {trade.pnl}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Returns */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#E6EDF7] mb-12 text-center">
            Доходность
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {bot.returns.map((ret, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass rounded-2xl p-8 text-center card-hover"
              >
                <div className="text-sm text-[#8B95A7] mb-2">{ret.period}</div>
                <div className={`text-3xl font-display font-bold ${colors.text}`}>
                  {ret.value}
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-[#8B95A7]/60 text-center mt-6 max-w-2xl mx-auto">
            * Результаты основаны на исторических данных и не гарантируют будущую
            доходность.
          </p>
        </div>
      </section>

      {/* Risks */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-8 border-[#FF4D6A]/20">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="text-[#FF4D6A]" size={22} />
              <h2 className="text-xl font-display font-bold text-[#E6EDF7]">
                Риски и рекомендации
              </h2>
            </div>
            <ul className="space-y-3">
              {bot.risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#8B95A7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6A] shrink-0 mt-1.5" />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#E6EDF7] mb-8 text-center">
            FAQ по {bot.name}
          </h2>
          <div className="space-y-3">
            {bot.faq.map((item, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-sm font-medium text-[#E6EDF7] pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-[#8B95A7] shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-[#8B95A7] leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-strong rounded-3xl p-10 relative overflow-hidden">
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 ${colors.bg} rounded-full blur-[80px] opacity-30`} />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#E6EDF7] mb-4">
                Запустите {bot.name} бесплатно
              </h2>
              <p className="text-[#8B95A7] mb-6">
                Без вложений. Комиссия только с прибыли. Подключение за 2 минуты.
              </p>
              <button className={`${colors.btn} px-8 py-4 rounded-xl text-base inline-flex items-center gap-2`}>
                Создать бота бесплатно
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
