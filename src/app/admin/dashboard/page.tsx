"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Wrench, Image as ImageIcon, Settings, ArrowRight, Database, CircleCheck, CircleX } from "lucide-react";
import { cloudListGallery, cloudListProducts, cloudListServices } from "@/lib/adminDb";

const CARDS = [
  { l: "Produk", d: "Kelola katalog jualan", href: "/admin/products", icon: <Package size={22} />, key: "products" },
  { l: "Layanan", d: "AC, home service, audio…", href: "/admin/services", icon: <Wrench size={22} />, key: "services" },
  { l: "Galeri", d: "Foto hasil pekerjaan", href: "/admin/gallery", icon: <ImageIcon size={22} />, key: "gallery" },
  { l: "Pengaturan", d: "No. WA, alamat & jam", href: "/admin/settings", icon: <Settings size={22} />, key: null },
];

const TABLE_LABEL: Record<string, string> = {
  services: "Tabel layanan",
  products: "Tabel produk",
  gallery: "Tabel galeri",
  site_settings: "Tabel pengaturan",
  categories: "Tabel kategori",
  "storage:images": "Storage foto",
};

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [health, setHealth] = useState<{ supabase: boolean; tables: Record<string, string> } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const h = await fetch("/api/health", { cache: "no-store" }).then((r) => r.json());
        setHealth(h);
      } catch {}
      const out: Record<string, number> = {};
      try {
        const [p, s, g] = await Promise.all([cloudListProducts(), cloudListServices(), cloudListGallery()]);
        out.products = p.length;
        out.services = s.length;
        out.gallery = g.length;
      } catch {
        out.products = 0;
        out.services = 0;
        out.gallery = 0;
      }
      setCounts(out);
    })();
  }, []);

  const allOk = health?.supabase && Object.values(health.tables).every((v) => v === "ok");

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Fokus jualan: produk, layanan & galeri. Chat masuk langsung via WhatsApp.</p>

      {/* STATUS KONEKSI */}
      <div className={`card-luxe mt-4 p-4 ${health && !allOk ? "border-red-200" : ""}`}>
        <div className="flex items-center gap-2">
          <Database size={18} className="text-primary" />
          <b className="text-sm">Status koneksi database</b>
          {health && (
            <span className={`badge ml-auto ${allOk ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
              {allOk ? "Terhubung ✓" : "Belum beres ✗"}
            </span>
          )}
        </div>
        {!health && <p className="mt-2 text-xs text-slate-500">Memeriksa…</p>}
        {health && !health.supabase && (
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Env Supabase <b>tidak terbaca</b> di server. Di Vercel: Settings → Environment Variables →
            pastikan <code>NEXT_PUBLIC_SUPABASE_URL</code> & <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ada →
            <b> Redeploy</b>. Selama ini tertulis, semua simpanan hanya di browser & tidak tampil publik.
          </p>
        )}
        {health?.supabase && (
          <ul className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
            {Object.entries(health.tables).map(([t, v]) => (
              <li key={t} className="flex items-start gap-1.5 rounded-lg bg-slate-50 px-2 py-1.5">
                {v === "ok"
                  ? <CircleCheck size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                  : <CircleX size={14} className="mt-0.5 shrink-0 text-red-600" />}
                <span><b>{TABLE_LABEL[t] ?? t}</b>{v !== "ok" && <span className="block text-slate-500">{v}</span>}</span>
              </li>
            ))}
          </ul>
        )}
        {health?.supabase && !allOk && (
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Ada yang error di atas = migrasi belum dijalankan. Di Supabase → SQL Editor → jalankan
            <b> 0001_init.sql</b> lalu <b>0002_admin_storage.sql</b> → refresh halaman ini.
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((c) => (
          <Link key={c.l} href={c.href} className="card-luxe group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-100 text-primary">{c.icon}</span>
            <span className="min-w-0 flex-1">
              <b className="block text-sm text-slate-500">{c.l}</b>
              <span className="block text-2xl font-black text-slate-900">{c.key ? (counts[c.key] ?? "…") : "⚙"}</span>
              <span className="block truncate text-xs text-slate-500">{c.d}</span>
            </span>
            <ArrowRight size={18} className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
