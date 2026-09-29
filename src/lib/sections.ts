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
  { key: "why", title: "Почему роботы не взаимозаменяемы", enabled: true, position: 3 },
  { key: "products", title: "Витрина трёх роботов", enabled: true, position: 4 },
  { key: "choose", title: "Как выбрать робота (сравнение)", enabled: true, position: 5 },
  { key: "connect", title: "Подключение и безопасность", enabled: true, position: 6 },
  { key: "cta", title: "Финальный CTA (карусель роботов)", enabled: true, position: 7 },
  { key: "faq", title: "Частые вопросы", enabled: false, position: 8 },
  { key: "calculator", title: "Калькулятор доходности", enabled: false, position: 9 },
  { key: "lead", title: "Форма заявки", enabled: false, position: 10 },
];

export async function fetchSections(): Promise<SiteSection[]> {
  if (!supabase) return DEFAULT_SECTIONS;
  try {
    const { data, error } = await supabase
      .from("site_sections")
      .select("key, title, enabled, position")
      .order("position", { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_SECTIONS;
    return migrateLegacySections(data as SiteSection[]);
  } catch {
    return DEFAULT_SECTIONS;
  }
}

// Sections removed from the homepage in the product-first redesign.
const LEGACY_KEYS = ["how", "compare"];
// Optional blocks that must stay out of the main landing flow until explicitly re-enabled.
const OPTIONAL_KEYS = ["faq", "calculator", "lead"];

/**
 * Client-side compatibility with pre-migration site_sections rows:
 * drops legacy keys, adds missing new sections and disables the old
 * landing-flow blocks until the SQL migration is applied.
 */
function migrateLegacySections(rows: SiteSection[]): SiteSection[] {
  const hasLegacy = rows.some((r) => LEGACY_KEYS.includes(r.key));
  if (!hasLegacy) return rows;

  const merged = rows.filter((r) => !LEGACY_KEYS.includes(r.key));
  DEFAULT_SECTIONS.forEach((d) => {
    const idx = merged.findIndex((r) => r.key === d.key);
    if (idx === -1) {
      merged.push({ ...d });
    } else if (OPTIONAL_KEYS.includes(d.key)) {
      merged[idx] = { ...merged[idx], enabled: false };
    }
  });
  return merged
    .sort((a, b) => a.position - b.position)
    .map((s, i) => ({ ...s, position: i + 1 }));
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
