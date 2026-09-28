import type { ReactNode } from "react";

interface IconProps {
  className?: string;
}

function S({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function BybitIcon({ className }: IconProps) {
  return (
    <S className={className}>
      <rect x="3.5" y="3.5" width="12.5" height="7.5" rx="2.4" />
      <rect x="8" y="13" width="12.5" height="7.5" rx="2.4" />
    </S>
  );
}

export function BinanceIcon({ className }: IconProps) {
  return (
    <S className={className}>
      <path d="M12 3.2 14.3 5.5 12 7.8 9.7 5.5 12 3.2Z" />
      <path d="M12 16.2 14.3 18.5 12 20.8 9.7 18.5 12 16.2Z" />
      <path d="M4.2 9.2 6.5 11.5 4.2 13.8 1.9 11.5 4.2 9.2Z" />
      <path d="M19.8 9.2 22.1 11.5 19.8 13.8 17.5 11.5 19.8 9.2Z" />
      <path d="M12 9.7 14.3 12 12 14.3 9.7 12 12 9.7Z" />
    </S>
  );
}

export function OkxIcon({ className }: IconProps) {
  return (
    <S className={className}>
      <rect x="3" y="3" width="5.6" height="5.6" rx="1.1" />
      <rect x="15.4" y="3" width="5.6" height="5.6" rx="1.1" />
      <rect x="9.2" y="9.2" width="5.6" height="5.6" rx="1.1" />
      <rect x="3" y="15.4" width="5.6" height="5.6" rx="1.1" />
      <rect x="15.4" y="15.4" width="5.6" height="5.6" rx="1.1" />
    </S>
  );
}

export function BingxIcon({ className }: IconProps) {
  return (
    <S className={className}>
      <path d="M4 5.5 12 12l8-6.5" />
      <path d="M4 18.5 12 12l8 6.5" />
    </S>
  );
}

export function MexcIcon({ className }: IconProps) {
  return (
    <S className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M7.4 16V8l4.6 5 4.6-5v8" />
    </S>
  );
}

export function GateIcon({ className }: IconProps) {
  return (
    <S className={className}>
      <path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z" />
      <circle cx="12" cy="12" r="2.6" />
    </S>
  );
}

export function HtxIcon({ className }: IconProps) {
  return (
    <S className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.6 8.6 15.4 15.4M15.4 8.6 8.6 15.4" />
    </S>
  );
}

export function BitgetIcon({ className }: IconProps) {
  return (
    <S className={className}>
      <path d="M12 3 20 6v6.2c0 5-3.4 8-8 8.8-4.6-.8-8-3.8-8-8.8V6l8-3Z" />
      <path d="M8.6 12h6.8" />
    </S>
  );
}

export function KucoinIcon({ className }: IconProps) {
  return (
    <S className={className}>
      <path d="M8 3h8l5 5v8l-5 5H8l-5-5V8l5-5Z" />
      <path d="M10 9v6M10 12l4-3M10 12l4 3" />
    </S>
  );
}

export function BitfinexIcon({ className }: IconProps) {
  return (
    <S className={className}>
      <path d="M12 3 21 12l-9 9-9-9 9-9Z" />
      <path d="M12 8v8" />
    </S>
  );
}

export function KrakenIcon({ className }: IconProps) {
  return (
    <S className={className}>
      <path d="M12 3.4c3.4 3.9 6 6.9 6 9.9a6 6 0 1 1-12 0c0-3 2.6-6 6-9.9Z" />
      <path d="M9.4 14.2h5.2" />
    </S>
  );
}

export function CoinbaseIcon({ className }: IconProps) {
  return (
    <S className={className}>
      <circle cx="12" cy="12" r="9" />
      <rect x="9" y="9.8" width="6" height="4.4" rx="1.2" />
    </S>
  );
}

export function WhitebitIcon({ className }: IconProps) {
  return (
    <S className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M7 9.2l2 6 3-4 3 4 2-6" />
    </S>
  );
}