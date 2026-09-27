import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ruTranslations, enTranslations } from './translations';

type Lang = 'ru' | 'en';

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => any;
  langLabel: string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('coinsofter-lang');
    return saved === 'en' || saved === 'ru' ? saved : 'ru';
  });

  useEffect(() => {
    localStorage.setItem('coinsofter-lang', lang);
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = (key: string): string => {
    const dict = lang === 'en' ? enTranslations : ruTranslations;
    const keys = key.split('.');
    let obj: any = dict;
    for (const k of keys) {
      if (obj === undefined) return key;
      obj = obj[k];
    }
    return typeof obj === 'function' ? obj() : (obj ?? key);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, langLabel: lang === 'ru' ? 'RU' : 'EN' }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
