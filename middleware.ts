import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Proteksi ringan: admin pages cek cookie supabase; detail dicek di layout server.
  // Selalu izinkan /admin/login.
  if (req.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
