import type { Metadata } from "next";
import Link from "next/link";
import { getBrands, getCategories, getProducts, getSettings } from "@/lib/data";
import ProductCard from "@/components/marketing/ProductCard";
import { waLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Produk", description: "Katalog produk Specialist AC Mobil: AC, power window, central lock, audio & variasi." };

export default async function ProdukPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const [cats, brands, settings] = await Promise.all([getCategories(), getBrands(), getSettings()]);
  const q = searchParams.q ?? "";
  const category = searchParams.category ?? "";
  const brand = searchParams.brand ?? "";
  const availability = searchParams.availability ?? "";
  const sort = searchParams.sort ?? "newest";
  const page = Number(searchParams.page ?? "1") || 1;
  const { items, total } = await getProducts({ q, category, brand, availability, sort, page, perPage: 24 });
  const pages = Math.max(1, Math.ceil(total / 24));
  const qs = (extra: Record<string, string>) => {
    const p = new URLSearchParams({ ...(q ? { q } : {}), ...(category ? { category } : {}), ...(brand ? { brand } : {}), ...(availability ? { availability } : {}), sort, ...extra });
    return `/produk?${p.toString()}`;
  };
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Produk</h1>
      <p className="mt-1 text-slate-600">Lihat katalog produk kami dan tanyakan kompatibilitasnya untuk mobilmu. ({total} produk)</p>
      <form method="get" className="card mt-4 grid gap-2 p-4 lg:grid-cols-[1fr_180px_180px_180px_160px]">
        <input name="q" defaultValue={q} placeholder="Cari nama, merek, SKU, part number…" className="input" />
        <select name="category" defaultValue={category} className="input">
          <option value="">Semua kategori</option>
          {cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <select name="brand" defaultValue={brand} className="input">
          <option value="">Semua merek</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select name="availability" defaultValue={availability} className="input">
          <option value="">Semua stok</option>
          <option value="AVAILABLE">Tersedia</option>
          <option value="LOW_STOCK">Stok Terbatas</option>
          <option value="PREORDER">Pre-order</option>
          <option value="OUT_OF_STOCK">Habis</option>
        </select>
        <button className="btn-primary">Cari</button>
      </form>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {[
          { k: "newest", l: "Terbaru" }, { k: "name-asc", l: "Nama A-Z" }, { k: "name-desc", l: "Nama Z-A" },
          { k: "price-asc", l: "Harga rendah" }, { k: "price-desc", l: "Harga tinggi" },
        ].map((s) => (
          <Link key={s.k} href={qs({ sort: s.k })} className={`rounded-full border px-3 py-1 font-semibold ${sort === s.k ? "border-primary bg-orange-50 text-primary" : "border-border bg-white"}`}>{s.l}</Link>
        ))}
      </div>
      {items.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <h2 className="font-bold">Produk yang kamu cari belum ditemukan.</h2>
          <p className="mt-1 text-sm text-slate-600">Hubungi kami dan beri tahu tipe mobil serta komponen yang dibutuhkan.</p>
          <a className="btn-wa mx-auto mt-4 w-fit" target="_blank" rel="noreferrer" href={waLink(`Halo, saya mencari produk: ${q || "-"}`, settings.whatsapp)}>Tanya WhatsApp</a>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} p={p} wa={settings.whatsapp} />)}
        </div>
      )}
      {pages > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link key={n} href={qs({ page: String(n) })} className={`btn-outline !px-3 !py-1.5 ${n === page ? "!border-primary !text-primary" : ""}`}>{n}</Link>
          ))}
        </div>
      )}
    </div>
  );
}
