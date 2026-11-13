interface SlideVisualProps {
  index: number;
  className?: string;
}

export function TradingVisual({ index, className = "" }: SlideVisualProps) {
  const variant = ((index % 4) + 4) % 4;
  const uid = `v${variant}`;

  return (
    <svg viewBox="0 0 220 220" className={className} role="img" aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#6366f1" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#eef2ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`${uid}-glassEdge`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`${uid}-green`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id={`${uid}-red`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-indigo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id={`${uid}-coin`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id={`${uid}-coinShine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fffbeb" stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-soft`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#312e81" floodOpacity="0.28" />
        </filter>
        <filter id={`${uid}-lift`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0f172a" floodOpacity="0.25" />
        </filter>
      </defs>

      <circle cx="110" cy="104" r="92" fill={`url(#${uid}-glow)`} />
      <circle cx="110" cy="104" r="74" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.10" />
      <circle cx="110" cy="104" r="92" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.07" />

      {variant === 0 && (
        <g>
          <g filter={`url(#${uid}-soft)`}>
            <rect x="40" y="58" width="140" height="98" rx="16" fill={`url(#${uid}-glass)`} stroke={`url(#${uid}-glassEdge)`} strokeWidth="1.2" />
          </g>
          <g opacity="0.55" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 5">
            <line x1="52" y1="82" x2="168" y2="82" />
            <line x1="52" y1="106" x2="168" y2="106" />
            <line x1="52" y1="130" x2="168" y2="130" />
          </g>
          <path d="M56 132 L76 122 L96 110 L116 116 L136 96 L156 84 L166 78 L166 146 L56 146 Z" fill={`url(#${uid}-area)`} />
          <g filter={`url(#${uid}-lift)`}>
            <g>
              <line x1="64" y1="112" x2="64" y2="140" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              <rect x="59.5" y="118" width="9" height="16" rx="2.5" fill={`url(#${uid}-red)`} />
            </g>
            <g>
              <line x1="84" y1="100" x2="84" y2="132" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
              <rect x="79.5" y="106" width="9" height="20" rx="2.5" fill={`url(#${uid}-green)`} />
            </g>
            <g>
              <line x1="104" y1="88" x2="104" y2="122" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
              <rect x="99.5" y="96" width="9" height="18" rx="2.5" fill={`url(#${uid}-green)`} />
            </g>
            <g>
              <line x1="124" y1="96" x2="124" y2="126" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              <rect x="119.5" y="102" width="9" height="16" rx="2.5" fill={`url(#${uid}-red)`} />
            </g>
            <g>
              <line x1="144" y1="74" x2="144" y2="108" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
              <rect x="139.5" y="82" width="9" height="20" rx="2.5" fill={`url(#${uid}-green)`} />
            </g>
          </g>
          <path d="M56 132 L76 122 L96 110 L116 116 L136 96 L156 84 L166 78" fill="none" stroke="#10b981" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${uid}-lift)`} />
          <circle cx="166" cy="78" r="9" fill="#10b981" opacity="0.25" />
          <circle cx="166" cy="78" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.6" />
          <g filter={`url(#${uid}-lift)`}>
            <rect x="128" y="150" width="64" height="26" rx="13" fill="#059669" />
            <path d="M140 166 L146 158 L152 163 L158 154" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="164" y="167" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fontWeight="700" fill="#ffffff">+18.4%</text>
          </g>
        </g>
      )}

      {variant === 1 && (
        <g>
          <g filter={`url(#${uid}-soft)`}>
            <rect x="36" y="52" width="120" height="112" rx="16" fill={`url(#${uid}-glass)`} stroke={`url(#${uid}-glassEdge)`} strokeWidth="1.2" />
          </g>
          <g opacity="0.5" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 5">
            <line x1="48" y1="78" x2="146" y2="78" />
            <line x1="48" y1="104" x2="146" y2="104" />
            <line x1="48" y1="130" x2="146" y2="130" />
          </g>
          <path d="M48 140 L72 118 L94 126 L118 92 L146 76 L146 152 L48 152 Z" fill={`url(#${uid}-area)`} />
          <path d="M48 140 L72 118 L94 126 L118 92 L146 76" fill="none" stroke="#10b981" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${uid}-lift)`} />
          <path d="M48 148 L78 138 L108 134 L146 112" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" opacity="0.85" />
          <g fill="#10b981" stroke="#ffffff" strokeWidth="1.4">
            <circle cx="72" cy="118" r="3" />
            <circle cx="118" cy="92" r="3" />
          </g>
          <circle cx="146" cy="76" r="8" fill="#10b981" opacity="0.25" />
          <circle cx="146" cy="76" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
          <g filter={`url(#${uid}-lift)`}>
            <rect x="126" y="34" width="58" height="30" rx="15" fill={`url(#${uid}-indigo)`} />
            <path d="M140 52 L147 43 L154 49 L161 40" stroke="#ffffff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M157 40 L161 40 L161 44" stroke="#ffffff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g filter={`url(#${uid}-lift)`}>
            <rect x="30" y="150" width="86" height="24" rx="12" fill="#ffffff" opacity="0.92" />
            <circle cx="44" cy="162" r="3.5" fill="#10b981" />
            <circle cx="58" cy="162" r="3.5" fill="#6366f1" opacity="0.8" />
            <rect x="68" y="158" width="38" height="7" rx="3.5" fill="#cbd5e1" />
          </g>
        </g>
      )}

      {variant === 2 && (
        <g>
          <g filter={`url(#${uid}-soft)`}>
            <circle cx="96" cy="106" r="58" fill={`url(#${uid}-glass)`} stroke={`url(#${uid}-glassEdge)`} strokeWidth="1.2" />
          </g>
          <circle cx="96" cy="106" r="40" fill="none" stroke="#10b981" strokeWidth="15" opacity="0.9" />
          <circle cx="96" cy="106" r="40" fill="none" stroke={`url(#${uid}-indigo)`} strokeWidth="15" strokeDasharray="78 173" strokeLinecap="butt" transform="rotate(-90 96 106)" />
          <circle cx="96" cy="106" r="40" fill="none" stroke="#f59e0b" strokeWidth="15" strokeDasharray="36 215" strokeLinecap="butt" transform="rotate(80 96 106)" />
          <circle cx="96" cy="106" r="40" fill="none" stroke="#ffffff" strokeWidth="15" strokeDasharray="4 247" strokeLinecap="butt" transform="rotate(-92 96 106)" opacity="0.9" />
          <circle cx="96" cy="106" r="40" fill="none" stroke="#ffffff" strokeWidth="15" strokeDasharray="4 247" strokeLinecap="butt" transform="rotate(78 96 106)" opacity="0.9" />
          <circle cx="96" cy="106" r="27" fill="#ffffff" opacity="0.96" filter={`url(#${uid}-lift)`} />
          <text x="96" y="103" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="15" fontWeight="800" fill="#0f172a">42%</text>
          <text x="96" y="117" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="8" fontWeight="600" fill="#64748b" letterSpacing="0.08em">LONG</text>
          <g filter={`url(#${uid}-lift)`}>
            <rect x="138" y="62" width="56" height="18" rx="9" fill="#ffffff" opacity="0.95" />
            <circle cx="149" cy="71" r="4" fill="#10b981" />
            <rect x="157" y="68" width="30" height="6" rx="3" fill="#cbd5e1" />
          </g>
          <g filter={`url(#${uid}-lift)`}>
            <rect x="146" y="88" width="56" height="18" rx="9" fill="#ffffff" opacity="0.95" />
            <circle cx="157" cy="97" r="4" fill="#6366f1" />
            <rect x="165" y="94" width="30" height="6" rx="3" fill="#cbd5e1" />
          </g>
          <g filter={`url(#${uid}-lift)`}>
            <rect x="140" y="114" width="56" height="18" rx="9" fill="#ffffff" opacity="0.95" />
            <circle cx="151" cy="123" r="4" fill="#f59e0b" />
            <rect x="159" y="120" width="30" height="6" rx="3" fill="#cbd5e1" />
          </g>
        </g>
      )}

      {variant === 3 && (
        <g>
          <g opacity="0.7" stroke="#6366f1" strokeWidth="1.4" strokeDasharray="3 5">
            <line x1="44" y1="60" x2="86" y2="86" />
            <line x1="176" y1="66" x2="136" y2="88" />
            <line x1="52" y1="152" x2="88" y2="126" />
            <line x1="170" y1="150" x2="134" y2="124" />
          </g>
          <g filter={`url(#${uid}-lift)`}>
            <circle cx="40" cy="56" r="11" fill="#ffffff" />
            <circle cx="40" cy="56" r="5" fill="#10b981" />
          </g>
          <g filter={`url(#${uid}-lift)`}>
            <circle cx="180" cy="62" r="11" fill="#ffffff" />
            <circle cx="180" cy="62" r="5" fill="#6366f1" />
          </g>
          <g filter={`url(#${uid}-lift)`}>
            <circle cx="48" cy="156" r="11" fill="#ffffff" />
            <circle cx="48" cy="156" r="5" fill="#f59e0b" />
          </g>
          <g filter={`url(#${uid}-lift)`}>
            <circle cx="174" cy="154" r="11" fill="#ffffff" />
            <circle cx="174" cy="154" r="5" fill="#10b981" />
          </g>
          <ellipse cx="110" cy="140" rx="46" ry="10" fill="#0f172a" opacity="0.12" />
          <g filter={`url(#${uid}-soft)`}>
            <circle cx="110" cy="104" r="46" fill={`url(#${uid}-coin)`} />
          </g>
          <circle cx="110" cy="104" r="46" fill="none" stroke="#92400e" strokeWidth="1.5" opacity="0.55" />
          <circle cx="110" cy="104" r="37" fill="none" stroke="#fef3c7" strokeWidth="2" opacity="0.75" />
          <path d="M110 58 a46 46 0 0 1 40 23 a52 52 0 0 0 -80 0 a46 46 0 0 1 40 -23" fill={`url(#${uid}-coinShine)`} />
          <text x="110" y="120" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="44" fontWeight="800" fill="#7c2d12">₿</text>
          <g filter={`url(#${uid}-lift)`}>
            <rect x="128" y="140" width="60" height="26" rx="13" fill="#059669" />
            <path d="M140 156 L146 148 L152 153 L158 144" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="163" y="157" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fontWeight="700" fill="#ffffff">+6.2%</text>
          </g>
        </g>
      )}
    </svg>
  );
}
