import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export interface SiteSection {
  key: string;
  title: string;
  enabled: boolean;
  position: number;
}

export const DEFAULT_SECTIONS: SiteSection[] = [
  { key: "hero", title: "Шапка с графиком (Hero)", enabled: true, position: 1 },
  { key: "trust", title: "Островок доверия", enabled: true, position: 2 },
  { key: "how", title: "Как это работает", enabled: true, position: 3 },
  { key: "products", title: "Карточки роботов", enabled: true, position: 4 },
  { key: "calculator", title: "Калькулятор доходности", enabled: true, position: 5 },
  { key: "compare", title: "Сравнение роботов", enabled: true, position: 6 },
  { key: "faq", title: "Частые вопросы", enabled: true, position: 7 },
  { key: "lead", title: "Форма заявки", enabled: true, position: 8 },
  { key: "cta", title: "Призыв к действию (CTA)", enabled: true, position: 9 },
];

export async function fetchSections(): Promise<SiteSection[]> {
  if (!supabase) return DEFAULT_SECTIONS;
  try {
    const { data, error } = await supabase
      .from("site_sections")
      .select("key, title, enabled, position")
      .order("position", { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_SECTIONS;
    return data as SiteSection[];
  } catch {
    return DEFAULT_SECTIONS;
  }
}

export function useSections() {
  const [sections, setSections] = useState<SiteSection[]>(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections().then((s) => {
      setSections(s);
      setLoading(false);
    });
  }, []);

  return { sections, loading };
}
