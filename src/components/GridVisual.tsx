interface Props {
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export default function GridVisual({ color = 'primary', className = '' }: Props) {
  const colorMap = {
    primary: '#00FFB2',
    secondary: '#00D4FF',
    accent: '#7B61FF',
  };
  const c = colorMap[color];

  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="grid-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.08" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Price area */}
      <path
        d="M 0 120 Q 50 80 100 100 T 200 90 T 300 110 T 400 95 L 400 200 L 0 200 Z"
        fill="url(#grid-area)"
      />
      <path
        d="M 0 120 Q 50 80 100 100 T 200 90 T 300 110 T 400 95"
        fill="none"
        stroke={c}
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* Grid lines */}
      {[40, 60, 80, 100, 120, 140, 160].map((y, i) => (
        <g key={i}>
          <line x1="0" y1={y} x2="400" y2={y} stroke={c} strokeWidth="0.5" opacity="0.2" strokeDasharray="4 4" />
          <circle cx="60" cy={y} r="2" fill={c} opacity="0.5" />
          <circle cx="140" cy={y} r="2" fill={c} opacity="0.5" />
          <circle cx="220" cy={y} r="2" fill={c} opacity="0.5" />
          <circle cx="300" cy={y} r="2" fill={c} opacity="0.5" />
        </g>
      ))}

      {/* Buy/Sell markers */}
      <circle cx="60" cy="140" r="3" fill="#00FFB2" opacity="0.8" />
      <circle cx="140" cy="60" r="3" fill="#FF4D6A" opacity="0.8" />
      <circle cx="220" cy="130" r="3" fill="#00FFB2" opacity="0.8" />
      <circle cx="300" cy="70" r="3" fill="#FF4D6A" opacity="0.8" />
    </svg>
  );
}
