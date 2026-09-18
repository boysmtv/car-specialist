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

## 3. Arsitektur data (PRODUCTION — Supabase saja)

Semua baca/tulis langsung ke Supabase. Tidak ada seed mock, demo file,
maupun localStorage untuk konten (sesi login tetap di browser, itu wajar).

- Env dibaca via `src/lib/supabase/env.ts` (mendukung nama normal maupun
  double `..._SUPABASE_SUPABASE_*` dari integrasi Vercel).
- Tulis admin: `src/lib/adminDb.ts` (CRUD + upload ke bucket `images`).
- Baca publik: `src/lib/data.ts` (repository server). Kosong = tampil empty state.
- Halaman detail (`produk/[slug]`, `layanan/[slug]`) WAJIB `export const dynamic = "force-dynamic"`
  dan TANPA `generateStaticParams` (lihat gotcha §7). List + homepage boleh ISR.
- Setiap mutasi admin memanggil `POST /api/revalidate` untuk path list (detail selalu fresh, tidak perlu).

## 4. Struktur penting

- `src/app/page.tsx` — homepage (hero, layanan + tombol "Lihat semua layanan", banner home-service, produk, galeri, lokasi, CTA)
- `src/app/` — `layanan/`, `produk/` (+ `[slug]/` detail, force-dynamic), `galeri/`, `konsultasi/` (form → WA, tanpa DB), `tentang/`, `kontak/`, `sitemap.ts`, `robots.ts` (tanpa route group; JANGAN tulis `(publik)`)
- `src/app/admin/` — `login/`, `dashboard/` (kartu + status DB), `products/`, `services/`, `gallery/`, `settings/`
- `src/app/api/` — `health/` (diagnosa DB, publik), `revalidate/`
- `src/lib/` — `data.ts` (repository server), `adminDb.ts` (CRUD browser + upload Storage), `supabase/*`, `maps.ts` (koordinat `-6.253777,107.140374`), `whatsapp.ts`, `auth.ts` (sesi token 30 menit), `utils.ts`
- `src/components/` — `layout/` (Navbar/Footer/MobileCTA), `marketing/` (cards, LocationSection, ConsultForm), `admin/` (AdminShell + guard)
- `supabase/migrations/` — `0001` (skema+RLS+seed kategori), `0002` (RLS admin+bucket `images`), `0003` (konten default). Semua idempoten, urut jalan.
- `src/data/seed.ts` — HANYA default info bisnis (nama/alamat/WA) sebagai fallback terakhir. Jangan tambah mock konten.

## 5. Konvensi

- Server Components default; `"use client"` hanya untuk form/interaktif.
- Styling: utility `container-x`, `card`/`card-luxe`, `btn`/`btn-gold`/`btn-wa`/`btn-outline`, `badge-gold`, `input`/`label` (lihat `globals.css`). Jangan hardcode navy/gold lama.
- Icon layanan: string di `SERVICE_ICONS` (`ServiceIcon.tsx`), bukan komponen di DB.
- Harga: `FIXED` pakai `price`, `START_FROM` pakai `price_min`, `CONTACT` tanpa harga. (RANGE legacy, jangan dipakai di form.)
- Produk butuh ≥1 foto (cover = pertama). Galeri upload file saja (max 2MB), tanpa URL.
- Slug produk/layanan otomatis dari nama; jangan tampilkan input slug.
- Mobile-first: tombol `w-full sm:w-auto`, tabel `overflow-x-auto`, grid `2→3→4 kolom`.

## 6. Auth admin

- Login HANYA akun Supabase (`src/lib/auth.ts`). Tidak ada akun demo — jangan pernah menambahkannya lagi.
- Sesi login = token acak, expiry 30 menit (fixed, tidak sliding), divalidasi tiap baca + cek berkala 30 detik + cek saat `pageshow`/`focus` (lawan tombol back). Sidebar menampilkan badge hijau (Supabase, bisa simpan) / kuning (tanpa sesi Supabase, tidak bisa simpan).
- Halaman `/admin/login` me-redirect ke dashboard bila sesi masih berlaku.
- Di Vercel WAJIB login akun Supabase (buat di Auth → Users, centang Auto Confirm) + migrasi 0001→0002→0003.

## 7. Gotcha yang sudah kejadian (jangan ulangi)

- JANGAN pakai `generateStaticParams` di halaman yang query Supabase via `createServerSupabase()`
  (`cookies()` dari `next/headers`): di Vercel bikin route detail 500 deterministik
  (list 200, data bersih, komponen sehat — tetap 500; terbukti 18 Sep 2026 di
  `/produk/[slug]` + `/layanan/[slug]`). Solusi: `export const dynamic = "force-dynamic"`,
  tanpa `generateStaticParams`/`revalidate`. Bonus: edit admin langsung tampil, bebas cache-404.
- Halaman LIST + `revalidate`: 404 ikut ter-cache! Tiap tambah/hapus wajib revalidate path list.
- `next start` lama bisa tetap pegang port — kill by PID (`dist\bin\next`) sebelum start baru, lalu verifikasi BUILD_ID/konten.
- Env `NEXT_PUBLIC_*` tertanam saat build → redeploy TANPA cache setelah ubah env.
- Nama env integrasi Vercel bisa double (`...SUPABASE_SUPABASE_URL`) — sudah ditangani `supabase/env.ts`.
- Kategori pakai UUID tetap (lihat migrasi 0001) — jangan pakai `c-ac` dkk di DB.
- Jangan commit `.env*`, `node_modules`, `.next`, folder memory lokal.

## 8. Verifikasi sebelum selesai

1. `npx tsc --noEmit` bersih, `npm run build` sukses, `npm test` hijau.
2. Restart server lokal, cek halaman diubah + `/api/health`.
3. Untuk perubahan auth/admin: cek alur login → redirect dashboard, back-button → tetap wajib login bila sesi habis.
4. `git add -A && git commit && git push` (identitas `boysmtv`).
