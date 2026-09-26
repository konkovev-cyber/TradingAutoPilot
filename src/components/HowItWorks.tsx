import { motion } from 'framer-motion';
import { UserPlus, KeyRound, Bot, TrendingUp } from 'lucide-react';

const steps = [
  { icon: UserPlus, n: '01', title: 'Регистрация', desc: '30 секунд  и вы внутри. Без бумаг и звонков.' },
  { n: '02', title: 'API-ключ биржи', desc: 'Создайте ключ без права вывода и подключите к роботу.' },
  { n: '03', title: 'Выберите робота', desc: 'CryptoSuperStock, MEGAGRID-AI или SMARTIX  под вашу стратегию.' },
  { n: '04', title: 'Робот торгует 24/7', desc: 'Он мониторит рынок и исполняет сделки, вы получаете прибыль.' },
];

export default function HowItWorks() {
  return (
    <section id="how" className="section-padding relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <h2 className="heading-lg text-[var(--text)] mb-4">Как это работает</h2>
          <p className="text-[var(--text-muted)] text-lg">От регистрации до первой сделки  2 минуты</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative glass rounded-2xl p-6 card-hover"
            >
              <div className="text-4xl font-display font-bold text-[var(--primary)] opacity-20 mb-4">{s.n}</div>
              <h3 className="text-lg font-display font-bold text-[var(--text)] mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
