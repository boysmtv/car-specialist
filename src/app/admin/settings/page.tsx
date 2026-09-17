"use client";
import { useEffect, useState } from "react";
import { seedSettings } from "@/data/seed";
import { toast } from "sonner";

export default function SettingsAdmin() {
  const [wa, setWa] = useState(seedSettings.whatsapp);
  const [addr, setAddr] = useState(seedSettings.address);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/demo?entity=settings", { cache: "no-store" });
        const j = await r.json();
        if (j.success && j.data) {
          if (j.data.whatsapp) setWa(j.data.whatsapp);
          if (j.data.address) setAddr(j.data.address);
          return;
        }
      } catch {}
      setWa(localStorage.getItem("site_whatsapp") || seedSettings.whatsapp);
      setAddr(localStorage.getItem("site_address") || seedSettings.address);
    })();
  }, []);
  async function save() {
    try {
      const r = await fetch("/api/demo", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "settings", item: { whatsapp: wa.trim(), phone: wa.trim().replace(/^62/, "0"), address: addr.trim() } }),
      });
      if (!r.ok) throw new Error();
      toast.success("Tersimpan & langsung tampil di semua halaman website.");
    } catch {
      toast.success("Tersimpan lokal (server tidak bisa ditulis).");
    }
    try {
      localStorage.setItem("site_whatsapp", wa);
      localStorage.setItem("site_address", addr);
    } catch {}
  }
  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight text-slate-900">Pengaturan</h1>
      <p className="mt-0.5 text-sm text-slate-500">Nomor WhatsApp, alamat & jam tampil di seluruh website.</p>
      <div className="card-luxe mt-3 grid max-w-2xl gap-3 p-4 sm:p-5">
        <div><label className="label">WhatsApp (format 62…)</label><input className="input" value={wa} onChange={(e) => setWa(e.target.value)} /></div>
        <div><label className="label">Alamat</label><input className="input" value={addr} onChange={(e) => setAddr(e.target.value)} /></div>
        <div><label className="label">Jam operasional</label><p className="text-xs text-slate-500">Senin–Jumat 08:00–17:00, Sabtu 08:00–15:00, Minggu Tutup (edit di Supabase site_settings.opening_hours untuk production).</p></div>
        <button onClick={save} className="btn-primary">Simpan</button>
      </div>
    </div>
  );
}
