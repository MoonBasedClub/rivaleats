import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function hasEnv() {
  return Boolean(url && anonKey);
}

export async function createSupabaseServerClient(): Promise<SupabaseClient | null> {
  if (!hasEnv()) return null;

  const cookieStore = await cookies();

  return createServerClient(url!, anonKey!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value ?? undefined;
      },
      set(name: string, value: string, options?: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Readonly cookies in some contexts; ignore.
        }
      },
      remove(name: string, options?: any) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Readonly cookies in some contexts; ignore.
        }
      },
    },
  });
}

export async function getServerAuthUser(): Promise<{
  supabase: SupabaseClient | null;
  user: User | null;
  isAdmin: boolean;
}> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { supabase: null, user: null, isAdmin: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = Boolean(user?.user_metadata?.role === "admin");

  return { supabase, user, isAdmin };
}
