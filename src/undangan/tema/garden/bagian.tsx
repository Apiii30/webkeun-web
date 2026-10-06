"use client";

import Image from "next/image";
import { type ReactNode, useId } from "react";
import { calendarLink } from "../../pakai";
import type { Undangan } from "../../types";
import { ASET } from "./aset";
import { Adegan } from "./adegan";
import { Burung, Gambar, Kameo, KelopakJatuh, Monogram, Muncul, Pembatas, PintuTaman, Putar, Tiang, Wisteria, cormorant, italiana } from "./hias";
import { Amplop, Countdown, Galeri, Ucapan, tombolEmas, tombolTeal } from "./interaktif";
import { Kisah as LorongGapura } from "./kisah";
import s from "./garden.module.css";
import { KreditWebkeun } from "../../kredit";

// Isi undangan tema Garden Premium. Setelah adegan taman di beranda, tiap bagian berpuncak lengkung lebar dan
// sedikit menumpuk di atas bagian sebelumnya, bergantian antara kertas kabut dan panel teal. Setiap sambungan diberi
// garis lengkung emas & medali bunga berlaurel di tengahnya, supaya semua bagian terasa satu rangkaian. Judul, foto &
// kartu masuk berputar seperti panel komidi putar (Putar), bergantian dari kanan & kiri.

const TINTA = "text-[#24434e]";

// Satu bagian berpuncak lengkung yang menumpuk 2.6rem di atas bagian sebelumnya
function Bagian({ id, panel = false, className = "", children }: { id?: string; panel?: boolean; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`${s.sek} relative -mt-[2.6rem] overflow-x-clip ${panel ? `${s.panel} text-[#f3efe3]` : `${s.kertas} rounded-t-[50%_2.6rem] ${TINTA}`} ${className}`}>
      {/* sambungan: garis lengkung emas di puncak bagian & medali bunga berlaurel di tengahnya */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[2.6rem] rounded-t-[50%_2.6rem] border-t-[1.5px] border-[#dcc58f]/90" aria-hidden="true" />
      <Sambung />
      {children}
    </section>
  );
}

function Sambung() {
  const id = useId().replace(/:/g, "");
  const daun = [10, 18, 26];
  return (
    <svg viewBox="0 0 80 30" className="pointer-events-none absolute top-0 left-1/2 z-20 w-20 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_3px_rgb(20_40_48/0.3)]" aria-hidden="true">
      <defs>
        <linearGradient id={`sb${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a6a33" />
          <stop offset=".45" stopColor="#f2e3b5" />
          <stop offset="1" stopColor="#a8843f" />
        </linearGradient>
      </defs>
      {[1, -1].map((k) => (
        <g key={k} transform={k < 0 ? "translate(80 0) scale(-1 1)" : undefined}>
          <path d="M30 16C22 14 12 14 3 18" fill="none" stroke={`url(#sb${id})`} strokeWidth="1.3" strokeLinecap="round" />
          {daun.map((x, i) => (
            <ellipse key={x} cx={x} cy={i % 2 ? 12.5 : 19.5} rx="4.4" ry="1.9" transform={`rotate(${i % 2 ? -22 : 22} ${x} ${i % 2 ? 12.5 : 19.5})`} fill={`url(#sb${id})`} />
          ))}
        </g>
      ))}
      <circle cx="40" cy="15" r="11" fill="#eef1ec" stroke={`url(#sb${id})`} strokeWidth="1.6" />
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="40" cy="10" rx="2.6" ry="4.6" transform={`rotate(${r} 40 15)`} fill={`url(#sb${id})`} />
      ))}
      <circle cx="40" cy="15" r="2.2" fill="#fff4d6" />
    </svg>
  );
}

// Judul bagian: tulisan miring Cormorant, sedikit mendahului halaman saat digulir
function Judul({ children, terang = false, kecil, arah = 1 }: { children: string; terang?: boolean; kecil?: string; arah?: 1 | -1 }) {
  return (
    <Putar arah={arah} className={`${s.pJudul} text-center`}>
      {kecil && (
        <Muncul>
          <p className={`text-[10px] tracking-[0.4em] uppercase ${terang ? "text-[#dcc58f]" : "text-[#b9975b]"}`}>{kecil}</p>
        </Muncul>
      )}
      <Muncul jeda={0.1} dari="scale(0.85)">
        <h2 className={`${cormorant} mt-1 text-[2.5rem] leading-tight italic ${terang ? "text-[#f3efe3]" : "text-[#24434e]"}`}>{children}</h2>
      </Muncul>
      <Muncul jeda={0.25}>
        <Pembatas className="mt-1" />
      </Muncul>
    </Putar>
  );
}

function hariTanggal(tanggal: string) {
  const [hari, ...rest] = tanggal.split(",");
  return { hari: hari.trim(), tgl: rest.join(",").trim() };
}

/* ───────── 2. Ayat ───────── */

function Ayat({ u }: { u: Undangan }) {
  if (!u.ayat) return null;
  return (
    <Bagian panel className="z-10 px-8 pt-16 pb-20 text-center">
      <Wisteria className={`${s.pJauh} top-0 left-[4%] w-[13%]`} />
      <Wisteria className={`${s.pJauh} top-0 right-[4%] w-[11%]`} jeda={-1.4} />
      <Muncul dari="scale(0.6)" durasi={1.4}>
        <Monogram a={u.wanita.panggilan[0]} b={u.pria.panggilan[0]} terang />
      </Muncul>
      <Muncul jeda={0.2}>
        <p className={`${cormorant} mt-6 text-[1.2rem] leading-relaxed italic`}>“{u.ayat.teks}”</p>
      </Muncul>
      <Muncul jeda={0.35}>
        <p className="mt-4 text-[11px] tracking-[0.3em] text-[#dcc58f] uppercase">{u.ayat.sumber}</p>
      </Muncul>
    </Bagian>
  );
}

/* ───────── 3. Mempelai ───────── */

function Mempelai({ u }: { u: Undangan }) {
  const orang = [u.wanita, u.pria];
  return (
    <Bagian id="mempelai" className="px-7 pt-16 pb-[82%] text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] opacity-[0.16] [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true">
        <Image src={ASET.lembah.src} alt="" fill sizes="440px" className="object-cover object-top" />
      </div>
      {u.salam && (
        <Muncul>
          <p className={`${cormorant} relative text-[1.45rem] italic`}>{u.salam.buka}</p>
        </Muncul>
      )}
      <Muncul jeda={0.15}>
        <p className="relative mt-3 text-[14px] leading-relaxed font-light">{u.pembuka}</p>
      </Muncul>

      {orang.map((p, i) => (
        <div key={p.nama} className="relative">
          {i === 1 && (
            <Muncul dari="scale(0.4)" durasi={1.4} className="my-6">
              <p className={`${italiana} text-6xl text-[#b9975b]`}>&amp;</p>
            </Muncul>
          )}
          <div className={`relative mx-auto w-[72%] ${i === 0 ? "mt-10" : ""}`}>
            <Putar arah={i ? 1 : -1} durasi={1.6}>
              <Kameo src={p.foto} alt={p.nama} sizes="260px" posisi="50% 20%" />
            </Putar>
            {/* bunga di satu sudut bawah bingkai, bergantian sisi */}
            <Muncul jeda={0.4} dari="scale(0.5)" className={`${s.pDekat} pointer-events-none absolute -bottom-[6%] w-[52%] ${i ? "-right-[16%]" : "-left-[16%]"}`} style={{ transformOrigin: i ? "80% 100%" : "20% 100%" }}>
              <div className={s.ayunA} style={{ transformOrigin: "50% 100%" }}>
                <Gambar a={i ? "peonyMerah" : "peony"} sizes="150px" />
              </div>
            </Muncul>
          </div>
          <Muncul jeda={0.1} dari="scale(0.85)" className="relative mt-7">
            <h3 className={`${italiana} text-[2.1rem] leading-tight`}>{p.nama}</h3>
          </Muncul>
          <Muncul jeda={0.25}>
            <p className="mt-2 text-[13px] leading-relaxed font-light">{p.keterangan}</p>
          </Muncul>
        </div>
      ))}

      {/* dua merak saling berhadapan di dasar bagian */}
      <Muncul dari="translateY(60px)" durasi={1.6} className="pointer-events-none absolute bottom-[2.6rem] left-0 w-[38%]" amount={0.2}>
        <Gambar a="merakDahan" flip sizes="200px" />
      </Muncul>
      <Muncul dari="translateY(60px)" durasi={1.6} jeda={0.2} className="pointer-events-none absolute right-0 bottom-[2.6rem] w-[36%]" amount={0.2}>
        <Gambar a="merakSakura" sizes="190px" />
      </Muncul>
    </Bagian>
  );
}

/* ───────── 4. Save the date ───────── */

function SimpanTanggal({ u }: { u: Undangan }) {
  return (
    <Bagian panel className="px-6 pt-16 pb-20 text-center">
      <Judul terang kecil="Hitung mundur" arah={-1}>
        Save The Date
      </Judul>
      <Muncul jeda={0.2}>
        <p className="mx-auto mt-4 max-w-[19rem] text-sm leading-relaxed font-light text-[#f3efe3]/85">Dan kami bersyukur, dipertemukan Allah di waktu terbaik. Kini kami menanti hari istimewa itu.</p>
      </Muncul>
      <div className="mt-7">
        <Countdown target={u.mulai} />
      </div>
      <Muncul jeda={0.3} className="mt-8">
        <a href={calendarLink(u)} target="_blank" rel="noopener noreferrer" className={tombolEmas}>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="4" y="5" width="16" height="15" rx="2" />
            <path d="M8 3v4M16 3v4M4 10h16" />
          </svg>
          Simpan Tanggal
        </a>
      </Muncul>
    </Bagian>
  );
}

/* ───────── 5. Acara: kartu di bawah pergola, ditutup pintu taman yang terbuka saat terlihat ───────── */

function KartuAcara({ u, a, ke }: { u: Undangan; a: Undangan["acara"][number]; ke: number }) {
  const { hari, tgl } = hariTanggal(u.tanggal);
  return (
    <Putar arah={ke % 2 ? 1 : -1} amount={0.2} className="relative mx-auto w-[86%] pt-6 pb-4">
      <Tiang className="top-[3.8rem] bottom-4 -left-[30px]" />
      <Tiang className="top-[3.8rem] -right-[30px] bottom-4" />
      <div className="relative rounded-t-[999px] rounded-b-md border-2 border-[#34596a] bg-[#f3f5f1] px-7 pt-20 pb-10 text-center shadow-[0_26px_40px_-26px_rgb(20_40_48/0.9)]">
        <span className="pointer-events-none absolute inset-2 rounded-t-[999px] rounded-b-sm border border-[#b9975b]/70" aria-hidden="true" />
        <p className="text-[10px] tracking-[0.4em] text-[#b9975b] uppercase">Acara {ke + 1}</p>
        <h3 className={`${cormorant} mt-1 text-[2.3rem] leading-tight italic`}>{a.nama}</h3>
        <Pembatas className="my-2" />
        <p className={`${italiana} text-[1.35rem] leading-snug`}>
          {hari}
          <br />
          {tgl}
        </p>
        <p className="mt-2 text-[13px] tracking-[0.12em]">Pukul {a.jam}</p>
        <div className="mx-auto my-4 h-px w-16 bg-[#b9975b]/70" />
        <p className="text-[13px] font-medium">{u.lokasi.nama}</p>
        <p className="text-[13px] leading-relaxed font-light">{u.lokasi.alamat}</p>
        <a href={u.lokasi.maps} target="_blank" rel="noopener noreferrer" className={`${tombolTeal} mt-5`}>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          Lihat Lokasi
        </a>
        <PintuTaman />
      </div>
      {/* wisteria menjuntai dari puncak pergola, peony di kaki tiang */}
      <Wisteria className="top-[3.4rem] -left-[22px] w-[15%]" />
      <Wisteria className="top-[3.4rem] -right-[22px] w-[13%]" jeda={-1.2} />
      <Muncul dari="scale(0.5)" jeda={0.9} className="pointer-events-none absolute -bottom-3 -left-[34px] w-[34%]" style={{ transformOrigin: "20% 100%" }}>
        <div className={s.ayunB} style={{ transformOrigin: "40% 100%" }}>
          <Gambar a={ke % 2 ? "peonyMerah" : "peony"} sizes="120px" />
        </div>
      </Muncul>
    </Putar>
  );
}

function Acara({ u }: { u: Undangan }) {
  return (
    <Bagian id="acara" className="px-4 pt-16 pb-24">
      <Judul kecil="Dengan penuh syukur">Rangkaian Acara</Judul>
      <div className="mt-6 space-y-12">
        {u.acara.map((a, i) => (
          <KartuAcara key={a.nama} u={u} a={a} ke={i} />
        ))}
      </div>
    </Bagian>
  );
}

/* ───────── 6. Galeri: tumpukan kartu foto berpigura emas ───────── */

function BagianGaleri({ u }: { u: Undangan }) {
  return (
    <Bagian id="galeri" panel className="px-6 pt-16 pb-24">
      <Judul terang kecil="Potret kami" arah={-1}>
        Galeri
      </Judul>
      <Putar arah={1} amount={0.2} durasi={1.6} className="mt-10">
        <Galeri photos={u.foto.galeri} />
      </Putar>
    </Bagian>
  );
}

/* ───────── 7. Kisah cinta: lorong gapura (kisah.tsx) ───────── */

function Kisah({ u }: { u: Undangan }) {
  return (
    <Bagian id="cerita" className="px-4 pt-16 pb-20">
      <Judul kecil="Perjalanan kami">Kisah Cinta</Judul>
      <LorongGapura u={u} />
    </Bagian>
  );
}

/* ───────── 8. Wedding gift & ucapan ───────── */

function KadoUcapan({ u, tamu }: { u: Undangan; tamu?: string }) {
  return (
    <Bagian id="ucapan" panel className="px-6 pt-16 pb-24 text-center">
      <Judul terang kecil="Tanda kasih">
        Wedding Gift
      </Judul>
      <Muncul jeda={0.2}>
        <p className="mx-auto mt-4 max-w-[20rem] text-sm leading-relaxed font-light text-[#f3efe3]/85">
          Doa restu Anda adalah hadiah terindah bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, kami menerimanya dengan senang hati.
        </p>
      </Muncul>
      <Putar arah={1} jeda={0.2} className="mt-6">
        <Amplop amplop={u.amplop} />
      </Putar>
      <div className="mt-20">
        <Judul terang kecil="Doa & restu" arah={-1}>
          Ucapan
        </Judul>
        <Putar arah={-1} jeda={0.15} amount={0.15} className="mt-8">
          <Ucapan tamu={tamu} />
        </Putar>
      </div>
    </Bagian>
  );
}

/* ───────── 9. Penutup: kembali ke gapura taman ───────── */

function Penutup({ u }: { u: Undangan }) {
  return (
    <Bagian className="min-h-svh px-7 pt-14 pb-[calc(20rem+var(--demo-h,0px))] text-center">
      <div className="pointer-events-none absolute inset-0 opacity-[0.22] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_70%,transparent)]" aria-hidden="true">
        <Image src={ASET.lembah.src} alt="" fill sizes="440px" className={`${s.geserLambat} object-cover`} />
      </div>
      <Burung className="top-[6%] left-0" delay={-3} />
      <Burung className="top-[9%] left-0" delay={-12} size={11} />
      <div className={`${s.mendekat} relative`}>
        <div className="relative mx-auto w-[92%]">
          <Gambar a="gapura" sizes="400px" />
          <div className="absolute top-[28%] left-1/2 w-[46%] -translate-x-1/2">
            <Kameo src={u.foto.belakang} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} sizes="200px" />
          </div>
          <Wisteria className="top-[22%] left-[13%] w-[10%]" />
          <Wisteria className="top-[22%] right-[13%] w-[10%]" jeda={-1} />
        </div>
        <Muncul className="mt-2">
          <p className="relative text-[14px] leading-relaxed font-light">Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.</p>
        </Muncul>
        {u.salam && (
          <Muncul jeda={0.15}>
            <p className={`${cormorant} relative mt-4 text-[1.4rem] italic`}>{u.salam.tutup}</p>
          </Muncul>
        )}
        <Muncul jeda={0.25}>
          <p className="relative mt-5 text-[10px] tracking-[0.4em] text-[#b9975b] uppercase">Kami yang berbahagia</p>
        </Muncul>
        <Muncul jeda={0.35} dari="scale(0.85)">
          <p className={`${italiana} relative mt-2 text-[2.6rem] leading-tight`}>
            {u.wanita.panggilan} <span className={`${cormorant} text-[#b9975b] italic`}>&amp;</span> {u.pria.panggilan}
          </p>
        </Muncul>
        <KreditWebkeun className="relative mt-12" />
      </div>
      <Muncul dari="translateY(80px)" durasi={1.6} amount={0.1} className="pointer-events-none absolute right-0 bottom-[calc(1rem+var(--demo-h,0px))] w-[38%]">
        <Gambar a="merakSakura" sizes="200px" />
      </Muncul>
      <Muncul dari="translateY(80px)" durasi={1.6} jeda={0.2} amount={0.1} className="pointer-events-none absolute bottom-[calc(-1rem+var(--demo-h,0px))] left-0 w-[52%]">
        <div className={s.ayunA} style={{ transformOrigin: "30% 100%" }}>
          <Gambar a="peony" sizes="270px" />
        </div>
      </Muncul>
      <KelopakJatuh n={7} />
    </Bagian>
  );
}

export function Isi({ u, opened, tamu }: { u: Undangan; opened: boolean; tamu?: string }) {
  return (
    <>
      <Adegan u={u} buka={opened} />
      <Ayat u={u} />
      <Mempelai u={u} />
      <SimpanTanggal u={u} />
      <Acara u={u} />
      <BagianGaleri u={u} />
      <Kisah u={u} />
      <KadoUcapan u={u} tamu={tamu} />
      <Penutup u={u} />
    </>
  );
}
