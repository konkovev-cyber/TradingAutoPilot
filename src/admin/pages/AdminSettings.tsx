import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save } from "lucide-react";

export default function AdminSettings() {
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.from("site_content").select("*").then(({ data }) => {
      const map: any = {};
      data?.forEach(row => map[row.section] = row.data);
      setContent(map);
      setLoading(false);
    });
  }, []);

  const saveSection = async (section: string, data: any) => {
    if (!supabase) return;
    await supabase.from("site_content").upsert({ section, data });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        {saved && <span className="text-green-400 text-sm">Saved!</span>}
      </div>
      <div className="space-y-6">
        {Object.entries(content).map(([section, data]) => (
          <div key={section} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 capitalize">{section}</h2>
            <pre className="bg-gray-800 rounded-lg p-4 text-gray-300 text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
            <button onClick={() => saveSection(section, data)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
              <Save size={18} /> Save Changes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
