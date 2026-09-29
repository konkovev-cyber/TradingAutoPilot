import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800 mb-8">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t("notFound.title")}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{t("notFound.desc")}</p>
        <Link to="/" className="btn-primary px-8 py-3 inline-flex items-center gap-2">
          {t("notFound.btn")}
        </Link>
      </motion.div>
    </div>
  );
}
