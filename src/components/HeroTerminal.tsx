import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ============ CANDLE DATA ============
function generateCandles(count: number) {
  const candles = [];
  let price = 67000;
  let trend = 1;
  for (let i = 0; i < count; i++) {
    if (i === 15 || i === 32) trend = -1;
    else if (i === 20 || i === 38) trend = 1;
    
    const volatility = 80 + Math.random() * 120;
    const change = (Math.random() - 0.48) * volatility * trend;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    candles.push({ time: i, open, close, high, low });
    price = close;
  }
  return candles;
}

const CANDLE_COUNT = 50;
const INITIAL_CANDLES = generateCandles(CANDLE_COUNT);

interface Candle {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
}

interface OrderBookEntry {
  price: number;
  amount: number;
}

// ============ MAIN TERMINAL ============
export function TradingTerminal() {
  const [candles] = useState<Candle[]>(INITIAL_CANDLES);
  const [lastCandle, setLastCandle] = useState<Candle>(INITIAL_CANDLES[INITIAL_CANDLES.length - 1]);
  const [currentPrice, setCurrentPrice] = useState(67482.21);
  const [priceChange, setPriceChange] = useState("+2.41");
  const [status, setStatus] = useState("Scanning market...");
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const entryPrice = 67240;
  const qty = 0.42;
  const [pnl, setPnl] = useState(18.42);
  
  // Initialize order book
  useEffect(() => {
    const mid = currentPrice;
    setBids(Array.from({ length: 4 }, (_, i) => ({
      price: mid - (i + 1) * 2.5,
      amount: 0.5 + Math.random() * 2
    })));
    setAsks(Array.from({ length: 4 }, (_, i) => ({
      price: mid + (i + 1) * 2.5,
      amount: 0.5 + Math.random() * 2
    })));
  }, []);
  
  // Price tick
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 15;
      setCurrentPrice(p => {
        const newPrice = p + change;
        const pct = ((newPrice - entryPrice) / entryPrice * 100).toFixed(2);
        setPriceChange(pct);
        return newPrice;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [entryPrice]);
  
  // Update last candle
  useEffect(() => {
    const interval = setInterval(() => {
      setLastCandle(prev => {
        const change = (Math.random() - 0.48) * 40;
        return {
          ...prev,
          close: prev.close + change,
          high: Math.max(prev.high, prev.close + change + Math.random() * 10),
          low: Math.min(prev.low, prev.close + change - Math.random() * 10),
        };
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  
  // PnL update
  useEffect(() => {
    const interval = setInterval(() => {
      setPnl(p => p + (Math.random() - 0.48) * 1.5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  // Status rotation
  useEffect(() => {
    const statuses = [
      "Scanning market...",
      "Recalculating limit levels...",
      "Monitoring positions..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % statuses.length;
      setStatus(statuses[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  // Order book update
  useEffect(() => {
    const interval = setInterval(() => {
      const mid = currentPrice;
      setBids(Array.from({ length: 4 }, (_, i) => ({
        price: mid - (i + 1) * (2 + Math.random()),
        amount: 0.5 + Math.random() * 2
      })));
      setAsks(Array.from({ length: 4 }, (_, i) => ({
        price: mid + (i + 1) * (2 + Math.random()),
        amount: 0.5 + Math.random() * 2
      })));
    }, 2500);
    return () => clearInterval(interval);
  }, [currentPrice]);
  
  // Chart dimensions
  const chartWidth = 420;
  const chartHeight = 220;
  const allPrices = candles.flatMap(c => [c.high, c.low]).concat(lastCandle.high, lastCandle.low);
  const minPrice = Math.min(...allPrices) - 50;
  const maxPrice = Math.max(...allPrices) + 50;
  const priceToY = (p: number) => chartHeight - ((p - minPrice) / (maxPrice - minPrice)) * chartHeight;
  const candleWidth = chartWidth / candles.length;
  const currentPriceY = priceToY(currentPrice);
  
  const pnlPercent = ((currentPrice - entryPrice) / entryPrice * 100).toFixed(2);
  const pnlIsPositive = pnl >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative mx-auto"
      style={{ maxWidth: "680px" }}
    >
      {/* Main panel */}
      <div className="bg-[#0F141C] rounded-[24px] border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">CS</span>
            </div>
            <div>
              <div className="text-white text-[13px] font-semibold leading-none">CryptoSuperStock</div>
              <div className="text-slate-400 text-[11px] mt-0.5">BTC/USDT  Binance</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
            </span>
            <span className="text-[#10B981] text-xs font-semibold uppercase tracking-wider">LIVE</span>
          </div>
          
          <div className="text-right">
            <div className="text-white text-[15px] font-bold tabular-nums">{currentPrice.toFixed(2)}</div>
            <div className="text-[#10B981] text-[11px] font-semibold tabular-nums">+{priceChange}%</div>
          </div>
        </div>
        
        {/* Main content grid - 70/30 */}
        <div className="grid grid-cols-[70%_30%] divide-x divide-white/6">
          {/* Chart - 70% */}
          <div className="p-4">
            <svg 
              width="100%" 
              height="220"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
              className="block"
            >
              {/* Grid lines */}
              {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
                <line
                  key={i}
                  x1={0} y1={chartHeight * p}
                  x2={chartWidth} y2={chartHeight * p}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                />
              ))}
              
              {/* Current price line */}
              <line
                x1={0} y1={currentPriceY}
                x2={chartWidth} y2={currentPriceY}
                stroke="#10B981"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.5"
              />
              <text 
                x={chartWidth - 5} 
                y={currentPriceY - 5} 
                fill="#10B981" 
                fontSize="10" 
                textAnchor="end"
                className="tabular-nums"
              >
                {currentPrice.toFixed(0)}
              </text>
              
              {/* Candles */}
              {candles.map((candle, i) => {
                const isGreen = candle.close >= candle.open;
                const color = isGreen ? "#00B96B" : "#FF4D4D";
                const bodyTop = priceToY(Math.max(candle.open, candle.close));
                const bodyBottom = priceToY(Math.min(candle.open, candle.close));
                const bodyHeight = Math.max(2, bodyBottom - bodyTop);
                const x = i * candleWidth + candleWidth / 2;
                
                return (
                  <g key={i}>
                    {/* Wick */}
                    <line
                      x1={x} y1={priceToY(candle.high)}
                      x2={x} y2={priceToY(candle.low)}
                      stroke={color}
                      strokeWidth="1"
                      opacity="0.8"
                    />
                    {/* Body */}
                    <rect
                      x={x - 2} y={bodyTop}
                      width="4" height={bodyHeight}
                      fill={color}
                      opacity="0.9"
                      rx="0.5"
                    />
                  </g>
                );
              })}
              
              {/* Last candle (live) */}
              {(() => {
                const candle = lastCandle;
                const isGreen = candle.close >= candle.open;
                const color = isGreen ? "#00B96B" : "#FF4D4D";
                const bodyTop = priceToY(Math.max(candle.open, candle.close));
                const bodyBottom = priceToY(Math.min(candle.open, candle.close));
                const bodyHeight = Math.max(2, bodyBottom - bodyTop);
                const x = (candles.length - 1) * candleWidth + candleWidth / 2;
                
                return (
                  <g>
                    <line
                      x1={x} y1={priceToY(candle.high)}
                      x2={x} y2={priceToY(candle.low)}
                      stroke={color}
                      strokeWidth="1"
                      opacity="0.8"
                    />
                    <rect
                      x={x - 2} y={bodyTop}
                      width="4" height={bodyHeight}
                      fill={color}
                      opacity="0.9"
                      rx="0.5"
                    />
                  </g>
                );
              })()}
            </svg>
          </div>
          
          {/* Right sidebar - 30% */}
          <div className="p-4 flex flex-col gap-4">
            {/* Order Book */}
            <div className="bg-[#131922] rounded-xl p-3">
              <div className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mb-3">Order Book</div>
              
              {/* Asks (red) */}
              <div className="space-y-1 mb-2">
                {[...asks].reverse().map((ask, i) => (
                  <div key={`ask-${i}`} className="flex items-center justify-between text-[10px] tabular-nums">
                    <span className="text-[#FF4D4D]">{ask.price.toFixed(2)}</span>
                    <div className="flex-1 mx-2 h-1 bg-[rgba(255,77,77,0.08)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF4D4D]/40 rounded-full" 
                        style={{ width: `${(ask.amount / 2.5) * 100}%` }} 
                      />
                    </div>
                    <span className="text-slate-400">{ask.amount.toFixed(3)}</span>
                  </div>
                ))}
              </div>
              
              {/* Spread */}
              <div className="text-center text-[9px] text-slate-500 py-1 border-y border-white/5 my-1">
                SPREAD {(Math.abs(bids[0]?.price - asks[0]?.price) / currentPrice * 100).toFixed(3)}%
              </div>
              
              {/* Bids (green) */}
              <div className="space-y-1 mt-2">
                {bids.map((bid, i) => (
                  <div key={`bid-${i}`} className="flex items-center justify-between text-[10px] tabular-nums">
                    <span className="text-[#00B96B]">{bid.price.toFixed(2)}</span>
                    <div className="flex-1 mx-2 h-1 bg-[rgba(0,185,107,0.08)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#00B96B]/40 rounded-full" 
                        style={{ width: `${(bid.amount / 2.5) * 100}%` }} 
                      />
                    </div>
                    <span className="text-slate-400">{bid.amount.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Position */}
            <div className="bg-[#131922] rounded-xl p-3 flex-1">
              <div className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mb-3">Position</div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-[12px] font-semibold">LONG  {qty.toFixed(2)} BTC</span>
                <span className="text-[#10B981] text-[10px] font-semibold bg-[#10B981]/10 px-2 py-0.5 rounded">OPEN</span>
              </div>
              
              <div className="text-slate-400 text-[10px] mb-3">Вход {entryPrice.toFixed(0)}</div>
              
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 text-[10px]">PnL</span>
                <span className={`text-[13px] font-bold tabular-nums ${pnlIsPositive ? "text-[#00B96B]" : "text-[#FF4D4D]"}`}>
                  {pnlIsPositive ? "+" : ""}{pnl.toFixed(2)} USDT
                </span>
              </div>
              <div className={`text-[10px] text-right tabular-nums ${pnlIsPositive ? "text-[#00B96B]/70" : "text-[#FF4D4D]/70"}`}>
                {pnlIsPositive ? "+" : ""}{pnlPercent}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer status bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
            </span>
            <span className="text-slate-400 text-[11px]">{status}</span>
          </div>
          <span className="text-white/30 text-[9px] italic">Demo  данные симулированы</span>
        </div>
      </div>
    </motion.div>
  );
}