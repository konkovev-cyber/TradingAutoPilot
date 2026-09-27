import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './lib/i18n';
import { ThemeProvider } from './lib/theme';
import HomePage from './pages/HomePage';
import BotDetailPage from './pages/BotDetailPage';

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bots/:slug" element={<BotDetailPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  );
}
