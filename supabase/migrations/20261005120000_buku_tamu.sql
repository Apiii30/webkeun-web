-- Buku tamu undangan: konfirmasi kehadiran (RSVP) & ucapan dari tamu.
-- Kedua tabel hanya diakses server Webkeun lewat secret key (role service_role). Browser tidak pernah
-- menyentuh database langsung: RLS aktif tanpa policy dan hak anon/authenticated dicabut.

-- Satu baris per undangan sungguhan yang memakai buku tamu.
-- kunci: token rahasia untuk halaman rekap pengantin (/rekap/<slug>?kunci=...).
create table public.undangan (
  slug text primary key check (slug ~ '^[a-z0-9-]{3,60}$'),
  nama text not null check (char_length(nama) between 1 and 120),
  kunci text not null check (char_length(kunci) >= 24),
  dibuat timestamptz not null default now()
);

create table public.rsvp (
  id bigint generated always as identity primary key,
  undangan text not null references public.undangan (slug) on delete cascade,
  nama text not null check (char_length(nama) between 1 and 80),
  hadir boolean not null,
  ucapan text not null default '' check (char_length(ucapan) <= 600),
  -- nama tamu dari link undangan (?to=...), untuk mencocokkan siapa yang sudah membalas
  tamu text check (char_length(tamu) <= 80),
  -- false = ucapan disembunyikan pengantin dari halaman undangan (tetap tercatat di rekap)
  tampil boolean not null default true,
  dibuat timestamptz not null default now()
);

-- Daftar ucapan per undangan, terbaru dulu. Kolom undangan paling kiri, jadi sekaligus menjadi indeks foreign key.
create index rsvp_undangan_id_idx on public.rsvp (undangan, id desc);

alter table public.undangan enable row level security;
alter table public.rsvp enable row level security;

revoke all on table public.undangan, public.rsvp from anon, authenticated;
grant select, insert, update, delete on table public.undangan, public.rsvp to service_role;
