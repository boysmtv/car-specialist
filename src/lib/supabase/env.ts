// Nama env Supabase bervariasi tergantung cara pasang:
// - Manual: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
// - Integrasi Vercel (prefix kepanjangan): NEXT_PUBLIC_SUPABASE_SUPABASE_URL /
//   NEXT_PUBLIC_SUPABASE_SUPABASE_ANON_KEY
// Helper ini mendukung keduanya (prioritas nama normal).

export function supabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_URL ||
    ""
  );
}

export function supabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_ANON_KEY ||
    ""
  );
}

export function isSupabaseEnvPresent(): boolean {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}
