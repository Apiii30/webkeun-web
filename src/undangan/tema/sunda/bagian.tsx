"use client";

import { motion, type Variants } from "motion/react";
import Image from "next/image";
import { Fragment } from "react";
import { calendarLink, useParalaks } from "../../pakai";
import type { Undangan } from "../../types";
import { ASET, RUMPUN_DASAR, RUMPUN_GEDUNG, RUMPUN_SUDUT, RUMPUN_SUDUT_KANAN } from "./aset";
import { Bagian, Batang, Huruf, Judul, Muncul, bata, ease, gaya, rozha, script, tulis } from "./dasar";
import { Amplop, Countdown, Galeri, Ucapan, tombolBata } from "./interaktif";
import { Kisah } from "./kisah";
import { Aksara, Bingkai, GedungSate, Gulir, Kujang, Kuntul, MegaMendung, MelatiJatuh, Rumpun, Siger, Tumpal } from "./ornamen";
import { Beranda } from "./pembuka";
import s from "./sunda.module.css";
import { KreditWebkeun } from "../../kredit";

// Isi undangan tema Art Sunda. Beranda & animasi pembukanya ada di pembuka.tsx, kisah cinta di kisah.tsx.
// Peralihan antarbagian (semuanya mengikuti scroll, CSS scroll-driven animation di sunda.module.css):
// - bagian berikutnya naik menutupi bagian sebelumnya, yang isinya mundur menjauh (Bagian di dasar.tsx);
// - tepi atas tiap bagian berupa gugusan awan mega mendung dua lapis yang bergerak beda kecepatan;
// - isi bagian baru masuk dengan gerak 3D yang mengikuti scroll: kujang yang bersilang, foto mempelai yang berayun
//   seperti daun pintu, kartu yang bangkit dari meja, foto galeri yang melengkung seperti tabung, kain kisah yang
//   terbentang, awan penutup yang tersibak & Gedung Sate yang naik.
// Browser yang tidak menjalankannya dengan mulus mendapat gerak serupa berbasis waktu (komponen Gulir).

function hariTanggal(tanggal: string) {
  const [hari, ...rest] = tanggal.split(",");
  return { hari: hari.trim(), tgl: rest.join(",").trim() };
}

/* ───────── 2. Ayat: blok nila, dua kujang bersilang & naskah yang tergulung terbuka ───────── */

const BENTANG = [0.65, 0, 0.35, 1] as const;

function Ayat({ u }: { u: Undangan }) {
  if (!u.ayat) return null;
  const words = u.ayat.teks.split(" ");
  return (
    <Bagian
      nila
      className="px-6 pt-10 pb-28 text-center"
      luar={
        <>
          <MegaMendung warna="emas" className={`${s.kJauh} absolute top-10 -left-12 w-44 opacity-25`} />
          <MegaMendung warna="emas" className={`${s.kDekat} absolute -right-14 bottom-28 w-48 opacity-20`} />
        </>
      }
    >
      {/* dua kujang yang berputar masuk lalu bersilang, mengikuti scroll */}
      <div className="relative mx-auto h-40 w-44">
        <Gulir k={s.kSilangKiri} dari="translateX(-130px) rotate(-130deg)" ke="translateX(0px) rotate(0deg)" className="absolute top-0 left-1/2 -ml-6 h-40 w-12 -translate-x-[14px] -rotate-[24deg]">
          <Kujang className="h-full w-full" />
        </Gulir>
        <Gulir k={s.kSilangKanan} dari="translateX(130px) rotate(130deg)" ke="translateX(0px) rotate(0deg)" className="absolute top-0 left-1/2 -ml-6 h-40 w-12 translate-x-[14px] rotate-[24deg]">
          <Kujang className="h-full w-full -scale-x-100" />
        </Gulir>
        <motion.div
          className="absolute -bottom-2 left-1/2 -ml-10 w-20"
          initial={{ opacity: 0, transform: "scale(0.4)" }}
          whileInView={{ opacity: 1, transform: "scale(1)" }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
        >
          <Image src={ASET.melati1.src} alt="" width={ASET.melati1.w} height={ASET.melati1.h} sizes="90px" className="h-auto w-full" />
        </motion.div>
      </div>

      {/* naskah: batang bawah turun membuka gulungan, lalu ayatnya muncul kata demi kata */}
      <motion.div className="relative mx-auto mt-9 w-[94%]" initial="tutup" whileInView="buka" viewport={{ once: true, amount: 0.3 }}>
        <motion.blockquote
          className={`${s.kertas} relative rounded-[3px] px-6 pt-10 pb-10 text-[#3a3330] shadow-[0_26px_40px_-22px_rgb(0_0_0/0.75)]`}
          variants={{ tutup: { clipPath: "inset(0% 0% 100% 0%)" }, buka: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.8, ease: BENTANG, staggerChildren: 0.035, delayChildren: 1.1 } } }}
        >
          <Tumpal className="absolute inset-x-3 top-3 opacity-45" />
          <Tumpal className="absolute inset-x-3 bottom-3 rotate-180 opacity-45" />
          <p className="text-[15px] leading-relaxed">
            “
            {words.map((w, i) => (
              <Fragment key={i}>
                <motion.span
                  className="inline-block"
                  variants={{ tutup: { opacity: 0, transform: "translateY(12px)" }, buka: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.6, ease } } }}
                >
                  {w}
                </motion.span>{" "}
              </Fragment>
            ))}
            ”
          </p>
          <motion.footer
            variants={{ tutup: { opacity: 0, transform: "scale(0.8)" }, buka: { opacity: 1, transform: "scale(1)", transition: { duration: 0.8, ease } } }}
            className={`${rozha} mt-5 text-lg ${bata}`}
          >
            ({u.ayat.sumber})
          </motion.footer>
        </motion.blockquote>
        <Batang className="absolute inset-x-[-4%] -top-1.5" />
        <motion.div
          className="pointer-events-none absolute inset-x-[-4%] top-0 h-full"
          variants={{ tutup: { transform: "translateY(0%)" }, buka: { transform: "translateY(100%)", transition: { duration: 1.8, ease: BENTANG } } }}
        >
          <Batang className="absolute inset-x-0 -top-2" />
        </motion.div>
      </motion.div>
    </Bagian>
  );
}

/* ───────── 3. Salam & mempelai: foto berayun masuk seperti daun pintu ───────── */

function Mempelai({ u }: { u: Undangan }) {
  const orang = [
    { p: u.wanita, hias: RUMPUN_SUDUT, kiri: true },
    { p: u.pria, hias: RUMPUN_SUDUT_KANAN, kiri: false },
  ];
  return (
    <Bagian
      id="mempelai"
      className="px-6 pt-8 pb-28 text-center"
      luar={
        <div className={`${s.kJauh} pointer-events-none absolute inset-x-0 top-0 h-96 opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]`}>
          <Image src={ASET.desa.src} alt="" fill sizes="440px" className="object-cover" />
        </div>
      }
    >
      <motion.div className="relative" initial="hidden" whileInView="show" viewport={{ once: true }}>
        <motion.div variants={gaya.lembut} transition={{ duration: 1 }}>
          <Aksara className="text-xl text-[#2f4560]/80">ᮞᮙ᮪ᮕᮥᮛᮞᮥᮔ᮪</Aksara>
          <p className="mt-1 text-[11px] tracking-[0.35em] text-[#2f4560]/70 uppercase">Sampurasun</p>
        </motion.div>
        {u.salam && (
          <motion.p variants={tulis(1.8)} className={`${script} mt-3 px-2 text-[1.85rem] leading-tight text-balance ${bata}`}>
            {u.salam.buka}
          </motion.p>
        )}
      </motion.div>
      <Muncul as="lembut" delay={0.3}>
        <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-[#3a3330]/85">{u.pembuka}</p>
      </Muncul>

      {orang.map(({ p, hias, kiri }, i) => (
        <div key={p.nama} className="relative">
          {i === 1 && (
            <Gulir k={s.kAmpersand} dari="rotate(-160deg) scale(0.2)" ke="rotate(0deg) scale(1)" className={`${script} mx-auto my-5 w-fit text-6xl ${bata}`}>
              &amp;
            </Gulir>
          )}
          <div className={`relative mx-auto w-[60%] ${i === 0 ? "mt-12" : ""}`}>
            <Gulir k={kiri ? s.kPintuKiri : s.kPintuKanan} dari={`perspective(900px) rotateY(${kiri ? 78 : -78}deg) scale(0.9)`} ke="perspective(900px) rotateY(0deg) scale(1)">
              <Bingkai src={p.foto} alt={p.nama} className="aspect-[3/4] w-full" sizes="260px" posisi="50% 20%" fotoClass={s.geserLambat} />
            </Gulir>
            {/* rumpun di kaki bingkai paling dekat: bergerak lebih cepat dari fotonya */}
            <div className={`${s.kDekat} pointer-events-none absolute inset-0`}>
              <Rumpun items={hias} className="inset-x-[-14%] bottom-0 aspect-[1/0.6]" jeda={0.6} />
            </div>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
            <h3 className={`${rozha} mt-7 text-[1.65rem] leading-snug ${bata}`}>
              <Huruf teks={p.nama} jeda={0.2} cepat={0.03} />
            </h3>
            <motion.p
              variants={{ hidden: { opacity: 0, transform: "translateY(12px)" }, show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.9, delay: 0.8 } } }}
              className="mx-auto mt-1 max-w-[17rem] text-sm leading-relaxed text-[#3a3330]/80"
            >
              {p.keterangan}
            </motion.p>
          </motion.div>
        </div>
      ))}
    </Bagian>
  );
}

/* ───────── 4. Hitung mundur & 5. Acara: satu blok nila, kartu-kartunya bangkit dari meja ───────── */

const ANGKAT = { dari: "perspective(1000px) translateY(80px) rotateX(46deg) scale(0.9)", ke: "perspective(1000px) translateY(0px) rotateX(0deg) scale(1)" };

function HitungMundur({ u }: { u: Undangan }) {
  return (
    <div className="relative px-6 pt-10 pb-6">
      <Gulir k={s.kAngkat} {...ANGKAT} className={`${s.kertas} relative rounded-[2rem] border border-[#d9bd85] p-1.5 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.6)]`}>
        <div className="relative rounded-[1.6rem] border border-dashed border-[#8a4b35]/35 px-5 pt-9 pb-7 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} transition={{ staggerChildren: 0.15, delayChildren: 0.4 }}>
            <motion.div variants={gaya.zoom} className="mx-auto grid size-12 place-items-center rounded-full bg-[#2f4560] text-[#f4eee2]">
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M8 3v4M16 3v4M4 10h16M10 14.5l1.5 1.5 3-3" />
              </svg>
            </motion.div>
            <motion.p variants={gaya.lembut} className="mt-4 text-[15px] leading-relaxed text-[#3a3330]">
              Kami akan menikah, dan kami ingin kamu menjadi bagian dari hari istimewa kami!
            </motion.p>
            <motion.div variants={gaya.lembut} className="mt-6">
              <Countdown target={u.mulai} />
            </motion.div>
            <motion.p variants={gaya.lembut} className={`${rozha} mt-6 text-lg ${bata}`}>
              {u.tanggal}
            </motion.p>
            <motion.div variants={gaya.zoom}>
              <a href={calendarLink(u)} target="_blank" rel="noopener noreferrer" className={`${tombolBata} mt-4`}>
                Simpan Tanggal
              </a>
            </motion.div>
          </motion.div>
        </div>
      </Gulir>
    </div>
  );
}

// Kartu acara: lengkung tinggi krem dengan Gedung Sate di dasarnya
function KartuAcara({ u, a }: { u: Undangan; a: Undangan["acara"][number] }) {
  const { hari, tgl } = hariTanggal(u.tanggal);
  const isi: Variants = { hidden: { opacity: 0, transform: "translateY(14px)" }, show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.8, ease } } };
  return (
    <Gulir k={s.kAngkat} {...ANGKAT} className="flex justify-center">
      <motion.article
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className={`${s.kertas} relative w-[88%] rounded-t-full rounded-b-[2rem] border border-[#d9bd85] p-1.5 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.7)]`}
      >
        <div className="relative rounded-t-full rounded-b-[1.6rem] border border-dashed border-[#8a4b35]/35 px-6 pt-20 pb-[46%] text-center">
          <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}>
            <motion.div variants={isi}>
              <Siger className="mx-auto w-16" />
            </motion.div>
            <motion.h3 variants={tulis(1.1)} className={`${script} mt-1 px-2 text-[2.6rem] leading-tight ${bata}`}>
              {a.nama}
            </motion.h3>
            <motion.p variants={isi} className="mt-3 text-xs tracking-[0.35em] text-[#2f4560] uppercase">
              {hari}
            </motion.p>
            <motion.p variants={isi} className={`${rozha} text-[1.7rem] leading-tight text-[#2f4560]`}>
              {tgl}
            </motion.p>
            <motion.p variants={isi} className="mt-1 text-sm text-[#3a3330]/80">
              Pukul {a.jam}
            </motion.p>
            <motion.div
              variants={{ hidden: { opacity: 0, transform: "scaleX(0)" }, show: { opacity: 1, transform: "scaleX(1)", transition: { duration: 0.8 } } }}
              className="mx-auto my-4 flex w-40 items-center gap-3 text-[#8a4b35]"
            >
              <span className="h-px flex-1 bg-current opacity-50" />
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
              </svg>
              <span className="h-px flex-1 bg-current opacity-50" />
            </motion.div>
            <motion.p variants={isi} className="font-medium text-[#3a3330]">
              {u.lokasi.nama}
            </motion.p>
            <motion.p variants={isi} className="mx-auto mt-1 max-w-[15rem] text-sm text-[#3a3330]/75">
              {u.lokasi.alamat}
            </motion.p>
            <motion.div variants={gaya.zoom} transition={{ duration: 0.8, ease }}>
              <a href={u.lokasi.maps} target="_blank" rel="noopener noreferrer" className={`${tombolBata} mt-5`}>
                Lihat Lokasi
              </a>
            </motion.div>
          </motion.div>
          <GedungSate sizes="360px" className="absolute inset-x-3 bottom-3 opacity-90 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
        </div>
        <Rumpun items={RUMPUN_DASAR} muncul={false} className="inset-x-[-4%] -bottom-6 aspect-[1/0.42]" />
      </motion.article>
    </Gulir>
  );
}

function BlokAcara({ u }: { u: Undangan }) {
  return (
    <Bagian
      nila
      className="pt-4 pb-28"
      luar={
        <>
          <MegaMendung warna="emas" className={`${s.kJauh} absolute top-24 -right-10 w-40 opacity-20`} />
          <MegaMendung warna="emas" className={`${s.kDekat} absolute top-[46%] -left-12 w-44 opacity-20`} />
          <MegaMendung warna="emas" className={`${s.kJauh} absolute -right-12 bottom-[18%] w-40 opacity-15`} />
        </>
      }
    >
      <HitungMundur u={u} />
      <div id="acara" className="scroll-mt-4 pt-16">
        <Judul kecil="Save the date" terang>
          Akad & Resepsi
        </Judul>
        <div className="mt-10 space-y-16 px-4">
          {u.acara.map((a) => (
            <KartuAcara key={a.nama} u={u} a={a} />
          ))}
        </div>
      </div>
    </Bagian>
  );
}

/* ───────── 6. Galeri: foto melengkung seperti tabung saat lewat ───────── */

function BagianGaleri({ u }: { u: Undangan }) {
  return (
    <Bagian id="galeri" className="px-5 pt-8 pb-28">
      <Judul kecil="Momen berharga">Galeri</Judul>
      <Muncul as="lembut" delay={0.6}>
        <p className="mt-3 text-center text-xs tracking-wide text-[#3a3330]/60">Ketuk foto untuk melihat lebih besar</p>
      </Muncul>
      <div className="h-8" />
      <Galeri photos={u.foto.galeri} />
    </Bagian>
  );
}

/* ───────── 8. Ucapan & RSVP ───────── */

function BagianUcapan({ tamu }: { tamu?: string }) {
  return (
    <Bagian id="ucapan" className="px-5 pt-8 pb-16">
      <Judul kecil="Doa & restu">Ucapan</Judul>
      <Muncul as="lembut" delay={0.4}>
        <p className="mx-auto mt-3 mb-7 max-w-[17rem] text-center text-sm text-[#3a3330]/75">Berikan ucapan terbaik untuk kedua mempelai & konfirmasi kehadiranmu</p>
      </Muncul>
      <Gulir k={s.kAngkat} {...ANGKAT}>
        <Ucapan tamu={tamu} />
      </Gulir>
    </Bagian>
  );
}

/* ───────── 9. Tanda kasih: lembar yang naik menutupi ucapan ───────── */

function Kado({ u }: { u: Undangan }) {
  return (
    <section id="kado" className={`${s.kertasPolos} relative px-5 pt-12 pb-16 shadow-[0_-22px_30px_-24px_rgb(47_69_96/0.55)]`}>
      <Tumpal className="absolute inset-x-0 top-0 opacity-50" />
      <Gulir k={s.kAngkat} {...ANGKAT}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
          <motion.div
            variants={{ hidden: { clipPath: "inset(0% 100% 0% 0% round 1.5rem)" }, show: { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", transition: { duration: 1.3, ease: BENTANG } } }}
            className="relative flex overflow-clip rounded-3xl border border-[#8a4b35]/35 bg-[#fbf7ef]/80"
          >
            <div className={`${s.nila} relative flex w-14 shrink-0 items-center justify-center`}>
              <p className={`${rozha} rotate-180 text-xl tracking-wide whitespace-nowrap text-[#f4eee2] [writing-mode:vertical-rl]`}>Tanda Kasih</p>
            </div>
            <div className="relative px-5 py-7 text-center">
              <MegaMendung className="absolute -right-8 -bottom-6 w-32 opacity-15" />
              <motion.p variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.8, duration: 0.8 } } }} className="relative text-sm leading-relaxed text-[#3a3330]/85">
                Doa restumu sudah lebih dari cukup. Namun jika ingin memberi tanda kasih, kamu bisa mengirimkannya lewat tombol di bawah.
              </motion.p>
              <motion.div
                variants={{ hidden: { opacity: 0, transform: "scale(0.8)" }, show: { opacity: 1, transform: "scale(1)", transition: { delay: 1, duration: 0.8, ease } } }}
                className="relative mt-5"
              >
                <Amplop amplop={u.amplop} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </Gulir>
    </section>
  );
}

/* ───────── 10. Penutup: awan tersibak, Gedung Sate naik dari bawah ───────── */

// Awan mega mendung yang menutupi bagian atas penutup lalu tersibak ke kiri-kanan saat penutup masuk layar. Hanya
// untuk browser yang menjalankan efek scroll; di browser lain awannya tidak dipasang sama sekali.
function AwanPenutup() {
  const awan: [string, boolean][] = [
    ["top-[-2%] -left-[34%] w-[100%]", true],
    ["top-[6%] -right-[38%] w-[104%]", false],
    ["top-[20%] -left-[42%] w-[110%]", true],
    ["top-[30%] -right-[30%] w-[96%]", false],
    ["top-[44%] -left-[26%] w-[92%]", true],
    ["top-[52%] -right-[40%] w-[108%]", false],
  ];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[85svh] overflow-x-clip" aria-hidden="true">
      {awan.map(([c, kiri]) => (
        <div key={c} className={`${kiri ? s.kSibakKiri : s.kSibakKanan} absolute ${c}`}>
          <MegaMendung className="w-full" />
        </div>
      ))}
    </div>
  );
}

function Penutup({ u }: { u: Undangan }) {
  const paralaks = useParalaks();
  return (
    <Bagian batas={false} mundur={false} className="flex min-h-svh flex-col items-center overflow-x-clip px-6 pt-10 pb-[calc(19rem+var(--demo-h,0px))] text-center">
      <Tumpal className="absolute inset-x-0 top-0 opacity-50" />
      <MegaMendung className={`${s.awan} absolute top-16 -left-8 w-32 opacity-90`} />
      <MegaMendung className={`${s.awan} absolute top-40 -right-10 w-28 opacity-90`} style={{ animationDelay: "-8s" }} />
      <div className="relative mt-6 w-[62%]">
        <Gulir k={s.kTimbul} dari="perspective(900px) rotateX(72deg)" ke="perspective(900px) rotateX(0deg)">
          <Bingkai src={u.foto.belakang} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} className="aspect-[3/4] w-full" sizes="270px" fotoClass={s.geserLambat} />
        </Gulir>
        <div className={`${s.kDekat} pointer-events-none absolute inset-0`}>
          <Rumpun items={RUMPUN_SUDUT} className="inset-x-[-12%] bottom-0 aspect-[1/0.6]" jeda={0.8} />
        </div>
      </div>
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} transition={{ staggerChildren: 0.25 }}>
        <motion.p variants={gaya.lembut} className="mx-auto mt-8 max-w-xs text-[15px] leading-relaxed text-[#3a3330]/85">
          Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.
        </motion.p>
        {u.salam && (
          <motion.p variants={tulis(1.6)} className={`${script} mt-3 px-2 text-[1.75rem] whitespace-nowrap ${bata}`}>
            {u.salam.tutup}
          </motion.p>
        )}
        <motion.div variants={gaya.lembut} className="mt-5">
          <Aksara className="text-lg text-[#2f4560]/80">ᮠᮒᮥᮁ ᮔᮥᮠᮥᮔ᮪</Aksara>
          <p className="mt-0.5 text-[11px] tracking-[0.35em] text-[#2f4560]/70 uppercase">Hatur nuhun</p>
        </motion.div>
        <motion.p variants={gaya.lembut} className="mt-6 text-sm text-[#3a3330]/70">
          Kami yang berbahagia
        </motion.p>
        <p className={`${rozha} mt-1 text-[2.3rem] leading-tight ${bata}`}>
          <Huruf teks={`${u.wanita.panggilan} & ${u.pria.panggilan}`} cepat={0.07} />
        </p>
      </motion.div>
      <KreditWebkeun className="relative mt-10 text-[#3a3330]" />

      <div className="absolute inset-x-0 bottom-[var(--demo-h,0px)]">
        <Gulir k={s.kBangkit} dari="translateY(150px) scale(0.92)" ke="translateY(0px) scale(1)" className="relative -mx-[14%]">
          <GedungSate />
        </Gulir>
        <Rumpun items={RUMPUN_GEDUNG} className="inset-x-0 -bottom-2 aspect-[1/0.55]" jeda={0.3} />
      </div>
      <Kuntul className="top-[6%] left-0" delay={-14} />
      <MelatiJatuh n={6} />
      {paralaks && <AwanPenutup />}
    </Bagian>
  );
}

export function Isi({ u, opened, tamu }: { u: Undangan; opened: boolean; tamu?: string }) {
  return (
    <>
      <Beranda u={u} buka={opened} />
      <Ayat u={u} />
      <Mempelai u={u} />
      <BlokAcara u={u} />
      <BagianGaleri u={u} />
      <Kisah u={u} />
      <BagianUcapan tamu={tamu} />
      <Kado u={u} />
      <Penutup u={u} />
    </>
  );
}
