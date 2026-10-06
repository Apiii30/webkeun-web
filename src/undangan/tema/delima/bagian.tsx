"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { calendarLink } from "../../pakai";
import type { Undangan } from "../../types";
import s from "./delima.module.css";
import { Galeri } from "./galeri";
import { Beranda } from "./gerbang";
import { Bunga, FotoBingkai, Gambar, HALUS, Kawanan, KelopakJatuh, Lengkung, Medali, Merak, Monogram, Muncul, Pembatas, Renda, naskah, prata } from "./hias";
import { Amplop, Countdown, Ucapan, tombolEmas, tombolMarun } from "./interaktif";
import { Kisah } from "./kisah";
import { KreditWebkeun } from "../../kredit";

// Isi undangan tema Merah Delima. Bagian bergantian antara kertas blush dan panel marun beludru, disambung tepi
// renda bergerigi. Saat sebuah bagian lewat, ia tertinggal & mengecil di bawah bagian berikutnya (bertumpuk),
// dan hampir semua elemen punya lapisan parallax (delima.module.css).

function Bagian({ id, marun = false, className = "", children }: { id?: string; marun?: boolean; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`${s.sek} relative`}>
      <div className={`${s.tumpuk} relative ${marun ? `${s.marun} text-[#fbf4f1]` : `${s.kertas} text-[#4a1219]`} ${className}`}>
        <Renda warna={marun ? "#4a1219" : "#f7ece8"} />
        {children}
        <div className={`${s.redup} pointer-events-none absolute inset-0 z-30 bg-[#1e0509]`} aria-hidden="true" />
      </div>
    </section>
  );
}

function Judul({ children, terang = false, kecil }: { children: string; terang?: boolean; kecil?: string }) {
  return (
    <div className={`${s.pJudul} relative z-10 text-center`}>
      {kecil && (
        <Muncul>
          <p className={`${prata} text-[10px] tracking-[0.45em] uppercase ${terang ? "text-[#e6cd96]" : "text-[#a0727a]"}`}>{kecil}</p>
        </Muncul>
      )}
      <Muncul jeda={0.1} dari="scale(0.82)">
        <h2 className={`${naskah} text-[3.4rem] leading-tight ${terang ? "text-[#fbf4f1]" : "text-[#4a1219]"}`}>{children}</h2>
      </Muncul>
      <Muncul jeda={0.25}>
        <Pembatas terang={terang} />
      </Muncul>
    </div>
  );
}

// Ukiran pudar di latar kertas, bergerak lebih lambat dari isinya
function LatarUkir({ a, className }: { a: "reruntuhan" | "kastil"; className: string }) {
  return (
    <div className={`${s.pJauh} pointer-events-none absolute ${className}`} aria-hidden="true">
      <Gambar a={a} sizes="(min-width: 440px) 440px, 100vw" />
    </div>
  );
}

function hariTanggal(tanggal: string) {
  const [hari, ...rest] = tanggal.split(",");
  const [tgl, ...bulanTahun] = rest.join(",").trim().split(" ");
  return { hari: hari.trim(), tgl, bulanTahun: bulanTahun.join(" ") };
}

/* ───────── 2. Ayat: foto dalam medali emas di panel marun ───────── */

function Ayat({ u }: { u: Undangan }) {
  if (!u.ayat) return null;
  return (
    <Bagian marun className="overflow-x-clip px-8 pt-16 pb-24 text-center">
      <div className={`${s.pJauh} pointer-events-none absolute inset-x-0 top-0 opacity-[0.08] mix-blend-screen`} aria-hidden="true">
        <Gambar a="reruntuhan" sizes="(min-width: 440px) 440px, 100vw" />
      </div>
      <Muncul dari="scale(0.6)" durasi={1.4}>
        <Monogram a={u.wanita.panggilan[0]} b={u.pria.panggilan[0]} terang />
      </Muncul>
      <div className="relative mx-auto mt-9 w-[62%]">
        <Muncul dari="rotate(-20deg)" durasi={1.8} amount={0.25}>
          <Medali src={u.foto.kutipan} alt="" sizes="260px" />
        </Muncul>
        <Bunga a="mawarTua" className={`${s.pDekat} -bottom-[22%] -left-[24%] w-[50%]`} sizes="150px" asal="40% 100%" />
        <Bunga a="mawarPink" className={`${s.pDekat} -right-[22%] -bottom-[24%] w-[48%]`} sizes="150px" flip varian="B" asal="60% 100%" />
      </div>
      <Muncul jeda={0.2} className="relative mt-16">
        <p className="text-[15px] leading-relaxed text-[#fbf4f1]/90 italic">“{u.ayat.teks}”</p>
      </Muncul>
      <Muncul jeda={0.35}>
        <p className={`${prata} mt-4 text-[11px] tracking-[0.3em] text-[#e6cd96] uppercase`}>{u.ayat.sumber}</p>
      </Muncul>
    </Bagian>
  );
}

/* ───────── 3. Mempelai: foto lengkung diapit merak putih ───────── */

function Mempelai({ u }: { u: Undangan }) {
  const orang = [u.wanita, u.pria];
  return (
    <Bagian id="mempelai" className="overflow-x-clip px-8 pt-16 pb-24 text-center">
      <LatarUkir a="reruntuhan" className="top-[8%] -left-[30%] w-[80%] opacity-30 [mask-image:radial-gradient(closest-side,black_40%,transparent)]" />
      <LatarUkir a="kastil" className="-right-[30%] bottom-[6%] w-[90%] opacity-30 [mask-image:radial-gradient(closest-side,black_40%,transparent)]" />
      <Judul kecil="Bride & Groom">Mempelai</Judul>
      {u.salam && (
        <Muncul jeda={0.1}>
          <p className={`${prata} relative mt-6 text-[1rem]`}>{u.salam.buka}</p>
        </Muncul>
      )}
      <Muncul jeda={0.2}>
        <p className="relative mt-2 text-[14.5px] leading-relaxed text-[#5a1520]/90">{u.pembuka}</p>
      </Muncul>
      {orang.map((p, i) => (
        <div key={p.nama} className="relative">
          {i === 1 && (
            <Muncul dari="scale(0.3)" durasi={1.3} className="my-8">
              <p className={`${naskah} text-[4.5rem] leading-none text-[#c9a35c]`}>&amp;</p>
            </Muncul>
          )}
          <div className={`relative mx-auto w-[54%] ${i === 0 ? "mt-12" : ""}`}>
            {/* merak bertengger di sisi luar foto, sebagian tertutup fotonya */}
            <div className={`absolute bottom-[4%] aspect-[736/900] w-[78%] ${s.pJauh} ${i ? "-right-[46%]" : "-left-[46%]"}`}>
              <Merak className="inset-0" flip={!!i} sizes="170px" />
            </div>
            <Muncul dari={i ? "translateX(60px)" : "translateX(-60px)"} durasi={1.5} className="relative">
              <Lengkung src={p.foto} alt={p.nama} sizes="230px" />
            </Muncul>
            <Bunga
              a={i ? "mawarPink" : "mawarTua"}
              className={`${i ? s.pKanan : s.pKiri} -bottom-[16%] w-[56%] ${i ? "-left-[22%]" : "-right-[22%]"}`}
              sizes="140px"
              flip={!i}
              asal={i ? "40% 100%" : "60% 100%"}
            />
          </div>
          <Muncul jeda={0.1} dari="scale(0.88)" className="relative mt-10">
            <h3 className={`${prata} text-[1.55rem] leading-snug text-[#4a1219]`}>{p.nama}</h3>
          </Muncul>
          <Muncul jeda={0.25}>
            <p className="relative mt-2 text-[13.5px] leading-relaxed text-[#5a1520]/85">{p.keterangan}</p>
          </Muncul>
        </div>
      ))}
    </Bagian>
  );
}

/* ───────── 4. Save the date: kartu foto & hitung mundur di panel marun ───────── */

function SimpanTanggal({ u }: { u: Undangan }) {
  return (
    <Bagian marun className="overflow-x-clip px-6 pt-16 pb-24 text-center">
      <Kawanan className="top-[3%] left-0" jeda={-9} warna="#e6cd96" n={7} />
      <Judul terang kecil="Menghitung hari">
        Save The Date
      </Judul>
      <div className="relative mx-auto mt-9 w-[92%]">
        <Muncul dari="translateY(70px)" durasi={1.4} amount={0.2}>
          <div className={`${s.kertas} rounded-[1.6rem] p-3 pb-6 shadow-[0_30px_50px_-28px_rgb(0_0_0/0.9)] ring-1 ring-[#c9a35c]/60`}>
            <div className="relative aspect-[4/3.3] overflow-clip rounded-t-[999px] rounded-b-[1.1rem]">
              <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
                <Image src={u.foto.galeri[1].src} alt={u.foto.galeri[1].alt} fill sizes="(min-width: 440px) 380px, 88vw" className="object-cover" />
              </div>
              <span className="pointer-events-none absolute inset-[6px] rounded-t-[999px] rounded-b-[0.9rem] border border-[#fbf4f1]/80" aria-hidden="true" />
            </div>
            <p className={`${naskah} mt-5 text-[2.6rem] leading-none text-[#7b2431]`}>Menuju Hari Bahagia</p>
            <p className={`${prata} mt-2 mb-5 text-[11px] tracking-[0.3em] text-[#a0727a] uppercase`}>{u.tanggal}</p>
            <div className="px-1 [perspective:800px]">
              <Countdown target={u.mulai} />
            </div>
          </div>
        </Muncul>
        <Bunga a="delima" className={`${s.pKanan} -top-[12%] -right-[3%] w-[40%] rotate-[200deg]`} sizes="140px" varian="B" />
        <Bunga a="mawarTua" className={`${s.pDekat} -bottom-[19%] -left-[11%] w-[30%]`} sizes="120px" asal="40% 100%" />
      </div>
      <Muncul jeda={0.3} className="relative z-10 mt-12">
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

/* ───────── 5. Acara: kartu berpuncak lengkung yang bertumpuk saat digulir ───────── */

function KartuAcara({ u, a, ke }: { u: Undangan; a: Undangan["acara"][number]; ke: number }) {
  const { hari, tgl, bulanTahun } = hariTanggal(u.tanggal);
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, transform: `translateY(90px) rotate(${ke % 2 ? 3 : -3}deg)` }}
      whileInView={{ opacity: 1, transform: "translateY(0px) rotate(0deg)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.3, ease: HALUS }}
    >
      <div className="relative rounded-t-[11rem] rounded-b-[1.6rem] bg-[#fdf8f6] px-7 pt-16 pb-24 text-center shadow-[0_30px_50px_-30px_rgb(74_18_25/0.85)] ring-1 ring-[#c9a35c]/60">
        <span className="pointer-events-none absolute inset-[9px] rounded-t-[10.5rem] rounded-b-[1.2rem] border border-[#c9a35c]/55" aria-hidden="true" />
        <span className="pointer-events-none absolute inset-[14px] rounded-t-[10.2rem] rounded-b-[1rem] border border-dashed border-[#7b2431]/20" aria-hidden="true" />
        <p className={`${prata} text-[10px] tracking-[0.4em] text-[#a0727a] uppercase`}>Acara {ke + 1}</p>
        <h3 className={`${naskah} mt-1 text-[3.1rem] leading-none text-[#4a1219]`}>{a.nama}</h3>
        <Pembatas className="my-4" />
        <div className="flex items-center justify-center gap-4">
          <p className={`${prata} text-[0.8rem] tracking-[0.25em] uppercase`}>{hari}</p>
          <p className={`${prata} border-x border-[#c9a35c] px-4 text-[2.8rem] leading-none text-[#7b2431]`}>{tgl}</p>
          <p className={`${prata} text-[0.8rem] leading-tight tracking-[0.2em] uppercase`}>{bulanTahun}</p>
        </div>
        <p className="mt-4 text-[13.5px] tracking-[0.08em]">Pukul {a.jam}</p>
        <div className="mx-auto my-4 h-px w-16 bg-[#c9a35c]/70" />
        <p className="text-[14px] font-semibold">{u.lokasi.nama}</p>
        <p className="text-[13.5px] leading-relaxed text-[#5a1520]/85">{u.lokasi.alamat}</p>
        <a href={u.lokasi.maps} target="_blank" rel="noopener noreferrer" className={`${tombolMarun} relative z-10 mt-5`}>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          Lihat Lokasi
        </a>
      </div>
      {/* mawar di kaki kartu: utuh, di luar kartu (tidak terpotong tepinya) */}
      <Bunga a={ke % 2 ? "mawarPink" : "mawarTua"} className={`-bottom-[7%] w-[30%] ${ke % 2 ? "-right-[3%]" : "-left-[3%]"}`} sizes="130px" flip={!!(ke % 2)} asal="50% 100%" />
      <Bunga a="mawarBesar" className={`-bottom-[9%] w-[24%] ${ke % 2 ? "-left-[2%]" : "-right-[2%]"}`} sizes="110px" varian="B" flip={!(ke % 2)} />
    </motion.div>
  );
}

function Acara({ u }: { u: Undangan }) {
  return (
    <Bagian id="acara" className="px-6 pt-16 pb-28">
      <LatarUkir a="kastil" className="top-[4%] left-1/2 w-[130%] -translate-x-1/2 opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <Judul kecil="Dengan penuh syukur">Rangkaian Acara</Judul>
      {/* kartu menempel di layar & bertumpuk: kartu berikutnya naik menutupi kartu sebelumnya */}
      <div className="relative mt-10">
        {u.acara.map((a, i) => (
          <div key={a.nama} className={`sticky ${i < u.acara.length - 1 ? "mb-[22svh]" : ""}`} style={{ top: `calc(11svh + ${i * 28}px)` }}>
            <KartuAcara u={u} a={a} ke={i} />
          </div>
        ))}
      </div>
    </Bagian>
  );
}

/* ───────── 6. Galeri: tumpukan foto di panel marun ───────── */

function BagianGaleri({ u }: { u: Undangan }) {
  return (
    <Bagian id="galeri" marun className="overflow-x-clip px-4 pt-16 pb-24">
      <div className={`${s.pJauh} pointer-events-none absolute inset-x-0 bottom-0 opacity-[0.07] mix-blend-screen`} aria-hidden="true">
        <Gambar a="gunung" sizes="(min-width: 440px) 440px, 100vw" />
      </div>
      <Judul terang kecil="Potret kami">
        Galeri
      </Judul>
      <div className="relative mt-10">
        <Galeri photos={u.foto.galeri} />
      </div>
    </Bagian>
  );
}

/* ───────── 7. Kisah cinta: surat bersegel ───────── */

function BagianKisah({ u }: { u: Undangan }) {
  return (
    <Bagian id="cerita" className="overflow-x-clip pt-16 pb-24">
      <LatarUkir a="reruntuhan" className="top-[18%] -right-[34%] w-[86%] opacity-25 [mask-image:radial-gradient(closest-side,black_40%,transparent)]" />
      <LatarUkir a="kastil" className="bottom-[20%] -left-[36%] w-[96%] opacity-25 [mask-image:radial-gradient(closest-side,black_40%,transparent)]" />
      <Kisah u={u} />
    </Bagian>
  );
}

/* ───────── 8. Wedding gift & ucapan ───────── */

function KadoUcapan({ u, tamu }: { u: Undangan; tamu?: string }) {
  return (
    <Bagian id="ucapan" marun className="px-6 pt-16 pb-24 text-center">
      <Judul terang kecil="Tanda kasih">
        Wedding Gift
      </Judul>
      <Muncul jeda={0.2}>
        <p className="mx-auto mt-4 max-w-[20rem] text-sm leading-relaxed text-[#fbf4f1]/85">
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

/* ───────── 9. Penutup: bingkai cermin kembali, kini berisi foto ───────── */

function Penutup({ u }: { u: Undangan }) {
  return (
    <Bagian className="min-h-svh overflow-x-clip px-8 pt-20 pb-[calc(15rem+var(--demo-h,0px))] text-center">
      <LatarUkir a="kastil" className="top-[2%] left-1/2 w-[130%] -translate-x-1/2 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <Kawanan className="top-[4%] left-0" jeda={-3} />
      <div className={`${s.mendekat} relative`}>
        <div className="relative mx-auto w-[60%]">
          <div className={`absolute bottom-[-2%] aspect-[736/900] w-[70%] ${s.pJauh} -left-[50%]`}>
            <Merak className="inset-0" sizes="160px" />
          </div>
          <div className={`absolute bottom-[-2%] aspect-[736/900] w-[70%] ${s.pJauh} -right-[50%]`}>
            <Merak className="inset-0" flip sizes="160px" />
          </div>
          <FotoBingkai src={u.foto.belakang} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} sizes="260px" />
        </div>
        <Muncul className="relative mt-16">
          <p className="text-[14.5px] leading-relaxed">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p>
        </Muncul>
        {u.salam && (
          <Muncul jeda={0.15}>
            <p className={`${prata} mt-4 text-[1rem]`}>{u.salam.tutup}</p>
          </Muncul>
        )}
        <Muncul jeda={0.25}>
          <p className={`${prata} mt-7 text-[10px] tracking-[0.45em] text-[#a0727a] uppercase`}>Kami yang berbahagia</p>
        </Muncul>
        <Muncul jeda={0.35} dari="scale(0.85)">
          <p className={`${naskah} mt-1 text-[3.6rem] leading-tight`}>
            {u.wanita.panggilan} <span className="text-[#c9a35c]">&amp;</span> {u.pria.panggilan}
          </p>
        </Muncul>
        <KreditWebkeun className="relative mt-12" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-[var(--demo-h,0px)] h-56">
        <Bunga a="mawarTua" className="bottom-[-10%] left-[-1%] w-[36%]" sizes="180px" asal="40% 100%" />
        <Bunga a="mawarBesar" className="bottom-[-22%] left-[31%] w-[34%]" sizes="170px" varian="B" />
        <Bunga a="mawarPink" className="right-[-1%] bottom-[-12%] w-[38%]" sizes="190px" flip asal="60% 100%" />
      </div>
      <KelopakJatuh n={8} />
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
      <BagianKisah u={u} />
      <KadoUcapan u={u} tamu={tamu} />
      <Penutup u={u} />
    </>
  );
}
