import { motion } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  { q: 'Нужны ли навыки программирования?', a: 'Нет. Coinsofter  готовая платформа. Регистрация, подключение API-ключа, выбор бота  всё в пару кликов.' },
  { q: 'Как подключить биржу?', a: 'Создайте API-ключ на бирже без права вывода, скопируйте в Coinsofter. Подключение занимает 1-2 минуты.' },
  { q: 'Безопасно ли передавать API-ключи?', a: 'Да. Мы требуем ключи без права вывода  бот может только торговать. Ключи шифруются AES-256.' },
  { q: 'Какая минимальная сумма?', a: 'Минимум $10 на ордер. Для комфортной торговли рекомендуем от $200-500.' },
  { q: 'Есть ли демо-режим?', a: 'Да. Вы можете запустить бота с виртуальными средствами и проверить стратегию.' },
  { q: 'Как выводится прибыль?', a: 'Все средства остаются на вашей бирже. Бот только торгует  прибыль сразу на вашем балансе.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h2 className="heading-lg text-[var(--text)] mb-4">Частые вопросы</h2>
          <p className="text-[var(--text-muted)] text-lg">Всё, что нужно знать перед стартом</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.05 }} className="glass rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--white-5)] transition-colors">
                <span className="font-medium text-[var(--text)]">{faq.q}</span>
                <svg className={`w-5 h-5 text-[var(--primary)] transition-transform ${open === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-[var(--text-muted)] leading-relaxed">{faq.a}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
