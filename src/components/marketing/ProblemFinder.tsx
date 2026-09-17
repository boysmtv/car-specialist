import Link from "next/link";

const problems = [
  { label: "AC tidak dingin", href: "/layanan/service-ac-mobil" },
  { label: "AC bau", href: "/layanan/service-ac-mobil" },
  { label: "Blower tidak keluar angin", href: "/layanan/service-ac-mobil" },
  { label: "Kaca mobil macet", href: "/layanan/perbaikan-power-window" },
  { label: "Power window lambat", href: "/layanan/perbaikan-power-window" },
  { label: "Central lock tidak bekerja", href: "/layanan/perbaikan-central-lock" },
  { label: "Remote tidak merespons", href: "/layanan/perbaikan-central-lock" },
  { label: "Speaker mati", href: "/layanan/audio-mobil" },
  { label: "Audio noise", href: "/layanan/audio-mobil" },
  { label: "Head unit bermasalah", href: "/layanan/audio-mobil" },
  { label: "Ingin upgrade audio", href: "/layanan/audio-mobil" },
  { label: "Cari variasi mobil", href: "/layanan/variasi-mobil" },
];

export default function ProblemFinder() {
  return (
    <section className="container-x py-12">
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Masalah mobil kamu apa?</h2>
      <p className="mt-1 text-slate-600">Pilih gejala — kami arahkan ke layanan yang sesuai.</p>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {problems.map((x) => (
          <Link key={x.label} href={x.href} className="card px-4 py-3 text-sm font-medium transition hover:border-primary hover:text-primary">
            {x.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
