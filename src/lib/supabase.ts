import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://zsupqrsnnegeclrlvlqg.supabase.co";
const DEFAULT_KEY = "sb_publishable_yaonKUgiLUjelLXS0gntTA_mvXzjaUv";

export const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_URL;
const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) return null;
  if (!client) client = createClient(supabaseUrl, supabaseKey);
  return client;
}

export const supabase = getSupabase();