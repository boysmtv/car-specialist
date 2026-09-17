import Link from "next/link";
import { MapPin } from "lucide-react";
import { mapsSearchUrl } from "@/lib/maps";
import type { SiteSettings } from "@/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-16 border-t border-orange-100 bg-white pb-24 text-slate-600 lg:pb-0">
      <div className="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Menu</h3>
          <ul className="grid gap-2 text-sm">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/layanan" className="hover:text-primary">Layanan</Link></li>
            <li><Link href="/produk" className="hover:text-primary">Produk</Link></li>
            <li><Link href="/galeri" className="hover:text-primary">Galeri</Link></li>
            <li><Link href="/konsultasi" className="hover:text-primary">Konsultasi</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Layanan</h3>
          <ul className="grid gap-2 text-sm">
            <li><Link href="/layanan/service-ac-mobil" className="hover:text-primary">AC Mobil</Link></li>
            <li><Link href="/layanan/perbaikan-power-window" className="hover:text-primary">Power Window</Link></li>
            <li><Link href="/layanan/perbaikan-central-lock" className="hover:text-primary">Central Lock</Link></li>
            <li><Link href="/layanan/audio-mobil" className="hover:text-primary">Audio</Link></li>
            <li><Link href="/layanan/variasi-mobil" className="hover:text-primary">Variasi</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Kontak</h3>
          <ul className="grid gap-2 text-sm">
            <li>WA: {settings.phone}</li>
            <li>
              <a href={mapsSearchUrl(settings.address)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline" title="Klik untuk buka di Google Maps">
                <MapPin size={14} /> {settings.address} — Buka Maps
              </a>
            </li>
            <li className="text-slate-400">Senin–Sabtu (lihat jam di Kontak)</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Sosial</h3>
          <ul className="grid gap-2 text-sm">
            {(Object.entries(settings.social_links).filter(([, v]) => v) as [string, string][]).map(([k, v]) => (
              <li key={k}><a href={v} target="_blank" rel="noreferrer" className="hover:text-primary">{k}</a></li>
            ))}
            {Object.values(settings.social_links).every((v) => !v) && <li className="text-slate-400">Ikuti media sosial kami (diatur via admin).</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-orange-100 bg-orange-50/60 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {settings.business_name} · <Link href="/kebijakan-privasi" className="underline">Privasi</Link> · <Link href="/syarat-ketentuan" className="underline">Syarat</Link>
        <span className="mx-2 text-slate-300">|</span>
        <Link href="/admin/login" className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-white px-3 py-1 font-semibold text-orange-800 transition hover:bg-orange-100">
          🔒 Login Admin
        </Link>
      </div>
    </footer>
  );
}
