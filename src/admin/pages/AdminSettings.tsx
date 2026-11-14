import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DEFAULT_SITE_CONTENT } from "@/lib/default-content";
import {
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  Send,
  ExternalLink,
  Search,
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
  X,
} from "lucide-react";
import { BenefitVisual, BENEFIT_VISUAL_LABELS } from "@/components/ui/BenefitVisual";

const BENEFIT_VISUAL_OPTIONS = BENEFIT_VISUAL_LABELS.map((label, i) => ({ value: String(i), label }));

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = any;

const SECTION_LABELS: Record<string, string> = {
  telegram_settings: "Уведомления в Telegram (новые заявки)",
  meta: "SEO, поисковая оптимизация и веб-аналитика",
  nav: "Меню в шапке сайта",
  hero: "Hero / Главный экран",
  hero_slides: "Карусель на главной странице (4 слайда)",
  contacts: "Контакты (Telegram, WhatsApp, Email, Телефон)",
  why: "Для чего нужны торговые боты",
  advantages: "Преимущества использования ботов",
  benefits: "Почему стоит выбрать нас (6 карточек)",
  pricing: "Наши цены (условия без подписки)",
  conclusion: "Заключение (итоги)",
  questions: "Остались вопросы? (Консультация)",
  tryIt: "Просто попробуйте (Секция выбора роботов)",
  connect: "Подключение и безопасность (4 шага по API)",
  exchanges: "Поддерживаемые биржи (BYBIT, Binance и др.)",
  faq: "FAQ (Часто задаваемые вопросы)",
  footer: "Подвал сайта (описание, копирайт, дисклеймер, биржи)",
  lead: "Форма заявки (заголовки, поля, правая панель)",
  calculator: "Калькулятор доходности (заголовки)",
  products: "Секция роботов (кнопка, бейдж «В разработке», дисклеймер)",
  botDetail: "Страница робота (заголовки блоков, дисклеймер)",
};

const HELP_TEXT: Record<string, string> = {
  telegram_settings: "Мгновенные оповещения в ваш Telegram при поступлении каждой новой заявки с сайта.",
  meta: "Title, Description, ключевые слова, счетчики Яндекс.Метрики и Google Analytics 4, sitemap.xml и robots.txt.",
  nav: "Тексты пунктов меню в шапке (О проекте, Роботы, Как работает, FAQ, Связаться).",
  hero: "Заголовки, подзаголовок, кнопки и строки доверия на первом экране.",
  hero_slides: "4 слайда карусели: тег/бейдж слайда, заголовок и текст описания. Порядок — порядок показа.",
  contacts: "Каналы связи для всего сайта: прямые ссылки Telegram, WhatsApp, email и телефон.",
  why: "Блок «Для чего нужны торговые боты» — заголовок, пояснительный текст и тезисы.",
  advantages: "Карточки преимуществ: круглосуточная работа, отсутствие эмоций, скорость и т.д.",
  benefits: "Карточки «Почему стоит выбрать нас»: подпись-тег, заголовок и описание.",
  pricing: "Блок «Наши цены» — условия модели: без абонплаты, покупка навсегда.",
  conclusion: "Блок «Заключение» — итоговые тезисы страницы перед формой.",
  questions: "Блок «Остались вопросы?» — кнопка бесплатной консультации через Telegram.",
  tryIt: "Секция «Просто попробуйте!» перед карточками роботов — заголовки, буллеты, кнопка.",
  connect: "Шаги подключения по API и строка безопасности (без права вывода).",
  exchanges: "Список бирж, с которыми совместимы торговые боты.",
  faq: "Вопросы и ответы. Порядок отображения совпадает с порядком в списке.",
  footer: "Тексты подвала: описание, копирайт, предупреждение о рисках, список бирж (через запятую).",
  lead: "Тексты формы заявки: заголовок, подзаголовок, поля, кнопки и правая панель «Почему стоит написать нам».",
  calculator: "Заголовок и подзаголовок блока калькулятора доходности.",
  products: "Тексты секции карточек роботов: кнопка «Подробнее», бейдж «В разработке», предупреждение о рисках.",
  botDetail: "Тексты детальной страницы робота: заголовки блоков, безопасность API, дисклеймер о доходности.",
};

const CATEGORIES = [
  { id: "all", label: "Все секции", icon: "🌐" },
  { id: "main", label: "Главная и меню", keys: ["nav", "hero", "hero_slides", "exchanges"], icon: "📌" },
  { id: "bots", label: "О роботах", keys: ["why", "advantages", "benefits", "pricing", "tryIt", "products", "botDetail"], icon: "🤖" },
  { id: "trust", label: "Контакты и доверие", keys: ["contacts", "connect", "questions", "conclusion", "lead", "calculator", "footer"], icon: "💬" },
  { id: "faq", label: "FAQ", keys: ["faq"], icon: "❓" },
  { id: "seo", label: "SEO и Telegram", keys: ["meta", "telegram_settings"], icon: "🔍" },
];

interface Field {
  key: string;
  label: string;
  multiline?: boolean;
  placeholder?: string;
  localized?: boolean;
  options?: { value: string; label: string }[];
}

interface ListEditorProps {
  items: Json[];
  onChange: (items: Json[]) => void;
  emptyItem: () => Json;
  fields: Field[];
  hint?: string;
  preview?: (item: Json, index: number) => React.ReactNode;
}

function FieldInput({
  label,
  value,
  onChange,
  multiline,
  placeholder,
  localized,
  options,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  multiline?: boolean;
  placeholder?: string;
  localized?: boolean;
  options?: { value: string; label: string }[];
}) {
  const cls =
    "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue";

  if (options) {
    const current = String(value ?? "");
    return (
      <div className="space-y-1.5">
        <span className="block text-xs font-medium text-gray-300">{label}</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onChange("")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              current === ""
                ? "bg-brand-blue/20 border-brand-blue text-white"
                : "bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600"
            }`}
          >
            По порядку
          </button>
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                current === o.value
                  ? "bg-brand-blue/20 border-brand-blue text-white"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600"
              }`}
            >
              {o.value} · {o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (localized) {
    const obj: { ru: string; en: string } =
      value && typeof value === "object" && !Array.isArray(value)
        ? { ru: String(value.ru ?? ""), en: String(value.en ?? "") }
        : { ru: typeof value === "string" ? value : "", en: "" };

    return (
      <div className="space-y-1.5">
        <span className="block text-xs font-medium text-gray-300">{label}</span>
        {multiline ? (
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-gray-400 bg-gray-900/80 px-1.5 py-0.5 rounded border border-gray-700">
                RU
              </span>
              <textarea
                rows={3}
                className={`${cls} pt-7 text-xs sm:text-sm leading-relaxed`}
                value={obj.ru}
                onChange={(e) => onChange({ ...obj, ru: e.target.value })}
                placeholder={placeholder || "Текст на русском"}
              />
            </div>
            <div className="relative">
              <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-gray-400 bg-gray-900/80 px-1.5 py-0.5 rounded border border-gray-700">
                EN
              </span>
              <textarea
                rows={3}
                className={`${cls} pt-7 text-xs sm:text-sm leading-relaxed`}
                value={obj.en}
                onChange={(e) => onChange({ ...obj, en: e.target.value })}
                placeholder={placeholder || "English text"}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 bg-gray-900/80 px-1.5 py-0.5 rounded border border-gray-700">
                RU
              </span>
              <input
                className={`${cls} pl-11 text-xs sm:text-sm`}
                value={obj.ru}
                onChange={(e) => onChange({ ...obj, ru: e.target.value })}
                placeholder="На русском"
              />
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 bg-gray-900/80 px-1.5 py-0.5 rounded border border-gray-700">
                EN
              </span>
              <input
                className={`${cls} pl-11 text-xs sm:text-sm`}
                value={obj.en}
                onChange={(e) => onChange({ ...obj, en: e.target.value })}
                placeholder="In English"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <span className="block text-xs font-medium text-gray-300">{label}</span>
      {multiline ? (
        <textarea
          rows={3}
          className={`${cls} text-xs sm:text-sm leading-relaxed`}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={`${cls} text-xs sm:text-sm`}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function ListEditor({ items, onChange, emptyItem, fields, hint, preview }: ListEditorProps) {
  const updateItem = (i: number, val: Json) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };
  const removeItem = (i: number) => onChange(items.filter((_, j) => j !== i));
  const addItem = () => onChange([...items, emptyItem()]);

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <div className="text-gray-500 text-sm py-4 text-center bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
          {hint ?? "Список пустой. Нажмите «Добавить элемент»"}
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} className="bg-gray-850 bg-gray-800/80 border border-gray-700/80 rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-gray-750 border-gray-700/50">
            <span className="text-xs font-mono font-semibold text-brand-blue bg-blue-500/10 px-2 py-0.5 rounded">
              #{i + 1}
            </span>
            <button
              onClick={() => removeItem(i)}
              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/15 rounded-lg transition-colors cursor-pointer"
              title="Удалить карточку"
            >
              <Trash2 size={15} />
            </button>
          </div>
          <div className="flex items-start gap-3">
            {preview ? (
              <div className="shrink-0 rounded-xl bg-white p-1 ring-1 ring-gray-700/60" title="Предпросмотр графики карточки">
                {preview(item, i)}
              </div>
            ) : null}
            <div className="grid flex-1 grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map((f) => (
                <FieldInput
                  key={f.key}
                  label={f.label}
                  value={(item as Record<string, Json>)?.[f.key] ?? ""}
                  onChange={(v) => updateItem(i, { ...(item as Record<string, Json>), [f.key]: v })}
                multiline={f.multiline}
                placeholder={f.placeholder}
                localized={f.localized}
                options={f.options}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addItem}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs sm:text-sm font-medium text-gray-200 transition-colors cursor-pointer"
      >
        <Plus size={15} /> Добавить элемент
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const [sections, setSections] = useState<Record<string, Json>>(DEFAULT_SITE_CONTENT);
  const [originalSections, setOriginalSections] = useState<Record<string, Json>>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["hero"]));
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/site-content");
        if (res.ok) {
          const apiData = await res.json();
          if (mounted && apiData && typeof apiData === "object" && Object.keys(apiData).length > 0) {
            const merged = { ...DEFAULT_SITE_CONTENT, ...apiData };
            setSections(merged);
            setOriginalSections(merged);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("fetch /api/site-content error, trying supabase fallback", e);
      }

      if (supabase) {
        try {
          const { data } = await supabase.from("site_content").select("*");
          if (mounted && data && data.length > 0) {
            const map: Record<string, Json> = {};
            data.forEach((row: any) => {
              const k = row.section || row.key;
              const v = row.data !== undefined ? row.data : row.value;
              if (k) map[k] = v;
            });
            const merged = { ...DEFAULT_SITE_CONTENT, ...map };
            setSections(merged);
            setOriginalSections(merged);
          }
        } catch (e) {
          console.warn("supabase error", e);
        }
      }
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAll = () => {
    setOpenSections(new Set(Object.keys(SECTION_LABELS)));
  };

  const collapseAll = () => {
    setOpenSections(new Set());
  };

  const updateData = (section: string, data: Json) => {
    setSections((prev) => ({ ...prev, [section]: data }));
  };

  const save = async (section: string, data: Json) => {
    setSavingSection(section);
    try {
      await fetch("/api/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: section, value: data }),
      });
      if (supabase) {
        await supabase.from("site_content").upsert({ section, data, key: section, value: data });
      }
      // Mark section as saved — update original to track unsaved state
      setOriginalSections((prev) => ({ ...prev, [section]: data }));
      setSavedSection(section);
      setTimeout(() => setSavedSection((curr) => (curr === section ? null : curr)), 2500);
    } catch (err: any) {
      alert("Не удалось сохранить: " + (err?.message || "Ошибка сети"));
    } finally {
      setSavingSection(null);
    }
  };

  const dirtySections = useMemo(
    () => Object.keys(SECTION_LABELS).filter((k) => JSON.stringify(sections[k]) !== JSON.stringify(originalSections[k])),
    [sections, originalSections]
  );

  const saveAll = async () => {
    if (dirtySections.length === 0) return;
    setSavingSection("__all__");
    try {
      for (const section of dirtySections) {
        const data = sections[section];
        await fetch("/api/site-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: section, value: data }),
        });
        if (supabase) {
          await supabase.from("site_content").upsert({ section, data, key: section, value: data });
        }
        setOriginalSections((prev) => ({ ...prev, [section]: data }));
      }
      setSavedSection("__all__");
      setTimeout(() => setSavedSection((curr) => (curr === "__all__" ? null : curr)), 2500);
    } catch (err: any) {
      alert("Не удалось сохранить: " + (err?.message || "Ошибка сети"));
    } finally {
      setSavingSection(null);
    }
  };

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtySections.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirtySections.length]);

  const resetToDefault = async (section: string) => {
    const label = SECTION_LABELS[section] || section;
    const ok = window.confirm(`Сбросить содержимое секции «${label}» к исходным значениям по умолчанию?`);
    if (!ok) return;

    const def = DEFAULT_SITE_CONTENT[section];
    if (def !== undefined) {
      updateData(section, def);
      await save(section, def);
    }
  };

  // --- Meta & SEO Editor ---
  const MetaEditor = () => {
    const d = sections.meta ?? DEFAULT_SITE_CONTENT.meta ?? {};
    const siteUrl = String(d.site_url || "https://coinsofter.com").replace(/\/+$/, "");
    const title = String(d.title || "TradingAutoPilot — Торговые боты для криптобирж и акций");
    const description = String(d.description || "Автоматизируйте торговлю на Bybit, Binance и фондовых рынках. 3 стратегии.");

    const resetRobots = () => {
      const defaultRobots = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin",
        "Disallow: /admin/",
        "Disallow: /api/",
        "",
        `Sitemap: ${siteUrl}/sitemap.xml`,
      ].join("\n");
      updateData("meta", { ...d, robots_txt: defaultRobots });
    };

    return (
      <div className="space-y-6">
        {/* SERP Live Preview */}
        <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Предпросмотр в поиске (Google / Яндекс)</span>
            <span className="text-[11px] font-mono text-emerald-400">SERP Snippet</span>
          </div>
          <div className="p-3 bg-gray-900/80 rounded-lg border border-gray-800 text-sm">
            <div className="text-xs text-gray-400 truncate flex items-center gap-1.5 font-mono mb-1">
              <span className="text-emerald-400">🌐</span>
              <span>{siteUrl}</span>
            </div>
            <div className="text-base font-medium text-blue-400 hover:underline cursor-pointer line-clamp-1">
              {title}
            </div>
            <div className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span className="font-medium text-gray-300">Title (заголовок страницы в браузере и поисковой выдаче)</span>
              <span className={title.length > 65 ? "text-amber-400" : "text-emerald-400"}>
                {title.length} / 65 симв.
              </span>
            </div>
            <input
              type="text"
              value={String(d.title ?? "")}
              onChange={(e) => updateData("meta", { ...d, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="TradingAutoPilot — Торговые боты для криптобирж"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span className="font-medium text-gray-300">Description (описание для сниппетов)</span>
              <span className={description.length > 165 ? "text-amber-400" : "text-emerald-400"}>
                {description.length} / 165 симв.
              </span>
            </div>
            <textarea
              rows={3}
              value={String(d.description ?? "")}
              onChange={(e) => updateData("meta", { ...d, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Краткое описание преимуществ..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Ключевые слова (Keywords)
              </label>
              <input
                type="text"
                value={String(d.keywords ?? "")}
                onChange={(e) => updateData("meta", { ...d, keywords: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="крипто боты, автоматическая торговля, Bybit..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Канонический адрес сайта (URL)
              </label>
              <input
                type="text"
                value={String(d.site_url ?? "")}
                onChange={(e) => updateData("meta", { ...d, site_url: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="https://coinsofter.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              OG Image URL (превью-картинка в мессенджерах)
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={String(d.og_image ?? "")}
                onChange={(e) => updateData("meta", { ...d, og_image: e.target.value })}
                className="flex-1 px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="https://coinsofter.com/og-image.svg"
              />
              {d.og_image && (
                <img
                  src={String(d.og_image)}
                  alt="OG preview"
                  className="h-10 w-16 object-cover rounded border border-gray-700 shrink-0"
                />
              )}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="pt-4 border-t border-gray-800 space-y-4">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <span>📊 Веб-аналитика (счетчики)</span>
            <span className="text-xs text-gray-500 font-normal">(внедряются в шапку сайта автоматически)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Яндекс.Метрика (Номер счётчика)
              </label>
              <input
                type="text"
                value={String(d.yandex_metrika_id ?? "")}
                onChange={(e) => updateData("meta", { ...d, yandex_metrika_id: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="Например: 98765432"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Google Analytics 4 (Measurement ID)
              </label>
              <input
                type="text"
                value={String(d.google_analytics_id ?? "")}
                onChange={(e) => updateData("meta", { ...d, google_analytics_id: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="Например: G-XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Robots.txt & Sitemap Section */}
        <div className="pt-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">🤖 Редактор robots.txt</span>
            <button
              type="button"
              onClick={resetRobots}
              className="text-xs text-gray-400 hover:text-white px-2.5 py-1 bg-gray-800 hover:bg-gray-700 rounded transition-colors cursor-pointer"
            >
              Сбросить к рекомендованному
            </button>
          </div>

          <textarea
            rows={5}
            value={String(d.robots_txt ?? "")}
            onChange={(e) => updateData("meta", { ...d, robots_txt: e.target.value })}
            className="w-full p-3 bg-gray-950 font-mono text-xs text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            placeholder={`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml`}
          />

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-semibold transition-colors"
            >
              🌐 Открыть sitemap.xml <ExternalLink size={12} />
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-lg text-xs font-semibold transition-colors"
            >
              📄 Открыть robots.txt <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    );
  };

  // --- Telegram Settings Editor ---
  const TelegramEditor = () => {
    const d = sections.telegram_settings ?? DEFAULT_SITE_CONTENT.telegram_settings ?? { bot_token: "", chat_id: "", enabled: true };
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);

    const runTest = async () => {
      setTesting(true);
      setTestResult(null);
      try {
        const res = await fetch("/api/telegram/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bot_token: d.bot_token,
            chat_id: d.chat_id,
          }),
        });
        const json = await res.json();
        if (res.ok) {
          setTestResult({ success: true, message: json.message || "Тестовое сообщение доставлено!" });
        } else {
          setTestResult({ success: false, message: json.error || "Не удалось отправить сообщение" });
        }
      } catch (err: any) {
        setTestResult({ success: false, message: err.message || "Ошибка подключения к серверу" });
      } finally {
        setTesting(false);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-800/80 rounded-lg border border-gray-700">
          <input
            id="tg-enabled"
            type="checkbox"
            checked={Boolean(d.enabled)}
            onChange={(e) => updateData("telegram_settings", { ...d, enabled: e.target.checked })}
            className="w-4 h-4 rounded text-brand-blue bg-gray-900 border-gray-700 focus:ring-brand-blue cursor-pointer"
          />
          <label htmlFor="tg-enabled" className="text-sm font-medium text-white cursor-pointer select-none">
            Включить отправку оповещений о новых заявках в Telegram
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Telegram Bot Token
            </label>
            <input
              type="password"
              value={String(d.bot_token ?? "")}
              onChange={(e) => updateData("telegram_settings", { ...d, bot_token: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono"
              placeholder="1234567890:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
            />
            <span className="text-[11px] text-gray-500 mt-1 block">Получите у @BotFather в Telegram</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Telegram Chat ID / Group ID
            </label>
            <input
              type="text"
              value={String(d.chat_id ?? "")}
              onChange={(e) => updateData("telegram_settings", { ...d, chat_id: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono"
              placeholder="123456789 или -1001234567890"
            />
            <span className="text-[11px] text-gray-500 mt-1 block">Ваш ID или ID группы (узнать через @userinfobot)</span>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={runTest}
            disabled={testing || !d.bot_token || !d.chat_id}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/15 hover:bg-sky-500/25 disabled:opacity-40 text-sky-400 border border-sky-500/25 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Send size={13} /> {testing ? "Отправка теста..." : "Отправить тестовое сообщение"}
          </button>
          {testResult && (
            <span className={`text-xs ${testResult.success ? "text-emerald-400" : "text-rose-400"}`}>
              {testResult.message}
            </span>
          )}
        </div>
      </div>
    );
  };
  // --- Exchanges Tag / Chip Editor ---
  const ExchangesEditor = () => {
    const items: string[] = Array.isArray(sections.exchanges)
      ? sections.exchanges
      : DEFAULT_SITE_CONTENT.exchanges || [];
    const [newExchange, setNewExchange] = useState("");

    const addExchange = () => {
      const clean = newExchange.trim();
      if (!clean) return;
      if (!items.includes(clean)) {
        updateData("exchanges", [...items, clean]);
      }
      setNewExchange("");
    };

    const removeExchange = (index: number) => {
      updateData("exchanges", items.filter((_, i) => i !== index));
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {items.map((ex, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 text-white text-xs font-semibold border border-gray-700 shadow-sm"
            >
              <span>{ex}</span>
              <button
                type="button"
                onClick={() => removeExchange(i)}
                className="text-gray-400 hover:text-red-400 p-0.5 rounded cursor-pointer"
                title="Удалить"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 max-w-sm">
          <input
            type="text"
            value={newExchange}
            onChange={(e) => setNewExchange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExchange())}
            placeholder="Название биржи (например: Kraken)"
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <button
            type="button"
            onClick={addExchange}
            className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
          >
            <Plus size={14} /> Добавить
          </button>
        </div>
      </div>
    );
  };

  // --- Advantages Editor ---
  const AdvantagesEditor = () => {
    const d = sections.advantages ?? DEFAULT_SITE_CONTENT.advantages ?? {};
    const items = Array.isArray(d.items) ? d.items : [];

    return (
      <div className="space-y-4">
        <FieldInput
          label="Общий заголовок секции"
          value={d.title}
          onChange={(v) => updateData("advantages", { ...d, title: v })}
          localized
        />
        <div className="pt-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Карточки преимуществ ({items.length})
          </span>
          <ListEditor
            items={items}
            onChange={(next) => updateData("advantages", { ...d, items: next })}
            emptyItem={() => ({ visual: "", title: { ru: "", en: "" }, desc: { ru: "", en: "" } })}
            preview={(item, i) => <BenefitVisual index={i} name={(item as any)?.visual} className="h-20 w-20" />}
            fields={[
              { key: "visual", label: "Графика", options: BENEFIT_VISUAL_OPTIONS },
              { key: "title", label: "Заголовок карточки", localized: true },
              { key: "desc", label: "Описание", localized: true, multiline: true },
            ]}
          />
        </div>
      </div>
    );
  };

  // --- Benefits Editor ---
  const BenefitsEditor = () => {
    const d = sections.benefits ?? DEFAULT_SITE_CONTENT.benefits ?? {};
    const items = Array.isArray(d.items) ? d.items : [];

    return (
      <div className="space-y-4">
        <FieldInput
          label="Заголовок секции"
          value={d.title}
          onChange={(v) => updateData("benefits", { ...d, title: v })}
          localized
        />
        <FieldInput
          label="Подзаголовок секции"
          value={d.subtitle}
          onChange={(v) => updateData("benefits", { ...d, subtitle: v })}
          localized
          multiline
        />
        <FieldInput
          label="Плашка «Telegram-боты»"
          value={d.formatTelegram}
          onChange={(v) => updateData("benefits", { ...d, formatTelegram: v })}
          localized
        />
        <FieldInput
          label="Плашка «Программа для Windows»"
          value={d.formatWindows}
          onChange={(v) => updateData("benefits", { ...d, formatWindows: v })}
          localized
        />
        <div className="pt-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Карточки преимуществ ({items.length})
          </span>
          <ListEditor
            items={items}
            onChange={(next) => updateData("benefits", { ...d, items: next })}
            emptyItem={() => ({ icon: "", tag: { ru: "", en: "" }, title: { ru: "", en: "" }, desc: { ru: "", en: "" } })}
            preview={(item, i) => <BenefitVisual index={i} name={(item as any)?.icon} className="h-20 w-20" />}
            fields={[
              { key: "icon", label: "Графика", options: BENEFIT_VISUAL_OPTIONS },
              { key: "tag", label: "Плашка-тег (например: Без подписки)", localized: true },
              { key: "title", label: "Заголовок", localized: true },
              { key: "desc", label: "Описание", localized: true, multiline: true },
            ]}
          />
        </div>
      </div>
    );
  };

  // --- Why Section Editor ---
  const WhyEditor = () => {
    const d = sections.why ?? DEFAULT_SITE_CONTENT.why ?? {};
    const items = Array.isArray(d.items) ? d.items : [];

    return (
      <div className="space-y-4">
        <FieldInput
          label="Заголовок блока"
          value={d.purposeTitle}
          onChange={(v) => updateData("why", { ...d, purposeTitle: v })}
          localized
        />
        <FieldInput
          label="Основной пояснительный текст"
          value={d.purposeText}
          onChange={(v) => updateData("why", { ...d, purposeText: v })}
          localized
          multiline
        />
        {items.length > 0 && (
          <div className="pt-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Тезисы блока
            </span>
            <ListEditor
              items={items}
              onChange={(next) => updateData("why", { ...d, items: next })}
              emptyItem={() => ({ title: { ru: "", en: "" }, desc: { ru: "", en: "" } })}
              fields={[
                { key: "title", label: "Заголовок", localized: true },
                { key: "desc", label: "Описание", localized: true, multiline: true },
              ]}
            />
          </div>
        )}
      </div>
    );
  };

  // --- Connect Steps Editor ---
  const ConnectEditor = () => {
    const d = sections.connect ?? DEFAULT_SITE_CONTENT.connect ?? {};
    const steps = Array.isArray(d.steps) ? d.steps : [];

    return (
      <div className="space-y-4">
        <FieldInput
          label="Заголовок блока"
          value={d.title}
          onChange={(v) => updateData("connect", { ...d, title: v })}
          localized
        />
        <FieldInput
          label="Подзаголовок"
          value={d.subtitle}
          onChange={(v) => updateData("connect", { ...d, subtitle: v })}
          localized
          multiline
        />
        <FieldInput
          label="Строка безопасности (API без права вывода)"
          value={d.note}
          onChange={(v) => updateData("connect", { ...d, note: v })}
          localized
        />
        <div className="pt-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Шаги подключения ({steps.length})
          </span>
          <ListEditor
            items={steps}
            onChange={(next) => updateData("connect", { ...d, steps: next })}
            emptyItem={() => ({ visual: "", title: { ru: "", en: "" }, desc: { ru: "", en: "" } })}
            preview={(item, i) => <BenefitVisual index={i} name={(item as any)?.visual ?? (item as any)?.icon} className="h-16 w-16" />}
            fields={[
              { key: "visual", label: "Графика", options: BENEFIT_VISUAL_OPTIONS },
              { key: "title", label: "Название шага", localized: true },
              { key: "desc", label: "Описание шага", localized: true, multiline: true },
            ]}
          />
        </div>
      </div>
    );
  };

  // --- FAQ Editor ---
  const FaqEditor = () => {
    const raw = Array.isArray(sections.faq) ? sections.faq : DEFAULT_SITE_CONTENT.faq || [];
    const items = raw.map((item: any) => ({
      q: item.q || item.question || "",
      a: item.a || item.answer || "",
    }));

    return (
      <div className="space-y-3">
        <ListEditor
          items={items}
          onChange={(next) => updateData("faq", next)}
          emptyItem={() => ({ q: "", a: "" })}
          fields={[
            { key: "q", label: "Вопрос" },
            { key: "a", label: "Ответ на вопрос", multiline: true },
          ]}
          hint="Добавляйте вопросы и подробные ответы для ваших посетителей"
        />
      </div>
    );
  };

  // --- Hero Slides Editor ---
  const HeroSlidesEditor = () => {
    const items = Array.isArray(sections.hero_slides)
      ? sections.hero_slides
      : (DEFAULT_SITE_CONTENT.hero_slides as any[]) || [];
    return (
      <ListEditor
        items={items}
        onChange={(next) => updateData("hero_slides", next)}
        emptyItem={() => ({ eyebrow: "", title: "", desc: "" })}
        fields={[
          { key: "eyebrow", label: "Тег / бейдж слайда (например: Преимущество)" },
          { key: "title", label: "Заголовок слайда" },
          { key: "desc", label: "Описание слайда", multiline: true },
        ]}
      />
    );
  };

  // --- Lead Editor (form texts + why-items list) ---
  const LeadEditor = () => {
    const d = sections.lead ?? DEFAULT_SITE_CONTENT.lead ?? {};
    const whyItems: Json[] = Array.isArray(d.whyItems) ? d.whyItems : [];
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldInput label="Заголовок формы" value={d.title} localized onChange={(v) => updateData("lead", { ...d, title: v })} placeholder="Оставить заявку" />
          <FieldInput label="Подзаголовок" value={d.subtitle} localized multiline onChange={(v) => updateData("lead", { ...d, subtitle: v })} placeholder="Подберём робота под вашу стратегию" />
          <FieldInput label="Поле «Ваше имя»" value={d.name} localized onChange={(v) => updateData("lead", { ...d, name: v })} placeholder="Ваше имя" />
          <FieldInput label="Поле «Telegram или email»" value={d.contact} localized onChange={(v) => updateData("lead", { ...d, contact: v })} placeholder="Telegram или email" />
          <FieldInput label="Поле «Интересующий робот»" value={d.bot} localized onChange={(v) => updateData("lead", { ...d, bot: v })} placeholder="Интересующий робот" />
          <FieldInput label="Пункт «Любой робот»" value={d.botAny} localized onChange={(v) => updateData("lead", { ...d, botAny: v })} placeholder="Любой робот" />
          <FieldInput label="Поле «Сообщение»" value={d.message} localized onChange={(v) => updateData("lead", { ...d, message: v })} placeholder="Сообщение" />
          <FieldInput label="Текст кнопки отправки" value={d.submit} localized onChange={(v) => updateData("lead", { ...d, submit: v })} placeholder="Отправить заявку" />
          <FieldInput label="Сообщение об успехе" value={d.success} localized onChange={(v) => updateData("lead", { ...d, success: v })} placeholder="Заявка отправлена!" />
          <FieldInput label="Сообщение об ошибке" value={d.error} localized onChange={(v) => updateData("lead", { ...d, error: v })} placeholder="Не удалось отправить заявку" />
          <FieldInput label="Согласие на обработку данных" value={d.privacy} localized onChange={(v) => updateData("lead", { ...d, privacy: v })} placeholder="Нажимая кнопку, вы соглашаетесь..." />
          <FieldInput label="Кнопка «Отправить ещё одну»" value={d.again} localized onChange={(v) => updateData("lead", { ...d, again: v })} placeholder="Отправить ещё одну заявку" />
          <FieldInput label="Заголовок правой панели" value={d.whyTitle} localized onChange={(v) => updateData("lead", { ...d, whyTitle: v })} placeholder="Почему стоит написать нам?" />
          <FieldInput label="Подзаголовок правой панели" value={d.whySubtitle} localized multiline onChange={(v) => updateData("lead", { ...d, whySubtitle: v })} placeholder="Отвечаем в течение часа..." />
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-300 mb-2">Пункты правой панели (пусто — используются тексты по умолчанию)</div>
          <ListEditor
            items={whyItems}
            onChange={(next) => updateData("lead", { ...d, whyItems: next })}
            emptyItem={() => ({ title: "", desc: "" })}
            fields={[
              { key: "title", label: "Заголовок пункта", localized: true },
              { key: "desc", label: "Описание пункта", multiline: true, localized: true },
            ]}
          />
        </div>
      </div>
    );
  };

  // --- Field configurations for plain text/localized sections ---
  const TEXT_SECTION_FIELDS: Record<string, Field[]> = {
    nav: [
      { key: "project", label: "О проекте", localized: true },
      { key: "bots", label: "Роботы", localized: true },
      { key: "how", label: "Как работает", localized: true },
      { key: "faq", label: "FAQ", localized: true },
      { key: "contact", label: "Связаться", localized: true },
      { key: "cta", label: "Кнопка в шапке (Смотреть роботов)", localized: true },
    ],
    hero: [
      { key: "badge", label: "Плашка над заголовком (20+ бирж · ИИ-торговля 24/7)", localized: true },
      { key: "heading1", label: "Первая строка заголовка", localized: true },
      { key: "heading2", label: "Вторая строка заголовка (градиент)", localized: true },
      { key: "subtitle", label: "Главный подзаголовок", localized: true, multiline: true },
      { key: "primary", label: "Текст кнопки 1 (Выбрать робота)", localized: true },
      { key: "secondary", label: "Текст кнопки 2 (Как это работает)", localized: true },
      { key: "trust1", label: "Строка доверия 1 (Без абонплаты)", localized: true },
      { key: "trust2", label: "Строка доверия 2 (Подключение за 2 мин)", localized: true },
      { key: "trust3", label: "Строка доверия 3 (API без права вывода)", localized: true },
    ],
    contacts: [
      { key: "telegram", label: "Ссылка Telegram (например: https://t.me/coinsofter)" },
      { key: "whatsapp", label: "Ссылка WhatsApp (вид: https://wa.me/79991234567)" },
      { key: "email", label: "Email адрес (например: info@coinsofter.com)" },
      { key: "phone", label: "Телефон для показа на сайте (+7 999 000-00-00)" },
    ],
    pricing: [
      { key: "title", label: "Заголовок блока «Наши цены»", localized: true },
      { key: "text1", label: "Первый абзац (об отсутствии подписок)", localized: true, multiline: true },
      { key: "text2", label: "Второй абзац (о доходности и рисках)", localized: true, multiline: true },
    ],
    conclusion: [
      { key: "title", label: "Заголовок блока «Заключение»", localized: true },
      { key: "text1", label: "Первый абзац", localized: true, multiline: true },
      { key: "text2", label: "Второй абзац", localized: true, multiline: true },
    ],
    questions: [
      { key: "title", label: "Заголовок блока", localized: true },
      { key: "subtitle", label: "Подзаголовок (предложение консультации)", localized: true, multiline: true },
      { key: "btn", label: "Текст кнопки связи", localized: true },
    ],
    tryIt: [
      { key: "title", label: "Заголовок секции («Просто попробуйте!»)", localized: true },
      { key: "subtitle", label: "Описание под заголовком", localized: true, multiline: true },
      { key: "bullet1", label: "Преимущество 1 (Без абонентской платы)", localized: true },
      { key: "bullet2", label: "Преимущество 2 (Покупаете робота один раз)", localized: true },
      { key: "btn", label: "Текст кнопки старта", localized: true },
    ],
    calculator: [
      { key: "title", label: "Заголовок калькулятора", localized: true },
      { key: "subtitle", label: "Подзаголовок", localized: true, multiline: true },
      { key: "deposit", label: "Метка «Стартовый депозит»", localized: true },
      { key: "term", label: "Метка «Срок, мес.»", localized: true },
      { key: "bot", label: "Метка «Робот»", localized: true },
      { key: "result", label: "Метка «Прогноз»", localized: true },
      { key: "profit", label: "Метка «Прибыль»", localized: true },
      { key: "total", label: "Метка «Итого»", localized: true },
      { key: "note", label: "Предупреждение под результатом", localized: true, multiline: true },
      { key: "cta", label: "Текст кнопки", localized: true },
    ],
    products: [
      { key: "detail", label: "Текст кнопки «Подробнее»", localized: true },
      { key: "inDevelopment", label: "Бейдж «В разработке»", localized: true },
      { key: "disclaimer", label: "Предупреждение о рисках (под карточками)", localized: true, multiline: true },
    ],
    botDetail: [
      { key: "back", label: "Кнопка «Все роботы»", localized: true },
      { key: "about", label: "Заголовок «О роботе»", localized: true },
      { key: "howEarn", label: "Заголовок «Как робот зарабатывает»", localized: true },
      { key: "features", label: "Заголовок «Ключевые особенности»", localized: true },
      { key: "risks", label: "Заголовок «Риски»", localized: true },
      { key: "pairs", label: "Заголовок «Торгуемые активы»", localized: true },
      { key: "safetyTitle", label: "Заголовок «Безопасность API»", localized: true },
      { key: "safety", label: "Текст «Безопасность API»", localized: true, multiline: true },
      { key: "contactCta", label: "Кнопка «Обсудить запуск в Telegram»", localized: true },
      { key: "fits", label: "Заголовок «Какой робот вам подходит»", localized: true },
      { key: "others", label: "Заголовок «Другие роботы»", localized: true },
      { key: "disclaimer", label: "Дисклеймер под доходностью", localized: true, multiline: true },
    ],
    footer: [
      { key: "desc", label: "Описание под логотипом", localized: true, multiline: true },
      { key: "robotsTitle", label: "Заголовок «Роботы»", localized: true },
      { key: "supportTitle", label: "Заголовок «Поддержка»", localized: true },
      { key: "knowledgeTitle", label: "Пункт «База знаний»", localized: true },
      { key: "exchangesTitle", label: "Заголовок «Биржи»", localized: true },
      { key: "moreExchanges", label: "Сноска под биржами", localized: true },
      { key: "copyright", label: "Копирайт", localized: true },
      { key: "risk", label: "Предупреждение о рисках", localized: true, multiline: true },
      { key: "exchanges", label: "Список бирж (через запятую: BYBIT, Binance, OKX)" },
    ],
  };

  const TextSectionEditor = ({ section, fields }: { section: string; fields: Field[] }) => {
    const d = sections[section] ?? DEFAULT_SITE_CONTENT[section] ?? {};
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
            options={f.options}
            placeholder={`Введите ${f.label.toLowerCase()}`}
          />
        ))}
      </div>
    );
  };

  // Filter sections based on category and search query
  const filteredSections = useMemo(() => {
    let keys = Object.keys(SECTION_LABELS);

    if (activeCategory !== "all") {
      const cat = CATEGORIES.find((c) => c.id === activeCategory);
      if (cat?.keys) {
        keys = keys.filter((k) => cat.keys.includes(k));
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      keys = keys.filter((key) => {
        const label = (SECTION_LABELS[key] || "").toLowerCase();
        const help = (HELP_TEXT[key] || "").toLowerCase();
        const rawContent = JSON.stringify(sections[key] || "").toLowerCase();
        return label.includes(q) || help.includes(q) || rawContent.includes(q);
      });
    }

    return keys;
  }, [activeCategory, searchQuery, sections]);

  if (loading) {
    return (
      <div className="text-white py-12 text-center bg-gray-900 rounded-xl border border-gray-800">
        <Sparkles size={24} className="animate-spin text-brand-blue mx-auto mb-2" />
        Загрузка контента сайта...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Layers className="text-brand-blue" size={28} />
            Контент сайта
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Редактируйте тексты, заголовки, контакты и SEO. Изменения сохраняются в базу данных и применяются на сайте мгновенно.
          </p>
          {(() => {
            const unsavedCount = Object.keys(SECTION_LABELS).filter(
              (k) => JSON.stringify(sections[k]) !== JSON.stringify(originalSections[k])
            ).length;
            return unsavedCount > 0 ? (
              <p className="text-xs text-amber-400 mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {unsavedCount} {unsavedCount === 1 ? "секция изменена" : unsavedCount < 5 ? "секции изменены" : "секций изменено"} — не забудьте сохранить
              </p>
            ) : null;
          })()}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {dirtySections.length > 0 && (
            <button
              type="button"
              onClick={saveAll}
              disabled={savingSection !== null}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Save size={15} /> Сохранить всё ({dirtySections.length})
            </button>
          )}
          <button
            type="button"
            onClick={openSections.size > 0 ? collapseAll : expandAll}
            className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-lg border border-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {openSections.size > 0 ? (
              <>
                <ChevronUp size={15} /> Свернуть все
              </>
            ) : (
              <>
                <ChevronDown size={15} /> Развернуть все
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 sm:p-4 space-y-3 shadow-lg">
        {/* Search input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Быстрый поиск по названию секции или содержимому (например: Bybit, Telegram, FAQ, Заголовок...)"
            className="w-full pl-10 pr-9 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-brand-blue text-white shadow-sm"
                    : "bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sections count indicator */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>
          Найдено секций: <strong className="text-white">{filteredSections.length}</strong> из {Object.keys(SECTION_LABELS).length}
        </span>
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
            className="text-brand-blue hover:underline cursor-pointer"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* Empty Search Result */}
      {filteredSections.length === 0 && (
        <div className="text-gray-400 text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
          <HelpCircle size={36} className="mx-auto mb-3 opacity-30 text-gray-400" />
          <div className="text-base font-semibold text-gray-300">Ничего не найдено</div>
          <div className="text-xs text-gray-500 mt-1">
            Попробуйте изменить поисковый запрос или переключить категорию.
          </div>
        </div>
      )}

      {/* Sections Accordion List */}
      <div className="space-y-3">
        {filteredSections.map((section) => {
          const label = SECTION_LABELS[section] || section;
          const isOpen = openSections.has(section) || Boolean(searchQuery.trim());
          const data = sections[section] ?? DEFAULT_SITE_CONTENT[section] ?? {};
          const isSaved = savedSection === section || savedSection === "__all__";
          const isSaving = savingSection === section || savingSection === "__all__";
          // Check if section has unsaved changes by comparing with original
          const hasUnsaved = JSON.stringify(sections[section]) !== JSON.stringify(originalSections[section]);

          const renderContent = () => {
            if (section === "telegram_settings") return <TelegramEditor />;
            if (section === "meta") return <MetaEditor />;
            if (section === "hero_slides") return <HeroSlidesEditor />;
            if (section === "exchanges") return <ExchangesEditor />;
            if (section === "advantages") return <AdvantagesEditor />;
            if (section === "benefits") return <BenefitsEditor />;
            if (section === "why") return <WhyEditor />;
            if (section === "connect") return <ConnectEditor />;
            if (section === "faq") return <FaqEditor />;
            if (section === "lead") return <LeadEditor />;
            if (TEXT_SECTION_FIELDS[section]) {
              return <TextSectionEditor section={section} fields={TEXT_SECTION_FIELDS[section]} />;
            }
            return null;
          };

          return (
            <div
              key={section}
              className={`bg-gray-900 border transition-colors rounded-xl overflow-hidden shadow-sm ${
                isOpen ? "border-brand-blue/50 ring-1 ring-brand-blue/20" : "border-gray-800 hover:border-gray-750"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left hover:bg-gray-800/40 transition-colors cursor-pointer gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm sm:text-base truncate">{label}</span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase px-1.5 py-0.5 rounded bg-gray-800 shrink-0">
                      {section}
                    </span>
                    {hasUnsaved && !isSaved && (
                      <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0">
                        • изменено
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 line-clamp-1">{HELP_TEXT[section]}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSaved && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Check size={13} /> Сохранено
                    </span>
                  )}
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-6 pb-6 pt-3 border-t border-gray-800/80 space-y-4 bg-gray-950/40">
                  {renderContent()}

                  {/* Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => resetToDefault(section)}
                      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors cursor-pointer"
                      title="Сбросить все поля этой секции к первоначальным текстам"
                    >
                      <RotateCcw size={13} /> Сбросить по умолчанию
                    </button>

                    <div className="flex items-center gap-3">
                      {isSaved && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                          <Check size={14} /> Сохранено в БД
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => save(section, data)}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-md cursor-pointer"
                      >
                        <Save size={15} /> {isSaving ? "Сохранение..." : "Сохранить изменения"}
                      </button>
                    </div>
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
