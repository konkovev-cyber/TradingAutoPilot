import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Download } from "lucide-react";

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

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [loading, setLoading] = useState(true);

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

  const updateStatus = async (id: string, status: string) => {
    if (!supabase) return;
    await supabase.from("leads").update({ status }).eq("id", id);
    fetchLeads();
  };

  const exportCSV = () => {
    const headers = ["Имя", "Контакт", "Робот", "Сообщение", "Статус", "Дата"];
    const rows = leads.map((l) => [l.name, l.contact, l.bot, l.message ?? "", STATUS_LABELS[l.status] ?? l.status, l.created_at]);
    const csv = [headers, ...rows].map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zayavki.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Заявки</h1>
        <p className="text-gray-400 text-sm mt-1">
          Обращения, оставленные посетителями через форму Оставить заявку. Меняйте статус, чтобы не потерять ход работы.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === id ? "bg-brand-blue text-white" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {label}
              {id !== "all" && " (" + leads.filter((l) => l.status === id).length + ")"}
            </button>
          ))}
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg transition-colors shrink-0"
        >
          <Download size={18} /> Экспорт в CSV
        </button>
      </div>

      {loading ? (
        <div className="text-white">Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
          Заявок не найдено. Попробуйте другой фильтр.
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                {["Имя", "Контакт", "Робот", "Сообщение", "Статус", "Дата", "Ответ"].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-gray-400 text-sm font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-4 text-white font-medium break-words">{lead.name}</td>
                  <td className="px-5 py-4 text-gray-400 break-all">{lead.contact}</td>
                  <td className="px-5 py-4 text-gray-400 whitespace-nowrap">{lead.bot}</td>
                  <td className="px-5 py-4 text-gray-400 max-w-md whitespace-normal break-words">{lead.message ?? ""}</td>
                  <td className="px-5 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-2 py-1"
                      aria-label="Статус заявки"
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={"https://t.me/" + lead.contact.replace("@", "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:text-blue-400 text-sm whitespace-nowrap"
                    >
                      Написать в TG
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
