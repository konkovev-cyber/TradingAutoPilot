import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Keyframes for pulse animation
const pulseKeyframes = `
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}
`;

// Zone components
function MarketsZone() {
  const markets = [
    { symbol: "BTCUSDT", change: "+2.41%" },
    { symbol: "ETHUSDT", change: "+3.17%" },
    { symbol: "NVDA", change: "+1.82%" },
    { symbol: "AMD", change: "+2.04%" },
  ];
  
  return (
    <div className="flex flex-col">
      <div className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mb-4">MARKETS</div>
      <div className="space-y-3">
        {markets.map((m) => (
          <div key={m.symbol} className="flex items-center justify-between">
            <span className="text-white text-[12px] font-medium">{m.symbol}</span>
            <span className="text-[#10B981] text-[11px] font-semibold tabular-nums">{m.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EngineZone() {
  return (
    <div className="w-[120px] flex items-center justify-center">
      <div className="relative w-[120px] h-[120px] rounded-2xl flex flex-col items-center justify-center gap-1" style={{
        background: "radial-gradient(circle at center, rgba(16,185,129,0.12), rgba(16,185,129,0.02))",
        border: "1px solid rgba(16,185,129,0.25)"
      }}>
        <div className="text-white text-[24px] font-bold leading-none">CS</div>
        <div className="text-slate-500 text-[9px] uppercase tracking-widest">ENGINE</div>
        <div className="flex items-center gap-1.5">
          <span className="relative inline-block w-2 h-2">
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
          </span>
          <span className="text-[#10B981] text-[9px] font-semibold uppercase tracking-wider">ACTIVE</span>
        </div>
      </div>
    </div>
  );
}

function ActionsZone() {
  return (
    <div className="flex flex-col">
      <div className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mb-4">ACTIONS</div>
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 text-[10px] uppercase tracking-wide">LIMIT BUY</span>
          <span className="text-[#10B981] text-[11px] font-semibold tabular-nums">$67,420</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 text-[10px] uppercase tracking-wide">LIMIT SELL</span>
          <span className="text-[#FF4D4D] text-[11px] font-semibold tabular-nums">$68,890</span>
        </div>
        <div className="pt-3.5 border-t border-white/6">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[10px] uppercase tracking-wide">MONITORING</span>
            <span className="text-slate-400 text-[11px] font-medium tabular-nums">3 позиции</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Connector({ reverse }: { reverse?: boolean }) {
  return (
    <div className="flex items-center flex-shrink-0" style={{ width: "40px", height: "2px" }}>
      <div className="flex-1 h-px bg-[rgba(16,185,129,0.4)]" />
      <div 
        className="w-1 h-1 rounded-full bg-[#10B981] flex-shrink-0"
        style={{ marginLeft: reverse ? "0" : "auto", marginRight: reverse ? "auto" : "0" }}
      />
    </div>
  );
}

function SchematicCurve() {
  return (
    <div className="mt-4">
      <div className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mb-3">Решения робота</div>
      <svg 
        viewBox="0 0 560 60" 
        width="100%" 
        height="60" 
        preserveAspectRatio="none"
        className="block"
      >
        <defs>
          <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(16,185,129,0.15)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0)" />
          </linearGradient>
        </defs>
        
        {/* Curve path */}
        <path 
          d="M 0 45 Q 70 40, 140 35 T 280 30 T 420 25 T 560 10"
          fill="none"
          stroke="#10B981"
          strokeWidth="1.5"
          opacity="0.7"
          strokeLinecap="round"
        />
        
        {/* Fill under curve */}
        <path 
          d="M 0 45 Q 70 40, 140 35 T 280 30 T 420 25 T 560 10 L 560 60 L 0 60 Z"
          fill="url(#curveGradient)"
        />
        
        {/* BUY marker at X=140, Y35 */}
        <g transform="translate(120, 22)">
          <rect width="40" height="14" rx="3" fill="rgba(255,255,255,0.06)" />
          <text x="20" y="10" fill="#10B981" fontSize="8" textAnchor="middle" fontWeight="600"> BUY</text>
        </g>
        
        {/* SELL marker at X=320, Y27 */}
        <g transform="translate(300, 14)">
          <rect width="40" height="14" rx="3" fill="rgba(255,255,255,0.06)" />
          <text x="20" y="10" fill="#FF4D4D" fontSize="8" textAnchor="middle" fontWeight="600"> SELL</text>
        </g>
        
        {/* BUY marker at X=480, Y15 */}
        <g transform="translate(460, 2)">
          <rect width="40" height="14" rx="3" fill="rgba(255,255,255,0.06)" />
          <text x="20" y="10" fill="#10B981" fontSize="8" textAnchor="middle" fontWeight="600"> BUY</text>
        </g>
      </svg>
    </div>
  );
}

export function TradingTerminal() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative mx-auto"
      style={{ maxWidth: "640px" }}
    >
      {/* Main panel - fixed height 440px */}
      <div 
        className="bg-[#0F141C] rounded-[24px] border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
        style={{ height: "440px", boxSizing: "border-box" }}
      >
        {/* Header - 40px */}
        <div className="flex items-center justify-between px-7 py-3.5 border-b border-white/6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#10B981" }}>
              <span className="text-white text-[11px] font-bold">CS</span>
            </div>
            <span className="text-white text-[13px] font-semibold">CryptoSuperStock</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="relative inline-block w-2 h-2">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex h-2 h-2 rounded-full bg-[#10B981]"></span>
            </span>
            <span className="text-[#10B981] text-[10px] font-semibold uppercase tracking-widest">LIVE</span>
          </div>
        </div>
        
        {/* Main area - flex layout with zones */}
        <div className="px-7 py-5" style={{ height: "310px" }}>
          <div className="flex items-center h-full">
            {/* MARKETS zone */}
            <div className="flex-1 pr-4">
              <MarketsZone />
            </div>
            
            {/* Connector */}
            <Connector />
            
            {/* ENGINE zone */}
            <EngineZone />
            
            {/* Connector */}
            <Connector reverse />
            
            {/* ACTIONS zone */}
            <div className="flex-1 pl-4">
              <ActionsZone />
            </div>
          </div>
        </div>
        
        {/* Schematic curve - 70px */}
        <div className="px-7 pb-4" style={{ height: "70px" }}>
          <SchematicCurve />
        </div>
        
        {/* Footer - 20px */}
        <div className="px-7 py-2 border-t border-white/6 flex justify-end">
          <span className="text-white/30 text-[9px] italic">Demo  данные симулированы</span>
        </div>
      </div>
    </motion.div>
  );
}