"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getSession, loginAdmin } from "@/lib/auth";
import { toast } from "sonner";

function Form() {
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState("admin@specialist-ac.local");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  // Sesi masih berlaku → langsung masuk, tidak perlu login lagi
  useEffect(() => {
    if (getSession()) {
      router.replace(sp.get("redirect") || "/admin/dashboard");
    }
  }, [router, sp]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await loginAdmin(email, password);
    setLoading(false);
    if (r.ok) {
      toast.success("Login berhasil");
      router.replace(sp.get("redirect") || "/admin/dashboard");
    } else toast.error(r.msg || "Login gagal");
  }

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <div className="card p-6">
        <h1 className="text-xl font-extrabold">Specialist AC Mobil — Admin</h1>
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <div><label className="label">Email</label><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label className="label">Password</label><input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <button disabled={loading} className="btn-primary">{loading ? "Masuk…" : "Login"}</button>
        </form>
        <p className="mt-3 text-xs text-slate-500">Demo lokal: admin@specialist-ac.local / admin123. Production: user Supabase (nonaktifkan sign-up publik).</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><Form /></Suspense>;
}
