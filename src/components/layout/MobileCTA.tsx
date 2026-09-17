"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { waLink } from "@/lib/whatsapp";

export default function MobileCTA({ whatsapp }: { whatsapp: string }) {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-border bg-white/95 p-3 backdrop-blur lg:hidden">
      <a href={waLink("Halo, saya ingin konsultasi via WhatsApp.", whatsapp)} target="_blank" rel="noreferrer" className="btn-wa">
        WhatsApp
      </a>
      <Link href="/konsultasi" className="btn-primary">
        Konsultasi
      </Link>
    </div>
  );
}
