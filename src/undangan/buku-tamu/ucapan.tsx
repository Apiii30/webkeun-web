"use client";

import { motion } from "motion/react";
import { type Dispatch, type SetStateAction, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Paginasi, usePaginasi } from "./paginasi";
import type { BalasanTamu } from "./rekap";
import { ubahTampil } from "./rekap-aksi";

// Balasan RSVP & ucapan tamu di halaman rekap: ringkasan hadir/tidak, saring & cari, dan tiap ucapan bisa
// disembunyikan dari halaman undangan (tetap tercatat di sini & di CSV).

type Saring = "semua" | "hadir" | "tidak" | "sembunyi";

const waktu = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
// warna lingkaran inisial, dipilih dari nama supaya tiap tamu konsisten
const warnaAvatar = ["bg-brand text-white", "bg-mint text-ink", "bg-[#ffd6e0] text-[#a3324d]", "bg-[#ffe7b3] text-[#7a4f00]", "bg-lilac text-brand", "bg-ink text-white"];
const avatar = (nama: string) => warnaAvatar[[...nama].reduce((a, c) => a + c.charCodeAt(0), 0) % warnaAvatar.length];
const inisial = (nama: string) =>
  nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0]?.toUpperCase())
    .join("");

export function DaftarUcapan({
  slug,
  kunci,
  balasan,
  setBalasan,
  kabar,
}: {
  slug: string;
  kunci: string;
  balasan: BalasanTamu[];
  setBalasan: Dispatch<SetStateAction<BalasanTamu[]>>;
  kabar: (teks: string, galat?: boolean) => void;
}) {
  const [saring, setSaring] = useState<Saring>("semua");
  const [cari, setCari] = useState("");

  const hadir = balasan.filter((b) => b.hadir).length;
  const jumlah = { semua: balasan.length, hadir, tidak: balasan.length - hadir, sembunyi: balasan.filter((b) => !b.tampil).length };
  const q = cari.trim().toLowerCase();
  const tampil = balasan.filter(
    (b) =>
      (saring === "semua" || (saring === "hadir" ? b.hadir : saring === "tidak" ? !b.hadir : !b.tampil)) &&
      (!q || b.nama.toLowerCase().includes(q) || b.ucapan.toLowerCase().includes(q) || (b.tamu ?? "").toLowerCase().includes(q)),
  );
  const halaman = usePaginasi(tampil, `${saring}|${q}`);
  const atasDaftar = useRef<HTMLUListElement>(null);

  async function aturTampil(b: BalasanTamu) {
    const tampilBaru = !b.tampil;
    setBalasan((d) => d.map((x) => (x.id === b.id ? { ...x, tampil: tampilBaru } : x)));
    if (await ubahTampil(slug, kunci, b.id, tampilBaru)) kabar(tampilBaru ? "Ucapan tampil lagi di undangan" : "Ucapan disembunyikan dari undangan");
    else {
      setBalasan((d) => d.map((x) => (x.id === b.id ? { ...x, tampil: b.tampil } : x)));
      kabar("Gagal menyimpan. Coba lagi.", true);
    }
  }

  if (!balasan.length) {
    return (
      <div className="rounded-[1.75rem] bg-lilac-soft px-6 py-14 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-white text-brand shadow-sm">
          <Icon name="chat" className="size-7" />
        </span>
        <p className="mt-4 text-lg font-bold">Belum ada ucapan</p>
        <p className="mx-auto mt-1 max-w-sm text-ink/60">Setelah tamu mengisi RSVP di undangan, kehadiran & ucapan mereka muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ringkasan kehadiran */}
      <section className="rounded-[1.75rem] bg-lilac-soft p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink/55">Konfirmasi kehadiran</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {hadir} <span className="text-base font-semibold text-ink/50">hadir dari {balasan.length} balasan</span>
            </p>
          </div>
          <a
            href={`/rekap/${slug}/csv?kunci=${encodeURIComponent(kunci)}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-semibold ring-1 ring-ink/10 hover:bg-lilac"
          >
            <Icon name="download" className="size-4" /> Unduh CSV
          </a>
        </div>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white">
          <motion.div className="h-full bg-brand" initial={{ width: 0 }} animate={{ width: `${(hadir / balasan.length) * 100}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
          <motion.div
            className="h-full bg-[#f5a3b5]"
            initial={{ width: 0 }}
            animate={{ width: `${(jumlah.tidak / balasan.length) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          />
        </div>
        <div className="mt-2 flex gap-4 text-sm text-ink/60">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-brand" /> Hadir {hadir}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#f5a3b5]" /> Tidak hadir {jumlah.tidak}
          </span>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Cari ucapan</span>
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/40" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama atau isi ucapan"
            className="w-full rounded-xl bg-white py-2 pr-3.5 pl-9 text-[15px] ring-1 ring-ink/10 outline-none placeholder:text-ink/35 focus:ring-2 focus:ring-brand/50"
          />
        </label>
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 py-1 sm:mx-0 sm:px-0">
          {(
            [
              ["semua", "Semua"],
              ["hadir", "Hadir"],
              ["tidak", "Tidak hadir"],
              ["sembunyi", "Disembunyikan"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setSaring(k)}
              aria-pressed={saring === k}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${saring === k ? "bg-ink text-white" : "bg-white text-ink/70 ring-1 ring-ink/10 hover:bg-lilac-soft"}`}
            >
              {label}
              <span className={`rounded-full px-1.5 text-xs tabular-nums ${saring === k ? "bg-white/20" : "bg-ink/[0.06]"}`}>{jumlah[k]}</span>
            </button>
          ))}
        </div>
      </div>

      <ul ref={atasDaftar} className="scroll-mt-24 columns-1 gap-3 md:columns-2 [&>li]:mb-3">
        {halaman.isi.map((b) => (
          <li key={b.id} className={`break-inside-avoid rounded-3xl p-5 ring-1 transition-opacity ${b.tampil ? "bg-white ring-ink/10" : "bg-ink/[0.03] opacity-60 ring-ink/5"}`}>
            <div className="flex items-start gap-3">
              <span className={`grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold ${avatar(b.nama)}`}>{inisial(b.nama)}</span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-bold">{b.nama}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${b.hadir ? "bg-brand/10 text-brand" : "bg-[#fde3e9] text-[#b0415b]"}`}>{b.hadir ? "Hadir" : "Tidak hadir"}</span>
                </p>
                <p className="mt-0.5 text-xs text-ink/45">
                  {waktu.format(new Date(b.dibuat))}
                  {b.tamu && b.tamu.toLowerCase() !== b.nama.toLowerCase() && <> · dari link {b.tamu}</>}
                </p>
              </div>
            </div>

            {b.ucapan ? (
              <blockquote className="relative mt-4 pl-6 leading-relaxed whitespace-pre-line text-ink/80">
                <span className="absolute -top-2 left-0 font-serif text-4xl leading-none text-brand/25" aria-hidden="true">
                  “
                </span>
                {b.ucapan}
              </blockquote>
            ) : (
              <p className="mt-4 text-sm text-ink/40 italic">Tidak menulis ucapan.</p>
            )}

            {b.ucapan && (
              <button
                type="button"
                onClick={() => aturTampil(b)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink/55 ring-1 ring-ink/10 transition-colors hover:bg-lilac-soft hover:text-brand"
              >
                <Icon name={b.tampil ? "eye-off" : "eye"} className="size-3.5" />
                {b.tampil ? "Sembunyikan dari undangan" : "Tampilkan lagi di undangan"}
              </button>
            )}
          </li>
        ))}
      </ul>
      {!tampil.length && <p className="rounded-2xl bg-lilac-soft p-6 text-center text-sm text-ink/55">Tidak ada ucapan yang cocok.</p>}
      <Paginasi {...halaman} gulirKe={atasDaftar} />
    </div>
  );
}
