import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollTop}
      className={`fixed bottom-6 right-6 z-[70] w-12 h-12 rounded-full glass-strong flex items-center justify-center text-[var(--primary)] shadow-lg transition-all duration-300 hover:scale-110 hover:border-[var(--border-hover)] ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      title="Наверх"
      aria-label="Наверх"
    >
      <ArrowUp size={20} />
    </button>
  );
}
