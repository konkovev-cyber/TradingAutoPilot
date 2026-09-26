import { Link } from 'react-router-dom';
import { bots } from '@/data/bots';

const exchanges = ['BYBIT', 'Binance', 'OKX', 'BingX', 'Gate.io', 'HTX', 'Bitget', 'KuCoin', 'Bitfinex', 'Kraken', 'MEXC', 'Coinbase', 'WhiteBIT', 'Bybit'];

export default function Footer() {
  return (
    <footer className="py-12 border-t border-[var(--border)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 64 64" className="shrink-0">
                <defs>
                  <linearGradient id="lgF" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00FFB2" />
                    <stop offset="100%" stopColor="#00D4FF" />
                  </linearGradient>
                </defs>
                <rect width="64" height="64" rx="14" fill="rgba(0,255,178,0.08)" stroke="url(#lgF)" strokeWidth="2" />
                <path d="M16 40 L24 28 L32 34 L40 20 L48 26" stroke="url(#lgF)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="48" cy="26" r="4" fill="#00FFB2" />
              </svg>
              <span className="text-lg font-display font-bold text-[var(--text)]">
                Coin<span className="text-[var(--primary)]">soft</span>er
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Торговые роботы для криптовалют и международных акций.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-[var(--text)] mb-4 text-sm">Роботы</h4>
            <ul className="space-y-2">
              {bots.map((b) => (
                <li key={b.slug}>
                  <Link to={`/bots/${b.slug}`} className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-[var(--text)] mb-4 text-sm">Поддержка</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li><a href="#faq" className="hover:text-[var(--text)] transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-[var(--text)] transition-colors">Telegram</a></li>
              <li><a href="#" className="hover:text-[var(--text)] transition-colors">База знаний</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-[var(--text)] mb-4 text-sm">Биржи</h4>
            <div className="flex flex-wrap gap-1.5">
              {exchanges.map((e) => (
                <span key={e} className="text-[11px] text-[var(--text-muted)] bg-[var(--surface)] px-2 py-1 rounded-lg border border-[var(--border)]">
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-7 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[var(--text-subtle)]"> 2025 Coinsofter. Все права защищены.</p>
          <p className="text-xs text-[var(--text-subtle)] max-w-xl sm:text-right">
            Торговля криптовалютами связана с риском. Прошлые результаты не гарантируют будущую доходность.
          </p>
        </div>
      </div>
    </footer>
  );
}
