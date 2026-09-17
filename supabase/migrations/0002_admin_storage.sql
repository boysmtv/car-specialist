-- 0002: Admin write access + image storage bucket
-- Jalankan SETELAH 0001_init.sql. Sign-up publik nonaktif, jadi
-- user authenticated = admin.

-- Admin (authenticated) boleh baca/tulis semua tabel konten
do $$
declare t text;
begin
  foreach t in array array['categories','products','product_images','product_fitments','services','gallery','promotions','faq','site_settings','profiles'] loop
    execute format('create policy "admin full %s" on %I for all to authenticated using (true) with check (true)', t, t);
  end loop;
end $$;

-- Bucket publik untuk foto produk & galeri
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "public read images"
on storage.objects for select
using (bucket_id = 'images');

create policy "admin upload images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'images');

create policy "admin update images"
on storage.objects for update
to authenticated
using (bucket_id = 'images');

create policy "admin delete images"
on storage.objects for delete
to authenticated
using (bucket_id = 'images');
