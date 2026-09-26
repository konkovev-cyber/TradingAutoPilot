import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { pricingPlans } from '@/data/content';

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="section-padding relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7B61FF]/5 rounded-full blur-[120px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#E6EDF7] mb-4">
            Тарифы
          </h2>
          <p className="text-[#8B95A7] max-w-2xl mx-auto mb-6">
            Без абонплаты. Платите только когда зарабатываете. Переключайтесь между
            планами в любой момент.
          </p>
          {/* Toggle */}
          <div className="inline-flex items-center gap-3 glass rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !yearly ? 'btn-primary' : 'text-[#8B95A7]'
              }`}
            >
              Помесячно
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                yearly ? 'btn-primary' : 'text-[#8B95A7]'
              }`}
            >
              Годовой
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.highlight
                  ? 'glass-strong border-[#00FFB2]/30 glow-primary'
                  : 'glass'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#00FFB2] text-[#0A0E17] text-xs font-bold">
                  Популярный
                </div>
              )}

              <h3 className="text-xl font-display font-bold text-[#E6EDF7] mb-2">
                {plan.name}
              </h3>
              <p className="text-sm text-[#8B95A7] mb-6">{plan.description}</p>

              <div className="mb-6">
                {plan.price === 'Кастом' ? (
                  <span className="text-3xl font-display font-bold text-[#E6EDF7]">
                    Кастом
                  </span>
                ) : (
                  <>
                    <span className="text-4xl font-display font-bold text-[#E6EDF7]">
                      {plan.price === '0' ? '0' : yearly ? plan.price : plan.price}
                    </span>
                    <span className="text-sm text-[#8B95A7] ml-1">
                      {plan.period && `${plan.period === 'мес' ? '/мес' : ''}`}
                    </span>
                  </>
                )}
              </div>

              <button
                className={`w-full py-3 rounded-xl text-sm font-semibold mb-6 transition-all ${
                  plan.highlight ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[#8B95A7]">
                    <Check size={16} className="text-[#00FFB2] shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
