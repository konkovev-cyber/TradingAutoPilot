import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

interface Bot {
  id?: string;
  slug: string;
  name: string;
  slogan: string;
  shortDesc: string;
  badge: string;
  market: string;
  strategy: string;
  risk: string;
  pairs: string;
  color: string;
}

const initialBot: Bot = {
  slug: "", name: "", slogan: "", shortDesc: "", badge: "",
  market: "", strategy: "", risk: "", pairs: "", color: "#3b82f6"
};

export default function AdminBots() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [editing, setEditing] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBots = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("bots").select("*").order("name");
    setBots(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchBots(); }, []);

  const saveBot = async (bot: Bot) => {
    if (!supabase) return;
    if (bot.id) {
      await supabase.from("bots").update(bot).eq("id", bot.id);
    } else {
      const { data } = await supabase.from("bots").insert(bot).select();
      if (data) setBots([...bots, data[0]]);
    }
    setEditing(null);
    fetchBots();
  };

  const deleteBot = async (id: string) => {
    if (!supabase || !confirm("Delete this bot?")) return;
    await supabase.from("bots").delete().eq("id", id);
    setBots(bots.filter(b => b.id !== id));
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Bots</h1>
        <button onClick={() => setEditing({ ...initialBot })}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
          <Plus size={18} /> Add Bot
        </button>
      </div>

      {editing && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Edit Bot</h2>
            <button onClick={() => setEditing(null)}><X size={20} className="text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Name" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})}
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg" />
            <input placeholder="Slug" value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})}
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg" />
            <input placeholder="Slogan" value={editing.slogan} onChange={e => setEditing({...editing, slogan: e.target.value})}
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg col-span-2" />
            <textarea placeholder="Short description" value={editing.shortDesc} onChange={e => setEditing({...editing, shortDesc: e.target.value})}
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg col-span-2" rows={3} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button onClick={() => saveBot(editing)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"><Save size={18} /> Save</button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {bots.map((bot) => (
          <div key={bot.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">{bot.name}</h3>
              <p className="text-gray-400 text-sm">{bot.slogan}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">{bot.market}</span>
                <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">{bot.strategy}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(bot)} className="p-2 text-gray-400 hover:text-white"><Edit2 size={18} /></button>
              <button onClick={() => deleteBot(bot.id!)} className="p-2 text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
