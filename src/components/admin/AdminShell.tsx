"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Package, Wrench, Image as ImageIcon, Settings,
  LogOut, Menu, X,
} from "lucide-react";
import { adminNav } from "@/config/site";
import { clearSession, getSession } from "@/lib/auth";

const ICONS: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard size={18} />,
  box: <Package size={18} />,
  wrench: <Wrench size={18} />,
  image: <ImageIcon size={18} />,
  settings: <Settings size={18} />,
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [cloudSession, setCloudSession] = useState<boolean | null>(null);

  useEffect(() => {
    if (path === "/admin/login") { setReady(true); return; }
    const s = getSession();
    if (!s) router.replace(`/admin/login?redirect=${encodeURIComponent(path || "/admin/dashboard")}`);
    else {
      setEmail(s.email);
      setReady(true);
      // Cek apakah ada sesi Supabase asli (bisa tulis database) atau cuma demo lokal
      import("@/lib/supabase/client").then(({ createClient }) => {
        createClient()?.auth.getSession().then(({ data }) => {
          setCloudSession(!!data.session);
        }).catch(() => setCloudSession(false));
      }).catch(() => setCloudSession(false));
    }
  }, [path, router]);

  if (path === "/admin/login") return <>{children}</>;
  if (!ready) {
    return (
      <div className="container-x grid place-items-center py-24">
        <div className="card grid place-items-center gap-2 p-10 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-100 text-primary"><LayoutDashboard size={20} /></span>
          <p className="text-sm font-semibold text-slate-600">Memeriksa sesi admin…</p>
        </div>
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/admin/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-2 py-1">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-sm font-black text-white shadow">AC</span>
        <span className="leading-tight">
          <b className="block text-sm text-slate-900">Specialist AC</b>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary">Panel Admin</span>
        </span>
      </Link>
      <nav className="mt-5 grid gap-1">
        {adminNav.map((n) => {
          const active = path?.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active ? "bg-orange-100 text-orange-900 shadow-sm" : "text-slate-600 hover:bg-orange-50 hover:text-orange-900"
              }`}
            >
              <span className={active ? "text-primary" : "text-slate-400"}>{ICONS[n.icon]}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto grid gap-2 pt-6">
        <div className="rounded-xl bg-orange-50 px-3 py-2.5 text-xs">
          <p className="truncate font-semibold text-slate-700">{email}</p>
          {cloudSession !== null && (
            <p className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${cloudSession ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {cloudSession ? "● Supabase (bisa simpan)" : "● Demo (tidak permanen)"}
            </p>
          )}
          <button
            onClick={() => { clearSession(); router.replace("/admin/login"); }}
            className="mt-1 inline-flex items-center gap-1 font-semibold text-red-600 hover:underline"
          >
            <LogOut size={13} /> Keluar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F4]">
      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden />
      )}
      <div className="flex">
        <aside className={`fixed z-40 h-screen w-64 border-r border-orange-100 bg-white p-4 shadow-xl transition-transform lg:static lg:z-auto lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          {sidebar}
        </aside>
        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-orange-100 bg-white/90 px-4 py-3 backdrop-blur">
            <button className="btn-outline !px-3 !py-1.5 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
            <b className="text-sm text-slate-800">Panel Admin</b>
          </div>
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
