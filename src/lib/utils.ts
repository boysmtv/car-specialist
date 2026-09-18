import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatRupiah(n?: number | string | null): string {
  if (n === undefined || n === null || n === "") return "Hubungi kami";
  const num = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(num)) return "Hubungi kami";
  return "Rp " + new Intl.NumberFormat("id-ID").format(num);
}

export function priceLabel(p: {
  price_mode: string;
  price?: number | string | null;
  price_min?: number | string | null;
  price_max?: number | string | null;
}): string {
  switch (p.price_mode) {
    case "FIXED":
      return p.price ? formatRupiah(p.price) : "Hubungi kami";
    case "START_FROM":
      return p.price_min ? `Mulai ${formatRupiah(p.price_min)}` : "Hubungi kami";
    case "RANGE":
      return p.price_min && p.price_max
        ? `${formatRupiah(p.price_min)} – ${formatRupiah(p.price_max)}`
        : "Hubungi kami";
    default:
      return "Hubungi kami";
  }
}

export function availabilityLabel(a: string): string {
  const map: Record<string, string> = {
    AVAILABLE: "Tersedia",
    LOW_STOCK: "Stok Terbatas",
    PREORDER: "Pre-order",
    OUT_OF_STOCK: "Habis",
    CONTACT: "Tanya Stok",
  };
  return map[a] || a;
}

export function availabilityColor(a: string): string {
  const map: Record<string, string> = {
    AVAILABLE: "bg-emerald-100 text-emerald-700",
    LOW_STOCK: "bg-amber-100 text-amber-700",
    PREORDER: "bg-sky-100 text-sky-700",
    OUT_OF_STOCK: "bg-red-100 text-red-700",
    CONTACT: "bg-slate-100 text-slate-700",
  };
  return map[a] || "bg-slate-100 text-slate-700";
}

export function normalizePhone(input: string): string {
  let s = input.replace(/[^0-9+]/g, "");
  if (s.startsWith("+")) s = s.slice(1);
  if (s.startsWith("0")) s = "62" + s.slice(1);
  return s;
}

export function formatPhoneDisplay(normalized: string): string {
  if (normalized.startsWith("62")) return "0" + normalized.slice(2);
  return normalized;
}

export function uniqueSlug(base: string, existing: string[]): string {
  let slug = slugify(base);
  if (!existing.includes(slug)) return slug;
  let i = 2;
  while (existing.includes(`${slug}-${i}`)) i++;
  return `${slug}-${i}`;
}
