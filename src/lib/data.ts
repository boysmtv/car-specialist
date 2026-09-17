import { seedCategories, seedFaq, seedGallery, seedProducts, seedServices, seedSettings } from "@/data/seed";
import { getDemoItems } from "@/lib/demoStore";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Category, Faq, GalleryItem, Product, Service, SiteSettings } from "@/types";

// Local overrides (admin demo tanpa DB): disimpan di memory + localStorage di client.
// Server: selalu coba Supabase dulu, fallback ke seed.

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
    if (!data || data.length === 0) return seedCategories;
    return data as Category[];
  }, seedCategories);
}

export async function getServices(): Promise<Service[]> {
  const base = await trySupabase(async (sb) => {
    const { data } = await sb.from("services").select("*").eq("active", true).order("name");
    if (!data || data.length === 0) return seedServices;
    return (data as Service[]).map((s) => ({
      ...s,
      symptoms: Array.isArray(s.symptoms) ? s.symptoms : [],
      diagnostics: Array.isArray(s.diagnostics) ? s.diagnostics : [],
      process: Array.isArray(s.process) ? s.process : [],
    }));
  }, seedServices);
  // Item yang ditambah admin (demo file / tanpa Supabase) ikut tampil publik
  const demo = await getDemoItems<Service>("services").catch(() => [] as Service[]);
  const seen = new Set(base.map((s) => s.id));
  return [...demo.filter((s) => s.active !== false && !seen.has(s.id)), ...base];
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
  // Coba Supabase bila configured
  const fromDb = await trySupabase<Product[] | null>(async (sb) => {
    let req = sb.from("products").select("*, product_images(*), categories!inner(slug,name)");
    req = req.eq("active", true).is("deleted_at", null);
    const { data, error } = await req.limit(200);
    if (error || !data || data.length === 0) return null;
    return (data as unknown[]).map((r: unknown) => {
      const row = r as Record<string, unknown>;
      const cat = row.categories as { slug?: string; name?: string } | null;
      const imgs = (row.product_images as Array<Record<string, unknown>> | undefined) ?? [];
      return {
        ...(row as unknown as Record<string, unknown>),
        category_slug: cat?.slug,
        category_name: cat?.name,
        images: imgs.map((im) => ({ ...im })),
      } as unknown as Product;
    });
  }, null);

  let items = fromDb ?? [...seedProducts];

  // Item yang ditambah admin (demo file / tanpa Supabase) ikut tampil publik
  try {
    const demo = await getDemoItems<Product>("products");
    const seen = new Set(items.map((x) => x.id));
    items = [...demo.filter((x) => x && x.active !== false && !seen.has(x.id)), ...items];
  } catch {}

  // Merge local admin overrides (hanya client; di server abaikan)
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
    case "name-asc": items.sort((a, b) => a.name.localeCompare(b.name)); break;
    case "name-desc": items.sort((a, b) => b.name.localeCompare(a.name)); break;
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
  const base = await trySupabase(async (sb) => {
    const { data } = await sb.from("gallery").select("*").eq("published", true).order("sort_order");
    if (!data || data.length === 0) return seedGallery;
    return data as GalleryItem[];
  }, seedGallery);
  const demo = await getDemoItems<GalleryItem>("gallery").catch(() => [] as GalleryItem[]);
  const seen = new Set(base.map((g) => g.id));
  return [...demo.filter((g) => g.published !== false && !seen.has(g.id)), ...base];
}

export async function getFaqs(): Promise<Faq[]> {
  return trySupabase(async (sb) => {
    const { data } = await sb.from("faq").select("*").eq("active", true).order("sort_order");
    if (!data || data.length === 0) return seedFaq;
    return data as Faq[];
  }, seedFaq);
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
