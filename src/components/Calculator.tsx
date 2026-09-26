import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalcIcon, TrendingUp } from 'lucide-react';

type RiskLevel = 'conservative' | 'medium' | 'aggressive';
type BotType = 'grid-bot' | 'dca-bot' | 'ai-signal-bot';

const botMultipliers: Record<BotType, { min: number; max: number }> = {
  'grid-bot': { min: 0.05, max: 0.09 },
  'dca-bot': { min: 0.03, max: 0.06 },
  'ai-signal-bot': { min: 0.08, max: 0.14 },
};

const riskMultipliers: Record<RiskLevel, number> = {
  conservative: 0.7,
  medium: 1.0,
  aggressive: 1.4,
};

const botLabels: Record<BotType, string> = {
  'grid-bot': 'Grid Bot',
  'dca-bot': 'DCA Bot',
  'ai-signal-bot': 'AI Signal Bot',
};

export default function Calculator() {
  const [deposit, setDeposit] = useState(5000);
  const [bot, setBot] = useState<BotType>('grid-bot');
  const [risk, setRisk] = useState<RiskLevel>('medium');

  const result = useMemo(() => {
    const bm = botMultipliers[bot];
    const rm = riskMultipliers[risk];
    const minProfit = deposit * bm.min * rm;
    const maxProfit = deposit * bm.max * rm;
    return { min: Math.round(minProfit), max: Math.round(maxProfit) };
  }, [deposit, bot, risk]);

  const formatMoney = (n: number) => '$' + n.toLocaleString('ru-RU');

  return (
    <section className="section-padding relative overflow-hidden" id="calculator">
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D4FF]/4 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7B61FF]/4 rounded-full blur-[100px]" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <CalcIcon className="text-[#00FFB2]" size={14} />
            <span className="text-xs text-[#94A3B8] font-medium tracking-wide">PROFIT CALCULATOR</span>
          </div>
          <h2 className="heading-lg text-[#F1F5F9] mb-4">
            Calculate your <span className="text-gradient-primary">profit</span>
          </h2>
          <p className="text-[#64748B] max-w-xl mx-auto">
            Choose amount, bot and risk level  see your 30-day forecast.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong rounded-2xl p-8"
        >
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-[#94A3B8]">Deposit amount</label>
              <span className="text-2xl font-display font-bold text-[#F1F5F9] tabular-nums">{formatMoney(deposit)}</span>
            </div>
            <input
              type="range"
              min={100}
              max={100000}
              step={100}
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #00FFB2 ${((deposit - 100) / 99900) * 100}%, rgba(255,255,255,0.1) ${((deposit - 100) / 99900) * 100}%)` }}
            />
            <div className="flex justify-between mt-2 text-xs text-[#64748B]">
              <span>$100</span>
              <span>$100,000</span>
            </div>
          </div>

          <div className="mb-8">
            <label className="text-sm text-[#94A3B8] mb-3 block">Choose a bot</label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(botLabels) as BotType[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setBot(key)}
                  className={`py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    bot === key ? 'btn-primary shadow-md shadow-[#00FFB2]/15' : 'btn-secondary'
                  }`}
                >
                  {botLabels[key]}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="text-sm text-[#94A3B8] mb-3 block">Risk level</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'conservative' as RiskLevel, label: 'Conservative' },
                { key: 'medium' as RiskLevel, label: 'Medium' },
                { key: 'aggressive' as RiskLevel, label: 'Aggressive' },
              ].map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRisk(r.key)}
                  className={`py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    risk === r.key ? 'btn-primary shadow-md' : 'btn-secondary'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-[#00FFB2]/5 to-[#00D4FF]/5 border border-[#00FFB2]/15 p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-[#00FFB2]" size={18} />
              <span className="text-sm text-[#94A3B8]">30-day profit forecast</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-display font-bold text-[#00FFB2] tabular-nums">{formatMoney(result.min)}</span>
              <span className="text-xl text-[#64748B]"></span>
              <span className="text-3xl font-display font-bold text-[#00D4FF] tabular-nums">{formatMoney(result.max)}</span>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00FFB2] to-[#00D4FF] transition-all duration-500"
                style={{ width: `${Math.min((result.max / (deposit * 0.15)) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-[#64748B]/60 mt-3">
              Forecast is based on historical data. Does not guarantee future returns.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
