import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { bots as staticBots, type BotData } from "@/data/bots";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = any;

function normalizeReturns(raw: Json): BotData["returns"] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item: Json) => {
      if (typeof item === "string") return { period: "", value: item };
      return { period: String(item?.period ?? ""), value: String(item?.value ?? "") };
    })
    .filter((r) => r.value !== "");
}

function normalizeSteps(raw: Json): BotData["howItWorks"] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item: Json) => {
      if (typeof item === "string") return { title: item, desc: "" };
      return { title: String(item?.title ?? ""), desc: String(item?.desc ?? "") };
    })
    .filter((s) => s.title !== "" || s.desc !== "");
}

function toBotData(row: Json): BotData {
  const slug = String(row?.slug ?? "");
  const stat = staticBots.find((b) => b.slug === slug);
  const color = String(row?.color ?? stat?.color ?? "#3b82f6");
  const returns = normalizeReturns(row?.returns);

  return {
    slug,
    name: String(row?.name ?? stat?.name ?? slug),
    slogan: String(row?.slogan ?? stat?.slogan ?? ""),
    shortDesc: String(row?.short_desc ?? stat?.shortDesc ?? ""),
    fullDesc: String(row?.full_desc ?? stat?.fullDesc ?? ""),
    badge: String(row?.badge ?? stat?.badge ?? ""),
    howItWorks: normalizeSteps(row?.how_it_works).length > 0 ? normalizeSteps(row?.how_it_works) : (stat?.howItWorks ?? []),
    features:
      Array.isArray(row?.features) && row.features.length > 0
        ? row.features.map(String)
        : (stat?.features ?? []),
    returns: returns.length > 0 ? returns : (stat?.returns ?? []),
    risk: String(row?.risk ?? stat?.risk ?? ""),
    pairs: String(row?.pairs ?? stat?.pairs ?? ""),
    market: String(row?.market ?? stat?.market ?? ""),
    strategy: String(row?.strategy ?? stat?.strategy ?? ""),
    color,
    colorDim: stat?.colorDim ?? "rgba(59, 130, 246, 0.12)",
    imageUrl: row?.image_url ? String(row.image_url) : undefined,
    difficulty: String(row?.difficulty ?? stat?.difficulty ?? ""),
    difficultyTone: (String(row?.difficulty_tone ?? stat?.difficultyTone ?? "starter") as BotData["difficultyTone"]),
  };
}

export function useBots() {
  const [bots, setBots] = useState<BotData[]>(staticBots);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("bots")
      .select("*")
      .order("position", { ascending: true })
      .then(({ data: rows }) => {
        if (!rows || rows.length === 0) return;
        setBots(rows.map(toBotData));
      });
  }, []);

  return bots;
}
