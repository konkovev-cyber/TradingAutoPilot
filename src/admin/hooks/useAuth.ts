import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // userId передаётся параметром  замыкание не устаревает
  const loadRole = async (userId: string) => {
    if (!supabase || !userId) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    try {
      // 1) RPC is_admin  работает, т.к. SECURITY DEFINER обходит RLS
      const { data, error } = await supabase.rpc("is_admin");
      if (!error) {
        setIsAdmin(Boolean(data));
        console.log("[Auth] RPC is_admin:", Boolean(data));
        setLoading(false);
        return;
      }
      console.error("[Auth] RPC failed, fallback to table:", error.message);
    } catch (e) {
      console.error("[Auth] RPC exception:", e);
    }
    // 2) Fallback: читаем свою роль из user_roles (политика разрешает свою запись)
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) console.error("[Auth] table check error:", error.message);
      const admin = data?.role === "admin";
      console.log("[Auth] table check:", { role: data?.role, admin });
      setIsAdmin(admin);
    } catch (e) {
      console.error("[Auth] table exception:", e);
      setIsAdmin(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadRole(session.user.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, isAdmin, loading };
}