"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";
import type { GalleryItem } from "@/types";
import { cloudDeleteGallery, cloudListGallery, cloudSaveGallery, fileToPublicUrl, refreshPublic } from "@/lib/adminDb";

interface Pending { file: File; preview: string }
const ERR = "Gagal. Pastikan migrasi 0001+0002 sudah dijalankan & login akun Supabase.";

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [pending, setPending] = useState<Pending[]>([]);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    try {
      setItems(await cloudListGallery());
    } catch {
      toast.error(ERR);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > 2 * 1024 * 1024) { toast.error(`"${f.name}" > 2MB, dilewati`); continue; }
      setPending((s) => [...s, { file: f, preview: URL.createObjectURL(f) }]);
    }
    e.target.value = "";
  }

  async function add() {
    if (title.trim().length < 3) { toast.error("Judul minimal 3 karakter"); return; }
    if (pending.length === 0) { toast.error("Upload dulu fotonya"); return; }
    setSaving(true);
    try {
      for (let i = 0; i < pending.length; i++) {
        const p = pending[i];
        const url = await fileToPublicUrl(p.file, "gallery");
        await cloudSaveGallery({
          id: `g-${Date.now()}-${i}`,
          title: pending.length > 1 ? `${title.trim()} (${i + 1})` : title.trim(),
          vehicle: vehicle.trim() || null,
          image_url: url, type: "Umum", published: true,
        });
      }
      refreshPublic(["/", "/galeri"]);
      toast.success("Foto tersimpan & tampil di galeri.");
    } catch (e) {
      toast.error((e as Error).message || ERR);
      setSaving(false);
      return;
    }
    setSaving(false);
    setTitle(""); setVehicle(""); setPending([]);
    refresh();
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Hapus "${title}"?`)) return;
    try {
      await cloudDeleteGallery(id);
      refreshPublic(["/", "/galeri"]);
      toast.success("Foto dihapus.");
    } catch {
      toast.error(ERR);
      return;
    }
    refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight text-slate-900">Galeri ({items.length})</h1>
      <p className="mt-0.5 text-sm text-slate-500">Upload foto hasil pekerjaan — langsung tampil di halaman Galeri.</p>
      <div className="card-luxe mt-3 grid gap-3 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">Judul foto*</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="cth: Servis AC — Avanza" className="input" /></div>
          <div><label className="label">Mobil (opsional)</label><input value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="cth: Avanza" className="input" /></div>
        </div>
        <div>
          <span className="label">Foto* (bisa pilih banyak sekaligus)</span>
          <label className="grid cursor-pointer place-items-center gap-1 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/50 px-4 py-6 text-center transition hover:border-primary hover:bg-orange-50">
            <Upload size={22} className="text-primary" />
            <span className="text-sm font-semibold text-slate-700">Ketuk untuk upload foto</span>
            <span className="text-xs text-slate-500">JPG/PNG/WebP, maks 2MB per foto</span>
            <input type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
          </label>
        </div>
        {pending.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {pending.map((p, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt="" className="aspect-square w-full rounded-lg border border-border object-cover" />
                <button type="button" onClick={() => setPending((s) => s.filter((_, j) => j !== i))} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-md bg-white/95 text-red-600 shadow"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        )}
        <button onClick={add} disabled={saving} className="btn-gold w-fit !py-2 text-xs"><Plus size={15} /> {saving ? "Menyimpan…" : `Simpan ${pending.length > 0 ? `(${pending.length} foto)` : ""} & Tampilkan`}</button>
      </div>
      {loading ? (
        <p className="mt-3 text-sm text-slate-500">Memuat…</p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((g) => (
            <div key={g.id} className="card-luxe group relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.image_url} alt={g.title} loading="lazy" className="aspect-square w-full object-cover" />
              <p className="truncate p-2 text-xs font-semibold">{g.title}</p>
              <button onClick={() => remove(g.id, g.title)} title="Hapus" className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-lg bg-white/95 text-slate-500 shadow transition hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}
      {!loading && items.length === 0 && (
        <div className="card-luxe mt-3 p-8 text-center text-sm text-slate-500">Belum ada foto. Upload yang pertama di atas.</div>
      )}
    </div>
  );
}
