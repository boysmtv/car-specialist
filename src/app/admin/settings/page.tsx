"use client";
import { useEffect, useState } from "react";
import { seedSettings } from "@/data/seed";
import { toast } from "sonner";
import { cloudDb, cloudGetSettings, cloudSaveSettings, isLocalHost } from "@/lib/adminDb";

export default function SettingsAdmin() {
  const [wa, setWa] = useState(seedSettings.whatsapp);
  const [addr, setAddr] = useState(seedSettings.address);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const c = await cloudGetSettings();
        if (c && (c.whatsapp || c.address)) {
          if (c.whatsapp) setWa(c.whatsapp as string);
          if (c.address) setAddr(c.address as string);
          return;
        }
      } catch {}
      try {
        const r = await fetch("/api/demo?entity=settings", { cache: "no-store" });
        const j = await r.json();
        if (j.success && j.data) {
          if (j.data.whatsapp) { setWa(j.data.whatsapp); return; }
          if (j.data.address) { setAddr(j.data.address); return; }
        }
      } catch {}
      setWa(localStorage.getItem("site_whatsapp") || seedSettings.whatsapp);
      setAddr(localStorage.getItem("site_address") || seedSettings.address);
    })();
  }, []);

  async function save() {
    const patch = {
      whatsapp: wa.trim(),
      phone: wa.trim().replace(/^62/, "0"),
      address: addr.trim(),
    };
    if (!patch.whatsapp || !patch.address) { toast.error("Nomor WA dan alamat wajib diisi"); return; }
    setSaving(true);
    if (cloudDb()) {
      try {
        await cloudSaveSettings(patch);
        toast.success("Tersimpan & tampil di semua halaman website.");
      } catch {
        toast.error("Gagal menyimpan. Pastikan login akun Supabase & migrasi 0002.");
      }
      setSaving(false);
      return;
    }
    try {
      const r = await fetch("/api/demo", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "settings", item: patch }),
      });
      if (!r.ok) throw new Error();
      toast.success("Tersimpan & langsung tampil di semua halaman website.");
    } catch {
      if (isLocalHost()) {
        toast.success("Tersimpan lokal (server tidak bisa ditulis).");
      } else {
        toast.warning("Hanya tersimpan di browser ini — TIDAK tampil publik. Jalankan migrasi 0001+0002 & login akun Supabase.", { duration: 7000 });
      }
    }
    try {
      localStorage.setItem("site_whatsapp", wa);
      localStorage.setItem("site_address", addr);
    } catch {}
    setSaving(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight text-slate-900">Pengaturan</h1>
      <p className="mt-0.5 text-sm text-slate-500">Nomor WhatsApp & alamat dipakai di navbar, produk, form, peta & footer.</p>
      <div className="card-luxe mt-3 grid max-w-2xl gap-3 p-4 sm:p-5">
        <div><label className="label">WhatsApp bengkel (format 62…)*</label><input className="input" inputMode="tel" value={wa} onChange={(e) => setWa(e.target.value)} /></div>
        <div><label className="label">Alamat bengkel*</label><textarea rows={2} className="input" value={addr} onChange={(e) => setAddr(e.target.value)} /></div>
        <div><label className="label">Jam operasional</label><p className="text-xs text-slate-500">Senin–Jumat 08:00–17:00, Sabtu 08:00–15:00, Minggu Tutup. (Ubah detail via tabel site_settings di Supabase.)</p></div>
        <button onClick={save} disabled={saving} className="btn-gold w-fit !py-2 text-xs">{saving ? "Menyimpan…" : "Simpan & Tampilkan"}</button>
      </div>
    </div>
  );
}
