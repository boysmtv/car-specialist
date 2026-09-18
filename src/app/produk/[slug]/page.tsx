import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts, getSettings } from "@/lib/data";
import { availabilityColor, availabilityLabel, priceLabel } from "@/lib/utils";
import ProductCard from "@/components/marketing/ProductCard";
import { productWaMessage, waLink } from "@/lib/whatsapp";

// Selalu render saat request (jangan ISR/prerender): generateStaticParams +
// cookies() di generateStaticParams bikin route detail 500 di Vercel.
// Dinamis = data admin selalu fresh + bebas dari cache-404.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProductBySlug(params.slug);
  return { title: p?.name ?? "Produk", description: p?.short_description ?? undefined };
}

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const p = await getProductBySlug(params.slug);
  if (!p || !p.active) notFound();
  const [related, settings] = await Promise.all([getRelatedProducts(p), getSettings()]);
  const images = Array.isArray(p.images) ? p.images : [];
  const cover = images.find((i) => i.is_cover) ?? images[0];
  const specs: Record<string, string> | null =
    p.specifications && typeof p.specifications === "object" && !Array.isArray(p.specifications)
      ? (p.specifications as Record<string, string>)
      : null;
  const specEntries = specs ? Object.entries(specs).filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "") : [];
  return (
    <div className="container-x py-10">
      <nav className="text-xs text-slate-500"><Link href="/" className="hover:text-primary">Home</Link> / <Link href="/produk" className="hover:text-primary">Produk</Link> / {p.name}</nav>
      <div className="mt-3 grid gap-6 lg:grid-cols-2">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {cover && <img src={cover.url} alt={cover.alt_text || p.name} className="aspect-square w-full rounded-xl border border-border object-cover" />}
          <div className="mt-2 grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((im) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={im.id} src={im.url} alt={im.alt_text || p.name} loading="lazy" className="aspect-square w-full rounded-lg border border-border object-cover" />
            ))}
          </div>
        </div>
        <div>
          <span className={`badge ${availabilityColor(p.availability)}`}>{availabilityLabel(p.availability)}</span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{p.name}</h1>
          <p className="mt-1 text-sm text-slate-500">{p.brand} · {p.category_name} {p.part_number ? `· ${p.part_number}` : ""}</p>
          <p className="mt-3 text-2xl font-extrabold text-primary">{priceLabel(p)}</p>
          <p className="mt-3 text-sm text-slate-600">{p.description}</p>
          {specEntries.length > 0 && (
            <dl className="card mt-3 grid gap-1 p-4 text-sm">
              {specEntries.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-slate-100 py-1 last:border-0"><dt className="text-slate-500">{k}</dt><dd className="font-medium">{String(v)}</dd></div>
              ))}
            </dl>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <a className="btn-wa" target="_blank" rel="noreferrer" href={waLink(productWaMessage(p), settings.whatsapp)}>Tanya WhatsApp</a>
            <Link href="/konsultasi" className="btn-primary">Konsultasi Pemasangan</Link>
          </div>
          {p.warranty_text && <p className="mt-3 text-xs text-slate-500">Garansi: {p.warranty_text}</p>}
        </div>
      </div>
      <h2 className="mt-10 text-xl font-extrabold">Produk terkait</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {related.map((r) => <ProductCard key={r.id} p={r} wa={settings.whatsapp} />)}
      </div>
    </div>
  );
}
