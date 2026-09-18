import { NextResponse } from "next/server";
import { getProductBySlug, getServiceBySlug } from "@/lib/data";

// SEMENTARA untuk diagnosa 500 di halaman detail production.
// Hanya mengembalikan data katalog PUBLIK (sama seperti yang tampil di
// /produk & /layanan). HAPUS file ini setelah root cause ketemu.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "";
  const slug = searchParams.get("slug") ?? "";
  try {
    if (type === "produk") {
      const p = await getProductBySlug(slug);
      return NextResponse.json({ ok: true, type, slug, found: !!p, data: p });
    }
    if (type === "layanan") {
      const s = await getServiceBySlug(slug);
      return NextResponse.json({ ok: true, type, slug, found: !!s, data: s });
    }
    return NextResponse.json({ ok: false, error: "pakai ?type=produk|layanan&slug=..." }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, type, slug, error: (e as Error)?.message ?? String(e), stack: (e as Error)?.stack },
      { status: 500 },
    );
  }
}
