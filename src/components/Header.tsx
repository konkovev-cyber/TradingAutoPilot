import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Coinsofter</span>
        </div>
        <nav>
          {/* нопка ичный кабинет удалена по запросу */}
        </nav>
      </div>
    </header>
  );
}
