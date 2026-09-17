import type { MetadataRoute } from "next";
import { getProducts, getServices } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const [services, prod] = await Promise.all([getServices(), getProducts({ perPage: 500 })]);
  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/layanan`, changeFrequency: "weekly", priority: 0.9 },
    ...services.map((s) => ({ url: `${base}/layanan/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${base}/produk`, changeFrequency: "daily", priority: 0.9 },
    ...prod.items.map((p) => ({ url: `${base}/produk/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: `${base}/galeri`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/konsultasi`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tentang`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/kontak`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
