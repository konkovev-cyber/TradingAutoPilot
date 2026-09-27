import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Compact market row - clean premium look
function MarketRow({ symbol, type, change, sparkline }: { symbol: string; type: string; change: string; sparkline: number[] }) {
  const isPositive = change.startsWith("+");
  const color = isPositive ? "text-[#10B981]" : "text-[#EF4444]";
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-3 rounded transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-[11px] font-bold text-white/90">
          {symbol.slice(0, 2)}
        </div>
        <div>
          <div className="text-white text-sm font-semibold leading-none">{symbol}</div>
          <div className={`text-[10px] font-medium mt-1 ${isPositive ? "text-[#10B981]" : "text-[#EF4444]"}`}>{type}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Sparkline */}
        <svg width="56" height="24" className="opacity-60">
          <polyline
            points={sparkline.map((v, i) => `${(i / (sparkline.length - 1)) * 56},${24 - v * 20}`).join(" ")}
            fill="none"
            stroke={isPositive ? "#10B981" : "#EF4444"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className={`text-sm font-semibold ${color} w-16 text-right`}>{change}</div>
      </div>
    </div>
  );
}

// Readable process flow - vertical with clear steps
function ProcessFlow() {
  const steps = [
    { label: "MARKET DATA", sub: "Анализ рынка" },
    { label: "DEVIATION", sub: "Поиск отклонений" },
    { label: "LIMIT ORDER", sub: "Размещение ордера" },
    { label: "POSITION", sub: "Управление позицией" },
  ];
  
  return (
    <div className="mt-6 flex flex-col gap-2">
      <div className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mb-1">Process</div>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] text-[10px] font-bold">
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-px h-4 bg-[#10B981]/30"></div>}
          </div>
          <div className="flex-1 py-2 px-3 rounded-lg bg-white/5 border border-white/5">
            <div className="text-white text-xs font-semibold">{step.label}</div>
            <div className="text-slate-400 text-[10px]">{step.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TradingEngine() {
  const [status, setStatus] = useState("Scanning...");
  
  useEffect(() => {
    const statuses = ["Scanning market...", "Recalculating levels...", "Monitoring positions..."];
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
      style={{ maxWidth: "680px" }}
    >
      {/* Main panel */}
      <div className="bg-[#07131D] dark:bg-[#0A1520] rounded-[22px] border border-white/10 dark:border-white/15 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg shadow-[#10B981]/20">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <div>
              <div className="text-white font-bold text-[14px] leading-none">CryptoSuperStock</div>
              <div className="text-slate-500 text-[10px] font-medium mt-0.5">AUTONOMOUS TRADING ENGINE</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/25">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
              </span>
              <span className="text-[#10B981] text-xs font-semibold">ACTIVE</span>
            </div>
            <span className="text-slate-400 text-xs">24/7</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="grid grid-cols-[1fr_160px] gap-6">
            {/* Markets list */}
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3">Active Markets</div>
              <div className="space-y-0">
                {markets.map((m, i) => (
                  <MarketRow key={i} {...m} />
                ))}
              </div>
            </div>
            
            {/* Engine core + Process */}
            <div className="flex flex-col">
              {/* Engine core */}
              <div className="relative flex items-center justify-center h-[140px] rounded-xl bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/20">
                <div className="absolute inset-0 rounded-xl bg-[#10B981]/5 animate-pulse"></div>
                <div className="text-center">
                  <div className="text-[#10B981] text-[10px] font-bold tracking-widest uppercase mb-2">ENGINE</div>
                  <div className="text-white text-3xl font-bold leading-none">CS</div>
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
                    </span>
                    <span className="text-[#10B981] text-[10px] font-semibold">ACTIVE</span>
                  </div>
                </div>
              </div>
              
              {/* Process flow */}
              <ProcessFlow />
            </div>
          </div>
          
          {/* Status bar */}
          <div className="mt-4 px-4 py-2.5 rounded-lg bg-[#10B981]/5 border border-[#10B981]/15 flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
            </span>
            <span className="text-[#10B981] text-xs font-medium">{status}</span>
          </div>
        </div>
      </div>
      
      {/* Background glow */}
      <div 
        className="absolute -inset-8 -z-10 opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle at 65% 50%, rgba(16, 185, 129, 0.12) 0%, transparent 55%)" }}
      />
    </motion.div>
  );
}