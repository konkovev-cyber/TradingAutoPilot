import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============ DATA GENERATION ============
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

// ============ TYPES ============
interface Candle {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
}

interface TradeMarker {
  id: number;
  type: "BUY" | "SELL";
  price: number;
  x: number;
  label: string;
}

interface OrderBookEntry {
  price: number;
  amount: number;
}

// ============ COMPONENTS ============

function Candlestick({ candle, x, width, scale }: { candle: Candle; x: number; width: number; scale: number }) {
  const isGreen = candle.close >= candle.open;
  const color = isGreen ? "#00B96B" : "#FF4D4D";
  const bodyTop = candle.close * scale;
  const bodyBottom = candle.open * scale;
  const bodyHeight = Math.max(1, Math.abs(bodyBottom - bodyTop));
  const bodyY = Math.min(bodyTop, bodyBottom);
  const wickX = x + width / 2;
  
  return (
    <g>
      <line
        x1={wickX} y1={candle.high * scale}
        x2={wickX} y2={candle.low * scale}
        stroke={color} strokeWidth="1" opacity="0.8"
      />
      <rect
        x={x + 1} y={bodyY}
        width={width - 2} height={bodyHeight}
        fill={color} rx="0.5"
      />
    </g>
  );
}

function OrderBook({ bids, asks, midPrice }: { bids: OrderBookEntry[]; asks: OrderBookEntry[]; midPrice: number }) {
  const maxAmount = Math.max(...bids.map(b => b.amount), ...asks.map(a => a.amount));
  
  return (
    <div className="space-y-3">
      <div className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">Order Book</div>
      
      {/* Asks (red) */}
      <div className="space-y-0.5">
        {[...asks].reverse().map((ask, i) => (
          <div key={`ask-${i}`} className="flex items-center justify-between text-[10px] tabular-nums">
            <span className="text-[#FF4D4D]">{ask.price.toFixed(2)}</span>
            <div className="flex-1 mx-2 h-1 bg-[rgba(255,77,77,0.08)] rounded-full overflow-hidden">
              <div className="h-full bg-[#FF4D4D]/30 rounded-full" style={{ width: `${(ask.amount / maxAmount) * 100}%` }} />
            </div>
            <span className="text-slate-400">{ask.amount.toFixed(3)}</span>
          </div>
        ))}
      </div>
      
      <div className="text-center text-[9px] text-slate-500 py-0.5">
        SPREAD {(Math.abs(bids[0]?.price - asks[0]?.price) / midPrice * 100).toFixed(3)}%
      </div>
      
      {/* Bids (green) */}
      <div className="space-y-0.5">
        {bids.map((bid, i) => (
          <div key={`bid-${i}`} className="flex items-center justify-between text-[10px] tabular-nums">
            <span className="text-[#00B96B]">{bid.price.toFixed(2)}</span>
            <div className="flex-1 mx-2 h-1 bg-[rgba(0,185,107,0.08)] rounded-full overflow-hidden">
              <div className="h-full bg-[#00B96B]/30 rounded-full" style={{ width: `${(bid.amount / maxAmount) * 100}%` }} />
            </div>
            <span className="text-slate-400">{bid.amount.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PositionPanel({ entryPrice, currentPrice, qty }: { entryPrice: number; currentPrice: number; qty: number }) {
  const pnl = (currentPrice - entryPrice) * qty;
  const pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100;
  const isPositive = pnl >= 0;
  
  return (
    <div className="mt-4 pt-3 border-t border-white/5">
      <div className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mb-2">Position</div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-white text-[11px] font-medium">LONG  {qty.toFixed(2)} BTC</span>
        <span className="text-[#00B96B] text-[10px] font-semibold">OPEN</span>
      </div>
      <div className="text-slate-400 text-[10px] mb-2">Вход {entryPrice.toFixed(0)}</div>
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-[10px]">PnL</span>
        <span className={`text-sm font-bold tabular-nums ${isPositive ? "text-[#00B96B]" : "text-[#FF4D4D]"}`}>
          {isPositive ? "+" : ""}{pnl.toFixed(2)} USDT
        </span>
      </div>
      <div className={`text-[10px] text-right tabular-nums mt-0.5 ${isPositive ? "text-[#00B96B]/70" : "text-[#FF4D4D]/70"}`}>
        {isPositive ? "+" : ""}{pnlPercent.toFixed(2)}%
      </div>
    </div>
  );
}

// ============ MAIN TERMINAL COMPONENT ============
export function TradingTerminal() {
  const [candles] = useState<Candle[]>(INITIAL_CANDLES);
  const [lastCandle, setLastCandle] = useState<Candle>(INITIAL_CANDLES[INITIAL_CANDLES.length - 1]);
  const [currentPrice, setCurrentPrice] = useState(67482.21);
  const [priceChange, setPriceChange] = useState("+2.41");
  const [tradeMarkers, setTradeMarkers] = useState<TradeMarker[]>([]);
  const [status, setStatus] = useState("Scanning market...");
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const entryPrice = 67240;
  const qty = 0.42;
  const [pnl, setPnl] = useState(18.42);
  
  const markerIdRef = useRef(0);
  
  // Generate initial order book
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
      "Monitoring positions...",
      "Adjusting order parameters..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % statuses.length;
      setStatus(statuses[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  // Trade markers
  useEffect(() => {
    const interval = setInterval(() => {
      const type: "BUY" | "SELL" = Math.random() > 0.5 ? "BUY" : "SELL";
      const price = currentPrice + (Math.random() - 0.5) * 200;
      markerIdRef.current += 1;
      setTradeMarkers(prev => [...prev.slice(-4), {
        id: markerIdRef.current,
        type,
        price,
        x: 85 + Math.random() * 10,
        label: `${type} ${price.toFixed(0)}`
      }]);
    }, 9000);
    return () => clearInterval(interval);
  }, [currentPrice]);
  
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
  
  // Current price line
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
      <div className="bg-[#0A0E14] rounded-[24px] border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F7931A]/20 flex items-center justify-center">
              <span className="text-[#F7931A] text-xs font-bold"></span>
            </div>
            <div>
              <div className="text-white text-sm font-semibold leading-none">BTC/USDT</div>
              <div className="text-slate-500 text-[10px] mt-0.5"> Binance</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B96B] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00B96B]"></span>
            </span>
            <span className="text-[#00B96B] text-xs font-semibold uppercase tracking-wider">LIVE</span>
          </div>
          
          <div className="text-right">
            <div className="text-white text-base font-bold tabular-nums">{currentPrice.toFixed(2)}</div>
            <div className="text-[#00B96B] text-[11px] font-semibold tabular-nums">+{priceChange}%</div>
          </div>
        </div>
        
        {/* Main content grid */}
        <div className="grid grid-cols-[1fr_160px]">
          {/* Chart */}
          <div className="p-4 relative" style={{ height: "260px" }}>
            <svg 
              width="100%" 
              height="100%"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                <line
                  key={i}
                  x1={0} y1={chartHeight * p}
                  x2={chartWidth} y2={chartHeight * p}
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="1"
                />
              ))}
              
              {/* Current price line */}
              <line
                x1={0} y1={currentPriceY}
                x2={chartWidth} y2={currentPriceY}
                stroke="rgba(0,185,107,0.4)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text x={chartWidth - 4} y={currentPriceY - 4} fill="#00B96B" fontSize="9" textAnchor="end">
                {currentPrice.toFixed(0)}
              </text>
              
              {/* Candles */}
              {candles.map((candle, i) => (
                <Candlestick
                  key={i}
                  candle={candle}
                  x={i * candleWidth}
                  width={candleWidth - 2}
                  scale={chartHeight / (maxPrice - minPrice)}
                />
              ))}
              
              {/* Last candle (live updating) */}
              <Candlestick
                candle={lastCandle}
                x={(candles.length - 1) * candleWidth}
                width={candleWidth - 2}
                scale={chartHeight / (maxPrice - minPrice)}
              />
              
              {/* Trade markers */}
              <AnimatePresence>
                {tradeMarkers.map((marker) => (
                  <motion.g
                    key={marker.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {marker.type === "BUY" ? (
                      <>
                        <polygon
                          points={`${marker.x * chartWidth / 100},${priceToY(marker.price) - 12} ${(marker.x * chartWidth / 100) - 6},${priceToY(marker.price) - 2} ${(marker.x * chartWidth / 100) + 6},${priceToY(marker.price) - 2}`}
                          fill="#00B96B"
                          opacity="0.8"
                        />
                        <rect
                          x={(marker.x * chartWidth / 100) - 28}
                          y={priceToY(marker.price) - 28}
                          width="56"
                          height="14"
                          rx="3"
                          fill="rgba(0,185,107,0.15)"
                        />
                        <text
                          x={marker.x * chartWidth / 100}
                          y={priceToY(marker.price) - 19}
                          fill="#00B96B"
                          fontSize="9"
                          textAnchor="middle"
                          fontWeight="600"
                        >
                          {marker.label}
                        </text>
                      </>
                    ) : (
                      <>
                        <polygon
                          points={`${marker.x * chartWidth / 100},${priceToY(marker.price) + 12} ${(marker.x * chartWidth / 100) - 6},${priceToY(marker.price) + 2} ${(marker.x * chartWidth / 100) + 6},${priceToY(marker.price) + 2}`}
                          fill="#FF4D4D"
                          opacity="0.8"
                        />
                        <rect
                          x={(marker.x * chartWidth / 100) - 28}
                          y={priceToY(marker.price) + 14}
                          width="56"
                          height="14"
                          rx="3"
                          fill="rgba(255,77,77,0.15)"
                        />
                        <text
                          x={marker.x * chartWidth / 100}
                          y={priceToY(marker.price) + 24}
                          fill="#FF4D4D"
                          fontSize="9"
                          textAnchor="middle"
                          fontWeight="600"
                        >
                          {marker.label}
                        </text>
                      </>
                    )}
                  </motion.g>
                ))}
              </AnimatePresence>
            </svg>
          </div>
          
          {/* Right sidebar */}
          <div className="border-l border-white/5 p-4">
            <OrderBook bids={bids} asks={asks} midPrice={currentPrice} />
            <PositionPanel 
              entryPrice={entryPrice} 
              currentPrice={currentPrice} 
              qty={qty} 
            />
          </div>
        </div>
        
        {/* Bottom status bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B96B] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00B96B]"></span>
            </span>
            <span className="text-slate-400 text-[11px]">{status}</span>
          </div>
          <span className="text-white/30 text-[10px] italic">Demo  данные симулированы</span>
        </div>
      </div>
      
      {/* Background glow */}
      <div 
        className="absolute -inset-8 -z-10 opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle at 65% 50%, rgba(0,185,107,0.08) 0%, transparent 55%)" }}
      />
    </motion.div>
  );
}