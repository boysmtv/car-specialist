import type { Metadata } from "next";
import { getServices } from "@/lib/data";
import ServiceCard from "@/components/marketing/ServiceCard";

export const metadata: Metadata = { title: "Layanan", description: "Layanan Specialist AC Mobil: AC, power window, central lock, audio & variasi." };
export const revalidate = 300;

export default async function LayananPage() {
  const services = await getServices();
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Layanan</h1>
      <p className="mt-1 text-slate-600">Pilih layanan atau ceritakan keluhannya. Kami bantu arahkan pemeriksaan yang sesuai.</p>
      {services.length === 0 ? (
        <div className="card-luxe mt-6 p-10 text-center">
          <p className="font-bold">Layanan segera hadir.</p>
          <p className="mt-1 text-sm text-slate-500">Hubungi kami via WhatsApp untuk kebutuhan mobilmu.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => <ServiceCard key={s.id} s={s} />)}
        </div>
      )}
    </div>
  );
}
