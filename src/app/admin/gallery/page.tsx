"use client";
import { useEffect, useState } from "react";
import { seedGallery } from "@/data/seed";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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
  const [type, setType] = useState("AC");
  const [imageUrl, setImageUrl] = useState("");

  async function refresh() {
    const [api, local] = await Promise.all([
      fetchApi().catch(() => [] as GalleryItem[]),
      Promise.resolve(loadLocal()),
    ]);
    const ids = new Set<string>();
    const out: GalleryItem[] = [];
    for (const x of [...api, ...local, ...seedGallery]) {
      if (!ids.has(x.id)) { ids.add(x.id); out.push(x); }
    }
    setItems(out);
  }

  useEffect(() => { refresh(); }, []);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast.error("Maksimal 2MB untuk demo (production via Cloudinary)"); return; }
    const r = new FileReader();
    r.onload = () => setImageUrl(String(r.result));
    r.readAsDataURL(f);
  }

  async function add() {
    if (title.trim().length < 3) { toast.error("Judul minimal 3 karakter"); return; }
    if (!imageUrl) { toast.error("Isi URL gambar atau upload foto"); return; }
    const item: GalleryItem = {
      id: `demo-g-${Date.now()}`, title: title.trim(), vehicle: vehicle.trim() || null,
      image_url: imageUrl, type, published: true,
    };
    try {
      const r = await fetch("/api/demo", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "gallery", item }),
      });
      if (!r.ok) throw new Error();
      toast.success("Foto ditambahkan & langsung tampil di galeri.");
    } catch {
      try {
        const prev = loadLocal();
        prev.unshift(item);
        localStorage.setItem(LS, JSON.stringify(prev));
      } catch {}
      toast.success("Foto ditambahkan (tersimpan lokal).");
    }
    setTitle(""); setVehicle(""); setImageUrl("");
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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black tracking-tight text-slate-900">Galeri ({items.length})</h1>
      <p className="mt-0.5 text-sm text-slate-500">Yang ditambah di sini langsung tampil di halaman Galeri.</p>
      <div className="card-luxe mt-3 grid gap-2 p-4">
        <b className="text-sm">+ Tambah foto hasil pekerjaan</b>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="cth: Servis AC — Avanza" className="input" />
        <div className="grid grid-cols-2 gap-2">
          <input value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="Mobil (opsional)" className="input" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="input">
            {["AC", "Power Window", "Central Lock", "Audio", "Variasi", "Before After"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <input value={imageUrl.startsWith("data:") ? "" : imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL gambar (https://…)" className="input" />
        <label className="text-xs text-slate-500">atau upload dari HP: <input type="file" accept="image/*" onChange={onFile} className="mt-1 block text-xs" /></label>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="Preview" className="aspect-video w-full rounded-lg border border-border object-cover" />
        )}
        <button onClick={add} className="btn-gold !py-2 text-xs w-fit"><Plus size={15} /> Tambah & Tampilkan</button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
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
