import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadRole = async (userId: string, email?: string) => {
    if (!supabase || !userId) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // 0) Email whitelist: главный админ сайта всегда имеет доступ
    const adminEmails = ["konkev@bk.ru", "konkovev@gmail.com"];
    if (email && adminEmails.includes(email.toLowerCase())) {
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    try {
      // 1) RPC is_admin
      const { data, error } = await supabase.rpc("is_admin");
      if (!error && data !== null) {
        setIsAdmin(Boolean(data));
        console.log("[Auth] RPC is_admin:", Boolean(data));
        setLoading(false);
        return;
      }
      console.error("[Auth] RPC failed, fallback to table:", error?.message);
    } catch (e) {
      console.error("[Auth] RPC exception:", e);
    }

    // 2) Fallback: читаем свою роль из user_roles
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) console.error("[Auth] table check error:", error.message);
      if (data?.role === "admin") {
        setIsAdmin(true);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error("[Auth] table exception:", e);
    }

    // 3) Любой авторизованный пользователь в закрытой системе считается админом
    setIsAdmin(true);
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
        await loadRole(session.user.id, session.user.email);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadRole(session.user.id, session.user.email);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, isAdmin, loading };
}
