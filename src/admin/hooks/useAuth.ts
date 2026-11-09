import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

function getInitialUser(): User | null {
  try {
    const raw = localStorage.getItem("tap_auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.user || parsed?.session?.user || null;
    }
  } catch {
    // ignore
  }
  return null;
}

function getInitialIsAdmin(): boolean {
  try {
    const raw = localStorage.getItem("tap_auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      // Any authenticated user stored locally is an admin
      const user = parsed?.user || parsed?.session?.user;
      return !!user;
    }
  } catch {
    // ignore
  }
  return false;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(getInitialIsAdmin);
  // If we already have user in localStorage — no need to show loading
  const [loading, setLoading] = useState<boolean>(() => !getInitialUser());

  useEffect(() => {
    // Listen to custom auth state changes (from supabase.ts adapter)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        setIsAdmin(true);
        setLoading(false);
      }
    });

    // If nothing in localStorage — finish loading so login page shows
    if (!getInitialUser()) {
      setLoading(false);
    }

    return () => subscription.unsubscribe();
  }, []);

  return { user, isAdmin, loading };
}
