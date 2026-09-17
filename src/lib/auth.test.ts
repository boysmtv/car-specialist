import { describe, it, expect } from "vitest";
import { createSession, getSession, setSession, clearSession, isAuthenticated, SESSION_MAX_AGE_MS } from "@/lib/auth";

function memStore() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => { m.set(k, v); },
    removeItem: (k: string) => { m.delete(k); },
  };
}

describe("admin session", () => {
  it("createSession punya token + expiry 30 menit", () => {
    const s = createSession("a@x.id", 1000);
    expect(s.email).toBe("a@x.id");
    expect(s.token.length).toBeGreaterThan(10);
    expect(s.exp - s.iat).toBe(SESSION_MAX_AGE_MS);
  });

  it("setuju → getSession roundtrip", () => {
    const store = memStore();
    setSession("admin@x.id", store);
    const s = getSession(store);
    expect(s?.email).toBe("admin@x.id");
    expect(isAuthenticated(store)).toBe(true);
  });

  it("token kedaluwarsa ditolak + dibersihkan", () => {
    const store = memStore();
    store.setItem("admin_session", JSON.stringify({ email: "a@x.id", token: "t", iat: 1, exp: Date.now() - 1000 }));
    expect(getSession(store)).toBeNull();
    expect(isAuthenticated(store)).toBe(false);
    expect(store.getItem("admin_session")).toBeNull();
  });

  it("sesi rusak ditolak", () => {
    const store = memStore();
    store.setItem("admin_session", "bukan-json");
    expect(getSession(store)).toBeNull();
    store.setItem("admin_session", JSON.stringify({ email: "a@x.id" }));
    expect(getSession(store)).toBeNull();
  });

  it("clearSession menghapus sesi", () => {
    const store = memStore();
    setSession("a@x.id", store);
    clearSession(store);
    expect(getSession(store)).toBeNull();
  });
});
