import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { waLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Tentang", description: "Tentang Specialist AC Mobil & Variasi." };

export default async function TentangPage() {
  const s = await getSettings();
  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Tentang {s.business_name}</h1>
      <p className="mt-2 text-slate-600">{s.tagline}. Berlokasi di {s.address}. Fokus layanan: AC mobil, power window, central lock, power door, audio mobil, dan variasi.</p>
      <h2 className="mt-8 text-xl font-extrabold">Alur kerja</h2>
      <ol className="mt-2 list-decimal pl-5 text-sm text-slate-600">
        <li>Pemeriksaan terlebih dahulu</li><li>Estimasi sebelum pengerjaan</li><li>Persetujuan pelanggan</li><li>Pengerjaan & QC</li><li>Serah terima + dokumentasi</li>
      </ol>
      <div className="mt-6 flex flex-wrap gap-2">
        <a className="btn-wa" target="_blank" rel="noreferrer" href={waLink("Halo, saya ingin bertanya.", s.whatsapp)}>Konsultasi WhatsApp</a>
        <a className="btn-outline" target="_blank" rel="noreferrer" href={s.maps_url}>Buka di Google Maps</a>
      </div>
    </div>
  );
}
