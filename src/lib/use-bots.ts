import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { bots as staticBots, colorDimFrom, type BotData, type BotStep } from "@/data/bots";

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

function normalizeSteps(raw: Json): BotStep[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item: Json) => {
      if (typeof item === "string") return { title: item, desc: "" };
      return { title: String(item?.title ?? ""), desc: String(item?.desc ?? "") };
    })
    .filter((s) => s.title !== "" || s.desc !== "");
}

function normalizeFeatures(raw: Json): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const list = raw.filter((f: Json) => typeof f === "string" && f.trim() !== "").map(String);
  return list.length > 0 ? list : undefined;
}

function str(v: Json): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}

/** Base DB columns may hold plain strings (legacy rows) or {ru, en} objects. */
function textPair(raw: Json): { ru: string; en: string | undefined } {
  if (typeof raw === "string") return { ru: raw, en: undefined };
  if (raw && typeof raw === "object") {
    return {
      ru: str(raw.ru) ?? "",
      en: str(raw.en),
    };
  }
  return { ru: "", en: undefined };
}

function sanitizeOverride(raw: Json): any {
  if (!raw || typeof raw !== "object") return undefined;
  const out: Record<string, any> = {};
  const t = (v: Json) => str(v);
  const set = (key: string, v: Json) => {
    const s = t(v);
    if (s) out[key] = s;
  };
  set("name", raw.name);
  set("slogan", raw.slogan);
  set("shortDesc", raw.shortDesc ?? raw.short_desc);
  set("fullDesc", raw.fullDesc ?? raw.full_desc);
  set("badge", raw.badge);
  set("market", raw.market);
  set("strategy", raw.strategy);
  set("risk", raw.risk);
  set("pairs", raw.pairs);
  const feats = normalizeFeatures(raw.features);
  if (feats) out.features = feats;
  const how = normalizeSteps(raw.howItWorks ?? raw.how_it_works);
  if (how.length > 0) out.howItWorks = how;
  const ex = normalizeSteps(raw.exampleTrade ?? raw.example_trade);
  if (ex.length > 0) out.exampleTrade = ex;
  return Object.keys(out).length > 0 ? out : undefined;
}

/** EN overrides derived from legacy base columns that store {ru, en} objects. */
function enFromColumns(row: Json): Json {
  const cols: [string, string][] = [
    ["slogan", "slogan"],
    ["shortDesc", "short_desc"],
    ["fullDesc", "full_desc"],
    ["badge", "badge"],
    ["market", "market"],
    ["strategy", "strategy"],
    ["risk", "risk"],
    ["pairs", "pairs"],
  ];
  const out: Record<string, any> = {};
  cols.forEach(([key, col]) => {
    const raw = row?.[col];
    if (raw && typeof raw === "object" && str(raw.en)) out[key] = raw.en;
  });
  return out;
}

function toBotData(row: Json): BotData {
  const slug = String(row?.slug ?? "");
  const stat = staticBots.find((b) => b.slug === slug);
  const color = String(row?.color ?? stat?.color ?? "#3b82f6");
  const returns = normalizeReturns(row?.returns);

  const colPair = {
    slogan: textPair(row?.slogan),
    shortDesc: textPair(row?.short_desc),
    fullDesc: textPair(row?.full_desc),
    badge: textPair(row?.badge),
    market: textPair(row?.market),
    strategy: textPair(row?.strategy),
    risk: textPair(row?.risk),
    pairs: textPair(row?.pairs),
  };

  const i18nRaw = row?.i18n && typeof row.i18n === "object" ? row.i18n : {};
  const enOv = { ...enFromColumns(row), ...(sanitizeOverride(i18nRaw.en) ?? {}) };
  const ruOv = sanitizeOverride(i18nRaw.ru) ?? {};
  const i18n: BotData["i18n"] = {};
  if (Object.keys(ruOv).length > 0) i18n.ru = ruOv;
  if (Object.keys(enOv).length > 0) i18n.en = enOv;

  return {
    slug,
    name: String(row?.name ?? stat?.name ?? slug),
    slogan: colPair.slogan.ru || stat?.slogan || "",
    shortDesc: colPair.shortDesc.ru || stat?.shortDesc || "",
    fullDesc: colPair.fullDesc.ru || stat?.fullDesc || "",
    badge: colPair.badge.ru || stat?.badge || "",
    howItWorks: normalizeSteps(row?.how_it_works).length > 0 ? normalizeSteps(row?.how_it_works) : (stat?.howItWorks ?? []),
    exampleTrade: normalizeSteps(row?.example_trade).length > 0 ? normalizeSteps(row?.example_trade) : (stat?.exampleTrade ?? []),
    features:
      Array.isArray(row?.features) && row.features.length > 0
        ? row.features.map(String)
        : (stat?.features ?? []),
    returns: returns.length > 0 ? returns : (stat?.returns ?? []),
    risk: colPair.risk.ru || stat?.risk || "",
    pairs: colPair.pairs.ru || stat?.pairs || "",
    market: colPair.market.ru || stat?.market || "",
    strategy: colPair.strategy.ru || stat?.strategy || "",
    color,
    colorDim: colorDimFrom(color),
    imageUrl: row?.image_url ? String(row.image_url) : undefined,
    difficulty: String(row?.difficulty ?? stat?.difficulty ?? ""),
    difficultyTone: (String(row?.difficulty_tone ?? stat?.difficultyTone ?? "starter") as BotData["difficultyTone"]),
    i18n,
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
