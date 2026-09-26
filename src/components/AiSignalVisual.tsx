interface Props {
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export default function AiSignalVisual({ color = 'accent', className = '' }: Props) {
  const colorMap = {
    primary: '#00FFB2',
    secondary: '#00D4FF',
    accent: '#7B61FF',
  };
  const c = colorMap[color];

  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="ai-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.1" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Trend line */}
      <path
        d="M 0 160 Q 50 140 80 130 Q 120 115 160 120 Q 200 100 240 85 Q 280 70 320 60 Q 360 50 400 40"
        fill="none"
        stroke={c}
        strokeWidth="1.5"
        opacity="0.5"
      />
      <path
        d="M 0 160 Q 50 140 80 130 Q 120 115 160 120 Q 200 100 240 85 Q 280 70 320 60 Q 360 50 400 40 L 400 200 L 0 200 Z"
        fill="url(#ai-area)"
      />

      {/* Neural network pattern */}
      {[60, 120, 180, 280, 340].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={i % 2 === 0 ? 130 : 90} r="1.5" fill={c} opacity="0.4" />
          <circle cx={x} cy={i % 2 === 0 ? 90 : 130} r="1.5" fill={c} opacity="0.4" />
        </g>
      ))}

      {/* Buy signal */}
      <g>
        <circle cx="60" cy="135" r="5" fill="#00FFB2" opacity="0.2" />
        <circle cx="60" cy="135" r="2.5" fill="#00FFB2" />
        <text x="60" y="152" fill="#00FFB2" fontSize="6" textAnchor="middle" fontWeight="bold">BUY</text>
      </g>

      {/* Sell signal */}
      <g>
        <circle cx="340" cy="55" r="5" fill="#FF4D6A" opacity="0.2" />
        <circle cx="340" cy="55" r="2.5" fill="#FF4D6A" />
        <text x="340" y="48" fill="#FF4D6A" fontSize="6" textAnchor="middle" fontWeight="bold">SELL</text>
      </g>

      {/* Signal lines */}
      <line x1="60" y1="135" x2="340" y2="55" stroke={c} strokeWidth="0.3" strokeDasharray="3 3" opacity="0.3" />
    </svg>
  );
}
