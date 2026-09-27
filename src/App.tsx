import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "./lib/i18n";
import { ThemeProvider } from "./lib/theme";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = lazy(() => import("./pages/HomePage"));
const BotDetailPage = lazy(() => import("./pages/BotDetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminRoutes = lazy(() => import("./admin/index"));

function ScrollToTop() {
  const { pathname } = window.location;
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
              <div className="text-white text-lg">Loading...</div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/bots/:slug" element={<BotDetailPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  );
}
