import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Copy,
  Check,
  Download,
  Search,
  Trash2,
  ChevronDown,
  Phone,
  Mail,
  Send,
  Eye,
  X,
  Edit3,
  RefreshCw,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Save,
} from "lucide-react";

export interface Lead {
  id: string;
  name: string;
  contact: string;
  bot: string;
  budget?: string | null;
  message: string | null;
  status: string;
  notes?: string | null;
  created_at: string;
}

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  new: {
    label: "Новая",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    dot: "bg-blue-400",
  },
  contacted: {
    label: "В работе",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
  },
  meeting: {
    label: "Демо / Консультация",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    dot: "bg-purple-400",
  },
  converted: {
    label: "Сделка закрыта",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Отказ / Спам",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    dot: "bg-rose-400",
  },
  // Backward compat for old statuses
  read: {
    label: "В работе",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
  },
  replied: {
    label: "Демо / Консультация",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    dot: "bg-purple-400",
  },
};

const FILTERS = [
  { id: "all", label: "Все заявки" },
  { id: "new", label: "Новые" },
  { id: "contacted", label: "В работе" },
  { id: "meeting", label: "Демо / Консультация" },
  { id: "converted", label: "Оплачено" },
  { id: "rejected", label: "Отказ" },
] as const;

const DATE_FILTERS = [
  { id: "all", label: "За всё время", days: 0 },
  { id: "1d", label: "24 часа", days: 1 },
  { id: "7d", label: "7 дней", days: 7 },
  { id: "30d", label: "30 дней", days: 30 },
] as const;

const PAGE_SIZE = 25;

// Helper to determine contact type and URLs
function parseContact(raw: string) {
  const contact = (raw || "").trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const isTelegram =
    contact.startsWith("@") ||
    contact.toLowerCase().includes("t.me/") ||
    (!contact.includes("@") && !/\d{6,}/.test(contact) && /^[a-zA-Z0-9_]{4,}$/.test(contact));

  const digitsOnly = contact.replace(/[^\d]/g, "");
  const isPhone = digitsOnly.length >= 10 && !isEmail;

  let tgUrl: string | null = null;
  if (isTelegram) {
    const handle = contact.replace(/^@|https?:\/\/t\.me\//gi, "").trim();
    tgUrl = `https://t.me/${handle}`;
  } else if (isPhone) {
    // Russian or international phone can also be searched on TG
    tgUrl = `https://t.me/+${digitsOnly.startsWith("8") ? "7" + digitsOnly.slice(1) : digitsOnly}`;
  }

  let waUrl: string | null = null;
  if (isPhone) {
    const intlPhone = digitsOnly.startsWith("8") ? "7" + digitsOnly.slice(1) : digitsOnly;
    waUrl = `https://wa.me/${intlPhone}`;
  }

  let telUrl: string | null = null;
  if (isPhone) {
    telUrl = `tel:+${digitsOnly.startsWith("8") ? "7" + digitsOnly.slice(1) : digitsOnly}`;
  }

  let mailUrl: string | null = null;
  if (isEmail) {
    mailUrl = `mailto:${contact}`;
  }

  return {
    raw: contact,
    isEmail,
    isPhone,
    isTelegram,
    tgUrl,
    waUrl,
    telUrl,
    mailUrl,
  };
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active lead for detail modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);

  const fetchLeads = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      setLeads(data ?? []);
    } catch {
      // ignore
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [filter, dateFilter, query]);

  const updateStatus = async (id: string, status: string) => {
    if (!supabase) return;
    try {
      await supabase.from("leads").update({ status }).eq("id", id);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead((prev) => (prev ? { ...prev, status } : null));
      }
    } catch {
      // ignore
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead || !supabase) return;
    setSavingNotes(true);
    try {
      await supabase.from("leads").update({ notes: editingNotes }).eq("id", selectedLead.id);
      setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? { ...l, notes: editingNotes } : l)));
      setSelectedLead((prev) => (prev ? { ...prev, notes: editingNotes } : null));
      setNotesSavedNotice(true);
      setTimeout(() => setNotesSavedNotice(false), 2000);
    } catch {
      // ignore
    }
    setSavingNotes(false);
  };

  const deleteLead = async (id: string) => {
    if (!supabase || !confirm("Удалить эту заявку? Действие необратимо.")) return;
    try {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (!error) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(null);
        }
      }
    } catch {
      // ignore
    }
  };

  const copyContact = async (contact: string, leadId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(contact);
      setCopiedId(leadId);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // ignore
    }
  };

  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setEditingNotes(lead.notes || "");
    setNotesSavedNotice(false);
  };

  const exportCSV = () => {
    const headers = ["ID", "Имя", "Контакт", "Робот", "Бюджет", "Сообщение", "Заметки менеджера", "Статус", "Дата создания"];
    const rows = filtered.map((l) => [
      l.id,
      l.name || "",
      l.contact || "",
      l.bot || "",
      l.budget || "",
      l.message || "",
      l.notes || "",
      STATUS_CONFIG[l.status]?.label || l.status,
      new Date(l.created_at).toLocaleString("ru-RU"),
    ]);
    const csvContent = [headers, ...rows]
      .map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(";"))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zayavki_coinsoft_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "new").length;
    const inProgress = leads.filter((l) => ["contacted", "meeting", "read", "replied"].includes(l.status)).length;
    const converted = leads.filter((l) => l.status === "converted").length;
    const convRate = total > 0 ? Math.round((converted / total) * 100) : 0;
    return { total, newCount, inProgress, converted, convRate };
  }, [leads]);

  // Filtering
  const filtered = useMemo(() => {
    const days = DATE_FILTERS.find((d) => d.id === dateFilter)?.days ?? 0;
    const since = days > 0 ? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString() : "";
    const q = query.trim().toLowerCase();

    return leads.filter((l) => {
      // Status filter
      if (filter !== "all") {
        if (filter === "contacted") {
          if (!["contacted", "read"].includes(l.status)) return false;
        } else if (filter === "meeting") {
          if (!["meeting", "replied"].includes(l.status)) return false;
        } else if (l.status !== filter) {
          return false;
        }
      }
      // Date filter
      if (since && l.created_at < since) return false;
      // Search query
      if (q) {
        const match = [
          l.name,
          l.contact,
          l.bot,
          l.message ?? "",
          l.notes ?? "",
        ].some((v) => (v || "").toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [leads, filter, dateFilter, query]);

  const inputCls =
    "bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 rounded-lg text-sm px-4 py-2.5 outline-none focus:border-brand-blue transition-colors";

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">Заявки клиентов</h1>
            {stats.newCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {stats.newCount} новых
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Управляйте лидами, оставляйте внутренние заметки менеджера и связывайтесь с клиентами в 1 клик.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchLeads();
            }}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors cursor-pointer"
            title="Обновить список заявок"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin text-brand-blue" : ""} />
            <span>Обновить</span>
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shrink-0 cursor-pointer shadow-lg shadow-blue-500/10"
          >
            <Download size={16} /> Экспорт в CSV
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase font-medium">Всего заявок</span>
            <MessageSquare size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1">По всем роботам</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs uppercase font-medium">Новые (требуют ответа)</span>
            <AlertCircle size={16} />
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.newCount}</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.newCount > 0 ? "Ожидают первого контакта" : "Все заявки обработаны"}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs uppercase font-medium">В работе / Демо</span>
            <Clock size={16} />
          </div>
          <div className="text-2xl font-bold text-amber-400">{stats.inProgress}</div>
          <div className="text-xs text-gray-500 mt-1">В процессе общения</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs uppercase font-medium">Закрытые сделки</span>
            <CheckCircle2 size={16} />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {stats.converted} <span className="text-xs font-normal text-gray-400">({stats.convRate}%)</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Конверсия в оплату</div>
        </div>
      </div>

      {/* Search & Date Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск: имя, телефон, Telegram, бот, текст или заметка..."
            className={`${inputCls} w-full pl-10`}
            aria-label="Поиск по заявкам"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
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
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ id, label }) => {
          let count = 0;
          if (id === "all") count = leads.length;
          else if (id === "contacted") count = leads.filter((l) => ["contacted", "read"].includes(l.status)).length;
          else if (id === "meeting") count = leads.filter((l) => ["meeting", "replied"].includes(l.status)).length;
          else count = leads.filter((l) => l.status === id).length;

          return (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                filter === id ? "bg-brand-blue text-white shadow-md shadow-blue-500/20" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              <span>{label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter === id ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="text-white py-12 text-center bg-gray-900 rounded-xl border border-gray-800">
          <RefreshCw size={24} className="animate-spin text-brand-blue mx-auto mb-2" />
          Загрузка заявок...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
          <HelpCircle size={36} className="mx-auto mb-3 opacity-30 text-gray-400" />
          <div className="text-base font-medium text-gray-400">Заявок не найдено</div>
          <div className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {query ? "Попробуйте изменить поисковый запрос или сбросить фильтры." : "Заявки с формы на сайте появятся здесь."}
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left">
              <thead className="bg-gray-800/60 border-b border-gray-800">
                <tr>
                  <th className="px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Клиент</th>
                  <th className="px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Контакты</th>
                  <th className="px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Робот / Сообщение</th>
                  <th className="px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Заметки менеджера</th>
                  <th className="px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Статус</th>
                  <th className="px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">Дата</th>
                  <th className="px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wider text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/70">
                {filtered.slice(0, visible).map((lead) => {
                  const contactInfo = parseContact(lead.contact);
                  const statusConf = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => openLeadDetails(lead)}
                      className="hover:bg-gray-800/40 transition-colors cursor-pointer group"
                    >
                      {/* Name */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                            {(lead.name || "K").charAt(0)}
                          </div>
                          <div>
                            <div className="text-white font-semibold text-sm group-hover:text-brand-blue transition-colors">
                              {lead.name || "Без имени"}
                            </div>
                            <div className="text-[11px] text-gray-500 font-mono">#{String(lead.id).slice(-6)}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact & Quick Communication */}
                      <td className="px-5 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-300 text-sm font-mono font-medium">{contactInfo.raw}</span>
                            <button
                              onClick={(e) => copyContact(contactInfo.raw, lead.id, e)}
                              className="p-1 text-gray-500 hover:text-white rounded hover:bg-gray-800 transition-colors cursor-pointer"
                              title="Скопировать контакт"
                            >
                              {copiedId === lead.id ? (
                                <Check size={13} className="text-emerald-400" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          </div>

                          {/* Quick action buttons */}
                          <div className="flex items-center gap-1.5">
                            {contactInfo.tgUrl && (
                              <a
                                href={contactInfo.tgUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/20 transition-colors"
                                title="Открыть диалог в Telegram"
                              >
                                <Send size={11} /> TG
                              </a>
                            )}
                            {contactInfo.waUrl && (
                              <a
                                href={contactInfo.waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                                title="Написать в WhatsApp"
                              >
                                <MessageSquare size={11} /> WA
                              </a>
                            )}
                            {contactInfo.telUrl && (
                              <a
                                href={contactInfo.telUrl}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
                                title="Позвонить"
                              >
                                <Phone size={11} /> Звонок
                              </a>
                            )}
                            {contactInfo.mailUrl && (
                              <a
                                href={contactInfo.mailUrl}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
                                title="Написать email"
                              >
                                <Mail size={11} /> Email
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Bot & Message */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700/60">
                            🤖 {lead.bot || "Любой робот"}
                          </span>
                          {lead.budget && (
                            <span className="inline-block ml-1.5 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400">
                              💰 {lead.budget}
                            </span>
                          )}
                          {lead.message ? (
                            <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{lead.message}</p>
                          ) : (
                            <span className="text-gray-600 text-xs italic">Без сообщения</span>
                          )}
                        </div>
                      </td>

                      {/* Notes Preview */}
                      <td className="px-5 py-4 max-w-xs">
                        {lead.notes ? (
                          <div className="p-2 rounded-lg bg-gray-800/80 border border-gray-700/60 text-xs text-gray-300 line-clamp-2">
                            <span className="text-amber-400 font-medium">Заметка: </span>
                            {lead.notes}
                          </div>
                        ) : (
                          <span className="text-gray-600 text-xs flex items-center gap-1 group-hover:text-gray-400 transition-colors">
                            <Edit3 size={12} /> Добавить заметку...
                          </span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-5 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <select
                            value={lead.status}
                            onChange={(e) => updateStatus(lead.id, e.target.value)}
                            className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 appearance-none cursor-pointer pr-7 border transition-colors ${statusConf.bg} ${statusConf.color} ${statusConf.border}`}
                            aria-label="Статус заявки"
                          >
                            {Object.entries(STATUS_CONFIG).slice(0, 5).map(([value, conf]) => (
                              <option key={value} value={value} className="bg-gray-900 text-white font-normal">
                                {conf.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={12}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${statusConf.color}`}
                          />
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-gray-400 text-xs">
                        <div>{new Date(lead.created_at).toLocaleDateString("ru-RU")}</div>
                        <div className="text-[11px] text-gray-600">
                          {new Date(lead.created_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openLeadDetails(lead)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                            title="Открыть подробную карточку"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Удалить заявку"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Load More */}
      {!loading && filtered.length > visible && (
        <button
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="w-full py-3 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white rounded-xl text-sm transition-colors cursor-pointer"
        >
          Показать ещё ({filtered.length - visible})
        </button>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* LEAD DETAILS & CRM MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-blue to-indigo-600 flex items-center justify-center text-white font-bold text-lg uppercase">
                  {(selectedLead.name || "K").charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedLead.name || "Заявка без имени"}</h3>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Получена {new Date(selectedLead.created_at).toLocaleString("ru-RU")}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Status Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Статус заявки
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.entries(STATUS_CONFIG).slice(0, 5).map(([key, conf]) => {
                  const isActive = selectedLead.status === key;
                  return (
                    <button
                      key={key}
                      onClick={() => updateStatus(selectedLead.id, key)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                        isActive
                          ? `${conf.bg} ${conf.color} ${conf.border} shadow-lg ring-1 ring-blue-500/30`
                          : "bg-gray-800/60 border-gray-700/60 text-gray-400 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      {conf.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Actions Grid */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Контакты для связи
              </label>
              <div className="p-4 bg-gray-950/70 border border-gray-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono font-bold text-white tracking-wide">
                    {selectedLead.contact}
                  </span>
                  <button
                    onClick={() => copyContact(selectedLead.contact, selectedLead.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    {copiedId === selectedLead.id ? (
                      <>
                        <Check size={14} className="text-emerald-400" /> Скопировано
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Скопировать
                      </>
                    )}
                  </button>
                </div>

                {/* Direct quick action links */}
                {(() => {
                  const info = parseContact(selectedLead.contact);
                  return (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800/60">
                      {info.tgUrl && (
                        <a
                          href={info.tgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Send size={14} /> Написать в Telegram <ExternalLink size={12} />
                        </a>
                      )}
                      {info.waUrl && (
                        <a
                          href={info.waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <MessageSquare size={14} /> Написать в WhatsApp <ExternalLink size={12} />
                        </a>
                      )}
                      {info.telUrl && (
                        <a
                          href={info.telUrl}
                          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-400 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Phone size={14} /> Позвонить
                        </a>
                      )}
                      {info.mailUrl && (
                        <a
                          href={info.mailUrl}
                          className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Mail size={14} /> Отправить Email
                        </a>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Interest & Message */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Интересующий робот
                </label>
                <div className="p-3 bg-gray-950/70 border border-gray-800 rounded-xl text-sm font-semibold text-white">
                  🤖 {selectedLead.bot || "Любой робот"}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Бюджет
                </label>
                <div className="p-3 bg-gray-950/70 border border-gray-800 rounded-xl text-sm text-gray-300">
                  {selectedLead.budget || "Не указан"}
                </div>
              </div>
            </div>

            {/* Message from client */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Сообщение / вопрос посетителя
              </label>
              <div className="p-4 bg-gray-950/70 border border-gray-800 rounded-xl text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                {selectedLead.message || <span className="text-gray-600 italic">Клиент не оставил сообщение</span>}
              </div>
            </div>

            {/* CRM Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Заметки менеджера (CRM)
                </label>
                {notesSavedNotice && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Check size={14} /> Заметка сохранена!
                  </span>
                )}
              </div>
              <textarea
                rows={4}
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Напишите комментарий по клиенту: о чем договорились, дату созвона, депозит, используемую биржу..."
                className="w-full p-3.5 bg-gray-950/90 border border-gray-700/80 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <div className="flex justify-between items-center pt-1">
                <span className="text-[11px] text-gray-500">
                  Заметка видна только администраторам и сохраняется в базу данных.
                </span>
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save size={14} /> {savingNotes ? "Сохранение..." : "Сохранить заметку"}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <button
                onClick={() => deleteLead(selectedLead.id)}
                className="flex items-center gap-1.5 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 size={14} /> Удалить заявку
              </button>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
