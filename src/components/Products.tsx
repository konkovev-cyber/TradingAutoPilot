import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Rocket, Sparkles, TrendingUp } from 'lucide-react';
import { bots } from '@/data/bots';
import GridVisual from './GridVisual';
import DcaVisual from './DcaVisual';
import AiSignalVisual from './AiSignalVisual';

const colorClasses = {
  primary: { text: 'text-[#00FFB2]', bg: 'bg-[#00FFB2]/8', border: 'border-[#00FFB2]/20', hex: '#00FFB2' },
  secondary: { text: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/8', border: 'border-[#00D4FF]/20', hex: '#00D4FF' },
  accent: { text: 'text-[#7B61FF]', bg: 'bg-[#7B61FF]/8', border: 'border-[#7B61FF]/20', hex: '#7B61FF' },
};

function BotVisual({ slug, color }: { slug: string; color: 'primary' | 'secondary' | 'accent' }) {
  if (slug === 'grid-bot') return <GridVisual color={color} />;
  if (slug === 'dca-bot') return <DcaVisual color={color} />;
  return <AiSignalVisual color={color} />;
}

function MiniYieldChart({ color }: { color: string }) {
  const bars = [35, 50, 45, 60, 68, 55, 72, 80, 65, 88, 95, 82];
  return (
    <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 16 + 2}
          y={60 - h * 0.55}
          width="12"
          height={h * 0.55}
          fill={color}
          opacity={0.25 + (i / bars.length) * 0.6}
          rx="1.5"
        />
      ))}
    </svg>
  );
}

export default function Products() {
  return (
    <section id="products" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-60" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00FFB2]/3 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#7B61FF]/3 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles size={12} className="text-[#00FFB2]" />
            <span className="text-xs text-[#94A3B8] font-medium tracking-wide">OUR PRODUCTS</span>
          </div>
          <h2 className="heading-lg text-[#F1F5F9] mb-4">
            Three bots for <span className="text-gradient-primary">any market</span>
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg leading-relaxed">
            Choose a strategy that fits your trading style. Each bot can be launched in a couple of minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bots.map((bot, i) => {
            const colors = colorClasses[bot.color];
            const yield30 = bot.returns[0].value;
            return (
              <motion.div
                key={bot.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
                className="glass-card card-hover group flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FFB2]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="h-36 mb-5 rounded-xl overflow-hidden bg-[#050A14]/70 border border-white/5 relative">
                  <BotVisual slug={bot.slug} color={bot.color} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050A14]/40 to-transparent" />
                </div>

                <div className={`inline-flex items-center px-3 py-1 rounded-full ${colors.bg} ${colors.border} border mb-4 w-fit`}>
                  <span className={`text-xs font-medium ${colors.text}`}>{bot.tag}</span>
                </div>

                <h3 className="text-xl font-display font-bold text-[#F1F5F9] mb-2">
                  {bot.name}
                </h3>
                <p className="text-sm text-[#94A3B8] mb-5 leading-relaxed flex-grow">
                  {bot.description}
                </p>

                <div className="flex items-center justify-between mb-5 px-4 py-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <div className="text-[10px] text-[#64748B] mb-0.5">30-day yield</div>
                    <div className={`text-xl font-display font-bold ${colors.text}`}>{yield30}</div>
                  </div>
                  <div className="w-28 h-10 opacity-70">
                    <MiniYieldChart color={colors.hex} />
                  </div>
                </div>

                <div className={`text-sm font-medium ${colors.text} mb-5 flex items-center gap-1.5`}>
                  <TrendingUp size={14} />
                  {bot.benefit}
                </div>

                <div className="mt-auto flex gap-3">
                  <Link
                    to={`/bots/${bot.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium py-3 rounded-xl btn-secondary group-hover:gap-2.5 transition-all"
                  >
                    Details
                    <ArrowRight size={14} className="transition-all" />
                  </Link>
                  <button className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold py-3 rounded-xl btn-primary">
                    <Rocket size={14} />
                    Launch
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
