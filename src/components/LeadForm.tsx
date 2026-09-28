import React, { useState } from "react";
import { Send, CheckCircle2, User, AtSign, Bot as BotIcon, MessageSquareText, Sparkles, ShieldCheck, Settings2, Rocket } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getSupabase, supabaseUrl } from "@/lib/supabase";

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
        try {
          if (supabaseUrl) {
            const { data: { session } } = await sb.auth.getSession();
            await fetch(`${supabaseUrl}/functions/v1/notify-lead`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.access_token ?? ""}`,
              },
              body: JSON.stringify({ name: form.name, contact: form.contact, bot: form.bot, message: form.message }),
            });
          }
        } catch {
          /* уведомление опционально */
        }
        setStatus("success");
      } catch {
        setStatus("error");
      }
    } else {
      const text = `Заявка:\nИмя: ${form.name}\nКонтакт: ${form.contact}\nБот: ${form.bot}\nСообщение: ${form.message}`;
      window.open(`https://t.me/share/url?url=${encodeURIComponent("https://t.me/coinsofter")}&text=${encodeURIComponent(text)}`, "_blank");
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <section id="lead" className="bg-soft section-padding relative overflow-hidden">
        <div className="blob w-[400px] h-[400px] bg-blue-400/15 -top-20 right-0 dark:hidden" aria-hidden="true" />
        <div className="max-w-3xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center p-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)]">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("lead.success")}</h3>
            <p className="text-gray-500 mb-8">{t("lead.privacy")}</p>
            <button onClick={() => setStatus("idle")} className="text-brand-blue font-semibold hover:underline">Отправить ещё одну заявку</button>
          </div>
        </div>
      </section>
    );
  }

  const labelCls = "block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5";

  return (
    <section id="lead" className="bg-soft section-padding relative overflow-hidden">
      <div className="blob animate-float-slow w-[420px] h-[420px] bg-indigo-400/15 top-10 -left-40 dark:hidden" aria-hidden="true" />
      <div className="blob w-[320px] h-[320px] bg-blue-400/15 bottom-0 -right-24 dark:hidden" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8 items-stretch">
          {/* Форма  стеклянная карточка */}
          <div className="lg:col-span-3 glass rounded-3xl border border-gray-100/80 dark:border-gray-800 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)" }}>
                <Sparkles size={20} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{t("lead.title")}</h3>
            </div>
            <p className="text-lg text-gray-500 mb-8">{t("lead.subtitle")}</p>

            <div className="space-y-5">
              <div>
                <label className={labelCls}>{t("lead.name")}</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    required
                    className="input-premium !pl-11"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Иван Иванов"
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>{t("lead.contact")}</label>
                <div className="relative">
                  <AtSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    required
                    className="input-premium !pl-11"
                    value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    placeholder="@username / email / телефон"
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>{t("lead.bot")}</label>
                <div className="relative">
                  <BotIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                  <select
                    className="input-premium !pl-11 appearance-none cursor-pointer"
                    value={form.bot} onChange={(e) => setForm({ ...form, bot: e.target.value })}
                  >
                    <option value="any">{t("lead.botAny")}</option>
                    <option value="cryptosuperstock">CryptoSuperStock</option>
                    <option value="megagrid-ai">MEGAGRID-AI</option>
                    <option value="smartix">SMARTIX: PUMP DUMP</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>{t("lead.message")}</label>
                <div className="relative">
                  <MessageSquareText size={18} className="absolute left-4 top-4 text-gray-400 pointer-events-none" />
                  <textarea
                    rows={4}
                    className="input-premium !pl-11 resize-none"
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Ваши вопросы..."
                  />
                </div>
              </div>
              <button
                disabled={status === "sending"}
                className="btn-gradient w-full py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:transform-none"
              >
                {status === "sending" ? "Отправка..." : t("lead.submit")}
                <Send size={18} />
              </button>
              {status === "error" && <p className="text-red-500 text-xs text-center">{t("lead.error")}</p>}
              <p className="text-[11px] text-center text-gray-400">{t("lead.privacy")}</p>
            </div>
          </div>

          {/* Правая панель  градиентная */}
          <div className="lg:col-span-2 relative rounded-3xl p-8 lg:p-10 overflow-hidden text-white" style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #3b82f6 60%, #6366f1 100%)" }}>
            <div className="blob w-64 h-64 bg-white/20 -bottom-16 -right-16" aria-hidden="true" />
            <div className="blob w-40 h-40 bg-white/10 top-10 -left-10" aria-hidden="true" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-6">
                <Rocket size={22} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-3">Почему стоит написать нам?</h4>
              <p className="text-blue-100 text-sm mb-8">Отвечаем в течение часа, подберём робота под ваш депозит и риск-профиль.</p>
              <ul className="space-y-6 flex-grow">
                {[
                  { icon: Sparkles, t: "Подбор стратегии", d: "Поможем выбрать робота исходя из вашего риск-профиля и депозита" },
                  { icon: Settings2, t: "Помощь в настройке", d: "Проконсультируем по подключению API и первичной конфигурации" },
                  { icon: ShieldCheck, t: "Эксклюзивы", d: "Расскажем о новых бета-тестах и закрытых стратегиях" },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                      <item.icon size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">{item.t}</div>
                      <div className="text-sm text-blue-100 leading-snug">{item.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}