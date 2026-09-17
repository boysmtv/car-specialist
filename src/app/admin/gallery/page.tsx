"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";
import type { GalleryItem } from "@/types";

const LS = "demo_gallery";

async function fetchApi(): Promise<GalleryItem[]> {
  const r = await fetch("/api/demo?entity=gallery", { cache: "no-store" });
  const j = await r.json();
  return j.success ? (j.data as GalleryItem[]) : [];
}

function loadLocal(): GalleryItem[] {
  try { return JSON.parse(localStorage.getItem(LS) || "[]"); } catch { return []; }
}

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [pending, setPending] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const [api, local] = await Promise.all([
      fetchApi().catch(() => [] as GalleryItem[]),
      Promise.resolve(loadLocal()),
    ]);
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
      if (f.size > 2 * 1024 * 1024) { toast.error(`"${f.name}" > 2MB, dilewati`); continue; }
      const r = new FileReader();
      r.onload = () => setPending((s) => [...s, String(r.result)]);
      r.readAsDataURL(f);
    }
    e.target.value = "";
  }

  async function saveOne(url: string, idx: number, total: number): Promise<boolean> {
    const item: GalleryItem = {
      id: `demo-g-${Date.now()}-${idx}`,
      title: total > 1 ? `${title.trim()} (${idx + 1})` : title.trim(),
      vehicle: vehicle.trim() || null,
      image_url: url, type: "Umum", published: true,
    };
    try {
      const r = await fetch("/api/demo", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "gallery", item }),
      });
      if (!r.ok) throw new Error();
      return true;
    } catch {
      try {
        const prev = loadLocal();
        prev.unshift(item);
        localStorage.setItem(LS, JSON.stringify(prev));
      } catch {}
      return false;
    }
  }

  async function add() {
    if (title.trim().length < 3) { toast.error("Judul minimal 3 karakter"); return; }
    if (pending.length === 0) { toast.error("Upload dulu fotonya"); return; }
    setSaving(true);
    let serverOk = true;
    for (let i = 0; i < pending.length; i++) {
      const ok = await saveOne(pending[i], i, pending.length);
      if (!ok) serverOk = false;
    }
    setSaving(false);
    setTitle(""); setVehicle(""); setPending([]);
    toast.success(serverOk ? "Foto tersimpan & langsung tampil di galeri." : "Foto tersimpan lokal.");
    refresh();
  }

  async function remove(id: string, title: string) {
    if (!id.startsWith("demo-")) { toast("Foto bawaan hanya bisa diubah di database production."); return; }
    if (!confirm(`Hapus "${title}"?`)) return;
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
            {pending.map((url, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="aspect-square w-full rounded-lg border border-border object-cover" />
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
            {g.id.startsWith("demo-") && (
              <button onClick={() => remove(g.id, g.title)} title="Hapus" className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-lg bg-white/95 text-slate-500 shadow transition hover:text-red-600"><Trash2 size={14} /></button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
