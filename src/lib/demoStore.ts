// Penyimpanan demo sisi-server (file JSON). Dipakai saat Supabase belum
// dikonfigurasi agar data yang ditambah dari /admin langsung tampil publik.
// Di production (Supabase on): database yang dipakai. Di Vercel: baca saja
// (filesystem read-only) — tulis hanya untuk dev/lokal.
import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "demo-data.json");

export type DemoEntity = "services" | "gallery" | "products" | "settings";
type Store = Record<"services" | "gallery" | "products", unknown[]> & { settings: Record<string, unknown> };

const EMPTY: Store = { services: [], gallery: [], products: [], settings: {} };

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const j = JSON.parse(raw) as Partial<Store>;
    return {
      services: Array.isArray(j.services) ? j.services : [],
      gallery: Array.isArray(j.gallery) ? j.gallery : [],
      products: Array.isArray(j.products) ? j.products : [],
      settings: j.settings && typeof j.settings === "object" ? (j.settings as Record<string, unknown>) : {},
    };
  } catch {
    return { ...EMPTY };
  }
}

export async function getDemoItems<T = unknown>(entity: "services" | "gallery" | "products"): Promise<T[]> {
  return (await readStore())[entity] as T[];
}

export async function getDemoSettings<T = Record<string, unknown>>(): Promise<Partial<T>> {
  return (await readStore()).settings as Partial<T>;
}

export async function setDemoSettings(obj: Record<string, unknown>): Promise<void> {
  const s = await readStore();
  s.settings = { ...s.settings, ...obj };
  await fs.writeFile(FILE, JSON.stringify(s));
}

export async function addDemoItem(entity: "services" | "gallery" | "products", item: unknown): Promise<void> {
  const s = await readStore();
  s[entity].unshift(item);
  await fs.writeFile(FILE, JSON.stringify(s));
}

export async function deleteDemoItem(entity: "services" | "gallery" | "products", id: string): Promise<void> {
  const s = await readStore();
  s[entity] = s[entity].filter((x) => (x as { id?: string }).id !== id);
  await fs.writeFile(FILE, JSON.stringify(s));
}
