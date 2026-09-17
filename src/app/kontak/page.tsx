import type { Metadata } from "next";
import { MapPin, Navigation } from "lucide-react";
import { getSettings } from "@/lib/data";
import { waLink } from "@/lib/whatsapp";
import { mapsDirectionUrl, mapsEmbedUrl, mapsSearchUrl } from "@/lib/maps";

export const metadata: Metadata = { title: "Kontak", description: "Alamat, jam operasional & kontak Specialist AC Mobil." };

export default async function KontakPage() {
  const s = await getSettings();
  return (
    <div className="container-x max-w-4xl py-10">
      <p className="badge-gold">📍 Klik peta untuk buka Google Maps</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">Kontak</h1>

      {/* PETA KLIK-LANGSUNG */}
      <a
        href={mapsSearchUrl(s.address)}
        target="_blank"
        rel="noreferrer"
        title="Klik untuk buka di Google Maps"
        className="group relative mt-4 block overflow-hidden rounded-2xl border border-border shadow-[0_10px_30px_-12px_rgba(16,24,40,0.25)]"
      >
        <iframe
          title="Peta bengkel — klik untuk buka Google Maps"
          src={mapsEmbedUrl(s.address)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="pointer-events-none h-[300px] w-full sm:h-[360px]"
        />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-[#E8722A] px-4 py-2 text-sm font-bold text-white shadow-lg transition group-hover:scale-[1.03]">
          <MapPin size={16} /> {s.address} — Klik untuk Maps
        </span>
      </a>

      <div className="card-luxe mt-4 grid gap-2 p-5 text-sm">
        <p><b>Alamat:</b> <a href={mapsSearchUrl(s.address)} target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">{s.address} →</a></p>
        <p><b>WhatsApp:</b> {s.phone}</p>
        <p><b>Email:</b> {s.email}</p>
        <div><b>Jam operasional:</b><ul className="mt-1">{Object.entries(s.opening_hours).map(([d, h]) => <li key={d} className="flex justify-between border-b border-slate-100 py-1 last:border-0"><span>{d}</span><span>{h}</span></li>)}</ul></div>
      </div>
      <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
        <a className="btn-gold w-full sm:w-auto" target="_blank" rel="noreferrer" href={mapsDirectionUrl(s.address)}><Navigation size={16} /> Rute ke Bengkel</a>
        <a className="btn-outline w-full sm:w-auto" target="_blank" rel="noreferrer" href={s.maps_url || mapsSearchUrl(s.address)}><MapPin size={16} /> Buka di Google Maps</a>
        <a className="btn-wa w-full sm:w-auto" target="_blank" rel="noreferrer" href={waLink("Halo, saya ingin bertanya.", s.whatsapp)}>Chat WhatsApp</a>
      </div>
    </div>
  );
}
