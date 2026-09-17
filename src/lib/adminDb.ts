// Helper CRUD admin via Supabase (browser). WAJIB: env Supabase terisi +
// login akun Supabase. Tidak ada fallback lokal — gagal = error jelas.
import { createClient } from "@/lib/supabase/client";
import type { Category, GalleryItem, Product, Service, SiteSettings } from "@/types";

export function cloudDb() {
  return createClient();
}

/** Minta server refresh cache halaman publik agar data baru langsung tampil. */
export function refreshPublic(paths: string[]): void {
  try {
    fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    }).catch(() => {});
  } catch {}
}

function mustDb() {
  const sb = createClient();
  if (!sb) throw new Error("NO_CLOUD");
  return sb;
}

export async function cloudListCategories(): Promise<Category[]> {
  const sb = mustDb();
  const { data, error } = await sb.from("categories").select("*").eq("active", true).order("sort_order");
  if (error) throw error;
  return (data ?? []) as Category[];
}

function fileName(folder: string, file: File): string {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const rand = Math.random().toString(36).slice(2, 10);
  return `${folder}/${Date.now()}-${rand}.${ext}`;
}

/** Upload foto ke Supabase Storage → URL publik. Throw bila gagal. */
export async function uploadImageFile(file: File, folder: string): Promise<string> {
  const sb = mustDb();
  const path = fileName(folder, file);
  const { error } = await sb.storage.from("images").upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = sb.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}

/** Upload foto (max 2MB). Throw dengan pesan panduan bila gagal. */
export async function fileToPublicUrl(file: File, folder: string): Promise<string> {
  if (file.size > 2 * 1024 * 1024) throw new Error("Foto maksimal 2MB.");
  try {
    return await uploadImageFile(file, folder);
  } catch {
    throw new Error("Upload gagal. Pastikan migrasi 0001+0002 sudah dijalankan & login akun Supabase.");
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
