"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, MessageCircle, MessagesSquare, MapPin, Clock } from "lucide-react";
import { navLinks } from "@/config/site";
import { waLink } from "@/lib/whatsapp";
import { mapsSearchUrl } from "@/lib/maps";
import { siteDefaults } from "@/config/site";

export default function Navbar({ businessName, whatsapp }: { businessName: string; whatsapp: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40">
      {/* Topbar soft — alamat & jam, klik langsung ke Maps */}
      <div className="bg-orange-50 text-orange-950">
        <div className="container-x flex items-center justify-between gap-2 py-1.5 text-[11px] sm:text-xs">
          <a
            href={mapsSearchUrl(siteDefaults.address)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-w-0 items-center gap-1.5 truncate font-medium hover:text-primary"
            title="Klik untuk buka di Google Maps"
          >
            <MapPin size={13} className="shrink-0 text-primary" />
            <span className="truncate">{siteDefaults.addressShort} — klik untuk Maps</span>
          </a>
          <span className="hidden shrink-0 items-center gap-1.5 sm:inline-flex">
            <Clock size={13} className="text-primary" /> Senin–Sabtu · 08:00–17:00
          </span>
        </div>
      </div>
      {/* Main bar putih */}
      <div className="border-b border-orange-100 bg-white/90 shadow-sm backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-sm font-black text-white">AC</span>
            <span className="leading-tight">
              <span className="block max-w-[190px] truncate text-sm font-extrabold tracking-tight text-slate-900 sm:max-w-none sm:text-base">{businessName}</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Cikarang Barat</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-600 lg:flex" aria-label="Navigasi utama">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition hover:text-primary">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <a href={waLink("Halo, saya ingin bertanya tentang layanan bengkel.", whatsapp)} target="_blank" rel="noreferrer" className="btn-wa !px-3 !py-2">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <Link href="/konsultasi" className="btn-gold !px-3 !py-2">
              <MessagesSquare size={16} /> Konsultasi
            </Link>
          </div>
          <button className="btn-outline !px-3 !py-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-orange-100 bg-white px-4 py-3 lg:hidden" aria-label="Menu mobile">
            <div className="grid gap-1">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-orange-50">
                  {l.label}
                </Link>
              ))}
              <a href={mapsSearchUrl(siteDefaults.address)} target="_blank" rel="noreferrer" className="rounded-lg px-3 py-2.5 text-sm font-semibold text-primary">
                📍 Cikarang Barat — Buka Maps
              </a>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <a href={waLink("Halo, saya ingin bertanya.", whatsapp)} target="_blank" rel="noreferrer" className="btn-wa">WhatsApp</a>
                <Link href="/konsultasi" onClick={() => setOpen(false)} className="btn-gold">Konsultasi</Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
