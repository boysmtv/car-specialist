"use client";
import { useEffect, useState } from "react";
import { seedGallery } from "@/data/seed";
import { toast } from "sonner";
import type { GalleryItem } from "@/types";

const KEY = "demo_gallery";

function load(): GalleryItem[] {
  try {
    const extra = JSON.parse(localStorage.getItem(KEY) || "[]");
    return [...extra, ...seedGallery];
  } catch {
    return [...seedGallery];
  }
}

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [type, setType] = useState("AC");
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => { setItems(load()); }, []);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast.error("Maksimal 2MB untuk demo lokal (production via Cloudinary)"); return; }
    const r = new FileReader();
    r.onload = () => setImageUrl(String(r.result));
    r.readAsDataURL(f);
  }

  function add() {
    if (title.trim().length < 3) { toast.error("Judul minimal 3 karakter"); return; }
    if (!imageUrl) { toast.error("Isi URL gambar atau upload foto"); return; }
    const item: GalleryItem = {
      id: `demo-g-${Date.now()}`, title: title.trim(), vehicle: vehicle.trim() || null,
      image_url: imageUrl, type, published: true,
    };
    try {
      const prev = JSON.parse(localStorage.getItem(KEY) || "[]");
      prev.unshift(item);
      localStorage.setItem(KEY, JSON.stringify(prev));
    } catch {}
    setItems(load());
    setTitle(""); setVehicle(""); setImageUrl("");
    toast.success("Foto berhasil ditambahkan ke galeri.");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold">Galeri ({items.length})</h1>
      <div className="card mt-3 grid gap-2 p-4">
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
        <button onClick={add} className="btn-primary w-fit">Tambah ke galeri</button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((g) => (
          <div key={g.id} className="card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.image_url} alt={g.title} loading="lazy" className="aspect-square w-full object-cover" />
            <p className="truncate p-2 text-xs font-semibold">{g.title}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">Demo lokal tersimpan di browser. Di production, upload via Cloudinary ke tabel gallery.</p>
    </div>
  );
}
