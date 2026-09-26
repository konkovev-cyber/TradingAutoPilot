import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
}: CounterProps) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  const formatted = display.toLocaleString('ru-RU');

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
