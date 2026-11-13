import { motion } from "framer-motion";

interface BenefitVisualProps {
  index: number;
  name?: string;
  className?: string;
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <defs>
        <linearGradient id="bv-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#f0fdf4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#dcfce7" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="bv-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#86efac" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="bv-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="bv-gold" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="bv-indigo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <filter id="bv-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#14532d" floodOpacity="0.22" />
        </filter>
        <filter id="bv-lift" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.22" />
        </filter>
      </defs>
      <g filter="url(#bv-shadow)">
        <rect x="10" y="10" width="120" height="120" rx="26" fill="url(#bv-glass)" stroke="url(#bv-edge)" strokeWidth="1.2" />
      </g>
      {children}
    </>
  );
}

export const BENEFIT_VISUAL_LABELS = [
  "₿ Монета",
  "Биржи",
  "Интерфейс",
  "Щит",
  "База знаний",
  "Поддержка",
];

export function BenefitVisual({ index, name, className = "" }: BenefitVisualProps) {
  const explicit = Number.parseInt(String(name ?? ""), 10);
  const variant = Number.isFinite(explicit) ? ((explicit % 6) + 6) % 6 : ((index % 6) + 6) % 6;

  return (
    <svg viewBox="0 0 140 140" className={className} role="img" aria-hidden="true">
      {variant === 0 && (
        <g>
          <Frame>
            <circle cx="70" cy="66" r="30" fill="url(#bv-gold)" filter="url(#bv-lift)" />
            <circle cx="70" cy="66" r="30" fill="none" stroke="#92400e" strokeWidth="1.2" opacity="0.5" />
            <circle cx="70" cy="66" r="23" fill="none" stroke="#fef3c7" strokeWidth="1.6" opacity="0.75" />
            <text x="70" y="77" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="28" fontWeight="800" fill="#7c2d12">₿</text>
            <g filter="url(#bv-lift)">
              <circle cx="104" cy="96" r="17" fill="url(#bv-green)" />
              <path d="M96 96 L102 102 L113 89" stroke="#ffffff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g opacity="0.85">
              <path d="M30 104 L38 96 M34 104 L34 96" stroke="#059669" strokeWidth="0" />
              <text x="26" y="112" fontFamily="Inter, system-ui, sans-serif" fontSize="13" fontWeight="800" fill="#059669">0₽</text>
              <text x="26" y="122" fontFamily="Inter, system-ui, sans-serif" fontSize="7" fontWeight="700" fill="#64748b" letterSpacing="0.1em">ПОДПИСКА</text>
            </g>
          </Frame>
        </g>
      )}

      {variant === 1 && (
        <g>
          <Frame>
            <ellipse cx="70" cy="102" rx="34" ry="7" fill="#0f172a" opacity="0.10" />
            <g filter="url(#bv-lift)">
              <rect x="46" y="30" width="48" height="60" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="52" y="38" width="36" height="8" rx="4" fill="#e2e8f0" />
              <rect x="52" y="52" width="22" height="6" rx="3" fill="#dcfce7" />
              <rect x="52" y="64" width="30" height="6" rx="3" fill="#e2e8f0" />
              <rect x="52" y="76" width="18" height="6" rx="3" fill="#dcfce7" />
            </g>
            <g filter="url(#bv-lift)">
              <rect x="24" y="52" width="34" height="22" rx="11" fill="url(#bv-green)" />
              <text x="41" y="67" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="10" fontWeight="800" fill="#ffffff">BYBIT</text>
            </g>
            <g filter="url(#bv-lift)">
              <rect x="82" y="70" width="30" height="22" rx="11" fill="url(#bv-indigo)" />
              <text x="97" y="85" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fontWeight="800" fill="#ffffff">OKX</text>
            </g>
            <g filter="url(#bv-lift)">
              <rect x="78" y="26" width="34" height="20" rx="10" fill="#f59e0b" />
              <text x="95" y="40" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fontWeight="800" fill="#ffffff">BINGX</text>
            </g>
          </Frame>
        </g>
      )}

      {variant === 2 && (
        <g>
          <Frame>
            <g filter="url(#bv-lift)">
              <rect x="34" y="34" width="72" height="52" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="34" y="34" width="72" height="12" rx="8" fill="#e2e8f0" />
              <circle cx="42" cy="40" r="2" fill="#f87171" />
              <circle cx="49" cy="40" r="2" fill="#fbbf24" />
              <circle cx="56" cy="40" r="2" fill="#34d399" />
              <rect x="42" y="54" width="26" height="6" rx="3" fill="#dcfce7" />
              <rect x="42" y="66" width="44" height="6" rx="3" fill="#e2e8f0" />
              <rect x="42" y="76" width="34" height="6" rx="3" fill="#e2e8f0" />
            </g>
            <g filter="url(#bv-lift)">
              <circle cx="94" cy="90" r="15" fill="url(#bv-green)" />
              <path d="M88 86 L101 86 L94.5 99 Z" fill="#ffffff" transform="rotate(-15 94 90)" />
            </g>
            <g opacity="0.9">
              <rect x="26" y="96" width="40" height="16" rx="8" fill="#ffffff" filter="url(#bv-lift)" />
              <circle cx="36" cy="104" r="3.5" fill="#10b981" />
              <rect x="43" y="101" width="17" height="6" rx="3" fill="#cbd5e1" />
            </g>
          </Frame>
        </g>
      )}

      {variant === 3 && (
        <g>
          <Frame>
            <g filter="url(#bv-lift)">
              <path d="M70 26 L102 38 V66 C102 86 88 98 70 106 C52 98 38 86 38 66 V38 Z" fill="url(#bv-glass)" stroke="url(#bv-edge)" strokeWidth="1.4" />
              <path d="M70 26 L102 38 V66 C102 86 88 98 70 106 Z" fill="#10b981" opacity="0.14" />
            </g>
            <g filter="url(#bv-lift)">
              <rect x="56" y="56" width="28" height="24" rx="6" fill="url(#bv-green)" />
              <path d="M62 56 V50 a8 8 0 0 1 16 0 V56" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              <circle cx="70" cy="66" r="3.4" fill="#ffffff" />
              <rect x="68.6" y="66" width="2.8" height="7" rx="1.4" fill="#ffffff" />
            </g>
            <g opacity="0.9" filter="url(#bv-lift)">
              <rect x="80" y="88" width="34" height="16" rx="8" fill="#ffffff" />
              <path d="M88 96 L92 100 L99 91" stroke="#10b981" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="103" y="93" width="7" height="6" rx="3" fill="#cbd5e1" />
            </g>
          </Frame>
        </g>
      )}

      {variant === 4 && (
        <g>
          <Frame>
            <g filter="url(#bv-lift)">
              <rect x="30" y="40" width="52" height="64" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" transform="rotate(-6 56 72)" />
              <rect x="38" y="52" width="34" height="5" rx="2.5" fill="#dcfce7" transform="rotate(-6 56 72)" />
              <rect x="38" y="62" width="34" height="5" rx="2.5" fill="#e2e8f0" transform="rotate(-6 56 72)" />
              <rect x="38" y="72" width="24" height="5" rx="2.5" fill="#e2e8f0" transform="rotate(-6 56 72)" />
              <rect x="38" y="82" width="30" height="5" rx="2.5" fill="#e2e8f0" transform="rotate(-6 56 72)" />
            </g>
            <g filter="url(#bv-lift)">
              <rect x="58" y="34" width="52" height="64" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" transform="rotate(6 84 66)" />
              <rect x="66" y="46" width="34" height="5" rx="2.5" fill="#e2e8f0" transform="rotate(6 84 66)" />
              <rect x="66" y="56" width="28" height="5" rx="2.5" fill="#dcfce7" transform="rotate(6 84 66)" />
              <rect x="66" y="66" width="34" height="5" rx="2.5" fill="#e2e8f0" transform="rotate(6 84 66)" />
              <rect x="66" y="76" width="22" height="5" rx="2.5" fill="#e2e8f0" transform="rotate(6 84 66)" />
            </g>
            <g filter="url(#bv-lift)">
              <circle cx="100" cy="98" r="15" fill="url(#bv-indigo)" />
              <circle cx="96" cy="95" r="4" fill="#ffffff" opacity="0.9" />
              <circle cx="105" cy="95" r="4" fill="#ffffff" opacity="0.6" />
              <path d="M92 104 a5 5 0 0 1 8 0 M100 104 a5 5 0 0 1 8 0" stroke="#ffffff" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.9" />
            </g>
          </Frame>
        </g>
      )}

      {variant === 5 && (
        <g>
          <Frame>
            <g filter="url(#bv-lift)">
              <path d="M40 78 v-8 a30 30 0 0 1 60 0 v8" fill="none" stroke="url(#bv-indigo)" strokeWidth="9" strokeLinecap="round" />
              <rect x="32" y="72" width="14" height="24" rx="7" fill="url(#bv-green)" />
              <rect x="94" y="72" width="14" height="24" rx="7" fill="url(#bv-green)" />
            </g>
            <g filter="url(#bv-lift)">
              <path d="M100 92 q-2 12 -16 14" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
              <rect x="60" y="100" width="30" height="16" rx="8" fill="url(#bv-green)" />
              <circle cx="68" cy="108" r="2" fill="#ffffff" />
              <circle cx="75" cy="108" r="2" fill="#ffffff" />
              <circle cx="82" cy="108" r="2" fill="#ffffff" />
            </g>
            <g opacity="0.95" filter="url(#bv-lift)">
              <rect x="26" y="34" width="44" height="20" rx="10" fill="#ffffff" />
              <path d="M38 42 a6 6 0 1 1 0.01 0 M38 48 v4 M34 50 h8" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
              <text x="50" y="48" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fontWeight="800" fill="#059669">24/7</text>
            </g>
          </Frame>
        </g>
      )}
    </svg>
  );
}
