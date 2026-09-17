import { NextResponse } from "next/server";
import { createServerSupabase, isServerSupabaseConfigured } from "@/lib/supabase/server";

// Diagnosa koneksi database (tanpa membocorkan secret / isi data).
// Dipakai dashboard admin untuk menunjukkan persis apa yang kurang.
export async function GET() {
  const supabase = isServerSupabaseConfigured();
  const tables: Record<string, string> = {};
  if (supabase) {
    const sb = createServerSupabase();
    if (sb) {
      for (const t of ["services", "products", "gallery", "site_settings", "categories"]) {
        try {
          const { error } = await sb.from(t).select("id").limit(1);
          tables[t] = error ? `error: ${error.message}` : "ok";
        } catch (e) {
          tables[t] = `error: ${(e as Error).message}`;
        }
      }
      try {
        const { error } = await sb.storage.from("images").list("", { limit: 1 });
        tables["storage:images"] = error ? `error: ${error.message}` : "ok";
      } catch (e) {
        tables["storage:images"] = `error: ${(e as Error).message}`;
      }
    }
  }
  return NextResponse.json({ ok: true, supabase, tables });
}
