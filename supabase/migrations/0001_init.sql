-- Specialist AC Mobil & Variasi — MVP schema (PRD §64-77)
-- Jalankan di Supabase SQL Editor / supabase db push

create extension if not exists "pgcrypto";

-- profiles (admin identity dari Supabase Auth)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, name text, role text default 'ADMIN',
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name varchar not null, slug varchar unique not null,
  description text, image_url text, sort_order int default 0, active boolean default true,
  created_at timestamptz default now(), updated_at timestamptz default now(), deleted_at timestamptz
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id),
  name varchar not null, slug varchar unique not null,
  brand varchar, sku varchar, part_number varchar,
  short_description text, description text, specifications jsonb default '{}',
  installation_notes text, warranty_text text,
  price_mode varchar not null default 'CONTACT',
  price numeric, price_min numeric, price_max numeric, installation_price numeric,
  availability varchar not null default 'CONTACT', stock_quantity int,
  publication_status varchar default 'PUBLISHED', featured boolean default false, active boolean default true,
  seo_title varchar, seo_description text, published_at timestamptz,
  created_at timestamptz default now(), updated_at timestamptz default now(), deleted_at timestamptz
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  url text not null, public_id text, alt_text text, sort_order int default 0,
  is_cover boolean default false, width int, height int, created_at timestamptz default now()
);

create table if not exists product_fitments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  make varchar, model varchar, year_from int, year_to int, variant varchar, notes text
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name varchar not null, slug varchar unique not null,
  short_description text, description text,
  symptoms jsonb default '[]', diagnostics jsonb default '[]', process jsonb default '[]',
  duration_text varchar, price_mode varchar default 'CONTACT', price_from numeric, price_to numeric,
  warranty_text text, image_url text, icon varchar, featured boolean default false, active boolean default true,
  seo_title varchar, seo_description text,
  created_at timestamptz default now(), updated_at timestamptz default now(), deleted_at timestamptz
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references services(id),
  title varchar, vehicle varchar, caption text, image_url text,
  before_image_url text, after_image_url text, type varchar default 'AC',
  published boolean default true, sort_order int default 0, created_at timestamptz default now()
);

create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  title varchar not null, slug varchar unique not null, description text,
  banner_url text, terms text, start_at timestamptz, end_at timestamptz,
  active boolean default true, created_at timestamptz default now()
);

create table if not exists faq (
  id uuid primary key default gen_random_uuid(),
  category varchar, question text not null, answer text not null,
  sort_order int default 0, active boolean default true, created_at timestamptz default now()
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  business_name varchar, tagline varchar, whatsapp varchar, phone varchar, email varchar,
  address text, maps_url text, opening_hours jsonb default '{}', social_links jsonb default '{}',
  default_seo_title varchar, default_seo_description text, og_image_url text, updated_at timestamptz default now()
);

-- Indexes (PRD §76)
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_cat on products(category_id);
create index if not exists idx_products_active on products(active);
create index if not exists idx_categories_slug on categories(slug);
create index if not exists idx_services_slug on services(slug);

-- RLS (PRD §77)
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table services enable row level security;
alter table gallery enable row level security;
alter table promotions enable row level security;
alter table faq enable row level security;
alter table site_settings enable row level security;

-- Public read-only
create policy "public read categories" on categories for select using (active = true);
create policy "public read products" on products for select using (active = true and deleted_at is null);
create policy "public read images" on product_images for select using (true);
create policy "public read services" on services for select using (active = true);
create policy "public read gallery" on gallery for select using (published = true);
create policy "public read promotions" on promotions for select using (active = true);
create policy "public read faq" on faq for select using (active = true);
create policy "public read settings" on site_settings for select using (true);

-- Seed minimal
insert into categories (name, slug, sort_order) values
('AC Mobil','ac-mobil',1),('Power Window','power-window',2),('Central Lock','central-lock',3),
('Audio','audio',4),('Electrical','electrical',5),('Interior','interior',6),('Exterior','exterior',7),('Variasi','variasi',8)
on conflict (slug) do nothing;

insert into site_settings (business_name, tagline, whatsapp, phone, address, maps_url, opening_hours, default_seo_title, default_seo_description)
values ('Specialist AC Mobil & Variasi','Spesialis AC Mobil, Power Window, Central Lock, Audio & Variasi','6282111906994','0821-1190-6994','Jl. K.H. Asmawi, Kalijaya, Kec. Cikarang Barat, Kabupaten Bekasi, Jawa Barat 17530, Indonesia','https://www.google.com/maps/search/?api=1&query=-6.253777,107.140374',
'{"Monday":"08:00 - 17:00","Tuesday":"08:00 - 17:00","Wednesday":"08:00 - 17:00","Thursday":"08:00 - 17:00","Friday":"08:00 - 17:00","Saturday":"08:00 - 15:00","Sunday":"Tutup"}',
'Specialist AC Mobil & Variasi','Spesialis AC mobil, power window, central lock, audio mobil & variasi.')
on conflict do nothing;
