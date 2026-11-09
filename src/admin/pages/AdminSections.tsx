import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchSections, DEFAULT_SECTIONS, type SiteSection } from "@/lib/sections";
import {
  ChevronUp,
  ChevronDown,
  Check,
  RotateCcw,
  Sparkles,
  Bot,
  HelpCircle,
  ShieldCheck,
  Zap,
  Star,
  DollarSign,
  Award,
  MessageSquare,
  Calculator,
  Mail,
  Edit2,
  Eye,
  EyeOff,
} from "lucide-react";

const SECTION_ICONS: Record<string, any> = {
  hero: Sparkles,
  products: Bot,
  why: HelpCircle,
  connect: ShieldCheck,
  advantages: Zap,
  benefits: Star,
  pricing: DollarSign,
  conclusion: Award,
  questions: MessageSquare,
  faq: HelpCircle,
  calculator: Calculator,
  lead: Mail,
};

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

  const persistAll = async (next: SiteSection[], activeKey?: string) => {
    setSections(next);
    try {
      await fetch("/api/site-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });

      if (supabase) {
        for (const row of next) {
          await supabase
            .from("site_sections")
            .upsert({ key: row.key, title: row.title, enabled: row.enabled, position: row.position });
        }
      }

      if (activeKey) {
        setSavedKey(activeKey);
        setTimeout(() => setSavedKey(null), 2200);
      }
    } catch (e) {
      console.error("Save sections error:", e);
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    const renumbered = next.map((s, i) => ({ ...s, position: i + 1 }));
    persistAll(renumbered, item.key);
  };

  const toggle = (index: number) => {
    const row = sections[index];
    const next = sections.map((s, i) => (i === index ? { ...s, enabled: !s.enabled } : s));
    persistAll(next, row.key);
  };

  const saveTitle = (index: number) => {
    const row = sections[index];
    if (!titleDraft.trim()) {
      setEditingTitle(null);
      return;
    }
    const next = sections.map((s, i) => (i === index ? { ...s, title: titleDraft.trim() } : s));
    setEditingTitle(null);
    persistAll(next, row.key);
  };

  const resetToDefault = async () => {
    const ok = window.confirm("Сбросить порядок и видимость всех секций главной страницы к стандартным?");
    if (!ok) return;
    await persistAll(DEFAULT_SECTIONS, DEFAULT_SECTIONS[0]?.key);
  };

  if (loading) {
    return (
      <div className="text-white py-12 text-center bg-gray-900 rounded-xl border border-gray-800">
        <Sparkles size={24} className="animate-spin text-brand-blue mx-auto mb-2" />
        Загрузка секций сайта...
      </div>
    );
  }

  const enabledCount = sections.filter((s) => s.enabled).length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Секции сайта</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Управляйте блоками на главной странице: меняйте порядок стрелками, включайте и выключайте блоки, переименовывайте заголовки.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={resetToDefault}
            className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-lg border border-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} /> Сбросить порядок
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between text-xs text-gray-400 bg-gray-900 border border-gray-800 px-4 py-2.5 rounded-xl">
        <span className="flex items-center gap-1.5">
          <Eye size={14} className="text-emerald-400" />
          <span>Активно на сайте: <strong className="text-white font-semibold">{enabledCount}</strong> из {sections.length}</span>
        </span>
        <span className="text-gray-500 font-mono text-[11px]">
          Изменения применяются автоматически
        </span>
      </div>

      {/* Sections List */}
      <div className="space-y-2.5">
        {sections.map((section, index) => {
          const Icon = SECTION_ICONS[section.key] || Sparkles;
          const isSaved = savedKey === section.key;

          return (
            <div
              key={section.key}
              className={`border rounded-xl p-3.5 sm:p-4 transition-all duration-200 ${
                section.enabled
                  ? "bg-gray-900 border-gray-800 hover:border-gray-700 shadow-sm"
                  : "bg-gray-950/70 border-gray-850 border-gray-800/40 opacity-70"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Reorder Up/Down */}
                <div className="flex flex-col shrink-0 bg-gray-800/80 rounded-lg p-0.5 border border-gray-700/60">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Поднять выше"
                    title="Поднять выше"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === sections.length - 1}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Опустить ниже"
                    title="Опустить ниже"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Section Icon & Position */}
                <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-brand-blue shrink-0">
                  <Icon size={18} />
                </div>

                {/* Title & Key */}
                <div className="flex-1 min-w-0">
                  {editingTitle === section.key ? (
                    <div className="flex gap-2 items-center">
                      <input
                        autoFocus
                        value={titleDraft}
                        onChange={(e) => setTitleDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveTitle(index);
                          if (e.key === "Escape") setEditingTitle(null);
                        }}
                        className="flex-1 px-3 py-1.5 bg-gray-800 border border-brand-blue rounded-lg text-white text-xs sm:text-sm focus:outline-none"
                      />
                      <button
                        onClick={() => saveTitle(index)}
                        className="px-3 py-1.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        ОК
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <button
                        onClick={() => {
                          setEditingTitle(section.key);
                          setTitleDraft(section.title);
                        }}
                        className="text-left text-white font-semibold text-sm sm:text-base hover:text-brand-blue transition-colors truncate cursor-pointer flex items-center gap-1.5"
                        title="Нажмите, чтобы переименовать"
                      >
                        <span>{section.title}</span>
                        <Edit2 size={12} className="opacity-0 group-hover:opacity-70 text-gray-400 transition-opacity" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-gray-500 font-mono">
                      #{index + 1} · {section.key}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        section.enabled
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                      }`}
                    >
                      {section.enabled ? "На сайте" : "Скрыта"}
                    </span>
                  </div>
                </div>

                {/* Saved feedback */}
                {isSaved && (
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 shrink-0">
                    <Check size={13} /> Сохранено
                  </span>
                )}

                {/* Enabled Switch */}
                <button
                  onClick={() => toggle(index)}
                  role="switch"
                  aria-checked={section.enabled}
                  className={`relative w-12 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${
                    section.enabled ? "bg-emerald-500" : "bg-gray-700"
                  }`}
                  title={section.enabled ? "Секция включена — нажмите, чтобы скрыть" : "Секция скрыта — нажмите, чтобы показать"}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      section.enabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {!section.enabled && (
                <div className="mt-2.5 pt-2 border-t border-gray-800/60 flex items-center gap-1.5 text-xs text-amber-400/80">
                  <EyeOff size={13} />
                  <span>Секция временно отключена и не отображается посетителям</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
