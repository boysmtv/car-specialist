# Specialist AC Mobil & Variasi — Web Jualan (Katalog + Chat WA)

Web fokus **jualan**: katalog produk & layanan, galeri hasil kerja, peta lokasi, dan form konsultasi yang langsung terkirim sebagai **chat WhatsApp**. Tanpa sistem booking, tanpa database pelanggan.

## Jalankan lokal

```bash
npm install
cp .env.example .env.local
npm run dev
# buka http://localhost:3000
# admin: http://localhost:3000/admin/login
#   email: admin@specialist-ac.local / password: admin123
```

Tanpa env Supabase, website memakai **seed data** + demo lokal. Dengan env terisi, katalog dibaca dari database.

## Alur konsultasi (tanpa booking)

1. Pelanggan isi form di `/konsultasi`: nama, jenis mobil, layanan (opsional), tipe (bengkel/home service), keluhan.
2. Pesan otomatis terbuka sebagai chat WhatsApp ke nomor bengkel — tinggal tekan kirim.
3. Tidak ada data tersimpan di website.

`/booking` di-redirect permanen ke `/konsultasi`.

## Admin (hanya 4 menu + login)

Login di `/admin/login`, lalu kelola:

- **Produk** — tambah/edit/hapus katalog jualan
- **Layanan** — tambah layanan & ubah status aktif
- **Galeri** — upload foto hasil pekerjaan (bukti jualan)
- **Pengaturan** — nomor WA, alamat & jam operasional

## Struktur

- `src/app`: `/`, `/layanan`, `/produk`, `/galeri`, `/promo`, `/konsultasi`, `/tentang`, `/kontak`, `/admin/*`
- `src/app/api`: `upload/sign` (Cloudinary), `revalidate`
- `src/lib`: `data.ts` (Supabase-first, seed fallback), `validations` (Zod), `whatsapp.ts`, `maps.ts`, `utils.ts`
- `supabase/migrations/0001_init.sql`: schema katalog + RLS + seed (tanpa tabel booking)

## Lokasi

Jl. K.H. Asmawi, Kalijaya, Kec. Cikarang Barat, Kabupaten Bekasi, Jawa Barat 17530
Koordinat: `-6.253777, 107.140374` (link & embed Maps memakai koordinat akurat, tanpa API key).
