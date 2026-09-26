import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

const trades = [
  { pair: 'BTC/USDT', type: 'Long', pnl: '+1.40%', positive: true, time: '2 мин назад' },
  { pair: 'ETH/USDT', type: 'Long', pnl: '+2.08%', positive: true, time: '5 мин назад' },
  { pair: 'SOL/USDT', type: 'Short', pnl: '+0.40%', positive: true, time: '12 мин назад' },
  { pair: 'BNB/USDT', type: 'Long', pnl: '+0.82%', positive: true, time: '15 мин назад' },
  { pair: 'XRP/USDT', type: 'Long', pnl: '+1.29%', positive: true, time: '22 мин назад' },
  { pair: 'ADA/USDT', type: 'Short', pnl: '-0.66%', positive: false, time: '28 мин назад' },
];

export default function LiveTrades() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-40"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span></span>
            <span className="text-xs text-[var(--text-muted)] font-medium">LIVE</span>
          </div>
          <h2 className="heading-lg text-[var(--text)] mb-4">Сделки прямо сейчас</h2>
          <p className="text-[var(--text-muted)] text-lg">Боты исполняют сделки круглосуточно</p>
        </motion.div>

        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-[var(--border)] text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
            <div>Пара</div>
            <div>Тип</div>
            <div>PnL</div>
            <div className="col-span-2">Время</div>
          </div>
          {trades.map((trade, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.05 }} className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-[var(--border)] last:border-0 items-center hover:bg-[var(--white-5)] transition-colors">
              <div className="font-medium text-[var(--text)]">{trade.pair}</div>
              <div className="flex items-center gap-1">
                {trade.type === 'Long' ? <ArrowUpRight size={14} className="text-[var(--primary)]" /> : <ArrowDownRight size={14} className="text-[var(--danger)]" />}
                <span className="text-sm text-[var(--text-muted)]">{trade.type}</span>
              </div>
              <div className={`font-semibold ${trade.positive ? 'text-[var(--primary)]' : 'text-[var(--danger)]'}`}>{trade.pnl}</div>
              <div className="col-span-2 flex items-center gap-2 text-sm text-[var(--text-subtle)]"><Clock size={14} />{trade.time}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
