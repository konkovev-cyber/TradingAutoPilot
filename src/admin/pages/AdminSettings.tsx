/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Plus, Trash2, ChevronDown, Braces, Check } from "lucide-react";

type Json = any;

const SECTION_LABELS: Record<string, string> = {
  meta: "SEO и мета-данные",
  nav: "Меню в шапке",
  hero: "Hero / Главная",
  cta: "CTA / Призыв к действию",
  stats: "Статистика",
  exchanges: "Биржи",
  advantages: "Преимущества",
  how_it_works: "Как это работает",
  testimonials: "Отзывы",
  pricing: "Тарифы",
  faq: "FAQ",
};

const TEXT_FIELDS: Record<string, { key: string; label: string; multiline?: boolean }[]> = {
  meta: [
    { key: "title", label: "Title (заголовок вкладки браузера)", multiline: true },
    { key: "description", label: "Description (описание для поисковиков)", multiline: true },
  ],
  nav: [
    { key: "bots", label: "Пункт меню Роботы" },
    { key: "how", label: "Пункт меню Как работает" },
    { key: "faq", label: "Пункт меню FAQ" },
  ],
  hero: [
    { key: "badge", label: "Плашка над заголовком" },
    { key: "title1", label: "Заголовок  начало" },
    { key: "title2", label: "Заголовок  выделенная часть" },
    { key: "subtitle", label: "Подзаголовок", multiline: true },
    { key: "pick", label: "Кнопка Выбрать робота" },
    { key: "cta2", label: "Вторая кнопка" },
  ],
  cta: [
    { key: "title", label: "Заголовок" },
    { key: "subtitle", label: "Подзаголовок", multiline: true },
    { key: "btn1", label: "Первая кнопка" },
    { key: "btn2", label: "Вторая кнопка" },
    { key: "trust", label: "Строка доверия под кнопками" },
  ],
};

function FieldInput({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const cls =
    "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue";
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-400 mb-1">{label}</span>
      {multiline ? (
        <textarea rows={3} className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function ListEditor({
  items,
  onChange,
}: {
  items: Json[];
  onChange: (items: Json[]) => void;
}) {
  const isStringList = items.length > 0 && typeof items[0] === "string";

  const updateItem = (i: number, value: Json) => {
    const next = [...items];
    next[i] = value;
    onChange(next);
  };

  const removeItem = (i: number) => onChange(items.filter((_, j) => j !== i));

  const emptyItem = (): Json => {
    if (isStringList) return "";
    const first = items[0] as Record<string, Json> | undefined;
    if (!first) return {};
    return Object.fromEntries(
      Object.keys(first).map((k) => [k, Array.isArray(first[k]) ? [] : ""])
    );
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-mono">#{i + 1}</span>
            <button
              onClick={() => removeItem(i)}
              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
              aria-label="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {isStringList ? (
            <input
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
              value={String(item)}
              onChange={(e) => updateItem(i, e.target.value)}
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(item as Record<string, Json>).map(([key, value]) => (
                <FieldInput
                  key={key}
                  label={key}
                  value={Array.isArray(value) ? JSON.stringify(value) : String(value ?? "")}
                  multiline={(typeof value === "string" && value.length > 60) || Array.isArray(value)}
                  onChange={(v) => {
                    if (Array.isArray(value)) {
                      try {
                        updateItem(i, { ...item, [key]: JSON.parse(v) });
                      } catch {
                        /* keep previous value while typing invalid JSON */
                      }
                    } else {
                      updateItem(i, { ...item, [key]: v });
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => onChange([...items, emptyItem()])}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:text-blue-400 font-medium"
      >
        <Plus size={16} /> Добавить элемент
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const [sections, setSections] = useState<Record<string, Json>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [jsonMode, setJsonMode] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase
      .from("site_content")
      .select("*")
      .then(({ data }) => {
        const map: Record<string, Json> = {};
        data?.forEach((row) => {
          map[row.section] = row.data;
        });
        setSections(map);
        setLoading(false);
      });
  }, []);

  const save = async (section: string, data: Json) => {
    if (!supabase) return;
    const { error } = await supabase.from("site_content").upsert({ section, data });
    if (!error) {
      setSaved(section);
      setTimeout(() => setSaved(null), 2500);
    }
  };

  const updateData = (section: string, data: Json) => {
    setSections((s) => ({ ...s, [section]: data }));
  };

  if (loading) return <div className="text-white">Загрузка...</div>;

  const sectionKeys = Object.keys(sections);

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Контент сайта</h1>
        <p className="text-gray-400 text-sm mt-1">
          Редактируйте содержимое секций  изменения применяются на сайте после сохранения.
        </p>
      </div>

      {sectionKeys.length === 0 && (
        <div className="text-gray-500 text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
          Нет секций. Примените миграции Supabase, чтобы создать контент.
        </div>
      )}

      {sectionKeys.map((section) => {
        const data = sections[section];
        const isOpen = open === section;
        const isText = Array.isArray(TEXT_FIELDS[section]);
        const isList = Array.isArray(data);

        return (
          <div key={section} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : section)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-800/50 transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 font-mono">{section}</span>
                <span className="text-white font-medium">{SECTION_LABELS[section] || section}</span>
                {saved === section && (
                  <span className="flex items-center gap-1 text-green-400 text-xs">
                    <Check size={14} /> Сохранено
                  </span>
                )}
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <div className="p-5 border-t border-gray-800 space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => setJsonMode((m) => ({ ...m, [section]: !m[section] }))}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-gray-800 transition-colors"
                  >
                    <Braces size={14} /> {jsonMode[section] ? "Форма" : "JSON режим"}
                  </button>
                </div>

                {jsonMode[section] ? (
                  <textarea
                    rows={14}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    value={JSON.stringify(data, null, 2)}
                    onChange={(e) => {
                      try {
                        updateData(section, JSON.parse(e.target.value));
                      } catch {
                        /* keep previous value while typing invalid JSON */
                      }
                    }}
                  />
                ) : isText ? (
                  <div className="space-y-3">
                    {TEXT_FIELDS[section].map(({ key, label, multiline }) => (
                      <FieldInput
                        key={key}
                        label={label}
                        value={String(data?.[key] ?? "")}
                        onChange={(v) => updateData(section, { ...data, [key]: v })}
                        multiline={multiline}
                      />
                    ))}
                  </div>
                ) : isList ? (
                  <ListEditor items={data} onChange={(items) => updateData(section, items)} />
                ) : (
                  <pre className="bg-gray-800 rounded-lg p-4 text-gray-300 text-xs overflow-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => save(section, data)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    <Save size={16} /> Сохранить
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
