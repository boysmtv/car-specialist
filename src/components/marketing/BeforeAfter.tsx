"use client";
import { useState } from "react";

export default function BeforeAfter({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative select-none overflow-hidden rounded-xl border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={alt + " sesudah"} className="aspect-[4/3] w-full object-cover" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={alt + " sebelum"} className="aspect-[4/3] h-full max-w-none object-cover" style={{ width: "100vw" }} draggable={false} />
        <span className="badge absolute left-2 top-2 bg-black/70 text-white">Before</span>
      </div>
      <span className="badge absolute right-2 top-2 bg-primary text-white">After</span>
      <input
        type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-2 bottom-2 w-[calc(100%-1rem)]" aria-label="Geser pembanding"
      />
    </div>
  );
}
