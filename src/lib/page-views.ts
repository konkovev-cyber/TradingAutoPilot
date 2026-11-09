import { supabase } from "./supabase";

export function recordPageView(path = typeof window !== "undefined" ? window.location.pathname : "/") {
  if (typeof window === "undefined") return;

  // 1. Post to Express backend (persists into PostgreSQL or in-memory)
  try {
    fetch("/api/page-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      }),
    }).catch(() => {});
  } catch {}

  // 2. Mirror to Supabase if available
  if (supabase) {
    try {
      supabase.from("page_views").insert({ path }).then(() => {}, () => {});
    } catch {}
  }
}
