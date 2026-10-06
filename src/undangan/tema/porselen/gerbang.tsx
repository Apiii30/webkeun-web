"use client";

import { type Transition, motion, useReducedMotion } from "motion/react";
import { type CSSProperties, type ReactNode, useCallback, useEffect, useState } from "react";
import type { Undangan } from "../../types";
import { Bunga, Burung, Danau, FotoHaitang, Gambar, HALUS, Medali, Pembatas, Perahu, gilda, naskah } from "./hias";
import s from "./porselen.module.css";

// Beranda tema Biru Porselen: pemandangan danau & air terjun bergaya lukisan porselen biru-putih, sekaligus animasi
// pembuka undangan "dari kamar ke danau" (±12 detik). Urutannya (detik setelah "Buka Undangan" ditekan):
//   0.0  foto sampul terangkat (shell.tsx) → kita berada di kamar bernuansa porselen: jendela lengkung berdaun batik
//        kawung yang masih tertutup, tirai gading, guci hortensia di ambang, dinding berlapis ubin biru-putih.
//        Kamera sedikit berputar sampai menghadap jendela.
//   1.4  cahaya pagi merembes dari celah daun jendela
//   2.2  kedua daun jendela berayun ke dalam kamar (3D), tirai tertiup angin, cahaya menyembur → di luar tampak
//        danau, masih jauh & diperbesar
//   3.6  kamera melangkah menembus jendela (kamar membesar melewati layar) dan terus terbang ke pemandangan
//   6.0  kamera mundur sambil sedikit berputar memperlihatkan seluruh danau; tiap lapisan pemandangan berada di
//        kedalaman 3D sendiri (gunung paling jauh, bunga paling dekat), jadi geraknya parallax sungguhan
//   8.0  nama mempelai muncul di langit
//   8.8  foto mempelai tampil dalam medali porselen haitang (urutannya di FotoHaitang)

const T_HADAP = 0.2;
const T_CAHAYA = 1.4;
const T_BUKA = 2.2;
const T_MASUK = 3.6;
const T_TEKS = 8.0;
const T_FOTO = 8.8;
// detik saat seluruh animasi pembuka selesai (navigasi bawah baru muncul sesudahnya, lihat shell.tsx)
export const T_SELESAI = T_FOTO + 3.4;

// Jalur keyframe dari titik-titik [detik, nilai], satu easing per ruas
function jalur(titik: [number, string][], ease: Transition["ease"] = [0.45, 0, 0.25, 1]) {
  const t0 = titik[0][0];
  const dur = titik[titik.length - 1][0] - t0;
  return {
    nilai: titik.map((p) => p[1]),
    transition: { duration: dur, delay: t0, times: titik.map((p) => (p[0] - t0) / dur), ease: titik.slice(1).map(() => ease) } as Transition,
  };
}

/* ───────── Pemandangan 3D ───────── */

const P = 1000; // jarak pandang (perspective) kamera, px

// Kamera: translateZ = maju ke pemandangan. Dari jendela pemandangan tampak dekat (diperbesar), lalu kamera terbang
// masuk, mundur sambil berputar sedikit, dan berhenti tepat di posisi diam (semua lapisan berukuran asli).
const KAMERA = jalur([
  [0, "translateZ(380px) rotateX(0deg) rotateY(0deg)"],
  [T_MASUK, "translateZ(380px) rotateX(0deg) rotateY(0deg)"],
  [6.0, "translateZ(640px) rotateX(2deg) rotateY(-5deg)"],
  [7.8, "translateZ(110px) rotateX(-3deg) rotateY(3deg)"],
  [9.0, "translateZ(0px) rotateX(0deg) rotateY(0deg)"],
]);

// Satu lapisan pemandangan sejauh z px di belakang layar, diperbesar supaya saat kamera diam ukurannya tetap asli
function Lapis({ z, children }: { z: number; children: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0" style={{ transform: `translateZ(${-z}px) scale(${Math.round(((P + z) / P) * 1000) / 1000})` }}>
      {children}
    </div>
  );
}

function Pemandangan({ buka }: { buka: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 [perspective:1000px] [perspective-origin:50%_38%]">
      <motion.div
        className="absolute inset-0 [transform-style:preserve-3d]"
        initial={{ transform: KAMERA.nilai[0] }}
        animate={buka ? { transform: KAMERA.nilai } : undefined}
        transition={KAMERA.transition}
      >
        {/* langit & pegunungan (paling jauh) */}
        <Lapis z={700}>
          <div className="absolute -inset-[25%] bg-gradient-to-b from-[#cfdcf1] via-[#e8eef8] to-[#eef2f8]" />
          <div className="absolute top-[14%] left-[-25%] w-[150%] opacity-60 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
            <Gambar a="gunung" sizes="(min-width: 440px) 660px, 150vw" preload />
          </div>
          <Burung className="top-[16%] left-0" delay={-4} />
          <Burung className="top-[19%] left-0" delay={-11} size={11} />
        </Lapis>

        {/* hutan & air terjun Tivoli */}
        <Lapis z={420}>
          <div className="absolute top-[23%] left-[-32%] w-[164%] [mask-image:linear-gradient(to_bottom,transparent,black_24%,black_88%,transparent)]">
            <Gambar a="airTerjun" sizes="(min-width: 440px) 720px, 164vw" preload />
          </div>
          <div className={`${s.kabut} absolute inset-x-[-20%] top-[52%] h-[14%] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(238_242_248/0.9),transparent_70%)]`} />
        </Lapis>

        {/* danau, bayangan air terjun, perahu */}
        <Lapis z={200}>
          <Danau className="-inset-x-[12%] top-[61%] -bottom-[12%]" />
          <div className="absolute top-[61%] left-[-32%] h-[22%] w-[164%] overflow-hidden opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]">
            <div className="-scale-y-100">
              <Gambar a="airTerjun" sizes="(min-width: 440px) 720px, 164vw" preload />
            </div>
          </div>
          <Perahu className="top-[56%] left-[12%] w-[13%]" />
          <Perahu className="top-[60%] right-[16%] w-[8%]" jeda={-9} />
        </Lapis>

        {/* bunga porselen paling dekat: baru tampak saat kamera mundur melewatinya */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ transform: `translateZ(90px) scale(${(P - 90) / P})` }}
          initial={{ opacity: 0 }}
          animate={buka ? { opacity: 1 } : undefined}
          transition={{ duration: 1.4, delay: 6.6 }}
        >
          <Bunga a="peony" className="bottom-[-2%] left-[-8%] w-[54%]" sizes="270px" asal="30% 100%" />
          <Bunga a="hortensia" className="right-[1%] bottom-[1%] w-[34%]" sizes="200px" varian="B" />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ───────── Kamar berjendela ───────── */

// Jendela lengkung 300 × 420 (lengkungnya setengah lingkaran selebar jendela: 150 / 420 = 35,7% tingginya)
const LENGKUNG: CSSProperties = { borderRadius: "50% 50% 0 0 / 35.7% 35.7% 0 0" };
const DINDING = "#f1ebdf";

function Kamar({ buka, onSelesai }: { buka: boolean; onSelesai: () => void }) {
  useEffect(() => {
    if (!buka) return;
    const id = setTimeout(onSelesai, (T_MASUK + 2.4) * 1000);
    return () => clearTimeout(id);
  }, [buka, onSelesai]);

  // kamar: berputar menghadap jendela, diam, lalu membesar melewati layar (kamera menembus jendela) & memudar
  const kamar = jalur(
    [
      [0, "rotateY(10deg) scale(1.07)"],
      [T_HADAP, "rotateY(10deg) scale(1.07)"],
      [T_HADAP + 2.4, "rotateY(0deg) scale(1)"],
      [T_MASUK, "rotateY(0deg) scale(1)"],
      [T_MASUK + 2.2, "rotateY(0deg) scale(6)"],
    ],
    [0.5, 0, 0.3, 1],
  );
  const pudar = { duration: T_MASUK + 2.2, times: [0, (T_MASUK + 1.3) / (T_MASUK + 2.2), 1] };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-clip [perspective:900px]" aria-hidden="true">
      <motion.div
        className="absolute inset-0 flex flex-col items-center"
        style={{ transformOrigin: "50% 38%" }}
        initial={{ opacity: 1, transform: kamar.nilai[0] }}
        animate={buka ? { opacity: [1, 1, 0], transform: kamar.nilai } : undefined}
        transition={{ ...kamar.transition, opacity: pudar }}
      >
        <div className="h-[13%] min-h-[5rem] shrink-0" />

        {/* jendela; bayangan raksasanya menjadi dinding kamar di sekeliling lubang jendela */}
        <div className="relative w-[64%] max-w-[17.5rem] shrink-0">
          <div className="relative aspect-[300/420] [perspective:700px]" style={{ ...LENGKUNG, boxShadow: `0 0 0 200vmax ${DINDING}, inset 0 10px 24px rgb(20 35 70 / 0.35)` }}>
            {/* sinar yang merembes dari celah daun jendela, lalu menyembur saat terbuka */}
            <motion.div
              className="absolute inset-y-[4%] left-1/2 w-[6px] -translate-x-1/2 rounded-full bg-[#fffdf5] shadow-[0_0_24px_10px_rgb(255_250_230/0.9)]"
              initial={{ opacity: 0 }}
              animate={buka ? { opacity: [0, 1, 1, 0] } : undefined}
              transition={{ duration: T_BUKA + 0.5 - T_CAHAYA, times: [0, 0.5, 0.8, 1], delay: T_CAHAYA }}
            />
            {[true, false].map((kiri) => (
              <DaunJendela key={String(kiri)} kiri={kiri} buka={buka} />
            ))}
            <motion.div
              className="absolute -inset-[30%] bg-[radial-gradient(closest-side,rgb(255_252_240),rgb(255_248_225/0.7)_45%,transparent)]"
              initial={{ opacity: 0 }}
              animate={buka ? { opacity: [0, 0.95, 0] } : undefined}
              transition={{ duration: 1.8, times: [0, 0.25, 1], ease: "easeOut", delay: T_BUKA + 0.15 }}
            />
            <BingkaiJendela />
          </div>
          {/* ambang jendela & guci hortensia */}
          <div className="absolute inset-x-[-7%] top-full h-3.5 rounded-[3px] bg-[linear-gradient(#fbfaf6,#e3dccd)] shadow-[0_10px_14px_-6px_rgb(20_35_70/0.45)]" />
          <div className="absolute right-[2%] bottom-[calc(-0.1rem)] w-[24%]">
            <div className="relative">
              <Bunga a="hortensia" className="bottom-[62%] left-[-14%] w-[128%]" sizes="110px" varian="B" />
              <Guci />
            </div>
          </div>
        </div>

        {/* dinding bawah berlapis ubin porselen */}
        <div className="relative mt-[14%] w-full flex-1 overflow-hidden border-t-[6px] border-[#27427a] shadow-[0_-1px_0_#b8934f]">
          <div className="grid grid-cols-6">
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} className={`${s.ubin} ${[s.ubinBunga, s.ubinKawung, s.ubinOmbak, s.ubinBunga, s.ubinPerahu, s.ubinKawung][(Math.floor(i / 6) * 2 + i) % 6]} aspect-square`} />
            ))}
          </div>
        </div>

        {/* rel emas & tirai */}
        <div className="absolute inset-x-[3%] top-[6.5%] h-[7px] rounded-full bg-[linear-gradient(#f3e3b4,#b8934f_60%,#8a6a30)] shadow-[0_4px_6px_rgb(20_35_70/0.3)]">
          {[true, false].map((kiri) => (
            <span key={String(kiri)} className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fbeec5,#b8934f_60%,#7d5f28)] ${kiri ? "-left-2" : "-right-2"}`} />
          ))}
        </div>
        {[true, false].map((kiri) => (
          <Tirai key={String(kiri)} kiri={kiri} buka={buka} />
        ))}
      </motion.div>
    </div>
  );
}

// Daun jendela berpanel batik kawung, berengsel di tepi luar; saat dibuka berayun masuk ke kamar
function DaunJendela({ kiri, buka }: { kiri: boolean; buka: boolean }) {
  return (
    <motion.div
      className={`absolute inset-y-0 w-1/2 overflow-hidden border-[5px] border-[#fbfaf6] bg-[#fbfaf6] shadow-[0_0_0_1px_#d6cfbe] ${kiri ? "left-0 rounded-tl-[100%_35.7%]" : "right-0 rounded-tr-[100%_35.7%]"}`}
      style={{ transformOrigin: kiri ? "0% 50%" : "100% 50%", backfaceVisibility: "visible" }}
      initial={{ transform: "rotateY(0deg)" }}
      animate={buka ? { transform: [`rotateY(0deg)`, `rotateY(${kiri ? -12 : 12}deg)`, `rotateY(${kiri ? -118 : 118}deg)`, `rotateY(${kiri ? -104 : 104}deg)`] } : undefined}
      transition={{ duration: 2.2, times: [0, 0.18, 0.7, 1], ease: [[0.4, 0, 0.6, 1], [0.3, 0, 0.2, 1], [0.4, 0, 0.4, 1]], delay: T_BUKA }}
    >
      <div className={`${s.kawung} absolute inset-0 ${kiri ? "rounded-tl-[100%_35.7%]" : "rounded-tr-[100%_35.7%]"}`} />
      <span className={`absolute inset-[6px] border border-[#d8b56e]/80 ${kiri ? "rounded-tl-[100%_35.7%]" : "rounded-tr-[100%_35.7%]"}`} />
      <span className="absolute inset-x-[6px] top-[58%] h-[3px] bg-[#fbfaf6]" />
      <Medali className={`top-[40%] w-[72%] -translate-y-1/2 ${kiri ? "left-full -translate-x-1/2" : "left-0 -translate-x-1/2"}`} />
      {/* gagang emas */}
      <span className={`absolute top-[62%] size-2.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fbeec5,#b8934f)] shadow ${kiri ? "right-2" : "left-2"}`} />
    </motion.div>
  );
}

// Bingkai kayu jendela dicat kobalt bergaris emas, batu kunci di puncak lengkung
function BingkaiJendela() {
  const tepi = "M0 420V150A150 150 0 0 1 300 150V420";
  return (
    <svg viewBox="0 0 300 420" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <path d={`${tepi}Z`} fill="none" stroke="#27427a" strokeWidth="16" style={{ filter: "drop-shadow(0 6px 8px rgb(20 35 70 / 0.35))" }} />
      <path d={tepi} fill="none" stroke="#d8b56e" strokeWidth="2.2" transform="translate(150 210) scale(1.035) translate(-150 -210)" />
      <path d={tepi} fill="none" stroke="#fbfaf6" strokeWidth="1.6" transform="translate(150 210) scale(0.968) translate(-150 -210)" />
      <path d="M138 -10h24l-4 22h-16Z" fill="#27427a" stroke="#d8b56e" strokeWidth="1.6" />
      <circle cx="150" cy="2" r="3.4" fill="#d8b56e" />
    </svg>
  );
}

// Tirai gading berlipit dengan tepi kobalt & ikatan emas; tertiup angin saat jendela terbuka
function Tirai({ kiri, buka }: { kiri: boolean; buka: boolean }) {
  const id = kiri ? "pb-tirai-ki" : "pb-tirai-ka";
  return (
    <motion.div
      className={`absolute top-[6.5%] h-[72%] w-[27%] ${kiri ? "left-0" : "right-0 -scale-x-100"}`}
      style={{ transformOrigin: "50% 0%" }}
      initial={{ transform: "rotate(0deg) skewX(0deg)" }}
      animate={buka ? { transform: ["rotate(0deg) skewX(0deg)", "rotate(-5deg) skewX(4deg)", "rotate(2.5deg) skewX(-2deg)", "rotate(-1deg) skewX(1deg)", "rotate(0deg) skewX(0deg)"] } : undefined}
      transition={{ duration: 3.4, times: [0, 0.2, 0.5, 0.78, 1], ease: "easeInOut", delay: T_BUKA + 0.1 }}
    >
      <svg viewBox="0 0 100 400" preserveAspectRatio="none" className="h-full w-full overflow-visible drop-shadow-[6px_8px_10px_rgb(20_35_70/0.25)]">
        <defs>
          <linearGradient id={id} x1="0" x2=".16" spreadMethod="repeat">
            <stop offset="0" stopColor="#fbf8f0" />
            <stop offset=".55" stopColor="#e9e1cf" />
            <stop offset="1" stopColor="#fbf8f0" />
          </linearGradient>
        </defs>
        <path d="M0 0H100C96 90 72 200 40 252C56 300 70 360 74 400H0Z" fill={`url(#${id})`} />
        <path d="M100 0C96 90 72 200 40 252C56 300 70 360 74 400" fill="none" stroke="#27427a" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <path d="M0 254C14 260 30 258 46 250" fill="none" stroke="#b8934f" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </motion.div>
  );
}

// Guci porselen biru-putih di ambang jendela
function Guci() {
  return (
    <svg viewBox="0 0 60 70" className="relative w-full drop-shadow-[0_4px_4px_rgb(20_35_70/0.3)]" aria-hidden="true">
      <path d="M20 4h20v6c10 4 16 14 16 26 0 16-10 30-26 30S4 52 4 36c0-12 6-22 16-26Z" fill="#fbfaf6" stroke="#27427a" strokeWidth="1.6" />
      <path d="M7 30h46M8 48h44" stroke="#27427a" strokeWidth="1.2" />
      <path d="M12 36c4-4 8-4 12 0s8 4 12 0 8-4 12 0" fill="none" stroke="#27427a" strokeWidth="1.4" />
      <circle cx="30" cy="39" r="4" fill="#27427a" />
      <path d="M18 4h24" stroke="#27427a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ───────── Beranda ───────── */

export function Beranda({ u, buka }: { u: Undangan; buka: boolean }) {
  const [tembus, setTembus] = useState(false);
  const selesai = useCallback(() => setTembus(true), []);
  // "kurangi gerakan": gerak transform dilewati motion, jadi kamar langsung dihilangkan saat dibuka
  const kurangi = useReducedMotion();
  return (
    <section id="beranda" className={`${s.sek} relative h-svh min-h-[42rem] overflow-clip bg-[#e3ebf6]`}>
      <Pemandangan buka={buka} />

      {/* nama di langit, muncul setelah kamera berhenti */}
      <div className={`${s.keluarTeks} absolute inset-x-0 top-[8%] flex flex-col items-center px-8 text-center`}>
        {[
          <p key="a" className="text-[10px] tracking-[0.45em] text-[#27427a] uppercase">
            The Wedding of
          </p>,
          <h1 key="b" className={`${naskah} mt-1 text-[3.6rem] leading-[1.1] text-[#1f3768] [text-shadow:0_2px_14px_rgb(238_242_248/0.95)]`}>
            {u.wanita.panggilan} <span className="text-[#b8934f]">&amp;</span> {u.pria.panggilan}
          </h1>,
          <Pembatas key="c" />,
          <p key="d" className={`${gilda} mt-1 text-[13px] tracking-[0.3em] text-[#27427a] uppercase`}>
            {u.tanggal}
          </p>,
        ].map((el, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, transform: "translateY(20px)" }}
            animate={buka ? { opacity: 1, transform: "translateY(0px)" } : undefined}
            transition={{ duration: 1.3, ease: HALUS, delay: T_TEKS + i * 0.18 }}
          >
            {el}
          </motion.div>
        ))}
      </div>

      {/* foto mempelai dalam medali porselen haitang (urutan animasinya di FotoHaitang) */}
      <div className={`${s.keluarTengah} absolute inset-x-0 top-[max(29%,14rem)] flex justify-center`}>
        <div className="w-[52%] max-w-[13.5rem]">
          <FotoHaitang src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} sizes="240px" mulai={buka ? T_FOTO : false} />
        </div>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-[calc(5.5rem+var(--demo-h,0px))] flex justify-center"
        initial={{ opacity: 0 }}
        animate={buka ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: T_SELESAI }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className={`${s.petunjuk} size-6 text-[#f6f3ec] drop-shadow-[0_1px_3px_rgb(0_0_0/0.5)]`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </motion.div>

      {!tembus && !(kurangi && buka) && <Kamar buka={buka} onSelesai={selesai} />}
    </section>
  );
}
