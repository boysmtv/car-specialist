"use client";
// Session admin: Supabase bila configured, fallback demo lokal.
// Sesi demo berupa token acak + masa berlaku 30 MENIT, disimpan di localStorage
// dan divalidasi (format + expiry) setiap dibaca.

const KEY = "admin_session";
export const SESSION_MAX_AGE_MS = 30 * 60 * 1000;

export interface AdminSession {
  email: string;
  token: string;
  iat: number;
  exp: number;
}

type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function defaultStore(): Store | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch {}
  return null;
}

function randomToken(): string {
  try {
    const b = new Uint8Array(16);
    crypto.getRandomValues(b);
    return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  } catch {
    return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

export function createSession(email: string, now = Date.now()): AdminSession {
  return { email, token: randomToken(), iat: now, exp: now + SESSION_MAX_AGE_MS };
}

export function getSession(store?: Store | null): AdminSession | null {
  const s = store ?? defaultStore();
  if (!s) return null;
  try {
    const raw = s.getItem(KEY);
    if (!raw) return null;
    const sess = JSON.parse(raw) as Partial<AdminSession>;
    if (!sess.email || !sess.token || typeof sess.iat !== "number" || typeof sess.exp !== "number") {
      s.removeItem(KEY);
      return null;
    }
    if (Date.now() > sess.exp) {
      s.removeItem(KEY); // token kedaluwarsa → paksa login ulang
      return null;
    }
    return sess as AdminSession;
  } catch {
    try { s.removeItem(KEY); } catch {}
    return null;
  }
}

export function setSession(email: string, store?: Store | null): AdminSession | null {
  const s = store ?? defaultStore();
  if (!s) return null;
  const sess = createSession(email);
  try {
    s.setItem(KEY, JSON.stringify(sess));
    return sess;
  } catch {
    return null;
  }
}

export function clearSession(store?: Store | null) {
  try { (store ?? defaultStore())?.removeItem(KEY); } catch {}
}

export function isAuthenticated(store?: Store | null): boolean {
  return getSession(store) !== null;
}

export async function loginAdmin(email: string, password: string): Promise<{ ok: boolean; msg?: string }> {
  // HANYA Supabase. Tidak ada lagi akun demo — kredensial demo yang dulu
  // tertulis di kode tidak boleh bisa dipakai login ke mana pun.
  let sb: ReturnType<typeof import("@/lib/supabase/client").createClient> = null;
  try {
    const { createClient } = await import("@/lib/supabase/client");
    sb = createClient();
  } catch {}
  if (!sb) {
    return { ok: false, msg: "Server belum terhubung Supabase. Hubungi pemilik web." };
  }
  try {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, msg: "Email/password salah." };
  } catch {
    return { ok: false, msg: "Tidak bisa menghubungi server login. Coba lagi." };
  }
  const sess = setSession(email);
  if (!sess) return { ok: false, msg: "Browser memblokir penyimpanan sesi." };
  return { ok: true };
}
