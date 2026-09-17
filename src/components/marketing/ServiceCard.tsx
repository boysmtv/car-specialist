import Link from "next/link";
import { Snowflake, PanelTop, Lock, DoorOpen, Speaker, Wrench, House } from "lucide-react";
import type { Service } from "@/types";

const icons: Record<string, React.ReactNode> = {
  "service-ac-mobil": <Snowflake size={22} />,
  "perbaikan-power-window": <PanelTop size={22} />,
  "perbaikan-central-lock": <Lock size={22} />,
  "power-door": <DoorOpen size={22} />,
  "audio-mobil": <Speaker size={22} />,
  "home-service": <House size={22} />,
  "variasi-mobil": <Wrench size={22} />,
};

export default function ServiceCard({ s }: { s: Service }) {
  return (
    <Link href={`/layanan/${s.slug}`} className="card-luxe group grid gap-2 p-5 transition hover:-translate-y-1 hover:shadow-[0_16px_36px_-14px_rgba(16,24,40,0.3)]">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-100 text-primary">{icons[s.slug] ?? <Wrench size={22} />}</span>
      <h3 className="font-bold group-hover:text-primary">{s.name}</h3>
      <p className="line-clamp-2 text-sm text-slate-600">{s.short_description}</p>
      <span className="text-sm font-semibold text-primary">Lihat detail →</span>
    </Link>
  );
}
