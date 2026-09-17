"use client";
import { use } from "react";
import Link from "next/link";
export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold">Edit Produk {id}</h1>
      <div className="card mt-3 p-5 text-sm text-slate-600">
        <p>Demo MVP: edit penuh tersedia saat Supabase terhubung (kolom sesuai PRD §55). Untuk demo lokal, hapus lalu tambah ulang via <Link href="/admin/products/new" className="text-primary font-semibold">Add Product</Link>.</p>
        <p className="mt-2">Field production: name, slug, brand, category, SKU, part number, deskripsi, spesifikasi, price mode, availability, fitment, images (cover + gallery, reorder), SEO, featured/active, publish/unpublish.</p>
      </div>
    </div>
  );
}
