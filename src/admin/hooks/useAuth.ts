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
      // TEMP: Direct table query with proper error handling
      console.log("Checking role for user:", user.id);
      const { data, error, status } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      console.log("Query result:", { data, error, status });
      
      if (error) {
        console.error("Role query error:", error.message);
        // Fallback: if we can't query, assume not admin
        setIsAdmin(false);
      } else {
        const isAdminRole = data?.role === "admin";
        console.log("Role determined:", isAdminRole ? "ADMIN" : "USER");
        setIsAdmin(isAdminRole);
      }
    } catch (e) {
      console.error("loadRole exception:", e);
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
      console.log("Session:", session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadRole();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state change:", session?.user?.email);
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
