"use client";

import { type Transition, motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import type { Undangan } from "../../types";
import { Awan, Bunga, Gambar, HALUS, KawananBangau, Kerlip, Lentera, Paifang, PitaMeander, Shuangxi, naskah, yuji } from "./hias";
import s from "./oriental.module.css";

// Beranda tema Oriental Peony sekaligus animasi pembuka (±10 detik setelah "Buka Undangan" ditekan). Kamera bergerak
// zoom out → zoom in → zoom out melewati lanskap lukisan biru-hijau; tiap lapisan punya kedalaman sendiri (parallax):
//   0.0  sampul (shell.tsx) membesar menembus jendela bulannya & memudar
//   1.0  kamera mundur dari dekat: pegunungan berlapis mengecil ke tempatnya, kabut tersibak ke kiri-kanan, bangau
//        mulai terbang melintas
//   3.4  gerbang paifang merah naik dari bawah; peoni mekar di kedua sudut
//   4.6  kamera maju mendekati gerbang (zoom in) — gerbang membesar memenuhi layar, peoni terdorong keluar
//   6.0  kamera mundur lagi (zoom out): kolam teratai naik di depan gerbang, bambu menjuntai dari kedua sudut atas
//   7.4  bingkai kayu merah masuk: tiang dari kiri-kanan, balok beratap dari atas, lentera merah turun bergantian
//   8.8  segel 囍 muncul berputar, nama mempelai tampil berkilau di langit
// Saat beranda digulir keluar, tiap lapisan pergi dengan kecepatan berbeda (kelas keluar* di CSS).

export const T_SELESAI = 10.2; // dipakai navigasi

const AKHIR = 8.2; // kamera berhenti
const PUSAT = "50% 58%";

// Jalur keyframe dari titik-titik [detik, nilai] dengan satu easing per ruas
function jalur(titik: [number, string][], ease: Transition["ease"] = [0.45, 0, 0.25, 1]) {
  const t0 = titik[0][0];
  const dur = titik[titik.length - 1][0] - t0;
  return {
    nilai: titik.map((p) => p[1]),
    transition: { duration: dur, delay: t0, times: titik.map((p) => (p[0] - t0) / dur), ease: titik.slice(1).map(() => ease) } as Transition,
  };
}

// Kamera untuk lapisan berkedalaman k (k besar = lebih dekat, bergerak lebih jauh)
const kamera = (k: number) =>
  jalur([
    [0, `scale(${1 + 0.9 * k})`],
    [1.0, `scale(${1 + 0.9 * k})`],
    [3.6, "scale(1)"],
    [4.6, "scale(1)"],
    [6.0, `scale(${1 + 0.25 * k})`],
    [AKHIR, "scale(1)"],
  ]);

function Gerak({ j, buka, className = "", style, children }: { j: ReturnType<typeof jalur>; buka: boolean; className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <motion.div className={className} style={style} initial={{ transform: j.nilai[0] }} animate={buka ? { transform: j.nilai } : undefined} transition={j.transition}>
      {children}
    </motion.div>
  );
}

// Satu lapisan pemandangan berkedalaman k, pergi dengan kelas `keluar` saat beranda digulir keluar
function Lapis({ k, buka, keluar, children }: { k: number; buka: boolean; keluar?: string; children: ReactNode }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${keluar ?? ""}`}>
      <Gerak j={kamera(k)} buka={buka} className="absolute inset-0" style={{ transformOrigin: PUSAT }}>
        {children}
      </Gerak>
    </div>
  );
}

const muncul = (buka: boolean, jeda: number, durasi = 1) => ({
  initial: { opacity: 0 },
  animate: buka ? { opacity: 1 } : undefined,
  transition: { duration: durasi, delay: jeda },
});

export function Beranda({ u, buka }: { u: Undangan; buka: boolean }) {
  return (
    <section id="beranda" className={`${s.sek} ${s.langit} relative h-svh min-h-[42rem] overflow-hidden`}>
      {/* matahari pagi & awan */}
      <Lapis k={0.3} buka={buka} keluar={s.keluarJauh}>
        <div className="absolute top-[30%] left-1/2 aspect-square w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_244_214/0.95),rgb(255_236_200/0.35)_55%,transparent)]" />
        <div className={`${s.awanGeser} absolute top-[13%] left-[6%] w-[30%] opacity-80`} style={{ "--d": "38s" } as CSSProperties}>
          <Awan />
        </div>
        <div className={`${s.awanGeser} absolute top-[19%] right-[2%] w-[24%] opacity-70`} style={{ "--d": "46s", animationDelay: "-12s" } as CSSProperties}>
          <Awan />
        </div>
      </Lapis>

      {/* pegunungan berlapis */}
      <Lapis k={0.5} buka={buka} keluar={s.keluarJauh}>
        <div className="absolute top-[24%] left-[-32%] w-[164%] opacity-75 [mask-image:linear-gradient(to_bottom,black_55%,transparent_92%)]">
          <Gambar a="gunungJauh" sizes="(min-width: 440px) 720px, 164vw" preload />
        </div>
      </Lapis>
      <Lapis k={0.8} buka={buka} keluar={s.keluarTengah}>
        <div className="absolute top-[31%] left-[-30%] w-[150%] [mask-image:linear-gradient(to_bottom,black_62%,transparent_95%)]">
          <Gambar a="gunungPuncak" sizes="(min-width: 440px) 660px, 150vw" preload />
        </div>
        {/* kabut di kaki gunung */}
        <div className="absolute top-[52%] left-[-10%] h-[16%] w-[120%] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(250_247_238/0.9),transparent)]" />
      </Lapis>
      <Lapis k={1.1} buka={buka} keluar={s.keluarTengah}>
        {/* dua tebing di kiri & kanan; sisi potongnya di luar layar, sisi dalam & kakinya memudar */}
        <div className="absolute top-[25%] left-[-46%] w-[92%] [mask-image:linear-gradient(to_bottom,black_60%,transparent_92%)]">
          <div className="[mask-image:linear-gradient(to_left,transparent,black_30%)]">
            <Gambar a="gunungTebing" sizes="(min-width: 440px) 410px, 92vw" flip preload />
          </div>
        </div>
        <div className="absolute top-[21%] right-[-44%] w-[96%] [mask-image:linear-gradient(to_bottom,black_60%,transparent_92%)]">
          <div className="[mask-image:linear-gradient(to_right,transparent,black_30%)]">
            <Gambar a="gunungTebing" sizes="(min-width: 440px) 420px, 96vw" preload />
          </div>
        </div>
      </Lapis>

      {/* kabut tebal yang tersibak ke kiri-kanan saat kamera mundur */}
      <div className="pointer-events-none absolute inset-0">
        {[-1, 1].map((k) => (
          <Gerak
            key={k}
            j={jalur(
              [
                [0, "translateX(0%)"],
                [1.1, "translateX(0%)"],
                [3.8, `translateX(${k * 115}%)`],
              ],
              [0.5, 0, 0.3, 1],
            )}
            buka={buka}
            className={`absolute top-[8%] h-[70%] w-[95%] ${k < 0 ? "left-[-20%]" : "right-[-20%]"}`}
          >
            <div className="h-full w-full rounded-full bg-[radial-gradient(closest-side,rgb(252_249_241),rgb(252_249_241/0.85)_50%,transparent)]" />
          </Gerak>
        ))}
      </div>

      {/* bangau melintas */}
      <motion.div className="pointer-events-none absolute inset-0" {...muncul(buka, 2)}>
        <KawananBangau className="top-[15%]" d={26} jeda={-20} />
        <KawananBangau className="top-[24%] w-[24%]!" d={34} jeda={-5} n={2} />
      </motion.div>

      {/* gerbang paifang: naik, didekati kamera, lalu kamera mundur */}
      <div className={`${s.keluarTengah} pointer-events-none absolute inset-0`}>
        <motion.div className="absolute inset-0" {...muncul(buka, 3.4, 0.8)}>
          <Gerak
            j={jalur([
              [0, "translateY(85%) scale(1)"],
              [3.4, "translateY(85%) scale(1)"],
              [4.8, "translateY(0%) scale(1.04)"],
              [6.0, "translateY(0%) scale(1.95)"],
              [AKHIR, "translateY(0%) scale(1)"],
            ])}
            buka={buka}
            className="absolute bottom-[21%] left-[7%] w-[86%]"
            style={{ transformOrigin: "50% 66%" }}
          >
            <Paifang className="w-full" />
          </Gerak>
        </motion.div>
      </div>

      {/* kolam teratai di depan gerbang */}
      <div className={`${s.keluarDekat} pointer-events-none absolute inset-0`}>
        <Gerak
          j={jalur(
            [
              [0, "translateY(105%)"],
              [6.0, "translateY(105%)"],
              [7.6, "translateY(0%)"],
            ],
            HALUS,
          )}
          buka={buka}
          className="absolute inset-x-0 bottom-0 h-[30%]"
        >
          <div className="absolute inset-x-0 bottom-0 h-[80%] bg-[linear-gradient(180deg,rgb(220_234_232/0),#cfe3df_18%,#b8d6d1_60%,#a9ccc6)]" />
          <div className={`${s.riak} absolute inset-x-0 bottom-[8%] h-[50%] opacity-50 mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent,black_40%)]`} />
          <Bunga a="teratai" className="bottom-[calc(4.2rem+var(--demo-h,0px))] left-[-6%] w-[44%]" sizes="200px" asal="50% 100%" />
          <Bunga a="teratai" className="right-[-8%] bottom-[calc(3.6rem+var(--demo-h,0px))] w-[42%]" sizes="200px" flip varian="B" asal="50% 100%" />
          <Bunga a="terataiBesar" className="bottom-[calc(1.5rem+var(--demo-h,0px))] left-[35%] w-[30%]" sizes="150px" varian="B" />
        </Gerak>
      </div>

      {/* peoni di kedua sudut bawah */}
      <div className={`${s.keluarDekat} pointer-events-none absolute inset-0`}>
        {[-1, 1].map((k) => (
          <Gerak
            key={k}
            j={jalur([
              [0, "translate(0%, 75%) scale(1)"],
              [4.0, "translate(0%, 75%) scale(1)"],
              [5.2, "translate(0%, 0%) scale(1)"],
              [6.0, `translate(${k * 32}%, 18%) scale(1.5)`],
              [AKHIR, "translate(0%, 0%) scale(1)"],
            ])}
            buka={buka}
            className={`absolute bottom-[-7%] w-[42%] ${k < 0 ? "left-[-12%]" : "right-[-12%]"}`}
            style={{ transformOrigin: k < 0 ? "0% 100%" : "100% 100%" }}
          >
            <Bunga a={k < 0 ? "peoniMerahMuda" : "peoniSalem"} className="relative!" sizes="190px" varian={k < 0 ? "A" : "B"} asal={k < 0 ? "30% 100%" : "70% 100%"} />
          </Gerak>
        ))}
      </div>

      {/* bambu menjuntai dari kedua sudut atas */}
      <div className={`${s.keluarDekat} pointer-events-none absolute inset-0`}>
        {[-1, 1].map((k) => (
          <Gerak
            key={k}
            j={jalur(
              [
                [0, `translate(${k * 70}%, -45%) rotate(${k * 18}deg)`],
                [6.4, `translate(${k * 70}%, -45%) rotate(${k * 18}deg)`],
                [7.9, "translate(0%, 0%) rotate(0deg)"],
              ],
              HALUS,
            )}
            buka={buka}
            className={`absolute top-[6%] w-[78%] ${k < 0 ? "left-[-26%]" : "right-[-26%]"}`}
            style={{ transformOrigin: k < 0 ? "0% 0%" : "100% 0%" }}
          >
            <div className={`${s.ayunB} [mask-image:linear-gradient(to_bottom,black_55%,transparent)]`} style={{ transformOrigin: k < 0 ? "0% 0%" : "100% 0%" }}>
              <Gambar a="bambu" sizes="(min-width: 440px) 340px, 78vw" flip={k > 0} />
            </div>
          </Gerak>
        ))}
      </div>

      {/* bingkai kayu merah: tiang kiri-kanan, balok beratap di atas, lentera */}
      <BingkaiMerah buka={buka} />

      {/* segel 囍 & nama di langit */}
      <div className={`${s.keluarTeks} absolute inset-x-0 top-[12%] flex flex-col items-center px-12 text-center`}>
        <motion.div
          initial={{ opacity: 0, transform: "scale(0.2) rotate(-120deg)" }}
          animate={buka ? { opacity: 1, transform: "scale(1) rotate(0deg)" } : undefined}
          transition={{ duration: 1.3, ease: HALUS, delay: 8.8 }}
          className="relative grid size-12 place-items-center rounded-full bg-[#b3242b] shadow-[0_6px_14px_-4px_rgb(125_20_24/0.6)] ring-2 ring-[#f6dc94]"
        >
          <Shuangxi className="size-7" warna="#f6dc94" tebal={18} />
          <Kerlip className="-top-2 -right-3 size-4" jeda={-0.4} />
          <Kerlip className="-bottom-1 -left-4 size-3" jeda={-1.3} />
        </motion.div>
        {[
          <p key="a" className={`${yuji} mt-2 text-[10.5px] tracking-[0.42em] text-[#7d1418] uppercase`}>
            The Wedding of
          </p>,
          <h1 key="b" className={`${naskah} mt-1 text-[3.3rem] leading-[1.05] text-[#9e1c22] [text-shadow:0_2px_14px_rgb(255_250_238/0.95)]`}>
            {u.wanita.panggilan} <span className="text-[#c99a3e]">&amp;</span> {u.pria.panggilan}
          </h1>,
          <p key="c" className={`${yuji} mt-1 text-[12px] tracking-[0.28em] text-[#3b1d16] uppercase [text-shadow:0_1px_8px_rgb(255_250_238)]`}>
            {u.tanggal}
          </p>,
        ].map((el, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, transform: "translateY(18px)" }}
            animate={buka ? { opacity: 1, transform: "translateY(0px)" } : undefined}
            transition={{ duration: 1.2, ease: HALUS, delay: 9.1 + i * 0.2 }}
          >
            {el}
          </motion.div>
        ))}
      </div>

      <motion.div className="absolute inset-x-0 bottom-[calc(5.5rem+var(--demo-h,0px))] flex justify-center" {...muncul(buka, T_SELESAI)} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          className={`${s.petunjuk} size-6 text-[#7d1418] drop-shadow-[0_1px_3px_rgb(255_255_255/0.9)]`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  );
}

/* ───────── Bingkai kayu merah ───────── */

function BingkaiMerah({ buka }: { buka: boolean }) {
  return (
    <div className={`${s.keluarDekat} pointer-events-none absolute inset-0 z-10`}>
      {/* tiang */}
      {[-1, 1].map((k) => (
        <Gerak
          key={k}
          j={jalur(
            [
              [0, `translateX(${k * 130}%)`],
              [7.4, `translateX(${k * 130}%)`],
              [8.5, "translateX(0%)"],
            ],
            HALUS,
          )}
          buka={buka}
          className={`absolute top-0 bottom-0 w-[6.5%] ${k < 0 ? "left-0" : "right-0"}`}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#7d1418,#c8363c_45%,#861a1f)] shadow-[0_0_18px_rgb(60_10_10/0.35)]" />
          <div className="absolute inset-x-0 bottom-[var(--demo-h,0px)] h-[7%] bg-[linear-gradient(180deg,#e9e1cf,#cfc2a5)]" />
          {[16, 72].map((t) => (
            <div key={t} className="absolute inset-x-[-8%] h-[6px] bg-[linear-gradient(90deg,#9b7224,#f6dc94,#9b7224)]" style={{ top: `${t}%` }} />
          ))}
        </Gerak>
      ))}
      {/* balok atas beratap genteng giok */}
      <Gerak
        j={jalur(
          [
            [0, "translateY(-120%)"],
            [7.8, "translateY(-120%)"],
            [8.8, "translateY(0%)"],
          ],
          HALUS,
        )}
        buka={buka}
        className="absolute inset-x-[-3%] top-0 h-[10%]"
      >
        <svg viewBox="0 0 460 70" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="or-genteng" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4c9a8c" />
              <stop offset="1" stopColor="#245650" />
            </linearGradient>
          </defs>
          <path d="M0 0H460V30C440 30 432 36 418 44 380 38 300 36 230 36S80 38 42 44C28 36 20 30 0 30Z" fill="url(#or-genteng)" />
          <path d="M42 44C80 38 160 36 230 36S380 38 418 44" fill="none" stroke="#d9b25f" strokeWidth="2.4" />
          <rect x="0" y="44" width="460" height="16" fill="#9e1c22" />
          <rect x="0" y="44" width="460" height="2" fill="#d9b25f" />
          <rect x="0" y="58" width="460" height="2" fill="#d9b25f" />
        </svg>
        <PitaMeander className="absolute inset-x-0 top-[66%] h-[18%]! bg-[length:auto_100%]! opacity-90" />
      </Gerak>
      {/* lentera bergantian turun dari balok */}
      {[
        ["left-[8%] w-[11%]", "1.5svh", 8.5, 5.2, 3],
        ["right-[8%] w-[11%]", "3svh", 8.7, 4.6, 3.4],
        ["left-[22%] w-[7%]", "0px", 9.0, 5.8, 2.6],
        ["right-[22%] w-[7%]", "0.8svh", 9.2, 5, 2.8],
      ].map(([c, tali, t, d, a]) => (
        <motion.div
          key={c as string}
          className="absolute inset-x-0 top-[7%]"
          initial={{ opacity: 0, transform: "translateY(-140%)" }}
          animate={buka ? { opacity: 1, transform: ["translateY(-140%)", "translateY(6%)", "translateY(0%)"] } : undefined}
          transition={{ duration: 1.4, delay: t as number, times: [0, 0.7, 1], ease: [HALUS, [0.45, 0, 0.55, 1]] } as Transition}
        >
          <Lentera className={c as string} tali={tali as string} d={d as number} a={a as number} />
        </motion.div>
      ))}
    </div>
  );
}
