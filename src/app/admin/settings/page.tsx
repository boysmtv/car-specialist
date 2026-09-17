"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cloudGetSettings, cloudSaveSettings, refreshPublic } from "@/lib/adminDb";

const ERR = "Gagal. Pastikan migrasi 0001+0002 sudah dijalankan & login akun Supabase.";

export default function SettingsAdmin() {
  const [wa, setWa] = useState("");
  const [addr, setAddr] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const c = await cloudGetSettings();
        if (c) {
          if (c.whatsapp) setWa(String(c.whatsapp));
          if (c.address) setAddr(String(c.address));
        }
      } catch {
        toast.error(ERR);
      } finally {
        setLoaded(true);
      }
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
    try {
      await cloudSaveSettings(patch);
      refreshPublic(["/", "/kontak"]);
      toast.success("Tersimpan & tampil di semua halaman website.");
    } catch {
      toast.error(ERR);
    }
    setSaving(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight text-slate-900">Pengaturan</h1>
      <p className="mt-0.5 text-sm text-slate-500">Nomor WhatsApp & alamat dipakai di navbar, produk, form, peta & footer.</p>
      {!loaded ? (
        <p className="mt-4 text-sm text-slate-500">Memuat…</p>
      ) : (
        <div className="card-luxe mt-3 grid max-w-2xl gap-3 p-4 sm:p-5">
          <div><label className="label">WhatsApp bengkel (format 62…)*</label><input className="input" inputMode="tel" value={wa} onChange={(e) => setWa(e.target.value)} /></div>
          <div><label className="label">Alamat bengkel*</label><textarea rows={2} className="input" value={addr} onChange={(e) => setAddr(e.target.value)} /></div>
          <div><label className="label">Jam operasional</label><p className="text-xs text-slate-500">Senin–Jumat 08:00–17:00, Sabtu 08:00–15:00, Minggu Tutup. (Ubah detail via tabel site_settings di Supabase.)</p></div>
          <button onClick={save} disabled={saving} className="btn-gold w-fit !py-2 text-xs">{saving ? "Menyimpan…" : "Simpan & Tampilkan"}</button>
        </div>
      )}
    </div>
  );
}
