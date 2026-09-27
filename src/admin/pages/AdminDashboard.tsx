import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, MessageSquare, TrendingUp, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface Lead {
  id: string;
  name: string;
  contact: string;
  status: string;
}

interface Stats {
  totalLeads: number;
  newLeads: number;
  botsCount: number;
  todayLeads: number;
  views7d: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalLeads: 0, newLeads: 0, botsCount: 3, todayLeads: 0, views7d: 0 });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    Promise.all([
      supabase.from("leads").select("id, status, created_at"),
      supabase.from("leads").select("id").eq("status", "new"),
      supabase.from("leads").select("id").gte("created_at", new Date(Date.now() - 24*60*60*1000).toISOString()),
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("page_views").select("id").gte("created_at", new Date(Date.now() - 7*24*60*60*1000).toISOString()),
    ])
      .then(([all, newRes, todayRes, recent, views]) => {
        setStats({
          totalLeads: all.data?.length ?? 0,
          newLeads: newRes.data?.length ?? 0,
          botsCount: 3,
          todayLeads: todayRes.data?.length ?? 0,
          views7d: views.data?.length ?? 0,
        });
        setRecentLeads(recent.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Всего заявок", hint: "За всё время", value: stats.totalLeads.toString(), icon: Users, color: "blue" },
    { label: "Новые заявки", hint: "Ещё не обработаны", value: stats.newLeads.toString(), icon: MessageSquare, color: "green" },
    { label: "За сутки", hint: "Пришли за последние 24 часа", value: stats.todayLeads.toString(), icon: Clock, color: "purple" },
    { label: "Роботы", hint: "Опубликовано на сайте", value: stats.botsCount.toString(), icon: TrendingUp, color: "orange" },
    { label: "Просмотры", hint: "За последние 7 дней", value: stats.views7d.toString(), icon: Eye, color: "pink" },
  ];

  if (loading) return <div className="text-white">Загрузка...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Обзор</h1>
        <p className="text-gray-400 text-sm mt-1">
          Общая статистика: сколько заявок оставили посетители и в каком они состоянии.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, hint, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className={`w-12 h-12 rounded-lg bg-${color}-500/10 flex items-center justify-center mb-4`}>
              <Icon size={24} className={`text-${color}-500`} />
            </div>
            <div className="text-3xl font-bold text-white">{value}</div>
            <div className="text-gray-300 text-sm mt-1">{label}</div>
            <div className="text-gray-500 text-xs mt-0.5">{hint}</div>
          </div>
        ))}
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
              <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <div className="text-white font-medium">{lead.name}</div>
                  <div className="text-gray-400 text-sm">{lead.contact}</div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lead.status === "new"
                      ? "bg-green-500/10 text-green-400"
                      : lead.status === "read"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  {lead.status === "new" ? "новая" : lead.status === "read" ? "прочитана" : lead.status === "replied" ? "отвечена" : "куплено"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
