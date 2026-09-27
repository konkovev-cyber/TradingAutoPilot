import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, MessageSquare, TrendingUp, Clock, Eye, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

interface Lead {
  id: string;
  name: string;
  contact: string;
  message: string | null;
  status: string;
  created_at: string;
}

interface Stats {
  totalLeads: number;
  newLeads: number;
  botsCount: number | null;
  todayLeads: number;
  views7d: number;
  viewsTotal: number | null;
}

const CARD_STYLES: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-500",
  green: "bg-green-500/10 text-green-500",
  purple: "bg-purple-500/10 text-purple-500",
  orange: "bg-orange-500/10 text-orange-500",
  pink: "bg-pink-500/10 text-pink-500",
};

const STATUS_LABELS: Record<string, string> = {
  new: "новая",
  read: "прочитана",
  replied: "отвечена",
  converted: "куплено",
};

function statusStyle(status: string): string {
  if (status === "new") return "bg-green-500/10 text-green-400";
  if (status === "read") return "bg-blue-500/10 text-blue-400";
  if (status === "replied") return "bg-purple-500/10 text-purple-400";
  if (status === "converted") return "bg-orange-500/10 text-orange-400";
  return "bg-gray-500/10 text-gray-400";
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalLeads: 0, newLeads: 0, botsCount: null, todayLeads: 0, views7d: 0, viewsTotal: null });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [viewsChart, setViewsChart] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<string>("");
  const [authInfo, setAuthInfo] = useState<{ email: string; isAdmin: boolean } | null>(null);

  const load = async () => {
    if (!supabase) {
      setError("Supabase не подключён  проверьте VITE_SUPABASE_URL в переменных окружения");
      setLoading(false);
      return;
    }
    // Диагностика: кто залогинен и есть ли права админа
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let admin = false;
      if (session?.user) {
        const { data: roleData } = await supabase.rpc("is_admin");
        admin = Boolean(roleData);
      }
      setAuthInfo({ email: session?.user?.email ?? "не залогинен", isAdmin: admin });
      setDebug(`User: ${session?.user?.email ?? "none"} | Admin: ${admin} | Session: ${!!session?.user}`);
    } catch {
      setAuthInfo({ email: "неизвестно", isAdmin: false });
    }
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
try {
    const [leadsRes, botsRes, viewsRes, totalViewsRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("bots").select("id", { count: "exact", head: true }),
      supabase.from("page_views").select("created_at").gte("created_at", weekAgo),
      supabase.from("page_views").select("id", { count: "exact", head: true }),
    ]);
    if (leadsRes.error) throw new Error("Заявки: " + leadsRes.error.message);
    if (botsRes.error) throw new Error("Роботы: " + botsRes.error.message);
    if (viewsRes.error) throw new Error("Просмотры: " + viewsRes.error.message);
    if (totalViewsRes.error) throw new Error("Просмотры (всего): " + totalViewsRes.error.message);
    const leads: Lead[] = (leadsRes.data as Lead[]) ?? [];
    const views: string[] = (viewsRes.data ?? []).map((v: { created_at: string }) => v.created_at);

    // Просмотры по дням за последние 7 дней (UTC)
    const dayKeys: string[] = [];
    for (let i = 6; i >= 0; i--) {
      dayKeys.push(new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    }
    setViewsChart(dayKeys.map((k) => views.filter((v) => v.slice(0, 10) === k).length));

    setStats({
      totalLeads: leads.length,
      newLeads: leads.filter((l) => l.status === "new").length,
      botsCount: botsRes.count,
      todayLeads: leads.filter((l) => l.created_at >= dayAgo).length,
      views7d: views.length,
      viewsTotal: totalViewsRes.count,
    });
    setRecentLeads(leads.slice(0, 5));
    setError(null);
} catch (e) {
    setError(e instanceof Error ? e.message : "Ошибка загрузки данных");
}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="text-white">Загрузка...</div>;

  const statCards = [
    { label: "Всего заявок", hint: "За всё время", value: stats.totalLeads.toString(), icon: Users, color: "blue" },
    { label: "Новые заявки", hint: "Ещё не обработаны", value: stats.newLeads.toString(), icon: MessageSquare, color: "green" },
    { label: "Заявки за сутки", hint: "За последние 24 часа", value: stats.todayLeads.toString(), icon: Clock, color: "purple" },
    { label: "Роботы", hint: "Опубликовано на сайте", value: (stats.botsCount ?? 0).toString(), icon: TrendingUp, color: "orange" },
    { label: "Просмотры", hint: "За последние 7 дней", value: stats.views7d.toString(), icon: Eye, color: "pink" },
  ];

  const maxViews = Math.max(1, ...viewsChart);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Обзор</h1>
          <p className="text-gray-400 text-sm mt-1">
            Общая статистика: заявки посетителей, просмотры сайта и опубликованные роботы.
          </p>
        </div>
        <button onClick={() => { setRefreshing(true); load(); }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors">
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Обновить
        </button>
      </div>

      {!authInfo?.isAdmin && authInfo && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-yellow-400 text-2xl"></span>
            <div>
              <div className="font-semibold text-yellow-200">Нет прав администратора</div>
              <p className="text-yellow-200/80 text-sm mt-1">
                Ваша учётная запись <code className="bg-yellow-500/20 px-1 rounded">{authInfo.email}</code> не имеет роли admin.
              </p>
              <p className="text-yellow-200/80 text-sm mt-2">
                Чтобы получить доступ, выполните SQL в{' '}
                <a href="https://app.supabase.com/project/zsupqrsnnegeclrlvlqg/sql" target="_blank" rel="noreferrer"
                   className="text-yellow-300 underline hover:text-yellow-100">
                  Supabase SQL Editor
                </a>:
              </p>
              <pre className="bg-black/30 rounded-lg p-3 mt-2 text-xs text-yellow-100 overflow-x-auto">
{`INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = '${authInfo.email}'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {authInfo && (
        <div className={`flex items-center gap-3 text-sm px-4 py-2 rounded-lg border ${
          authInfo.isAdmin
            ? "bg-green-500/10 border-green-500/20 text-green-300"
            : "bg-red-500/10 border-red-500/20 text-red-300"
        }`}>
          {authInfo.isAdmin ? " Админ: " : " Нет прав админа: "}
          <span className="font-medium">{authInfo.email}</span>
          {!authInfo.isAdmin && (
            <span className="text-gray-400">
               добавьте строку в таблицу user_roles (user_id = ваш ID из Auth, role = admin)
            </span>
          )}
        </div>
      )}

      {debug && (
        <div className="text-xs text-gray-500 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 mb-4">
          Debug: {debug}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          <span className="font-semibold">Ошибка загрузки:</span> {error}
        </div>
      )}

      {stats.totalLeads === 0 && stats.views7d === 0 && !error && (
        <div className="text-sm text-gray-400 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
          Пока нет данных: ни одной заявки и ни одного просмотра за 7 дней. Откройте главную страницу сайта и отправьте тестовую заявку  счётчики появятся.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, hint, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${CARD_STYLES[color]}`}>
              <Icon size={20} />
            </div>
            <div className="text-3xl font-bold text-white">{value}</div>
            <div className="text-gray-300 text-sm mt-1">{label}</div>
            <div className="text-gray-500 text-xs mt-0.5">{hint}</div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Просмотры за 7 дней</h2>
            {stats.viewsTotal !== null && (
              <p className="text-gray-500 text-xs mt-0.5">Всего просмотров за всё время: {stats.viewsTotal}</p>
            )}
          </div>
        </div>
        {stats.views7d === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Пока нет данных о просмотрах. Они появятся, когда посетители будут открывать сайт.
          </div>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {viewsChart.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-gray-400 tabular-nums">{count}</div>
                <div
                  className="w-full bg-brand-blue/70 rounded-t-md transition-all"
                  style={{ height: `${Math.max(4, (count / maxViews) * 100)}%` }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Последние заявки</h2>
          <Link to="/admin/leads" className="text-brand-blue text-sm hover:underline">Все заявки </Link>
        </div>
        {recentLeads.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Заявок пока нет. Они появятся здесь, когда посетители заполнят форму на сайте.
          </div>
        ) : (
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="p-4 bg-gray-800/50 rounded-lg space-y-1.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-white font-medium break-words">{lead.name}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${statusStyle(lead.status)}`}>
                    {STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                  <span className="break-all">{lead.contact}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(lead.created_at).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {lead.message && (
                  <div className="text-sm text-gray-300 break-words">{lead.message}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}