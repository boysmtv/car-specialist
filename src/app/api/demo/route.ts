import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { addDemoItem, deleteDemoItem, getDemoItems, getDemoSettings, setDemoSettings, type DemoEntity } from "@/lib/demoStore";

const ENTITIES: DemoEntity[] = ["services", "gallery", "products", "settings"];
const PATHS: Record<DemoEntity, string[]> = {
  services: ["/", "/layanan"],
  gallery: ["/", "/galeri"],
  products: ["/", "/produk"],
  settings: ["/", "/kontak"],
};

function valid(entity: unknown): entity is DemoEntity {
  return typeof entity === "string" && (ENTITIES as string[]).includes(entity);
}

// Daftar item demo (untuk list admin) / pengaturan demo
export async function GET(req: Request) {
  const entity = new URL(req.url).searchParams.get("entity");
  if (!valid(entity)) {
    return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "entity invalid" } }, { status: 400 });
  }
  if (entity === "settings") {
    return NextResponse.json({ success: true, data: await getDemoSettings() });
  }
  return NextResponse.json({ success: true, data: await getDemoItems(entity) });
}

// Tambah item demo dari admin → langsung revalidate halaman publik
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { entity?: unknown; item?: { id?: unknown } & Record<string, unknown> } | null;
  if (!body || !valid(body.entity)) {
    return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "entity invalid" } }, { status: 400 });
  }
  if (body.entity === "settings") {
    if (!body.item || typeof body.item !== "object") {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "item invalid" } }, { status: 400 });
    }
    try {
      await setDemoSettings(body.item);
    } catch {
      return NextResponse.json({ success: false, error: { code: "DATABASE_ERROR", message: "Gagal menyimpan" } }, { status: 500 });
    }
    for (const p of PATHS.settings) revalidatePath(p);
    return NextResponse.json({ success: true });
  }
  if (!body.item || typeof body.item.id !== "string" || !body.item.id) {
    return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "entity/item invalid" } }, { status: 400 });
  }
  try {
    await addDemoItem(body.entity as "services" | "gallery" | "products", body.item);
  } catch {
    return NextResponse.json({ success: false, error: { code: "DATABASE_ERROR", message: "Gagal menyimpan (gunakan Supabase untuk production)" } }, { status: 500 });
  }
  // Revalidate list + halaman detailnya agar tidak tersisa cache 404
  const paths = [...PATHS[body.entity]];
  const slug = (body.item as Record<string, unknown>).slug;
  if (typeof slug === "string" && slug) {
    paths.push(body.entity === "services" ? `/layanan/${slug}` : `/produk/${slug}`);
  }
  for (const p of paths) revalidatePath(p);
  return NextResponse.json({ success: true });
}

// Hapus item demo milik admin
export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null) as { entity?: unknown; id?: unknown } | null;
  if (!body || !valid(body.entity) || body.entity === "settings" || typeof body.id !== "string") {
    return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "entity/id invalid" } }, { status: 400 });
  }
  let removed: Record<string, unknown> | null = null;
  try {
    removed = await deleteDemoItem(body.entity, body.id);
  } catch {
    return NextResponse.json({ success: false, error: { code: "DATABASE_ERROR", message: "Gagal menghapus" } }, { status: 500 });
  }
  const paths = [...PATHS[body.entity]];
  const slug = removed?.slug;
  if (typeof slug === "string" && slug) {
    paths.push(body.entity === "services" ? `/layanan/${slug}` : `/produk/${slug}`);
  }
  for (const p of paths) revalidatePath(p);
  return NextResponse.json({ success: true });
}
