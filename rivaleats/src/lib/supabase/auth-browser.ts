"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function hasEnv() {
  return Boolean(url && anonKey);
}

export function createSupabaseBrowserClient(): SupabaseClient | null {
  if (!hasEnv()) return null;
  return createBrowserClient(url!, anonKey!);
}
