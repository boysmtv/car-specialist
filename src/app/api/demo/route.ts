import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { addDemoItem, deleteDemoItem, getDemoItems, type DemoEntity } from "@/lib/demoStore";

const ENTITIES: DemoEntity[] = ["services", "gallery", "products"];
const PATHS: Record<DemoEntity, string[]> = {
  services: ["/", "/layanan"],
  gallery: ["/", "/galeri"],
  products: ["/", "/produk"],
};

function valid(entity: unknown): entity is DemoEntity {
  return typeof entity === "string" && (ENTITIES as string[]).includes(entity);
}

// Daftar item demo (untuk list admin)
export async function GET(req: Request) {
  const entity = new URL(req.url).searchParams.get("entity");
  if (!valid(entity)) {
    return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "entity invalid" } }, { status: 400 });
  }
  return NextResponse.json({ success: true, data: await getDemoItems(entity) });
}

// Tambah item demo dari admin → langsung revalidate halaman publik
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { entity?: unknown; item?: { id?: unknown } } | null;
  if (!body || !valid(body.entity) || !body.item || typeof body.item.id !== "string" || !body.item.id) {
    return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "entity/item invalid" } }, { status: 400 });
  }
  try {
    await addDemoItem(body.entity, body.item);
  } catch {
    return NextResponse.json({ success: false, error: { code: "DATABASE_ERROR", message: "Gagal menyimpan (gunakan Supabase untuk production)" } }, { status: 500 });
  }
  for (const p of PATHS[body.entity]) revalidatePath(p);
  return NextResponse.json({ success: true });
}

// Hapus item demo milik admin
export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null) as { entity?: unknown; id?: unknown } | null;
  if (!body || !valid(body.entity) || typeof body.id !== "string") {
    return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "entity/id invalid" } }, { status: 400 });
  }
  try {
    await deleteDemoItem(body.entity, body.id);
  } catch {
    return NextResponse.json({ success: false, error: { code: "DATABASE_ERROR", message: "Gagal menghapus" } }, { status: 500 });
  }
  for (const p of PATHS[body.entity]) revalidatePath(p);
  return NextResponse.json({ success: true });
}
