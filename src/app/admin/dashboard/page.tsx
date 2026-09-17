"use client";
import Link from "next/link";
import { Package, Wrench, Image as ImageIcon, Settings, ArrowRight } from "lucide-react";

const CARDS = [
  { l: "Produk", d: "Kelola katalog jualan", v: "16+", href: "/admin/products", icon: <Package size={22} /> },
  { l: "Layanan", d: "AC, home service, audio…", v: "7", href: "/admin/services", icon: <Wrench size={22} /> },
  { l: "Galeri", d: "Foto hasil pekerjaan", v: "6", href: "/admin/gallery", icon: <ImageIcon size={22} /> },
  { l: "Pengaturan", d: "No. WA, alamat & jam", v: "⚙", href: "/admin/settings", icon: <Settings size={22} /> },
];

export default function Dashboard() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Fokus jualan: produk, layanan & galeri. Chat masuk langsung via WhatsApp.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((c) => (
          <Link key={c.l} href={c.href} className="card-luxe group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-100 text-primary">{c.icon}</span>
            <span className="min-w-0 flex-1">
              <b className="block text-sm text-slate-500">{c.l}</b>
              <span className="block text-2xl font-black text-slate-900">{c.v}</span>
              <span className="block truncate text-xs text-slate-500">{c.d}</span>
            </span>
            <ArrowRight size={18} className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
