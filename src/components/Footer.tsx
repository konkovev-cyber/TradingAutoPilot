import { Link } from 'react-router-dom';
import { Send, Twitter, Youtube, Globe } from 'lucide-react';
import { useState } from 'react';

const columns = [
  {
    title: 'Продукты',
    links: [
      { label: 'Grid Bot', href: '/bots/grid-bot' },
      { label: 'DCA Bot', href: '/bots/dca-bot' },
      { label: 'AI Signal Bot', href: '/bots/ai-signal-bot' },
    ],
  },
  {
    title: 'Компания',
    links: [
      { label: 'О нас', href: '#' },
      { label: 'Блог', href: '#' },
      { label: 'Карьера', href: '#' },
    ],
  },
  {
    title: 'Поддержка',
    links: [
      { label: 'База знаний', href: '#' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Связаться', href: '#' },
    ],
  },
  {
    title: 'Документы',
    links: [
      { label: 'Условия использования', href: '#' },
      { label: 'Политика конфиденциальности', href: '#' },
      { label: 'Дисклеймер', href: '#' },
    ],
  },
];

export default function Footer() {
  const [lang, setLang] = useState<'RU' | 'EN'>('RU');

  return (
    <footer id="support" className="border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <svg width="32" height="32" viewBox="0 0 64 64">
                <defs>
                  <linearGradient id="footer-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00FFB2" />
                    <stop offset="100%" stopColor="#00D4FF" />
                  </linearGradient>
                </defs>
                <rect width="64" height="64" rx="14" fill="rgba(0,255,178,0.08)" />
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
              <span className="text-xl font-display font-bold text-[#E6EDF7]">
                Coinsofter
              </span>
            </Link>
            <p className="text-sm text-[#8B95A7] max-w-xs mb-6">
              Платформа автоматизированной торговли на криптобиржах. Боты 24/7,
              комиссия только с прибыли.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-[#8B95A7] hover:text-[#00FFB2] transition-colors">
                <Send size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-[#8B95A7] hover:text-[#00FFB2] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-[#8B95A7] hover:text-[#00FFB2] transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-[#E6EDF7] mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} className="text-sm text-[#8B95A7] hover:text-[#E6EDF7] transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-[#8B95A7] hover:text-[#E6EDF7] transition-colors">
                        {link.label}
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
          <div className="text-xs text-[#8B95A7]">
            © 2025 Coinsofter. Все права защищены.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')}
              className="flex items-center gap-1.5 text-xs text-[#8B95A7] hover:text-[#E6EDF7] transition-colors"
            >
              <Globe size={14} />
              <span className="font-medium">{lang}</span>
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-[#8B95A7]/60 text-center max-w-3xl mx-auto leading-relaxed">
          Торговля криптовалютами связана с риском. Прошлая доходность не
          гарантирует будущую прибыль. Coinsofter не является финансовым
          консультантом. Решения о торговле вы принимаете самостоятельно.
        </p>
      </div>
    </footer>
  );
}
