import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Copy, Check, Download, Search, Trash2, ChevronDown } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  contact: string;
  bot: string;
  message: string | null;
  status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  read: "Прочитана",
  replied: "Отвечена",
  converted: "Куплено",
};

const FILTERS = [
  { id: "all", label: "Все" },
  { id: "new", label: "Новые" },
  { id: "read", label: "Прочитанные" },
  { id: "replied", label: "Отвеченные" },
  { id: "converted", label: "Куплено" },
] as const;

const DATE_FILTERS = [
  { id: "all", label: "За всё время", days: 0 },
  { id: "7d", label: "7 дней", days: 7 },
  { id: "30d", label: "30 дней", days: 30 },
] as const;

const PAGE_SIZE = 20;

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [dateFilter, setDateFilter] = useState<(typeof DATE_FILTERS)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLeads = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [filter, dateFilter, query]);

  const updateStatus = async (id: string, status: string) => {
    if (!supabase) return;
    await supabase.from("leads").update({ status }).eq("id", id);
    fetchLeads();
  };

  const deleteLead = async (id: string) => {
    if (!supabase || !confirm("Удалить эту заявку? Действие необратимо.")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const copyContact = async (lead: Lead) => {
    try {
      await navigator.clipboard.writeText(lead.contact);
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* clipboard недоступен */
    }
  };

  const exportCSV = () => {
    const headers = ["Имя", "Контакт", "Робот", "Сообщение", "Статус", "Дата"];
    const rows = filtered.map((l) => [l.name, l.contact, l.bot, l.message ?? "", STATUS_LABELS[l.status] ?? l.status, l.created_at]);
    const csv = [headers, ...rows].map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zayavki.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    const days = DATE_FILTERS.find((d) => d.id === dateFilter)?.days ?? 0;
    const since = days > 0 ? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString() : "";
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (since && l.created_at < since) return false;
      if (q && ![l.name, l.contact, l.message ?? ""].some((v) => v.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [leads, filter, dateFilter, query]);

  const inputCls = "bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 rounded-lg text-sm px-4 py-2.5 outline-none focus:border-brand-blue transition-colors";

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Заявки</h1>
        <p className="text-gray-400 text-sm mt-1">
          Обращения, оставленные посетителями через форму Оставить заявку. Меняйте статус, ищите по имени или контакту, экспортируйте в CSV.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск: имя, контакт, сообщение..."
            className={`${inputCls} w-full pl-10`}
            aria-label="Поиск по заявкам"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {DATE_FILTERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setDateFilter(id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                dateFilter === id ? "bg-brand-blue text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-lg transition-colors shrink-0 cursor-pointer"
        >
          <Download size={18} /> Экспорт в CSV
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filter === id ? "bg-brand-blue text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {label}
            {id !== "all" && " (" + leads.filter((l) => l.status === id).length + ")"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-white">Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
          Заявок не найдено. Попробуйте другой фильтр или измените поисковый запрос.
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="bg-gray-800/50">
              <tr>
                {["Имя", "Контакт", "Робот", "Сообщение", "Статус", "Дата", "Действия"].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-gray-400 text-sm font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.slice(0, visible).map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-4 text-white font-medium whitespace-nowrap">{lead.name}</td>
                  <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                    <button
                      onClick={() => copyContact(lead)}
                      className="group inline-flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"
                      title="Скопировать контакт"
                    >
                      {lead.contact}
                      {copiedId === lead.id ? <Check size={13} className="text-green-400" /> : <Copy size={13} className="opacity-0 group-hover:opacity-60 transition-opacity" />}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-gray-400 whitespace-nowrap">{lead.bot}</td>
                  <td className="px-5 py-4 text-gray-400 max-w-md whitespace-normal break-words">{lead.message ?? ""}</td>
                  <td className="px-5 py-4">
                    <div className="relative">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-2 py-1 appearance-none cursor-pointer pr-7"
                        aria-label="Статус заявки"
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={"https://t.me/" + lead.contact.replace("@", "")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-blue hover:text-blue-400 text-sm whitespace-nowrap"
                      >
                        Написать в TG
                      </a>
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                        aria-label="Удалить заявку"
                        title="Удалить заявку"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filtered.length > visible && (
        <button
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="w-full py-3 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white rounded-xl text-sm transition-colors cursor-pointer"
        >
          Показать ещё ({filtered.length - visible})
        </button>
      )}
    </div>
  );
}