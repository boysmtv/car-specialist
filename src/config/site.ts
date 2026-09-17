export const siteDefaults = {
  name: "Specialist AC Mobil & Variasi",
  tagline: "Spesialis AC Mobil, Power Window, Central Lock, Audio & Variasi",
  whatsapp: process.env.NEXT_PUBLIC_WA_NUMBER || "6282111906994",
  address: "Jl. K.H. Asmawi, Kalijaya, Kec. Cikarang Barat, Kabupaten Bekasi, Jawa Barat 17530, Indonesia",
  addressShort: "Jl. K.H. Asmawi, Kalijaya, Cikarang Barat",
  lat: -6.253777,
  lng: 107.140374,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=-6.253777,107.140374",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/layanan", label: "Layanan" },
  { href: "/produk", label: "Produk" },
  { href: "/galeri", label: "Galeri" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
];

export const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/products", label: "Produk", icon: "box" },
  { href: "/admin/services", label: "Layanan", icon: "wrench" },
  { href: "/admin/gallery", label: "Galeri", icon: "image" },
  { href: "/admin/settings", label: "Pengaturan", icon: "settings" },
];
