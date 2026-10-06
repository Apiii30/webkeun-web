"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { calendarLink } from "../../pakai";
import type { Undangan } from "../../types";
import { ARTI_DOA, BISMILLAH, DOA_PENGANTIN, maskerMihrab } from "./aset";
import { Galeri } from "./galeri";
import { Beranda } from "./gerbang";
import { Arkade, Bintang, Bunga, DefsEmas, EMAS, FotoLengkung, HALUS, Kawanan, KartuMihrab, Lentera, MelatiJatuh, Monogram, Muncul, Pembatas, arab, garisBintang, marcellus, naskah } from "./hias";
import { Amplop, Countdown, Ucapan, tombolEmas, tombolZamrud } from "./interaktif";
import { Kisah } from "./kisah";
import s from "./sakinah.module.css";

// Isi undangan tema Putih Sakinah. Bagian bergantian antara marmer putih mutiara dan panel zamrud beludru, disambung
// tepi arkade (deretan lengkung mihrab kecil). Saat sebuah bagian lewat, ia tertinggal & mengecil di bawah bagian
// berikutnya (bertumpuk), dan hampir semua elemen punya lapisan parallax (sakinah.module.css).

function Bagian({ id, zamrud = false, className = "", children }: { id?: string; zamrud?: boolean; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`${s.sek} relative`}>
      <div className={`${s.tumpuk} relative ${zamrud ? `${s.zamrud} text-[#fbf8f1]` : `${s.marmer} text-[#1d3d34]`} ${className}`}>
        <Arkade warna={zamrud ? "#0f3a31" : "#fbfaf6"} />
        {/* kisi bintang samar, bergerak lebih lambat dari isinya (dipotong di dalam bagiannya sendiri) */}
        <div className="pointer-events-none absolute inset-0 overflow-clip" aria-hidden="true">
          <div className={`${zamrud ? s.polaTerang : s.pola} ${s.pJauh} absolute inset-x-0 -inset-y-16 ${zamrud ? "opacity-[0.07]" : "opacity-[0.09]"}`} />
        </div>
        {children}
        <div className={`${s.redup} pointer-events-none absolute inset-0 z-30 bg-[#0a241e]`} aria-hidden="true" />
      </div>
    </section>
  );
}

function Judul({ children, terang = false, kecil }: { children: string; terang?: boolean; kecil?: string }) {
  return (
    <div className={`${s.pJudul} relative z-10 text-center`}>
      {kecil && (
        <Muncul>
          <p className={`${marcellus} text-[10px] tracking-[0.45em] uppercase ${terang ? "text-[#e9d29c]" : "text-[#8f6d34]"}`}>{kecil}</p>
        </Muncul>
      )}
      <Muncul jeda={0.1} dari="scale(0.82)">
        <h2 className={`${naskah} text-[3.6rem] leading-tight ${terang ? "text-[#fbf8f1]" : "text-[#0f3a31]"}`}>{children}</h2>
      </Muncul>
      <Muncul jeda={0.25}>
        <Pembatas terang={terang} />
      </Muncul>
    </div>
  );
}

// Teks Arab berwarna emas berkilau
function TeksArab({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p dir="rtl" lang="ar" className={`${arab} bg-[linear-gradient(110deg,#a98544_10%,#f6ebc8_45%,#b8955a_62%,#f1e2b8_82%)] bg-clip-text py-[0.45em] text-transparent ${className}`}>
      {children}
    </p>
  );
}

// Sepasang lentera yang tergantung di puncak bagian, turun lebih lambat daripada isinya
function LenteraBagian({ redup }: { redup?: boolean }) {
  return (
    <div className={`${s.pLentera} pointer-events-none absolute inset-x-0 top-0 h-full`} aria-hidden="true">
      <Lentera className="left-[5%] w-[9%]" rantai="5rem" d={5.4} a={2.2} redup={redup} />
      <Lentera className="right-[6%] w-[8%]" rantai="8rem" d={4.6} a={2.6} jeda={-2} redup={redup} />
    </div>
  );
}

function hariTanggal(tanggal: string) {
  const [hari, ...rest] = tanggal.split(",");
  const [tgl, ...bulanTahun] = rest.join(",").trim().split(" ");
  return { hari: hari.trim(), tgl, bulanTahun: bulanTahun.join(" ") };
}

/* ───────── 2. Pembuka: Bismillah, salam, ayat ───────── */

// Foto bundar dalam bintang delapan emas yang berputar pelan
function MedaliBintang({ src, sizes }: { src: string; sizes: string }) {
  return (
    <div className="relative aspect-square">
      <svg viewBox="-1.1 -1.1 2.2 2.2" className={`${s.putar} absolute inset-0 h-full w-full`} aria-hidden="true">
        <DefsEmas id="sk-medali" />
        <path d={garisBintang} fill="none" stroke="url(#sk-medali)" strokeWidth=".022" />
        <path d={garisBintang} fill="none" stroke={EMAS} strokeWidth=".008" strokeDasharray=".02 .03" transform="scale(.93)" />
      </svg>
      <div className={`absolute inset-[15%] rounded-full bg-[linear-gradient(135deg,#8f6d34,#f1e2b8_35%,#a98544_60%,#f6ebc8_82%,#8f6d34)] p-[3px] shadow-[0_18px_30px_-16px_rgb(0_0_0/0.6)]`}>
        <div className="relative h-full w-full overflow-clip rounded-full">
          <div className={`${s.zoomKeluar} absolute inset-0`}>
            <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pembuka({ u }: { u: Undangan }) {
  return (
    <Bagian zamrud className="overflow-x-clip px-8 pt-16 pb-24 text-center">
      <LenteraBagian redup />
      <Muncul dari="scale(0.85)" durasi={1.6}>
        <TeksArab className="text-[2.3rem] leading-[1.7]">{BISMILLAH}</TeksArab>
      </Muncul>
      {u.salam && (
        <Muncul jeda={0.2}>
          <p className={`${marcellus} mt-3 text-[1rem] tracking-[0.04em] text-[#f6ebc8]`}>{u.salam.buka}</p>
        </Muncul>
      )}
      <div className="relative mx-auto mt-10 w-[66%]">
        <Muncul dari="rotate(-30deg)" durasi={1.8} amount={0.25}>
          <MedaliBintang src={u.foto.kutipan} sizes="240px" />
        </Muncul>
        <Bunga a="melati" className={`${s.pDekat} -bottom-[8%] -left-[20%] w-[46%]`} sizes="140px" asal="70% 100%" style={{ rotate: "-24deg" }} />
        <Bunga a="melati" className={`${s.pDekat} -right-[20%] -bottom-[10%] w-[42%]`} sizes="130px" flip varian="B" asal="30% 100%" style={{ rotate: "22deg" }} />
      </div>
      {u.ayat && (
        <div className="relative mt-14">
          {u.ayat.arab && (
            <Muncul>
              <TeksArab className="text-[1.45rem] leading-[2.1]">{u.ayat.arab}</TeksArab>
            </Muncul>
          )}
          <Muncul jeda={0.15}>
            <p className="mt-5 text-[16px] leading-relaxed text-[#fbf8f1]/90 italic">“{u.ayat.teks}”</p>
          </Muncul>
          <Muncul jeda={0.3}>
            <p className={`${marcellus} mt-4 text-[11px] tracking-[0.3em] text-[#e9d29c] uppercase`}>{u.ayat.sumber}</p>
          </Muncul>
        </div>
      )}
    </Bagian>
  );
}

/* ───────── 3. Mempelai: foto dalam lengkung mihrab ───────── */

function Mempelai({ u }: { u: Undangan }) {
  const orang = [u.wanita, u.pria];
  return (
    <Bagian id="mempelai" className="overflow-x-clip px-8 pt-16 pb-24 text-center">
      <Judul kecil="Dua insan, satu ikatan">Mempelai</Judul>
      <Muncul jeda={0.2}>
        <p className="relative mt-5 text-[16px] leading-relaxed text-[#1d3d34]/90">{u.pembuka}</p>
      </Muncul>
      {orang.map((p, i) => (
        <div key={p.nama} className="relative">
          {i === 1 && (
            <Muncul dari="scale(0.3)" durasi={1.3} className="my-9">
              <Monogram a={u.wanita.panggilan[0]} b={u.pria.panggilan[0]} />
            </Muncul>
          )}
          <div className={`relative mx-auto w-[58%] ${i === 0 ? "mt-14" : ""}`}>
            {/* lentera kecil tergantung di sisi luar lengkung */}
            <div className={`${s.pLentera} absolute -top-[12%] h-full w-[22%] ${i ? "-left-[30%]" : "-right-[30%]"}`} aria-hidden="true">
              <Lentera className="inset-x-0" rantai="3.5rem" d={5 + i} a={2.4} jeda={-i * 1.7} />
            </div>
            <Muncul dari={i ? "translateX(60px)" : "translateX(-60px)"} durasi={1.5} className="relative">
              <FotoLengkung src={p.foto} alt={p.nama} sizes="250px" />
            </Muncul>
            <Bunga
              a={i ? "anggrek" : "magnolia"}
              className={`${i ? s.pKanan : s.pKiri} -bottom-[10%] ${i ? "-right-[16%] w-[40%]" : "-left-[22%] w-[62%]"}`}
              sizes={i ? "120px" : "180px"}
              asal={i ? "60% 100%" : "40% 100%"}
            />
          </div>
          <Muncul jeda={0.1} dari="scale(0.88)" className="relative mt-12">
            <h3 className={`${naskah} text-[3rem] leading-none text-[#0f3a31]`}>{p.nama}</h3>
          </Muncul>
          <Muncul jeda={0.25}>
            <p className="relative mt-3 text-[15.5px] leading-relaxed text-[#1d3d34]/85">{p.keterangan}</p>
          </Muncul>
        </div>
      ))}
    </Bagian>
  );
}

/* ───────── 4. Save the date: kartu berpuncak mihrab & hitung mundur bintang ───────── */

function SimpanTanggal({ u }: { u: Undangan }) {
  return (
    <Bagian zamrud className="overflow-x-clip px-6 pt-16 pb-24 text-center">
      <Kawanan className="top-[3%] left-0" jeda={-9} warna="#e9d29c" n={6} />
      <Judul terang kecil="Menghitung hari">
        Save The Date
      </Judul>
      <div className="relative mx-auto mt-10 w-[92%]">
        {/* bunga di belakang kartu, mengintip dari kedua sudut bawahnya */}
        <Bunga a="magnolia" className={`${s.pDekat} -bottom-[10%] -left-[20%] w-[52%]`} sizes="200px" asal="40% 100%" />
        <Bunga a="anggrek" className={`${s.pKanan} -right-[15%] -bottom-[13%] w-[34%]`} sizes="140px" varian="B" asal="60% 100%" />
        <Muncul dari="translateY(70px)" durasi={1.4} amount={0.2}>
          <KartuMihrab className="text-[#1d3d34]">
            <div className="px-[7%] pt-[7%] pb-8">
              <div className="relative [container-type:inline-size]">
                <div className="relative aspect-[4/3.6] overflow-clip" style={maskerMihrab(0)}>
                  <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
                    <Image src={u.foto.galeri[1].src} alt={u.foto.galeri[1].alt} fill sizes="(min-width: 440px) 340px, 80vw" className="object-cover" />
                  </div>
                </div>
              </div>
              <p className={`${naskah} mt-5 text-[2.7rem] leading-none text-[#0f3a31]`}>Menuju Hari Bahagia</p>
              <p className={`${marcellus} mt-2 mb-5 text-[11px] tracking-[0.3em] text-[#8f6d34] uppercase`}>{u.tanggal}</p>
              <Countdown target={u.mulai} />
            </div>
          </KartuMihrab>
        </Muncul>
      </div>
      <Muncul jeda={0.3} className="relative z-10 mt-16">
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

/* ───────── 5. Acara: kartu mihrab yang bertumpuk saat digulir ───────── */

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
      <KartuMihrab className="text-center text-[#1d3d34]">
        <div className="px-8 pt-[30%] pb-20">
          <Bintang className="mx-auto mb-3 size-7" />
          <p className={`${marcellus} text-[10px] tracking-[0.4em] text-[#8f6d34] uppercase`}>Acara {ke + 1}</p>
          <h3 className={`${naskah} mt-1 text-[3.3rem] leading-none text-[#0f3a31]`}>{a.nama}</h3>
          <Pembatas className="my-4" />
          <div className="flex items-center justify-center gap-4">
            <p className={`${marcellus} text-[0.82rem] tracking-[0.22em] uppercase`}>{hari}</p>
            <p className={`${marcellus} border-x border-[#b8955a] px-4 text-[2.8rem] leading-none text-[#0f3a31]`}>{tgl}</p>
            <p className={`${marcellus} text-[0.82rem] leading-tight tracking-[0.18em] uppercase`}>{bulanTahun}</p>
          </div>
          <p className="mt-4 text-[15px] tracking-[0.06em]">Pukul {a.jam}</p>
          <div className="mx-auto my-4 h-px w-16 bg-[#b8955a]/70" />
          <p className="text-[15.5px] font-semibold">{u.lokasi.nama}</p>
          <p className="text-[15px] leading-relaxed text-[#1d3d34]/85">{u.lokasi.alamat}</p>
          <a href={u.lokasi.maps} target="_blank" rel="noopener noreferrer" className={`${tombolZamrud} relative z-10 mt-5`}>
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            Lihat Lokasi
          </a>
        </div>
      </KartuMihrab>
      {/* bunga di kaki kartu: utuh, di luar kartu (tidak terpotong tepinya) */}
      <Bunga a="melati" className={`-bottom-[6%] w-[28%] ${ke % 2 ? "-right-[4%]" : "-left-[4%]"}`} sizes="120px" flip={!!(ke % 2)} asal="50% 100%" style={{ rotate: ke % 2 ? "18deg" : "-18deg" }} />
      <Bunga a="anggrek" className={`-bottom-[7%] w-[24%] ${ke % 2 ? "-left-[3%]" : "-right-[3%]"}`} sizes="110px" varian="B" flip={!(ke % 2)} />
    </motion.div>
  );
}

function Acara({ u }: { u: Undangan }) {
  return (
    <Bagian id="acara" className="px-6 pt-16 pb-28">
      <Judul kecil="Dengan memohon rida Allah">Rangkaian Acara</Judul>
      {/* kartu menempel di layar & bertumpuk: kartu berikutnya naik menutupi kartu sebelumnya */}
      <div className="relative mt-10">
        {u.acara.map((a, i) => (
          <div key={a.nama} className={`sticky ${i < u.acara.length - 1 ? "mb-[22svh]" : ""}`} style={{ top: `calc(9svh + ${i * 28}px)` }}>
            <KartuAcara u={u} a={a} ke={i} />
          </div>
        ))}
      </div>
    </Bagian>
  );
}

/* ───────── 6. Galeri: jendela mihrab berjajar ───────── */

function BagianGaleri({ u }: { u: Undangan }) {
  return (
    <Bagian id="galeri" zamrud className="overflow-x-clip px-4 pt-16 pb-24">
      <Judul terang kecil="Potret kebahagiaan">
        Galeri
      </Judul>
      <div className="relative mt-8">
        <Galeri photos={u.foto.galeri} />
      </div>
    </Bagian>
  );
}

/* ───────── 7. Perjalanan kami ───────── */

function BagianKisah({ u }: { u: Undangan }) {
  return (
    <Bagian id="cerita" className="overflow-x-clip pt-16 pb-24">
      <Kisah u={u} />
    </Bagian>
  );
}

/* ───────── 8. Wedding gift, doa & ucapan ───────── */

function KadoUcapan({ u, tamu }: { u: Undangan; tamu?: string }) {
  return (
    <Bagian id="ucapan" zamrud className="px-6 pt-16 pb-24 text-center">
      <Judul terang kecil="Tanda kasih">
        Wedding Gift
      </Judul>
      <Muncul jeda={0.2}>
        <p className="mx-auto mt-4 max-w-[21rem] text-[15.5px] leading-relaxed text-[#fbf8f1]/85">
          Doa restu Anda adalah hadiah terindah bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, kami menerimanya dengan senang hati.
        </p>
      </Muncul>
      <Muncul jeda={0.3} className="mt-6">
        <Amplop amplop={u.amplop} />
      </Muncul>
      <div className="mt-20">
        <Judul terang kecil="Doa untuk mempelai">
          Doa &amp; Ucapan
        </Judul>
        <Muncul jeda={0.15} className="relative mx-auto mt-7 max-w-[22rem] rounded-[1.4rem] px-5 py-6 ring-1 ring-[#b8955a]/45">
          <span className="pointer-events-none absolute inset-[5px] rounded-[1.1rem] border border-dashed border-[#b8955a]/30" aria-hidden="true" />
          <TeksArab className="text-[1.5rem] leading-[1.9]">{DOA_PENGANTIN}</TeksArab>
          <p className="mt-3 text-[15px] leading-relaxed text-[#fbf8f1]/85 italic">“{ARTI_DOA}”</p>
          <p className={`${marcellus} mt-3 text-[10px] tracking-[0.3em] text-[#e9d29c] uppercase`}>HR. Abu Dawud &amp; Tirmidzi</p>
        </Muncul>
        <Muncul jeda={0.2} className="mt-8">
          <Ucapan tamu={tamu} />
        </Muncul>
      </div>
    </Bagian>
  );
}

/* ───────── 9. Penutup: lengkung mihrab berisi foto ───────── */

function Penutup({ u }: { u: Undangan }) {
  return (
    <Bagian className="min-h-svh overflow-x-clip px-8 pt-20 pb-[calc(15rem+var(--demo-h,0px))] text-center">
      <LenteraBagian />
      <Kawanan className="top-[4%] left-0" jeda={-3} />
      <div className={`${s.mendekat} relative`}>
        <div className="relative mx-auto w-[62%]">
          <FotoLengkung src={u.foto.belakang} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} sizes="270px" />
        </div>
        <Muncul className="relative mt-14">
          <p className="text-[16px] leading-relaxed">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p>
        </Muncul>
        <Muncul jeda={0.1}>
          <p className={`${marcellus} mt-4 text-[1rem] text-[#0f3a31]`}>Jazakumullahu khairan</p>
        </Muncul>
        {u.salam && (
          <Muncul jeda={0.15}>
            <p className={`${marcellus} mt-2 text-[1rem]`}>{u.salam.tutup}</p>
          </Muncul>
        )}
        <Muncul jeda={0.25}>
          <p className={`${marcellus} mt-7 text-[10px] tracking-[0.45em] text-[#8f6d34] uppercase`}>Kami yang berbahagia</p>
        </Muncul>
        <Muncul jeda={0.35} dari="scale(0.85)">
          <p className={`${naskah} mt-1 text-[3.9rem] leading-tight text-[#0f3a31]`}>
            {u.wanita.panggilan} <span className="text-[#b8955a]">&amp;</span> {u.pria.panggilan}
          </p>
        </Muncul>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-[var(--demo-h,0px)] h-56">
        <Bunga a="melati" className="bottom-[-4%] left-[28%] w-[21%]" sizes="100px" asal="50% 100%" style={{ rotate: "-14deg" }} />
        <Bunga a="melati" className="right-[30%] bottom-[-6%] w-[19%]" sizes="90px" flip varian="B" asal="50% 100%" style={{ rotate: "12deg" }} />
        <Bunga a="magnolia" className="bottom-[-6%] left-[-12%] w-[56%]" sizes="(min-width: 440px) 250px, 56vw" asal="40% 100%" />
        <Bunga a="anggrek" className="right-[-3%] bottom-[-5%] w-[30%]" sizes="140px" varian="B" asal="60% 100%" />
      </div>
      <MelatiJatuh n={9} />
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
