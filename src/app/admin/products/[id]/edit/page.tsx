"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Star, Trash2, Upload } from "lucide-react";
import type { Category, Product } from "@/types";
import { cloudListCategories, cloudListProducts, cloudSaveProduct, fileToPublicUrl, refreshPublic } from "@/lib/adminDb";

interface Img { url: string; file?: File }
const ERR = "Gagal. Pastikan migrasi 0001+0002 sudah dijalankan & login akun Supabase.";

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<Product | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [availability, setAvailability] = useState("AVAILABLE");
  const [priceMode, setPriceMode] = useState("START_FROM");
  const [price, setPrice] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [desc, setDesc] = useState("");
  const [warranty, setWarranty] = useState("");
  const [images, setImages] = useState<Img[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [cats, prods] = await Promise.all([cloudListCategories(), cloudListProducts()]);
        setCategories(cats);
        const found = prods.find((x) => x.id === id) || prods.find((x) => x.slug === id);
        if (found) {
          setItem(found);
          setName(found.name); setBrand(found.brand || "");
          setCategoryId(found.category_id); setAvailability(found.availability);
          setPriceMode(found.price_mode === "RANGE" ? "START_FROM" : found.price_mode);
          setPrice(String(found.price ?? found.price_min ?? ""));
          setShortDesc(found.short_description || ""); setDesc(found.description || "");
          setWarranty(found.warranty_text || "");
          setImages((found.images || []).sort((a, b) => a.sort_order - b.sort_order).map((i) => ({ url: i.url })));
        }
      } catch {
        toast.error(ERR);
      } finally {
        setLoaded(true);
      }
    })();
  }, [id]);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 6 - images.length);
    for (const f of files) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > 2 * 1024 * 1024) { toast.error(`"${f.name}" > 2MB, dilewati`); continue; }
      setImages((s) => (s.length < 6 ? [...s, { url: URL.createObjectURL(f), file: f }] : s));
    }
    e.target.value = "";
  }

  async function save() {
    if (!item) return;
    if (name.trim().length < 3) { toast.error("Nama minimal 3 karakter"); return; }
    if (images.length === 0) { toast.error("Minimal 1 foto"); return; }
    if (!categoryId) { toast.error("Pilih kategori"); return; }
    const p = price ? Number(price) : undefined;
    if (priceMode === "FIXED" && !p) { toast.error("Harga wajib untuk mode FIXED"); return; }
    setSaving(true);
    let urls: string[];
    try {
      urls = await Promise.all(images.map((im) => (im.file ? fileToPublicUrl(im.file, "products") : im.url)));
    } catch (e) {
      toast.error((e as Error).message || ERR);
      setSaving(false);
      return;
    }
    try {
      await cloudSaveProduct(
        {
          id: item.id, category_id: categoryId, name: name.trim(), slug: item.slug,
          brand: brand.trim() || null, short_description: shortDesc.trim() || null,
          description: desc.trim() || null, warranty_text: warranty.trim() || null,
          price_mode: priceMode, price: priceMode === "FIXED" ? (p ?? null) : null,
          price_min: priceMode === "START_FROM" ? (p ?? null) : null,
          price_max: null, availability, active: true, featured: item.featured ?? false,
        },
        urls, true,
      );
      refreshPublic(["/", "/produk", `/produk/${item.slug}`]);
      toast.success("Perubahan disimpan & tampil di katalog.");
      router.push("/admin/products");
      return;
    } catch {
      toast.error(ERR);
    }
    setSaving(false);
  }

  if (!loaded) return <div className="py-16 text-center text-sm text-slate-500">Memuat produk…</div>;
  if (!item) return <div className="card-luxe mt-3 p-8 text-center"><b>Produk tidak ditemukan.</b><p className="mt-1 text-sm text-slate-500">Mungkin sudah dihapus.</p><Link href="/admin/products" className="mt-3 inline-block text-sm font-semibold text-primary">← Kembali ke produk</Link></div>;

  return (
    <div>
      <Link href="/admin/products" className="text-xs font-semibold text-primary hover:underline">← Kembali ke produk</Link>
      <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Edit Produk</h1>
      <div className="mt-3 grid items-start gap-4 lg:grid-cols-[1fr_320px]">
        <div className="card-luxe grid gap-3 p-4 sm:p-5">
          <div><label className="label">Nama*</label><input value={name} onChange={(e) => setName(e.target.value)} className="input" /></div>
          <div><label className="label">Brand</label><input value={brand} onChange={(e) => setBrand(e.target.value)} className="input" /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Kategori*</label><select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input">{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="label">Ketersediaan*</label><select value={availability} onChange={(e) => setAvailability(e.target.value)} className="input"><option value="AVAILABLE">Tersedia</option><option value="LOW_STOCK">Stok Terbatas</option><option value="PREORDER">Pre-order</option><option value="OUT_OF_STOCK">Habis</option><option value="CONTACT">Tanya Stok</option></select></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><label className="label">Mode harga*</label><select value={priceMode} onChange={(e) => setPriceMode(e.target.value)} className="input"><option value="FIXED">Harga pas</option><option value="START_FROM">Mulai dari</option><option value="CONTACT">Tanya via WA</option></select></div>
            <div className="sm:col-span-2"><label className="label">Harga (Rp)</label><input value={price} onChange={(e) => setPrice(e.target.value)} type="number" inputMode="numeric" className="input" /></div>
          </div>
          <div><label className="label">Deskripsi singkat</label><input value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className="input" /></div>
          <div><label className="label">Deskripsi lengkap</label><textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} className="input" /></div>
          <div><label className="label">Garansi</label><input value={warranty} onChange={(e) => setWarranty(e.target.value)} className="input" /></div>
        </div>
        <div className="card-luxe grid gap-2 p-4 lg:sticky lg:top-20">
          <b className="text-sm">Foto produk ({images.length}/6)</b>
          <div className="grid grid-cols-3 gap-2">
            {images.map((im, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.url} alt="" className={`aspect-square w-full rounded-lg border-2 object-cover ${i === 0 ? "border-primary" : "border-border"}`} />
                {i === 0 && <span className="badge absolute left-1 top-1 bg-primary text-white"><Star size={10} /> Cover</span>}
                <div className="absolute right-1 top-1 flex gap-1">
                  {i !== 0 && <button type="button" title="Jadikan cover" onClick={() => setImages((s) => [s[i], ...s.filter((_, j) => j !== i)])} className="grid h-6 w-6 place-items-center rounded-md bg-white/95 text-primary shadow"><Star size={12} /></button>}
                  <button type="button" title="Hapus" onClick={() => setImages((s) => s.filter((_, j) => j !== i))} className="grid h-6 w-6 place-items-center rounded-md bg-white/95 text-red-600 shadow"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
          <label className="btn-outline cursor-pointer justify-center !py-2 text-xs"><Upload size={14} /> Upload foto<input type="file" accept="image/*" multiple onChange={onFiles} className="hidden" /></label>
          <a href={`/produk/${item.slug}`} target="_blank" rel="noreferrer" className="btn-outline">Lihat di Katalog</a>
          <button onClick={save} disabled={saving} className="btn-gold">{saving ? "Menyimpan…" : "Simpan Perubahan"}</button>
        </div>
      </div>
    </div>
  );
}
