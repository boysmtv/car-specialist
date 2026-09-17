"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/lib/validations";
import { z } from "zod";
import { seedCategories } from "@/data/seed";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { Star, Trash2, Upload } from "lucide-react";
import { cloudDb, cloudSaveProduct, fileToPublicUrl } from "@/lib/adminDb";

type F = z.infer<typeof productSchema>;

interface Img { url: string; file?: File }

export default function NewProduct() {
  const router = useRouter();
  const [images, setImages] = useState<Img[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<F>({
    resolver: zodResolver(productSchema),
    defaultValues: { price_mode: "START_FROM", availability: "AVAILABLE", featured: false, active: true },
  });
  const priceMode = watch("price_mode");

  function addUrl() {
    if (!urlInput.trim() || images.length >= 6) return;
    setImages((s) => [...s, { url: urlInput.trim() }]);
    setUrlInput("");
  }

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 6 - images.length);
    for (const f of files) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > 2 * 1024 * 1024) { toast.error(`"${f.name}" > 2MB, dilewati`); continue; }
      setImages((s) => (s.length < 6 ? [...s, { url: URL.createObjectURL(f), file: f }] : s));
    }
    e.target.value = "";
  }

  async function resolveUrls(): Promise<string[] | null> {
    try {
      return await Promise.all(images.map((im) => (im.file ? fileToPublicUrl(im.file, "products") : im.url)));
    } catch (e) {
      if ((e as Error).message === "CLOUD_UPLOAD_FAIL") {
        toast.error("Upload gagal. Pastikan migrasi 0002 sudah dijalankan & login akun Supabase.");
      } else {
        toast.error("Gagal menyiapkan foto.");
      }
      return null;
    }
  }

  async function onSubmit(v: F) {
    if (images.length === 0) { toast.error("Upload minimal 1 foto cover sebelum Publish"); return; }
    if (v.price_mode === "FIXED" && !v.price) { toast.error("Harga wajib untuk mode FIXED"); return; }
    setSaving(true);
    const urls = await resolveUrls();
    if (!urls) { setSaving(false); return; }
    const finalSlug = v.slug || slugify(v.name);
    const { slug: _omit, active: _a, ...rest } = v;
    const price_min = v.price_mode === "START_FROM" ? (v.price ?? undefined) : undefined;
    const cat = seedCategories.find((c) => c.id === v.category_id);
    if (cloudDb()) {
      try {
        await cloudSaveProduct(
          {
            category_id: v.category_id, name: v.name, slug: finalSlug,
            brand: v.brand, short_description: v.short_description, description: v.description,
            warranty_text: v.warranty_text, price_mode: v.price_mode, price: v.price,
            price_min, price_max: undefined, availability: v.availability,
          },
          urls, false,
        );
        toast.success("Produk dipublish & tampil di katalog.");
        router.push("/admin/products");
        return;
      } catch {
        toast.error("Gagal menyimpan. Pastikan login akun Supabase & migrasi 0002.");
        setSaving(false);
        return;
      }
    }
    const pid = `demo-${Date.now()}`;
    const item = {
      id: pid, slug: finalSlug,
      category_name: cat?.name, category_slug: cat?.slug,
      images: urls.map((url, i) => ({ id: `${pid}-${i}`, product_id: pid, url, alt_text: v.name, sort_order: i + 1, is_cover: i === 0 })),
      active: true, publication_status: "PUBLISHED",
      ...rest,
      price_min,
    };
    try {
      const prev = JSON.parse(localStorage.getItem("demo_products") || "[]");
      prev.unshift(item);
      localStorage.setItem("demo_products", JSON.stringify(prev));
    } catch {}
    try {
      fetch("/api/demo", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "products", item }),
      }).catch(() => {});
    } catch {}
    toast.success("Produk berhasil dipublish & tampil di katalog.");
    router.push("/admin/products");
  }

  return (
    <div>
      <Link href="/admin/products" className="text-xs font-semibold text-primary hover:underline">← Kembali ke produk</Link>
      <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Tambah Produk</h1>
      <p className="mt-0.5 text-sm text-slate-500">Foto pertama = cover. Langsung tampil di katalog setelah Publish.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3 grid items-start gap-4 lg:grid-cols-[1fr_320px]">
        <div className="card-luxe grid gap-3 p-4 sm:p-5">
          <div><label className="label">Nama*</label><input className="input" {...register("name")} onChange={(e) => { setValue("name", e.target.value); setValue("slug", slugify(e.target.value)); }} />{errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Brand</label><input className="input" placeholder="cth: Denso" {...register("brand")} /></div>
            <div><label className="label">Kategori*</label><select className="input" {...register("category_id")}>{seedCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Ketersediaan*</label><select className="input" {...register("availability")}><option value="AVAILABLE">Tersedia</option><option value="LOW_STOCK">Stok Terbatas</option><option value="PREORDER">Pre-order</option><option value="OUT_OF_STOCK">Habis</option><option value="CONTACT">Tanya Stok</option></select></div>
            <div><label className="label">Mode harga*</label><select className="input" {...register("price_mode")}><option value="FIXED">Harga pas</option><option value="START_FROM">Mulai dari</option><option value="CONTACT">Tanya via WA</option></select></div>
          </div>
          <div><label className="label">Harga (Rp){priceMode === "START_FROM" ? " — sebagai \"mulai dari\"" : ""}</label><input type="number" inputMode="numeric" placeholder={priceMode === "CONTACT" ? "Tidak perlu diisi" : "cth: 350000"} className="input" {...register("price")} /></div>
          <div><label className="label">Deskripsi singkat</label><input className="input" placeholder="Satu baris untuk kartu produk" {...register("short_description")} /></div>
          <div><label className="label">Deskripsi lengkap</label><textarea className="input" rows={4} placeholder="Detail produk, kompatibilitas, info pemasangan…" {...register("description")} /></div>
          <div><label className="label">Garansi</label><input className="input" placeholder="cth: 3 bulan" {...register("warranty_text")} /></div>
        </div>

        <div className="card-luxe grid gap-2 p-4 lg:sticky lg:top-20">
          <b className="text-sm">Foto produk* ({images.length}/6)</b>
          {images.length === 0 && <p className="rounded-lg bg-orange-50 p-3 text-xs text-orange-800">Wajib ada minimal 1 foto cover.</p>}
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
          <button disabled={saving} className="btn-gold mt-1">{saving ? "Menyimpan…" : "Publish ke Katalog"}</button>
        </div>
      </form>
    </div>
  );
}
