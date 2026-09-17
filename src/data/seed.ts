import type { Category, Faq, SiteSettings } from "@/types";

// Taksonomi kategori (struktur katalog, bukan data mock).
// Produk, layanan & galeri TIDAK punya seed — semua diisi lewat /admin.
export const seedCategories: Category[] = [
  { id: "1907348e-6a06-44fb-8975-29467f209298", name: "AC Mobil", slug: "ac-mobil", description: "Komponen & servis AC mobil", sort_order: 1, active: true },
  { id: "6c7728d0-c63b-4696-9665-7a05a8a2551c", name: "Power Window", slug: "power-window", description: "Motor, regulator & switch", sort_order: 2, active: true },
  { id: "d6269a66-672a-451c-8a3a-7e4eeb46827a", name: "Central Lock", slug: "central-lock", description: "Actuator, modul & remote", sort_order: 3, active: true },
  { id: "585f6f08-a64b-4844-8bad-360c5e484c1d", name: "Audio", slug: "audio", description: "Head unit, speaker & amplifier", sort_order: 4, active: true },
  { id: "9cb36fbb-2e91-412b-81b4-c7672fc22a16", name: "Electrical", slug: "electrical", description: "Kelistrikan mobil", sort_order: 5, active: true },
  { id: "b6420654-d5c1-42fc-b3a2-60e3503d6cf2", name: "Interior", slug: "interior", description: "Aksesori interior", sort_order: 6, active: true },
  { id: "904298f8-fc17-49f0-ba06-ea3707ce1485", name: "Exterior", slug: "exterior", description: "Aksesori exterior", sort_order: 7, active: true },
  { id: "f89ad157-9e33-45af-86ad-69cdad611f5e", name: "Variasi", slug: "variasi", description: "Variasi & aksesori umum", sort_order: 8, active: true },
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
