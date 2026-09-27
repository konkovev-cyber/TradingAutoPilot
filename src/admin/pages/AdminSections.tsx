import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchSections, type SiteSection } from "@/lib/sections";
import { ChevronUp, ChevronDown, Check } from "lucide-react";

export default function AdminSections() {
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");

  useEffect(() => {
    fetchSections().then((s) => {
      setSections(s);
      setLoading(false);
    });
  }, []);

  const persist = async (next: SiteSection[], key?: string) => {
    setSections(next);
    if (!supabase || !key) return;
    const row = next.find((s) => s.key === key);
    if (!row) return;
    const { error } = await supabase
      .from("site_sections")
      .update({ title: row.title, enabled: row.enabled, position: row.position })
      .eq("key", key);
    if (!error) {
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2000);
    }
  };

  const persistOrder = async (next: SiteSection[]) => {
    setSections(next);
    if (!supabase) return;
    // Update positions sequentially; finish with the moved row for the indicator
    for (const row of next) {
      await supabase.from("site_sections").update({ position: row.position }).eq("key", row.key);
    }
    setSavedKey(next[0].key);
    setTimeout(() => setSavedKey(null), 2000);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    const renumbered = next.map((s, i) => ({ ...s, position: i + 1 }));
    persistOrder(renumbered);
  };

  const toggle = (index: number) => {
    const row = sections[index];
    const next = sections.map((s, i) => (i === index ? { ...s, enabled: !s.enabled } : s));
    persist(next, row.key);
  };

  const saveTitle = (index: number) => {
    const row = sections[index];
    if (!titleDraft.trim()) {
      setEditingTitle(null);
      return;
    }
    const next = sections.map((s, i) => (i === index ? { ...s, title: titleDraft.trim() } : s));
    setEditingTitle(null);
    persist(next, row.key);
  };

  if (loading) return <div className="text-white">Загрузка...</div>;

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Секции сайта</h1>
        <p className="text-gray-400 text-sm mt-1">
          Управляйте блоками на главной странице: стрелками меняйте порядок, переключателем включайте и выключайте секции, по названию можно переименовать.
          Изменения сразу применяются на сайте и в меню.
        </p>
      </div>

      {sections.map((section, index) => (
        <div key={section.key} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            {/* Reorder */}
            <div className="flex flex-col shrink-0">
              <button
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
                aria-label="Выше"
              >
                <ChevronUp size={18} />
              </button>
              <button
                onClick={() => move(index, 1)}
                disabled={index === sections.length - 1}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
                aria-label="Ниже"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              {editingTitle === section.key ? (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveTitle(index);
                      if (e.key === "Escape") setEditingTitle(null);
                    }}
                    className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                  <button onClick={() => saveTitle(index)} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg">
                    ОК
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingTitle(section.key);
                    setTitleDraft(section.title);
                  }}
                  className="text-left w-full text-white font-medium hover:text-brand-blue transition-colors truncate"
                  title="Нажмите, чтобы переименовать"
                >
                  {section.title}
                </button>
              )}
              <div className="text-xs text-gray-500 font-mono mt-0.5">
                #{index + 1}  {section.key}
              </div>
            </div>

            {/* Saved indicator */}
            {savedKey === section.key && (
              <span className="flex items-center gap-1 text-green-400 text-xs shrink-0">
                <Check size={14} /> Сохранено
              </span>
            )}

            {/* Enabled toggle */}
            <button
              onClick={() => toggle(index)}
              role="switch"
              aria-checked={section.enabled}
              className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${section.enabled ? "bg-green-600" : "bg-gray-700"}`}
              title={section.enabled ? "Секция включена  нажмите, чтобы скрыть" : "Секция скрыта  нажмите, чтобы показать"}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  section.enabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          {!section.enabled && (
            <div className="mt-2 text-xs text-amber-400/80">Секция скрыта с сайта и из меню</div>
          )}
        </div>
      ))}
    </div>
  );
}
