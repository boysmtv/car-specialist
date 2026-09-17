import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { path } = await req.json().catch(() => ({}));
  if (typeof path === "string") revalidatePath(path);
  else { revalidatePath("/"); revalidatePath("/produk"); revalidatePath("/layanan"); }
  return NextResponse.json({ success: true });
}
