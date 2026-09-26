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
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00FFB2]/5 rounded-full blur-[120px]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-4">
            <CalcIcon className="text-[#00FFB2]" size={14} />
            <span className="text-xs text-[#8B95A7]">Калькулятор доходности</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#E6EDF7] mb-4">
            Рассчитайте свою прибыль
          </h2>
          <p className="text-[#8B95A7] max-w-2xl mx-auto">
            Выберите сумму, бота и уровень риска — и увидите прогноз за 30 дней.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-strong rounded-2xl p-8"
        >
          {/* Deposit slider */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-[#8B95A7]">Сумма депозита</label>
              <span className="text-lg font-display font-bold text-[#E6EDF7]">{formatMoney(deposit)}</span>
            </div>
            <input
              type="range"
              min={100}
              max={100000}
              step={100}
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-[#00FFB2]"
              style={{ background: `linear-gradient(to right, #00FFB2 ${((deposit - 100) / 99900) * 100}%, rgba(255,255,255,0.1) ${((deposit - 100) / 99900) * 100}%)` }}
            />
            <div className="flex justify-between mt-2 text-xs text-[#8B95A7]">
              <span>$100</span>
              <span>$100 000</span>
            </div>
          </div>

          {/* Bot selector */}
          <div className="mb-8">
            <label className="text-sm text-[#8B95A7] mb-3 block">Выберите бота</label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(botLabels) as BotType[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setBot(key)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    bot === key
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {botLabels[key]}
                </button>
              ))}
            </div>
          </div>

          {/* Risk selector */}
          <div className="mb-8">
            <label className="text-sm text-[#8B95A7] mb-3 block">Уровень риска</label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { key: 'conservative', label: 'Консервативный' },
                { key: 'medium', label: 'Средний' },
                { key: 'aggressive', label: 'Агрессивный' },
              ] as { key: RiskLevel; label: string }[]).map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRisk(r.key)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    risk === r.key
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          <div className="rounded-xl bg-[#00FFB2]/5 border border-[#00FFB2]/15 p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-[#00FFB2]" size={18} />
              <span className="text-sm text-[#8B95A7]">Прогноз прибыли за 30 дней</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-[#00FFB2]">{formatMoney(result.min)}</span>
              <span className="text-xl text-[#8B95A7]">—</span>
              <span className="text-3xl font-display font-bold text-[#00D4FF]">{formatMoney(result.max)}</span>
            </div>
            <p className="text-xs text-[#8B95A7]/60 mt-4">
              Прогноз основан на исторических данных. Не является гарантией будущей доходности.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
