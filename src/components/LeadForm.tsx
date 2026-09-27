import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getSupabase } from "@/lib/supabase";

export default function LeadForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", contact: "", bot: "any", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const sb = getSupabase();
    if (sb) {
      try {
        const { error } = await sb.from("leads").insert([{ 
          name: form.name, 
          contact: form.contact, 
          bot: form.bot, 
          message: form.message,
          created_at: new Date().toISOString()
        }]);
        if (error) throw error;
        // Fire-and-forget Telegram notification via edge function
        try {
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-lead`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ name: form.name, contact: form.contact, bot: form.bot, message: form.message }),
          });
        } catch {
          /* notification is optional */
        }
        setStatus("success");
      } catch {
        setStatus("error");
      }
    } else {
      // Fallback to Telegram if Supabase not configured
      window.open(`https://t.me/coinsofter?text=${encodeURIComponent(`Заявка:\nИмя: ${form.name}\nКонтакт: ${form.contact}\nБот: ${form.bot}\nСообщение: ${form.message}`)}`, "_blank");
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center p-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("lead.success")}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{t("lead.privacy")}</p>
        <button onClick={() => setStatus("idle")} className="text-brand-blue font-semibold hover:underline">Отправить ещё одну заявку</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12 items-start">
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{t("lead.title")}</h3>
        <p className="text-lg text-gray-500 dark:text-gray-400">{t("lead.subtitle")}</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("lead.name")}</label>
            <input 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none transition-all"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Иван Иванов"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("lead.contact")}</label>
            <input 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none transition-all"
              value={form.contact} onChange={e => setForm({...form, contact: e.target.value})}
              placeholder="@username / email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("lead.bot")}</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none transition-all"
              value={form.bot} onChange={e => setForm({...form, bot: e.target.value})}
            >
              <option value="any">{t("lead.botAny")}</option>
              <option value="cryptosuperstock">CryptoSuperStock</option>
              <option value="megagrid-ai">MEGAGRID-AI</option>
              <option value="smartix">SMARTIX</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("lead.message")}</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none transition-all"
              value={form.message} onChange={e => setForm({...form, message: e.target.value})}
              placeholder="Ваши вопросы..."
            />
          </div>
          <button 
            disabled={status === "sending"}
            className="w-full py-4 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === "sending" ? "Отправка..." : t("lead.submit")}
            <Send size={18} />
          </button>
          {status === "error" && <p className="text-red-500 text-xs text-center">{t("lead.error")}</p>}
          <p className="text-[10px] text-center text-gray-400 dark:text-gray-500">{t("lead.privacy")}</p>
        </div>
      </div>
      
      <div className="hidden lg:block bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-8 border border-blue-100 dark:border-blue-900 relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Почему стоит написать нам?</h4>
          <ul className="space-y-6">
            {[
              { t: "Подбор стратегии", d: "Поможем выбрать робота исходя из вашего риск-профиля и депозита" },
              { t: "Помощь в настройке", d: "Проконсультируем по подключению API и первичной конфигурации" },
              { t: "Эксклюзивы", d: "Расскажем о новых бета-тестах и закрытых стратегиях" }
            ].map((item, i) => (
              <li key={i} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center shrink-0 text-xs font-bold">{i+1}</div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{item.t}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{item.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl" />
      </div>
    </form>
  );
}
