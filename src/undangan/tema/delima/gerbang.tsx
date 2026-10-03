"use client";

import { type Transition, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useId, useState } from "react";
import type { Undangan } from "../../types";
import { MASKER_BINGKAI } from "./aset";
import s from "./delima.module.css";
import { DefsEmas, Gambar, HALUS, Kawanan, Merak, Pembatas, TepiBingkai, naskah, prata } from "./hias";

// Beranda tema Merah Delima: lembah air terjun bergaya cetakan tembaga merah, sekaligus animasi pembuka undangan.
// Urutannya (detik setelah "Buka Undangan" ditekan), meniru video pembuka referensinya dengan gerak kamera
// zoom out → zoom in → zoom out:
//   0.0  foto sampul terangkat (shell.tsx); di baliknya kamera mulai dari dekat lalu mundur pelan (zoom out) sampai
//        tampak utuh kertas blush dengan bingkai cermin bergelombang & gerbang besi tempa yang tertutup. Dahan delima,
//        sepasang merak putih & rumpun mawar masuk satu per satu
//   2.1  kamera maju tipis (zoom in) sambil
//   2.3  dua daun gerbang berayun membuka ke dalam (3D) → tampak lembah & air terjun di baliknya
//   4.6  kamera menembus bingkai (zoom in besar): kertas, bingkai, merak & mawar membesar melewati layar dengan
//        kecepatan berbeda, sementara pemandangan di baliknya mundur ke ukuran asli per lapisan (zoom out, parallax)
//   7.0  kawanan burung melintas & nama mempelai muncul di langit
// Saat beranda digulir keluar, tiap lapisan pergi dengan kecepatan berbeda (kelas keluar* di CSS).

const T_PINTU = 2.3;
const T_TEMBUS = 4.6;
const T_TEKS = 7.0;

const MENGENDAP = { duration: 3.8, ease: [0.16, 0.7, 0.2, 1], delay: T_TEMBUS + 0.1 } as const;
const TEMBUS = { duration: 2.4, ease: [0.6, 0.02, 0.75, 0.3], delay: T_TEMBUS } as const;
// kamera di depan gerbang: mundur dari dekat (zoom out), diam sejenak, lalu maju tipis (zoom in) sebelum menembus
const KAMERA = ["scale(1.42)", "scale(1)", "scale(1)", "scale(1.08)"];
const KAMERA_GERAK: Transition = { duration: T_TEMBUS, times: [0, 0.46, 0.5, 1], ease: [[0.25, 0.6, 0.25, 1], "linear", [0.45, 0, 0.55, 1]] };
// lapisan depan masuk bergantian selama kamera mundur
const MASUK = (jeda: number) => ({ duration: 2.2, ease: HALUS, delay: jeda });

// Satu lapisan pemandangan: mulai diperbesar (terlihat dari balik gerbang) lalu mengendap ke ukuran asli
function Lapis({ awal, buka, keluar, children }: { awal: number; buka: boolean; keluar?: string; children: ReactNode }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${keluar ?? ""}`}>
      <motion.div className="absolute inset-0" initial={{ transform: `scale(${awal})` }} animate={buka ? { transform: "scale(1)" } : undefined} transition={MENGENDAP}>
        {children}
      </motion.div>
    </div>
  );
}

/* ───────── Daun gerbang besi tempa ───────── */

const BESI = "#5a1520";

// Satu daun gerbang (kiri; kanan dicerminkan). Engsel di x=0, tepi temu di x=150. Bagian atas: jeruji berujung
// tombak di bawah lengkung; tengah: medali ikal tanpa jeruji; bawah: jeruji dengan lengkung kecil.
function DaunGerbang({ kanan }: { kanan?: boolean }) {
  const id = useId().replace(/:/g, "");
  const emas = `url(#g${id})`;
  const jeruji = Array.from({ length: 9 }, (_, i) => 16 + i * 15);
  // lengkung atas: dari engsel (y=118) naik ke tepi temu (y=52)
  const atas = (x: number) => 118 - 66 * Math.sin(((x / 150) * Math.PI) / 2);
  return (
    <svg viewBox="0 0 150 420" preserveAspectRatio="none" className={`absolute inset-0 h-full w-full ${kanan ? "-scale-x-100" : ""}`} aria-hidden="true">
      <DefsEmas id={`g${id}`} />
      <g fill="none" stroke={BESI} strokeLinecap="round" strokeLinejoin="round">
        {/* jeruji atas berujung tombak */}
        {jeruji.map((x) => {
          const y = Math.round(atas(x) * 10) / 10;
          return (
            <g key={`a${x}`}>
              <path d={`M${x} ${y}V150`} strokeWidth="3" />
              <path d={`M${x} ${y - 13}l-4 8h8Z`} fill={emas} stroke="none" />
            </g>
          );
        })}
        {/* lengkung atas & rel */}
        <path d={`M0 118C50 112 105 86 150 52`} strokeWidth="5" />
        <path d={`M0 128C50 122 105 96 150 62`} strokeWidth="1.6" stroke={emas} />
        <path d="M0 150H150M0 158H150" strokeWidth="4" />
        <path d="M0 154H150" strokeWidth="1.2" stroke={emas} />
        {/* panel tengah: medali ikal */}
        <circle cx="75" cy="224" r="36" strokeWidth="4" />
        <circle cx="75" cy="224" r="27" strokeWidth="1.4" stroke={emas} />
        {[0, 90, 180, 270].map((r) => (
          <path key={r} d="M75 224C75 208 84 200 92 204C98 207 96 215 90 214" strokeWidth="3" transform={`rotate(${r} 75 224)`} />
        ))}
        <circle cx="75" cy="224" r="5" fill={emas} stroke="none" />
        {/* ikal C penghubung medali ke tiang */}
        <path d="M39 224C24 224 12 212 14 198C16 186 30 184 32 194" strokeWidth="3.2" />
        <path d="M39 224C24 224 12 236 14 250C16 262 30 264 32 254" strokeWidth="3.2" />
        <path d="M111 224C126 224 138 212 136 198C134 186 120 184 118 194" strokeWidth="3.2" />
        <path d="M111 224C126 224 138 236 136 250C134 262 120 264 118 254" strokeWidth="3.2" />
        <path d="M75 188C75 176 66 168 58 172M75 188C75 176 84 168 92 172" strokeWidth="2.6" />
        <path d="M75 260C75 272 66 280 58 276M75 260C75 272 84 280 92 276" strokeWidth="2.6" />
        <path d="M0 290H150M0 298H150" strokeWidth="4" />
        <path d="M0 294H150" strokeWidth="1.2" stroke={emas} />
        {/* jeruji bawah dengan lengkung kecil */}
        {jeruji.map((x) => (
          <path key={`b${x}`} d={`M${x} 298V404`} strokeWidth="3" />
        ))}
        {jeruji.slice(0, -1).map((x) => (
          <path key={`c${x}`} d={`M${x} 318C${x} 308 ${x + 15} 308 ${x + 15} 318`} strokeWidth="2" />
        ))}
        <path d="M0 404H150M0 412H150" strokeWidth="4" />
        {/* tiang engsel & tepi temu */}
        <path d="M3 0V420" strokeWidth="6" />
        <path d="M147 40V420" strokeWidth="5" />
      </g>
      {/* gembok emas di tepi temu */}
      <rect x="138" y="232" width="12" height="22" rx="2" fill={emas} stroke={BESI} strokeWidth="1.5" />
      <circle cx="144" cy="240" r="1.8" fill={BESI} />
    </svg>
  );
}

const MASKER_KERTAS = {
  maskImage: `linear-gradient(#000, #000), ${MASKER_BINGKAI}`,
  WebkitMaskImage: `linear-gradient(#000, #000), ${MASKER_BINGKAI}`,
  maskSize: "100% 100%, 72% auto",
  WebkitMaskSize: "100% 100%, 72% auto",
  maskPosition: "0 0, 50% 46%",
  WebkitMaskPosition: "0 0, 50% 46%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskComposite: "exclude",
  WebkitMaskComposite: "xor",
} as const;

const MASKER_JENDELA = { maskImage: MASKER_BINGKAI, WebkitMaskImage: MASKER_BINGKAI, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" } as const;

// Kotak bingkai: 72% lebar layar, pusatnya di 46% tinggi layar (sama dengan posisi lubang di kertas)
const KOTAK = "absolute top-[46%] left-1/2 aspect-[300/420] w-[72%] -translate-x-1/2 -translate-y-1/2";

/* ───────── Gerbang pembuka ───────── */

function GerbangPembuka({ buka, onSelesai }: { buka: boolean; onSelesai: () => void }) {
  const ayun = (kanan: boolean) => ({
    initial: { transform: "rotateY(0deg)" },
    animate: buka ? { transform: `rotateY(${kanan ? 104 : -104}deg)` } : undefined,
    transition: { duration: 2.4, ease: [0.5, 0, 0.25, 1] as const, delay: T_PINTU },
  });
  // lapisan depan (merak, mawar, dahan) ikut terdorong keluar lebih cepat daripada kertasnya
  const minggir = (tujuan: string) => ({
    initial: { transform: "translate(0%, 0%) scale(1)" },
    animate: buka ? { transform: tujuan } : undefined,
    transition: TEMBUS,
  });
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20"
      style={{ transformOrigin: "50% 46%" }}
      initial={{ opacity: 1, transform: "scale(1)" }}
      animate={buka ? { opacity: [1, 1, 0], transform: "scale(6)" } : undefined}
      transition={{ ...TEMBUS, opacity: { duration: TEMBUS.duration, times: [0, 0.75, 1], delay: T_TEMBUS } }}
      onAnimationComplete={() => buka && onSelesai()}
      aria-hidden="true"
    >
      <motion.div className="absolute inset-0" style={{ transformOrigin: "50% 46%" }} initial={{ transform: KAMERA[0] }} animate={buka ? { transform: KAMERA } : undefined} transition={KAMERA_GERAK}>
        {/* kertas blush berlubang bingkai cermin, dengan reruntuhan pudar di atasnya */}
        <div className={`${s.kertas} absolute inset-0`} style={MASKER_KERTAS}>
          <div className="absolute top-[-2%] left-1/2 w-[120%] -translate-x-1/2 opacity-45 [mask-image:linear-gradient(to_bottom,black_30%,transparent_80%)]">
            <Gambar a="kastil" sizes="(min-width: 440px) 530px, 120vw" preload />
          </div>
        </div>

        {/* gerbang besi di dalam bingkai */}
        <div className={KOTAK} style={{ ...MASKER_JENDELA, perspective: "900px" }}>
          {[false, true].map((kanan) => (
            <motion.div key={String(kanan)} className={`absolute inset-y-0 w-1/2 ${kanan ? "right-0" : "left-0"}`} style={{ transformOrigin: kanan ? "100% 50%" : "0% 50%" }} {...ayun(kanan)}>
              <DaunGerbang kanan={kanan} />
            </motion.div>
          ))}
        </div>

        {/* tepi bingkai */}
        <motion.div
          className="absolute top-[46%] left-1/2 w-[86.4%] -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, transform: "scale(0.93)" }}
          animate={{ opacity: 1, transform: "scale(1)" }}
          transition={{ duration: 1.4, ease: HALUS, delay: 0.15 }}
        >
          <div className="relative aspect-[360/480]">
            <TepiBingkai className="inset-0 h-full w-full" />
          </div>
        </motion.div>

        {/* dahan delima menjuntai dari sudut atas */}
        {[true, false].map((kiri) => (
          <motion.div key={`d${kiri}`} className={`absolute top-[-1%] w-[60%] ${kiri ? "left-[-16%]" : "right-[-16%]"}`} {...minggir(`translate(${kiri ? -45 : 45}%, -30%) scale(1.3)`)}>
            <motion.div
              initial={{ opacity: 0, transform: "scale(0.8) rotate(-6deg)" }}
              animate={buka ? { opacity: 1, transform: "scale(1) rotate(0deg)" } : undefined}
              transition={MASUK(0.5)}
              style={{ transformOrigin: kiri ? "0% 0%" : "100% 0%" }}
            >
              <div className={kiri ? "rotate-180" : "rotate-180 -scale-x-100"}>
                <div className={s.ayunB} style={{ transformOrigin: "100% 100%" }}>
                  <Gambar a="delima" sizes="200px" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* sepasang merak putih di kaki bingkai */}
        {[true, false].map((kiri) => (
          <motion.div key={`m${kiri}`} className={`absolute bottom-[16%] w-[44%] ${kiri ? "left-[-3%]" : "right-[-3%]"}`} {...minggir(`translate(${kiri ? -60 : 60}%, 10%) scale(1.5)`)}>
            <motion.div
              className="relative aspect-[736/900]"
              initial={{ opacity: 0, transform: `translateX(${kiri ? -30 : 30}%)` }}
              animate={buka ? { opacity: 1, transform: "translateX(0%)" } : undefined}
              transition={MASUK(0.9)}
            >
              <Merak className="inset-0" flip={kiri} sizes="180px" />
            </motion.div>
          </motion.div>
        ))}

        {/* rumpun mawar di depan */}
        <motion.div className="absolute inset-x-0 bottom-0 h-[34%]" {...minggir("translate(0%, 45%) scale(1.6)")}>
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, transform: "translateY(30%)" }}
            animate={buka ? { opacity: 1, transform: "translateY(0%)" } : undefined}
            transition={MASUK(0.3)}
          >
            <Bunga3 />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Rumpun tiga mawar: tangkainya keluar dari tepi bawah layar, kepala bunganya utuh di dalam layar
function Bunga3({ besar = false }: { besar?: boolean }) {
  return (
    <>
      <div className={`absolute ${besar ? "bottom-[-30%] left-[-1%] w-[46%]" : "bottom-[-22%] left-[-1%] w-[42%]"}`}>
        <div className={s.ayunA} style={{ transformOrigin: "40% 100%" }}>
          <Gambar a="mawarTua" sizes="200px" />
        </div>
      </div>
      <div className={`absolute ${besar ? "right-[-1%] bottom-[-32%] w-[46%]" : "right-[-1%] bottom-[-24%] w-[42%]"}`}>
        <div className={s.ayunB} style={{ transformOrigin: "60% 100%" }}>
          <Gambar a="mawarPink" sizes="210px" flip />
        </div>
      </div>
      <div className={`absolute left-[31%] ${besar ? "bottom-[-48%] w-[38%]" : "bottom-[-40%] w-[36%]"}`}>
        <div className={s.ayunA} style={{ transformOrigin: "50% 100%", animationDelay: "-2s" }}>
          <Gambar a="mawarBesar" sizes="170px" />
        </div>
      </div>
    </>
  );
}

/* ───────── Beranda ───────── */

export function Beranda({ u, buka }: { u: Undangan; buka: boolean }) {
  const [tembus, setTembus] = useState(false);
  // "kurangi gerakan": gerak transform dilewati motion, jadi gerbang langsung dihilangkan saat dibuka
  const kurangi = useReducedMotion();
  return (
    <section id="beranda" className={`${s.sek} ${s.langit} relative h-svh min-h-[42rem] overflow-hidden`}>
      {/* pegunungan bersalju (paling jauh) */}
      <Lapis awal={1.45} buka={buka} keluar={s.keluarJauh}>
        <div className="absolute top-[11%] left-[-28%] w-[156%] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_62%,transparent_92%)]">
          <Gambar a="gunung" sizes="(min-width: 440px) 690px, 156vw" preload />
        </div>
      </Lapis>

      {/* lembah & air terjun */}
      <Lapis awal={1.85} buka={buka} keluar={s.keluarTengah}>
        <div className="absolute top-[31%] left-[-14%] w-[128%] [mask-image:linear-gradient(to_bottom,transparent,black_13%)]">
          <div className="relative">
            <Gambar a="airTerjun" sizes="(min-width: 440px) 570px, 128vw" preload />
            {/* tirai air yang terus turun di badan air terjun */}
            <div
              className={`${s.arus} absolute top-[13%] left-[44.5%] h-[30%] w-[13%] opacity-40 mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_75%,transparent)]`}
            />
            <div className={`${s.arus} absolute top-[51%] left-[45%] h-[16%] w-[22%] opacity-30 mix-blend-screen [mask-image:radial-gradient(closest-side,black,transparent)]`} />
            <div className={`${s.kabut} absolute top-[50%] left-[18%] h-[22%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(251_244_241/0.85),transparent)]`} />
          </div>
        </div>
      </Lapis>

      {/* rumpun mawar di depan */}
      <Lapis awal={2.9} buka={buka} keluar={s.keluarDekat}>
        <div className="absolute inset-x-0 bottom-0 h-[30%]">
          <Bunga3 besar />
        </div>
      </Lapis>

      {/* kawanan burung */}
      <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={buka ? { opacity: 1 } : undefined} transition={{ duration: 1.2, delay: T_TEKS - 0.6 }}>
        <Kawanan className="top-[25%] left-0" jeda={-6} />
        <Kawanan className="top-[33%] left-0 w-[30%]!" jeda={-19} n={6} />
      </motion.div>

      {/* nama di langit, muncul setelah kamera menembus bingkai */}
      <div className={`${s.keluarTeks} absolute inset-x-0 top-[7%] flex flex-col items-center px-8 text-center`}>
        {[
          <p key="a" className={`${prata} text-[10px] tracking-[0.45em] text-[#7b2431] uppercase`}>
            The Wedding of
          </p>,
          <h1 key="b" className={`${naskah} mt-1 text-[4rem] leading-[1.05] text-[#4a1219] [text-shadow:0_2px_16px_rgb(248_236_232/0.95)]`}>
            {u.wanita.panggilan} <span className="text-[#c9a35c]">&amp;</span> {u.pria.panggilan}
          </h1>,
          <Pembatas key="c" />,
          <p key="d" className={`${prata} mt-1 text-[12px] tracking-[0.3em] text-[#7b2431] uppercase`}>
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

      <motion.div
        className="absolute inset-x-0 bottom-[calc(5.5rem+var(--demo-h,0px))] flex justify-center"
        initial={{ opacity: 0 }}
        animate={buka ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: T_TEKS + 1 }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className={`${s.petunjuk} size-6 text-[#fbf4f1] drop-shadow-[0_1px_3px_rgb(0_0_0/0.55)]`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </motion.div>

      {!tembus && !(kurangi && buka) && <GerbangPembuka buka={buka} onSelesai={() => setTembus(true)} />}
    </section>
  );
}
