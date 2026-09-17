import { MapPin, Navigation, Clock, Phone } from "lucide-react";
import { mapsDirectionUrl, mapsEmbedUrl, mapsSearchUrl, SHOP_COORDS } from "@/lib/maps";
import type { SiteSettings } from "@/types";
import CopyCoords from "./CopyCoords";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_ID: Record<string, string> = {
  Monday: "Senin", Tuesday: "Selasa", Wednesday: "Rabu", Thursday: "Kamis",
  Friday: "Jumat", Saturday: "Sabtu", Sunday: "Minggu",
};

// Section lokasi: peta embed yang BISA DIKLIK langsung ke Google Maps,
// alamat lengkap + koordinat + jam operasional seminggu.
export default function LocationSection({ settings }: { settings: SiteSettings }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return (
    <section className="container-x py-10 sm:py-12">
      <div className="card-luxe overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* MAP — klik di mana saja untuk buka Google Maps */}
          <a
            href={mapsSearchUrl(settings.address)}
            target="_blank"
            rel="noreferrer"
            title="Klik untuk buka di Google Maps"
            className="group relative block min-h-[240px] sm:min-h-[320px] lg:min-h-[420px]"
          >
            <iframe
              title={`Peta ${settings.business_name}`}
              src={mapsEmbedUrl(settings.address)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="pointer-events-none absolute inset-0 h-full w-full"
            />
            <span className="absolute bottom-3 left-3 right-3 inline-flex items-center justify-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition group-hover:scale-[1.02] sm:right-auto">
              <MapPin size={16} className="text-primary" /> Klik untuk buka di Google Maps
            </span>
          </a>
          {/* INFO */}
          <div className="grid content-start gap-4 p-5 sm:p-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Kunjungi Bengkel</p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Mampir, cek langsung, biar yakin.
              </h2>
            </div>
            <ul className="grid gap-3 text-sm">
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
                <span className="min-w-0">
                  <b className="block leading-snug">{settings.address}</b>
                  <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                    <span className="font-mono">{SHOP_COORDS.lat}, {SHOP_COORDS.lng}</span>
                    <CopyCoords />
                  </span>
                  <a href={mapsSearchUrl(settings.address)} target="_blank" rel="noreferrer" className="mt-0.5 inline-block font-semibold text-primary underline-offset-4 hover:underline">
                    Lihat di Google Maps →
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <b className="block">Jam operasional</b>
                  <ul className="mt-1.5 overflow-hidden rounded-xl border border-orange-100 text-[13px]">
                    {DAYS.map((d) => (
                      <li key={d} className={`flex justify-between gap-2 px-3 py-1.5 ${d === today ? "bg-orange-100 font-bold text-orange-900" : "odd:bg-orange-50/60"}`}>
                        <span>{DAY_ID[d]}{d === today ? " • hari ini" : ""}</span>
                        <span>{settings.opening_hours[d] ?? "-"}</span>
                      </li>
                    ))}
                  </ul>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-primary" />
                <span>{settings.phone}</span>
              </li>
            </ul>
            <div className="grid gap-2 sm:flex sm:flex-wrap">
              <a href={mapsDirectionUrl(settings.address)} target="_blank" rel="noreferrer" className="btn-gold w-full sm:w-auto">
                <Navigation size={16} /> Rute ke Bengkel
              </a>
              <a href={mapsSearchUrl(settings.address)} target="_blank" rel="noreferrer" className="btn-outline w-full sm:w-auto">
                <MapPin size={16} /> Buka di Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
