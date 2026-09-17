"use client";
import { useEffect, useState } from "react";
import { seedServices } from "@/data/seed";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import type { Service } from "@/types";

const KEY = "demo_services";

function load(): Service[] {
  try {
    const extra = JSON.parse(localStorage.getItem(KEY) || "[]");
    return [...extra, ...seedServices];
  } catch {
    return [...seedServices];
  }
}

export default function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [name, setName] = useState("");
  const [short, setShort] = useState("");
  useEffect(() => { setItems(load()); }, []);

  function add() {
    if (name.trim().length < 3) { toast.error("Nama layanan minimal 3 karakter"); return; }
    if (short.trim().length < 10) { toast.error("Deskripsi singkat minimal 10 karakter"); return; }
    const slug = slugify(name);
    if (items.some((s) => s.slug === slug)) { toast.error("Layanan dengan nama itu sudah ada"); return; }
    const item: Service = {
      id: `demo-svc-${Date.now()}`, name: name.trim(), slug,
      short_description: short.trim(),
      description: short.trim(), symptoms: [], diagnostics: [],
      process: ["Konsultasi via WhatsApp", "Pemeriksaan", "Estimasi", "Pengerjaan"],
      price_mode: "CONTACT", featured: false, active: true,
    };
    try {
      const prev = JSON.parse(localStorage.getItem(KEY) || "[]");
      prev.unshift(item);
      localStorage.setItem(KEY, JSON.stringify(prev));
    } catch {}
    setItems(load());
    setName(""); setShort("");
    toast.success("Layanan berhasil ditambahkan.");
  }

  function toggle(id: string) {
    setItems((s) => s.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
    try {
      const prev: Service[] = JSON.parse(localStorage.getItem(KEY) || "[]");
      const found = prev.find((x) => x.id === id);
      if (found) {
        found.active = !found.active;
        localStorage.setItem(KEY, JSON.stringify(prev));
      } else {
        toast("Layanan bawaan hanya bisa diubah di database production.");
      }
    } catch {}
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold">Layanan ({items.length})</h1>
      <div className="card mt-3 grid gap-2 p-4">
        <b className="text-sm">+ Tambah layanan</b>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth: Cuci Evaporator" className="input" />
        <textarea value={short} onChange={(e) => setShort(e.target.value)} rows={2} placeholder="Deskripsi singkat untuk pelanggan…" className="input" />
        <button onClick={add} className="btn-primary w-fit">Tambah</button>
      </div>
      <div className="mt-3 grid gap-2">
        {items.map((s) => (
          <div key={s.id} className="card flex flex-wrap items-center justify-between gap-2 p-4">
            <div className="min-w-0"><b className="block truncate">{s.name}</b><p className="text-xs text-slate-500">/{s.slug}</p></div>
            <div className="flex items-center gap-2">
              <span className={`badge ${s.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{s.active ? "Aktif" : "Nonaktif"}</span>
              {s.id.startsWith("demo-") && (
                <button onClick={() => toggle(s.id)} className="btn-outline !px-2 !py-1 !text-xs">Ubah status</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">Demo lokal tersimpan di browser. Di production (Supabase terhubung), data tersimpan permanen di tabel services.</p>
    </div>
  );
}
