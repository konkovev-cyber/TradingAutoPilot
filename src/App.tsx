import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "./lib/i18n";
import { ThemeProvider } from "./lib/theme";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HomePage = lazy(() => import("./pages/HomePage"));
const BotDetailPage = lazy(() => import("./pages/BotDetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-gray-500">Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/bots/:slug" element={<BotDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  );
}
