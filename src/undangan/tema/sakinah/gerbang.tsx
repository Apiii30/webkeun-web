"use client";

import { type Transition, motion, useReducedMotion } from "motion/react";
import { type CSSProperties, type ReactNode, useState } from "react";
import type { Undangan } from "../../types";
import { BISMILLAH, MASKER_LENGKUNG, maskerLengkung } from "./aset";
import { Bunga, DaunPintu, FotoLengkung, Gambar, HALUS, Kawanan, Lentera, Pembatas, Ronce, TepiLengkung, arab, marcellus, naskah } from "./hias";
import s from "./sakinah.module.css";

// Beranda tema Putih Sakinah: Taj Mahal saat fajar dalam cetakan tinta emas, sekaligus animasi pembuka undangan.
// Urutannya (detik setelah "Buka Undangan" ditekan), dengan gerak kamera zoom out → zoom in → zoom out:
//   0.0  sampul memudar sambil membesar (shell.tsx); di baliknya kamera mulai dari dekat lalu mundur (zoom out) sampai
//        tampak utuh dinding marmer putih dengan pintu mihrab berkisi emas. Tiap lapisan punya kedalaman sendiri:
//        lentera & bunga di depan mundur lebih jauh daripada dinding (parallax 3D). Kaligrafi Bismillah muncul di
//        atas lengkung, lentera turun dari rantainya, untaian melati terurai, bunga naik dari bawah
//   2.1  kamera maju tipis (zoom in) sambil
//   2.3  dua daun pintu berayun membuka ke dalam (3D); cahaya fajar menyembur dari celahnya
//   4.6  kamera menembus lengkung (zoom in besar): dinding, lentera, melati & bunga membesar melewati layar dengan
//        kecepatan berbeda, sementara pemandangan di baliknya mundur ke ukuran asli per lapisan (zoom out, parallax)
//   7.0  merpati emas melintas & nama mempelai muncul di langit
//   7.4  foto mempelai muncul di lengkung mihrab kecil, lalu dua daun pintunya berayun membuka
// Saat beranda digulir keluar, tiap lapisan pergi dengan kecepatan berbeda (kelas keluar* di CSS).

const T_PINTU = 2.3;
const T_TEMBUS = 4.6;
const T_TEKS = 7.0;
const T_FOTO = 7.4;
// detik saat seluruh animasi pembuka selesai (navigasi bawah baru muncul sesudahnya, lihat shell.tsx)
export const T_SELESAI = T_FOTO + 2.6;

const MENGENDAP = { duration: 3.8, ease: [0.16, 0.7, 0.2, 1], delay: T_TEMBUS + 0.1 } as const;
const TEMBUS = { duration: 2.4, ease: [0.6, 0.02, 0.75, 0.3], delay: T_TEMBUS } as const;
// Kamera di depan pintu: mundur dari dekat sambil turun sedikit (zoom out), diam sejenak, lalu maju tipis (zoom in)
// sebelum menembus. k = kedalaman lapisan (1 = dinding); lapisan yang lebih dekat bergerak lebih jauh.
const kamera = (k: number) => [`translateY(${-4 * k}%) scale(${1 + 0.42 * k})`, "translateY(0%) scale(1)", "translateY(0%) scale(1)", `translateY(0%) scale(${1 + 0.08 * k})`];
const KAMERA_GERAK: Transition = { duration: T_TEMBUS, times: [0, 0.46, 0.5, 1], ease: [[0.25, 0.6, 0.25, 1], "linear", [0.45, 0, 0.55, 1]] };
const MASUK = (jeda: number, durasi = 2.2) => ({ duration: durasi, ease: HALUS, delay: jeda });
const PUSAT = "50% 47%";

// Satu lapisan pemandangan: mulai diperbesar (terlihat dari balik pintu) lalu mengendap ke ukuran asli
function Lapis({ awal, buka, keluar, children }: { awal: number; buka: boolean; keluar?: string; children: ReactNode }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${keluar ?? ""}`}>
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: PUSAT }}
        initial={{ transform: `scale(${awal})` }}
        animate={buka ? { transform: "scale(1)" } : undefined}
        transition={MENGENDAP}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Satu lapisan di depan pintu dengan kedalaman k: ikut gerak kamera sesuai kedalamannya
function Kedalaman({ k, buka, children }: { k: number; buka: boolean; children: ReactNode }) {
  return (
    <motion.div className="absolute inset-0" style={{ transformOrigin: PUSAT }} initial={{ transform: kamera(k)[0] }} animate={buka ? { transform: kamera(k) } : undefined} transition={KAMERA_GERAK}>
      {children}
    </motion.div>
  );
}

// Lubang lengkung di dinding: dinding dibuat 2× layar & berpusat di lubang, supaya pusat lubang tepat di PUSAT
const MASKER_DINDING = {
  maskImage: `linear-gradient(#000, #000), ${MASKER_LENGKUNG}`,
  WebkitMaskImage: `linear-gradient(#000, #000), ${MASKER_LENGKUNG}`,
  maskSize: "100% 100%, 36% auto",
  WebkitMaskSize: "100% 100%, 36% auto",
  maskPosition: "0 0, 50% 50%",
  WebkitMaskPosition: "0 0, 50% 50%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskComposite: "exclude",
  WebkitMaskComposite: "xor",
} as const;

// Kotak pintu: 72% lebar layar, pusatnya di 47% tinggi layar
const KOTAK = "absolute top-[47%] left-1/2 aspect-[300/420] w-[72%] -translate-x-1/2 -translate-y-1/2";

/* ───────── Pintu pembuka ───────── */

function GerbangPembuka({ buka, onSelesai }: { buka: boolean; onSelesai: () => void }) {
  const ayun = (kanan: boolean) => ({
    initial: { transform: "rotateY(0deg)" },
    animate: buka ? { transform: `rotateY(${kanan ? 104 : -104}deg)` } : undefined,
    transition: { duration: 2.4, ease: [0.5, 0, 0.25, 1] as const, delay: T_PINTU },
  });
  // lapisan depan terdorong keluar lebih cepat daripada dindingnya saat kamera menembus
  const minggir = (tujuan: string) => ({
    initial: { transform: "translate(0%, 0%) scale(1)" },
    animate: buka ? { transform: tujuan } : undefined,
    transition: TEMBUS,
  });
  // lentera masuk pelan dengan memudar & turun tipis (tanpa jatuh-memantul): sampulnya sendiri juga berlentera, jadi
  // lentera yang tiba-tiba hilang lalu jatuh dari atas terlihat seperti lampu berkedip
  const turun = (jeda: number) => ({
    initial: { opacity: 0, transform: "translateY(-6%)" },
    animate: buka ? { opacity: 1, transform: "translateY(0%)" } : undefined,
    transition: { duration: 1.8, delay: jeda, ease: HALUS } as Transition,
  });
  const cahaya = {
    initial: { opacity: 0 },
    animate: buka ? { opacity: [0, 0.85, 0] } : undefined,
    transition: { duration: 4, times: [0, 0.4, 1], delay: T_PINTU + 0.25, ease: "easeInOut" } as Transition,
  };
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20"
      style={{ transformOrigin: PUSAT }}
      initial={{ opacity: 1, transform: "scale(1)" }}
      animate={buka ? { opacity: [1, 1, 0], transform: "scale(6)" } : undefined}
      transition={{ ...TEMBUS, opacity: { duration: TEMBUS.duration, times: [0, 0.75, 1], delay: T_TEMBUS } }}
      onAnimationComplete={() => buka && onSelesai()}
      aria-hidden="true"
    >
      {/* dinding, pintu & bingkai (kedalaman 1) */}
      <Kedalaman k={1} buka={buka}>
        <div className={`${s.marmer} absolute top-[47%] left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2`} style={MASKER_DINDING}>
          <div className={`${s.pola} absolute inset-0 opacity-[0.2]`} />
          {/* cahaya dari balik pintu yang menyiram dinding */}
          <motion.div
            className="absolute top-1/2 left-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_232_178/0.75),transparent)]"
            {...cahaya}
          />
        </div>

        {/* kaligrafi Bismillah di atas lengkung */}
        <motion.div className="absolute inset-x-0 top-[3.5%] text-center" {...minggir("translate(0%, -80%) scale(1.3)")}>
          <motion.p
            dir="rtl"
            lang="ar"
            className={`${arab} bg-[linear-gradient(110deg,#8f6d34_10%,#e9d29c_45%,#a98544_60%,#f1e2b8_80%)] bg-clip-text py-[0.45em] text-[1.85rem] leading-[1.6] text-transparent`}
            initial={{ opacity: 0, transform: "translateY(12px)" }}
            animate={buka ? { opacity: 1, transform: "translateY(0px)" } : undefined}
            transition={MASUK(0.7, 1.8)}
          >
            {BISMILLAH}
          </motion.p>
        </motion.div>

        <div className={KOTAK} style={{ ...maskerLengkung, perspective: "900px" }}>
          {/* semburan cahaya fajar di celah pintu */}
          <motion.div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_55%,#fffdf5,rgb(255_236_190/0.85)_45%,rgb(255_236_190/0))]" {...cahaya} />
          {[false, true].map((kanan) => (
            <motion.div key={String(kanan)} className={`absolute inset-y-0 w-1/2 ${kanan ? "right-0" : "left-0"}`} style={{ transformOrigin: kanan ? "100% 50%" : "0% 50%" }} {...ayun(kanan)}>
              <DaunPintu kanan={kanan} />
              {/* bayangan: daun pintu makin gelap saat berputar menjauhi cahaya (kesan tebal & 3D) */}
              <motion.div
                className="absolute inset-0 bg-[#3b3424]"
                initial={{ opacity: 0 }}
                animate={buka ? { opacity: 0.42 } : undefined}
                transition={{ duration: 2.4, ease: [0.5, 0, 0.25, 1], delay: T_PINTU }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="absolute top-[47%] left-1/2 w-[83.52%] -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, transform: "scale(0.94)" }}
          animate={{ opacity: 1, transform: "scale(1)" }}
          transition={{ duration: 1.4, ease: HALUS, delay: 0.15 }}
        >
          <div className="relative aspect-[348/468]">
            <TepiLengkung className="inset-0 h-full w-full" />
          </div>
        </motion.div>
      </Kedalaman>

      {/* untaian melati di kedua sisi (kedalaman 1.25) */}
      <Kedalaman k={1.25} buka={buka}>
        {[true, false].map((kiri) => (
          <motion.div key={`r${kiri}`} className={`absolute inset-y-0 w-[13%] ${kiri ? "left-0" : "right-0"}`} {...minggir(`translate(${kiri ? -80 : 80}%, -6%) scale(1.3)`)}>
            <motion.div
              className="absolute inset-0 origin-top"
              initial={{ opacity: 0, transform: "scaleY(0)" }}
              animate={buka ? { opacity: 1, transform: "scaleY(1)" } : undefined}
              transition={MASUK(0.4, 2.4)}
            >
              <Ronce className={`top-0 w-[24%] ${kiri ? "left-[8%]" : "right-[8%]"}`} n={34} />
              <Ronce className={`top-0 w-[24%] ${kiri ? "left-[40%]" : "right-[40%]"}`} n={26} jeda={-2} />
              <Ronce className={`top-0 w-[24%] ${kiri ? "left-[72%]" : "right-[72%]"}`} n={19} jeda={-4} />
            </motion.div>
          </motion.div>
        ))}
      </Kedalaman>

      {/* lentera tengah (kedalaman 1.5) */}
      <Kedalaman k={1.5} buka={buka}>
        <motion.div className="absolute inset-0" {...minggir("translate(0%, -42%) scale(1.45)")}>
          <motion.div className="absolute inset-0" {...turun(0.55)}>
            <Lentera className="left-[15%] w-[10%]" rantai="26svh" d={5.4} a={2} />
          </motion.div>
          <motion.div className="absolute inset-0" {...turun(0.8)}>
            <Lentera className="right-[16%] w-[9%]" rantai="20svh" d={4.6} a={2.6} jeda={-1.5} />
          </motion.div>
        </motion.div>
      </Kedalaman>

      {/* bunga di depan (kedalaman 1.9) */}
      <Kedalaman k={1.9} buka={buka}>
        <motion.div className="absolute inset-x-0 bottom-0 h-[34%]" {...minggir("translate(0%, 55%) scale(1.6)")}>
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, transform: "translateY(30%)" }}
            animate={buka ? { opacity: 1, transform: "translateY(0%)" } : undefined}
            transition={MASUK(0.3)}
          >
            <RumpunBunga />
          </motion.div>
        </motion.div>
      </Kedalaman>

      {/* lentera terdekat (kedalaman 2.2) */}
      <Kedalaman k={2.2} buka={buka}>
        <motion.div className="absolute inset-0" {...minggir("translate(0%, -60%) scale(1.8)")}>
          <motion.div className="absolute inset-0" {...turun(0.3)}>
            <Lentera className="left-[-1%] w-[16%]" rantai="9svh" d={6} a={1.6} jeda={-0.8} />
          </motion.div>
          <motion.div className="absolute inset-0" {...turun(0.45)}>
            <Lentera className="right-[-2%] w-[15%]" rantai="14svh" d={5.2} a={1.8} jeda={-2.6} />
          </motion.div>
        </motion.div>
      </Kedalaman>
    </motion.div>
  );
}

// Rumpun bunga di kaki layar: magnolia (kiri), anggrek bulan (kanan), dua tangkai melati di tengah. Sisi gambar yang
// terpotong pelatnya dipudarkan (aset.ts), ukurannya dijaga supaya tidak menutupi pemandangan.
function RumpunBunga({ besar = false }: { besar?: boolean }) {
  return (
    <>
      <Bunga a="melati" className={`left-[27%] w-[23%] ${besar ? "bottom-[-4%]" : "bottom-[-8%]"}`} sizes="110px" asal="50% 100%" style={{ rotate: "-16deg" }} />
      <Bunga a="melati" className={`right-[29%] w-[21%] ${besar ? "bottom-[-6%]" : "bottom-[-10%]"}`} sizes="100px" flip varian="B" asal="50% 100%" style={{ rotate: "14deg" }} />
      <Bunga a="magnolia" className={`left-[-14%] w-[60%] ${besar ? "bottom-[-6%]" : "bottom-[-10%]"}`} sizes="(min-width: 440px) 270px, 60vw" asal="40% 100%" />
      <Bunga a="anggrek" className={`right-[-3%] w-[33%] ${besar ? "bottom-[-4%]" : "bottom-[-8%]"}`} sizes="150px" varian="B" asal="60% 100%" />
    </>
  );
}

/* ───────── Beranda ───────── */

export function Beranda({ u, buka }: { u: Undangan; buka: boolean }) {
  const [tembus, setTembus] = useState(false);
  // "kurangi gerakan": gerak transform dilewati motion, jadi pintu langsung dihilangkan saat dibuka
  const kurangi = useReducedMotion();
  return (
    <section id="beranda" className={`${s.sek} ${s.langit} relative h-svh min-h-[42rem] overflow-hidden`}>
      {/* berkas cahaya & Taj Mahal (paling jauh) */}
      <Lapis awal={1.45} buka={buka} keluar={s.keluarJauh}>
        <div className="absolute top-[47%] left-1/2 aspect-square w-[190%] -translate-x-1/2 -translate-y-1/2">
          <div className={`${s.sinar} h-full w-full opacity-60`} />
        </div>
        <div className="absolute top-[27%] left-[-30%] w-[160%] [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_70%,transparent_96%)]">
          <div className="relative">
            <Gambar a="taj" sizes="(min-width: 440px) 710px, 160vw" preload />
            {/* kilau air sungai */}
            <div className={`${s.riak} absolute inset-x-0 top-[74%] h-[16%] opacity-40 mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]`} />
          </div>
        </div>
      </Lapis>

      {/* lentera kecil di langit */}
      <Lapis awal={1.7} buka={buka} keluar={s.keluarTengah}>
        <Lentera className="left-[3%] w-[8%]" rantai="17svh" d={5.6} a={2} redup />
        <Lentera className="right-[4%] w-[7%]" rantai="24svh" d={4.8} a={2.4} jeda={-2} redup />
        <DebuEmas />
      </Lapis>

      {/* bunga di depan */}
      <Lapis awal={2.9} buka={buka} keluar={s.keluarDekat}>
        <div className="absolute inset-x-0 bottom-0 h-[30%]">
          <RumpunBunga besar />
        </div>
      </Lapis>

      {/* merpati emas */}
      <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={buka ? { opacity: 1 } : undefined} transition={{ duration: 1.2, delay: T_TEKS - 0.6 }}>
        <Kawanan className="top-[26%] left-0" jeda={-6} />
        <Kawanan className="top-[33%] left-0 w-[28%]!" jeda={-19} n={5} />
      </motion.div>

      {/* nama di langit, muncul setelah kamera menembus lengkung */}
      <div className={`${s.keluarTeks} absolute inset-x-0 top-[8%] flex flex-col items-center px-10 text-center`}>
        {[
          <p key="a" className={`${marcellus} text-[10px] tracking-[0.45em] text-[#8f6d34] uppercase`}>
            Walimatul &apos;Ursy
          </p>,
          <h1 key="b" className={`${naskah} mt-1 text-[4.3rem] leading-[1] text-[#0f3a31] [text-shadow:0_2px_18px_rgb(253_252_248/0.95)]`}>
            {u.wanita.panggilan} <span className="text-[#b8955a]">&amp;</span> {u.pria.panggilan}
          </h1>,
          <Pembatas key="c" className="mt-1" />,
          <p key="d" className={`${marcellus} mt-1 text-[12px] tracking-[0.3em] text-[#1d3d34] uppercase`}>
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

      {/* foto mempelai di lengkung mihrab kecil: naik pelan, lalu daun pintunya berayun membuka */}
      <div className={`${s.keluarTengah} absolute inset-x-0 top-[max(37%,17.5rem)] flex justify-center`}>
        <motion.div
          className="relative w-[44%] max-w-[12rem]"
          initial={{ opacity: 0, transform: "translateY(40px) scale(0.9)" }}
          animate={buka ? { opacity: 1, transform: "translateY(0px) scale(1)" } : undefined}
          transition={{ duration: 1.3, ease: HALUS, delay: T_FOTO }}
        >
          <FotoLengkung src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} sizes="200px" posisi="50% 30%" preload pintu={buka ? T_FOTO + 0.7 : false} />
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-[calc(5.5rem+var(--demo-h,0px))] flex justify-center"
        initial={{ opacity: 0 }}
        animate={buka ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: T_SELESAI }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          className={`${s.petunjuk} size-6 text-[#0f3a31] drop-shadow-[0_1px_3px_rgb(255_255_255/0.9)]`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </motion.div>

      {!tembus && !(kurangi && buka) && <GerbangPembuka buka={buka} onSelesai={() => setTembus(true)} />}
    </section>
  );
}

// Debu emas yang naik pelan di cahaya fajar
function DebuEmas() {
  const titik = [
    [18, 62, 7, 12],
    [27, 70, 9, -8],
    [36, 58, 8, 16],
    [44, 74, 10, -14],
    [52, 64, 7.5, 8],
    [60, 72, 9.5, -10],
    [68, 60, 8.5, 14],
    [76, 68, 7, -6],
    [32, 80, 11, 10],
    [64, 82, 10.5, -12],
  ];
  return (
    <>
      {titik.map(([x, y, d, gx], i) => (
        <span
          key={i}
          className={`${s.debu} absolute size-[3px] rounded-full bg-[#d9bd7c] shadow-[0_0_6px_1px_rgb(233_210_156/0.9)]`}
          style={{ left: `${x}%`, top: `${y}%`, "--d": `${d}s`, "--x": `${gx}px`, animationDelay: `${-i * 0.9}s` } as CSSProperties}
        />
      ))}
    </>
  );
}
