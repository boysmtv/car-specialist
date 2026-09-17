"use client";
import { useEffect, useState } from "react";
import { seedSettings } from "@/data/seed";
import { toast } from "sonner";

export default function SettingsAdmin() {
  const [wa, setWa] = useState(seedSettings.whatsapp);
  const [addr, setAddr] = useState(seedSettings.address);
  useEffect(() => {
    setWa(localStorage.getItem("site_whatsapp") || seedSettings.whatsapp);
    setAddr(localStorage.getItem("site_address") || seedSettings.address);
  }, []);
  function save() {
    localStorage.setItem("site_whatsapp", wa);
    localStorage.setItem("site_address", addr);
    toast.success("Pengaturan disimpan (demo lokal). Di production tersimpan ke site_settings.");
  }
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-extrabold">Settings</h1>
      <div className="card mt-3 grid gap-3 p-5">
        <div><label className="label">WhatsApp (format 62…)</label><input className="input" value={wa} onChange={(e) => setWa(e.target.value)} /></div>
        <div><label className="label">Alamat</label><input className="input" value={addr} onChange={(e) => setAddr(e.target.value)} /></div>
        <div><label className="label">Jam operasional</label><p className="text-xs text-slate-500">Senin–Jumat 08:00–17:00, Sabtu 08:00–15:00, Minggu Tutup (edit di Supabase site_settings.opening_hours untuk production).</p></div>
        <button onClick={save} className="btn-primary">Simpan</button>
      </div>
    </div>
  );
}
