import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Compact market row
function MarketRow({ symbol, type, change, sparkline }: { symbol: string; type: string; change: string; sparkline: number[] }) {
  const isPositive = change.startsWith("+");
  const color = isPositive ? "text-[#10B981]" : "text-[#EF4444]";
  const dotColor = isPositive ? "#10B981" : "#EF4444";
  
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-2 rounded transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/80">
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
    { icon: "M", label: "DATA", sub: "Анализ" },
    { icon: "D", label: "DEV", sub: "Поиск" },
    { icon: "L", label: "ORDER", sub: "Ордер" },
    { icon: "P", label: "POS", sub: "Позиция" },
    { icon: "N", label: "NORM", sub: "Баланс" },
  ];
  
  return (
    <div className="flex gap-1.5 mt-4">
      {steps.map((step, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="w-6 h-6 rounded-full bg-[#10B981]/15 border border-[#10B981]/25 flex items-center justify-center text-[#10B981] text-[8px] font-bold group-hover:bg-[#10B981]/25 transition-colors">
            {step.icon}
          </div>
          <div className="text-[7px] font-semibold text-slate-400 uppercase tracking-wide text-center leading-tight">{step.label}</div>
          <div className="text-[7px] text-slate-500">{step.sub}</div>
          {i < steps.length - 1 && <div className="h-px w-px bg-[#10B981]/20 mt-1 mb-[-4px]"></div>}
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
      style={{ maxWidth: "600px" }}
    >
      {/* Main panel - slightly lighter for dark mode visibility */}
      <div className="bg-[#0C1A2A] dark:bg-[#0A1520] rounded-[20px] border border-white/10 dark:border-white/15 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
              <span className="text-white font-bold text-[9px]">CS</span>
            </div>
            <div>
              <div className="text-white font-bold text-[12px] leading-none">CryptoSuperStock</div>
              <div className="text-slate-500 text-[8px] font-medium mt-0.5">AUTONOMOUS TRADING</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
              </span>
              <span className="text-[#10B981] text-[9px] font-semibold">ACTIVE</span>
            </div>
            <span className="text-slate-500 text-[9px]">24/7</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-3.5">
          <div className="grid grid-cols-[1fr_110px] gap-3">
            {/* Markets list */}
            <div>
              <div className="text-[8px] uppercase tracking-widest text-slate-500 font-semibold mb-2">Markets</div>
              <div className="space-y-0">
                {markets.map((m, i) => (
                  <MarketRow key={i} {...m} />
                ))}
              </div>
            </div>
            
            {/* Engine core */}
            <div className="flex flex-col items-center justify-center py-1">
              <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#059669]/10 border border-[#10B981]/30 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <div className="absolute inset-0 rounded-xl bg-[#10B981]/5 animate-pulse"></div>
                <div className="text-[#10B981] text-[6px] font-bold tracking-widest uppercase">ENGINE</div>
                <div className="text-white text-sm font-bold leading-none">CS</div>
              </div>
              
              {/* Process flow */}
              <ProcessFlow />
            </div>
          </div>
          
          {/* Status bar */}
          <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-[#10B981]/5 border border-[#10B981]/12 flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
            </span>
            <span className="text-[#10B981] text-[9px] font-medium">{status}</span>
          </div>
        </div>
      </div>
      
      {/* Background glow - adjusted for dark mode */}
      <div 
        className="absolute -inset-6 -z-10 opacity-20 dark:opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle at 65% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 55%)" }}
      />
    </motion.div>
  );
}