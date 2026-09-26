import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Rocket } from 'lucide-react';
import { bots } from '@/data/bots';
import GridVisual from './GridVisual';
import DcaVisual from './DcaVisual';
import AiSignalVisual from './AiSignalVisual';

const colorClasses = {
  primary: { text: 'text-[#00FFB2]', bg: 'bg-[#00FFB2]/10', border: 'border-[#00FFB2]/20', btn: 'btn-primary', hex: '#00FFB2' },
  secondary: { text: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10', border: 'border-[#00D4FF]/20', btn: 'btn-secondary', hex: '#00D4FF' },
  accent: { text: 'text-[#7B61FF]', bg: 'bg-[#7B61FF]/10', border: 'border-[#7B61FF]/20', btn: 'btn-secondary', hex: '#7B61FF' },
};

function BotVisual({ slug, color }: { slug: string; color: 'primary' | 'secondary' | 'accent' }) {
  if (slug === 'grid-bot') return <GridVisual color={color} />;
  if (slug === 'dca-bot') return <DcaVisual color={color} />;
  return <AiSignalVisual color={color} />;
}

function MiniYieldChart({ color }: { color: string }) {
  const bars = [40, 55, 48, 62, 70, 58, 75, 82, 68, 90];
  return (
    <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 20 + 2}
          y={60 - h * 0.5}
          width="14"
          height={h * 0.5}
          fill={color}
          opacity={i === bars.length - 1 ? 0.9 : 0.4}
          rx="1"
        />
      ))}
    </svg>
  );
}

export default function Products() {
  return (
    <section id="products" className="section-padding relative">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-4">
            <span className="text-xs text-[#8B95A7]">Наши продукты</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#E6EDF7] mb-4">
            Три бота под любой рынок
          </h2>
          <p className="text-[#8B95A7] max-w-2xl mx-auto text-lg">
            Выберите стратегию, которая подходит вашему стилю торговли. Каждый бот
            можно запустить за пару минут.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bots.map((bot, i) => {
            const colors = colorClasses[bot.color];
            const yield30 = bot.returns[0].value;
            return (
              <motion.div
                key={bot.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-6 card-hover group flex flex-col"
              >
                {/* Visual */}
                <div className="h-32 mb-5 rounded-xl overflow-hidden bg-[#0A0E17]/50 border border-white/5">
                  <BotVisual slug={bot.slug} color={bot.color} />
                </div>

                {/* Tag */}
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full ${colors.bg} ${colors.border} border mb-3 w-fit`}>
                  <span className={`text-xs font-medium ${colors.text}`}>{bot.tag}</span>
                </div>

                <h3 className="text-xl font-display font-bold text-[#E6EDF7] mb-2">
                  {bot.name}
                </h3>
                <p className="text-sm text-[#8B95A7] mb-4 leading-relaxed">
                  {bot.description}
                </p>

                {/* Yield + mini chart */}
                <div className="flex items-center justify-between mb-5 px-3 py-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <div className="text-[10px] text-[#8B95A7] mb-0.5">Доходность за 30 дней</div>
                    <div className={`text-lg font-display font-bold ${colors.text}`}>{yield30}</div>
                  </div>
                  <div className="w-24 h-10">
                    <MiniYieldChart color={colors.hex} />
                  </div>
                </div>

                <div className={`text-sm font-medium ${colors.text} mb-5`}>
                  {bot.benefit}
                </div>

                {/* Dual buttons */}
                <div className="mt-auto flex gap-3">
                  <Link
                    to={`/bots/${bot.slug}`}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium py-2.5 rounded-xl btn-secondary group-hover:gap-2.5 transition-all`}
                  >
                    Подробнее
                    <ArrowRight size={16} />
                  </Link>
                  <button className={`flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl ${colors.btn}`}>
                    <Rocket size={16} />
                    Запустить
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
