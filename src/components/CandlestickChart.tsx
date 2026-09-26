import { useEffect, useState } from 'react';

const generateCandles = (count: number) => {
  const candles = [];
  let price = 64000;
  for (let i = 0; i < count; i++) {
    const open = price;
    const change = (Math.random() - 0.48) * 400;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 200;
    const low = Math.min(open, close) - Math.random() * 200;
    candles.push({ open, close, high, low });
    price = close;
  }
  return candles;
};

export default function CandlestickChart() {
  const [candles, setCandles] = useState(() => generateCandles(30));

  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => {
        const last = prev[prev.length - 1];
        const change = (Math.random() - 0.48) * 300;
        const newClose = last.close + change;
        const newCandle = {
          open: last.close,
          close: newClose,
          high: Math.max(last.close, newClose) + Math.random() * 100,
          low: Math.min(last.close, newClose) - Math.random() * 100,
        };
        return [...prev.slice(1), newCandle];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const maxPrice = Math.max(...candles.map(c => c.high));
  const minPrice = Math.min(...candles.map(c => c.low));
  const range = maxPrice - minPrice;
  const chartHeight = 120;
  const candleWidth = 100 / candles.length;

  return (
    <div className="relative h-32 w-full">
      <svg className="w-full h-full" preserveAspectRatio="none">
        {candles.map((candle, i) => {
          const isGreen = candle.close >= candle.open;
          const color = isGreen ? 'var(--primary)' : 'var(--danger)';
          const yOpen = chartHeight - ((candle.open - minPrice) / range) * chartHeight;
          const yClose = chartHeight - ((candle.close - minPrice) / range) * chartHeight;
          const yHigh = chartHeight - ((candle.high - minPrice) / range) * chartHeight;
          const yLow = chartHeight - ((candle.low - minPrice) / range) * chartHeight;
          const bodyTop = Math.min(yOpen, yClose);
          const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1);
          
          return (
            <g key={i}>
              <line x1={(i + 0.5) * candleWidth} y1={yHigh} x2={(i + 0.5) * candleWidth} y2={yLow} stroke={color} strokeWidth="1" opacity="0.6" />
              <rect x={i * candleWidth + 1} y={bodyTop} width={candleWidth - 2} height={bodyHeight} fill={color} rx="0.5" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
