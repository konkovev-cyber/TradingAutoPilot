import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Plus, Trash2, ChevronDown, Check } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = any;

const SECTION_LABELS: Record<string, string> = {
  meta: "SEO и мета-данные",
  nav: "Меню в шапке",
  hero: "Hero / Знакомство с проектом",
  why: "Почему роботы не взаимозаменяемы",
  choose: "Как выбрать робота",
  connect: "Подключение и безопасность",
  cta: "CTA / Карусель роботов",
  stats: "Статистика",
  exchanges: "Биржи",
  advantages: "Преимущества",
  how_it_works: "Как это работает",
  testimonials: "Отзывы",
  pricing: "Тарифы",
  faq: "FAQ",
};

const HELP_TEXT: Record<string, string> = {
  meta: "Title и Description отображаются во вкладках браузера и в поисковой выдаче.",
  nav: "Текст пунктов меню в шапке сайта.",
  hero: "Заголовок, подзаголовок и кнопки на главном экране. Поля поддерживают RU и EN.",
  why: "Три принципа проекта: специализированные стратегии, автоматизация, контроль риска.",
  choose: "Заголовок и подзаголовок блока сравнения роботов.",
  connect: "Шаги подключения по API и строка безопасности. Ключ без права вывода.",
  cta: "Карусель роботов, кнопки и строка доверия перед подвалом.",
  stats: "Цифры статистики на главной странице.",
  exchanges: "Список бирж, которые поддерживает сайт.",
  advantages: "Карточки преимуществ с иконками.",
  how_it_works: "Шаги Как это работает — нумеруются автоматически.",
  testimonials: "Отзывы клиентов.",
  pricing: "Тарифные планы — highlight указывает на рекомендуемый.",
  faq: "Вопросы и ответы. Вопросы сортируются в том же порядке.",
};

interface Field { key: string; label: string; multiline?: boolean; placeholder?: string; localized?: boolean; }
interface ListEditorProps {
  items: Json[];
  onChange: (items: Json[]) => void;
  emptyItem: () => Json;
  fields: Field[];
  hint?: string;
}

function FieldInput({ label, value, onChange, multiline, placeholder, localized }: {
  label: string; value: any; onChange: (v: any) => void;
  multiline?: boolean; placeholder?: string; localized?: boolean;
}) {
  const cls = "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue";
  if (localized) {
    const obj: { ru: string; en: string } =
      value && typeof value === "object" && !Array.isArray(value)
        ? { ru: String(value.ru ?? ""), en: String(value.en ?? "") }
        : { ru: typeof value === "string" ? value : "", en: "" };
    return (
      <div className="space-y-1">
        <span className="block text-xs font-medium text-gray-400">{label}</span>
        <input className={cls} value={obj.ru} onChange={(e) => onChange({ ...obj, ru: e.target.value })} placeholder="RU" />
        <input className={cls} value={obj.en} onChange={(e) => onChange({ ...obj, en: e.target.value })} placeholder="EN" />
      </div>
    );
  }
  return (
    <div className="space-y-1">
      <span className="block text-xs font-medium text-gray-400">{label}</span>
      {multiline ? (
        <textarea rows={3} className={cls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input className={cls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function ListEditor({ items, onChange, emptyItem, fields, hint }: ListEditorProps) {
  const updateItem = (i: number, val: Json) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };
  const removeItem = (i: number) => onChange(items.filter((_, j) => j !== i));
  const addItem = () => onChange([...items, emptyItem()]);

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="text-gray-500 text-sm py-4 text-center bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
          {hint ?? "Список пустой. Нажмите Добавить"}
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-500">#{i + 1}</span>
            <button onClick={() => removeItem(i)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded" aria-label="Удалить">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((f) => (
              <FieldInput
                key={f.key}
                label={f.label}
                value={(item as Record<string, Json>)?.[f.key] ?? ""}
                onChange={(v) => updateItem(i, { ...(item as Record<string, Json>), [f.key]: v })}
                multiline={f.multiline}
                placeholder={f.placeholder}
                localized={f.localized}
              />
            ))}
          </div>
        </div>
      ))}
      <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
        <Plus size={16} /> Добавить
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const [sections, setSections] = useState<Record<string, Json>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.from("site_content").select("*").then(({ data }) => {
      const map: Record<string, Json> = {};
      data?.forEach((row) => { map[row.section] = row.data; });
      setSections(map);
      setLoading(false);
    });
  }, []);

  const updateData = (section: string, data: Json) => {
    setSections((prev) => ({ ...prev, [section]: data }));
  };

  const save = async (section: string, data: Json) => {
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_content")
      .upsert({ section, data });
    if (!error) {
      setSaved(section);
      setTimeout(() => setSaved(null), 2000);
    }
    setSaving(false);
  };

  // --- Секция: meta (title, description) ---
  const MetaEditor = () => {
    const d = sections.meta ?? {};
    return (
      <div className="space-y-3">
        <FieldInput label="Title (заголовок вкладки)" value={String(d.title ?? "")}
          onChange={(v) => updateData("meta", { ...d, title: v })} multiline placeholder="Trading Auto Pilot  Торговые роботы..." />
        <FieldInput label="Description (описание для поисковиков)" value={String(d.description ?? "")}
          onChange={(v) => updateData("meta", { ...d, description: v })} multiline placeholder="Trading Auto Pilot  интеллектуальные торговые роботы..." />
      </div>
    );
  };

  // --- Секция: stats ---
  const StatsEditor = () => {
    const d = sections.stats ?? {};
    const rows: Field[] = [
      { key: "users", label: "Значение", placeholder: "12400+" },
      { key: "users_label", label: "Подпись", placeholder: "Активных пользователей" },
      { key: "volume", label: "Значение", placeholder: "$58M+" },
      { key: "volume_label", label: "Подпись", placeholder: "Объём торгов" },
      { key: "uptime", label: "Значение", placeholder: "99.9%" },
      { key: "uptime_label", label: "Подпись", placeholder: "Uptime" },
    ];
    return (
      <div className="grid grid-cols-2 gap-3">
        {rows.map((f) => (
          <FieldInput key={f.key} label={f.label}
            value={String(d[f.key] ?? "")}
            onChange={(v) => updateData("stats", { ...d, [f.key]: v })}
            placeholder={f.placeholder} />
        ))}
      </div>
    );
  };

  // --- Секция: exchanges (string[]). ---
  const ExchangesEditor = () => {
    const items = Array.isArray(sections.exchanges) ? sections.exchanges : [];
    return (
      <ListEditor
        items={items}
        onChange={(next) => updateData("exchanges", next)}
        emptyItem={() => ""}
        fields={[{ key: "", label: "Название", multiline: false, placeholder: "Binance" }]}
        hint="Простой список бирж, например: Binance, Bybit, OKX"
      />
    );
  };

  // ---advantages ---
  const AdvantagesEditor = () => {
    const items = Array.isArray(sections.advantages) ? sections.advantages : [];
    return (
      <ListEditor
        items={items}
        onChange={(next) => updateData("advantages", next)}
        emptyItem={() => ({ icon: "shield", title: "", description: "" })}
        fields={[
          { key: "icon", label: "Иконка (ключ)", placeholder: "shield" },
          { key: "title", label: "Заголовок" },
          { key: "description", label: "Описание", multiline: true },
        ]}
      />
    );
  };

  // --- how_it_works ---
  const HowItWorksEditor = () => {
    const items = Array.isArray(sections.how_it_works) ? sections.how_it_works : [];
    return (
      <ListEditor
        items={items}
        onChange={(next) => updateData("how_it_works", next)}
        emptyItem={() => ({ step: "", title: "", description: "", icon: "bot" })}
        fields={[
          { key: "step", label: "Номер (01, 02...)" },
          { key: "title", label: "Заголовок" },
          { key: "description", label: "Описание", multiline: true },
          { key: "icon", label: "Иконка" },
        ]}
      />
    );
  };

  // --- testimonials ---
  const TestimonialsEditor = () => {
    const items = Array.isArray(sections.testimonials) ? sections.testimonials : [];
    return (
      <ListEditor
        items={items}
        onChange={(next) => updateData("testimonials", next)}
        emptyItem={() => ({ name: "", role: "", text: "", initials: "", color: "primary" })}
        fields={[
          { key: "name", label: "Имя" },
          { key: "role", label: "Роль / профессия" },
          { key: "initials", label: "Инициалы (2 буквы)" },
          { key: "color", label: "Цвет (primary/secondary/accent)" },
          { key: "text", label: "Текст отзыва", multiline: true },
        ]}
      />
    );
  };

  // --- pricing ---
  const PricingEditor = () => {
    const items = Array.isArray(sections.pricing) ? sections.pricing : [];
    return (
      <ListEditor
        items={items}
        onChange={(next) => updateData("pricing", next)}
        emptyItem={() => ({
          name: "", price: "", period: "", description: "",
          features: [] as string[], highlight: false, cta: ""
        })}
        fields={[
          { key: "name", label: "Название тарифа" },
          { key: "price", label: "Цена" },
          { key: "period", label: "Период" },
          { key: "description", label: "Описание", multiline: true },
          { key: "cta", label: "Текст кнопки" },
          { key: "highlight", label: "Рекомендуемый (true/false)" },
        ]}
      />
    );
  };

  // --- FAQ ---
  const FaqEditor = () => {
    const items = Array.isArray(sections.faq) ? sections.faq : [];
    return (
      <ListEditor
        items={items}
        onChange={(next) => updateData("faq", next)}
        emptyItem={() => ({ question: "", answer: "" })}
        fields={[
          { key: "question", label: "Вопрос" },
          { key: "answer", label: "Ответ", multiline: true },
        ]}
        hint="Добавляйте вопросы и ответы по одному"
      />
    );
  };

  // --- hero / why / choose / connect / cta / nav — текстовые секции ---
  const TEXT_SECTIONS: Record<string, Field[]> = {
    hero: [
      { key: "badge", label: "Плашка над заголовком", localized: true },
      { key: "title", label: "Заголовок", localized: true },
      { key: "subtitle", label: "Подзаголовок", localized: true, multiline: true },
      { key: "primary", label: "Кнопка: Выбрать робота", localized: true },
      { key: "secondary", label: "Вторая кнопка", localized: true },
      { key: "trust1", label: "Строка доверия 1", localized: true },
      { key: "trust2", label: "Строка доверия 2", localized: true },
      { key: "trust3", label: "Строка доверия 3", localized: true },
    ],
    choose: [
      { key: "title", label: "Заголовок", localized: true },
      { key: "subtitle", label: "Подзаголовок", localized: true, multiline: true },
    ],
    why: [
      { key: "title", label: "Заголовок", localized: true },
      { key: "subtitle", label: "Подзаголовок", localized: true, multiline: true },
    ],
    connect: [
      { key: "title", label: "Заголовок", localized: true },
      { key: "subtitle", label: "Подзаголовок", localized: true, multiline: true },
      { key: "note", label: "Строка безопасности", localized: true },
    ],
    cta: [
      { key: "carouselTitle", label: "Заголовок карусели", localized: true },
      { key: "carouselSubtitle", label: "Подзаголовок карусели", localized: true },
      { key: "contactBtn", label: "Кнопка связи с нами", localized: true },
      { key: "title", label: "Заголовок (резерв)" },
      { key: "subtitle", label: "Подзаголовок (резерв)", multiline: true },
      { key: "btn1", label: "Текст кнопки Смотреть роботов" },
      { key: "trust", label: "Строка доверия под кнопками" },
    ],
    nav: [
      { key: "bots", label: "Пункт меню Роботы" },
      { key: "how", label: "Пункт меню Как работает" },
      { key: "faq", label: "Пункт меню FAQ" },
    ],
  };

  const TextSectionEditor = ({ section, fields }: { section: string; fields: Field[] }) => {
    const d = sections[section] ?? {};
    return (
      <div className="space-y-3">
        {fields.map((f) => (
          <FieldInput
            key={f.key}
            label={f.label}
            value={d[f.key] ?? ""}
            onChange={(v) => updateData(section, { ...d, [f.key]: v })}
            multiline={f.multiline}
            localized={f.localized}
            placeholder={`Пример: ${f.label}`}
          />
        ))}
      </div>
    );
  };

  // --- why items ---
  const WhyItemsEditor = () => {
    const items = Array.isArray(sections.why?.items) ? sections.why.items : [];
    return (
      <ListEditor
        items={items}
        onChange={(next) => updateData("why", { ...(sections.why ?? {}), items: next })}
        emptyItem={() => ({ title: { ru: "", en: "" }, desc: { ru: "", en: "" } })}
        fields={[
          { key: "title", label: "Заголовок", localized: true },
          { key: "desc", label: "Описание", localized: true, multiline: true },
        ]}
      />
    );
  };

  // --- connect steps ---
  const ConnectStepsEditor = () => {
    const items = Array.isArray(sections.connect?.steps) ? sections.connect.steps : [];
    return (
      <ListEditor
        items={items}
        onChange={(next) => updateData("connect", { ...(sections.connect ?? {}), steps: next })}
        emptyItem={() => ({ title: { ru: "", en: "" }, desc: { ru: "", en: "" } })}
        fields={[
          { key: "title", label: "Заголовок", localized: true },
          { key: "desc", label: "Описание", localized: true, multiline: true },
        ]}
      />
    );
  };

  // --- Render ---
  const sectionKeys = Object.keys(SECTION_LABELS);

  if (loading) return <div className="text-white">Загрузка...</div>;
  if (sectionKeys.length === 0) {
    return (
      <div className="text-gray-400 text-center py-16">
        Секции контента ещё не созданы. Это нормально  они появятся после первой правки.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Контент сайта</h1>
        <p className="text-gray-400 text-sm mt-1">
          Редактируйте содержимое секций  изменения применяются на сайте сразу после сохранения.
        </p>
      </div>

      <div className="space-y-3">
        {sectionKeys.map((section) => {
          const label = SECTION_LABELS[section];
          const isOpen = open === section;
          const data = sections[section];
          const isSaved = saved === section;

          const renderContent = () => {
            if (section === "meta") return <MetaEditor />;
            if (section === "stats") return <StatsEditor />;
            if (section === "exchanges") return <ExchangesEditor />;
            if (section === "advantages") return <AdvantagesEditor />;
            if (section === "how_it_works") return <HowItWorksEditor />;
            if (section === "testimonials") return <TestimonialsEditor />;
            if (section === "pricing") return <PricingEditor />;
            if (section === "faq") return <FaqEditor />;
            if (section === "why") return (
              <>
                <TextSectionEditor section={section} fields={TEXT_SECTIONS[section]} />
                <WhyItemsEditor />
              </>
            );
            if (section === "connect") return (
              <>
                <TextSectionEditor section={section} fields={TEXT_SECTIONS[section]} />
                <ConnectStepsEditor />
              </>
            );
            if (TEXT_SECTIONS[section]) return <TextSectionEditor section={section} fields={TEXT_SECTIONS[section]} />;
            return null;
          };

          return (
            <div key={section} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : section)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <div className="font-semibold text-white">{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{HELP_TEXT[section]}</div>
                </div>
                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-800 space-y-4">
                  {renderContent()}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    {isSaved && (
                      <span className="text-sm text-green-400 flex items-center gap-1">
                        <Check size={16} /> Сохранено
                      </span>
                    )}
                    <button
                      onClick={() => save(section, data ?? {})}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Save size={16} /> {saving ? "Сохранение..." : "Сохранить"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}