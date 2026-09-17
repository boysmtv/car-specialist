import type { Category, Faq, SiteSettings } from "@/types";

// Taksonomi kategori (struktur katalog, bukan data mock).
// Produk, layanan & galeri TIDAK punya seed — semua diisi lewat /admin.
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
