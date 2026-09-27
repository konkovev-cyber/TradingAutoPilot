import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, MessageSquare, TrendingUp, Clock } from "lucide-react";

interface Stats {
  totalLeads: number;
  newLeads: number;
  botsCount: number;
  todayLeads: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalLeads: 0, newLeads: 0, botsCount: 3, todayLeads: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
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
    ]).then(([all, newRes, todayRes, recent]) => {
      setStats({
        totalLeads: all.data?.length ?? 0,
        newLeads: newRes.data?.length ?? 0,
        botsCount: 3,
        todayLeads: todayRes.data?.length ?? 0,
      });
      setRecentLeads(recent.data ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Leads", value: stats.totalLeads.toString(), icon: Users, color: "blue" },
    { label: "New Leads", value: stats.newLeads.toString(), icon: MessageSquare, color: "green" },
    { label: "Today", value: stats.todayLeads.toString(), icon: Clock, color: "purple" },
    { label: "Active Bots", value: stats.botsCount.toString(), icon: TrendingUp, color: "orange" },
  ];

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-${color}-500/10 flex items-center justify-center`}>
                <Icon size={24} className={`text-${color}-500`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{value}</div>
            <div className="text-gray-400 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Leads</h2>
        {recentLeads.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No leads yet</div>
        ) : (
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <div className="text-white font-medium">{lead.name}</div>
                  <div className="text-gray-400 text-sm">{lead.contact}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  lead.status === "new" ? "bg-green-500/10 text-green-400" :
                  lead.status === "read" ? "bg-blue-500/10 text-blue-400" :
                  "bg-gray-500/10 text-gray-400"
                }`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
