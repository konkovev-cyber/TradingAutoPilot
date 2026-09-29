import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Save, X, ArrowUp, ArrowDown, ImageOff, ChevronDown } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = any;

interface Bot {
  id?: string;
  slug: string;
  name: string;
  slogan: string;
  shortDesc: string;
  fullDesc?: string;
  badge: string;
  market: string;
  strategy: string;
  risk: string;
  pairs: string;
  color: string;
  image_url: string | null;
  difficulty?: string;
  difficulty_tone?: string;
  features?: Json;
  returns?: Json;
  how_it_works?: Json;
  example_trade?: Json;
  i18n?: Json;
  position?: number;
}

type ReturnRow = { period: string; value: string };
type StepRow = { title: string; desc: string };

const DIFFICULTIES = [
  { label: "Для новичков", tone: "starter" },
  { label: "Для продвинутых", tone: "advanced" },
  { label: "Высокий риск / высокая награда", tone: "aggressive" },
] as const;

const initialBot: Bot = {
  slug: "", name: "", slogan: "", shortDesc: "", fullDesc: "", badge: "",
  market: "", strategy: "", risk: "", pairs: "", color: "#3b82f6", image_url: null,
  difficulty: "", difficulty_tone: ""
};

const EN_FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "slogan", label: "Слоган" },
  { key: "badge", label: "Бейдж" },
  { key: "market", label: "Рынок" },
  { key: "strategy", label: "Стратегия" },
  { key: "risk", label: "Риск" },
  { key: "pairs", label: "Пары" },
  { key: "shortDesc", label: "Краткое описание", multiline: true },
  { key: "fullDesc", label: "Полное описание (алгоритм)", multiline: true },
];

export default function AdminBots() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [editing, setEditing] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [enOpen, setEnOpen] = useState(false);

  const [extra, setExtra] = useState<{
    features: string[];
    returns: ReturnRow[];
    how: StepRow[];
    example: StepRow[];
    en: { features: string[]; how: StepRow[]; example: StepRow[] };
  }>({ features: [], returns: [], how: [], example: [], en: { features: [], how: [], example: [] } });

  const [i18n, setI18n] = useState<Record<string, any>>({});

  const fetchBots = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("bots").select("*").order("position");
    setBots(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchBots(); }, []);

  const openEditor = (bot: Bot) => {
    setEditing(bot);
    setError("");
    setI18n(bot.i18n && typeof bot.i18n === "object" ? { ...bot.i18n } : {});
    const en = bot.i18n?.en ?? {};
    setExtra({
      features: Array.isArray(bot.features) ? bot.features.map(String) : [],
      returns: Array.isArray(bot.returns)
        ? bot.returns.map((r: Json) => ({ period: String(r?.period ?? ""), value: String(r?.value ?? "") }))
        : [],
      how: Array.isArray(bot.how_it_works)
        ? bot.how_it_works.map((s: Json) => ({ title: String(s?.title ?? ""), desc: String(s?.desc ?? "") }))
        : [],
      example: Array.isArray(bot.example_trade)
        ? bot.example_trade.map((s: Json) => ({ title: String(s?.title ?? ""), desc: String(s?.desc ?? "") }))
        : [],
      en: {
        features: Array.isArray(en.features) ? en.features.map(String) : [],
        how: Array.isArray(en.how_it_works ?? en.howItWorks)
          ? (en.how_it_works ?? en.howItWorks).map((s: Json) => ({ title: String(s?.title ?? ""), desc: String(s?.desc ?? "") }))
          : [],
        example: Array.isArray(en.example_trade ?? en.exampleTrade)
          ? (en.example_trade ?? en.exampleTrade).map((s: Json) => ({ title: String(s?.title ?? ""), desc: String(s?.desc ?? "") }))
          : [],
      },
    });
  };

  const uploadImage = async (file: File) => {
    if (!supabase) return;
    setUploading(true);
    try {
      const path = Date.now() + "-" + file.name.replace(/\s+/g, "_");
      const { data, error: uploadError } = await supabase.storage.from("bot-images").upload(path, file);
      if (uploadError) throw uploadError;
      if (data) {
        const pub = supabase.storage.from("bot-images").getPublicUrl(data.path);
        if (editing) setEditing({ ...editing, image_url: pub.data.publicUrl });
      }
    } catch {
      setError("Не удалось загрузить картинку");
    }
    setUploading(false);
  };

  const buildI18n = (enBase: Record<string, any>): Json => {
    const en: Record<string, any> = {};
    EN_FIELDS.forEach(({ key }) => {
      const v = enBase[key];
      if (typeof v === "string" && v.trim() !== "") en[key] = v;
    });
    if (extra.en.features.filter((f) => f.trim() !== "").length > 0) en.features = extra.en.features.filter((f) => f.trim() !== "");
    if (extra.en.how.filter((s) => s.title.trim() !== "" || s.desc.trim() !== "").length > 0) en.howItWorks = extra.en.how.filter((s) => s.title.trim() !== "" || s.desc.trim() !== "");
    if (extra.en.example.filter((s) => s.title.trim() !== "" || s.desc.trim() !== "").length > 0) en.exampleTrade = extra.en.example.filter((s) => s.title.trim() !== "" || s.desc.trim() !== "");
    return Object.keys(en).length > 0 ? { en } : {};
  };

  const saveBot = async (bot: Bot) => {
    if (!supabase) return;
    if (!bot.name.trim() || !bot.slug.trim()) {
      setError("Заполните Name и Slug — без них робот не сохранится");
      return;
    }
    setSaving(true); setError("");
    const payload: Bot = {
      ...bot,
      features: extra.features.filter((f) => f.trim() !== ""),
      returns: extra.returns.filter((r) => r.period.trim() !== "" || r.value.trim() !== ""),
      how_it_works: extra.how.filter((s) => s.title.trim() !== "" || s.desc.trim() !== ""),
      example_trade: extra.example.filter((s) => s.title.trim() !== "" || s.desc.trim() !== ""),
      i18n: buildI18n(i18n),
    };
    try {
      if (bot.id) {
        await supabase.from("bots").update(payload).eq("id", bot.id);
      } else {
        const nextPos = bots.length > 0 ? Math.max(...bots.map((b) => b.position ?? 0)) + 1 : 1;
        await supabase.from("bots").insert({ ...payload, position: nextPos });
      }
      setEditing(null);
      await fetchBots();
    } catch {
      setError("Ошибка сохранения. Проверьте, что Slug уникален");
    }
    setSaving(false);
  };

  const deleteBot = async (id: string) => {
    if (!supabase || !confirm("Удалить этого робота?")) return;
    await supabase.from("bots").delete().eq("id", id);
    setBots(bots.filter((b) => b.id !== id));
  };

  // Смена позиции: меняем местами с соседним роботом и сохраняем оба
  const moveBot = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (!supabase || target < 0 || target >= bots.length) return;
    const a = bots[index];
    const b = bots[target];
    const posA = a.position ?? index + 1;
    const posB = b.position ?? target + 1;
    await supabase.from("bots").update({ position: posB }).eq("id", a.id!);
    await supabase.from("bots").update({ position: posA }).eq("id", b.id!);
    await fetchBots();
  };

  if (loading) return <div className="text-white">Загрузка...</div>;

  const inputCls = "bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg";

  const stepsEditor = (
    label: string,
    rows: StepRow[],
    onChange: (rows: StepRow[]) => void,
    addLabel: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="space-y-2">
        {rows.map((s, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <input
                value={s.title}
                placeholder="Заголовок шага"
                onChange={(e) => onChange(rows.map((v, j) => (j === i ? { ...v, title: e.target.value } : v)))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-1.5 rounded-lg text-sm"
              />
              <input
                value={s.desc}
                placeholder="Описание шага"
                onChange={(e) => onChange(rows.map((v, j) => (j === i ? { ...v, desc: e.target.value } : v)))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-1.5 rounded-lg text-sm"
              />
            </div>
            <button onClick={() => onChange(rows.filter((_, j) => j !== i))}
              className="p-2 text-red-400 hover:text-red-300" aria-label="Удалить">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => onChange([...rows, { title: "", desc: "" }])}
        className="mt-2 flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Роботы</h1>
          <p className="text-gray-400 text-sm mt-1">
            Порядок роботов на сайте задаётся стрелками. Картинка, доходность и шаги показываются в карточках и на детальной странице.
          </p>
        </div>
        <button onClick={() => { setEditing({ ...initialBot }); setEnOpen(false); }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg transition-colors shrink-0">
          <Plus size={18} /> Добавить робота
        </button>
      </div>

      {editing && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{editing.id ? "Редактирование робота" : "Новый робот"}</h2>
            <button onClick={() => setEditing(null)}><X size={20} className="text-gray-400" /></button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Name — название, например CryptoSuperStock" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} />
            <input placeholder="Slug — адрес страницы, например megagrid-ai" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value.replace(/[^a-zA-Z0-9-]/g, "") })} className={inputCls} />
            <input placeholder="Бейдж — плашка, например ХИТ продаж" value={editing.badge} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} className={inputCls} />
            <input placeholder="Рынок, например Крипта" value={editing.market} onChange={(e) => setEditing({ ...editing, market: e.target.value })} className={inputCls} />
            <input placeholder="Стратегия, например Послотная сетка с ИИ" value={editing.strategy} onChange={(e) => setEditing({ ...editing, strategy: e.target.value })} className={inputCls} />
            <input placeholder="Пары, например BTC/USDT, ETH/USDT" value={editing.pairs} onChange={(e) => setEditing({ ...editing, pairs: e.target.value })} className={inputCls} />
          </div>

          <input placeholder="Слоган — короткая фраза под названием" value={editing.slogan} onChange={(e) => setEditing({ ...editing, slogan: e.target.value })} className={`${inputCls} w-full`} />
          <textarea placeholder="Краткое описание — 1-2 предложения" value={editing.shortDesc} onChange={(e) => setEditing({ ...editing, shortDesc: e.target.value })} className={`${inputCls} w-full`} rows={3} />
          <textarea placeholder="Полное описание — подробное объяснение алгоритма" value={editing.fullDesc ?? ""} onChange={(e) => setEditing({ ...editing, fullDesc: e.target.value })} className={`${inputCls} w-full`} rows={5} />
          <input placeholder="Риск — описание уровня риска" value={editing.risk} onChange={(e) => setEditing({ ...editing, risk: e.target.value })} className={`${inputCls} w-full`} />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Уровень сложности (бейдж на карточке)</label>
              <select
                value={editing.difficulty ?? ""}
                onChange={(e) => {
                  const d = DIFFICULTIES.find((x) => x.label === e.target.value);
                  setEditing({ ...editing, difficulty: e.target.value, difficulty_tone: d?.tone ?? "" });
                }}
                className={`${inputCls} w-full appearance-none cursor-pointer`}
                aria-label="Уровень сложности"
              >
                <option value="">Не указан</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d.tone} value={d.label}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Цвет робота (точки, иконки, чипы)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(editing.color) ? editing.color : "#3b82f6"}
                  onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                  className="h-10 w-14 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer"
                  aria-label="Цвет робота"
                />
                <input
                  value={editing.color}
                  onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                  placeholder="#3b82f6"
                  className={inputCls + " flex-1"}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Преимущества</label>
              <div className="space-y-2">
                {extra.features.map((f, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={f}
                      onChange={(e) => setExtra({ ...extra, features: extra.features.map((v, j) => (j === i ? e.target.value : v)) })}
                      className="flex-1 bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                    />
                    <button onClick={() => setExtra({ ...extra, features: extra.features.filter((_, j) => j !== i) })}
                      className="p-2 text-red-400 hover:text-red-300" aria-label="Удалить">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => setExtra({ ...extra, features: [...extra.features, ""] })}
                className="mt-2 flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                <Plus size={14} /> Добавить
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Доходность</label>
              <div className="space-y-2">
                {extra.returns.map((r, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={r.period}
                      placeholder="30 дней"
                      onChange={(e) => setExtra({ ...extra, returns: extra.returns.map((v, j) => (j === i ? { ...v, period: e.target.value } : v)) })}
                      className="w-24 bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                    />
                    <input
                      value={r.value}
                      placeholder="+6.8%"
                      onChange={(e) => setExtra({ ...extra, returns: extra.returns.map((v, j) => (j === i ? { ...v, value: e.target.value } : v)) })}
                      className="flex-1 bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                    />
                    <button onClick={() => setExtra({ ...extra, returns: extra.returns.filter((_, j) => j !== i) })}
                      className="p-2 text-red-400 hover:text-red-300" aria-label="Удалить">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => setExtra({ ...extra, returns: [...extra.returns, { period: "", value: "" }] })}
                className="mt-2 flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                <Plus size={14} /> Добавить
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {stepsEditor("Как работает (шаги)", extra.how, (rows) => setExtra({ ...extra, how: rows }), "Добавить шаг")}
            {stepsEditor("Пример сделки (концептуальные шаги)", extra.example, (rows) => setExtra({ ...extra, example: rows }), "Добавить шаг")}
          </div>

          <div className="border border-gray-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setEnOpen(!enOpen)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
            >
              <span className="font-semibold text-white text-sm">Английская версия (EN)</span>
              <ChevronDown size={18} className={`text-gray-400 transition-transform ${enOpen ? "rotate-180" : ""}`} />
            </button>
            {enOpen && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-700 space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  {EN_FIELDS.map((f) => (
                    <div key={f.key} className={f.multiline ? "md:col-span-2" : ""}>
                      <label className="block text-xs font-medium text-gray-400 mb-1">{f.label}</label>
                      {f.multiline ? (
                        <textarea
                          rows={3}
                          value={String(i18n[f.key] ?? "")}
                          onChange={(e) => setI18n({ ...i18n, [f.key]: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                        />
                      ) : (
                        <input
                          value={String(i18n[f.key] ?? "")}
                          onChange={(e) => setI18n({ ...i18n, [f.key]: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Преимущества (EN)</label>
                  <div className="space-y-2">
                    {extra.en.features.map((f, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          value={f}
                          onChange={(e) => setExtra({ ...extra, en: { ...extra.en, features: extra.en.features.map((v, j) => (j === i ? e.target.value : v)) } })}
                          className="flex-1 bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                        />
                        <button onClick={() => setExtra({ ...extra, en: { ...extra.en, features: extra.en.features.filter((_, j) => j !== i) } })}
                          className="p-2 text-red-400 hover:text-red-300" aria-label="Удалить">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setExtra({ ...extra, en: { ...extra.en, features: [...extra.en.features, ""] } })}
                    className="mt-2 flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                    <Plus size={14} /> Добавить
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {stepsEditor("Как работает (EN)", extra.en.how, (rows) => setExtra({ ...extra, en: { ...extra.en, how: rows } }), "Добавить шаг")}
                  {stepsEditor("Пример сделки (EN)", extra.en.example, (rows) => setExtra({ ...extra, en: { ...extra.en, example: rows } }), "Добавить шаг")}
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Картинка робота (JPEG/PNG, кнопка сама зальёт в Storage)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                }}
                className="block w-full text-sm text-gray-400 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white file:cursor-pointer"
              />
              {uploading && <span className="text-xs text-gray-400">Загрузка...</span>}
            </div>
            <div className="flex items-center gap-3">
              {editing.image_url ? (
                <img src={editing.image_url} alt={editing.name} className="h-20 w-auto rounded-lg border border-gray-700" />
              ) : (
                <div className="h-20 w-32 rounded-lg border border-dashed border-gray-700 flex items-center justify-center text-gray-600">
                  <ImageOff size={20} />
                </div>
              )}
              {editing.image_url && (
                <button onClick={() => setEditing({ ...editing, image_url: null })}
                  className="text-xs text-red-400 hover:text-red-300">Убрать картинку</button>
              )}
            </div>
          </div>

          {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</div>}

          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-gray-400 hover:text-white">Отмена</button>
            <button onClick={() => saveBot(editing)} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg">
              <Save size={18} /> {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {bots.length === 0 && (
          <div className="text-gray-500 text-center py-8 bg-gray-900 border border-gray-800 rounded-xl">
            Роботов пока нет. Нажмите Добавить робота — он сразу появится на сайте.
          </div>
        )}
        {bots.map((bot, i) => (
          <div key={bot.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <button onClick={() => moveBot(i, -1)} disabled={i === 0}
                className="p-1 text-gray-500 hover:text-white disabled:opacity-20" aria-label="Выше">
                <ArrowUp size={16} />
              </button>
              <button onClick={() => moveBot(i, 1)} disabled={i === bots.length - 1}
                className="p-1 text-gray-500 hover:text-white disabled:opacity-20" aria-label="Ниже">
                <ArrowDown size={16} />
              </button>
            </div>
            {bot.image_url ? (
              <img src={bot.image_url} alt={bot.name} className="w-16 h-12 rounded-lg object-cover border border-gray-800" />
            ) : (
              <div className="w-16 h-12 rounded-lg flex items-center justify-center border border-gray-800" style={{ backgroundColor: bot.color + "22" }}>
                <span className="font-bold text-sm" style={{ color: bot.color }}>{bot.name.charAt(0)}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold truncate">{bot.name}</div>
              <div className="text-gray-400 text-sm truncate">{bot.slogan}</div>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">{bot.market}</span>
                <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">{bot.strategy}</span>
              </div>
            </div>
            <Link to={`/bots/${bot.slug}`} className="text-xs text-gray-500 hover:text-brand-blue shrink-0 hidden md:block">
              /bots/{bot.slug}
            </Link>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEditor(bot)} className="p-2 text-gray-400 hover:text-white" aria-label="Редактировать"><Edit2 size={18} /></button>
              <button onClick={() => deleteBot(bot.id!)} className="p-2 text-red-400 hover:text-red-300" aria-label="Удалить"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
