import { useEffect, useState } from 'react';
import CandlestickChart from './CandlestickChart';

interface DashboardProps {
  className?: string;
}

export default function LiveDashboard({ className = '' }: DashboardProps) {
  const [profit, setProfit] = useState(247.83);
  const [pnl, setPnl] = useState(12.4);
  const [dealCount, setDealCount] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setProfit((p) => p + Math.random() * 0.85);
      setPnl((v) => +(v + (Math.random() - 0.4) * 0.3).toFixed(2));
      if (Math.random() > 0.7) {
        setDealCount((d) => d + 1);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`glass-strong rounded-2xl p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse-glow" />
          <span className="text-xs text-[#8B95A7] font-medium">BTC/USDT · Grid Bot</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00FFB2]/10 border border-[#00FFB2]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse-glow" />
          <span className="text-[10px] text-[#00FFB2] font-semibold tracking-wide">LIVE</span>
        </div>
      </div>

      {/* Profit counter */}
      <div className="mb-4">
        <div className="text-xs text-[#8B95A7] mb-1">Прибыль за сегодня</div>
        <div className="text-3xl font-display font-bold text-[#00FFB2] tabular-nums">
          ${profit.toFixed(2)}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-[#00FFB2] font-medium">▲ {pnl.toFixed(2)}%</span>
          <span className="text-xs text-[#8B95A7]">за 24ч</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-32 mb-4 rounded-lg overflow-hidden bg-[#0A0E17]/30">
        <CandlestickChart />
      </div>

      {/* Deal pulse badge */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[#00FFB2]/5 border border-[#00FFB2]/10">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse-glow" />
        <span className="text-xs text-[#8B95A7]">
          <span className="text-[#00FFB2] font-semibold tabular-nums">{dealCount}</span> сделок за последний час
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
        <div>
          <div className="text-[10px] text-[#8B95A7]">Сделок</div>
          <div className="text-sm font-semibold text-[#E6EDF7] tabular-nums">847</div>
        </div>
        <div>
          <div className="text-[10px] text-[#8B95A7]">Win Rate</div>
          <div className="text-sm font-semibold text-[#00FFB2]">78.3%</div>
        </div>
        <div>
          <div className="text-[10px] text-[#8B95A7]">Аптайм</div>
          <div className="text-sm font-semibold text-[#E6EDF7]">99.9%</div>
        </div>
      </div>
    </div>
  );
}
