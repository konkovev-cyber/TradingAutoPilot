import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { MessageCircle, X, ArrowUp, Send } from 'lucide-react';

export default function FloatingContact() {
  const { t } = useI18n();
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
        <div className="fixed bottom-24 right-5 z-[70] flex flex-col gap-2">
          <a
            href="https://t.me/coinsofter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-md hover:shadow-lg transition-all"
          >
            <span className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Send size={18} className="text-brand-blue" />
            </span>
            <span>
              <span className="block text-xs text-gray-400">{t("contact.writeIn")}</span>
              <span className="text-sm font-semibold text-gray-900">Telegram</span>
            </span>
          </a>
          <a
            href="https://wa.me/71234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-md hover:shadow-lg transition-all"
          >
            <span className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <MessageCircle size={18} className="text-green-600" />
            </span>
            <span>
              <span className="block text-xs text-gray-400">{t("contact.writeIn")}</span>
              <span className="text-sm font-semibold text-gray-900">WhatsApp</span>
            </span>
          </a>
        </div>
      )}

      {/* Back to top */}
      <button
        onClick={top}
        className={`fixed bottom-24 right-5 z-[70] w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-md transition-all duration-300 hover:text-gray-900 hover:shadow-lg ${
          showTop && !open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        title={t("contact.up")}
        aria-label={t("contact.up")}
      >
        <ArrowUp size={18} />
      </button>

      {/* Main chat FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-[70] w-14 h-14 rounded-full bg-brand-blue flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
        title={t("contact.open")}
        aria-label={t("contact.open")}
      >
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>
    </>
  );
}
