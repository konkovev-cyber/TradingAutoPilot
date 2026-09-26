import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveTrade {
  id: number;
  pair: string;
  type: 'Long' | 'Short';
  status: 'opened' | 'closed' | 'TP hit';
  entry: string;
  exit: string;
  pnl: string;
  pnlPositive: boolean;
  time: string;
}

const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'ADA/USDT', 'AVAX/USDT', 'DOT/USDT', 'LINK/USDT', 'MATIC/USDT'];
const statuses: LiveTrade['status'][] = ['opened', 'closed', 'TP hit'];

function generateTrade(id: number): LiveTrade {
  const pair = pairs[Math.floor(Math.random() * pairs.length)];
  const type: 'Long' | 'Short' = Math.random() > 0.4 ? 'Long' : 'Short';
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const isPositive = Math.random() > 0.25;
  const pnlVal = (Math.random() * 5).toFixed(2);
  const entryVal = (Math.random() * 50000 + 100).toFixed(2);
  const exitVal = status === 'opened' ? '—' : (Math.random() * 50000 + 100).toFixed(2);

  return {
    id,
    pair,
    type,
    status,
    entry: entryVal,
    exit: exitVal,
    pnl: `${isPositive ? '+' : '-'}${pnlVal}%`,
    pnlPositive: isPositive,
    time: 'только что',
  };
}

function generateInitialTrades(): LiveTrade[] {
  return Array.from({ length: 8 }, (_, i) => ({
    ...generateTrade(i + 1),
    time: `${(i + 1) * 3} мин назад`,
  }));
}

export default function LiveTrades() {
  const [trades, setTrades] = useState<LiveTrade[]>(generateInitialTrades);
  const [nextId, setNextId] = useState(9);

  const addTrade = useCallback(() => {
    setTrades((prev) => {
      const newTrade = generateTrade(nextId);
      setNextId((n) => n + 1);
      // Update existing trades' time labels
      const updated = prev.map((t, i) => ({
        ...t,
        time: `${(i + 1) * 3 + 1} мин назад`,
      }));
      return [newTrade, ...updated].slice(0, 8);
    });
  }, [nextId]);

  useEffect(() => {
    const interval = setInterval(addTrade, 6000);
    return () => clearInterval(interval);
  }, [addTrade]);

  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse-glow" />
            <span className="text-xs text-[#00FFB2] font-medium">LIVE</span>
            <span className="text-xs text-[#8B95A7]">Боты в реальном времени</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#E6EDF7] mb-4">
            Сделки прямо сейчас
          </h2>
          <p className="text-[#8B95A7] max-w-2xl mx-auto">
            Боты Coinsofter исполняют сделки круглосуточно. Новые сделки появляются автоматически.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">Пара</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">Тип</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">Статус</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">Вход</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">Выход</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">PnL</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-[#8B95A7] uppercase tracking-wider">Время</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {trades.map((trade) => (
                    <motion.tr
                      key={trade.id}
                      layout
                      initial={{ opacity: 0, height: 0, backgroundColor: 'rgba(0, 255, 178, 0.08)' }}
                      animate={{ opacity: 1, height: 'auto', backgroundColor: 'rgba(0, 0, 0, 0)' }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#E6EDF7]">{trade.pair}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          trade.type === 'Long'
                            ? 'bg-[#00FFB2]/10 text-[#00FFB2]'
                            : 'bg-[#FF4D6A]/10 text-[#FF4D6A]'
                        }`}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs ${
                          trade.status === 'opened' ? 'text-[#00D4FF]' : trade.status === 'TP hit' ? 'text-[#00FFB2]' : 'text-[#8B95A7]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            trade.status === 'opened' ? 'bg-[#00D4FF] animate-pulse-glow' : trade.status === 'TP hit' ? 'bg-[#00FFB2]' : 'bg-[#8B95A7]'
                          }`} />
                          {trade.status === 'opened' ? 'Открыта' : trade.status === 'TP hit' ? 'TP hit' : 'Закрыта'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-[#8B95A7] tabular-nums">{trade.entry}</td>
                      <td className="px-6 py-4 text-sm text-right text-[#8B95A7] tabular-nums">{trade.exit}</td>
                      <td className={`px-6 py-4 text-sm text-right font-medium tabular-nums ${
                        trade.pnlPositive ? 'text-[#00FFB2]' : 'text-[#FF4D6A]'
                      }`}>
                        {trade.pnl}
                      </td>
                      <td className="px-6 py-4 text-xs text-right text-[#8B95A7]">{trade.time}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
