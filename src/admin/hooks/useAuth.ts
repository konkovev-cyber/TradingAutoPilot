import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadRole = async () => {
    if (!supabase || !user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    try {
      // Проверяем таблицу user_roles напрямую
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      if (error) {
        console.error("Error loading role:", error);
        setIsAdmin(false);
      } else {
        const isAdminRole = data?.role === "admin";
        console.log("User role check:", { userId: user.id, role: data?.role, isAdmin: isAdminRole });
        setIsAdmin(isAdminRole);
      }
    } catch (e) {
      console.error("loadRole error:", e);
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
      if (session?.user) await loadRole();
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadRole();
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, isAdmin, loading };
}
