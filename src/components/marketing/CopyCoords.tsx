"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { SHOP_COORDS } from "@/lib/maps";

export default function CopyCoords() {
  const [ok, setOk] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(`${SHOP_COORDS.lat}, ${SHOP_COORDS.lng}`);
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    } catch {}
  }
  return (
    <button onClick={(e) => { e.preventDefault(); copy(); }} className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-800 hover:bg-orange-100" title="Salin koordinat">
      {ok ? <Check size={12} /> : <Copy size={12} />} {ok ? "Tersalin!" : "Salin"}
    </button>
  );
}
