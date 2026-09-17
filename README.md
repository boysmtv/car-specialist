# Specialist AC Mobil & Variasi — Web Jualan (Katalog + Chat WA)

Web fokus **jualan**: katalog produk & layanan, galeri hasil kerja, peta lokasi, dan form konsultasi yang langsung terkirim sebagai **chat WhatsApp**. Tanpa sistem booking, tanpa database pelanggan.

## Jalankan lokal

```bash
npm install
cp .env.example .env.local
npm run dev
# buka http://localhost:3000
# admin: http://localhost:3000/admin/login (akun Supabase, tanpa Supabase tidak bisa login)
```

Tanpa env Supabase, website berjalan mode lokal (data admin tersimpan di server dev). Dengan env terisi, katalog dibaca dari database.

## Setup production (Supabase — wajib agar admin permanen di Vercel)

1. Buat project di supabase.com (atau via Vercel Storage) → jalankan **berurutan** di SQL Editor:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_admin_storage.sql` (hak tulis admin + bucket foto `images`)
2. Auth → nonaktifkan **Enable sign ups** (admin-only). Buat user admin manual → insert ke `profiles` dengan role `ADMIN`:
   ```sql
   insert into profiles (id, email, name, role) values ('UID_ADMIN', 'email@kamu', 'Admin', 'ADMIN');
   ```
3. Isi env di Vercel: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_WA_NUMBER=6282111906994` → Redeploy.
4. Login `/admin/login` **dengan akun Supabase** → tambah layanan/produk/galeri → langsung tampil permanen.

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
