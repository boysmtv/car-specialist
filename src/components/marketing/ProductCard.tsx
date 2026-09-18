import Link from "next/link";
import type { Product } from "@/types";
import { availabilityColor, availabilityLabel, priceLabel } from "@/lib/utils";
import { productWaMessage, waLink } from "@/lib/whatsapp";

export default function ProductCard({ p, wa }: { p: Product; wa: string }) {
  const images = Array.isArray(p.images) ? p.images : [];
  const cover = images.find((i) => i.is_cover) ?? images[0];
  return (
    <div className="card-luxe overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_16px_36px_-14px_rgba(16,24,40,0.3)]">
      <Link href={`/produk/${p.slug}`} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover?.url} alt={cover?.alt_text || p.name} loading="lazy" className="aspect-square w-full object-cover" />
      </Link>
      <div className="grid gap-1.5 p-3">
        <span className={`badge w-fit ${availabilityColor(p.availability)}`}>{availabilityLabel(p.availability)}</span>
        <Link href={`/produk/${p.slug}`} className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug hover:text-primary">
          {p.name}
        </Link>
        <p className="text-xs text-slate-500">{p.brand} · {p.category_name}</p>
        <p className="text-sm font-extrabold text-primary">{priceLabel(p)}</p>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <Link href={`/produk/${p.slug}`} className="btn-outline !px-2 !py-1.5 !text-xs">Detail</Link>
          <a href={waLink(productWaMessage(p), wa)} target="_blank" rel="noreferrer" className="btn-wa !px-2 !py-1.5 !text-xs">WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
