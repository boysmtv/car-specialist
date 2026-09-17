import type { Metadata } from "next";
import { getGallery } from "@/lib/data";
import BeforeAfter from "@/components/marketing/BeforeAfter";

export const metadata: Metadata = { title: "Galeri", description: "Hasil pekerjaan Specialist AC Mobil." };
export const revalidate = 300;

export default async function GaleriPage({ searchParams }: { searchParams: { type?: string } }) {
  const all = await getGallery();
  const types = ["Semua", ...Array.from(new Set(all.map((g) => g.type)))];
  const active = searchParams.type || "Semua";
  const items = active === "Semua" ? all : all.filter((g) => g.type === active);
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Galeri</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        {types.map((t) => (
          <a key={t} href={t === "Semua" ? "/galeri" : `/galeri?type=${encodeURIComponent(t)}`} className={`rounded-full border px-3 py-1 text-xs font-semibold ${active === t ? "border-primary bg-orange-50 text-primary" : "border-border bg-white"}`}>{t}</a>
        ))}
      </div>
      {items.length === 0 ? (
        <div className="card-luxe mt-5 p-10 text-center">
          <p className="font-bold">Belum ada foto.</p>
          <p className="mt-1 text-sm text-slate-500">Dokumentasi hasil pekerjaan akan tampil di sini.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g) => (
          <div key={g.id} className="card overflow-hidden">
            {g.before_image_url && g.after_image_url ? (
              <BeforeAfter before={g.before_image_url} after={g.after_image_url} alt={g.title} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={g.image_url} alt={g.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            )}
            <div className="p-3 text-sm"><b>{g.title}</b>{g.vehicle && <p className="text-slate-500">{g.vehicle} · {g.type}</p>}</div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
