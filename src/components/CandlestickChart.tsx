import { useEffect, useState } from 'react';

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
}

function generateCandles(count: number): Candle[] {
  const candles: Candle[] = [];
  let price = 64000;
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * 800;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 200;
    const low = Math.min(open, close) - Math.random() * 200;
    candles.push({ open, close, high, low });
    price = close;
  }
  return candles;
}

export default function CandlestickChart() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setCandles(generateCandles(30));
    const interval = setInterval(() => {
      setCandles((prev) => {
        const next = [...prev.slice(1)];
        const lastPrice = prev[prev.length - 1].close;
        const change = (Math.random() - 0.48) * 800;
        const open = lastPrice;
        const close = lastPrice + change;
        const high = Math.max(open, close) + Math.random() * 200;
        const low = Math.min(open, close) - Math.random() * 200;
        next.push({ open, close, high, low });
        return next;
      });
      setTick((t) => t + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  if (candles.length === 0) return null;

  const width = 100;
  const height = 200;
  const padding = 8;
  const chartHeight = height - padding * 2;
  const allPrices = candles.flatMap((c) => [c.high, c.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const range = maxPrice - minPrice || 1;
  const candleWidth = (width - padding * 2) / candles.length;

  const y = (price: number) =>
    padding + chartHeight - ((price - minPrice) / range) * chartHeight;

  const lastPrice = candles[candles.length - 1].close;
  const firstPrice = candles[0].close;
  const isUp = lastPrice >= firstPrice;
  const lineColor = isUp ? '#00FFB2' : '#FF4D6A';

  const linePoints = candles
    .map((c, i) => {
      const x = padding + i * candleWidth + candleWidth / 2;
      const yp = y(c.close);
      return `${x},${yp}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="candle-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <polygon
        points={`${padding},${height - padding} ${linePoints} ${padding + (candles.length - 1) * candleWidth + candleWidth / 2},${height - padding}`}
        fill="url(#candle-area)"
      />

      {/* Candles */}
      {candles.map((c, i) => {
        const x = padding + i * candleWidth + candleWidth / 2;
        const isGreen = c.close >= c.open;
        const color = isGreen ? '#00FFB2' : '#FF4D6A';
        const bodyTop = y(Math.max(c.open, c.close));
        const bodyBottom = y(Math.min(c.open, c.close));
        const bodyHeight = Math.max(bodyBottom - bodyTop, 0.5);
        const wickTop = y(c.high);
        const wickBottom = y(c.low);
        return (
          <g key={i}>
            <line
              x1={x}
              x2={x}
              y1={wickTop}
              y2={wickBottom}
              stroke={color}
              strokeWidth="0.3"
              opacity="0.6"
            />
            <rect
              x={x - candleWidth * 0.3}
              y={bodyTop}
              width={candleWidth * 0.6}
              height={bodyHeight}
              fill={color}
              opacity={i === candles.length - 1 ? 1 : 0.7}
            />
          </g>
        );
      })}

      {/* Price line */}
      <polyline
        points={linePoints}
        fill="none"
        stroke={lineColor}
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* Last price dot */}
      {candles.length > 0 && (
        <circle
          cx={padding + (candles.length - 1) * candleWidth + candleWidth / 2}
          cy={y(lastPrice)}
          r="1.2"
          fill={lineColor}
          className="animate-pulse-glow"
        />
      )}
    </svg>
  );
}
