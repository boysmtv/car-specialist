import { seedSettings } from "@/data/seed";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Category, Faq, GalleryItem, Product, Service, SiteSettings } from "@/types";

// PRODUCTION: baca SELALU dari Supabase. Tanpa hasil = kosong.
// Tidak ada lagi fallback mock/demo/file lokal.

// Nilai jsonb array dari DB bisa datang sebagai array, string JSON, null,
// atau bentuk lain (input manual / admin lama). Normalisasi agar selalu array.
function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string") {
    try {
      const parsed: unknown = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === "string");
    } catch {
      return v ? [v] : [];
    }
    return v ? [v] : [];
  }
  return [];
}

// Kolom numeric Postgres bisa datang sebagai string via PostgREST.
// Koersi agar aman dipakai untuk sortir & format Rupiah.
function toNumberOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}
async function trySupabase<T>(fn: (sb: NonNullable<ReturnType<typeof createServerSupabase>>) => Promise<T>, fallback: T): Promise<T> {
  try {
    const sb = createServerSupabase();
    if (!sb) return fallback;
    return await fn(sb);
  } catch {
    return fallback;
  }
}

export async function getCategories(): Promise<Category[]> {
  return trySupabase(async (sb) => {
    const { data } = await sb.from("categories").select("*").eq("active", true).order("sort_order");
    return (data ?? []) as Category[];
  }, []);
}

export async function getServices(): Promise<Service[]> {
  const base = await trySupabase(async (sb) => {
    const { data } = await sb.from("services").select("*").eq("active", true).order("name");
    if (!data || data.length === 0) return [] as Service[];
    return (data as Service[]).map((s) => ({
      ...s,
      symptoms: toStringArray(s.symptoms),
      diagnostics: toStringArray(s.diagnostics),
      process: toStringArray(s.process),
    }));
  }, []);
  return base;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const all = await getServices();
  return all.find((s) => s.slug === slug) ?? null;
}

export interface ProductQuery {
  q?: string;
  category?: string;
  brand?: string;
  availability?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}

export async function getProducts(query: ProductQuery = {}): Promise<{ items: Product[]; total: number }> {
  const { q, category, brand, availability, sort = "newest", page = 1, perPage = 24 } = query;
  // Coba Supabase bila configured.
  // Pakai LEFT join ke categories (tanpa !inner) agar produk tanpa kategori
  // tetap tampil, bukan hilang / menyebabkan 404 misterius.
  const fromDb = await trySupabase<Product[] | null>(async (sb) => {
    let req = sb.from("products").select("*, product_images(*), categories(slug,name)");
    req = req.eq("active", true).is("deleted_at", null);
    const { data, error } = await req.limit(200);
    if (error || !data || data.length === 0) return null;
    return (data as unknown[]).map((r: unknown) => {
      const row = r as Record<string, unknown>;
      const cat = row.categories as { slug?: string; name?: string } | null;
      const rawImgs = row.product_images as Array<Record<string, unknown>> | Record<string, unknown> | null | undefined;
      const imgs = Array.isArray(rawImgs) ? rawImgs : rawImgs ? [rawImgs] : [];
      // specifications jsonb bisa null / string / array dari input manual —
      // normalisasi ke object atau null agar Object.entries di detail aman.
      let specs: Record<string, string> | null = null;
      const rawSpecs = row.specifications as unknown;
      if (rawSpecs && typeof rawSpecs === "object" && !Array.isArray(rawSpecs)) {
        specs = rawSpecs as Record<string, string>;
      } else if (typeof rawSpecs === "string" && rawSpecs.trim()) {
        try {
          const parsed: unknown = JSON.parse(rawSpecs);
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) specs = parsed as Record<string, string>;
        } catch {
          specs = null;
        }
      }
      return {
        ...(row as unknown as Record<string, unknown>),
        category_slug: cat?.slug ?? null,
        category_name: cat?.name ?? null,
        images: imgs.map((im) => ({ ...im })),
        specifications: specs,
        price: toNumberOrNull(row.price),
        price_min: toNumberOrNull(row.price_min),
        price_max: toNumberOrNull(row.price_max),
        installation_price: toNumberOrNull(row.installation_price),
      } as unknown as Product;
    });
  }, null);

  let items = fromDb ?? [];

  if (q) {
    const s = q.toLowerCase();
    items = items.filter((x) =>
      [x.name, x.brand, x.sku, x.part_number, x.category_name].filter(Boolean).join(" ").toLowerCase().includes(s),
    );
  }
  if (category) items = items.filter((x) => x.category_slug === category);
  if (brand) items = items.filter((x) => x.brand === brand);
  if (availability) items = items.filter((x) => x.availability === availability);

  switch (sort) {
    case "name-asc": items.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "")); break;
    case "name-desc": items.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? "")); break;
    case "price-asc": items.sort((a, b) => (a.price ?? a.price_min ?? 0) - (b.price ?? b.price_min ?? 0)); break;
    case "price-desc": items.sort((a, b) => (b.price ?? b.price_min ?? 0) - (a.price ?? a.price_min ?? 0)); break;
    default: break;
  }

  const total = items.length;
  const start = (page - 1) * perPage;
  return { items: items.slice(start, start + perPage), total };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { items } = await getProducts({ perPage: 500 });
  return items.find((x) => x.slug === slug) ?? null;
}

export async function getRelatedProducts(p: Product, limit = 4): Promise<Product[]> {
  const { items } = await getProducts({ perPage: 500 });
  const scored = items
    .filter((x) => x.slug !== p.slug)
    .map((x) => ({
      x,
      score: (x.category_id === p.category_id ? 3 : 0) + (x.brand && x.brand === p.brand ? 2 : 0) + (x.featured ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.x);
}

export async function getGallery(): Promise<GalleryItem[]> {
  return trySupabase(async (sb) => {
    const { data } = await sb.from("gallery").select("*").eq("published", true).order("sort_order");
    return (data ?? []) as GalleryItem[];
  }, []);
}

export async function getFaqs(): Promise<Faq[]> {
  return trySupabase(async (sb) => {
    const { data } = await sb.from("faq").select("*").eq("active", true).order("sort_order");
    return (data ?? []) as Faq[];
  }, []);
}

export async function getSettings(): Promise<SiteSettings> {
  return trySupabase(async (sb) => {
    const { data } = await sb.from("site_settings").select("*").limit(1).single();
    if (!data) return seedSettings;
    return {
      ...seedSettings,
      ...(data as Partial<SiteSettings>),
      opening_hours: (data as { opening_hours?: Record<string, string> }).opening_hours ?? seedSettings.opening_hours,
      social_links: (data as { social_links?: Record<string, string> }).social_links ?? seedSettings.social_links,
    };
  }, seedSettings);
}

export async function getBrands(): Promise<string[]> {
  const { items } = await getProducts({ perPage: 500 });
  return Array.from(new Set(items.map((x) => x.brand).filter(Boolean) as string[]));
}
