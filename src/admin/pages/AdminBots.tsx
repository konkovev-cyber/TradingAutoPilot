/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = any;

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
  image_url: string | null;
  features?: Json;
  returns?: Json;
  how_it_works?: Json;
  position?: number;
}

const initialBot: Bot = {
  slug: "", name: "", slogan: "", shortDesc: "", badge: "",
  market: "", strategy: "", risk: "", pairs: "", color: "#3b82f6", image_url: null
};

export default function AdminBots() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [editing, setEditing] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [extra, setExtra] = useState({ features: "[]", returns: "[]", how: "[]" });

  const openEditor = (bot: Bot) => {
    setEditing(bot);
    setExtra({
      features: JSON.stringify(bot.features ?? [], null, 2),
      returns: JSON.stringify(bot.returns ?? [], null, 2),
      how: JSON.stringify(bot.how_it_works ?? [], null, 2),
    });
  };

  const fetchBots = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("bots").select("*").order("position");
    setBots(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchBots(); }, []);

  const uploadImage = async (file: File) => {
    if (!supabase) return;
    setUploading(true);
    try {
      const path = Date.now() + "-" + file.name.replace(/\s+/g, "_");
      const { data, error } = await supabase.storage.from("bot-images").upload(path, file);
      if (error) throw error;
      if (data) {
        const pub = supabase.storage.from("bot-images").getPublicUrl(data.path);
        if (editing) setEditing({ ...editing, image_url: pub.data.publicUrl });
      }
    } catch {
      alert("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РєР°СЂС‚РёРЅРєСѓ");
    }
    setUploading(false);
  };

  const saveBot = async (bot: Bot) => {
    if (!supabase) return;
    const parseArr = (s: string, fb: Json) => {
      try {
        const v = JSON.parse(s);
        return Array.isArray(v) ? v : fb;
      } catch {
        return fb;
      }
    };
    const payload: Bot = {
      ...bot,
      features: parseArr(extra.features, bot.features ?? []),
      returns: parseArr(extra.returns, bot.returns ?? []),
      how_it_works: parseArr(extra.how, bot.how_it_works ?? []),
    };
    if (bot.id) {
      await supabase.from("bots").update(payload).eq("id", bot.id);
    } else {
      const { data } = await supabase.from("bots").insert(payload).select();
      if (data) setBots([...bots, data[0]]);
    }
    setEditing(null);
    fetchBots();
  };

  const deleteBot = async (id: string) => {
    if (!supabase || !confirm("РЈРґР°Р»РёС‚СЊ СЌС‚РѕРіРѕ СЂРѕР±РѕС‚Р°?")) return;
    await supabase.from("bots").delete().eq("id", id);
    setBots(bots.filter(b => b.id !== id));
  };

  if (loading) return <div className="text-white">Р—Р°РіСЂСѓР·РєР°...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">\u0420\u043e\u0431\u043e\u0442\u044b</h1>
        <button onClick={() => openEditor({ ...initialBot })}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
          <Plus size={18} /> Р”РѕР±Р°РІРёС‚СЊ СЂРѕР±РѕС‚Р°
        </button>
      </div>

      {editing && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0440\u043e\u0431\u043e\u0442\u0430</h2>
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
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">РљР°СЂС‚РёРЅРєР° СЂРѕР±РѕС‚Р°</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                }}
                className="block w-full text-sm text-gray-400 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white file:cursor-pointer"
              />
              {uploading && <span className="text-xs text-gray-400">Р—Р°РіСЂСѓР·РєР°...</span>}
            </div>
            {editing.image_url && (
              <img src={editing.image_url} alt={editing.name} className="h-24 w-auto rounded-lg border border-gray-700" />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Преимущества (JSON)</label>
              <textarea value={extra.features} onChange={(e) => setExtra({ ...extra, features: e.target.value })} rows={8}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg font-mono text-xs" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Доходность (JSON)</label>
              <textarea value={extra.returns} onChange={(e) => setExtra({ ...extra, returns: e.target.value })} rows={8}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg font-mono text-xs" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Как работает (JSON)</label>
              <textarea value={extra.how} onChange={(e) => setExtra({ ...extra, how: e.target.value })} rows={8}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg font-mono text-xs" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-gray-400 hover:text-white">РћС‚РјРµРЅР°</button>
            <button onClick={() => saveBot(editing)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"><Save size={18} /> РЎРѕС…СЂР°РЅРёС‚СЊ</button>
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
              <button onClick={() => openEditor(bot)} className="p-2 text-gray-400 hover:text-white"><Edit2 size={18} /></button>
              <button onClick={() => deleteBot(bot.id!)} className="p-2 text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
