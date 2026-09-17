"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";
import type { GalleryItem } from "@/types";
import { cloudDb, cloudDeleteGallery, cloudListGallery, cloudSaveGallery, fileToPublicUrl, isLocalHost, refreshPublic } from "@/lib/adminDb";

const LS = "demo_gallery";
const MAX_FILE = 2 * 1024 * 1024;

async function fetchDemo(): Promise<GalleryItem[]> {
  try {
    const r = await fetch("/api/demo?entity=gallery", { cache: "no-store" });
    const j = await r.json();
    return j.success ? (j.data as GalleryItem[]) : [];
  } catch { return []; }
}

function loadLocal(): GalleryItem[] {
  try { return JSON.parse(localStorage.getItem(LS) || "[]"); } catch { return []; }
}

interface Pending { file: File; preview: string }

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [cloud, setCloud] = useState(false);
  const [title, setTitle] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [pending, setPending] = useState<Pending[]>([]);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    try {
      const data = await cloudListGallery();
      setCloud(true);
      setItems(data);
      return;
    } catch {}
    setCloud(false);
    const [api, local] = await Promise.all([fetchDemo(), Promise.resolve(loadLocal())]);
    const ids = new Set<string>();
    const out: GalleryItem[] = [];
    for (const x of [...api, ...local]) {
      if (!ids.has(x.id)) { ids.add(x.id); out.push(x); }
    }
    setItems(out);
  }

  useEffect(() => { refresh(); }, []);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > MAX_FILE) { toast.error(`"${f.name}" > 2MB, dilewati`); continue; }
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
        let url: string;
        try {
          url = await fileToPublicUrl(p.file, "gallery");
        } catch (e) {
          if ((e as Error).message === "CLOUD_UPLOAD_FAIL") {
            throw new Error("Upload gagal. Pastikan migrasi 0002 sudah dijalankan & login akun Supabase.");
          }
          throw e;
        }
        const item: GalleryItem = {
          id: `demo-g-${Date.now()}-${i}`,
          title: pending.length > 1 ? `${title.trim()} (${i + 1})` : title.trim(),
          vehicle: vehicle.trim() || null,
          image_url: url, type: "Umum", published: true,
        };
        if (cloudDb()) {
          await cloudSaveGallery(item);
          refreshPublic(["/", "/galeri"]);
        } else {
          const res = await fetch("/api/demo", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ entity: "gallery", item }),
          });
          if (!res.ok) {
            const prev = loadLocal();
            prev.unshift(item);
            try { localStorage.setItem(LS, JSON.stringify(prev)); } catch {}
            if (!isLocalHost()) {
              throw new Error("Server tidak bisa menyimpan (Vercel). Jalankan migrasi 0001+0002 & login akun Supabase agar permanen.");
            }
          }
        }
      toast.success("Foto tersimpan & langsung tampil di galeri.");
    } catch (e) {
      toast.error((e as Error).message || "Gagal menyimpan.");
      setSaving(false);
      return;
    }
    setSaving(false);
    setTitle(""); setVehicle(""); setPending([]);
    refresh();
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Hapus "${title}"?`)) return;
    if (cloudDb()) {
      try {
        await cloudDeleteGallery(id);
        toast.success("Foto dihapus.");
      } catch {
        toast.error("Gagal menghapus. Pastikan login akun Supabase.");
        return;
      }
    } else {
      try {
        await fetch("/api/demo", {
          method: "DELETE", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entity: "gallery", id }),
        });
      } catch {}
      try {
        localStorage.setItem(LS, JSON.stringify(loadLocal().filter((x) => x.id !== id)));
      } catch {}
      toast.success("Foto dihapus.");
    }
    refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight text-slate-900">Galeri ({items.length})</h1>
      <p className="mt-0.5 text-sm text-slate-500">
        {cloud ? "Terhubung database — foto tersimpan permanen." : "Upload foto hasil pekerjaan — langsung tampil di halaman Galeri."}
      </p>
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
      {items.length === 0 && (
        <div className="card-luxe mt-3 p-8 text-center text-sm text-slate-500">Belum ada foto. Upload yang pertama di atas.</div>
      )}
    </div>
  );
}
