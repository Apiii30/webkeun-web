"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import { calendarLink } from "../../pakai";
import type { Undangan } from "../../types";
import { ASET, BINGKAI_KANAN, BINGKAI_KIRI, KARTU_KANAN, KARTU_KIRI, SISI, SISI_TERATAI, SUDUT_ATAS, SUDUT_BAWAH } from "./aset";
import { Amplop, Countdown, Galeri, Ucapan, tombolPlum } from "./interaktif";
import { BingkaiUkir, Burung, Gambar, Gapura, Gunung, Gunungan, Janur, KelopakJatuh, Kupu, LENTUR, Monogram, Pohon, Rumpun, Sambung, Tumbuh, Wayang, cinzel, kaushan } from "./ornamen";
import s from "./jawa.module.css";

// Isi undangan tema Jawa Klasik, mengikuti alur & gerak undangan referensi:
// ornamen (gapura, janur, pohon, bunga, wayang) tumbuh dari sudutnya dengan jeda bertahap sehingga muncul bertumpuk,
// foto membesar pelan, teks naik perlahan. Tiap bagian saling menumpuk di sambungannya: rumah joglo menimpa
// lengkung gapura berikutnya, rumpun bunga menutup garis pertemuan dua bagian.
// Di atasnya ada parallax berlapis (lihat jawa.module.css): latar jauh lebih lambat, bunga depan lebih cepat.

const PLUM = "text-[#5b3b47]";

/* ───────── pembantu ───────── */

// Teks naik pelan saat terlihat (seperti fadeInUp di referensi)
function Naik({ jeda = 0, className, children }: { jeda?: number; className?: string; children: ReactNode }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: "translateY(40px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.3, ease: LENTUR, delay: jeda }}
    >
      {children}
    </motion.div>
  );
}

// Judul bagian bertulisan kuas, membesar dari tengah dan sedikit mendahului halaman saat digulir
function Judul({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`${s.pJudul} relative z-10 ${className}`}>
      <Tumbuh awal={0.5} durasi={1.6} className="text-center">
        <h2 className={`${kaushan} text-[2.5rem] leading-tight ${PLUM}`}>{children}</h2>
      </Tumbuh>
    </div>
  );
}

// Bunga kecil delapan kelopak yang berputar pelan (hiasan di atas hitung mundur)
function KembangPutar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-30 -30 60 60" className={`${s.putar} ${className}`} aria-hidden="true">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
        <path key={r} d="M0 -4 C6 -10 6 -20 0 -27 C-6 -20 -6 -10 0 -4 Z" transform={`rotate(${r})`} fill={r % 90 ? "#d9b7c2" : "#7b5563"} stroke="#5b3b47" strokeWidth=".8" />
      ))}
      <circle r="5" fill="#e2c070" stroke="#5b3b47" strokeWidth=".8" />
    </svg>
  );
}

// Rumpun bunga di kedua tepi (menutupi pilar gapura), bergerak lebih cepat dari halaman
function TepiBunga({ items = SISI, className = "", jeda = 0 }: { items?: typeof SISI; className?: string; jeda?: number }) {
  return (
    <>
      <Rumpun items={items} dari="l" jeda={jeda} className={`${s.pDekat} left-0 aspect-[1/1.35] w-[19%] ${className}`} />
      <Rumpun items={items} dari="l" jeda={jeda + 0.15} cermin className={`${s.pDekat} right-0 aspect-[1/1.35] w-[19%] ${className}`} />
    </>
  );
}

function hariTanggal(tanggal: string) {
  const [hari, ...rest] = tanggal.split(",");
  return { hari: hari.trim(), tgl: rest.join(",").trim() };
}

/* ───────── 1. Beranda ───────── */

// Saat digulir keluar, tiap lapisan pergi dengan kecepatan berbeda: gunung & kabut turun pelan (jauh),
// bingkai & nama tenggelam memudar, janur naik lebih cepat, bunga di depan ikut halaman.
function Beranda({ u, opened }: { u: Undangan; opened: boolean }) {
  const t = opened;
  return (
    <section id="beranda" className={`${s.sek} relative h-svh min-h-[46rem] overflow-hidden`}>
      {/* lapisan jauh dipudarkan di dasar beranda (wadah diam, bukan lapisan yang bergeser), supaya gunung yang
          turun saat digulir tidak terpotong garis lurus di batas bagian */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_72%,transparent_96%)]">
        <div className={`${s.keluarPelan} absolute inset-0`}>
          <div className={`${s.kabut} absolute inset-x-[-10%] top-0 h-[62%] opacity-30 [mask-image:linear-gradient(to_bottom,black_45%,transparent)]`}>
            <Image src={ASET.kabut.src} alt="" fill preload sizes="480px" className="object-cover" />
          </div>
          <Gunung tampil={t} jeda={0.2} className="inset-x-[-14%] bottom-[16%]" preload />
          <Burung className="top-[13%] left-0" delay={-5} />
          <Burung className="top-[16%] left-0" delay={-9} size={11} />
        </div>
      </div>

      <div className={`${s.keluarNaik} absolute inset-0`}>
        <Janur sisi="kiri" tampil={t} jeda={0.9} className="top-[2%] left-0 w-[31%]" />
        <Janur sisi="kanan" tampil={t} jeda={1} className="top-[2%] right-0 w-[31%]" />
      </div>

      <div className={`${s.keluarTurun} absolute inset-0`}>
        <Tumbuh dari="t" tampil={t} jeda={0.3} className="absolute inset-x-0 top-[5%] text-center">
          <Monogram a={u.wanita.panggilan[0]} b={u.pria.panggilan[0]} className="text-[2.7rem]" />
          <p className={`mt-1 text-[15px] ${PLUM}`}>Wedding Invitation</p>
        </Tumbuh>

        <Tumbuh tampil={t} jeda={0.5} className="absolute top-[17%] left-[25%] w-[50%]">
          <BingkaiUkir src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} sizes="230px" preload />
          <Rumpun lebih={15} items={BINGKAI_KIRI} tampil={t} jeda={1.6} className="inset-x-[-22%] bottom-0 aspect-[1/0.55]" />
          <Rumpun lebih={15} items={BINGKAI_KANAN} tampil={t} jeda={1.8} className="inset-x-[-22%] bottom-0 aspect-[1/0.55]" />
        </Tumbuh>

        <Tumbuh tampil={t} jeda={1} className="absolute inset-x-0 top-[57%] text-center">
          <h1 className={`${kaushan} text-[2.9rem] leading-[1.02] ${PLUM} [text-shadow:0_2px_12px_rgb(243_235_229/0.9)]`}>
            {u.wanita.panggilan}
            <br />
            &amp;
            <br />
            {u.pria.panggilan}
          </h1>
        </Tumbuh>
      </div>

      <Pohon sisi="kiri" tampil={t} jeda={1.2} className="bottom-[10%] left-0 w-[28%]" />
      <Pohon sisi="kanan" tampil={t} jeda={1.3} className="right-0 bottom-[10%] w-[28%]" />
      <Rumpun items={SUDUT_BAWAH} tampil={t} jeda={1.4} className="bottom-[var(--demo-h,0px)] left-0 aspect-[1/0.7] w-[44%]" />
      <Rumpun items={SUDUT_BAWAH} tampil={t} jeda={1.5} cermin className="right-0 bottom-[var(--demo-h,0px)] aspect-[1/0.7] w-[44%]" />
      {t && <Kupu className="top-[48%] left-[5%]" delay={-2} />}
    </section>
  );
}

/* ───────── 2. Ayat ───────── */

function Ayat({ u }: { u: Undangan }) {
  if (!u.ayat) return null;
  return (
    <section className="relative px-8 pt-24 pb-28 text-center">
      <Rumpun items={SUDUT_ATAS} atas className={`${s.pJauh} top-0 left-0 aspect-[1/0.6] w-[44%]`} />
      <Rumpun items={SUDUT_ATAS} atas cermin jeda={0.2} className={`${s.pJauh} top-0 right-0 aspect-[1/0.6] w-[44%]`} />
      <div className="relative mx-auto mt-10 w-[90%]">
        <Tumbuh awal={0.7} className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-[0_14px_30px_-18px_rgb(91_59_71/0.8)]">
          <div className={`${s.zoomKeluar} absolute inset-0`}>
            <Image src={u.foto.kutipan} alt="" fill sizes="380px" className="object-cover" />
          </div>
        </Tumbuh>
        <Rumpun lebih={4} items={BINGKAI_KIRI} jeda={0.6} className={`${s.pSedang} inset-x-[-10%] -bottom-2 aspect-[1/0.4]`} />
        <Rumpun lebih={4} items={BINGKAI_KANAN} jeda={0.8} className={`${s.pSedang} inset-x-[-10%] -bottom-2 aspect-[1/0.4]`} />
      </div>
      <Naik jeda={0.3} className="mt-10">
        <p className={`text-[15px] leading-relaxed ${PLUM}`}>“{u.ayat.teks}”</p>
        <p className={`mt-3 text-sm ${PLUM}`}>~ {u.ayat.sumber} ~</p>
      </Naik>
      <Kupu a="kupu2" className="top-[10%] left-[40%]" delay={-6} w={30} />
    </section>
  );
}

/* ───────── 3. Salam & mempelai, di dalam gapura ───────── */

function Mempelai({ u }: { u: Undangan }) {
  const orang = [u.wanita, u.pria];
  return (
    <section id="mempelai" className="relative isolate px-[17%] pt-[30%] pb-[46%] text-center">
      <Gapura />
      {u.salam && (
        <Tumbuh awal={0.5} durasi={1.6} jeda={0.4}>
          <p className={`${kaushan} text-[1.3rem] whitespace-nowrap ${PLUM}`}>{u.salam.buka}</p>
        </Tumbuh>
      )}
      <Naik jeda={0.6}>
        <p className={`mt-2 text-[14px] leading-relaxed ${PLUM}`}>{u.pembuka}</p>
      </Naik>

      {orang.map((p, i) => (
        <div key={p.nama} className="relative">
          {i === 1 && (
            <Tumbuh awal={0.3} durasi={1.4} className="my-4">
              <p className={`${kaushan} text-5xl ${PLUM}`}>&amp;</p>
            </Tumbuh>
          )}
          <div className={`relative mx-auto w-[92%] ${i === 0 ? "mt-8" : ""}`}>
            <Tumbuh awal={0.7}>
              <BingkaiUkir src={p.foto} alt={p.nama} sizes="260px" posisi="50% 20%" />
            </Tumbuh>
            <Rumpun lebih={7} items={BINGKAI_KIRI} jeda={0.5} className={`${s.pSedang} inset-x-[-20%] bottom-0 aspect-[1/0.5]`} />
            <Rumpun lebih={7} items={BINGKAI_KANAN} jeda={0.7} className={`${s.pSedang} inset-x-[-20%] bottom-0 aspect-[1/0.5]`} />
          </div>
          <Tumbuh awal={0.5} durasi={1.6} className="relative z-10 mt-10">
            <h3 className={`${kaushan} text-[1.75rem] leading-tight ${PLUM}`}>{p.nama}</h3>
          </Tumbuh>
          <Naik jeda={0.3} className="relative z-10">
            <p className={`mt-1 text-[13px] leading-relaxed ${PLUM}`}>{p.keterangan}</p>
          </Naik>
        </div>
      ))}
      <Rumpun items={SUDUT_BAWAH} className={`${s.pSedang} bottom-0 left-0 aspect-[1/0.75] w-[38%]`} />
      <Rumpun items={SUDUT_BAWAH} cermin jeda={0.2} className={`${s.pSedang} right-0 bottom-0 aspect-[1/0.75] w-[38%]`} />
    </section>
  );
}

/* ───────── Pembatas: rumah joglo diapit wayang, menimpa ujung bagian sebelumnya & lengkung gapura berikutnya ───────── */

function PembatasJoglo() {
  return (
    <div className="pointer-events-none relative z-20 -mt-[12%] -mb-[22%] h-[17rem] overflow-x-clip" aria-hidden="true">
      <div className="absolute inset-x-0 top-0 h-full opacity-35 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_60%,transparent)]">
        <Image src={ASET.kabut.src} alt="" fill sizes="440px" className="object-cover" />
      </div>
      <div className={`${s.pJauh} absolute inset-0`}>
        <Pohon sisi="kiri" className="bottom-8 left-0 w-[32%]" />
        <Pohon sisi="kanan" jeda={0.1} className="right-0 bottom-8 w-[32%]" />
      </div>
      <Tumbuh dari="b" awal={0.6} jeda={0.2} className="absolute bottom-10 left-[15%] w-[70%]">
        <Gambar a="joglo" sizes="330px" />
      </Tumbuh>
      <div className={`${s.pSedang} absolute inset-0`}>
        <Rumpun items={SUDUT_BAWAH} jeda={0.7} className="bottom-0 left-0 aspect-[1/0.55] w-[40%]" />
        <Rumpun items={SUDUT_BAWAH} cermin jeda={0.8} className="right-0 bottom-0 aspect-[1/0.55] w-[40%]" />
      </div>
      {/* wayang di depan rumpun bunga, mengapit joglo */}
      <Wayang sisi="kiri" jeda={0.5} className="bottom-12 left-0 w-[26%]" />
      <Wayang sisi="kanan" jeda={0.6} className="right-0 bottom-12 w-[26%]" />
    </div>
  );
}

/* ───────── 4. Hitung mundur & acara, masing-masing dibingkai gapura ───────── */

function RincianAcara({ u, a }: { u: Undangan; a: Undangan["acara"][number] }) {
  const { hari, tgl } = hariTanggal(u.tanggal);
  return (
    <div className="relative">
      {/* gunungan wayang samar di belakang nama acara, seperti di referensi */}
      <div className={`${s.pJauh} absolute inset-x-[2%] -top-6 -z-[5]`}>
        <Gunungan className="relative! opacity-40" />
      </div>
      <Tumbuh awal={0.5} durasi={1.6}>
        <h3 className={`${kaushan} text-[2.3rem] leading-tight ${PLUM}`}>{a.nama}</h3>
      </Tumbuh>
      <Naik jeda={0.2}>
        <p className={`${cinzel} mt-1 text-lg font-bold ${PLUM}`}>{hari.toUpperCase()}</p>
        <p className={`${cinzel} text-lg leading-tight font-bold ${PLUM}`}>{tgl.toUpperCase()}</p>
        <p className={`mt-1 text-sm ${PLUM}`}>Pukul {a.jam}</p>
      </Naik>
      <Naik jeda={0.35}>
        <div className={`mx-auto my-3 flex w-36 items-center gap-2 ${PLUM}`}>
          <span className="h-px flex-1 bg-current opacity-60" />
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
            <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
          <span className="h-px flex-1 bg-current opacity-60" />
        </div>
        <p className={`text-sm font-semibold ${PLUM}`}>{u.lokasi.nama}</p>
        <p className={`text-sm ${PLUM}`}>{u.lokasi.alamat}</p>
      </Naik>
      <Tumbuh awal={0.6} durasi={1.2} jeda={0.4} className="mt-4">
        <a href={u.lokasi.maps} target="_blank" rel="noopener noreferrer" className={tombolPlum}>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="6" />
            <path d="m20 20-4.5-4.5" />
          </svg>
          Lihat Maps
        </a>
      </Tumbuh>
    </div>
  );
}

// Kartu-kartu acara yang saling menumpuk saat digulir: tiap kartu menempel di layar (sticky), kartu berikutnya
// naik sambil sedikit miring lalu menimpanya, dan kartu di bawahnya mengecil & meredup.
// Gerak mengecilnya mengikuti penanda tak terlihat tepat sebelum kartu berikutnya (view timeline bernama),
// jadi tetap murni CSS seperti parallax lainnya. Tanpa dukungan browser, kartu tetap menumpuk, hanya tanpa mengecil.
function TumpukanAcara({ u }: { u: Undangan }) {
  const n = u.acara.length;
  const nama = (i: number) => `--jw-kartu-${i}`;
  return (
    <div className="relative px-5 pb-[14svh]" style={{ timelineScope: u.acara.map((_, i) => nama(i)).join(", ") }}>
      {u.acara.map((a, i) => {
        const berikut = i < n - 1 ? nama(i + 1) : null;
        return (
          // Fragment, bukan div: kartu sticky harus anak langsung dari wadah yang tinggi supaya bisa menempel
          <Fragment key={a.nama}>
            {i > 0 && <div className="h-px" style={{ viewTimelineName: nama(i) }} aria-hidden="true" />}
            <div className={`sticky ${i < n - 1 ? "mb-[34svh]" : ""}`} style={{ top: `calc(9svh + ${i * 22}px)` }}>
              <div className={berikut ? s.kartuMundur : ""} style={berikut ? { animationTimeline: berikut } : undefined}>
                <div className={`relative ${i % 2 ? s.kartuMasukKanan : s.kartuMasukKiri}`}>
                  <KartuAcara u={u} a={a} ke={i} />
                  {berikut && (
                    <div className={`${s.kartuRedup} pointer-events-none absolute inset-0 rounded-t-[12rem] rounded-b-3xl bg-[#3b2630]`} style={{ animationTimeline: berikut }} aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

// Satu kartu acara: berbentuk lengkung gapura, berbingkai plum ganda, gunungan samar & bunga di sudut bawahnya
function KartuAcara({ u, a, ke }: { u: Undangan; a: Undangan["acara"][number]; ke: number }) {
  return (
    <div className="relative isolate overflow-hidden rounded-t-[12rem] rounded-b-3xl border-2 border-[#5b3b47]/75 bg-[#f7efe9] px-8 pt-16 pb-28 text-center shadow-[0_28px_44px_-26px_rgb(59_38_48/0.85)]">
      <div className="pointer-events-none absolute inset-2 rounded-t-[11.5rem] rounded-b-[1.2rem] border border-dashed border-[#b8935a]/70" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38%] opacity-[0.22] [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true">
        <Image src={ASET.kabut.src} alt="" fill sizes="400px" className="object-cover" />
      </div>
      <Tumbuh durasi={1.4} awal={0.3} className="mx-auto mb-2 w-fit">
        <KembangPutar className="size-11" />
      </Tumbuh>
      <Naik>
        <p className={`${cinzel} text-[11px] font-bold tracking-[0.3em] ${PLUM} opacity-70`}>ACARA {ke + 1}</p>
      </Naik>
      <div className="mt-2">
        <RincianAcara u={u} a={a} />
      </div>
      <Rumpun items={KARTU_KIRI} jeda={0.4} className="bottom-0 left-0 aspect-[1/0.62] w-[40%]" />
      <Rumpun items={KARTU_KANAN} jeda={0.55} cermin className="right-0 bottom-0 aspect-[1/0.62] w-[40%]" />
    </div>
  );
}

function Acara({ u }: { u: Undangan }) {
  return (
    <section id="acara">
      <div className="relative isolate px-[17%] pt-[32%] pb-[34%] text-center">
        <Gapura />
        <Tumbuh durasi={1.6} jeda={0.5}>
          <KembangPutar className="mx-auto size-14" />
        </Tumbuh>
        <Naik jeda={0.6}>
          <p className={`mt-3 text-[15px] leading-relaxed ${PLUM}`}>Kami akan menikah, dan kami ingin Anda menjadi bagian dari hari istimewa kami!</p>
        </Naik>
        <div className="mt-5">
          <Countdown target={u.mulai} />
        </div>
        <Tumbuh awal={0.6} durasi={1.2} jeda={0.5} className="mt-5">
          <a href={calendarLink(u)} target="_blank" rel="noopener noreferrer" className={tombolPlum}>
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="4" y="5" width="16" height="15" rx="2" />
              <path d="M8 3v4M16 3v4M4 10h16" />
            </svg>
            Save The Date
          </a>
        </Tumbuh>
        <TepiBunga className="top-[30%]" jeda={0.6} />
        <Rumpun items={SUDUT_BAWAH} className={`${s.pSedang} bottom-0 left-0 aspect-[1/0.75] w-[38%]`} />
        <Rumpun items={SUDUT_BAWAH} cermin jeda={0.2} className={`${s.pSedang} right-0 bottom-0 aspect-[1/0.75] w-[38%]`} />
      </div>
      <Judul className="mt-6 mb-8">Rangkaian Acara</Judul>
      <TumpukanAcara u={u} />
    </section>
  );
}

/* ───────── 5. Galeri ───────── */

function BagianGaleri({ u }: { u: Undangan }) {
  return (
    <section id="galeri" className="relative px-5 pt-[30%] pb-28">
      <div className="relative">
        <Judul>Galeri</Judul>
        <Rumpun items={SISI_TERATAI} dari="l" className={`${s.pDekat} -top-12 -left-5 aspect-[1/1.35] w-[22%]`} />
        <Rumpun items={SISI_TERATAI} dari="l" cermin jeda={0.15} className={`${s.pDekat} -top-12 -right-5 aspect-[1/1.35] w-[22%]`} />
      </div>
      <div className="mt-8">
        <Galeri photos={u.foto.galeri} />
      </div>
      <Kupu className="top-[40%] left-2" delay={-8} w={30} />
      <Kupu a="kupu2" className="top-[70%] left-[30%]" delay={-1} w={28} />
    </section>
  );
}

/* ───────── 6. Kisah cinta ───────── */

function Kisah({ u }: { u: Undangan }) {
  const foto = u.foto.galeri[1] ?? u.foto.galeri[0];
  return (
    <section id="cerita" className="relative px-6 pt-[30%] pb-28">
      <Judul>Kisah Cinta</Judul>
      <div className="relative mx-auto mt-8 w-full">
        <Tumbuh awal={0.7} className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-[0_14px_30px_-18px_rgb(91_59_71/0.8)]">
          <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
            <Image src={foto.src} alt={foto.alt} fill sizes="400px" className="object-cover" />
          </div>
        </Tumbuh>
        <Rumpun lebih={0} items={BINGKAI_KIRI} jeda={0.5} className={`${s.pSedang} inset-x-[-7%] -bottom-3 aspect-[1/0.42]`} />
        <Rumpun lebih={0} items={BINGKAI_KANAN} jeda={0.7} className={`${s.pSedang} inset-x-[-7%] -bottom-3 aspect-[1/0.42]`} />
      </div>
      <ol className={`${s.sek} relative mt-10 space-y-6 pl-8`}>
        <span className={`${s.tumbuhGaris} absolute top-1 bottom-1 left-[7px] w-px origin-top bg-[#5b3b47]/50`} aria-hidden="true" />
        {u.cerita.map((c, i) => (
          <li key={c.tahun} className="relative">
            <Tumbuh awal={0} durasi={0.8} jeda={0.1} className="absolute top-0.5 -left-8 grid size-4 place-items-center rounded-full bg-[#5b3b47]">
              <svg viewBox="0 0 24 24" className={`${s.detak} size-2.5 text-[#f7efe9]`} fill="currentColor" style={{ animationDelay: `${-i * 0.4}s` }} aria-hidden="true">
                <path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11Z" />
              </svg>
            </Tumbuh>
            <Naik>
              <p className={`text-[15px] font-bold ${PLUM}`}>{c.judul}</p>
              <p className={`text-[13px] leading-relaxed ${PLUM}`}>
                <span className="font-semibold">Tahun {c.tahun}</span> · {c.isi}
              </p>
            </Naik>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ───────── 7. Ucapan & RSVP, di bawah lengkung gapura ───────── */

function BagianUcapan({ tamu }: { tamu?: string }) {
  return (
    <section id="ucapan" className="relative isolate px-6 pt-[34%] pb-28">
      <Gapura lengkung />
      <Judul>Ucapan &amp; Doa</Judul>
      <Naik jeda={0.2} className="mx-[11%]">
        <p className={`mt-2 mb-8 text-center text-sm ${PLUM}`}>Berikan ucapan terbaik untuk kedua mempelai & konfirmasi kehadiran</p>
      </Naik>
      <Naik>
        <Ucapan tamu={tamu} />
      </Naik>
    </section>
  );
}

/* ───────── 8. Wedding gift ───────── */

function Kado({ u }: { u: Undangan }) {
  return (
    <section id="kado" className="relative isolate px-[17%] pt-[36%] pb-48 text-center">
      <Gapura lengkung />
      <Judul>Wedding Gift</Judul>
      <Naik jeda={0.2}>
        <p className={`mt-3 text-sm leading-relaxed ${PLUM}`}>
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
        </p>
      </Naik>
      <Tumbuh awal={0.6} durasi={1.2} jeda={0.4} className="mt-5">
        <Amplop amplop={u.amplop} />
      </Tumbuh>
      <Wayang sisi="kiri" jeda={0.4} className="bottom-8 left-[2%] w-[24%]" />
      <Wayang sisi="kanan" jeda={0.5} className="right-[2%] bottom-8 w-[24%]" />
      <Rumpun items={SUDUT_BAWAH} jeda={0.6} className={`${s.pSedang} bottom-0 left-0 aspect-[1/0.7] w-[44%]`} />
      <Rumpun items={SUDUT_BAWAH} cermin jeda={0.7} className={`${s.pSedang} right-0 bottom-0 aspect-[1/0.7] w-[44%]`} />
    </section>
  );
}

/* ───────── 9. Penutup: gapura, janur, gunung, wayang ───────── */

function Penutup({ u }: { u: Undangan }) {
  return (
    <section className={`${s.sek} relative isolate overflow-x-clip px-[17%] pt-[30%] pb-[calc(17rem+var(--demo-h,0px))] text-center`}>
      <Gapura />
      <div className={`${s.pJauh} absolute inset-0`}>
        <Gunung jeda={0.2} className="inset-x-[-10%] bottom-[14%]" />
        <Burung className="top-[34%] left-0" delay={-3} />
        <Burung className="top-[37%] left-0" delay={-11} size={11} />
      </div>
      <Janur sisi="kiri" jeda={0.3} className="top-[9%] left-[12%] w-[26%]" />
      <Janur sisi="kanan" jeda={0.4} className="top-[9%] right-[12%] w-[26%]" />
      <div className={`${s.mendekat} relative`}>
        <div className="relative mx-auto w-[78%]">
          <Tumbuh jeda={0.3}>
            <BingkaiUkir src={u.foto.belakang} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} sizes="230px" />
          </Tumbuh>
          <Rumpun lebih={15} items={BINGKAI_KIRI} jeda={0.8} className="inset-x-[-20%] bottom-0 aspect-[1/0.5]" />
          <Rumpun lebih={15} items={BINGKAI_KANAN} jeda={1} className="inset-x-[-20%] bottom-0 aspect-[1/0.5]" />
        </div>
        <Naik jeda={0.2} className="relative">
          <p className={`mt-6 text-sm leading-relaxed ${PLUM}`}>Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan Terima Kasih.</p>
        </Naik>
        {u.salam && (
          <Tumbuh awal={0.5} durasi={1.6} className="relative mt-3">
            <p className={`${kaushan} text-[1.4rem] ${PLUM}`}>{u.salam.tutup}</p>
          </Tumbuh>
        )}
        <Naik jeda={0.2} className="relative">
          <p className={`mt-3 text-sm ${PLUM}`}>Kami yang berbahagia</p>
        </Naik>
        <Tumbuh awal={0.4} durasi={1.8} jeda={0.3} className="relative">
          <p className={`${kaushan} text-[2.8rem] leading-[1.05] ${PLUM} [text-shadow:0_2px_12px_rgb(243_235_229/0.9)]`}>
            {u.wanita.panggilan}
            <br />& {u.pria.panggilan}
          </p>
        </Tumbuh>
      </div>
      <Pohon sisi="kiri" jeda={0.4} className="bottom-[calc(5rem+var(--demo-h,0px))] left-0 w-[28%]" />
      <Pohon sisi="kanan" jeda={0.5} className="right-0 bottom-[calc(5rem+var(--demo-h,0px))] w-[28%]" />
      <Wayang sisi="kiri" jeda={0.8} className="bottom-[calc(3rem+var(--demo-h,0px))] left-[2%] w-[30%]" />
      <Wayang sisi="kanan" jeda={0.9} className="right-[2%] bottom-[calc(3rem+var(--demo-h,0px))] w-[30%]" />
      <Rumpun items={SUDUT_BAWAH} jeda={1} className="bottom-[var(--demo-h,0px)] left-0 aspect-[1/0.75] w-[56%]" />
      <Rumpun items={SUDUT_BAWAH} cermin jeda={1.1} className="right-0 bottom-[var(--demo-h,0px)] aspect-[1/0.75] w-[56%]" />
      <Kupu className="top-[14%] left-[4%]" delay={-5} />
      <KelopakJatuh n={6} />
    </section>
  );
}

export function Isi({ u, opened, tamu }: { u: Undangan; opened: boolean; tamu?: string }) {
  return (
    <>
      <Beranda u={u} opened={opened} />
      <Ayat u={u} />
      <Sambung />
      <Mempelai u={u} />
      <PembatasJoglo />
      <Acara u={u} />
      <PembatasJoglo />
      <BagianGaleri u={u} />
      <PembatasJoglo />
      <Kisah u={u} />
      <PembatasJoglo />
      <BagianUcapan tamu={tamu} />
      <Sambung items={SISI_TERATAI} />
      <Kado u={u} />
      <Sambung />
      <Penutup u={u} />
    </>
  );
}
