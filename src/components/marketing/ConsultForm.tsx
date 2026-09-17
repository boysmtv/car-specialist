"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultSchema } from "@/lib/validations";
import { z } from "zod";
import { consultWaMessage, waLink } from "@/lib/whatsapp";
import { Building2, House, MessageCircle } from "lucide-react";

type Form = z.infer<typeof consultSchema>;

// Form super simple: isi → langsung dibuka sebagai chat WhatsApp.
// Tidak ada data tersimpan, tidak ada kode booking.
export default function ConsultForm({
  services,
  wa,
  initialType,
  initialServiceId,
}: {
  services: { id: string; name: string }[];
  wa: string;
  initialType?: "WORKSHOP" | "HOME_SERVICE";
  initialServiceId?: string;
}) {
  const [sent, setSent] = useState<string | null>(null);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(consultSchema),
    defaultValues: { service_type: initialType ?? "WORKSHOP", service_id: initialServiceId ?? "" },
  });
  const isHome = watch("service_type") === "HOME_SERVICE";

  function onSubmit(v: Form) {
    const svc = services.find((s) => s.id === v.service_id)?.name ?? "-";
    const msg = consultWaMessage({
      customer_name: v.customer_name, service_type: v.service_type, home_address: v.home_address,
      vehicle: v.vehicle, service_name: svc, complaint: v.complaint,
    });
    const url = waLink(msg, wa);
    setSent(url);
    window.open(url, "_blank", "noopener");
  }

  if (sent) {
    return (
      <div className="card grid gap-2 p-6 text-center sm:p-8">
        <h2 className="text-xl font-extrabold sm:text-2xl">Siap dikirim ke WhatsApp ✅</h2>
        <p className="text-sm text-slate-600">Chat WhatsApp sudah dibuka dengan pesanmu. Kalau belum terbuka, tekan tombol di bawah.</p>
        <div className="mt-2 flex flex-col justify-center gap-2 sm:flex-row">
          <a href={sent} target="_blank" rel="noreferrer" className="btn-wa w-full sm:w-auto"><MessageCircle size={17} /> Buka WhatsApp</a>
          <button onClick={() => { setSent(null); reset(); }} className="btn-outline w-full sm:w-auto">Isi lagi</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card grid gap-4 p-4 sm:p-5">
      <div>
        <span className="label">Mau servis di mana?</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition ${!isHome ? "border-primary bg-orange-50" : "border-border bg-white"}`}>
            <input type="radio" value="WORKSHOP" {...register("service_type")} className="h-4 w-4 accent-[#C2571B]" />
            <Building2 size={20} className="shrink-0 text-primary" />
            <span><b className="block text-sm">Datang ke bengkel</b><i className="block text-xs not-italic text-slate-500">Cikarang Barat</i></span>
          </label>
          <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition ${isHome ? "border-gold bg-gold/10" : "border-border bg-white"}`}>
            <input type="radio" value="HOME_SERVICE" {...register("service_type")} className="h-4 w-4 accent-[#C2571B]" />
            <House size={20} className="shrink-0 text-gold-dark" />
            <span><b className="block text-sm">Home service 🏠</b><i className="block text-xs not-italic text-slate-500">Teknisi ke rumah</i></span>
          </label>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label">Nama*</label><input className="input" autoComplete="name" placeholder="Nama kamu" {...register("customer_name")} />{errors.customer_name && <p className="text-xs text-red-600">{errors.customer_name.message}</p>}</div>
        <div><label className="label">Jenis mobil*</label><input className="input" placeholder="cth: Honda BR-V 2019" {...register("vehicle")} />{errors.vehicle && <p className="text-xs text-red-600">{errors.vehicle.message}</p>}</div>
      </div>
      <div><label className="label">Layanan (opsional)</label>
        <select className="input" {...register("service_id")}>
          <option value="">— Belum tahu / konsultasi dulu —</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      {isHome && (
        <div><label className="label">Alamat home service*</label><textarea rows={2} className="input" placeholder="cth: Jl. Mawar No.10, Telaga Asih, Cikarang Barat" {...register("home_address")} />{errors.home_address && <p className="text-xs text-red-600">{errors.home_address.message}</p>}</div>
      )}
      <div><label className="label">Keluhan*</label><textarea rows={4} className="input" placeholder="cth: AC tidak dingin, bunyi berisik saat dinyalakan…" {...register("complaint")} />{errors.complaint && <p className="text-xs text-red-600">{errors.complaint.message}</p>}</div>
      <button className="btn-wa w-full"><MessageCircle size={17} /> Kirim ke WhatsApp</button>
    </form>
  );
}
