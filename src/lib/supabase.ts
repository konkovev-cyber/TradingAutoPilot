import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Fallback values are safe to commit: the anon key is publishable by design.
const FALLBACK_URL = "https://zsupqrsnnegeclrlvlqg.supabase.co";
const FALLBACK_KEY = "sb_publishable_yaonKUgiLUjelLXS0gntTA_mvXzjaUv";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? FALLBACK_URL;
  const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? FALLBACK_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key);
  return client;
}

// Export for components that use it directly
export const supabase = getSupabase();
