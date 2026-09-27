import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800 mb-8">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Страница не найдена</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Похоже, вы зашли слишком далеко в поисках прибыли. Такой страницы не существует.</p>
        <Link to="/" className="btn-primary px-8 py-3 inline-flex items-center gap-2">
          Вернуться на главную
        </Link>
      </motion.div>
    </div>
  );
}
