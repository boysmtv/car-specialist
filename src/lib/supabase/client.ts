import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseEnvPresent, supabaseAnonKey, supabaseUrl } from "./env";

export function createClient() {
  const url = supabaseUrl();
  const anon = supabaseAnonKey();
  if (!url || !anon) return null;
  return createBrowserClient(url, anon);
}

export function isSupabaseConfigured() {
  return isSupabaseEnvPresent();
}
