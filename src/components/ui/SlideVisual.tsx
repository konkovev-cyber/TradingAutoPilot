interface SlideVisualProps {
  index: number;
  className?: string;
}

const GRID = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

function Candle({
  x,
  top,
  bottom,
  bodyTop,
  bodyBottom,
  up,
}: {
  x: number;
  top: number;
  bottom: number;
  bodyTop: number;
  bodyBottom: number;
  up: boolean;
}) {
  const color = up ? "#10b981" : "#f43f5e";
  return (
    <g>
      <line x1={x} y1={top} x2={x} y2={bottom} stroke={color} strokeWidth={1.6} strokeLinecap="round" opacity={0.9} />
      <rect x={x - 3.4} y={bodyTop} width={6.8} height={Math.max(bodyBottom - bodyTop, 2)} rx={1.6} fill={color} />
    </g>
  );
}

export function TradingVisual({ index, className = "" }: SlideVisualProps) {
  const variant = ((index % 4) + 4) % 4;

  return (
    <svg viewBox="0 0 168 120" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`area-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`area2-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`coin-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {GRID.map((row, r) =>
        row.map((_, c) => (
          <circle key={`${r}-${c}`} cx={14 + c * 23} cy={12 + r * 16} r={0.9} fill="currentColor" opacity={0.12} />
        ))
      )}

      {variant === 0 && (
        <g>
          <Candle x={26} top={70} bottom={104} bodyTop={78} bodyBottom={96} up={false} />
          <Candle x={48} top={58} bottom={96} bodyTop={66} bodyBottom={88} up={true} />
          <Candle x={70} top={44} bottom={86} bodyTop={52} bodyBottom={76} up={true} />
          <Candle x={92} top={52} bottom={82} bodyTop={58} bodyBottom={74} up={false} />
          <Candle x={114} top={30} bottom={70} bodyTop={38} bodyBottom={60} up={true} />
          <Candle x={136} top={18} bottom={56} bodyTop={26} bodyBottom={46} up={true} />
          <path
            d="M26 90 L48 78 L70 64 L92 68 L114 48 L136 34 L150 26"
            fill="none"
            stroke="#10b981"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M26 90 L48 78 L70 64 L92 68 L114 48 L136 34 L150 26 L150 112 L26 112 Z" fill={`url(#area-${variant})`} stroke="none" />
          <circle cx={150} cy={26} r={3.4} fill="#10b981" />
          <circle cx={150} cy={26} r={6.5} fill="#10b981" opacity={0.25} />
        </g>
      )}

      {variant === 1 && (
        <g>
          <path d="M20 96 L52 70 L78 82 L108 44 L148 28" fill="none" stroke="#6366f1" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 96 L52 70 L78 82 L108 44 L148 28 L148 112 L20 112 Z" fill={`url(#area2-${variant})`} stroke="none" />
          <path d="M20 104 L58 92 L92 96 L124 78 L148 70" fill="none" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" strokeLinecap="round" opacity={0.8} />
          <circle cx={108} cy={44} r={3.2} fill="#6366f1" />
          <circle cx={148} cy={28} r={3.4} fill="#6366f1" />
          <circle cx={148} cy={28} r={6.5} fill="#6366f1" opacity={0.25} />
          <g transform="translate(138 8)">
            <path d="M0 10 L5 4 L10 10 M5 4 L5 16" stroke="#10b981" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      )}

      {variant === 2 && (
        <g>
          <circle cx={58} cy={62} r={34} fill="none" stroke="#10b981" strokeWidth={7} opacity={0.9} />
          <circle cx={58} cy={62} r={34} fill="none" stroke="#6366f1" strokeWidth={7} strokeDasharray="66 148" strokeLinecap="round" transform="rotate(-90 58 62)" />
          <circle cx={58} cy={62} r={34} fill="none" stroke="#f59e0b" strokeWidth={7} strokeDasharray="30 184" strokeLinecap="round" transform="rotate(96 58 62)" />
          <circle cx={58} cy={62} r={22} fill="none" stroke="currentColor" strokeWidth={1} opacity={0.15} />
          <g transform="translate(112 22)">
            <rect x={0} y={0} width={44} height={12} rx={6} fill="currentColor" opacity={0.08} />
            <rect x={0} y={18} width={34} height={12} rx={6} fill="currentColor" opacity={0.08} />
            <rect x={0} y={36} width={40} height={12} rx={6} fill="currentColor" opacity={0.08} />
            <circle cx={6} cy={6} r={3} fill="#10b981" />
            <circle cx={6} cy={24} r={3} fill="#6366f1" />
            <circle cx={6} cy={42} r={3} fill="#f59e0b" />
          </g>
        </g>
      )}

      {variant === 3 && (
        <g>
          <circle cx={84} cy={60} r={26} fill={`url(#coin-${variant})`} />
          <circle cx={84} cy={60} r={26} fill="none" stroke="#b45309" strokeWidth={1.2} opacity={0.5} />
          <circle cx={84} cy={60} r={20} fill="none" stroke="#fff7ed" strokeWidth={1.4} opacity={0.7} />
          <text x={84} y={69} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize={26} fontWeight={800} fill="#7c2d12">
            ₿
          </text>
          <g stroke="#10b981" strokeWidth={2} strokeLinecap="round" opacity={0.9}>
            <line x1={30} y1={60} x2={48} y2={60} />
            <line x1={120} y1={60} x2={138} y2={60} />
            <line x1={84} y1={14} x2={84} y2={28} />
            <line x1={84} y1={92} x2={84} y2={106} />
          </g>
          <g fill="#10b981">
            <circle cx={24} cy={60} r={4} />
            <circle cx={144} cy={60} r={4} />
            <circle cx={84} cy={9} r={4} />
            <circle cx={84} cy={111} r={4} />
          </g>
          <g fill="#6366f1" opacity={0.9}>
            <circle cx={43} cy={26} r={3} />
            <circle cx={125} cy={94} r={3} />
          </g>
          <g stroke="#6366f1" strokeWidth={1.4} strokeDasharray="3 4" opacity={0.5}>
            <line x1={43} y1={26} x2={66} y2={44} />
            <line x1={102} y1={76} x2={125} y2={94} />
          </g>
        </g>
      )}
    </svg>
  );
}
