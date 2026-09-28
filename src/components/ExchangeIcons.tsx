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