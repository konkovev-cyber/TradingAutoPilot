import { motion } from 'framer-motion';

const exchanges = ['Binance', 'Bybit', 'OKX', 'BingX', 'Gate.io', 'HTX', 'Bitget', 'KuCoin'];

export default function Footer() {
  return (
    <footer className="py-12 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 64 64" className="shrink-0">
                <defs>
                  <linearGradient id="logo-grad-footer" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00FFB2" />
                    <stop offset="100%" stopColor="#00D4FF" />
                  </linearGradient>
                </defs>
                <rect width="64" height="64" rx="16" fill="rgba(0,255,178,0.08)" stroke="url(#logo-grad-footer)" strokeWidth="2" />
                <path d="M16 40 L24 28 L32 34 L40 20 L48 26" stroke="url(#logo-grad-footer)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="48" cy="26" r="4" fill="#00FFB2" />
              </svg>
              <span className="text-lg font-display font-bold text-[var(--text)]">Coin<span className="text-[var(--primary)]">soft</span>er</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">Автоматизированная торговля криптовалютой</p>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-[var(--text)] mb-4">Боты</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li><a href="/#bots" className="hover:text-[var(--text)] transition-colors">Grid Bot</a></li>
              <li><a href="/#bots" className="hover:text-[var(--text)] transition-colors">DCA Bot</a></li>
              <li><a href="/#bots" className="hover:text-[var(--text)] transition-colors">AI Signal Bot</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-[var(--text)] mb-4">Поддержка</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li><a href="/#faq" className="hover:text-[var(--text)] transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-[var(--text)] transition-colors">Telegram</a></li>
              <li><a href="#" className="hover:text-[var(--text)] transition-colors">Email</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-[var(--text)] mb-4">Биржи</h4>
            <div className="flex flex-wrap gap-2">
              {exchanges.map((ex) => (
                <span key={ex} className="text-xs text-[var(--text-muted)] bg-[var(--white-5)] px-2 py-1 rounded-lg">{ex}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--text-subtle)]"> 2025 Coinsofter. Все права защищены.</p>
          <div className="flex gap-6 text-sm text-[var(--text-subtle)]">
            <a href="#" className="hover:text-[var(--text)] transition-colors">Условия</a>
            <a href="#" className="hover:text-[var(--text)] transition-colors">Конфиденциальность</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
