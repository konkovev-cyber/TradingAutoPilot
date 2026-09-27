import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";

// Market data row with sparkline
function MarketCard({ symbol, price, change, sparkline }: { symbol: string; price: string; change: string; sparkline: number[] }) {
  const isPositive = change.startsWith("+");
  const color = isPositive ? "text-[#10B981]" : "text-[#EF4444]";
  const bgColor = isPositive ? "bg-[#10B981]/10" : "bg-[#EF4444]/10";
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-3 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center text-xs font-bold ${color}`}>
          {symbol.slice(0, 2)}
        </div>
        <div>
          <div className="text-white font-semibold text-sm">{symbol}</div>
          <div className="text-[11px] text-slate-400">Crypto / Stock</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Sparkline */}
        <svg width="60" height="24" className="opacity-60">
          <polyline
            points={sparkline.map((v, i) => `${(i / (sparkline.length - 1)) * 60},${24 - v * 20}`).join(" ")}
            fill="none"
            stroke={isPositive ? "#10B981" : "#EF4444"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="text-right min-w-[70px]">
          <div className="text-white text-sm font-medium">${price}</div>
          <div className={`text-xs font-semibold ${color}`}>{change}</div>
        </div>
      </div>
    </div>
  );
}

// Engine core visual
function EngineCore() {
  const [pulse, setPulse] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative flex items-center justify-center my-6">
      {/* Glow effect */}
      <div 
        className="absolute w-32 h-32 rounded-full opacity-20 blur-2xl"
        style={{ 
          background: "radial-gradient(circle, #10B981 0%, transparent 70%)",
          animation: "pulse 3s ease-in-out infinite"
        }}
      />
      
      {/* Core circle */}
      <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[#10B981]/20 to-[#059669]/10 border border-[#10B981]/30 flex flex-col items-center justify-center">
        <div className="text-[#10B981] text-[10px] font-bold tracking-widest uppercase mb-1">ENGINE</div>
        <div className="text-white text-lg font-bold">CS</div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
          </span>
          <span className="text-[#10B981] text-[9px] font-semibold">ACTIVE</span>
        </div>
      </div>
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
        <line x1="50%" y1="100%" x2="50%" y2="100%" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}

// Process flow steps
function ProcessFlow() {
  const steps = [
    { label: "MARKET DATA", sub: "Analysis" },
    { label: "DEVIATION", sub: "Search" },
    { label: "LIMIT ORDER", sub: "Place" },
    { label: "POSITION", sub: "Monitor" },
    { label: "NORMALIZATION", sub: "Balance" },
  ];
  
  return (
    <div className="mt-6 space-y-2">
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3">Process Flow</div>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3 group">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] text-[10px] font-bold">
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-px h-4 bg-[#10B981]/30"></div>}
          </div>
          <div className="flex-1 py-2 px-3 rounded-lg bg-white/5 border border-white/5 group-hover:border-[#10B981]/30 transition-colors">
            <div className="text-white text-xs font-semibold">{step.label}</div>
            <div className="text-slate-400 text-[10px]">{step.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TradingEngine() {
  const [status, setStatus] = useState("Monitoring positions...");
  
  useEffect(() => {
    const statuses = ["Scanning market...", "Recalculating levels...", "Monitoring positions..."];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % statuses.length;
      setStatus(statuses[i]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Demo market data
  const markets = [
    { symbol: "BTCUSDT", price: "67,240", change: "+2.41%", sparkline: [0.4, 0.6, 0.5, 0.7, 0.8, 0.7, 0.9] },
    { symbol: "ETHUSDT", price: "3,421", change: "+3.17%", sparkline: [0.3, 0.5, 0.6, 0.5, 0.7, 0.8, 0.9] },
    { symbol: "NVDA", price: "890", change: "+1.82%", sparkline: [0.5, 0.4, 0.6, 0.7, 0.6, 0.8, 0.9] },
    { symbol: "AMD", price: "178", change: "+2.04%", sparkline: [0.3, 0.4, 0.3, 0.5, 0.6, 0.5, 0.7] },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative"
    >
      {/* Main engine card */}
      <div className="bg-[#07131D] rounded-[24px] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm">CryptoSuperStock</div>
              <div className="text-slate-400 text-[10px]">Trading Engine v2.4</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-2 rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
              </span>
              <span className="text-[#10B981] text-xs font-semibold">ACTIVE</span>
            </div>
            <div className="text-slate-400 text-xs">24/7</div>
          </div>
        </div>
        
        {/* Content grid */}
        <div className="grid grid-cols-[1fr_140px] gap-0">
          {/* Left: Markets */}
          <div className="p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3">Active Markets</div>
            <div className="space-y-1">
              {markets.map((m, i) => (
                <MarketCard key={i} {...m} />
              ))}
            </div>
            
            {/* Status bar */}
            <div className="mt-4 px-3 py-2 rounded-lg bg-[#10B981]/5 border border-[#10B981]/20">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
                </span>
                <span className="text-[#10B981] text-xs font-medium">{status}</span>
              </div>
            </div>
          </div>
          
          {/* Right: Engine visualization */}
          <div className="border-l border-white/10 p-4 flex flex-col items-center justify-center">
            <EngineCore />
          </div>
        </div>
        
        {/* Process flow */}
        <ProcessFlow />
        
        {/* Footer stats */}
        <div className="grid grid-cols-3 border-t border-white/10">
          {[
            { label: "Trades today", value: "1,247" },
            { label: "Win rate", value: "78.4%" },
            { label: "Avg profit", value: "+2.1%" },
          ].map((stat, i) => (
            <div key={i} className="px-6 py-4 border-r border-white/10 last:border-r-0">
              <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-white font-bold text-lg">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background glow */}
      <div 
        className="absolute -inset-4 -z-10 opacity-30 blur-3xl"
        style={{ 
          background: "radial-gradient(circle at 70% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)"
        }}
      />
    </motion.div>
  );
}