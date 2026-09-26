import { Link } from 'react-router-dom';
import { Send, Twitter, Youtube, Mail, ChevronRight, Globe } from 'lucide-react';
import { useState } from 'react';

const columns = [
  {
    title: 'родукты',
    links: [
      { label: 'Grid Bot', href: '/bots/grid-bot' },
      { label: 'DCA Bot', href: '/bots/dca-bot' },
      { label: 'AI Signal Bot', href: '/bots/ai-signal-bot' },
    ],
  },
  {
    title: 'омпания',
    links: [
      { label: ' нас', href: '#' },
      { label: 'лог', href: '#' },
      { label: 'арьера', href: '#' },
    ],
  },
  {
    title: 'оддержка',
    links: [
      { label: 'аза знаний', href: '#' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Связаться с нами', href: '#' },
    ],
  },
  {
    title: 'окументы',
    links: [
      { label: 'словия использования', href: '#' },
      { label: 'олитика конфиденциальности', href: '#' },
      { label: 'исклеймер', href: '#' },
    ],
  },
];

export default function Footer() {
  const [lang, setLang] = useState<'RU' | 'EN'>('RU');

  return (
    <footer id="support" className="relative border-t border-white/5 pt-16 pb-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-[#00FFB2]/3 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-40 bg-[#7B61FF]/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <svg width="32" height="32" viewBox="0 0 64 64" className="shrink-0">
                <defs>
                  <linearGradient id="footer-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00FFB2" />
                    <stop offset="100%" stopColor="#00D4FF" />
                  </linearGradient>
                </defs>
                <rect width="64" height="64" rx="16" fill="rgba(0,255,178,0.08)" />
                <path
                  d="M16 40 L24 28 L32 34 L40 20 L48 26"
                  stroke="url(#footer-grad)"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="48" cy="26" r="4" fill="#00FFB2" />
              </svg>
              <span className="text-lg font-display font-bold text-[#F1F5F9]">
                Coin<span className="text-[#00FFB2]">soft</span>er
              </span>
            </Link>
            <p className="text-sm text-[#64748B] max-w-xs mb-6 leading-relaxed">
              латформа автоматизированной торговли на криптобиржах. оты 24/7, комиссия только с прибыли.
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: Send, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Youtube, href: '#' },
                { icon: Mail, href: '#' },
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[#64748B] hover:text-[#00FFB2] hover:border-[#00FFB2]/20 transition-all duration-200"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-[#F1F5F9] mb-4 uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} className="text-sm text-[#64748B] hover:text-[#00FFB2] transition-colors flex items-center gap-1 group">
                        {link.label}
                        <ChevronRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-[#64748B] hover:text-[#00FFB2] transition-colors flex items-center gap-1 group">
                        {link.label}
                        <ChevronRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#64748B]">
             2025 Coinsofter. се права защищены.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')}
              className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#F1F5F9] transition-colors"
            >
              <Globe size={14} />
              <span className="font-medium">{lang}</span>
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-[#64748B]/50 text-center max-w-3xl mx-auto leading-relaxed">
          Торговля криптовалютами связана с риском. рошлая доходность не гарантирует будущую прибыль. Coinsofter не является финансовым консультантом. ешения о торговле вы принимаете самостоятельно.
        </p>
      </div>
    </footer>
  );
}
