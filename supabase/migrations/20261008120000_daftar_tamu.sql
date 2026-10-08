-- Daftar tamu pengantin di halaman rekap (/rekap/<slug>?kunci=...): nama, nomor WhatsApp, dan kapan undangannya
-- dikirim. Tersimpan di server supaya kedua mempelai melihat daftar & status yang sama dari HP masing-masing.
-- Seperti tabel buku tamu lain: hanya diakses server Webkeun lewat secret key, RLS aktif tanpa policy.

create table public.tamu (
  id bigint generated always as identity primary key,
  undangan text not null references public.undangan (slug) on delete cascade,
  nama text not null check (char_length(nama) between 1 and 60),
  -- untuk mencegah nama dobel dalam satu undangan (huruf besar-kecil dianggap sama)
  nama_kecil text generated always as (lower(nama)) stored,
  -- nomor WhatsApp format internasional tanpa "+" (628...), kosong kalau belum diisi
  wa text not null default '' check (wa ~ '^([0-9]{9,15})?$'),
  -- kapan tombol kirim WhatsApp terakhir ditekan; null = belum dikirim
  terkirim timestamptz,
  dibuat timestamptz not null default now(),
  -- kolom undangan paling kiri, jadi sekaligus menjadi indeks foreign key
  unique (undangan, nama_kecil)
);

-- Teks pesan WhatsApp milik pengantin ({nama} & {link} diganti otomatis); null = pakai teks bawaan.
alter table public.undangan add column pesan text check (char_length(pesan) <= 2000);

alter table public.tamu enable row level security;
revoke all on table public.tamu from anon, authenticated;
grant select, insert, update, delete on table public.tamu to service_role;
