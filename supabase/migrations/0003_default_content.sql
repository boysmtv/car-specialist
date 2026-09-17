-- 0003: Konten default (7 layanan + 6 produk contoh).
-- Masuk database = tampil publik + BISA diedit/dihapus dari /admin.
-- Aman diulang (ON CONFLICT DO NOTHING).
-- Catatan: foto produk di bawah ini foto STOK sementara — ganti dengan
-- foto asli via /admin → Produk → Edit.

-- ============ LAYANAN ============
insert into services (id, name, slug, icon, short_description, description, symptoms, diagnostics, process, duration_text, price_mode, price_from, warranty_text, featured, active) values
('f394d3c2-f101-45e7-b9ad-66b4a4fd9b60','Service AC Mobil','service-ac-mobil','snowflake',
 'Pemeriksaan dan perbaikan sistem AC mobil dari pendinginan, blower, hingga komponen AC.',
 'Layanan lengkap sistem AC: general check, servis, cleaning evaporator, isi freon, leak check, pemeriksaan kompresor, kondensor, blower, magnetic clutch, thermostat, cabin filter, expansion valve, dan kelistrikan AC. Teknisi melakukan pemeriksaan terlebih dahulu, memberikan estimasi sebelum pengerjaan, dan mendokumentasikan pekerjaan.',
 '["AC tidak dingin","AC bau","Blower tidak keluar angin","Angin kecil","Kompresor berisik"]',
 '["Cek tekanan freon","Cek kebocoran","Cek kompresor & magnetic clutch","Cek evaporator & kondensor","Cek blower & filter kabin"]',
 '["Pemeriksaan awal","Estimasi biaya","Persetujuan pelanggan","Pengerjaan","QC & serah terima"]',
 '1–3 jam (tergantung kerusakan)','START_FROM',150000,'Garansi pengerjaan sesuai nota bengkel.',true,true),

('cdff36cb-9c25-4e0e-9576-107c22b73ec9','Perbaikan Power Window','perbaikan-power-window','car',
 'Pemeriksaan kaca elektrik yang macet, lambat, atau tidak berfungsi.',
 'Diagnosa power window mati, kaca lambat/tersendat, tidak naik/turun. Pemeriksaan motor, regulator, switch master & single, wiring, fuse, relay, dan mekanisme.',
 '["Kaca mobil macet","Power window lambat","Kaca tidak naik","Kaca tidak turun","Suara kasar saat naik/turun"]',
 '["Cek motor","Cek regulator","Cek switch","Cek wiring & fuse"]',
 '["Bongkar door trim","Diagnosa","Estimasi","Perbaikan/penggantian","Test naik-turun"]',
 '1–2 jam','START_FROM',100000,null,true,true),

('49a6047b-9ff6-40aa-8390-7a28fe0ae3db','Perbaikan Central Lock','perbaikan-central-lock','lock',
 'Diagnosa sistem central lock, actuator, remote, module, dan wiring.',
 'Perbaikan lock/unlock tidak serempak, remote tidak merespons, actuator lemah, modul/receiver, wiring, fuse, dan integrasi alarm bila didukung.',
 '["Central lock tidak bekerja","Remote tidak merespons","Kunci tidak serempak"]',
 '["Cek actuator","Cek remote & baterai","Cek modul","Cek wiring"]',
 '["Diagnosa","Estimasi","Perbaikan","Sinkronisasi remote","Test"]',
 '1–2 jam','START_FROM',100000,null,false,true),

('9f53f40f-8218-4bbc-9802-98aefa09a1cd','Power Door','power-door','door',
 'Pemeriksaan dan instalasi sistem pintu elektrik sesuai dukungan kendaraan.',
 'Instalasi dan perbaikan power door / power back door sesuai tipe kendaraan yang didukung. Meliputi motor, modul, sensor, dan kalibrasi.',
 '["Pintu elektrik macet","Ingin pasang power back door"]',
 '["Cek kompatibilitas kendaraan","Cek motor & modul","Cek sensor"]',
 '["Konsultasi","Estimasi","Instalasi","Kalibrasi","Test"]',
 '2–4 jam','CONTACT',null,null,false,true),

('a77d8299-cfeb-4164-97cc-405b481ea418','Audio Mobil','audio-mobil','speaker',
 'Head unit, speaker, amplifier, subwoofer, wiring, dan troubleshooting audio.',
 'Instalasi head unit, speaker coaxial/component, tweeter, amplifier, subwoofer aktif/pasif, wiring, fuse, grounding, noise troubleshooting, dan konsultasi upgrade audio.',
 '["Speaker mati","Audio noise/dengung","Head unit bermasalah","Ingin upgrade audio"]',
 '["Cek head unit","Cek speaker & wiring","Cek grounding","Cek power & fuse"]',
 '["Konsultasi kebutuhan","Estimasi","Instalasi","Tuning","Test dengar"]',
 '1–4 jam','START_FROM',200000,null,true,true),

('40e29376-3e57-4259-9bd3-b4badb278f56','Home Service','home-service','house',
 'Teknisi datang ke rumah untuk servis ringan tanpa ke bengkel.',
 'Tidak sempat ke bengkel? Teknisi kami datang ke rumah untuk pemeriksaan dan pengerjaan ringan: cek & servis AC, isi freon, ganti cabin filter, perbaikan power window ringan, dan konsultasi audio. Area utama Cikarang Barat & sekitarnya. Biaya kunjungan diinformasikan transparan sebelum kunjungan.',
 '["Tidak sempat ke bengkel","Mobil tidak bisa jalan","Ingin servis di rumah"]',
 '["Konfirmasi keluhan via WhatsApp","Cek cakupan area","Estimasi jasa + biaya kunjungan"]',
 '["Chat konsultasi via WhatsApp","Konfirmasi jadwal & alamat","Teknisi datang","Pemeriksaan & estimasi di lokasi","Pengerjaan bila disetujui"]',
 'Menyesuaikan antrean kunjungan','CONTACT',null,null,true,true),

('fd216296-8dfd-4782-a3b3-502a5fbdfb1f','Variasi Mobil','variasi-mobil','sparkles',
 'Berbagai kebutuhan aksesori dan variasi interior maupun eksterior kendaraan.',
 'Aksesori interior, exterior, lighting, USB charger, parkir, dan variasi lainnya. Konsultasikan kebutuhan dan kompatibilitas kendaraan Anda.',
 '["Cari variasi mobil","Ingin upgrade lampu","Butuh charger & aksesori"]',
 '["Konsultasi kebutuhan","Cek kompatibilitas"]',
 '["Pilih produk","Estimasi + pasang","QC"]',
 '30 menit – 2 jam','CONTACT',null,null,false,true)
on conflict (id) do nothing;

-- ============ PRODUK ============
insert into products (id, category_id, name, slug, brand, short_description, description, price_mode, price, price_min, availability, warranty_text, featured, active, publication_status, published_at) values
('19bb788f-ebba-4392-90bd-d7dcd427042d','1907348e-6a06-44fb-8975-29467f209298','Cabin Filter','cabin-filter','Denso',
 'Filter kabin agar udara AC bersih.',
 'Cabin Filter (Denso) tersedia di Specialist AC Mobil & Variasi. Harga dapat berbeda tergantung tipe mobil dan kebutuhan pemasangan. Hubungi WhatsApp untuk estimasi termasuk pasang.',
 'START_FROM',null,85000,'AVAILABLE','',false,true,'PUBLISHED',now()),

('2d84d943-2011-49d3-9a05-05fd3d23a814','1907348e-6a06-44fb-8975-29467f209298','Kompresor AC','kompresor-ac','Denso',
 'Kompresor AC heavy-duty, dingin maksimal.',
 'Kompresor AC (Denso) tersedia di Specialist AC Mobil & Variasi. Konsultasikan tipe mobil untuk kecocokan part. Hubungi WhatsApp untuk estimasi termasuk pasang.',
 'START_FROM',null,1500000,'AVAILABLE','3 bulan',true,true,'PUBLISHED',now()),

('d4b0855f-2b08-4609-9093-9f75c8717119','6c7728d0-c63b-4696-9665-7a05a8a2551c','Power Window Motor','power-window-motor','OEM',
 'Motor kaca elektrik, naik-turun lancar.',
 'Power Window Motor (OEM) untuk penggantian motor kaca yang lemah atau mati. Hubungi WhatsApp untuk cek kompatibilitas dengan mobilmu.',
 'START_FROM',null,300000,'LOW_STOCK','1 bulan',false,true,'PUBLISHED',now()),

('2ebea945-2703-4705-8538-287933140239','585f6f08-a64b-4844-8bad-360c5e484c1d','Head Unit 9 inch Android','head-unit-9-inch','Skeleton',
 'Head unit Android layar 9 inch.',
 'Head Unit Android 9 inch untuk upgrade hiburan mobil. Termasuk konsultasi pemasangan & wiring. Hubungi WhatsApp untuk estimasi termasuk pasang.',
 'START_FROM',null,1200000,'AVAILABLE','6 bulan',true,true,'PUBLISHED',now()),

('7d484e55-3fc7-4226-8d28-04294ef5bf46','585f6f08-a64b-4844-8bad-360c5e484c1d','Speaker Coaxial 6 inch','speaker-coaxial-6-inch','Pioneer',
 'Speaker coaxial suara jernih untuk harian.',
 'Speaker Coaxial 6 inch (Pioneer), cocok untuk upgrade audio harian. Hubungi WhatsApp untuk estimasi termasuk pasang.',
 'START_FROM',null,550000,'AVAILABLE','',false,true,'PUBLISHED',now()),

('40b46874-cbe1-4a86-ae5c-22217b42f732','f89ad157-9e33-45af-86ad-69cdad611f5e','USB Charger Mobil','usb-charger-mobil','Generic',
 'Charger HP colokan lighter.',
 'USB Charger Mobil untuk ngecas di perjalanan. Stok tersedia di bengkel.',
 'FIXED',120000,null,'AVAILABLE','',false,true,'PUBLISHED',now())
on conflict (id) do nothing;

insert into product_images (id, product_id, url, alt_text, sort_order, is_cover) values
('a8b5ea1a-ea52-489d-8b71-5d8cfa764c7a','19bb788f-ebba-4392-90bd-d7dcd427042d','https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=70','Cabin Filter',1,true),
('25fa97c9-328f-4a03-add4-20503be516da','19bb788f-ebba-4392-90bd-d7dcd427042d','https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=70','Cabin Filter detail',2,false),
('039c2a2c-c7b9-4e89-a627-2335f6164899','2d84d943-2011-49d3-9a05-05fd3d23a814','https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=70','Kompresor AC',1,true),
('07057030-857a-4c00-b0f2-9e4071f7b762','2d84d943-2011-49d3-9a05-05fd3d23a814','https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=70','Kompresor AC detail',2,false),
('2a6972e2-8d5c-49e8-a794-4b9d867755cc','d4b0855f-2b08-4609-9093-9f75c8717119','https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=70','Power Window Motor',1,true),
('87106dd3-aac0-4e7a-bc98-5dc4cf70fbeb','d4b0855f-2b08-4609-9093-9f75c8717119','https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=70','Power Window Motor detail',2,false),
('ae34d74e-e793-44de-982b-029ca9f31f18','2ebea945-2703-4705-8538-287933140239','https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=70','Head Unit',1,true),
('c67c74a3-ab0e-4b4f-94c0-072067f03c25','2ebea945-2703-4705-8538-287933140239','https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=70','Head Unit detail',2,false),
('a204f937-ffa2-473c-8e52-927c284f1912','7d484e55-3fc7-4226-8d28-04294ef5bf46','https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=70','Speaker',1,true),
('23dfa57b-8f04-4637-8d45-77dcbdc7590d','7d484e55-3fc7-4226-8d28-04294ef5bf46','https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=70','Speaker detail',2,false),
('3f4c68b3-3331-4ffa-aee8-1793f9011be1','40b46874-cbe1-4a86-ae5c-22217b42f732','https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=70','USB Charger',1,true),
('6ed7bf21-fa26-465d-9cd5-3a246613f4a4','40b46874-cbe1-4a86-ae5c-22217b42f732','https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=70','USB Charger detail',2,false)
on conflict (id) do nothing;
