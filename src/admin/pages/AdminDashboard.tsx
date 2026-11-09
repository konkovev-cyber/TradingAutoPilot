import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, MessageSquare, TrendingUp, Clock, Eye, RefreshCw, ArrowUpRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Lead {
  id: string;
  name: string;
  contact: string;
  bot: string;
  budget?: string | null;
  message: string | null;
  notes?: string | null;
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
  blue: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20 group-hover:scale-110",
  green: "bg-green-500/10 text-green-500 group-hover:bg-green-500/20 group-hover:scale-110",
  purple: "bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20 group-hover:scale-110",
  orange: "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20 group-hover:scale-110",
  pink: "bg-pink-500/10 text-pink-500 group-hover:bg-pink-500/20 group-hover:scale-110",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  contacted: "В работе",
  meeting: "Консультация",
  converted: "Оплачено",
  rejected: "Отказ",
  read: "В работе",
  replied: "Консультация",
};

function statusStyle(status: string): string {
  if (status === "new") return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
  if (status === "contacted" || status === "read") return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  if (status === "meeting" || status === "replied") return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
  if (status === "converted") return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  if (status === "rejected") return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  return "bg-gray-500/10 text-gray-400";
}

function statusDot(status: string): string {
  if (status === "new") return "bg-blue-400";
  if (status === "contacted" || status === "read") return "bg-amber-400";
  if (status === "meeting" || status === "replied") return "bg-purple-400";
  if (status === "converted") return "bg-emerald-400";
  if (status === "rejected") return "bg-rose-400";
  return "bg-gray-400";
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    newLeads: 0,
    botsCount: null,
    todayLeads: 0,
    views7d: 0,
    viewsTotal: null,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [viewsChart, setViewsChart] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<{ email: string; isAdmin: boolean } | null>(null);

  const load = async () => {
    if (!supabase) {
      setError("Supabase не подключён");
      setLoading(false);
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setAuthInfo({ email: session?.user?.email ?? "администратор", isAdmin: true });
    } catch {
      setAuthInfo({ email: "администратор", isAdmin: true });
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

      const leads: Lead[] = (leadsRes.data as Lead[]) ?? [];
      const views: string[] = (viewsRes.data ?? []).map((v: { created_at: string }) => v.created_at);

      const dayKeys: string[] = [];
      for (let i = 6; i >= 0; i--) {
        dayKeys.push(new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
      }
      setViewsChart(dayKeys.map((k) => views.filter((v) => v.slice(0, 10) === k).length));

      setStats({
        totalLeads: leads.length,
        newLeads: leads.filter((l) => l.status === "new").length,
        botsCount: botsRes.count ?? (Array.isArray(botsRes.data) ? botsRes.data.length : 3),
        todayLeads: leads.filter((l) => l.created_at >= dayAgo).length,
        views7d: views.length,
        viewsTotal: totalViewsRes.count ?? views.length,
      });

      setAllLeads(leads);
      setRecentLeads(leads.slice(0, 5));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки данных");
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="text-white py-12 text-center">Загрузка данных обзора...</div>;

  const statCards = [
    {
      label: "Всего заявок",
      hint: "За всё время · Перейти ко всем",
      value: stats.totalLeads.toString(),
      icon: Users,
      color: "blue",
      to: "/admin/leads?filter=all",
    },
    {
      label: "Новые заявки",
      hint: "Ещё не обработаны · Открыть",
      value: stats.newLeads.toString(),
      icon: MessageSquare,
      color: "green",
      to: "/admin/leads?filter=new",
      highlight: stats.newLeads > 0,
    },
    {
      label: "Заявки за сутки",
      hint: "За последние 24 часа",
      value: stats.todayLeads.toString(),
      icon: Clock,
      color: "purple",
      to: "/admin/leads?date=1d",
    },
    {
      label: "Роботы",
      hint: "Опубликовано · Управление",
      value: (stats.botsCount ?? 3).toString(),
      icon: TrendingUp,
      color: "orange",
      to: "/admin/bots",
    },
    {
      label: "Просмотры",
      hint: "За последние 7 дней",
      value: stats.views7d.toString(),
      icon: Eye,
      color: "pink",
      to: "#views-chart",
    },
  ];

  const maxViews = Math.max(1, ...viewsChart);

  const scrollToViews = (e: React.MouseEvent, to: string) => {
    if (to === "#views-chart") {
      e.preventDefault();
      document.getElementById("views-chart")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Обзор</h1>
          <p className="text-gray-400 text-sm mt-1">
            Общая статистика: заявки посетителей, конверсия, просмотры и опубликованные роботы.
          </p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true);
            load();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors cursor-pointer"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin text-brand-blue" : ""} /> Обновить
        </button>
      </div>

      {/* Admin indicator */}
      {authInfo && (
        <div className="flex items-center gap-2 text-xs px-3.5 py-2 rounded-lg border bg-green-500/10 border-green-500/20 text-green-300">
          <span>Администратор:</span>
          <span className="font-semibold text-white">{authInfo.email}</span>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          <span className="font-semibold">Ошибка загрузки:</span> {error}
        </div>
      )}

      {/* 5 Clickable Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, hint, value, icon: Icon, color, to, highlight }) => (
          <Link
            key={label}
            to={to}
            onClick={(e) => scrollToViews(e, to)}
            className={`group relative bg-gray-900 border rounded-xl p-5 transition-all duration-200 cursor-pointer block hover:-translate-y-1 hover:shadow-lg ${
              highlight
                ? "border-blue-500/50 bg-blue-950/20 hover:border-blue-400"
                : "border-gray-800 hover:border-gray-700 hover:bg-gray-800/60"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-200 ${CARD_STYLES[color]}`}
              >
                <Icon size={20} />
              </div>
              <ArrowUpRight
                size={16}
                className="text-gray-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-40 group-hover:opacity-100"
              />
            </div>

            <div className="text-3xl font-bold text-white group-hover:text-brand-blue transition-colors">{value}</div>
            <div className="text-gray-300 text-sm mt-1 font-medium">{label}</div>
            <div className="text-gray-500 text-xs mt-0.5 flex items-center gap-1 group-hover:text-gray-400">
              {hint}
            </div>
          </Link>
        ))}
      </div>

      {/* Views Chart */}
      <div id="views-chart" className="bg-gray-900 border border-gray-800 rounded-xl p-6 scroll-mt-6">
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

      {/* 2 Interactive Columns: Funnel & Bots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Clickable Funnel */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Воронка обработки заявок</h2>
              <p className="text-gray-500 text-xs mt-0.5">Нажмите на этап для фильтрации заявок</p>
            </div>
            <Link to="/admin/leads" className="text-xs text-brand-blue hover:underline flex items-center gap-1">
              Все заявки <ChevronRight size={13} />
            </Link>
          </div>

          {allLeads.length === 0 ? (
            <div className="text-gray-500 text-center py-8">Пока нет заявок.</div>
          ) : (
            <div className="space-y-2">
              {(["new", "contacted", "meeting", "converted", "rejected"] as const).map((status) => {
                // Map legacy statuses
                const count = allLeads.filter((l) => {
                  if (status === "contacted") return ["contacted", "read"].includes(l.status);
                  if (status === "meeting") return ["meeting", "replied"].includes(l.status);
                  return l.status === status;
                }).length;

                const pct = allLeads.length > 0 ? Math.round((count / allLeads.length) * 100) : 0;

                return (
                  <Link
                    key={status}
                    to={`/admin/leads?filter=${status}`}
                    className="group block p-2.5 -mx-2 rounded-xl hover:bg-gray-800/70 border border-transparent hover:border-gray-700/60 transition-all cursor-pointer"
                    title={`Показать заявки со статусом: ${STATUS_LABELS[status]}`}
                  >
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="flex items-center gap-2 text-gray-300 group-hover:text-white font-medium transition-colors">
                        <span className={`h-2.5 w-2.5 rounded-full ${statusDot(status)}`} />
                        <span>{STATUS_LABELS[status]}</span>
                      </span>
                      <span className="text-gray-400 group-hover:text-brand-blue tabular-nums text-xs flex items-center gap-1 font-semibold transition-colors">
                        {count} · {pct}%
                        <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </div>

                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${statusDot(status)}`}
                        style={{ width: `${Math.max(count > 0 ? 4 : 0, pct)}%` }}
                      />
                    </div>
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-gray-800 text-xs text-gray-400 flex items-center justify-between">
                <span>Конверсия в оплату:</span>
                <span className="font-bold text-emerald-400">
                  {allLeads.length > 0
                    ? Math.round((allLeads.filter((l) => l.status === "converted").length / allLeads.length) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Clickable Leads by Bot */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Заявки по роботам</h2>
              <p className="text-gray-500 text-xs mt-0.5">Нажмите на робота для просмотра его заявок</p>
            </div>
            <Link to="/admin/bots" className="text-xs text-brand-blue hover:underline flex items-center gap-1">
              К роботам <ChevronRight size={13} />
            </Link>
          </div>

          {(() => {
            const byBot = new Map<string, number>();
            allLeads.forEach((l) => {
              const key = l.bot && l.bot.trim() !== "" ? l.bot : "не указан";
              byBot.set(key, (byBot.get(key) ?? 0) + 1);
            });
            const rows = [...byBot.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
            const max = Math.max(1, ...rows.map(([, c]) => c));

            if (rows.length === 0) return <div className="text-gray-500 text-center py-8">Пока нет заявок.</div>;

            return (
              <div className="space-y-2">
                {rows.map(([bot, count]) => (
                  <Link
                    key={bot}
                    to={`/admin/leads?q=${encodeURIComponent(bot === "не указан" ? "" : bot)}`}
                    className="group block p-2.5 -mx-2 rounded-xl hover:bg-gray-800/70 border border-transparent hover:border-gray-700/60 transition-all cursor-pointer"
                    title={`Показать все заявки по роботу: ${bot}`}
                  >
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-gray-300 group-hover:text-white font-medium truncate pr-2 flex items-center gap-1.5 transition-colors">
                        <span>🤖</span>
                        <span>{bot}</span>
                      </span>
                      <span className="text-gray-400 group-hover:text-brand-blue tabular-nums text-xs font-semibold flex items-center gap-1 transition-colors">
                        {count} {count === 1 ? "заявка" : count < 5 ? "заявки" : "заявок"}
                        <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </div>

                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-blue transition-all duration-500 group-hover:bg-blue-400"
                        style={{ width: `${Math.max(4, (count / max) * 100)}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Clickable Recent Leads */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Последние заявки</h2>
            <p className="text-gray-500 text-xs mt-0.5">Кликните на любую заявку для открытия в CRM</p>
          </div>
          <Link to="/admin/leads" className="text-brand-blue text-sm hover:underline flex items-center gap-1">
            Все заявки <ChevronRight size={15} />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Заявок пока нет. Они появятся здесь, когда посетители заполнят форму на сайте.
          </div>
        ) : (
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                to={`/admin/leads?q=${encodeURIComponent(lead.contact)}`}
                className="group block p-4 bg-gray-800/40 hover:bg-gray-800/80 border border-transparent hover:border-gray-700/80 rounded-xl transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-white font-medium group-hover:text-brand-blue transition-colors">
                    {lead.name || "Без имени"}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statusStyle(lead.status)}`}>
                    {STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400 mt-1">
                  <span className="font-mono text-gray-300">{lead.contact}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">🤖 {lead.bot || "Любой"}</span>
                  <span className="text-gray-500 text-xs ml-auto">
                    {new Date(lead.created_at).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {lead.notes && (
                  <div className="text-xs text-amber-300/80 mt-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <span className="font-medium text-amber-400">Заметка: </span>
                    {lead.notes}
                  </div>
                )}

                {lead.message && (
                  <div className="text-xs text-gray-400 mt-1.5 line-clamp-1 italic">
                    «{lead.message}»
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
