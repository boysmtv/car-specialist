# PRD — Specialist AC Mobil & Variasi

**Versi:** 1.0  
**Status:** Ready for Development  
**Platform:** Web  
**Deployment:** Vercel  
**Primary Language:** Bahasa Indonesia  
**Primary Device:** Mobile-first, responsive desktop/tablet  
**Business Type:** Bengkel AC Mobil, Kelistrikan, Audio, dan Variasi Mobil  

---

## 1. Executive Summary

Website ini adalah **digital storefront + katalog produk + booking service + lead management sederhana** untuk bengkel **Specialist AC Mobil & Variasi**.

Tujuan utama aplikasi bukan membuat e-commerce kompleks, tetapi:

1. Membuat pelanggan cepat memahami layanan bengkel.
2. Menampilkan produk dan spare part yang tersedia.
3. Menampilkan hasil pekerjaan / before-after.
4. Mengarahkan pelanggan ke WhatsApp.
5. Memungkinkan pelanggan mengirim permintaan booking.
6. Memberikan admin dashboard sederhana untuk:
   - Login.
   - Menambah produk.
   - Mengubah produk.
   - Menghapus / nonaktifkan produk.
   - Mengatur kategori.
   - Mengelola layanan.
   - Mengelola booking.
   - Mengelola galeri.
   - Mengubah informasi kontak dan jam operasional.
7. Tetap ringan, cepat, SEO-friendly, mudah di-maintain, dan siap dikembangkan lebih besar.

Website harus terlihat **modern, profesional, otomotif, bersih, cepat, dan meyakinkan**.

---

# 2. Business Context

Berdasarkan informasi awal dari toko, layanan yang terlihat mencakup:

- AC Mobil
- Power Window
- Central Lock
- Power Door
- Audio Car
- Variasi Mobil

Informasi awal yang terlihat dari foto toko:

- Alamat: **55 Jl. K.H. Asmawi**
- WhatsApp: **0821-1190-6994**

> Semua alamat, nomor telepon, jam operasional, harga, garansi, merek produk, dan detail lainnya wajib dapat diubah melalui halaman admin agar tidak hardcoded.

---

# 3. Product Vision

Membuat website bengkel yang terasa seperti website workshop modern, bukan website company profile lama.

Website harus membantu pengguna menjawab 5 pertanyaan utama:

1. Bengkel ini bisa memperbaiki apa?
2. Produk apa saja yang tersedia?
3. Berapa estimasi harga atau bagaimana cara bertanya harga?
4. Di mana lokasinya?
5. Bagaimana cara booking atau menghubungi bengkel?

---

# 4. Goals

## 4.1 Business Goals

- Meningkatkan jumlah lead dari website.
- Meningkatkan klik WhatsApp.
- Meningkatkan booking.
- Meningkatkan kunjungan ke bengkel.
- Membantu pelanggan menemukan produk yang tersedia.
- Meningkatkan kepercayaan pelanggan.
- Memudahkan admin memperbarui produk tanpa developer.

## 4.2 Product Goals

- Cepat dibuka.
- Mobile-first.
- SEO-friendly.
- Admin sangat sederhana.
- Tidak membingungkan pelanggan.
- CTA jelas.
- Produk mudah dicari.
- Bisa dikembangkan menjadi sistem service history di masa depan.

---

# 5. Non-Goals MVP

Pada MVP belum wajib memiliki:

- Marketplace multi-vendor.
- Sistem pembayaran online.
- Cart kompleks.
- Checkout otomatis.
- Inventory enterprise.
- Integrasi ERP.
- Loyalty points.
- Customer account.
- Live chat internal.
- POS.
- Invoice otomatis.

Semua fitur tersebut dapat masuk fase berikutnya.

---

# 6. User Roles

## 6.1 Visitor / Customer

Tidak perlu login.

Dapat:

- Melihat homepage.
- Melihat layanan.
- Melihat detail layanan.
- Melihat produk.
- Search produk.
- Filter produk.
- Melihat detail produk.
- Membuka galeri.
- Melihat promo.
- Booking.
- Klik WhatsApp.
- Klik telepon.
- Buka Google Maps.
- Mengirim pertanyaan produk.

## 6.2 Admin

Harus login.

Dapat:

- Login.
- Logout.
- Melihat dashboard.
- Mengelola produk.
- Mengelola kategori.
- Mengelola layanan.
- Mengelola galeri.
- Mengelola promo.
- Mengelola booking.
- Mengelola FAQ.
- Mengelola informasi bisnis.
- Mengelola gambar.
- Mengubah status ketersediaan produk.

Untuk MVP cukup **1 role: ADMIN**.

---

# 7. Recommended Tech Stack

## Frontend + Backend Web

- **Next.js App Router**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Lucide Icons**

## Database

- **Supabase PostgreSQL**

## Authentication

- **Supabase Auth**
- Email + password
- Admin-only

## Image Storage

Pilihan utama:

- **Cloudinary**

Alternatif:

- Supabase Storage

Rekomendasi untuk katalog produk dengan banyak gambar:

**Cloudinary** karena resize, CDN, auto-format, dan optimization lebih matang.

## Form

- React Hook Form
- Zod

## State Management

Gunakan seminimal mungkin.

- Server state: Server Components + Next.js data fetching
- Form: React Hook Form
- Client state sederhana: Zustand hanya jika memang dibutuhkan

Jangan menggunakan global state untuk data yang sebenarnya bisa berasal dari server.

## Analytics

- Vercel Web Analytics
- Vercel Speed Insights

Optional:

- Google Analytics
- Google Search Console

## Error Monitoring

Optional:

- Sentry

## Deployment

- Vercel

## Repository

- GitHub

---

# 8. High-Level Architecture

```text
Customer Browser
       |
       v
+--------------------------+
| Next.js Application      |
| - Public Website         |
| - Admin Dashboard        |
| - Server Components      |
| - Server Actions / API   |
+--------------------------+
       |
       +--------------------+
       |                    |
       v                    v
+--------------+     +--------------+
| Supabase     |     | Cloudinary   |
| PostgreSQL   |     | Images / CDN |
| Auth         |     +--------------+
+--------------+
       |
       v
+----------------+
| Booking / CMS  |
+----------------+
```

---

# 9. Recommended Folder Structure

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── layanan/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── produk/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── galeri/
│   │   ├── promo/
│   │   ├── booking/
│   │   ├── tentang/
│   │   └── kontak/
│   │
│   ├── admin/
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── services/
│   │   ├── bookings/
│   │   ├── gallery/
│   │   ├── promotions/
│   │   ├── faq/
│   │   └── settings/
│   │
│   ├── api/
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── marketing/
│   └── admin/
│
├── features/
│   ├── auth/
│   ├── products/
│   ├── services/
│   ├── bookings/
│   ├── gallery/
│   └── settings/
│
├── lib/
│   ├── supabase/
│   ├── cloudinary/
│   ├── validations/
│   ├── auth/
│   ├── seo/
│   └── utils/
│
├── server/
│   ├── repositories/
│   ├── services/
│   └── actions/
│
├── types/
└── config/
```

---

# 10. Public Website Information Architecture

## Main Navigation

- Home
- Layanan
- Produk
- Galeri
- Promo
- Tentang
- Kontak

Primary CTA:

- Booking
- WhatsApp

---

# 11. Homepage

## 11.1 Header

Desktop:

```text
[LOGO]

Home
Layanan
Produk
Galeri
Promo
Tentang
Kontak

[Booking]
[WhatsApp]
```

Mobile:

```text
[LOGO]                    [Menu]
```

Menu drawer berisi seluruh navigasi.

Header:

- Sticky
- Blur background saat scroll
- Tidak terlalu tinggi
- CTA tetap terlihat

---

# 12. Hero Section

## Headline

Contoh:

> AC Mobil Bermasalah? Biar Kami Cek.

Alternatif:

> AC Dingin Lagi. Mobil Nyaman Lagi.

## Description

```text
Spesialis AC Mobil, Power Window, Central Lock,
Audio Mobil, dan berbagai kebutuhan variasi kendaraan.
```

## CTA

Primary:

**Booking Service**

Secondary:

**Chat WhatsApp**

Tertiary:

**Lihat Layanan**

## Hero Visual

Gunakan:

- Foto bengkel asli.
- Mobil sedang dikerjakan.
- Teknisi.
- Foto tools / service bay.

Hindari gambar AI generik jika foto bengkel asli tersedia.

---

# 13. Quick Service Section

Tampilkan 6 layanan utama:

### AC Mobil

Icon:
Snowflake

Description:

> Pemeriksaan dan perbaikan sistem AC mobil dari pendinginan, blower, hingga komponen AC.

---

### Power Window

Icon:
Car Front / Panel

Description:

> Pemeriksaan kaca elektrik yang macet, lambat, atau tidak berfungsi.

---

### Central Lock

Icon:
Lock

Description:

> Diagnosa sistem central lock, actuator, remote, module, dan wiring.

---

### Power Door

Icon:
Door Open

Description:

> Pemeriksaan dan instalasi sistem pintu elektrik sesuai dukungan kendaraan.

---

### Audio Car

Icon:
Speaker

Description:

> Head unit, speaker, amplifier, subwoofer, wiring, dan troubleshooting audio.

---

### Variasi Mobil

Icon:
Wrench

Description:

> Berbagai kebutuhan aksesori dan variasi interior maupun eksterior kendaraan.

---

# 14. Problem Finder Section

Section ini membantu customer berdasarkan gejala.

Judul:

> Masalah mobil kamu apa?

Cards:

- AC tidak dingin
- AC bau
- Blower tidak keluar angin
- Kaca mobil macet
- Power window lambat
- Central lock tidak bekerja
- Remote tidak merespons
- Speaker mati
- Audio noise
- Head unit bermasalah
- Ingin upgrade audio
- Cari variasi mobil

Setiap card menuju layanan yang relevan.

---

# 15. Why Choose Us

Gunakan value proposition yang aman dan faktual.

Contoh:

- Pemeriksaan terlebih dahulu
- Estimasi sebelum pengerjaan
- Pilihan perbaikan sesuai kebutuhan
- Komunikasi mudah melalui WhatsApp
- Produk dapat dikonsultasikan sesuai kendaraan
- Dokumentasi pekerjaan

Jangan menggunakan klaim seperti:

- Nomor 1
- Termurah
- Terbaik se-Indonesia

kecuali memiliki bukti objektif.

---

# 16. Services Page

Route:

```text
/layanan
```

Layout:

- Page title
- Intro
- Search layanan
- Service category cards
- CTA booking

---

# 17. Service Detail Page

Route:

```text
/layanan/[slug]
```

Contoh:

```text
/layanan/ac-mobil
```

Isi:

1. Breadcrumb
2. Judul
3. Hero image
4. Deskripsi layanan
5. Gejala umum
6. Kemungkinan penyebab
7. Pemeriksaan yang dilakukan
8. Proses pengerjaan
9. Estimasi waktu
10. Harga mulai / hubungi bengkel
11. Produk terkait
12. Galeri terkait
13. FAQ
14. CTA Booking
15. CTA WhatsApp

---

# 18. AC Mobil Service Catalog

Sub-services:

- General Check AC
- Servis AC
- Cleaning AC
- Isi refrigerant / freon
- Leak check
- Compressor check
- Evaporator check
- Condenser check
- Blower check
- Magnetic clutch check
- Thermostat / sensor check
- Cabin filter replacement
- Expansion valve check
- AC electrical check

> Nama layanan dan scope final harus dikonfirmasi oleh pemilik bengkel.

---

# 19. Power Window Services

- Power window mati
- Kaca lambat
- Kaca tersendat
- Kaca tidak naik
- Kaca tidak turun
- Motor power window
- Regulator
- Switch
- Wiring
- Fuse
- Relay
- Mechanism check

---

# 20. Central Lock Services

- Actuator
- Lock/unlock tidak serempak
- Remote
- Receiver/module
- Wiring
- Fuse
- Integration dengan alarm jika didukung

---

# 21. Audio Car Services

- Head unit
- Speaker
- Tweeter
- Amplifier
- Subwoofer
- Audio wiring
- Fuse
- Audio grounding
- Noise troubleshooting
- Speaker replacement
- Head unit installation
- Audio upgrade consultation

---

# 22. Product Catalog

Route:

```text
/produk
```

---

# 23. Product Category

Kategori awal:

1. AC Mobil
2. Power Window
3. Central Lock
4. Audio
5. Electrical
6. Interior
7. Exterior
8. Variasi
9. Accessories

Admin dapat membuat kategori baru.

---

# 24. Product Search

Search berdasarkan:

- Product name
- Brand
- SKU
- Part number
- Category
- Vehicle
- Keywords

---

# 25. Product Filter

Filter:

- Category
- Brand
- Availability
- Price range
- Vehicle
- Featured

---

# 26. Product Sorting

- Terbaru
- Nama A-Z
- Nama Z-A
- Harga rendah
- Harga tinggi

---

# 27. Product Card

Product card berisi:

- Product image
- Product name
- Brand
- Category
- Price / Harga mulai
- Availability
- CTA Detail
- CTA WhatsApp

Contoh:

```text
┌───────────────────────┐
│      PRODUCT IMAGE    │
│                       │
├───────────────────────┤
│ Denso Cabin Filter    │
│ AC Mobil              │
│ Mulai Rp xxx.xxx      │
│ Tersedia              │
│                       │
│ [Lihat Detail]        │
└───────────────────────┘
```

---

# 28. Initial Product Seed

Berikut katalog awal yang dapat dimasukkan.

## AC Mobil

### 1. Cabin Filter

Image requirements:

```text
/products/ac/cabin-filter/
  cover.webp
  front.webp
  detail.webp
  installed.webp
```

Fields:

- Name
- Brand
- Vehicle fitment
- Part number
- Price
- Stock status

---

### 2. Compressor AC

Images:

```text
cover.webp
angle.webp
connector.webp
part-number.webp
installed.webp
```

---

### 3. Evaporator

Images:

```text
cover.webp
front.webp
side.webp
part-number.webp
```

---

### 4. Condenser

Images:

```text
cover.webp
front.webp
detail.webp
installed.webp
```

---

### 5. Blower Motor

Images:

```text
cover.webp
connector.webp
side.webp
installed.webp
```

---

### 6. Expansion Valve

Images:

```text
cover.webp
detail.webp
installed.webp
```

---

### 7. Magnetic Clutch

Images:

```text
cover.webp
front.webp
detail.webp
installed.webp
```

---

## Power Window

### 8. Power Window Motor

### 9. Power Window Regulator

### 10. Master Switch

### 11. Single Power Window Switch

---

## Central Lock

### 12. Door Lock Actuator

### 13. Central Lock Module

### 14. Remote Central Lock

---

## Audio

### 15. Head Unit

### 16. Component Speaker

### 17. Coaxial Speaker

### 18. Tweeter

### 19. Amplifier

### 20. Active Subwoofer

### 21. Passive Subwoofer

### 22. Audio Fuse

### 23. Power Cable Kit

### 24. RCA Cable

### 25. Speaker Cable

---

## Variasi

### 26. Interior Accessories

### 27. Exterior Accessories

### 28. Lighting Accessories

### 29. USB Charger

### 30. Parking Accessories

---

# 29. Product Image Policy

Setiap product idealnya memiliki:

- 1 cover
- 1 angle view
- 1 detail
- 1 label / part number
- 1 installed photo

Ideal minimum:

```text
3 images/product
```

Ideal maximum:

```text
6 images/product
```

Recommended:

```text
1200 x 1200
1:1 ratio
WebP / AVIF
```

Upload image harus:

- Compress otomatis.
- Resize otomatis.
- Tidak menyebabkan layout shift.
- Memiliki alt text.
- Bisa diurutkan admin.

---

# 30. Product Detail

Route:

```text
/produk/[slug]
```

Content:

- Breadcrumb
- Product gallery
- Name
- Brand
- Category
- Availability
- Price
- Price mode
- Description
- Specifications
- Part number
- Vehicle compatibility
- Installation information
- Warranty
- Related products
- Related service
- WhatsApp CTA
- Booking CTA

---

# 31. Product Price Modes

Admin dapat memilih:

```text
FIXED
START_FROM
RANGE
CONTACT
```

Example:

```text
FIXED
Rp 750.000
```

```text
START_FROM
Mulai Rp 350.000
```

```text
RANGE
Rp 500.000 – Rp 900.000
```

```text
CONTACT
Hubungi kami
```

---

# 32. Product Availability

Enum:

```text
AVAILABLE
LOW_STOCK
PREORDER
OUT_OF_STOCK
CONTACT
```

UI:

```text
Tersedia
Stok Terbatas
Pre-order
Habis
Tanya Stok
```

---

# 33. Vehicle Fitment

Optional.

Fields:

```text
make
model
year_from
year_to
variant
notes
```

Example:

```text
Honda
BR-V
2016
2021
All Variant
Confirm connector before installation
```

---

# 34. Gallery

Route:

```text
/galeri
```

Categories:

- AC
- Power Window
- Central Lock
- Audio
- Variasi
- Before After

Gallery card:

- Image
- Vehicle
- Service
- Caption
- Date

---

# 35. Before / After

Gunakan compare slider.

Example:

```text
Before
Evaporator kotor

After
Setelah cleaning / replacement
```

Foto harus merupakan pekerjaan asli.

---

# 36. Booking

Route:

```text
/booking
```

Booking adalah **request booking**, bukan konfirmasi otomatis.

---

# 37. Booking Flow

```text
Choose Service
      ↓
Vehicle Data
      ↓
Problem / Complaint
      ↓
Preferred Date
      ↓
Customer Data
      ↓
Review
      ↓
Submit
      ↓
Admin Confirmation
```

---

# 38. Booking Form

## Customer

- Name
- WhatsApp
- Email optional

## Vehicle

- Brand
- Model
- Year
- Variant optional
- License plate optional

## Service

- Service category
- Service
- Product optional

## Complaint

Textarea:

```text
Jelaskan keluhan kendaraan...
```

## Media

Optional:

- Photo
- Video

## Requested Date

- Date
- Preferred time

## Notes

Optional.

---

# 39. Booking Status

```text
NEW
CONTACTED
CONFIRMED
IN_SERVICE
DONE
CANCELLED
```

---

# 40. Booking Code

Format:

```text
BKG-YYYYMMDD-XXXX
```

Example:

```text
BKG-20260917-A82F
```

---

# 41. WhatsApp Integration

Nomor WhatsApp berasal dari setting database.

Default awal:

```text
082111906994
```

Gunakan format international:

```text
6282111906994
```

Contoh message dari product:

```text
Halo Specialist AC Mobil,

Saya ingin menanyakan produk:

Produk: {{product_name}}
Mobil: {{vehicle}}
Tahun: {{year}}
Link: {{product_url}}

Apakah produk tersedia dan berapa estimasi harga pemasangannya?
```

---

# 42. WhatsApp Booking Message

```text
Halo Specialist AC Mobil,

Saya ingin booking.

Nama:
Mobil:
Tahun:
Layanan:
Keluhan:
Tanggal yang diinginkan:
Jam:

Mohon konfirmasinya.
```

---

# 43. Floating WhatsApp

Desktop:

- Bottom-right.
- Icon + text.

Mobile:

Gunakan sticky bottom CTA:

```text
[ WhatsApp ] [ Booking ]
```

---

# 44. Promotions

Route:

```text
/promo
```

Fields:

- Title
- Description
- Banner
- Start date
- End date
- Terms
- CTA
- Active

Expired promo otomatis tidak ditampilkan.

---

# 45. FAQ

Categories:

- AC
- Booking
- Product
- Payment
- Warranty
- Location

Contoh:

### Apakah harus booking?

Tidak wajib jika kebijakan bengkel memperbolehkan walk-in, tetapi booking membantu pelanggan menghubungi bengkel terlebih dahulu.

### Apakah harga di website sudah termasuk pemasangan?

Tergantung produk. Informasi harga pemasangan harus ditampilkan jelas pada detail produk.

---

# 46. Contact Page

Route:

```text
/kontak
```

Contents:

- Address
- WhatsApp
- Phone
- Opening hours
- Maps
- Social media
- CTA direction
- CTA WhatsApp

---

# 47. About Page

Route:

```text
/tentang
```

Content:

- Business story
- Workshop photos
- Service focus
- Facilities
- Work process
- CTA

---

# 48. Footer

Columns:

### Menu

- Home
- Layanan
- Produk
- Galeri
- Booking

### Layanan

- AC Mobil
- Power Window
- Central Lock
- Audio
- Variasi

### Contact

- WhatsApp
- Address
- Opening hours

### Social

- Instagram
- Facebook
- TikTok
- YouTube

---

# 49. Admin Login

Route:

```text
/admin/login
```

UI sederhana.

```text
┌──────────────────────────┐
│ Specialist AC Mobil      │
│ Admin                    │
│                          │
│ Email                    │
│ [____________________]   │
│                          │
│ Password                 │
│ [____________________]   │
│                          │
│ [ Login ]                │
│                          │
└──────────────────────────┘
```

Tidak perlu:

- Register public.
- Social login.
- Google login.

Admin dibuat manual melalui Supabase.

---

# 50. Admin Authentication Flow

```text
/admin/*
       ↓
Check session
       ↓
No Session
       ↓
Redirect /admin/login
       ↓
Login
       ↓
Supabase Auth
       ↓
Validate Admin
       ↓
Dashboard
```

---

# 51. Admin Security

Admin login harus memiliki:

- Email/password auth.
- HTTP-only/session-safe auth handling.
- Route protection.
- Server-side authorization.
- Rate limiting login.
- No public registration.
- Password reset optional.
- RLS.
- Service role key hanya server-side.

---

# 52. Admin Layout

Desktop:

```text
┌─────────────┬─────────────────────────────┐
│ LOGO        │ Header                      │
│             ├─────────────────────────────┤
│ Dashboard   │                             │
│ Products    │ Content                     │
│ Categories  │                             │
│ Services    │                             │
│ Bookings    │                             │
│ Gallery     │                             │
│ Promotions  │                             │
│ FAQ         │                             │
│ Settings    │                             │
│             │                             │
│ Logout      │                             │
└─────────────┴─────────────────────────────┘
```

Mobile:

Sidebar menjadi drawer.

---

# 53. Admin Dashboard

Widgets:

- Total products
- Available products
- Out of stock
- Booking today
- New booking
- Upcoming booking
- WhatsApp clicks optional
- Recent products
- Recent bookings

---

# 54. Product Management

Route:

```text
/admin/products
```

Features:

- Search.
- Filter category.
- Filter availability.
- Add product.
- Edit product.
- Duplicate product.
- Activate/deactivate.
- Delete.
- Pagination.

---

# 55. Add Product

Route:

```text
/admin/products/new
```

Fields:

## General

```text
Product Name*
Slug*
Brand
Category*
SKU
Part Number
```

## Content

```text
Short Description
Full Description
Specifications
Installation Notes
Warranty
```

## Pricing

```text
Price Mode*
Price
Price Min
Price Max
Installation Price
```

## Inventory

```text
Availability*
Stock Quantity optional
```

## Vehicle

```text
Make
Model
Year From
Year To
Variant
Notes
```

Multiple fitment rows allowed.

## Images

```text
Cover Image*
Gallery Images
Alt Text
Sort Order
```

## SEO

```text
SEO Title
SEO Description
```

## Flags

```text
Active
Featured
```

Actions:

```text
[Save Draft]
[Publish]
[Cancel]
```

---

# 56. Product Edit

Route:

```text
/admin/products/[id]/edit
```

Admin dapat:

- Edit semua field.
- Replace cover.
- Tambah image.
- Remove image.
- Drag reorder.
- Change status.
- Publish/unpublish.

---

# 57. Delete Product

Gunakan soft delete.

Field:

```text
deleted_at
```

Jangan hard delete langsung.

Admin confirmation:

```text
Hapus produk ini?

Produk akan disembunyikan dari website.
```

---

# 58. Category Management

Route:

```text
/admin/categories
```

Fields:

```text
name
slug
description
image
sort_order
active
```

---

# 59. Service Management

Route:

```text
/admin/services
```

Fields:

```text
name
slug
short_description
description
symptoms
diagnostics
process
duration
price_mode
price_from
price_to
warranty
image
featured
active
```

---

# 60. Booking Management

Route:

```text
/admin/bookings
```

Columns:

```text
Booking Code
Customer
Vehicle
Service
Requested Date
WhatsApp
Status
Created
```

Actions:

- View.
- Change status.
- Add notes.
- Contact WhatsApp.
- Cancel.
- Mark done.

---

# 61. Booking Detail

Route:

```text
/admin/bookings/[id]
```

Display:

- Customer.
- Vehicle.
- Complaint.
- Selected service.
- Selected product.
- Requested schedule.
- Uploaded media.
- Status history.
- Admin notes.

---

# 62. Gallery Management

Admin dapat:

- Upload image.
- Add title.
- Add service category.
- Add vehicle.
- Mark before / after.
- Add caption.
- Publish/unpublish.

---

# 63. Settings

Route:

```text
/admin/settings
```

Sections:

## Business

- Business name
- Tagline

## Contact

- WhatsApp
- Phone
- Email

## Location

- Address
- Maps URL
- Latitude optional
- Longitude optional

## Opening Hours

Example:

```text
Monday    08:00 - 17:00
Tuesday   08:00 - 17:00
...
Sunday    Closed
```

## Social

- Instagram
- Facebook
- TikTok
- YouTube

## SEO

- Default title
- Default description
- OG image

---

# 64. Database Schema

## admins

Authentication identity berasal dari Supabase Auth.

```sql
profiles
--------
id uuid pk
email text
name text
role text
created_at timestamptz
updated_at timestamptz
```

Role:

```text
ADMIN
```

---

# 65. categories

```sql
categories
----------
id uuid pk
name varchar
slug varchar unique
description text
image_url text
sort_order int
active boolean
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz null
```

---

# 66. products

```sql
products
--------
id uuid pk
category_id uuid fk
name varchar
slug varchar unique
brand varchar
sku varchar
part_number varchar
short_description text
description text
specifications jsonb
installation_notes text
warranty_text text

price_mode varchar
price numeric
price_min numeric
price_max numeric
installation_price numeric

availability varchar
stock_quantity int null

featured boolean
active boolean

seo_title varchar
seo_description text

created_at timestamptz
updated_at timestamptz
deleted_at timestamptz null
```

---

# 67. product_images

```sql
product_images
--------------
id uuid pk
product_id uuid fk
url text
public_id text
alt_text text
sort_order int
is_cover boolean
width int
height int
created_at timestamptz
```

---

# 68. product_fitments

```sql
product_fitments
----------------
id uuid pk
product_id uuid fk
make varchar
model varchar
year_from int
year_to int
variant varchar
notes text
```

---

# 69. services

```sql
services
--------
id uuid pk
name varchar
slug varchar unique
short_description text
description text
symptoms jsonb
diagnostics jsonb
process jsonb
duration_text varchar

price_mode varchar
price_from numeric
price_to numeric

warranty_text text
image_url text

featured boolean
active boolean

seo_title varchar
seo_description text

created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
```

---

# 70. bookings

```sql
bookings
--------
id uuid pk
booking_code varchar unique

customer_name varchar
whatsapp varchar
email varchar null

vehicle_make varchar
vehicle_model varchar
vehicle_year int
vehicle_variant varchar
license_plate varchar

service_id uuid null
product_id uuid null

complaint text

requested_date date
requested_time varchar

status varchar

customer_notes text
admin_notes text

created_at timestamptz
updated_at timestamptz
```

---

# 71. booking_media

```sql
booking_media
-------------
id uuid pk
booking_id uuid fk
url text
media_type varchar
created_at timestamptz
```

---

# 72. gallery

```sql
gallery
-------
id uuid pk
service_id uuid null
title varchar
vehicle varchar
caption text
image_url text
before_image_url text
after_image_url text
type varchar
published boolean
sort_order int
created_at timestamptz
```

---

# 73. promotions

```sql
promotions
----------
id uuid pk
title varchar
slug varchar unique
description text
banner_url text
terms text
start_at timestamptz
end_at timestamptz
active boolean
created_at timestamptz
```

---

# 74. faq

```sql
faq
---
id uuid pk
category varchar
question text
answer text
sort_order int
active boolean
created_at timestamptz
```

---

# 75. site_settings

```sql
site_settings
-------------
id uuid pk
business_name varchar
tagline varchar
whatsapp varchar
phone varchar
email varchar
address text
maps_url text
opening_hours jsonb
social_links jsonb
default_seo_title varchar
default_seo_description text
og_image_url text
updated_at timestamptz
```

---

# 76. Recommended Database Indexes

```sql
products(slug)
products(category_id)
products(active)
products(featured)
products(availability)

categories(slug)

services(slug)
services(active)

bookings(status)
bookings(requested_date)
bookings(created_at)

promotions(active)
promotions(start_at)
promotions(end_at)
```

---

# 77. RLS Strategy

Public user:

Read-only:

```text
categories where active = true
products where active = true AND deleted_at IS NULL
services where active = true
gallery where published = true
promotions where active = true
faq where active = true
site_settings
```

Customer may:

```text
INSERT bookings
INSERT booking_media with restrictions
```

Admin:

Authenticated ADMIN can:

```text
SELECT
INSERT
UPDATE
DELETE / soft delete
```

Semua validasi admin tetap dilakukan server-side.

---

# 78. Image Upload Architecture

Recommended:

```text
Admin Browser
      ↓
Request Signed Upload
      ↓
Next.js Server
      ↓
Cloudinary Signature
      ↓
Browser Upload to Cloudinary
      ↓
Return public_id + secure_url
      ↓
Save metadata to Supabase
```

Jangan expose:

```text
CLOUDINARY_API_SECRET
```

ke browser.

---

# 79. Image Validation

Allowed:

```text
image/jpeg
image/png
image/webp
```

Recommended max:

```text
8 MB
```

Convert delivery:

```text
WebP / AVIF
```

Admin image preview wajib ada.

---

# 80. Design System

## Colors

Recommended base:

```text
Background       #F7F8FA
Surface          #FFFFFF
Primary Dark     #111827
Primary          #0F766E
Accent           #06B6D4
Muted            #6B7280
Border           #E5E7EB
Danger           #DC2626
```

WhatsApp button:

Gunakan official-like WhatsApp green hanya untuk CTA WhatsApp.

---

# 81. Typography

Recommended:

```text
Geist
```

Fallback:

```text
Inter
```

Hierarchy:

```text
H1 48-64 desktop
H1 36-44 mobile

H2 32-40
H3 24-30

Body 16-18
Small 14
```

---

# 82. UI Principles

- Clean.
- Automotive.
- Premium.
- Tidak berlebihan.
- Banyak whitespace.
- Strong photography.
- Strong CTA.
- Cards sederhana.
- Border halus.
- Shadow minimal.
- Motion ringan.

---

# 83. Animation

Duration:

```text
150 - 250ms
```

Allowed:

- Fade.
- Slide up.
- Scale subtle.
- Hover lift.
- Image zoom subtle.

Avoid:

- Parallax berat.
- 3D berlebihan.
- Full page animation.
- Blocking animation.

Respect:

```css
prefers-reduced-motion
```

---

# 84. Responsive Strategy

Breakpoints mengikuti Tailwind.

Priority:

1. Mobile.
2. Tablet.
3. Desktop.
4. Large desktop.

Product grid:

```text
Mobile: 2 columns
Tablet: 3 columns
Desktop: 4 columns
```

Untuk produk dengan nama panjang, card harus tetap konsisten.

---

# 85. Loading UX

Jangan gunakan full-page spinner kecuali sangat diperlukan.

Gunakan:

- Skeleton product cards.
- Skeleton service cards.
- Skeleton gallery.
- Suspense boundary granular.

---

# 86. Performance Requirements

Target:

- Fast initial load.
- Minimal client JS.
- Server Component by default.
- Dynamic import untuk komponen berat.
- Lazy-load image.
- Responsive image.
- CDN.
- Proper cache.

Usahakan Core Web Vitals masuk kategori baik.

---

# 87. Caching Strategy

Public catalog:

```text
Cacheable
```

Revalidate setelah admin mutation.

Example:

```text
product list
product detail
service list
service detail
gallery
settings
```

Booking tidak boleh menggunakan public caching.

---

# 88. SEO

Setiap halaman memiliki:

```text
title
description
canonical
open graph
twitter card
```

Dynamic product:

```text
{{product_name}} | Specialist AC Mobil
```

Dynamic service:

```text
{{service_name}} | Specialist AC Mobil
```

---

# 89. Technical SEO

Wajib:

- robots.txt
- sitemap.xml
- canonical
- metadata
- semantic heading
- alt text
- structured data
- responsive
- fast page

---

# 90. Structured Data

Gunakan sesuai data faktual:

- LocalBusiness
- Organization
- Service
- BreadcrumbList
- Product jika memiliki data yang memadai

Jangan membuat review/rating palsu.

---

# 91. Local SEO

Admin settings harus menyediakan:

- Business name.
- Address.
- Phone.
- Opening hours.
- Maps link.

Pastikan informasi konsisten.

---

# 92. Accessibility

Requirements:

- Semantic HTML.
- Keyboard navigation.
- Visible focus.
- Form labels.
- Error message.
- Sufficient contrast.
- Button minimum comfortable touch size.
- Alt text.
- Dialog focus management.

Target:

WCAG-friendly implementation.

---

# 93. Security

## Authentication

- Supabase Auth.
- Admin-only.
- No public signup.

## Authorization

Server validates admin role.

## Database

- RLS enabled.
- Least privilege.

## Forms

- Zod server validation.
- Input sanitization where appropriate.
- Rate limiting.

## Upload

- MIME validation.
- Size validation.
- Signed upload.
- File count limitation.

## Secrets

Simpan di Vercel environment variables.

Tidak boleh commit `.env`.

---

# 94. Recommended Security Headers

Implement sesuai kompatibilitas:

```text
Content-Security-Policy
Strict-Transport-Security
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
```

---

# 95. Booking Anti-Spam

Gunakan bertahap:

1. Rate limit.
2. Honeypot.
3. IP/user-agent heuristics.
4. CAPTCHA jika spam meningkat.

Jangan langsung membuat flow terlalu berat.

---

# 96. Audit Fields

Entity admin-managed minimal memiliki:

```text
created_at
updated_at
```

Optional future:

```text
created_by
updated_by
```

---

# 97. Analytics Events

```text
page_view

whatsapp_click
call_click
maps_click

service_view
product_view

product_search
product_filter

booking_start
booking_submit

gallery_view
promotion_view
```

---

# 98. Conversion Funnel

```text
Landing Page
     ↓
Service / Product
     ↓
Detail
     ↓
WhatsApp or Booking
     ↓
Admin Contact
     ↓
Confirmed Visit
```

---

# 99. Error States

## Product Not Found

404 friendly:

```text
Produk tidak ditemukan.
```

CTA:

- Kembali ke produk.
- Tanya WhatsApp.

## No Search Result

```text
Produk yang kamu cari belum ditemukan.
```

CTA:

```text
Tanya ketersediaan via WhatsApp
```

## Booking Error

Jangan hilangkan input user.

Berikan:

```text
Booking belum berhasil dikirim.
Silakan coba lagi atau hubungi WhatsApp.
```

---

# 100. Empty Admin States

Example:

```text
Belum ada produk.

[+ Tambah Produk]
```

---

# 101. Toast Notifications

Success:

```text
Produk berhasil disimpan.
```

```text
Produk berhasil dipublikasikan.
```

Error:

```text
Produk gagal disimpan.
Silakan coba lagi.
```

---

# 102. Confirmation Dialog

Untuk:

- Delete.
- Unpublish.
- Cancel booking.
- Remove image.

---

# 103. Product Slug

Generate otomatis.

Example:

```text
Denso Cabin Filter BR-V
```

menjadi:

```text
denso-cabin-filter-br-v
```

Admin dapat edit slug sebelum publish.

---

# 104. Image Alt Generator

Default suggestion:

```text
{{product_name}} {{brand}} untuk {{vehicle}}
```

Admin tetap bisa edit.

---

# 105. Product Draft

Recommended status:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Tambahkan field:

```text
publication_status
```

Lebih fleksibel daripada hanya `active`.

---

# 106. Suggested Product Table Revision

Recommended final fields:

```text
id
category_id
name
slug
brand
sku
part_number
short_description
description
specifications
installation_notes
warranty_text

price_mode
price
price_min
price_max
installation_price

availability
stock_quantity

publication_status
featured

seo_title
seo_description

published_at

created_at
updated_at
deleted_at
```

---

# 107. Admin Product Workflow

```text
Login
  ↓
Products
  ↓
Add Product
  ↓
Upload Images
  ↓
Product Information
  ↓
Pricing
  ↓
Vehicle Compatibility
  ↓
Preview
  ↓
Publish
  ↓
Website Automatically Updated
```

---

# 108. Preview Product

Sebelum publish admin dapat klik:

```text
Preview
```

Preview menggunakan unpublished data tetapi hanya dapat diakses admin.

---

# 109. Product Image Reordering

Admin:

```text
Drag & Drop
```

Urutan disimpan dalam:

```text
sort_order
```

---

# 110. Admin Mobile Support

Admin dashboard tidak perlu sekompleks desktop tetapi harus tetap bisa:

- Login.
- Add product.
- Upload photo.
- Edit price.
- Change availability.
- View booking.

Ini penting karena admin bengkel kemungkinan sering mengelola dari HP.

---

# 111. Booking Notification

MVP:

- Admin dashboard notification badge.

Recommended:

- Email notification optional.
- WhatsApp notification via official integration dapat ditambahkan kemudian.

Jangan menggunakan WhatsApp automation unofficial yang berisiko.

---

# 112. Payment Information

Website dapat menampilkan:

- Cash.
- Bank transfer.
- QRIS.
- Debit/credit jika memang tersedia.

Admin dapat mengubah informasi tersebut.

Jangan tampilkan metode pembayaran yang belum benar-benar tersedia.

---

# 113. Future Customer Features

V2:

- Customer login.
- Vehicle garage.
- Service history.
- Service reminder.
- Digital quotation.
- Invoice.
- Booking history.
- Warranty tracking.

---

# 114. Future Workshop Features

V2/V3:

- Work order.
- Technician assignment.
- Service queue.
- Inventory.
- Supplier.
- Purchase order.
- Parts movement.
- POS.
- Invoice.
- Multi-branch.

---

# 115. Future Service History

Entity:

```text
vehicles
service_orders
service_order_items
service_photos
technicians
customers
```

Flow:

```text
Customer
   ↓
Vehicle
   ↓
Service Order
   ↓
Diagnosis
   ↓
Quotation
   ↓
Approval
   ↓
Repair
   ↓
QC
   ↓
Completed
```

---

# 116. Environment Variables

Example:

```env
NEXT_PUBLIC_SITE_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

NEXT_PUBLIC_GA_ID=

SENTRY_DSN=
```

Only expose variables with `NEXT_PUBLIC_` if safe for browser.

---

# 117. Vercel Deployment

Pipeline:

```text
Developer Push
      ↓
GitHub
      ↓
Vercel Preview
      ↓
QA
      ↓
Merge Main
      ↓
Vercel Production
```

---

# 118. Environments

Gunakan:

```text
Local
Preview
Production
```

Database production jangan digunakan sembarangan untuk local testing.

---

# 119. Vercel Production Checklist

- GitHub repository connected.
- Build succeeds.
- Environment variables configured.
- Production database configured.
- Cloudinary configured.
- Custom domain.
- HTTPS active.
- Canonical domain.
- Sitemap.
- Robots.
- Analytics.
- Error monitoring optional.

---

# 120. Recommended Domain

Examples:

```text
specialistacmobil.com
acmobilasmawi.com
asmawiauto.com
asmawiautocare.com
```

Nama domain final harus mengikuti brand resmi dan ketersediaan domain.

---

# 121. Suggested Homepage Copy

## Hero

### AC Mobil Bermasalah?

**Biar kami cek.**

AC mobil, power window, central lock, audio mobil, dan kebutuhan variasi kendaraan dalam satu tempat.

Buttons:

```text
Booking Service
Chat WhatsApp
```

---

# 122. Services Headline

```text
Ada masalah apa dengan mobilmu?
```

Subtitle:

```text
Pilih layanan atau ceritakan keluhannya.
Kami bantu arahkan pemeriksaan yang sesuai.
```

---

# 123. Product Headline

```text
Cari komponen atau aksesori mobil?
```

Subtitle:

```text
Lihat katalog produk kami dan tanyakan kompatibilitasnya untuk mobilmu.
```

---

# 124. Booking Headline

```text
Mau datang ke bengkel?
```

Subtitle:

```text
Kirim permintaan jadwal terlebih dahulu agar tim kami dapat menyiapkan pemeriksaan yang sesuai.
```

---

# 125. CTA Final

```text
Belum tahu masalahnya?

Ceritakan gejalanya melalui WhatsApp.
```

Button:

```text
Konsultasi WhatsApp
```

---

# 126. Photo Shot List

Untuk membuat website terlihat profesional, ambil foto berikut.

## Workshop

- Front building.
- Workshop wide angle.
- Service bay.
- Tools.
- AC machine.
- Technician working.
- Car dashboard.
- Engine bay.

## AC

- Compressor.
- Evaporator.
- Condenser.
- Blower.
- Cabin filter.
- AC gauge.
- AC vent temperature check.

## Power Window

- Door trim removed.
- Motor.
- Regulator.
- Switch.
- Wiring.

## Audio

- Head unit.
- Speaker.
- Amplifier.
- Subwoofer.
- Wiring.
- Installed result.

## Before / After

Minimal 10 sets.

---

# 127. Product Photography Standard

Gunakan background:

```text
White / gray / workshop neutral
```

Lighting:

```text
Soft, clear, no harsh reflection
```

Frame:

```text
Object fills 70-80% of canvas
```

Avoid:

- Watermark marketplace.
- Screenshot.
- Blurry photo.
- Cropped label.
- Background berantakan.

---

# 128. Image Naming

Example:

```text
ac-compressor-honda-brv-cover.webp
ac-compressor-honda-brv-label.webp
ac-compressor-honda-brv-installed.webp
```

---

# 129. Image SEO

Alt:

```text
Kompresor AC Honda BR-V
```

Bukan:

```text
IMG_1827
```

---

# 130. Seed Data Categories

```json
[
  {"name":"AC Mobil","slug":"ac-mobil"},
  {"name":"Power Window","slug":"power-window"},
  {"name":"Central Lock","slug":"central-lock"},
  {"name":"Audio","slug":"audio"},
  {"name":"Electrical","slug":"electrical"},
  {"name":"Interior","slug":"interior"},
  {"name":"Exterior","slug":"exterior"},
  {"name":"Variasi","slug":"variasi"}
]
```

---

# 131. Seed Services

```json
[
  {"name":"Service AC Mobil","slug":"service-ac-mobil"},
  {"name":"Perbaikan Power Window","slug":"perbaikan-power-window"},
  {"name":"Perbaikan Central Lock","slug":"perbaikan-central-lock"},
  {"name":"Power Door","slug":"power-door"},
  {"name":"Audio Mobil","slug":"audio-mobil"},
  {"name":"Variasi Mobil","slug":"variasi-mobil"}
]
```

---

# 132. Admin First Setup

1. Create Supabase project.
2. Enable email/password authentication.
3. Disable public sign-up.
4. Create admin user manually.
5. Insert admin profile.
6. Enable RLS.
7. Apply policies.
8. Configure Cloudinary.
9. Set environment variables in Vercel.
10. Deploy.
11. Login `/admin/login`.
12. Add categories.
13. Add products.
14. Add services.
15. Upload gallery.
16. Update contact information.

---

# 133. Simple Admin Login Requirement

MVP login harus sesederhana mungkin:

```text
Email
Password
Login
```

Tidak perlu:

```text
Register
Google Auth
OTP
Magic Link
Social Login
```

Optional:

```text
Forgot Password
```

---

# 134. Admin Session

Saat login berhasil:

```text
redirect /admin/dashboard
```

Saat belum login dan membuka:

```text
/admin/products
```

harus redirect:

```text
/admin/login?redirect=/admin/products
```

Setelah login kembali ke halaman tujuan.

---

# 135. Logout

Logout tersedia pada:

- Sidebar desktop.
- User dropdown.
- Mobile admin drawer.

Setelah logout:

```text
redirect /admin/login
```

---

# 136. Middleware / Route Protection

Protect:

```text
/admin/dashboard
/admin/products/*
/admin/categories/*
/admin/services/*
/admin/bookings/*
/admin/gallery/*
/admin/promotions/*
/admin/faq/*
/admin/settings/*
```

Jangan hanya mengandalkan middleware.

Server action/API tetap wajib melakukan authorization.

---

# 137. Server Validation

Semua product mutation:

```text
createProduct
updateProduct
deleteProduct
publishProduct
```

harus:

1. Get authenticated user.
2. Check admin role.
3. Validate payload with Zod.
4. Execute DB operation.
5. Revalidate relevant page/cache.
6. Return typed response.

---

# 138. Suggested Product Validation

```text
name                required
slug                required
category_id         required
price_mode          required
availability        required
publication_status  required
cover_image         required before publish
```

Rules:

```text
FIXED -> price required
START_FROM -> price_min required
RANGE -> price_min and price_max required
CONTACT -> no price required
```

---

# 139. Transaction Safety

Jika upload image berhasil tetapi database gagal:

- Jangan langsung membuat broken product.
- Cleanup orphan image jika memungkinkan.

Jika database product berhasil tetapi optional image gagal:

- Product bisa tetap draft.
- Tampilkan error upload.

---

# 140. Admin Product Search

Search input memiliki debounce.

Search fields:

- name
- brand
- sku
- part number

---

# 141. Public Search URL

Search harus shareable:

```text
/produk?q=compressor
```

Filter:

```text
/produk?category=ac-mobil&availability=available
```

---

# 142. Pagination

Gunakan server-side pagination.

Example:

```text
24 products/page
```

URL:

```text
/produk?page=2
```

---

# 143. Product Related Logic

Related products:

Prioritas:

1. Same category.
2. Same brand.
3. Same vehicle fitment.
4. Featured.

Limit:

```text
4 - 8
```

---

# 144. Search Empty CTA

Jika product tidak ditemukan:

```text
Belum menemukan produk yang dicari?

Hubungi kami dan beri tahu tipe mobil serta komponen yang dibutuhkan.
```

Button:

```text
Tanya WhatsApp
```

---

# 145. Database Backup

Gunakan backup sesuai kemampuan plan database.

Sebelum perubahan besar:

- Export important data.
- Maintain migration files.
- Never alter production schema manually tanpa tracking.

---

# 146. Database Migration

Gunakan migration SQL yang disimpan di repository.

Example:

```text
supabase/
  migrations/
```

Tidak mengandalkan perubahan dashboard manual saja.

---

# 147. Logging

Log server-side untuk:

- Login failure abnormal.
- Product mutation error.
- Booking submission error.
- Image upload error.

Jangan log:

- Password.
- Secret keys.
- Sensitive auth token.

---

# 148. Error Handling Architecture

Server response:

```ts
type ActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };
```

---

# 149. Suggested Error Codes

```text
AUTH_REQUIRED
FORBIDDEN
VALIDATION_ERROR
PRODUCT_NOT_FOUND
UPLOAD_FAILED
DATABASE_ERROR
RATE_LIMITED
BOOKING_FAILED
```

---

# 150. Testing Strategy

## Unit Tests

- Validation.
- Price logic.
- Slug generation.
- Booking code.
- Formatter.

## Integration

- Create product.
- Update product.
- Publish.
- Booking.
- Auth.

## E2E

Recommended:

Playwright.

Critical flows:

```text
Admin login
Add product
Edit product
Publish product
Customer product search
Customer product detail
Customer WhatsApp click
Customer booking
```

---

# 151. Required E2E Scenario — Add Product

```text
Given admin logged in
When admin opens Add Product
And fills valid fields
And uploads cover image
And clicks Publish
Then product is stored
And product appears on public product list
And product detail is accessible
```

---

# 152. Required E2E Scenario — Unauthorized Admin

```text
Given visitor is not logged in
When visitor opens /admin/products
Then visitor is redirected to /admin/login
```

---

# 153. Required E2E Scenario — Booking

```text
Given customer opens booking
When valid booking data is submitted
Then booking receives unique code
And booking appears in admin
And customer sees success state
```

---

# 154. Browser Support

Target modern versions:

- Chrome.
- Edge.
- Safari.
- Firefox.
- Mobile Chrome.
- Mobile Safari.

---

# 155. PWA

Optional V1.1.

Bukan prioritas MVP.

Jika ditambahkan:

- Installable.
- Basic offline shell.
- Admin tetap membutuhkan internet.

---

# 156. Sitemap

Example:

```text
/
/layanan
/layanan/ac-mobil
/layanan/power-window
/layanan/central-lock
/layanan/audio-mobil
/layanan/variasi-mobil

/produk
/produk/[slug]

/galeri
/promo
/booking
/tentang
/kontak
```

Admin tidak masuk sitemap.

---

# 157. Robots

Block:

```text
/admin/
```

Public:

```text
/
```

---

# 158. URL Conventions

Gunakan lowercase dan hyphen.

Good:

```text
/produk/compressor-ac-honda-brv
```

Avoid:

```text
/product?id=23928
```

untuk canonical product page.

---

# 159. Content Rules

Setiap service page minimal:

- 300-500 words factual content.
- Original.
- Not keyword stuffing.
- Explain symptoms and process.
- Clear CTA.

Product description harus sesuai produk asli.

---

# 160. Trust Content

Website dapat memiliki:

- Workshop photos.
- Real installation photos.
- Real testimonials.
- Warranty terms.
- Clear address.
- Clear contact.
- Service process.

Ini lebih penting daripada animasi berlebihan.

---

# 161. Review / Testimonial Policy

Hanya publish:

- Review asli.
- Mendapat izin jika diperlukan.
- Tidak memodifikasi makna review.

Fields:

```text
name
vehicle
rating optional
review
source
published
```

---

# 162. Opening Hours

Component harus membaca database.

Jika hari tutup:

```text
Tutup
```

Optional future:

Tampilkan:

```text
Buka sekarang
Tutup sekarang
```

berdasarkan timezone bisnis.

---

# 163. Maps

Untuk MVP gunakan:

- Maps link.
- Embed sederhana optional.

CTA:

```text
Buka di Google Maps
```

Jangan memuat Maps JavaScript API jika tidak dibutuhkan.

---

# 164. Main Mobile CTA

Sticky:

```text
┌───────────────────────────────┐
│ WhatsApp       Booking        │
└───────────────────────────────┘
```

Hide saat:

- Admin.
- Certain modal open.

---

# 165. Admin UI Components

Use shadcn/ui:

- Button.
- Input.
- Textarea.
- Select.
- Dialog.
- Alert Dialog.
- Sheet.
- Table.
- Dropdown Menu.
- Badge.
- Tabs.
- Form.
- Card.
- Skeleton.
- Toast/Sonner.

---

# 166. Public UI Components

Reusable:

```text
Navbar
MobileMenu
Hero
ServiceCard
ProductCard
ProductGallery
SearchBar
FilterDrawer
WhatsAppCTA
BookingCTA
GalleryCard
BeforeAfterSlider
FAQAccordion
ContactCard
Footer
```

---

# 167. Coding Standards

- TypeScript strict.
- Avoid `any`.
- Server-first.
- Reusable components.
- Small modules.
- Domain-based organization.
- No business logic in UI components.
- No direct DB calls from arbitrary component.
- Zod schemas shared appropriately.
- Typed repository/service results.

---

# 168. Naming

Components:

```text
ProductCard.tsx
BookingForm.tsx
AdminSidebar.tsx
```

Functions:

```text
getProducts
createProduct
updateProduct
publishProduct
```

Avoid:

```text
data1
tempData
helper2
handleStuff
```

---

# 169. Repository Pattern

Example:

```text
ProductRepository
  findMany()
  findBySlug()
  findById()
  create()
  update()
  softDelete()
```

Service:

```text
ProductService
  createProduct()
  updateProduct()
  publishProduct()
```

UI tidak mengetahui detail query database.

---

# 170. API / Server Actions

Prefer Server Actions untuk admin form jika cocok.

Gunakan Route Handler untuk:

- Webhook.
- External integration.
- API access yang benar-benar dibutuhkan.
- Signed upload endpoint.

---

# 171. Slug Collision

Jika slug sudah ada:

```text
compressor-ac
compressor-ac-2
```

atau minta admin memilih slug unik.

Database harus memiliki unique constraint.

---

# 172. Optimistic UI

Boleh digunakan untuk:

- Toggle featured.
- Toggle active.
- Sort images.

Jangan gunakan optimistic flow yang dapat membuat admin salah mengira data sudah tersimpan untuk operasi penting tanpa rollback/error state.

---

# 173. Product Import

Future feature:

CSV import.

Columns:

```text
name
brand
category
sku
part_number
price
availability
description
```

Bukan MVP.

---

# 174. Admin Export

V1.1:

- Export products CSV.
- Export bookings CSV.

---

# 175. Soft Delete Retention

Deleted product:

- Hidden from public.
- Admin can view trash optional.
- Restore future.

MVP minimal:

`deleted_at` dan filter dari public.

---

# 176. Product Publishing Rules

Product cannot publish if:

- Name empty.
- Category missing.
- Cover missing.
- Availability missing.
- Price configuration invalid.
- Slug invalid.

---

# 177. Booking Validation

Required:

```text
customer_name
whatsapp
vehicle_make
vehicle_model
vehicle_year
service or complaint
requested_date
```

Date tidak boleh lewat.

---

# 178. Phone Validation

Normalize Indonesian phone:

Input:

```text
082111906994
+6282111906994
6282111906994
```

Internal normalized representation:

```text
6282111906994
```

Display dapat diformat kembali.

---

# 179. Date & Time

Store timestamps:

```text
UTC
```

Display:

Timezone bisnis yang dikonfigurasi.

---

# 180. Privacy

Jangan menampilkan data booking customer kepada publik.

Data seperti:

- Name.
- WhatsApp.
- License plate.
- Email.

hanya admin.

---

# 181. Legal Pages

Recommended:

```text
/kebijakan-privasi
/syarat-ketentuan
```

Terutama karena form mengumpulkan data pelanggan.

---

# 182. Cookie

Jika hanya analytics privacy-friendly yang tidak membutuhkan cookie, banner bisa diminimalkan sesuai implementasi/legal requirement.

Jika menggunakan tracking tambahan, evaluasi consent requirement.

---

# 183. Roadmap

## Phase 1 — MVP

- Homepage.
- Services.
- Products.
- Product details.
- Gallery.
- Promo.
- Booking.
- Contact.
- WhatsApp.
- Admin login.
- Product management.
- Category management.
- Service management.
- Booking management.
- Gallery.
- Settings.
- SEO.
- Analytics.
- Vercel deployment.

## Phase 1.1

- Product fitment advanced.
- Notification.
- CSV export.
- Better dashboard analytics.
- Review management.
- Booking capacity.

## Phase 2

- Customer login.
- Garage.
- Service history.
- Reminder.
- Quotation.
- Work order.
- Invoice.
- Warranty.

## Phase 3

- Inventory.
- Supplier.
- Purchase order.
- POS.
- Technician management.
- Multi branch.
- Loyalty.

---

# 184. MVP Acceptance Criteria

## Public

- [ ] Homepage responsive.
- [ ] Header and mobile menu work.
- [ ] Services list loads.
- [ ] Service detail works.
- [ ] Product list works.
- [ ] Search works.
- [ ] Filter works.
- [ ] Product detail works.
- [ ] Images optimized.
- [ ] WhatsApp CTA works.
- [ ] Booking form works.
- [ ] Contact page works.
- [ ] Maps CTA works.
- [ ] Gallery works.
- [ ] Promo works.
- [ ] SEO metadata exists.
- [ ] Sitemap exists.
- [ ] robots.txt exists.
- [ ] 404 page exists.
- [ ] Mobile sticky CTA works.

## Admin

- [ ] Admin can login.
- [ ] Unauthorized user cannot access admin.
- [ ] Admin can logout.
- [ ] Admin dashboard works.
- [ ] Admin can add category.
- [ ] Admin can add product.
- [ ] Admin can upload product images.
- [ ] Admin can edit product.
- [ ] Admin can publish/unpublish product.
- [ ] Admin can soft-delete product.
- [ ] Admin can manage services.
- [ ] Admin can manage bookings.
- [ ] Admin can manage gallery.
- [ ] Admin can manage promotions.
- [ ] Admin can edit business settings.

## Security

- [ ] RLS enabled.
- [ ] Server authorization exists.
- [ ] No service key in client.
- [ ] Rate limiting exists.
- [ ] Upload validation exists.
- [ ] Environment secrets not committed.

## Performance

- [ ] Images responsive.
- [ ] Lazy loading.
- [ ] No unnecessary global JS.
- [ ] No major layout shift.
- [ ] Public pages cache appropriately.

---

# 185. Definition of Done

Project dianggap selesai untuk MVP apabila:

1. Website dapat diakses dari domain production.
2. Semua halaman utama selesai.
3. Semua navigasi berjalan.
4. Product catalog berjalan.
5. Admin login berjalan.
6. Admin dapat menambah produk sendiri.
7. Upload image berjalan.
8. Product langsung muncul setelah publish.
9. Booking tersimpan.
10. Booking dapat dilihat admin.
11. WhatsApp CTA berjalan.
12. Data bisnis dapat diubah dari admin.
13. Responsive mobile/desktop.
14. SEO dasar tersedia.
15. Security baseline selesai.
16. Production build Vercel berhasil tanpa error.
17. Tidak ada secret di repository.
18. Tidak ada placeholder data yang terlihat sebagai fakta bisnis.
19. Produk yang dipublikasikan menggunakan data dan gambar nyata.
20. QA critical flow selesai.

---

# 186. Final Recommended MVP Scope

Untuk menjaga project cepat selesai tetapi tetap matang, implementasi pertama sebaiknya mencakup:

```text
PUBLIC
├── Home
├── Services
├── Service Detail
├── Products
├── Product Detail
├── Gallery
├── Booking
├── Promo
├── About
└── Contact

ADMIN
├── Login
├── Dashboard
├── Products
├── Categories
├── Services
├── Bookings
├── Gallery
├── Promotions
├── FAQ
└── Settings
```

Dengan stack:

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Supabase PostgreSQL
Supabase Auth
Cloudinary
Vercel
```

Ini memberi fondasi yang **ringan, cepat, scalable, mudah dikelola, dan tidak terlalu kompleks untuk bengkel skala lokal**, tetapi tetap siap dikembangkan menjadi sistem workshop yang jauh lebih besar.

---

# 187. Recommended First Development Order

```text
01 Project setup
02 Design system
03 Supabase setup
04 Database migration
05 Auth
06 Admin layout
07 Category CRUD
08 Product CRUD
09 Image upload
10 Public product catalog
11 Services
12 Homepage
13 WhatsApp
14 Booking
15 Booking admin
16 Gallery
17 Promo
18 Settings
19 SEO
20 Analytics
21 Security hardening
22 Testing
23 Vercel preview
24 Production deployment
```

---

# 188. Important Implementation Rules

1. **Jangan hardcode produk.**
2. **Jangan hardcode nomor WhatsApp.**
3. **Jangan hardcode alamat.**
4. **Jangan hardcode jam buka.**
5. **Produk selalu berasal dari database.**
6. **Gambar produk selalu berasal dari media storage.**
7. **Admin harus bisa menambah produk tanpa deploy ulang.**
8. **Tidak ada public admin registration.**
9. **Public page harus tetap cepat meskipun jumlah produk bertambah.**
10. **Semua data produk harus faktual dan sesuai stok/produk bengkel.**
11. **Server-side authorization wajib untuk setiap operasi admin.**
12. **Gambar asli bengkel dan produk lebih diprioritaskan daripada stock image.**
13. **MVP dibuat sederhana, tetapi schema dan arsitektur jangan mengunci pengembangan masa depan.**

---

# 189. Final Product Direction

Website akhir harus terasa seperti kombinasi:

- Website bengkel modern.
- Product catalog.
- Service catalog.
- WhatsApp conversion landing page.
- Booking portal.
- CMS internal ringan.

Customer harus dapat menemukan informasi yang dibutuhkan dalam beberapa detik.

Admin harus dapat menambahkan sebuah produk dengan alur sederhana:

```text
Login
→ Products
→ Add Product
→ Isi data
→ Upload gambar
→ Publish
```

Tanpa perlu menyentuh code, repository, atau Vercel.

---

**END OF PRD**
