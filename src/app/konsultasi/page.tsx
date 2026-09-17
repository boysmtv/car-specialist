import type { Metadata } from "next";
import { getServices, getSettings } from "@/lib/data";
import ConsultForm from "@/components/marketing/ConsultForm";

export const metadata: Metadata = { title: "Konsultasi", description: "Isi form singkat — langsung terkirim sebagai chat WhatsApp ke Specialist AC Mobil Cikarang Barat." };

export default async function KonsultasiPage({ searchParams }: { searchParams: { type?: string; service?: string } }) {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  const initialType = searchParams.type === "HOME_SERVICE" ? "HOME_SERVICE" : undefined;
  const wanted = (searchParams.service || "").toLowerCase();
  const match = services.find((s) => s.id === searchParams.service || s.slug === wanted);
  const initialServiceId =
    match?.id ?? (initialType ? services.find((s) => s.slug === "home-service")?.id : undefined);
  return (
    <div className="container-x max-w-2xl py-8 sm:py-10">
      <p className="badge-gold">{initialType ? "🏠 Home Service — teknisi ke rumah" : "💬 Konsultasi gratis"}</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
        {initialType ? "Tanya home service" : "Ceritakan masalah mobilmu"}
      </h1>
      <p className="mt-1 text-sm text-slate-600 sm:text-base">
        Isi form singkat ini — pesanmu langsung terbuka di WhatsApp, tinggal tekan kirim. Tanpa antre, tanpa akun.
      </p>
      <div className="mt-5">
        <ConsultForm services={services} wa={settings.whatsapp} initialType={initialType} initialServiceId={initialServiceId} />
      </div>
    </div>
  );
}
