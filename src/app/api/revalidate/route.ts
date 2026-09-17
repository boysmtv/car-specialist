import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const paths: string[] = Array.isArray((body as { paths?: unknown }).paths)
    ? ((body as { paths: unknown[] }).paths.filter((p): p is string => typeof p === "string"))
    : typeof (body as { path?: unknown }).path === "string"
      ? [(body as { path: string }).path]
      : ["/", "/produk", "/layanan"];
  for (const p of paths.slice(0, 10)) {
    try { revalidatePath(p); } catch {}
  }
  return NextResponse.json({ success: true });
}
