import type { Category, Faq, GalleryItem, Product, Service, SiteSettings } from "@/types";

const img = (seed: string) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=900&q=70`;

export const seedCategories: Category[] = [
  { id: "c-ac", name: "AC Mobil", slug: "ac-mobil", description: "Komponen & servis AC mobil", sort_order: 1, active: true },
  { id: "c-pw", name: "Power Window", slug: "power-window", description: "Motor, regulator & switch", sort_order: 2, active: true },
  { id: "c-cl", name: "Central Lock", slug: "central-lock", description: "Actuator, modul & remote", sort_order: 3, active: true },
  { id: "c-audio", name: "Audio", slug: "audio", description: "Head unit, speaker & amplifier", sort_order: 4, active: true },
  { id: "c-elec", name: "Electrical", slug: "electrical", description: "Kelistrikan mobil", sort_order: 5, active: true },
  { id: "c-int", name: "Interior", slug: "interior", description: "Aksesori interior", sort_order: 6, active: true },
  { id: "c-ext", name: "Exterior", slug: "exterior", description: "Aksesori exterior", sort_order: 7, active: true },
  { id: "c-var", name: "Variasi", slug: "variasi", description: "Variasi & aksesori umum", sort_order: 8, active: true },
];

export const seedServices: Service[] = [
  {
    id: "s-ac", icon: "snowflake", name: "Service AC Mobil", slug: "service-ac-mobil",
    short_description: "Pemeriksaan dan perbaikan sistem AC mobil dari pendinginan, blower, hingga komponen AC.",
    description: "Layanan lengkap sistem AC: general check, servis, cleaning evaporator, isi freon, leak check, pemeriksaan kompresor, kondensor, blower, magnetic clutch, thermostat, cabin filter, expansion valve, dan kelistrikan AC. Teknisi melakukan pemeriksaan terlebih dahulu, memberikan estimasi sebelum pengerjaan, dan mendokumentasikan pekerjaan.",
    symptoms: ["AC tidak dingin", "AC bau", "Blower tidak keluar angin", "Angin kecil", "Kompresor berisik"],
    diagnostics: ["Cek tekanan freon", "Cek kebocoran", "Cek kompresor & magnetic clutch", "Cek evaporator & kondensor", "Cek blower & filter kabin"],
    process: ["Pemeriksaan awal", "Estimasi biaya", "Persetujuan pelanggan", "Pengerjaan", "QC & serah terima"],
    duration_text: "1–3 jam (tergantung kerusakan)",
    price_mode: "START_FROM", price_from: 150000, price_to: null,
    warranty_text: "Garansi pengerjaan sesuai nota bengkel.",
    image_url: img("photo-1486262715619-67b85e0b08d3"), featured: true, active: true,
  },
  {
    id: "s-pw", icon: "car", name: "Perbaikan Power Window", slug: "perbaikan-power-window",
    short_description: "Pemeriksaan kaca elektrik yang macet, lambat, atau tidak berfungsi.",
    description: "Diagnosa power window mati, kaca lambat/tersendat, tidak naik/turun. Pemeriksaan motor, regulator, switch master & single, wiring, fuse, relay, dan mekanisme.",
    symptoms: ["Kaca mobil macet", "Power window lambat", "Kaca tidak naik", "Kaca tidak turun", "Suara kasar saat naik/turun"],
    diagnostics: ["Cek motor", "Cek regulator", "Cek switch", "Cek wiring & fuse"],
    process: ["Bongkar door trim", "Diagnosa", "Estimasi", "Perbaikan/penggantian", "Test naik-turun"],
    duration_text: "1–2 jam",
    price_mode: "START_FROM", price_from: 100000, price_to: null,
    image_url: img("photo-1503376780353-7e6692767b70"), featured: true, active: true,
  },
  {
    id: "s-cl", icon: "lock", name: "Perbaikan Central Lock", slug: "perbaikan-central-lock",
    short_description: "Diagnosa sistem central lock, actuator, remote, module, dan wiring.",
    description: "Perbaikan lock/unlock tidak serempak, remote tidak merespons, actuator lemah, modul/receiver, wiring, fuse, dan integrasi alarm bila didukung.",
    symptoms: ["Central lock tidak bekerja", "Remote tidak merespons", "Kunci tidak serempak"],
    diagnostics: ["Cek actuator", "Cek remote & baterai", "Cek modul", "Cek wiring"],
    process: ["Diagnosa", "Estimasi", "Perbaikan", "Sinkronisasi remote", "Test"],
    duration_text: "1–2 jam",
    price_mode: "START_FROM", price_from: 100000, price_to: null,
    image_url: img("photo-1449965408869-eaa3f722e40d"), featured: false, active: true,
  },
  {
    id: "s-pd", icon: "door", name: "Power Door", slug: "power-door",
    short_description: "Pemeriksaan dan instalasi sistem pintu elektrik sesuai dukungan kendaraan.",
    description: "Instalasi dan perbaikan power door / power back door sesuai tipe kendaraan yang didukung. Meliputi motor, modul, sensor, dan kalibrasi.",
    symptoms: ["Pintu elektrik macet", "Ingin pasang power back door"],
    diagnostics: ["Cek kompatibilitas kendaraan", "Cek motor & modul", "Cek sensor"],
    process: ["Konsultasi", "Estimasi", "Instalasi", "Kalibrasi", "Test"],
    duration_text: "2–4 jam",
    price_mode: "CONTACT",
    image_url: img("photo-1493238792000-8113da705763"), featured: false, active: true,
  },
  {
    id: "s-audio", icon: "speaker", name: "Audio Mobil", slug: "audio-mobil",
    short_description: "Head unit, speaker, amplifier, subwoofer, wiring, dan troubleshooting audio.",
    description: "Instalasi head unit, speaker coaxial/component, tweeter, amplifier, subwoofer aktif/pasif, wiring, fuse, grounding, noise troubleshooting, dan konsultasi upgrade audio.",
    symptoms: ["Speaker mati", "Audio noise/dengung", "Head unit bermasalah", "Ingin upgrade audio"],
    diagnostics: ["Cek head unit", "Cek speaker & wiring", "Cek grounding", "Cek power & fuse"],
    process: ["Konsultasi kebutuhan", "Estimasi", "Instalasi", "Tuning", "Test dengar"],
    duration_text: "1–4 jam",
    price_mode: "START_FROM", price_from: 200000, price_to: null,
    image_url: img("photo-1470225620780-dba8ba36b745"), featured: true, active: true,
  },
  {
    id: "s-homesvc", icon: "house", name: "Home Service", slug: "home-service",
    short_description: "Teknisi datang ke rumah — servis AC, power window & audio tanpa ke bengkel.",
    description: "Tidak sempat ke bengkel? Teknisi kami datang ke rumah Anda untuk pemeriksaan dan pengerjaan ringan: cek & servis AC, isi freon, ganti cabin filter, perbaikan power window ringan, dan konsultasi audio. Area utama Cikarang Barat & sekitarnya (Cikarang, Cibitung, Tambun, Bekasi — konfirmasi cakupan via WhatsApp). Biaya kunjungan berlaku di luar jasa pengerjaan dan diinformasikan transparan sebelum kunjungan.",
    symptoms: ["Tidak sempat ke bengkel", "Mobil mogok / tidak bisa jalan", "Ingin servis di rumah"],
    diagnostics: ["Konfirmasi keluhan via WhatsApp", "Cek cakupan area", "Estimasi jasa + biaya kunjungan"],
    process: ["Chat konsultasi via WhatsApp", "Konfirmasi jadwal & alamat", "Teknisi datang", "Pemeriksaan & estimasi di lokasi", "Pengerjaan bila disetujui"],
    duration_text: "Menyesuaikan antrean kunjungan",
    price_mode: "CONTACT",
    image_url: img("photo-1486262715619-67b85e0b08d3"), featured: true, active: true,
  },
  {
    id: "s-var", icon: "sparkles", name: "Variasi Mobil", slug: "variasi-mobil",
    short_description: "Berbagai kebutuhan aksesori dan variasi interior maupun eksterior kendaraan.",
    description: "Aksesori interior, exterior, lighting, USB charger, parkir, dan variasi lainnya. Konsultasikan kebutuhan dan kompatibilitas kendaraan Anda.",
    symptoms: ["Cari variasi mobil", "Ingin upgrade lampu", "Butuh charger & aksesori"],
    diagnostics: ["Konsultasi kebutuhan", "Cek kompatibilitas"],
    process: ["Pilih produk", "Estimasi + pasang", "QC"],
    duration_text: "30 menit – 2 jam",
    price_mode: "CONTACT",
    image_url: img("photo-1519641471654-76ce0107ad1b"), featured: false, active: true,
  },
];

function p(
  id: string, cat: string, name: string, slug: string, brand: string,
  price_mode: Product["price_mode"], price: Partial<Product>, avail: Product["availability"] = "AVAILABLE",
): Product {
  return {
    id, category_id: cat,
    category_slug: seedCategories.find((c) => c.id === cat)?.slug,
    category_name: seedCategories.find((c) => c.id === cat)?.name,
    name, slug, brand,
    short_description: `${name} ${brand} — konsultasikan kompatibilitas untuk mobil Anda.`,
    description: `${name} (${brand}) tersedia di Specialist AC Mobil & Variasi. Harga dapat berbeda tergantung tipe mobil dan kebutuhan pemasangan. Hubungi WhatsApp untuk estimasi termasuk pasang.`,
    price_mode,
    price: price.price ?? null,
    price_min: price.price_min ?? null,
    price_max: price.price_max ?? null,
    availability: avail,
    active: true, featured: false,
    images: [
      { id: `${id}-1`, product_id: id, url: img("photo-1486262715619-67b85e0b08d3"), alt_text: name, sort_order: 1, is_cover: true },
      { id: `${id}-2`, product_id: id, url: img("photo-1487754180451-c456f719a1fc"), alt_text: `${name} detail`, sort_order: 2, is_cover: false },
    ],
    fitments: [],
  };
}

export const seedProducts: Product[] = [
  p("p1", "c-ac", "Cabin Filter", "cabin-filter", "Denso", "START_FROM", { price_min: 85000 }),
  p("p2", "c-ac", "Kompresor AC", "kompresor-ac", "Denso", "START_FROM", { price_min: 1500000 }),
  p("p3", "c-ac", "Evaporator", "evaporator-ac", "Denso", "START_FROM", { price_min: 750000 }),
  p("p4", "c-ac", "Kondensor", "kondensor-ac", "Denso", "START_FROM", { price_min: 650000 }),
  p("p5", "c-ac", "Blower Motor", "blower-motor", "OEM", "START_FROM", { price_min: 450000 }),
  p("p6", "c-ac", "Expansion Valve", "expansion-valve", "OEM", "FIXED", { price: 350000 }),
  p("p7", "c-ac", "Magnetic Clutch", "magnetic-clutch", "Denso", "START_FROM", { price_min: 500000 }),
  p("p8", "c-pw", "Power Window Motor", "power-window-motor", "OEM", "START_FROM", { price_min: 300000 }),
  p("p9", "c-pw", "Power Window Regulator", "power-window-regulator", "OEM", "START_FROM", { price_min: 350000 }),
  p("p10", "c-pw", "Master Switch Power Window", "master-switch-power-window", "OEM", "START_FROM", { price_min: 250000 }),
  p("p11", "c-cl", "Door Lock Actuator", "door-lock-actuator", "OEM", "START_FROM", { price_min: 200000 }),
  p("p12", "c-cl", "Central Lock Module", "central-lock-module", "OEM", "START_FROM", { price_min: 350000 }),
  p("p13", "c-audio", "Head Unit 9 inch Android", "head-unit-9-inch", "Skeleton", "RANGE", { price_min: 1200000, price_max: 2500000 }),
  p("p14", "c-audio", "Speaker Coaxial 6 inch", "speaker-coaxial-6-inch", "Pioneer", "START_FROM", { price_min: 550000 }),
  p("p15", "c-audio", "Subwoofer Aktif 10 inch", "subwoofer-aktif-10-inch", "Venom", "START_FROM", { price_min: 1500000 }),
  p("p16", "c-var", "USB Charger Mobil", "usb-charger-mobil", "Generic", "FIXED", { price: 120000 }),
];

export const seedGallery: GalleryItem[] = [
  { id: "g1", title: "Servis AC — Cleaning Evaporator", vehicle: "Honda BR-V", image_url: img("photo-1486262715619-67b85e0b08d3"), type: "AC", published: true },
  { id: "g2", title: "Ganti Kompresor AC", vehicle: "Toyota Avanza", image_url: img("photo-1487754180451-c456f719a1fc"), type: "AC", published: true },
  { id: "g3", title: "Perbaikan Power Window", vehicle: "Daihatsu Xenia", image_url: img("photo-1503376780353-7e6692767b70"), type: "Power Window", published: true },
  { id: "g4", title: "Upgrade Audio + Subwoofer", vehicle: "Honda Jazz", image_url: img("photo-1470225620780-dba8ba36b745"), type: "Audio", published: true },
  { id: "g5", title: "Before/After Evaporator", vehicle: "Suzuki Ertiga", image_url: img("photo-1632731354486-4b9e4b4d3e5f"), before_image_url: img("photo-1486262715619-67b85e0b08d3"), after_image_url: img("photo-1487754180451-c456f719a1fc"), type: "Before After", published: true },
  { id: "g6", title: "Instalasi Central Lock", vehicle: "Toyota Kijang", image_url: img("photo-1449965408869-eaa3f722e40d"), type: "Central Lock", published: true },
];

export const seedFaq: Faq[] = [
  { id: "f1", category: "Konsultasi", question: "Bagaimana cara bertanya / konsultasi?", answer: "Isi form singkat di halaman Konsultasi — pesanmu langsung terbuka sebagai chat WhatsApp. Tanpa akun, tanpa antre.", sort_order: 1, active: true },
  { id: "f2", category: "Product", question: "Apakah harga di website sudah termasuk pemasangan?", answer: "Tergantung produk. Lihat detail produk — bila tertulis 'Hubungi kami', tanyakan estimasi termasuk pasang via WhatsApp.", sort_order: 2, active: true },
  { id: "f3", category: "AC", question: "AC tidak dingin, apa penyebabnya?", answer: "Bisa karena freon kurang/bocor, kompresor lemah, kondensor kotor, evaporator kotor, atau kelistrikan. Perlu pemeriksaan langsung untuk memastikan.", sort_order: 3, active: true },
  { id: "f4", category: "Warranty", question: "Apakah ada garansi?", answer: "Garansi mengikuti nota bengkel dan ketentuan tiap produk/jasa. Tanyakan detail garansi sebelum pengerjaan.", sort_order: 4, active: true },
  { id: "f5", category: "Location", question: "Di mana lokasi bengkel?", answer: "Jl. K.H. Asmawi, Kalijaya, Kec. Cikarang Barat, Kabupaten Bekasi, Jawa Barat 17530. Klik peta di homepage/kontak untuk rute Google Maps.", sort_order: 5, active: true },
  { id: "f6", category: "Konsultasi", question: "Apakah bisa home service (teknisi ke rumah)?", answer: "Bisa. Pilih tipe Home Service di form konsultasi dan isi alamat lengkap. Area utama Cikarang Barat & sekitarnya; biaya kunjungan diinformasikan transparan via WhatsApp.", sort_order: 6, active: true },
];

export const seedSettings: SiteSettings = {
  business_name: "Specialist AC Mobil & Variasi",
  tagline: "Spesialis AC Mobil, Power Window, Central Lock, Audio & Variasi",
  whatsapp: "6282111906994",
  phone: "0821-1190-6994",
  email: "info@specialist-ac.local",
  address: "Jl. K.H. Asmawi, Kalijaya, Kec. Cikarang Barat, Kabupaten Bekasi, Jawa Barat 17530, Indonesia",
  maps_url: "https://www.google.com/maps/search/?api=1&query=-6.253777,107.140374",
  opening_hours: {
    Monday: "08:00 - 17:00", Tuesday: "08:00 - 17:00", Wednesday: "08:00 - 17:00",
    Thursday: "08:00 - 17:00", Friday: "08:00 - 17:00", Saturday: "08:00 - 15:00", Sunday: "Tutup",
  },
  social_links: { Instagram: "", Facebook: "", TikTok: "", YouTube: "" },
  default_seo_title: "Specialist AC Mobil & Variasi",
  default_seo_description: "Spesialis AC mobil, power window, central lock, audio mobil & variasi di Cikarang Barat. Konsultasi gratis via WhatsApp.",
};
