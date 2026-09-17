"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, PackageSearch } from "lucide-react";
import type { Product } from "@/types";
import { availabilityColor, availabilityLabel, priceLabel } from "@/lib/utils";

export default function ProductsAdmin() {
  const [items, setItems] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/demo?entity=products", { cache: "no-store" });
        const j = await r.json();
        const api: Product[] = j.success ? j.data : [];
        const extra: Product[] = JSON.parse(localStorage.getItem("demo_products") || "[]");
        const trash: string[] = JSON.parse(localStorage.getItem("demo_trash") || "[]");
        const ids = new Set<string>();
        const out: Product[] = [];
        for (const x of [...api, ...extra]) {
          if (!trash.includes(x.id) && !ids.has(x.id)) { ids.add(x.id); out.push(x); }
        }
        setItems(out);
      } catch {}
    })();
  }, []);
  const filtered = useMemo(() => items.filter((x) => (x.name + (x.brand || "")).toLowerCase().includes(q.toLowerCase())), [items, q]);

  function remove(id: string) {
    if (!confirm("Hapus produk ini? Produk akan disembunyikan dari website.")) return;
    try {
      const extra: Product[] = JSON.parse(localStorage.getItem("demo_products") || "[]");
      localStorage.setItem("demo_products", JSON.stringify(extra.filter((x) => x.id !== id)));
      const trash = JSON.parse(localStorage.getItem("demo_trash") || "[]");
      if (!trash.includes(id)) trash.push(id);
      localStorage.setItem("demo_trash", JSON.stringify(trash));
    } catch {}
    setItems((s) => s.filter((x) => x.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Produk</h1>
          <p className="mt-0.5 text-sm text-slate-500">{filtered.length} produk di katalog</p>
        </div>
        <Link href="/admin/products/new" className="btn-gold !py-2 text-xs"><Plus size={15} /> Tambah Produk</Link>
      </div>

      <div className="relative mt-4 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama / merek…" className="input !pl-9" />
      </div>

      <div className="card-luxe mt-3 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-orange-100 bg-orange-50/70 text-left text-[11px] font-bold uppercase tracking-wider text-orange-900">
                <th className="p-3">Produk</th><th className="p-3">Kategori</th><th className="p-3">Harga</th><th className="p-3">Stok</th><th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const cover = p.images.find((i) => i.is_cover) ?? p.images[0];
                return (
                  <tr key={p.id} className="border-b border-slate-100 transition last:border-0 hover:bg-orange-50/50">
                    <td className="p-3">
                      <span className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {cover && <img src={cover.url} alt="" className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover" />}
                        <span className="min-w-0">
                          <b className="block truncate text-slate-900">{p.name}</b>
                          <span className="block text-xs text-slate-500">{p.brand}</span>
                        </span>
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{p.category_name}</td>
                    <td className="whitespace-nowrap p-3 font-bold text-slate-900">{priceLabel(p)}</td>
                    <td className="p-3"><span className={`badge ${availabilityColor(p.availability)}`}>{availabilityLabel(p.availability)}</span></td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1.5">
                        <Link href={`/admin/products/${p.id}/edit`} title="Edit" className="grid h-8 w-8 place-items-center rounded-lg border border-border text-slate-500 transition hover:border-orange-300 hover:text-primary"><Pencil size={15} /></Link>
                        <button onClick={() => remove(p.id)} title="Hapus" className="grid h-8 w-8 place-items-center rounded-lg border border-border text-slate-500 transition hover:border-red-300 hover:text-red-600"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="card-luxe mt-3 grid place-items-center gap-2 p-10 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-primary"><PackageSearch size={22} /></span>
          <p className="font-bold text-slate-900">Belum ada produk.</p>
          <Link href="/admin/products/new" className="btn-gold !py-2 text-xs"><Plus size={15} /> Tambah Produk</Link>
        </div>
      )}
    </div>
  );
}
