import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Download } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  contact: string;
  bot: string;
  message: string | null;
  status: string;
  created_at: string;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied">("all");
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const updateStatus = async (id: string, status: string) => {
    if (!supabase) return;
    await supabase.from("leads").update({ status }).eq("id", id);
    fetchLeads();
  };

  const exportCSV = () => {
    const headers = ["Name", "Contact", "Bot", "Message", "Status", "Created"];
    const rows = leads.map(l => [l.name, l.contact, l.bot, l.message, l.status, l.created_at]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  const filtered = filter === "all" ? leads : leads.filter(l => l.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Leads</h1>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
          <Download size={18} /> Export CSV
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {(["all", "new", "read", "replied"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-brand-blue text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({leads.filter(l => l.status === f).length})
          </button>
        ))}
      </div>
      {loading ? <div className="text-white">Loading...</div> :
       filtered.length === 0 ? <div className="text-gray-500 text-center py-12 bg-gray-900 rounded-xl">No leads found</div> :
       <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
         <table className="w-full">
           <thead className="bg-gray-800/50">
             <tr>
               {["Name","Contact","Bot","Message","Status","Date"].map(h => (
                 <th key={h} className="text-left px-6 py-4 text-gray-400 text-sm font-medium">{h}</th>
               ))}
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-800">
             {filtered.map((lead) => (
               <tr key={lead.id} className="hover:bg-gray-800/30 transition-colors">
                 <td className="px-6 py-4 text-white font-medium">{lead.name}</td>
                 <td className="px-6 py-4 text-gray-400">{lead.contact}</td>
                 <td className="px-6 py-4 text-gray-400">{lead.bot}</td>
                 <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{lead.message}</td>
                 <td className="px-6 py-4">
                   <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}
                     className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-2 py-1">
                     <option value="new">New</option>
                     <option value="read">Read</option>
                     <option value="replied">Replied</option>
                     <option value="converted">Converted</option>
                   </select>
                 </td>
                 <td className="px-6 py-4 text-gray-500 text-sm">{new Date(lead.created_at).toLocaleDateString()}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>}
    </div>
  );
}
