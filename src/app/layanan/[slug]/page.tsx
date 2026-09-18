import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getServiceBySlug, getSettings } from "@/lib/data";
import { waLink } from "@/lib/whatsapp";

// Selalu render saat request (jangan ISR/prerender): generateStaticParams +
// cookies() di generateStaticParams bikin route detail 500 di Vercel.
// Dinamis = data admin selalu fresh + bebas dari cache-404.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const s = await getServiceBySlug(params.slug);
  return { title: s?.name ?? "Layanan", description: s?.short_description ?? undefined };
}

export default async function ServiceDetail({ params }: { params: { slug: string } }) {
  const s = await getServiceBySlug(params.slug);
  if (!s) notFound();
  const settings = await getSettings();
  const symptoms = Array.isArray(s.symptoms) ? s.symptoms : [];
  const diagnostics = Array.isArray(s.diagnostics) ? s.diagnostics : [];
  const process = Array.isArray(s.process) ? s.process : [];
  return (
    <div className="container-x py-10">
      <nav className="text-xs text-slate-500"><Link href="/" className="hover:text-primary">Home</Link> / <Link href="/layanan" className="hover:text-primary">Layanan</Link> / {s.name}</nav>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{s.name}</h1>
      <p className="mt-2 max-w-3xl text-slate-600">{s.description}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {s.image_url && <img src={s.image_url} alt={s.name} className="mt-4 aspect-[16/7] w-full rounded-xl border border-border object-cover" />}
      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        <div className="card p-5"><h2 className="font-bold">Gejala umum</h2><ul className="mt-2 list-disc pl-5 text-sm text-slate-600">{symptoms.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div className="card p-5"><h2 className="font-bold">Pemeriksaan</h2><ul className="mt-2 list-disc pl-5 text-sm text-slate-600">{diagnostics.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div className="card p-5"><h2 className="font-bold">Proses pengerjaan</h2><ol className="mt-2 list-decimal pl-5 text-sm text-slate-600">{process.map((x) => <li key={x}>{x}</li>)}</ol></div>
      </div>
      <div className="card mt-3 flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="text-sm text-slate-600">Estimasi waktu: <b className="text-slate-900">{s.duration_text ?? "-"}</b></div>
        <div className="flex gap-2">
          <Link href={`/konsultasi?service=${s.slug}`} className="btn-primary">Konsultasi</Link>
          <a className="btn-wa" target="_blank" rel="noreferrer" href={waLink(`Halo, saya ingin bertanya tentang layanan ${s.name}.`, settings.whatsapp)}>WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
