"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/lib/validations";
import { z } from "zod";
import { seedCategories } from "@/data/seed";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

type F = z.infer<typeof productSchema>;

export default function NewProduct() {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<F>({ resolver: zodResolver(productSchema), defaultValues: { price_mode: "START_FROM", availability: "AVAILABLE", featured: false, active: true } });
  const name = watch("name");

  function onSubmit(v: F) {
    const finalSlug = v.slug || slugify(v.name);
    const { slug: _omit, ...rest } = v;
    const item = {
      id: `demo-${Date.now()}`, slug: finalSlug,
      category_name: seedCategories.find((c) => c.id === v.category_id)?.name,
      images: [{ id: "c1", product_id: "x", url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=70", sort_order: 1, is_cover: true }],
      ...rest,
    };
    try {
      const prev = JSON.parse(localStorage.getItem("demo_products") || "[]");
      prev.unshift(item);
      localStorage.setItem("demo_products", JSON.stringify(prev));
    } catch {}
    toast.success("Produk berhasil disimpan.");
    router.push("/admin/products");
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="text-xs font-semibold text-primary hover:underline">← Kembali ke produk</Link>
      <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Tambah Produk</h1>
      <p className="mt-0.5 text-sm text-slate-500">Lengkapi data di bawah, lalu Publish agar tampil di katalog.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="card mt-3 grid gap-3 p-5">
        <div><label className="label">Nama*</label><input className="input" {...register("name")} onChange={(e) => { setValue("name", e.target.value); if (!watch("slug")) setValue("slug", slugify(e.target.value)); }} />{errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">Slug*</label><input className="input" {...register("slug")} placeholder={slugify(name || "nama-produk")} /></div>
          <div><label className="label">Brand</label><input className="input" {...register("brand")} /></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">Kategori*</label><select className="input" {...register("category_id")}>{seedCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div><label className="label">Availability*</label><select className="input" {...register("availability")}><option value="AVAILABLE">Tersedia</option><option value="LOW_STOCK">Stok Terbatas</option><option value="PREORDER">Pre-order</option><option value="OUT_OF_STOCK">Habis</option><option value="CONTACT">Tanya Stok</option></select></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">Price mode*</label><select className="input" {...register("price_mode")}><option value="FIXED">FIXED</option><option value="START_FROM">START_FROM</option><option value="RANGE">RANGE</option><option value="CONTACT">CONTACT</option></select></div>
          <div><label className="label">Harga / mulai</label><input type="number" className="input" {...register("price")} /></div>
        </div>
        <div><label className="label">Deskripsi</label><textarea className="input" rows={3} {...register("description")} /></div>
        <button className="btn-primary">Publish</button>
      </form>
    </div>
  );
}
