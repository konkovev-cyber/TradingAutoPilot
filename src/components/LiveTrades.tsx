import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveTrade {
  id: number;
  pair: string;
  type: 'Long' | 'Short';
  status: 'opened' | 'closed' | 'tp';
  entry: string;
  exit: string;
  pnl: string;
  pnlPositive: boolean;
  time: string;
}

const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'ADA/USDT', 'AVAX/USDT', 'DOT/USDT', 'LINK/USDT', 'MATIC/USDT'];
const statuses: LiveTrade['status'][] = ['opened', 'closed', 'tp'];

function generateTrade(id: number): LiveTrade {
  const pair = pairs[Math.floor(Math.random() * pairs.length)];
  const type: 'Long' | 'Short' = Math.random() > 0.4 ? 'Long' : 'Short';
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const isPositive = Math.random() > 0.25;
  const pnlVal = (Math.random() * 5).toFixed(2);
  const entryVal = (Math.random() * 50000 + 100).toFixed(2);
  const exitVal = status === 'opened' ? '\u2014' : (Math.random() * 50000 + 100).toFixed(2);

  return {
    id,
    pair,
    type,
    status,
    entry: entryVal,
    exit: exitVal,
    pnl: (isPositive ? '+' : '-') + pnlVal + '%',
    pnlPositive: isPositive,
    time: 'just now',
  };
}

export default function LiveTrades() {
  const [trades, setTrades] = useState<LiveTrade[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({ ...generateTrade(i + 1), time: ((i + 1) * 3) + ' min ago' }))
  );
  const [nextId, setNextId] = useState(7);

  const addTrade = useCallback(() => {
    setTrades((prev) => {
      const newTrade = generateTrade(nextId);
      setNextId((n) => n + 1);
      const updated = prev.map((t, i) => ({
        ...t,
        time: i === 0 ? 'just now' : ((i + 1) * 3 + 1) + ' min ago',
      }));
      return [newTrade, ...updated].slice(0, 8);
    });
  }, [nextId]);

  useEffect(() => {
    const interval = setInterval(addTrade, 7000);
    return () => clearInterval(interval);
  }, [addTrade]);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#00D4FF]/5 rounded-full blur-[100px]" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFB2] opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFB2]"></span>
            </span>
            <span className="text-xs text-[#00FFB2] font-semibold tracking-wide">LIVE</span>
            <span className="text-xs text-[#64748B]">Real-time bots</span>
          </div>
          <h2 className="heading-md text-[#F1F5F9] mb-3">Trades right now</h2>
          <p className="text-[#64748B] max-w-xl mx-auto">
            Coinsofter bots execute trades around the clock. New trades appear automatically.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-strong rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto no-scrollbar table-container">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Pair</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Entry</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Exit</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wider">PnL</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {trades.map((trade) => (
                    <motion.tr
                      key={trade.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm font-semibold text-[#F1F5F9]">{trade.pair}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          trade.type === 'Long'
                            ? 'bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/15'
                            : 'bg-[#FF4D6A]/10 text-[#FF4D6A] border border-[#FF4D6A]/15'
                        }`}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          trade.status === 'opened' ? 'text-[#00D4FF]' : trade.status === 'tp' ? 'text-[#00FFB2]' : 'text-[#64748B]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            trade.status === 'opened' ? 'bg-[#00D4FF] animate-pulse' : trade.status === 'tp' ? 'bg-[#00FFB2]' : 'bg-[#64748B]'
                          }`} />
                          {trade.status === 'opened' ? 'Open' : trade.status === 'tp' ? 'TP hit' : 'Closed'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-right text-[#94A3B8] tabular-nums">{trade.entry}</td>
                      <td className="px-5 py-3.5 text-sm text-right text-[#94A3B8] tabular-nums">{trade.exit}</td>
                      <td className={`px-5 py-3.5 text-sm text-right font-semibold tabular-nums ${
                        trade.pnlPositive ? 'text-[#00FFB2]' : 'text-[#FF4D6A]'
                      }`}>
                        {trade.pnl}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#64748B] text-right">{trade.time}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
              <span className="text-xs text-[#64748B]">Auto-updating</span>
            </div>
            <span className="text-xs text-[#64748B]">{trades.length} trades in feed</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
