import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Нужны ли навыки программирования?', a: 'Нет. Coinsofter  готовая платформа. Регистрация, подключение API-ключа биржи, выбор робота и стратегии из шаблонов. Всё настраивается в пару кликов, без единой строчки кода.' },
  { q: 'Как подключить биржу?', a: 'Зайдите в личный кабинет, выберите биржу (BYBIT, Binance, OKX и др.), создайте API-ключ с правом на торговлю, но БЕЗ права вывода средств. Скопируйте ключ и секрет в Coinsofter  подключение занимает 12 минуты.' },
  { q: 'Безопасно ли передавать API-ключи?', a: 'Да. Мы требуем создавать ключи без права вывода  робот может только торговать, но не выводить активы. Ключи шифруются по стандарту AES-256 и хранятся в зашифрованном виде. Доступа к вашим средствам у нас нет.' },
  { q: 'Какая минимальная сумма для старта?', a: 'Минимум  $10 на один ордер. Для комфортной торговли рекомендуем стартовать от $200500: чем больше капитал, тем гибче настройка рисков.' },
  { q: 'Как выводится прибыль?', a: 'Все средства остаются на вашей бирже. Робот только торгует  прибыль сразу на вашем балансе. Выводите её в любой момент через интерфейс биржи, мы не удерживаем ваши деньги.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="section-padding relative overflow-hidden">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <h2 className="heading-lg text-[var(--text)] mb-4">Частые вопросы</h2>
          <p className="text-[var(--text-muted)] text-lg">Всё, что нужно знать перед стартом</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[var(--surface-hover)] transition-colors"
              >
                <span className="font-medium text-[var(--text)] text-sm sm:text-base">{faq.q}</span>
                <ChevronDown size={18} className={`shrink-0 text-[var(--primary)] transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-[var(--text-muted)] leading-relaxed">{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
