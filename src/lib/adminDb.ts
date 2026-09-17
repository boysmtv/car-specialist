// Helper CRUD admin via Supabase (browser). Dipakai bila env Supabase terisi
// DAN admin login dengan akun Supabase. Bila tidak configured → return null
// dan pemanggil memakai fallback demo-file/localStorage.
import { createClient } from "@/lib/supabase/client";
import type { GalleryItem, Product, Service, SiteSettings } from "@/types";

export function cloudDb() {
  return createClient();
}

/** true bila dibuka di localhost (mode coba-coba). Di hosting (Vercel),
 *  simpan lokal TIDAK tampil publik — user wajib tahu. */
export function isLocalHost(): boolean {
  try {
    const h = window.location.hostname;
    return h === "localhost" || h === "127.0.0.1" || h.endsWith(".local");
  } catch {
    return true;
  }
}

function mustDb() {
  const sb = createClient();
  if (!sb) throw new Error("NO_CLOUD");
  return sb;
}

function fileName(folder: string, file: File): string {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const rand = Math.random().toString(36).slice(2, 10);
  return `${folder}/${Date.now()}-${rand}.${ext}`;
}

export function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/** Upload foto ke Supabase Storage → URL publik. Throw bila gagal/tidak configured. */
export async function uploadImageFile(file: File, folder: string): Promise<string> {
  const sb = mustDb();
  const path = fileName(folder, file);
  const { error } = await sb.storage.from("images").upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = sb.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload ke Supabase Storage bila bisa; bila tidak configured → dataURL lokal.
 * Throw CLOUD_UPLOAD_FAIL bila Supabase ada tapi upload gagal (mis. belum
 * migrasi 0002 / login demo) — pemanggil harus menampilkan panduan.
 */
export async function fileToPublicUrl(file: File, folder: string): Promise<string> {
  try {
    return await uploadImageFile(file, folder);
  } catch {
    if (cloudDb()) throw new Error("CLOUD_UPLOAD_FAIL");
    return readAsDataURL(file);
  }
}

// ---------- Services ----------
export async function cloudListServices(): Promise<Service[]> {
  const sb = mustDb();
  const { data, error } = await sb.from("services").select("*").is("deleted_at", null).order("name");
  if (error) throw error;
  return (data ?? []) as Service[];
}

export async function cloudSaveService(s: Service, isEdit: boolean): Promise<void> {
  const sb = mustDb();
  const row = {
    id: s.id, name: s.name, slug: s.slug, icon: s.icon ?? null,
    short_description: s.short_description, description: s.description,
    symptoms: s.symptoms, diagnostics: s.diagnostics, process: s.process,
    duration_text: s.duration_text, price_mode: s.price_mode,
    active: s.active ?? true, featured: s.featured ?? false,
  };
  const { error } = isEdit ? await sb.from("services").update(row).eq("id", s.id) : await sb.from("services").insert(row);
  if (error) throw error;
}

export async function cloudDeleteService(id: string): Promise<void> {
  const sb = mustDb();
  const { error } = await sb.from("services").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Gallery ----------
export async function cloudListGallery(): Promise<GalleryItem[]> {
  const sb = mustDb();
  const { data, error } = await sb.from("gallery").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []) as GalleryItem[];
}

export async function cloudSaveGallery(g: GalleryItem): Promise<void> {
  const sb = mustDb();
  const { error } = await sb.from("gallery").insert({
    title: g.title, vehicle: g.vehicle, caption: g.caption ?? null,
    image_url: g.image_url, type: g.type, published: true, sort_order: 0,
  });
  if (error) throw error;
}

export async function cloudDeleteGallery(id: string): Promise<void> {
  const sb = mustDb();
  const { error } = await sb.from("gallery").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Products ----------
export async function cloudListProducts(): Promise<Product[]> {
  const sb = mustDb();
  const { data, error } = await sb.from("products").select("*, product_images(*), categories(slug,name)").is("deleted_at", null).order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return ((data ?? []) as unknown[]).map((r: unknown) => {
    const row = r as Record<string, unknown>;
    const cat = row.categories as { slug?: string; name?: string } | null;
    const imgs = (row.product_images as Array<Record<string, unknown>> | undefined) ?? [];
    return {
      ...(row as unknown as Record<string, unknown>),
      category_slug: cat?.slug, category_name: cat?.name,
      images: imgs.map((im) => ({ ...im })),
    } as unknown as Product;
  });
}

export async function cloudSaveProduct(
  p: {
    id?: string; category_id: string; name: string; slug: string; brand?: string | null;
    short_description?: string | null; description?: string | null; warranty_text?: string | null;
    price_mode: string; price?: number | null; price_min?: number | null; price_max?: number | null;
    availability: string; active?: boolean; featured?: boolean;
  },
  imageUrls: string[],
  isEdit: boolean,
): Promise<string> {
  const sb = mustDb();
  const id = p.id || crypto.randomUUID();
  const row = {
    id, category_id: p.category_id, name: p.name, slug: p.slug,
    brand: p.brand ?? null, short_description: p.short_description ?? null,
    description: p.description ?? null, warranty_text: p.warranty_text ?? null,
    price_mode: p.price_mode, price: p.price ?? null, price_min: p.price_min ?? null,
    price_max: p.price_max ?? null, availability: p.availability,
    active: p.active ?? true, featured: p.featured ?? false,
    publication_status: "PUBLISHED", published_at: new Date().toISOString(),
  };
  const { error } = isEdit
    ? await sb.from("products").update(row).eq("id", id)
    : await sb.from("products").insert(row);
  if (error) throw error;
  if (isEdit) {
    const { error: delErr } = await sb.from("product_images").delete().eq("product_id", id);
    if (delErr) throw delErr;
  }
  if (imageUrls.length > 0) {
    const { error: imgErr } = await sb.from("product_images").insert(
      imageUrls.map((url, i) => ({ product_id: id, url, alt_text: p.name, sort_order: i + 1, is_cover: i === 0 })),
    );
    if (imgErr) throw imgErr;
  }
  return id;
}

export async function cloudDeleteProduct(id: string): Promise<void> {
  const sb = mustDb();
  await sb.from("product_images").delete().eq("product_id", id);
  // soft delete agar konsisten dengan skema
  const { error } = await sb.from("products").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

// ---------- Settings ----------
export async function cloudGetSettings(): Promise<Partial<SiteSettings> | null> {
  const sb = mustDb();
  const { data } = await sb.from("site_settings").select("*").limit(1).single();
  return (data as Partial<SiteSettings>) ?? null;
}

export async function cloudSaveSettings(patch: { whatsapp?: string; phone?: string; address?: string }): Promise<void> {
  const sb = mustDb();
  const { data } = await sb.from("site_settings").select("id").limit(1).single();
  if (!data) {
    const { error } = await sb.from("site_settings").insert({
      business_name: "Specialist AC Mobil & Variasi", ...patch,
    });
    if (error) throw error;
    return;
  }
  const { error } = await sb.from("site_settings").update(patch).eq("id", (data as { id: string }).id);
  if (error) throw error;
}
