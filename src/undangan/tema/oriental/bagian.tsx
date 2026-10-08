"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { calendarLink } from "../../pakai";
import type { Undangan } from "../../types";
import { Galeri } from "./galeri";
import { Awan, Bunga, Gambar, Genteng, HALUS, JendelaBulan, KawananBangau, KelopakJatuh, Lentera, Muncul, Pembatas, PitaMeander, Shuangxi, naskah, yuji } from "./hias";
import { Amplop, Countdown, Ucapan, tombolMerah } from "./interaktif";
import { Kisah } from "./kisah";
import s from "./oriental.module.css";
import { Beranda } from "./pembuka";
import { KreditWebkeun } from "../../kredit";

// Isi undangan tema Oriental Peony. Bagian bergantian antara kertas krem dan panel merah pernis, disambung tepi
// genteng dengan koin keberuntungan emas di tengah sambungannya. Bagian-bagiannya mengalir menyambung: tidak ada lagi efek bagian yang lewat mengecil & meredup di bawah bagian
// berikutnya (membuat perpindahan antarbagian terasa terputus). Ornamen di dalam bagian sengaja tidak diberi parallax
// scroll lagi (dulu pola awan, lentera, judul, gunung & bambu bergeser mengikuti scroll dan membuat layar HP bergetar);
// gerak hanya dari animasi masuk saat terlihat & goyangan pelan bunga/lentera.

function Bagian({ id, merah = false, className = "", children }: { id?: string; merah?: boolean; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`relative ${merah ? `${s.merah} text-[#fff6e6]` : `${s.kertas} text-[#3b1d16]`} ${className}`}>
      <Genteng warna={merah ? "#9e1c22" : "#f8efdc"} />
      <KoinSambung />
      {/* awan keberuntungan samar (diam: lapisan setinggi bagian yang ikut digeser saat scroll membuat layar bergetar) */}
      <div className={`${s.polaAwan} pointer-events-none absolute inset-0 ${merah ? "opacity-[0.12]" : "opacity-[0.16]"}`} aria-hidden="true" />
      {children}
    </section>
  );
}

// Koin emas berlubang persegi tepat di sambungan dua bagian, dengan tali merah ke kiri-kanan di sepanjang genteng
function KoinSambung() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0" aria-hidden="true">
      <div className="absolute top-[-7px] left-1/2 h-[2px] w-[44%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,#b3242b_25%,#b3242b_75%,transparent)]" />
      <svg viewBox="0 0 40 40" className="absolute top-0 left-1/2 w-10 -translate-x-1/2 -translate-y-[60%] drop-shadow-[0_3px_4px_rgb(60_10_10/0.35)]">
        <circle cx="20" cy="20" r="17" fill="#c99a3e" stroke="#7d1418" strokeWidth="1.4" />
        <circle cx="20" cy="20" r="13.5" fill="none" stroke="#f6dc94" strokeWidth="1" />
        <rect x="15" y="15" width="10" height="10" fill="#9e1c22" stroke="#7d1418" strokeWidth="1" />
        {[
          [20, 9.5],
          [30.5, 20],
          [20, 30.5],
          [9.5, 20],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" fill="#7d1418" />
        ))}
      </svg>
    </div>
  );
}

function Judul({ children, terang = false, kecil }: { children: string; terang?: boolean; kecil?: string }) {
  return (
    <div className="relative z-10 text-center">
      {kecil && (
        <Muncul>
          <p className={`${yuji} text-[10.5px] tracking-[0.42em] uppercase ${terang ? "text-[#f6dc94]" : "text-[#9e1c22]/80"}`}>{kecil}</p>
        </Muncul>
      )}
      <Muncul jeda={0.1} dari="scale(0.82)">
        <h2 className={`${naskah} text-[3.6rem] leading-tight ${terang ? "text-[#fff6e6]" : "text-[#9e1c22]"}`}>{children}</h2>
      </Muncul>
      <Muncul jeda={0.25}>
        <Pembatas terang={terang} />
      </Muncul>
    </div>
  );
}

function hariTanggal(tanggal: string) {
  const [hari, ...rest] = tanggal.split(",");
  const [tgl, ...bulanTahun] = rest.join(",").trim().split(" ");
  return { hari: hari.trim(), tgl, bulanTahun: bulanTahun.join(" ") };
}

// Sepasang lentera yang tergantung di puncak bagian (diam di tempatnya: kalau ikut parallax, talinya sempat
// menjulur melewati tepi genteng ke bagian sebelumnya)
function LenteraBagian() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-full" aria-hidden="true">
      <Lentera className="left-[5%] w-[11%]" tali="4.5rem" d={5.4} a={3} />
      <Lentera className="right-[6%] w-[9%]" tali="7rem" d={4.6} a={3.4} jeda={-2} />
    </div>
  );
}

/* ───────── 2. Pembuka: 囍, kutipan & foto jendela bulan ───────── */

function Pembuka({ u }: { u: Undangan }) {
  return (
    <Bagian className="overflow-x-clip px-8 pt-16 pb-24 text-center">
      <LenteraBagian />
      <Muncul dari="scale(0.4)" durasi={1.4}>
        <div className="mx-auto grid size-24 place-items-center rounded-full bg-[#b3242b] shadow-[0_12px_24px_-10px_rgb(125_20_24/0.7)] ring-4 ring-[#f6dc94]/80">
          <Shuangxi className="size-14" warna="#f6dc94" tebal={17} />
        </div>
      </Muncul>
      <Muncul jeda={0.15}>
        <p className={`${naskah} mt-6 text-[2.5rem] leading-tight text-[#9e1c22]`}>{u.kutipan}</p>
      </Muncul>
      <div className="relative mx-auto mt-10 w-[74%]">
        {/* peoni mengintip dari balik bingkai (di belakang foto, jadi tidak pernah menutupinya) */}
        <Bunga a="peoniMerahMuda" className="-bottom-[6%] -left-[16%] w-[36%]" sizes="130px" asal="30% 100%" />
        <Bunga a="peoniSalem" className="-right-[14%] -bottom-[4%] w-[33%]" sizes="120px" varian="B" asal="70% 100%" />
        <Muncul dari="rotate(-25deg)" durasi={1.7} amount={0.25} className="relative">
          <JendelaBulan src={u.foto.kutipan} alt="" sizes="280px" />
        </Muncul>
      </div>
      <Muncul jeda={0.2} className="relative mt-16">
        <p className="text-[15.5px] leading-relaxed text-[#3b1d16]/90">{u.pembuka}</p>
      </Muncul>
    </Bagian>
  );
}

/* ───────── 3. Mempelai: foto dalam jendela bulan ───────── */

function Mempelai({ u }: { u: Undangan }) {
  const orang = [u.wanita, u.pria];
  return (
    <Bagian id="mempelai" merah className="overflow-x-clip px-8 pt-16 pb-24 text-center">
      <KawananBangau className="top-[2%]" d={30} jeda={-8} n={2} />
      <Judul terang kecil="Pengantin">
        Bride &amp; Groom
      </Judul>
      {orang.map((p, i) => (
        <div key={p.nama} className="relative">
          {i === 1 && (
            <Muncul dari="scale(0.3)" durasi={1.3} className="my-9">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#f6dc94] ring-4 ring-[#7d1418]">
                <Shuangxi className="size-9" warna="#9e1c22" tebal={18} />
              </div>
            </Muncul>
          )}
          <div className={`relative mx-auto w-[70%] ${i === 0 ? "mt-12" : ""}`}>
            <div className={`absolute top-[4%] w-[46%] opacity-90 ${i ? "-left-[30%]" : "-right-[30%]"}`} aria-hidden="true">
              <Awan warna="#fff1d6" garis="#f6dc94" />
            </div>
            {/* peoni mengintip dari balik bingkai (di belakang foto, jadi tidak pernah menutupinya) */}
            <Bunga
              a={i ? "peoniSalem" : "peoniMerahMuda"}
              className={`-bottom-[6%] w-[34%] ${i ? "-right-[13%]" : "-left-[13%]"}`}
              sizes="120px"
              asal={i ? "70% 100%" : "30% 100%"}
            />
            <Muncul dari={i ? "translateX(60px)" : "translateX(-60px)"} durasi={1.5} className="relative">
              <JendelaBulan src={p.foto} alt={p.nama} sizes="300px" posisi="50% 25%" />
            </Muncul>
          </div>
          <Muncul jeda={0.1} dari="scale(0.88)" className="relative mt-12">
            <h3 className={`${naskah} text-[3rem] leading-none text-[#fff6e6]`}>{p.nama}</h3>
          </Muncul>
          <Muncul jeda={0.25}>
            <p className="relative mt-3 text-[15px] leading-relaxed text-[#fff6e6]/85">{p.keterangan}</p>
          </Muncul>
        </div>
      ))}
    </Bagian>
  );
}

/* ───────── 4. Save the date: lentera hitung mundur ───────── */

function SimpanTanggal({ u }: { u: Undangan }) {
  const { hari, tgl, bulanTahun } = hariTanggal(u.tanggal);
  return (
    <Bagian className="overflow-x-clip px-6 pt-16 pb-24 text-center">
      <div
        className={`pointer-events-none absolute inset-x-[-10%] top-[30%] opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_60%,transparent)]`}
        aria-hidden="true"
      >
        <Gambar a="gunungPuncak" sizes="(min-width: 440px) 480px, 120vw" />
      </div>
      <Judul kecil="Menghitung hari">Save The Date</Judul>
      <Muncul jeda={0.15} className="relative mt-7">
        <div className="flex items-center justify-center gap-4 text-[#9e1c22]">
          <p className={`${yuji} text-[0.85rem] tracking-[0.25em] uppercase`}>{hari}</p>
          <p className={`${yuji} border-x border-[#c99a3e] px-4 text-[3rem] leading-none`}>{tgl}</p>
          <p className={`${yuji} text-[0.85rem] leading-tight tracking-[0.2em] uppercase`}>{bulanTahun}</p>
        </div>
      </Muncul>
      {/* lentera hitung mundur di atas panel merah melengkung */}
      <Muncul dari="translateY(60px)" durasi={1.3} amount={0.2} className="relative mx-auto mt-9 w-[96%]">
        {/* teratai di belakang panel, mengintip dari sudut kiri bawahnya */}
        <Bunga a="teratai" className="-bottom-[52%] -left-[16%] w-[42%]" sizes="150px" />
        <div className={`${s.merah} relative rounded-t-[3rem] rounded-b-[1.4rem] px-4 pt-3 pb-6 shadow-[0_26px_40px_-24px_rgb(60_10_10/0.8)] ring-2 ring-[#c99a3e]/80`}>
          <PitaMeander className="mx-auto mb-1 w-[70%] opacity-80" />
          <Countdown target={u.mulai} />
        </div>
      </Muncul>
      <Muncul jeda={0.3} className="relative z-10 mt-14">
        <a href={calendarLink(u)} target="_blank" rel="noopener noreferrer" className={tombolMerah}>
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

/* ───────── 5. Acara: kartu paviliun bertumpuk ───────── */

function KartuAcara({ u, a, ke }: { u: Undangan; a: Undangan["acara"][number]; ke: number }) {
  return (
    <motion.div
      className="relative pt-[13%]"
      initial={{ opacity: 0, transform: `translateY(90px) rotate(${ke % 2 ? 3 : -3}deg)` }}
      whileInView={{ opacity: 1, transform: "translateY(0px) rotate(0deg)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.3, ease: HALUS }}
    >
      {/* atap paviliun di puncak kartu */}
      <svg viewBox="0 0 300 50" className="absolute inset-x-[-6%] top-0 z-10 w-[112%] overflow-visible drop-shadow-[0_6px_6px_rgb(40_10_5/0.3)]" aria-hidden="true">
        <defs>
          <linearGradient id={`or-at${ke}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4c9a8c" />
            <stop offset="1" stopColor="#245650" />
          </linearGradient>
        </defs>
        <path d="M70 10H230C244 30 270 36 296 30L290 44Q150 34 10 44L4 30C30 36 56 30 70 10Z" fill={`url(#or-at${ke})`} />
        <path d="M10 44Q150 34 290 44" fill="none" stroke="#d9b25f" strokeWidth="2.4" />
        <rect x="64" y="4" width="172" height="8" rx="2" fill="#1c4440" />
        <path d="M150 0v6" stroke="#d9b25f" strokeWidth="2" />
        <circle cx="150" cy="0" r="4" fill="#d9b25f" />
      </svg>
      <div className="relative mx-[2%] bg-[#fdf7ea] px-8 pt-10 pb-10 text-center shadow-[0_30px_50px_-30px_rgb(60_15_10/0.85)]">
        {/* tiang merah di kedua sisi kartu */}
        <span className="absolute inset-y-0 left-0 w-3 bg-[linear-gradient(90deg,#7d1418,#c8363c,#861a1f)]" aria-hidden="true" />
        <span className="absolute inset-y-0 right-0 w-3 bg-[linear-gradient(90deg,#7d1418,#c8363c,#861a1f)]" aria-hidden="true" />
        <span className="pointer-events-none absolute inset-x-5 inset-y-3 border border-[#c99a3e]/60" aria-hidden="true" />
        <p className={`${yuji} text-[10.5px] tracking-[0.4em] text-[#9e1c22]/80 uppercase`}>Acara {ke + 1}</p>
        <h3 className={`${naskah} mt-1 text-[3.2rem] leading-none text-[#9e1c22]`}>{a.nama}</h3>
        <Pembatas className="my-4" />
        <p className={`${yuji} text-[13px] tracking-[0.12em] text-[#3b1d16]`}>{u.tanggal}</p>
        <p className="mt-2 text-[15px] tracking-[0.04em]">Pukul {a.jam}</p>
        <div className="mx-auto my-4 h-px w-16 bg-[#c99a3e]/70" />
        <p className="text-[15.5px] font-semibold">{u.lokasi.nama}</p>
        <p className="text-[15px] leading-relaxed text-[#3b1d16]/85">{u.lokasi.alamat}</p>
        <a href={u.lokasi.maps} target="_blank" rel="noopener noreferrer" className={`${tombolMerah} relative z-10 mt-5`}>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          Lihat Lokasi
        </a>
        <PitaMeander className="absolute inset-x-5 bottom-0 opacity-80" />
      </div>
      <Bunga a={ke % 2 ? "peoniSalem" : "peoniMerahMuda"} className={`-bottom-[6%] w-[26%] ${ke % 2 ? "-right-[4%]" : "-left-[4%]"}`} sizes="120px" asal="50% 100%" />
    </motion.div>
  );
}

function Acara({ u }: { u: Undangan }) {
  return (
    <Bagian id="acara" merah className="px-6 pt-16 pb-28">
      <Judul terang kecil="Dengan penuh sukacita">
        Rangkaian Acara
      </Judul>
      <div className="relative mt-10">
        {u.acara.map((a, i) => (
          <div key={a.nama} className={`sticky ${i < u.acara.length - 1 ? "mb-[22svh]" : ""}`} style={{ top: `calc(8svh + ${i * 30}px)` }}>
            <KartuAcara u={u} a={a} ke={i} />
          </div>
        ))}
      </div>
    </Bagian>
  );
}

/* ───────── 6. Galeri: roda jendela bulan ───────── */

function BagianGaleri({ u }: { u: Undangan }) {
  return (
    <Bagian id="galeri" merah className="overflow-x-clip px-3 pt-16 pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-[4%] flex justify-between px-[4%] opacity-80" aria-hidden="true">
        <Awan className="w-[26%]" warna="#b4272e" garis="#f6dc94" />
        <Awan className="mt-8 w-[22%]" warna="#b4272e" garis="#f6dc94" />
      </div>
      <Judul terang kecil="Potret kebahagiaan">
        Galeri
      </Judul>
      <div className="relative mt-6">
        <Galeri photos={u.foto.galeri} />
      </div>
    </Bagian>
  );
}

/* ───────── 7. Love story: benang merah takdir & kipas lipat ───────── */

function BagianKisah({ u }: { u: Undangan }) {
  return (
    <Bagian id="cerita" className="overflow-x-clip pt-16 pb-24">
      <div className={`pointer-events-none absolute top-[14%] -left-[30%] w-[80%] opacity-30 [mask-image:radial-gradient(closest-side,black_40%,transparent)]`} aria-hidden="true">
        <Gambar a="bambu" sizes="(min-width: 440px) 350px, 80vw" />
      </div>
      <div className={`pointer-events-none absolute -right-[30%] bottom-[18%] w-[80%] opacity-30 [mask-image:radial-gradient(closest-side,black_40%,transparent)]`} aria-hidden="true">
        <Gambar a="bambu" sizes="(min-width: 440px) 350px, 80vw" flip />
      </div>
      <Kisah u={u} />
    </Bagian>
  );
}

/* ───────── 8. Angpao & ucapan ───────── */

function KadoUcapan({ u, tamu }: { u: Undangan; tamu?: string }) {
  return (
    <Bagian id="ucapan" merah className="px-6 pt-16 pb-24 text-center">
      <Judul terang kecil="Tanda kasih">
        Wedding Gift
      </Judul>
      <Muncul jeda={0.2}>
        <p className="mx-auto mt-4 max-w-[21rem] text-[15px] leading-relaxed text-[#fff6e6]/85">
          Doa restu Anda adalah hadiah terindah bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, kami menerimanya dengan senang hati.
        </p>
      </Muncul>
      <Muncul jeda={0.3} className="mt-6">
        <Amplop amplop={u.amplop} />
      </Muncul>
      <div className="mt-20">
        <Judul terang kecil="Doa & restu">
          Ucapkan Sesuatu
        </Judul>
        <Muncul jeda={0.2} className="mt-8">
          <Ucapan tamu={tamu} />
        </Muncul>
      </div>
    </Bagian>
  );
}

/* ───────── 9. Penutup ───────── */

function Penutup({ u }: { u: Undangan }) {
  return (
    <Bagian className="min-h-svh overflow-x-clip px-8 pt-20 pb-[calc(15rem+var(--demo-h,0px))] text-center">
      <LenteraBagian />
      <KawananBangau className="top-[3%]" d={28} jeda={-14} />
      <div className="relative">
        <div className="relative mx-auto w-[74%]">
          <JendelaBulan src={u.foto.belakang} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} sizes="300px" />
        </div>
        <Muncul className="relative mt-12">
          <p className="text-[15.5px] leading-relaxed">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p>
        </Muncul>
        <Muncul jeda={0.15}>
          <p className={`${yuji} mt-4 text-[13px] tracking-[0.2em] text-[#9e1c22] uppercase`}>Terima kasih</p>
        </Muncul>
        <Muncul jeda={0.25}>
          <p className={`${yuji} mt-7 text-[10.5px] tracking-[0.42em] text-[#9e1c22]/80 uppercase`}>Kami yang berbahagia</p>
        </Muncul>
        <Muncul jeda={0.35} dari="scale(0.85)">
          <p className={`${naskah} mt-1 text-[3.8rem] leading-tight text-[#9e1c22]`}>
            <span className="whitespace-nowrap">{u.wanita.panggilan}</span>{" "}
            <span className="whitespace-nowrap">
              <span className="text-[#c99a3e]">&amp;</span> {u.pria.panggilan}
            </span>
          </p>
        </Muncul>
        <KreditWebkeun className="relative mt-12 text-[#9e1c22]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-[var(--demo-h,0px)] h-56">
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[linear-gradient(180deg,rgb(207_227_223/0),#cfe3df_40%,#b8d6d1)]" />
        <Bunga a="teratai" className="bottom-[-4%] left-[-6%] w-[34%]" sizes="150px" />
        <Bunga a="terataiBesar" className="bottom-[-14%] left-[37%] w-[25%]" sizes="120px" varian="B" />
        <Bunga a="teratai" className="right-[-7%] bottom-[-6%] w-[32%]" sizes="140px" flip varian="B" />
      </div>
      <KelopakJatuh n={9} />
    </Bagian>
  );
}

export function Isi({ u, opened, tamu }: { u: Undangan; opened: boolean; tamu?: string }) {
  return (
    <>
      <Beranda u={u} buka={opened} />
      <Pembuka u={u} />
      <Mempelai u={u} />
      <SimpanTanggal u={u} />
      <Acara u={u} />
      <BagianGaleri u={u} />
      <BagianKisah u={u} />
      <KadoUcapan u={u} tamu={tamu} />
      <Penutup u={u} />
    </>
  );
}
