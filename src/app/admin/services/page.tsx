"use client";
import { useEffect, useState } from "react";
import { seedServices } from "@/data/seed";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { Service } from "@/types";

const LS = "demo_services";

async function fetchApi(): Promise<Service[]> {
  const r = await fetch("/api/demo?entity=services", { cache: "no-store" });
  const j = await r.json();
  return j.success ? (j.data as Service[]) : [];
}

function loadLocal(): Service[] {
  try { return JSON.parse(localStorage.getItem(LS) || "[]"); } catch { return []; }
}

function merged(api: Service[], local: Service[]): Service[] {
  const ids = new Set<string>();
  const out: Service[] = [];
  for (const x of [...api, ...local, ...seedServices]) {
    if (!ids.has(x.id)) { ids.add(x.id); out.push(x); }
  }
  return out;
}

export default function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [name, setName] = useState("");
  const [short, setShort] = useState("");

  async function refresh() {
    const [api, local] = await Promise.all([
      fetchApi().catch(() => [] as Service[]),
      Promise.resolve(loadLocal()),
    ]);
    setItems(merged(api, local));
  }

  useEffect(() => { refresh(); }, []);

  async function add() {
    if (name.trim().length < 3) { toast.error("Nama layanan minimal 3 karakter"); return; }
    if (short.trim().length < 10) { toast.error("Deskripsi singkat minimal 10 karakter"); return; }
    const slug = slugify(name);
    if (items.some((s) => s.slug === slug)) { toast.error("Layanan dengan nama itu sudah ada"); return; }
    const item: Service = {
      id: `demo-svc-${Date.now()}`, name: name.trim(), slug,
      short_description: short.trim(), description: short.trim(),
      symptoms: [], diagnostics: [],
      process: ["Konsultasi via WhatsApp", "Pemeriksaan", "Estimasi", "Pengerjaan"],
      price_mode: "CONTACT", featured: false, active: true,
    };
    try {
      const r = await fetch("/api/demo", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "services", item }),
      });
      if (!r.ok) throw new Error();
      toast.success("Layanan ditambahkan & langsung tampil di website.");
    } catch {
      try {
        const prev = loadLocal();
        prev.unshift(item);
        localStorage.setItem(LS, JSON.stringify(prev));
      } catch {}
      toast.success("Layanan ditambahkan (tersimpan lokal).");
    }
    setName(""); setShort("");
    refresh();
  }

  async function remove(id: string) {
    const target = items.find((x) => x.id === id);
    if (!target || !id.startsWith("demo-")) { toast("Layanan bawaan hanya bisa diubah di database production."); return; }
    if (!confirm(`Hapus "${target.name}"?`)) return;
    try {
      await fetch("/api/demo", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "services", id }),
      });
    } catch {}
    try {
      localStorage.setItem(LS, JSON.stringify(loadLocal().filter((x) => x.id !== id)));
    } catch {}
    toast.success("Layanan dihapus.");
    refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black tracking-tight text-slate-900">Layanan ({items.length})</h1>
      <p className="mt-0.5 text-sm text-slate-500">Yang ditambah di sini langsung tampil di halaman Layanan.</p>
      <div className="card-luxe mt-3 grid gap-2 p-4">
        <b className="text-sm">+ Tambah layanan</b>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth: Cuci Evaporator" className="input" />
        <textarea value={short} onChange={(e) => setShort(e.target.value)} rows={2} placeholder="Deskripsi singkat untuk pelanggan…" className="input" />
        <button onClick={add} className="btn-gold !py-2 text-xs w-fit"><Plus size={15} /> Tambah & Tampilkan</button>
      </div>
      <div className="mt-3 grid gap-2">
        {items.map((s) => (
          <div key={s.id} className="card-luxe flex flex-wrap items-center justify-between gap-2 p-4">
            <div className="min-w-0"><b className="block truncate">{s.name}</b><p className="text-xs text-slate-500">/layanan/{s.slug}</p></div>
            <div className="flex items-center gap-2">
              {!s.id.startsWith("demo-")
                ? <span className="badge bg-slate-100 text-slate-500">Bawaan</span>
                : <button onClick={() => remove(s.id)} title="Hapus" className="grid h-8 w-8 place-items-center rounded-lg border border-border text-slate-500 transition hover:border-red-300 hover:text-red-600"><Trash2 size={15} /></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
