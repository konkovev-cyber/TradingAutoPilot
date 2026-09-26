import { useEffect, useState } from 'react';
import CandlestickChart from './CandlestickChart';
import { motion } from 'framer-motion';

interface DashboardProps {
  className?: string;
}

export default function LiveDashboard({ className = '' }: DashboardProps) {
  const [profit, setProfit] = useState(247.83);
  const [pnl, setPnl] = useState(12.4);
  const [dealCount, setDealCount] = useState(12);
  const [lastTrade, setLastTrade] = useState<{ pair: string; pnl: string; positive: boolean } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProfit((p) => p + Math.random() * 0.85);
      setPnl((v) => +(v + (Math.random() - 0.4) * 0.3).toFixed(2));
      if (Math.random() > 0.7) {
        setDealCount((d) => d + 1);
      }
      if (Math.random() > 0.5) {
        const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT'];
        const isPositive = Math.random() > 0.3;
        setLastTrade({
          pair: pairs[Math.floor(Math.random() * pairs.length)],
          pnl: (isPositive ? '+' : '-') + (Math.random() * 3).toFixed(2) + '%',
          positive: isPositive,
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className={`glass-strong rounded-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-[#00FFB2]" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#00FFB2] animate-ping opacity-40" />
          </div>
          <span className="text-xs text-[#94A3B8] font-medium tracking-wide">BTC/USDT  Grid Bot</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#00FFB2]/8 border border-[#00FFB2]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
          <span className="text-[10px] text-[#00FFB2] font-bold tracking-widest">LIVE</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-end gap-3 mb-4">
          <div>
            <div className="text-[11px] text-[#64748B] mb-0.5">Profit today</div>
            <div className="text-3xl font-display font-bold text-[#00FFB2] tabular-nums tracking-tight">
              ${profit.toFixed(2)}
            </div>
          </div>
          <div className="mb-1.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00FFB2]/8 border border-[#00FFB2]/15">
            <svg width="8" height="8" viewBox="0 0 8 8" className="text-[#00FFB2]">
              <path d="M4 0L8 8H0L4 0Z" fill="currentColor" />
            </svg>
            <span className="text-xs text-[#00FFB2] font-semibold tabular-nums">{pnl.toFixed(2)}%</span>
            <span className="text-[10px] text-[#64748B]">24h</span>
          </div>
        </div>

        <div className="h-36 mb-4 rounded-xl overflow-hidden bg-[#050A14]/60 border border-white/5">
          <CandlestickChart />
        </div>

        {lastTrade && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[#00FFB2]/5 border border-[#00FFB2]/10"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
            <span className="text-[11px] text-[#94A3B8]">
              <span className={`font-semibold ${lastTrade.positive ? 'text-[#00FFB2]' : 'text-[#FF4D6A]'}`}>
                {lastTrade.pair}
              </span>
              {'  '}
              <span className={`font-medium tabular-nums ${lastTrade.positive ? 'text-[#00FFB2]' : 'text-[#FF4D6A]'}`}>
                {lastTrade.pnl}
              </span>
            </span>
          </motion.div>
        )}

        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse-glow" />
          <span className="text-[11px] text-[#64748B]">
            <span className="text-[#00D4FF] font-semibold tabular-nums">{dealCount}</span> deals in the last hour
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
          {[
            { label: 'Deals', value: '847', color: '#F1F5F9' },
            { label: 'Win Rate', value: '78.3%', color: '#00FFB2' },
            { label: 'Uptime', value: '99.9%', color: '#F1F5F9' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[10px] text-[#64748B] mb-0.5">{stat.label}</div>
              <div className="text-sm font-semibold tabular-nums" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
