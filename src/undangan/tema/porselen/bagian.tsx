"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { calendarLink } from "../../pakai";
import type { Undangan } from "../../types";
import { Galeri } from "./galeri";
import { Beranda } from "./gerbang";
import { Bunga, Burung, Danau, FotoGunungan, HALUS, Kapsul, KelopakJatuh, Monogram, Muncul, Pembatas, Perahu, Piring, gilda, naskah } from "./hias";
import { Amplop, Countdown, Ucapan, tombolBiru, tombolEmas } from "./interaktif";
import { Kisah } from "./kisah";
import s from "./porselen.module.css";

// Isi undangan tema Biru Porselen. Bagian bergantian antara kertas gading dan panel kobalt, disambung tepi
// bergelombang seperti permukaan danau. Hampir semua elemen punya lapisan parallax (porselen.module.css).

const TINTA = "text-[#1f3768]";

// Tepi bergelombang di puncak bagian, berwarna sama dengan bagiannya, menimpa bagian sebelumnya
export function Ombak({ warna }: { warna: string }) {
  return (
    <svg viewBox="0 0 440 28" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-7 w-full -translate-y-[98%]" aria-hidden="true">
      <path d="M0 28V16C40 4 80 4 120 14s80 12 120 2 80-14 120-4 60 8 80 4V28Z" fill={warna} />
    </svg>
  );
}

function Bagian({ id, biru = false, className = "", children }: { id?: string; biru?: boolean; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`${s.sek} relative ${biru ? `${s.biru} text-[#f6f3ec]` : `${s.kertas} ${TINTA}`} ${className}`}>
      <Ombak warna={biru ? "#233c70" : "#f6f3ec"} />
      {children}
    </section>
  );
}

function Judul({ children, terang = false, kecil }: { children: string; terang?: boolean; kecil?: string }) {
  return (
    <div className={`${s.pJudul} text-center`}>
      {kecil && (
        <Muncul>
          <p className={`text-[10px] tracking-[0.45em] uppercase ${terang ? "text-[#d8b56e]" : "text-[#b8934f]"}`}>{kecil}</p>
        </Muncul>
      )}
      <Muncul jeda={0.1} dari="scale(0.82)">
        <h2 className={`${naskah} text-[3rem] leading-tight ${terang ? "text-[#f6f3ec]" : "text-[#1f3768]"}`}>{children}</h2>
      </Muncul>
      <Muncul jeda={0.25}>
        <Pembatas terang={terang} />
      </Muncul>
    </div>
  );
}

function Tumpal() {
  return (
    <>
      <span className={`${s.tumpal} pointer-events-none absolute top-0 bottom-0 left-0 w-4 opacity-90`} aria-hidden="true" />
      <span className={`${s.tumpal} pointer-events-none absolute top-0 right-0 bottom-0 w-4 -scale-x-100 opacity-90`} aria-hidden="true" />
    </>
  );
}

function hariTanggal(tanggal: string) {
  const [hari, ...rest] = tanggal.split(",");
  return { hari: hari.trim(), tgl: rest.join(",").trim() };
}

/* ───────── 2. Ayat: foto di piring porselen ───────── */

function Ayat({ u }: { u: Undangan }) {
  if (!u.ayat) return null;
  return (
    <Bagian className="z-10 px-8 pt-14 pb-20 text-center">
      <Muncul dari="scale(0.6)" durasi={1.4}>
        <Monogram a={u.wanita.panggilan[0]} b={u.pria.panggilan[0]} />
      </Muncul>
      <div className="relative mx-auto mt-8 w-[74%]">
        <Muncul dari="rotate(-25deg)" durasi={1.8} amount={0.25}>
          <Piring src={u.foto.kutipan} alt="" sizes="300px" />
        </Muncul>
        <Bunga a="peony" className={`${s.pDekat} -bottom-[12%] -left-[22%] w-[62%]`} sizes="200px" asal="30% 100%" />
        <Bunga a="hortensia" className={`${s.pDekat} -right-[16%] -bottom-[16%] w-[42%]`} sizes="140px" varian="B" />
      </div>
      <Muncul jeda={0.2} className="mt-12">
        <p className="text-[15px] leading-relaxed italic">“{u.ayat.teks}”</p>
      </Muncul>
      <Muncul jeda={0.35}>
        <p className={`${gilda} mt-4 text-[12px] tracking-[0.3em] text-[#b8934f] uppercase`}>{u.ayat.sumber}</p>
      </Muncul>
    </Bagian>
  );
}

/* ───────── 3. Mempelai: bingkai kapsul kawung ───────── */

function Mempelai({ u }: { u: Undangan }) {
  const orang = [u.wanita, u.pria];
  return (
    <Bagian id="mempelai" className="overflow-x-clip px-9 pt-14 pb-24 text-center">
      <Tumpal />
      <Judul kecil="Bride & Groom">Mempelai</Judul>
      {u.salam && (
        <Muncul jeda={0.1}>
          <p className={`${gilda} mt-6 text-[1.05rem]`}>{u.salam.buka}</p>
        </Muncul>
      )}
      <Muncul jeda={0.2}>
        <p className="mt-2 text-[14px] leading-relaxed">{u.pembuka}</p>
      </Muncul>
      {orang.map((p, i) => (
        <div key={p.nama} className="relative">
          {i === 1 && (
            <Muncul dari="scale(0.3)" durasi={1.3} className="my-7">
              <p className={`${naskah} text-6xl text-[#b8934f]`}>dan</p>
            </Muncul>
          )}
          <div className={`relative mx-auto w-[58%] ${i === 0 ? "mt-10" : ""}`}>
            <Muncul dari={i ? "translateX(60px)" : "translateX(-60px)"} durasi={1.5}>
              <Kapsul src={p.foto} alt={p.nama} sizes="240px" />
            </Muncul>
            <Bunga a={i ? "peonyBiru" : "peony"} className={`${s.pDekat} -bottom-[10%] w-[78%] ${i ? "-right-[46%]" : "-left-[46%]"}`} sizes="180px" flip={!!i} asal={i ? "70% 100%" : "30% 100%"} />
          </div>
          <Muncul jeda={0.1} dari="scale(0.85)" className="relative mt-7">
            <h3 className={`${naskah} text-[2.5rem] leading-tight`}>{p.nama}</h3>
          </Muncul>
          <Muncul jeda={0.25}>
            <p className="mt-1 text-[13px] leading-relaxed text-[#1f3768]/85">{p.keterangan}</p>
          </Muncul>
        </div>
      ))}
    </Bagian>
  );
}

/* ───────── 4. Save the date: panel kobalt dengan danau di dasarnya ───────── */

function SimpanTanggal({ u }: { u: Undangan }) {
  return (
    <Bagian biru className="overflow-x-clip px-6 pt-14 pb-40 text-center">
      <Judul terang kecil="Menghitung hari">
        Save The Date
      </Judul>
      <Muncul jeda={0.2}>
        <p className="mx-auto mt-4 max-w-[19rem] text-sm leading-relaxed text-[#f6f3ec]/85">Dan kami bersyukur, dipertemukan di waktu terbaik. Kini kami menanti hari istimewa itu.</p>
      </Muncul>
      <div className="mt-7 [perspective:800px]">
        <Countdown target={u.mulai} />
      </div>
      <Muncul jeda={0.3} className="relative z-10 mt-8">
        <a href={calendarLink(u)} target="_blank" rel="noopener noreferrer" className={tombolEmas}>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="4" y="5" width="16" height="15" rx="2" />
            <path d="M8 3v4M16 3v4M4 10h16" />
          </svg>
          Simpan Tanggal
        </a>
      </Muncul>
      <Danau className="inset-x-0 bottom-0 h-32 opacity-80" />
      <Perahu className="bottom-16 left-[14%] w-[11%]" />
      <Perahu className="right-[18%] bottom-20 w-[7%]" jeda={-8} />
    </Bagian>
  );
}

/* ───────── 5. Acara: kartu yang jatuh terbuka seperti ubin porselen ───────── */

function KartuAcara({ u, a, ke }: { u: Undangan; a: Undangan["acara"][number]; ke: number }) {
  const { hari, tgl } = hariTanggal(u.tanggal);
  return (
    <div className="[perspective:1100px]">
      <motion.div
        className="relative overflow-hidden rounded-[1.4rem] bg-[#fbfaf6] text-center shadow-[0_26px_40px_-26px_rgb(15_28_56/0.9)] ring-1 ring-[#27427a]/25"
        style={{ transformOrigin: "50% 0%" }}
        initial={{ opacity: 0, transform: "rotateX(-75deg)" }}
        whileInView={{ opacity: 1, transform: "rotateX(0deg)" }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1.5, ease: HALUS, delay: ke * 0.1 }}
      >
        <div className={`${s.kawung} h-4`} />
        <div className="relative px-7 pt-8 pb-32">
          <span className="pointer-events-none absolute inset-x-3 top-3 bottom-3 rounded-xl border border-[#b8934f]/60" aria-hidden="true" />
          <p className="text-[10px] tracking-[0.4em] text-[#b8934f] uppercase">Acara {ke + 1}</p>
          <h3 className={`${naskah} mt-1 text-[2.8rem] leading-none`}>{a.nama}</h3>
          <Pembatas className="my-3" />
          <p className={`${gilda} text-[1.15rem] leading-snug tracking-wide`}>
            {hari}, {tgl}
          </p>
          <p className="mt-1 text-[13px] tracking-[0.1em]">Pukul {a.jam}</p>
          <div className="mx-auto my-4 h-px w-16 bg-[#b8934f]/70" />
          <p className="text-[13px] font-semibold">{u.lokasi.nama}</p>
          <p className="text-[13px] leading-relaxed text-[#1f3768]/85">{u.lokasi.alamat}</p>
          <a href={u.lokasi.maps} target="_blank" rel="noopener noreferrer" className={`${tombolBiru} relative z-10 mt-5`}>
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            Lihat Lokasi
          </a>
        </div>
        <Bunga a={ke % 2 ? "hortensia" : "peony"} className={`bottom-[-14%] w-[50%] ${ke % 2 ? "-right-[6%]" : "-left-[8%]"}`} sizes="170px" asal="40% 100%" />
        <Bunga a={ke % 2 ? "peonyBiru" : "hortensia"} className={`bottom-[-12%] w-[34%] ${ke % 2 ? "-left-[4%]" : "-right-[4%]"}`} sizes="120px" varian="B" />
      </motion.div>
    </div>
  );
}

function Acara({ u }: { u: Undangan }) {
  return (
    <Bagian id="acara" className="px-6 pt-14 pb-24">
      <Judul kecil="Dengan penuh syukur">Rangkaian Acara</Judul>
      <div className="mt-8 space-y-10">
        {u.acara.map((a, i) => (
          <KartuAcara key={a.nama} u={u} a={a} ke={i} />
        ))}
      </div>
    </Bagian>
  );
}

/* ───────── 6. Galeri: carousel cincin 3D di panel kobalt ───────── */

function BagianGaleri({ u }: { u: Undangan }) {
  return (
    <Bagian id="galeri" biru className="overflow-x-clip px-4 pt-14 pb-24">
      <Judul terang kecil="Potret kami">
        Galeri
      </Judul>
      <div className="mt-6">
        <Galeri photos={u.foto.galeri} />
      </div>
    </Bagian>
  );
}

/* ───────── 8. Wedding gift & ucapan ───────── */

function KadoUcapan({ u, tamu }: { u: Undangan; tamu?: string }) {
  return (
    <Bagian id="ucapan" biru className="px-6 pt-14 pb-24 text-center">
      <Judul terang kecil="Tanda kasih">
        Wedding Gift
      </Judul>
      <Muncul jeda={0.2}>
        <p className="mx-auto mt-4 max-w-[20rem] text-sm leading-relaxed text-[#f6f3ec]/85">
          Doa restu Anda adalah hadiah terindah bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, kami menerimanya dengan senang hati.
        </p>
      </Muncul>
      <Muncul jeda={0.3} className="mt-6">
        <Amplop amplop={u.amplop} />
      </Muncul>
      <div className="mt-20">
        <Judul terang kecil="Doa & restu">
          Ucapan
        </Judul>
        <Muncul jeda={0.2} className="mt-8">
          <Ucapan tamu={tamu} />
        </Muncul>
      </div>
    </Bagian>
  );
}

/* ───────── 9. Penutup: jendela gunungan kembali, kini berisi foto ───────── */

function Penutup({ u }: { u: Undangan }) {
  return (
    <Bagian className="min-h-svh overflow-x-clip px-8 pt-16 pb-[calc(16rem+var(--demo-h,0px))] text-center">
      <Tumpal />
      <Burung className="top-[5%] left-0" delay={-3} />
      <Burung className="top-[8%] left-0" delay={-12} size={11} />
      <div className={`${s.mendekat} relative`}>
        <div className="relative mx-auto w-[62%]">
          <FotoGunungan src={u.foto.belakang} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} sizes="260px" />
        </div>
        <Muncul className="mt-14">
          <p className="text-[14px] leading-relaxed">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p>
        </Muncul>
        {u.salam && (
          <Muncul jeda={0.15}>
            <p className={`${gilda} mt-4 text-[1.05rem]`}>{u.salam.tutup}</p>
          </Muncul>
        )}
        <Muncul jeda={0.25}>
          <p className="mt-6 text-[10px] tracking-[0.45em] text-[#b8934f] uppercase">Kami yang berbahagia</p>
        </Muncul>
        <Muncul jeda={0.35} dari="scale(0.85)">
          <p className={`${naskah} mt-1 text-[3.2rem] leading-tight`}>
            {u.wanita.panggilan} <span className="text-[#b8934f]">&amp;</span> {u.pria.panggilan}
          </p>
        </Muncul>
      </div>
      <Danau className="inset-x-0 bottom-[var(--demo-h,0px)] h-36" />
      <Perahu className="bottom-[calc(5rem+var(--demo-h,0px))] left-[40%] w-[10%]" jeda={-4} />
      <Bunga a="peony" className="bottom-[calc(-1.5rem+var(--demo-h,0px))] left-[-8%] w-[58%]" sizes="250px" asal="30% 100%" />
      <Bunga a="hortensia" className="right-[-4%] bottom-[calc(-1.5rem+var(--demo-h,0px))] w-[42%]" sizes="180px" varian="B" />
      <KelopakJatuh n={7} />
    </Bagian>
  );
}

export function Isi({ u, opened, tamu }: { u: Undangan; opened: boolean; tamu?: string }) {
  return (
    <>
      <Beranda u={u} buka={opened} />
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
