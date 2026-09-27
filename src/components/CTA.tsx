import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function CTA() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <section className="section-padding relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, var(--primary), transparent 70%)" }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="glass-strong rounded-[2rem] p-10 sm:p-14 gradient-border"
        >
          <h2 className="heading-lg text-[var(--text)] mb-5">
            {t("cta.title")}
          </h2>
          <p className="text-[var(--text-muted)] text-lg mb-10 max-w-xl mx-auto">
            {t("cta.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => navigate("/#bots")} className="btn-primary px-8 py-4 text-base shine">
              {t("cta.btn1")}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button onClick={() => navigate("/#faq")} className="btn-secondary px-8 py-4 text-base">
              {t("cta.btn2")}
            </button>
          </div>

          <p className="text-xs text-[var(--text-subtle)] mt-8">{t("cta.trust")}</p>
        </motion.div>
      </div>
    </section>
  );
}
