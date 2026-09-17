// Penyimpanan demo sisi-server (file JSON). Dipakai saat Supabase belum
// dikonfigurasi agar data yang ditambah dari /admin langsung tampil publik.
// Di production (Supabase on): database yang dipakai. Di Vercel: baca saja
// (filesystem read-only) — tulis hanya untuk dev/lokal.
import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "demo-data.json");

export type DemoEntity = "services" | "gallery" | "products";
type Store = Record<DemoEntity, unknown[]>;

const EMPTY: Store = { services: [], gallery: [], products: [] };

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const j = JSON.parse(raw) as Partial<Store>;
    return {
      services: Array.isArray(j.services) ? j.services : [],
      gallery: Array.isArray(j.gallery) ? j.gallery : [],
      products: Array.isArray(j.products) ? j.products : [],
    };
  } catch {
    return { ...EMPTY };
  }
}

export async function getDemoItems<T = unknown>(entity: DemoEntity): Promise<T[]> {
  return (await readStore())[entity] as T[];
}

export async function addDemoItem(entity: DemoEntity, item: unknown): Promise<void> {
  const s = await readStore();
  s[entity].unshift(item);
  await fs.writeFile(FILE, JSON.stringify(s));
}

export async function deleteDemoItem(entity: DemoEntity, id: string): Promise<void> {
  const s = await readStore();
  s[entity] = s[entity].filter((x) => (x as { id?: string }).id !== id);
  await fs.writeFile(FILE, JSON.stringify(s));
}
