"use client";
// Auth demo: Supabase bila configured, fallback local admin (env demo via API? gunakan default).
// Untuk MVP lokal: email admin@specialist-ac.local / admin123 disimpan di localStorage session.

const KEY = "admin_session";

export function getSession(): { email: string } | null {
  try {
    const s = localStorage.getItem(KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export function setSession(email: string) {
  localStorage.setItem(KEY, JSON.stringify({ email, at: Date.now() }));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export async function loginAdmin(email: string, password: string): Promise<{ ok: boolean; msg?: string }> {
  // Coba Supabase dulu
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const sb = createClient();
    if (sb) {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (!error) { setSession(email); return { ok: true }; }
    }
  } catch {}
  // Fallback demo
  if (email === "admin@specialist-ac.local" && password === "admin123") {
    setSession(email);
    return { ok: true };
  }
  return { ok: false, msg: "Email/password salah (demo: admin@specialist-ac.local / admin123)" };
}
