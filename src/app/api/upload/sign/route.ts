import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  // Signed upload Cloudinary — butuh auth sederhana: hanyaizinkan bila ada secret + (opsional) admin
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) {
    return NextResponse.json({ success: false, error: { code: "UPLOAD_FAILED", message: "Cloudinary belum dikonfigurasi" } }, { status: 400 });
  }
  const { folder = "products" } = await req.json().catch(() => ({}));
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto.createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");
  return NextResponse.json({ success: true, data: { cloud, key, timestamp, folder, signature } });
}
