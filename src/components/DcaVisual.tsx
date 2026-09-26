interface Props {
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export default function DcaVisual({ color = 'secondary', className = '' }: Props) {
  const colorMap = {
    primary: '#00FFB2',
    secondary: '#00D4FF',
    accent: '#7B61FF',
  };
  const c = colorMap[color];

  const points = [
    { x: 20, y: 60 },
    { x: 80, y: 90 },
    { x: 140, y: 130 },
    { x: 200, y: 100 },
    { x: 260, y: 150 },
    { x: 320, y: 110 },
    { x: 380, y: 70 },
  ];

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="dca-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.08" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area */}
      <path d={`${pathD} L 380 200 L 20 200 Z`} fill="url(#dca-area)" />
      <path d={pathD} fill="none" stroke={c} strokeWidth="1.5" opacity="0.5" />

      {/* Average line */}
      <line x1="0" y1="105" x2="400" y2="105" stroke={c} strokeWidth="0.5" strokeDasharray="6 4" opacity="0.3" />
      <text x="370" y="100" fill={c} fontSize="7" opacity="0.6" textAnchor="end">avg</text>

      {/* Buy points on dips */}
      {points.map((p, i) => {
        const isDip = i === 0 || i === 2 || i === 4;
        return (
          <g key={i}>
            {isDip && (
              <circle cx={p.x} cy={p.y} r="6" fill={c} opacity="0.15" />
            )}
            <circle cx={p.x} cy={p.y} r="2.5" fill={isDip ? c : '#8B95A7'} opacity={isDip ? 0.9 : 0.5} />
            {isDip && (
              <text x={p.x} y={p.y - 8} fill={c} fontSize="6" textAnchor="middle" opacity="0.7">BUY</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
