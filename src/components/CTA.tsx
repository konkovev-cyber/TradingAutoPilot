import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function CTA() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-12 sm:p-16 border border-gray-100 shadow-sm"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-5">
            {t("cta.title")}
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            {t("cta.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => navigate("/#bots")} className="btn-primary px-8 py-4 text-base">
              {t("cta.btn1")}
              <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate("/#faq")} className="btn-secondary px-8 py-4 text-base">
              {t("cta.btn2")}
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-8">{t("cta.trust")}</p>
        </motion.div>
      </div>
    </section>
  );
}
