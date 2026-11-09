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
      const email = parsed?.user?.email || parsed?.session?.user?.email;
      if (email && ["konkev@bk.ru", "konkovev@gmail.com"].includes(email.toLowerCase())) {
        return true;
      }
      return Boolean(parsed?.user || parsed?.session?.user);
    }
  } catch {
    // ignore
  }
  return false;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(getInitialIsAdmin);
  const [loading, setLoading] = useState<boolean>(() => !getInitialUser());

  useEffect(() => {
    // 1. Sync immediately from getSession
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }: any) => {
        if (session?.user) {
          setUser(session.user);
          setIsAdmin(true);
          setLoading(false);
        } else {
          // Only clear if localStorage is actually empty
          const current = getInitialUser();
          if (!current) {
            setUser(null);
            setIsAdmin(false);
            setLoading(false);
          }
        }
      });
    }

    // 2. Listen to state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        setIsAdmin(true);
        setLoading(false);
      } else {
        const current = getInitialUser();
        if (!current) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, isAdmin, loading };
}
