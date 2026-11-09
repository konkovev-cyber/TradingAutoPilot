import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, LayoutList, Bot, MessageSquare, FileText, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const navItems = [
  { path: "/admin", label: "Обзор", desc: "Сколько заявок пришло и их состояния", icon: LayoutDashboard },
  { path: "/admin/sections", label: "Секции", desc: "Порядок и видимость блоков на сайте", icon: LayoutList },
  { path: "/admin/bots", label: "Роботы", desc: "Добавление и редактирование ботов", icon: Bot },
  { path: "/admin/leads", label: "Заявки", desc: "Обращения с формы на сайте", icon: MessageSquare, badge: true },
  { path: "/admin/settings", label: "Контент", desc: "Тексты и настройки Telegram", icon: FileText },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          if (typeof data?.newLeads === "number") {
            setNewLeadsCount(data.newLeads);
          }
        }
      } catch {
        // ignore
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 20000); // refresh every 20s
    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-800 rounded-lg text-white"
        aria-label="Меню"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 z-40 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Trading Auto Pilot" className="h-10 w-auto" />
            <div>
              <div className="text-white font-bold">Trading Auto Pilot</div>
              <div className="text-xs text-gray-500">Панель управления</div>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1" aria-label="Разделы панели">
          {navItems.map(({ path, label, desc, icon: Icon, badge }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                location.pathname === path
                  ? "bg-brand-blue/10 text-brand-blue"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={20} className="mt-0.5 shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="flex items-center justify-between gap-1">
                  <span className="block font-medium truncate">{label}</span>
                  {badge && newLeadsCount > 0 && (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-500 text-white animate-pulse">
                      {newLeadsCount}
                    </span>
                  )}
                </span>
                <span className={`block text-xs leading-snug ${location.pathname === path ? "text-blue-300/60" : "text-gray-500"}`}>
                  {desc}
                </span>
              </span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white text-sm mb-2">
            <ExternalLink size={16} /> Открыть сайт
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}
