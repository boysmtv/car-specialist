# AGENTS.md — Specialist AC Mobil & Variasi

Panduan untuk AI agent yang mengerjakan repo ini. Baca sebelum coding.

## 1. Gambaran

Web jualan bengkel mobil (Cikarang Barat): katalog produk + layanan + galeri +
peta + form konsultasi yang membuka chat WhatsApp. **Tanpa booking, tanpa cart,
tanpa pembayaran.** Admin CMS ringan (login, kelola Produk/Layanan/Galeri/Pengaturan).

- **Stack:** Next.js 14 App Router, React 18, TypeScript strict, Tailwind 3,
  Supabase (Postgres + Auth + Storage), Zod, React Hook Form, lucide-react, sonner.
- **Deploy:** Vercel (`main` auto-deploy). Lokal: `npm run dev` / `npm run start -p 3001`.
- **Bahasa UI:** Indonesia. Tema: putih + orange soft (`primary #E8722A`).

## 2. Perintah

```bash
npm install
npm run dev          # dev server :3000
npm run build        # WAJIB lolos sebelum commit
npx tsc --noEmit     # typecheck
npm test             # vitest (utils + session)
npm run start -- -p 3001   # serve build production lokal
```

## 3. Arsitektur data (PENTING — 3 lapis)

Urutan baca: **Supabase (bila env ada) → file `demo-data.json` → kosong**.
Tidak ada lagi seed mock untuk produk/layanan/galeri.

| Lapis | Lokasi | Kapan dipakai |
|---|---|---|
| Supabase | env `NEXT_PUBLIC_SUPABASE_URL` + `..._ANON_KEY` (atau nama double `..._SUPABASE_SUPABASE_*` dari integrasi Vercel — lihat `src/lib/supabase/env.ts`) | Production. Satu-satunya yang permanen di Vercel |
| demo file | `demo-data.json` (gitignored) via `src/lib/demoStore.ts` + `POST/DELETE /api/demo` | Dev lokal tanpa Supabase |
| localStorage | `demo_*`, `site_*` di browser | Fallback terakhir, hanya browser sendiri |

- Tulis admin: Supabase dulu (`src/lib/adminDb.ts`), gagal → demo API, gagal → localStorage.
- Setiap mutasi demo memanggil `revalidatePath` list + detail (anti cache-404).
- `demo-data.json` JANGAN di-commit. Data user lokal jangan dihapus tanpa izin.

## 4. Struktur penting

- `src/app/page.tsx` — homepage (hero, layanan, banner home-service, produk, galeri, lokasi, CTA)
- `src/app/(publik)` — `layanan/`, `produk/`, `galeri/`, `konsultasi/` (form → WA, tanpa DB), `tentang/`, `kontak/`, `sitemap.ts`, `robots.ts`
- `src/app/admin/` — `login/`, `dashboard/` (kartu + status DB), `products/`, `services/`, `gallery/`, `settings/`
- `src/app/api/` — `demo/` (CRUD demo+revalidate), `health/` (diagnosa DB, publik), `revalidate/`, `upload/sign/` (legacy)
- `src/lib/` — `data.ts` (repository server), `adminDb.ts` (CRUD browser), `demoStore.ts` (fs, server-only!), `supabase/*`, `maps.ts` (koordinat `-6.253777,107.140374`), `whatsapp.ts`, `auth.ts` (sesi token 12 jam), `utils.ts`
- `src/components/` — `layout/` (Navbar/Footer/MobileCTA), `marketing/` (cards, LocationSection, ConsultForm), `admin/` (AdminShell + guard)
- `supabase/migrations/` — `0001` (skema+RLS+seed kategori), `0002` (RLS admin+bucket `images`), `0003` (konten default). Semua idempoten, urut jalan.
- `src/data/seed.ts` — HANYA kategori, FAQ, settings default. Jangan tambah mock konten.

## 5. Konvensi

- Server Components default; `"use client"` hanya untuk form/interaktif.
- Styling: utility `container-x`, `card`/`card-luxe`, `btn`/`btn-gold`/`btn-wa`/`btn-outline`, `badge-gold`, `input`/`label` (lihat `globals.css`). Jangan hardcode navy/gold lama.
- Icon layanan: string di `SERVICE_ICONS` (`ServiceIcon.tsx`), bukan komponen di DB.
- Harga: `FIXED` pakai `price`, `START_FROM` pakai `price_min`, `CONTACT` tanpa harga. (RANGE legacy, jangan dipakai di form.)
- Produk butuh ≥1 foto (cover = pertama). Galeri upload file saja (max 2MB), tanpa URL.
- Slug produk/layanan otomatis dari nama; jangan tampilkan input slug.
- Mobile-first: tombol `w-full sm:w-auto`, tabel `overflow-x-auto`, grid `2→3→4 kolom`.

## 6. Auth admin

- Login Supabase-first (`src/lib/auth.ts` + `src/lib/supabase/client.ts`), fallback demo lokal `admin@specialist-ac.local / admin123`.
- Sesi demo = token acak, expiry 12 jam, divalidasi tiap baca. Sidebar menampilkan badge hijau (Supabase) / kuning (Demo).
- Di Vercel WAJIB login akun Supabase (buat di Auth → Users, centang Auto Confirm) + migrasi 0001→0002→0003.

## 7. Gotcha yang sudah kejadian (jangan ulangi)

- Halaman dinamis + `revalidate`: 404 ikut ter-cache! Tiap tambah/hapus wajib revalidate path list DAN detail.
- `next start` lama bisa tetap pegang port — kill by PID (`dist\bin\next`) sebelum start baru, lalu verifikasi BUILD_ID/konten.
- Env `NEXT_PUBLIC_*` tertanam saat build → redeploy TANPA cache setelah ubah env.
- Nama env integrasi Vercel bisa double (`...SUPABASE_SUPABASE_URL`) — sudah ditangani `supabase/env.ts`.
- Kategori pakai UUID tetap (lihat migrasi 0001) — jangan pakai `c-ac` dkk di DB.
- Jangan commit `demo-data.json`, `.env*`, `node_modules`, `.next`, folder memory lokal.

## 8. Verifikasi sebelum selesai

1. `npx tsc --noEmit` bersih, `npm run build` sukses, `npm test` hijau.
2. Restart server lokal, cek halaman diubah + `/api/health`.
3. `git add -A && git commit && git push` (identitas `boysmtv`).
