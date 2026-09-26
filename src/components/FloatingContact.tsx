import { useEffect, useState } from 'react';
import { MessageCircle, X, ArrowUp, Send } from 'lucide-react';

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const top = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* Chat expand panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[70] flex flex-col gap-2 animate-slide-up">
          <a
            href="https://t.me/coinsofter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 glass-strong rounded-2xl px-4 py-3 shadow-lg hover:scale-105 transition-transform"
          >
            <span className="w-10 h-10 rounded-full bg-[#229ED9]/15 flex items-center justify-center shrink-0">
              <Send size={18} className="text-[#229ED9]" />
            </span>
            <span>
              <span className="block text-xs text-[var(--text-subtle)]">Написать в</span>
              <span className="text-sm font-semibold text-[var(--text)]">Telegram</span>
            </span>
          </a>
          <a
            href="https://wa.me/71234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 glass-strong rounded-2xl px-4 py-3 shadow-lg hover:scale-105 transition-transform"
          >
            <span className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center shrink-0">
              <MessageCircle size={18} className="text-[#25D366]" />
            </span>
            <span>
              <span className="block text-xs text-[var(--text-subtle)]">Написать в</span>
              <span className="text-sm font-semibold text-[var(--text)]">WhatsApp</span>
            </span>
          </a>
        </div>
      )}

      {/* Back to top */}
      <button
        onClick={top}
        className={`fixed bottom-24 right-5 z-[70] w-11 h-11 rounded-full glass-strong flex items-center justify-center text-[var(--primary)] shadow-lg transition-all duration-300 hover:scale-110 ${
          showTop && !open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        title="Наверх"
        aria-label="Наверх"
      >
        <ArrowUp size={18} />
      </button>

      {/* Main chat FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-[70] w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #00FFB2, #00D4FF)' }}
        title="Связаться с нами"
        aria-label="Связаться с нами"
      >
        {open ? <X size={22} className="text-[#04121C]" /> : <MessageCircle size={22} className="text-[#04121C]" />}
      </button>
    </>
  );
}
