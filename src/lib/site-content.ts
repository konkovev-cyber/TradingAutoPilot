/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";

type Json = any;

const FALLBACKS: Record<string, Json> = {
  meta: {
    title: "Coinsofter \u2014 Торговые роботы для крипты и акций",
    description: "Coinsofter \u2014 интеллектуальные торговые роботы для криптовалют и акций. Автоматическая торговля 24/7 через API.",
  },
  hero: {
    badge: "20+ бирж \u00b7 ИИ-торговля 24/7",
    title1: "Торгуйте криптой",
    title2: "на автопилоте",
    subtitle: "Боты на ИИ торгуют на 20+ биржах через API. Средняя доходность портфеля \u2014 +96.4% за год. Работают 24/7.",
    pick: "Выбрать робота",
    cta2: "Как это работает",
  },
  cta: {
    title: "Выберите своего торгового робота",
    subtitle: "Без абонентской платы и комиссий с прибыли \u2014 покупаете робота один раз, он торгует для вас круглосуточно.",
    btn1: "Смотреть роботов",
    btn2: "Вопросы и ответы",
    trust: "АПИ-ключи без права вывода. Средства остаются на вашей бирже",
  },
  nav: {
    bots: "Роботы",
    how: "Как работает",
    faq: "FAQ",
  },
};

export function useSiteContent(): Record<string, Json> {
  const [data, setData] = useState<Record<string, Json>>(FALLBACKS);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("site_content")
      .select("section, data")
      .then(({ data: rows }) => {
        if (!rows || rows.length === 0) return;
        const merged: Record<string, Json> = { ...FALLBACKS };
        rows.forEach((r: any) => {
          merged[r.section] = { ...(FALLBACKS[r.section] ?? {}), ...(r.data ?? {}) };
        });
        setData(merged);
      });
  }, []);

  return data;
}

export function useContent() {
  const data = useSiteContent();
  return useCallback(
    (section: string, key: string, fallback: string): string => {
      const v = data?.[section]?.[key];
      return v === undefined || v === null || v === "" ? fallback : String(v);
    },
    [data]
  );
}
