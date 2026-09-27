import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Compact market row
function MarketRow({ symbol, type, change, sparkline }: { symbol: string; type: string; change: string; sparkline: number[] }) {
  const isPositive = change.startsWith("+");
  const color = isPositive ? "text-[#10B981]" : "text-[#EF4444]";
  const dotColor = isPositive ? "#10B981" : "#EF4444";
  
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 hover:bg-white/[0.03] px-2 rounded transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
          {symbol.slice(0, 2)}
        </div>
        <div>
          <div className="text-white text-xs font-semibold leading-none">{symbol}</div>
          <div className={`text-[9px] font-medium mt-0.5 ${isPositive ? "text-[#10B981]" : "text-[#EF4444]"}`}>{type}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <svg width="48" height="20" className="opacity-50">
          <polyline
            points={sparkline.map((v, i) => `${(i / (sparkline.length - 1)) * 48},${20 - v * 16}`).join(" ")}
            fill="none"
            stroke={dotColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className={`text-xs font-semibold ${color} w-14 text-right`}>{change}</div>
      </div>
    </div>
  );
}

// Process steps - compact vertical flow
function ProcessFlow() {
  const steps = [
    { icon: "M", label: "MARKET DATA", sub: "Анализ" },
    { icon: "D", label: "DEVIATION", sub: "Поиск" },
    { icon: "L", label: "LIMIT ORDER", sub: "Ордер" },
    { icon: "P", label: "POSITION", sub: "Позиция" },
    { icon: "N", label: "NORMALIZATION", sub: "Баланс" },
  ];
  
  return (
    <div className="flex gap-2 mt-4">
      {steps.map((step, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
          <div className="w-7 h-7 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] text-[9px] font-bold group-hover:bg-[#10B981]/25 transition-colors">
            {step.icon}
          </div>
          {i < steps.length - 1 && <div className="h-px flex-1 w-px bg-[#10B981]/20 mx-auto -mt-3 mb-1"></div>}
          <div className="text-[8px] font-semibold text-slate-400 uppercase tracking-wide text-center leading-tight">{step.label}</div>
          <div className="text-[8px] text-slate-500">{step.sub}</div>
        </div>
      ))}
    </div>
  );
}

export function TradingEngine() {
  const [status, setStatus] = useState("Scanning...");
  
  useEffect(() => {
    const statuses = ["Scanning market...", "Recalculating...", "Monitoring..."];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % statuses.length;
      setStatus(statuses[i]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);
  
  const markets = [
    { symbol: "BTCUSDT", type: "CRYPTO", change: "+2.41%", sparkline: [0.4, 0.6, 0.5, 0.7, 0.8, 0.7, 0.9] },
    { symbol: "ETHUSDT", type: "CRYPTO", change: "+3.17%", sparkline: [0.3, 0.5, 0.6, 0.5, 0.7, 0.8, 0.9] },
    { symbol: "NVDA", type: "STOCK", change: "+1.82%", sparkline: [0.5, 0.4, 0.6, 0.7, 0.6, 0.8, 0.9] },
    { symbol: "AMD", type: "STOCK", change: "+2.04%", sparkline: [0.3, 0.4, 0.3, 0.5, 0.6, 0.5, 0.7] },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative mx-auto"
      style={{ maxWidth: "620px" }}
    >
      {/* Main panel */}
      <div className="bg-[#07131D] rounded-[22px] border border-white/[0.08] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">CS</span>
            </div>
            <div>
              <div className="text-white font-bold text-[13px] leading-none">CryptoSuperStock</div>
              <div className="text-slate-500 text-[9px] font-medium mt-0.5">AUTONOMOUS TRADING</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/25">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
              </span>
              <span className="text-[#10B981] text-[10px] font-semibold">ACTIVE</span>
            </div>
            <span className="text-slate-500 text-[10px]">24/7</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="grid grid-cols-[1fr_120px] gap-4">
            {/* Markets list */}
            <div>
              <div className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mb-2.5">Markets</div>
              <div className="space-y-0.5">
                {markets.map((m, i) => (
                  <MarketRow key={i} {...m} />
                ))}
              </div>
            </div>
            
            {/* Engine core */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#059669]/10 border border-[#10B981]/30 flex flex-col items-center justify-center">
                <div className="absolute inset-0 rounded-xl bg-[#10B981]/5 animate-pulse"></div>
                <div className="text-[#10B981] text-[7px] font-bold tracking-widest uppercase">ENGINE</div>
                <div className="text-white text-base font-bold leading-none">CS</div>
              </div>
              
              {/* Process flow below engine */}
              <ProcessFlow />
            </div>
          </div>
          
          {/* Status bar */}
          <div className="mt-3 px-3 py-2 rounded-lg bg-[#10B981]/5 border border-[#10B981]/15 flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
            </span>
            <span className="text-[#10B981] text-[10px] font-medium">{status}</span>
          </div>
        </div>
      </div>
      
      {/* Background glow */}
      <div 
        className="absolute -inset-8 -z-10 opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle at 65% 50%, rgba(16, 185, 129, 0.12) 0%, transparent 55%)" }}
      />
    </motion.div>
  );
}