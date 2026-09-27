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
      console.log("[Auth] Checking role for:", user.id);
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      console.log("[Auth] Result:", { data, error });
      
      if (error) {
        console.error("[Auth] Error:", error.message);
        setIsAdmin(false);
      } else {
        const isAdminRole = data?.role === "admin";
        console.log("[Auth] isAdmin:", isAdminRole);
        setIsAdmin(isAdminRole);
      }
    } catch (e) {
      console.error("[Auth] Exception:", e);
      setIsAdmin(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("[Auth] Initializing...");
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("[Auth] Session:", session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadRole();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("[Auth] State change:", session?.user?.email);
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
