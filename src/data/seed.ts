import type { SiteSettings } from "@/types";

// Nilai default info bisnis (konten asli, bukan mock).
// Dipakai hanya bila tabel site_settings di database belum ada.
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
