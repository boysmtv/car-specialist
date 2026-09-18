import { NextResponse } from "next/server";
import { getProductBySlug, getServiceBySlug } from "@/lib/data";
import ServiceDetailPage, { generateMetadata as serviceMeta } from "@/app/layanan/[slug]/page";
import ProductDetailPage, { generateMetadata as productMeta } from "@/app/produk/[slug]/page";

// SEMENTARA untuk diagnosa 500 di halaman detail production. HAPUS setelah fix.
export const dynamic = "force-dynamic";

function errJson(e: unknown) {
  const err = e as Error & { digest?: string };
  return { message: err?.message ?? String(e), digest: err?.digest, stack: err?.stack };
}

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
    if (type === "render-layanan") {
      try {
        const md = await serviceMeta({ params: { slug } });
        const el = await ServiceDetailPage({ params: { slug } });
        return NextResponse.json({ ok: true, stage: "render-ok", metadata: md, element: typeof el });
      } catch (e) {
        return NextResponse.json({ ok: false, stage: "render-throw", error: errJson(e) }, { status: 500 });
      }
    }
    if (type === "render-produk") {
      try {
        const md = await productMeta({ params: { slug } });
        const el = await ProductDetailPage({ params: { slug } });
        return NextResponse.json({ ok: true, stage: "render-ok", metadata: md, element: typeof el });
      } catch (e) {
        return NextResponse.json({ ok: false, stage: "render-throw", error: errJson(e) }, { status: 500 });
      }
    }
    return NextResponse.json({ ok: false, error: "pakai ?type=produk|layanan|render-produk|render-layanan&slug=..." }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, type, slug, error: (e as Error)?.message ?? String(e), stack: (e as Error)?.stack },
      { status: 500 },
    );
  }
}
