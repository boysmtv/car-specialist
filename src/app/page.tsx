import Link from "next/link";
import { CalendarCheck, MessageCircle, ShieldCheck, ClipboardCheck, MessagesSquare, FileImage } from "lucide-react";
import { getProducts, getServices, getSettings, getGallery } from "@/lib/data";
import ServiceCard from "@/components/marketing/ServiceCard";
import ProductCard from "@/components/marketing/ProductCard";
import { waLink } from "@/lib/whatsapp";
import LocationSection from "@/components/marketing/LocationSection";
import { mapsSearchUrl } from "@/lib/maps";
import { MapPin } from "lucide-react";

export const revalidate = 300;

export default async function HomePage() {
  const [services, prod, settings, gallery] = await Promise.all([
    getServices(), getProducts({ perPage: 8 }), getSettings(), getGallery(),
  ]);
  return (
    <div>
      {/* HERO — full-bleed, putih + orange soft */}
      <section className="hero-soft overflow-x-clip">
        <div className="container-x grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-16">
          <div>
            <p className="badge-gold">❄ Spesialis AC · Elektrik · Audio · Variasi</p>
            <h1 className="mt-3 text-[1.9rem] font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              AC Mobil Bermasalah? <span className="gold-text">Biar Kami Cek.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
              Spesialis AC Mobil, Power Window, Central Lock, Audio Mobil, dan berbagai kebutuhan variasi kendaraan — pemeriksaan dulu, estimasi transparan.
            </p>
            <div className="mt-6 grid gap-2 sm:flex sm:flex-wrap">
              <a href={waLink("Halo Specialist AC Mobil, saya ingin konsultasi.", settings.whatsapp)} target="_blank" rel="noreferrer" className="btn-wa w-full sm:w-auto"><MessageCircle size={17} /> Chat WhatsApp</a>
              <a href="#lokasi" className="btn-gold w-full sm:w-auto"><MapPin size={17} /> Lokasi</a>
              <Link href="/layanan" className="btn-outline w-full sm:w-auto">Lihat Layanan</Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
              <a href={mapsSearchUrl(settings.address)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline" title="Klik untuk buka di Google Maps">
                <MapPin size={15} className="shrink-0" />
                <span className="sm:hidden">Cikarang Barat — Buka Maps</span>
                <span className="hidden sm:inline">{settings.address} — Buka Maps</span>
              </a>
              <span>📞 {settings.phone}</span>
            </div>
            <div className="mt-6 grid max-w-md grid-cols-3 gap-2">
              {[{ v: "7", l: "Layanan inti" }, { v: "16+", l: "Produk katalog" }, { v: "WA", l: "Fast respon" }].map((s) => (
                <div key={s.l} className="rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-center shadow-sm">
                  <b className="gold-text block text-xl">{s.v}</b>
                  <span className="text-[11px] text-slate-500">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Visual full-bleed ke tepi kanan layar (desktop) */}
          <div className="lg:-mr-[max(1.5rem,calc((100vw-80rem)/2))]">
            <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl lg:rounded-r-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1100&q=70" alt="Bengkel Specialist AC Mobil" className="aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-[500px]" />
              <span className="badge-gold absolute left-3 top-3 shadow">● Buka Senin–Sabtu</span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-10 text-sm font-semibold text-white">Bengkel kami — klik alamat di atas untuk rute Google Maps</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SERVICES */}
      <section className="container-x py-12">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Ada masalah apa dengan mobilmu?</h2>
        <p className="mt-1 text-slate-600">Pilih layanan atau ceritakan keluhannya. Kami bantu arahkan pemeriksaan yang sesuai.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => <ServiceCard key={s.id} s={s} />)}
        </div>
      </section>

      {/* HOME SERVICE — pita full-bleed */}
      <section className="border-y border-orange-100 bg-gradient-to-b from-orange-100/70 to-orange-50/40">
        <div className="container-x grid gap-5 py-8 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="badge-gold">🏠 Home Service — teknisi ke rumah</p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Mager ke bengkel? <span className="gold-text">Kami yang datang.</span>
            </h2>
            <p className="mt-1 max-w-xl text-sm text-slate-600 sm:text-base">
              Servis AC, isi freon, power window ringan & konsultasi audio di rumahmu. Area Cikarang Barat & sekitarnya — biaya kunjungan transparan.
            </p>
          </div>
          <div className="grid gap-2 sm:flex lg:flex-col">
            <Link href="/konsultasi?type=HOME_SERVICE" className="btn-gold w-full sm:w-auto">Tanya Home Service</Link>
            <a href={waLink("Halo, saya ingin tanya home service. Alamat saya: ", settings.whatsapp)} target="_blank" rel="noreferrer" className="btn-ghostlight w-full sm:w-auto">Tanya via WhatsApp</a>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="border-y border-border bg-white">
        <div className="container-x grid gap-3 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: <ClipboardCheck size={20} />, t: "Pemeriksaan terlebih dahulu", d: "Diagnosa sebelum estimasi & pengerjaan." },
            { icon: <ShieldCheck size={20} />, t: "Estimasi sebelum pengerjaan", d: "Tidak ada tindakan tanpa persetujuan." },
            { icon: <MessagesSquare size={20} />, t: "Komunikasi mudah via WhatsApp", d: "Tanya stok, harga & jadwal dengan cepat." },
            { icon: <CalendarCheck size={20} />, t: "Produk dikonsultasikan sesuai kendaraan", d: "Cocokkan merek, tipe & tahun mobil." },
            { icon: <FileImage size={20} />, t: "Dokumentasi pekerjaan", d: "Foto hasil & before-after tersedia." },
            { icon: <MessageCircle size={20} />, t: "Pilihan perbaikan sesuai kebutuhan", d: "Opsi hemat atau ganti baru, transparan." },
          ].map((x) => (
            <div key={x.t} className="card flex gap-3 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange-100 text-primary">{x.icon}</span>
              <span><b className="block text-sm">{x.t}</b><i className="block text-sm not-italic text-slate-600">{x.d}</i></span>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="container-x py-12">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Cari komponen atau aksesori mobil?</h2>
            <p className="mt-1 text-slate-600">Lihat katalog produk kami dan tanyakan kompatibilitasnya untuk mobilmu.</p>
          </div>
          <Link href="/produk" className="btn-outline hidden sm:inline-flex">Semua produk</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {prod.items.map((p) => <ProductCard key={p.id} p={p} wa={settings.whatsapp} />)}
        </div>
        <Link href="/produk" className="btn-outline mt-4 w-full sm:hidden">Semua produk</Link>
      </section>

      {/* GALERI HASIL PEKERJAAN */}
      <section className="container-x pb-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-extrabold">Hasil pekerjaan</h2>
          <Link href="/galeri" className="text-sm font-semibold text-primary">Lihat galeri →</Link>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {gallery.slice(0, 6).map((g) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={g.id} src={g.image_url} alt={g.title} loading="lazy" className="aspect-square w-full rounded-lg border border-border object-cover" />
          ))}
        </div>
      </section>

      {/* LOKASI + MAPS (klik langsung) */}
      <LocationSection settings={settings} />

      {/* FINAL CTA — pita full-bleed */}
      <section className="border-t border-orange-100 bg-gradient-to-b from-orange-50 to-white">
        <div className="container-x grid gap-3 py-10 text-center sm:py-12">
          <h2 className="text-2xl font-extrabold text-slate-900">Belum tahu masalahnya?</h2>
          <p className="text-slate-600">Ceritakan gejalanya melalui WhatsApp.</p>
          <div className="mx-auto grid w-full max-w-md gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-center">
            <a href={waLink("Halo, saya belum tahu masalah mobil saya. Gejalanya: ", settings.whatsapp)} target="_blank" rel="noreferrer" className="btn-wa w-full sm:w-auto">Konsultasi WhatsApp</a>
            <Link href="/konsultasi" className="btn-outline w-full sm:w-auto">Form Konsultasi</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
