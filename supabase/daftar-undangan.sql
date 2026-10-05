-- Mendaftarkan satu undangan sungguhan supaya buku tamunya aktif.
-- Ganti slug (sama dengan folder /u/<slug>) dan nama pasangan, lalu jalankan di SQL Editor Supabase.
-- Hasilnya menampilkan kunci halaman rekap pengantin: /rekap/<slug>?kunci=<kunci>
-- Simpan kunci itu baik-baik dan jangan ditaruh di repo.

insert into public.undangan (slug, nama, kunci)
values ('uji-coba', 'Fara & Aditya', replace(gen_random_uuid()::text, '-', ''))
returning slug, kunci;
