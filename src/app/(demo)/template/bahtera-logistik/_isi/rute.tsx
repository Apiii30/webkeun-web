"use client";

import { motion, type MotionStyle, type MotionValue, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { HUB, rute } from "./data";
import { useDiam } from "./diam";
import { MONO, STENSIL } from "./gaya";
import { PETA, PULAU_ID, PULAU_TETANGGA } from "./peta";

// Rute dari hub Surabaya. Panggung sticky; tiap rute tergambar bergiliran mengikuti scroll (pathLength), titik
// pelabuhan tujuan muncul saat garisnya sampai, dan kapal kecil berlayar di rute yang sedang digambar.
// Di HP peta dibuat lebih lebar dari layar dan bergeser ke timur mengikuti rute.

const N = rute.length;
const AKHIR = 0.88; // sisa progres setelah ini: semua rute sudah tergambar, diam sebentar
const jalur = (r: (typeof rute)[number]) => `M${HUB[0]} ${HUB[1]} C${r.c1.join(" ")} ${r.c2.join(" ")} ${r.xy.join(" ")}`;

export function Rute() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [aktif, setAktif] = useState(-1);
  useMotionValueEvent(p, "change", (v) => setAktif(Math.min(N - 1, Math.floor((v / AKHIR) * N - 0.15))));
  const geserHP = useTransform(p, [0.05, AKHIR], ["0%", "-52%"]);
  const k = diam ? N - 1 : aktif;
  const r = rute[Math.max(0, k)];
  const sampai = k + 1;

  return (
    <section ref={ref} id="rute" className={`relative bg-[#10213a] text-[#eeeae1] ${diam ? "py-20" : "h-[340svh]"}`}>
      <div className={`${diam ? "" : "sticky top-0 h-svh"} flex flex-col justify-center overflow-hidden`}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <p className={`${MONO} text-[11px] tracking-[0.16em] text-[#f2b33d] uppercase md:text-xs`}>● Rute & jangkauan</p>
            <h2 className={`${STENSIL} mt-3 text-[12vw] leading-[0.88] md:text-[5.4vw]`}>
              Satu hub,
              <br />
              {N} pelabuhan tujuan
            </h2>
          </div>
          <p className={`${STENSIL} text-[16vw] leading-none text-[#f2b33d] md:text-[7vw]`} aria-live="polite">
            {String(sampai).padStart(2, "0")}
            <span className="text-[#eeeae1]/30">/{N}</span>
          </p>
        </div>

        <div className="mt-6 overflow-hidden md:mt-10">
          <motion.div style={(diam ? undefined : { "--geser": geserHP }) as unknown as MotionStyle} className="w-[190vw] translate-x-(--geser) md:w-full md:translate-x-0">
            <div className="mx-auto max-w-6xl md:px-8">
              <Peta p={p} diam={diam} />
            </div>
          </motion.div>
        </div>

        <div className="mx-auto mt-5 flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 md:mt-8 md:px-8">
          <p className={`${MONO} text-xs uppercase md:text-sm`}>
            <span className="text-[#eeeae1]/50">Surabaya →</span> <span className="font-bold">{k < 0 ? "…" : r.kota}</span>
          </p>
          {k >= 0 && (
            <p className={`${MONO} text-xs text-[#eeeae1]/70 uppercase md:text-sm`}>
              {r.moda} · {r.waktu}
            </p>
          )}
          <p className={`${MONO} ml-auto hidden text-xs text-[#eeeae1]/50 uppercase md:block`}>Jadwal kapal mingguan</p>
        </div>
      </div>
    </section>
  );
}

function Peta({ p, diam }: { p: MotionValue<number>; diam: boolean }) {
  return (
    <svg viewBox={`0 0 ${PETA.w} ${PETA.h}`} className="h-auto w-full overflow-visible" role="img" aria-label={`Peta rute dari Surabaya ke ${rute.map((r) => r.kota).join(", ")}`}>
      <defs>
        <pattern id="bh-grid" width="42" height="42" patternUnits="userSpaceOnUse">
          <path d="M42 0H0V42" fill="none" stroke="#eeeae1" strokeOpacity="0.06" />
        </pattern>
      </defs>
      <rect x="-200" y="-60" width={PETA.w + 400} height={PETA.h + 120} fill="url(#bh-grid)" />
      <path d={PULAU_TETANGGA} fill="#1f3555" />
      <path d={PULAU_ID} fill="#2c4a70" stroke="#3f6290" strokeWidth="0.8" />
      {rute.map((r, i) => (
        <Garis key={r.kota} r={r} i={i} p={p} diam={diam} />
      ))}
      {/* hub Surabaya */}
      <circle cx={HUB[0]} cy={HUB[1]} r="12" fill="none" stroke="#f2b33d" strokeWidth="1.5" opacity="0.6" />
      <circle cx={HUB[0]} cy={HUB[1]} r="6" fill="#f2b33d" />
      <text x={HUB[0] + 14} y={HUB[1] + 22} className="font-[family-name:var(--font-jetbrains)] text-[15px] font-bold" fill="#f2b33d">
        SURABAYA
      </text>
    </svg>
  );
}

function Garis({ r, i, p, diam }: { r: (typeof rute)[number]; i: number; p: MotionValue<number>; diam: boolean }) {
  const ref = useRef<SVGPathElement>(null);
  const a = (i / N) * AKHIR;
  const b = ((i + 1) / N) * AKHIR;
  const panjang = useTransform(p, [a, b], [0, 1]);
  const titik = useTransform(p, [b - 0.01, b + 0.01], [0, 1]);
  const kx = useMotionValue(HUB[0]);
  const ky = useMotionValue(HUB[1]);
  const kapal = useTransform(p, [a, a + 0.005, b - 0.005, b], [0, 1, 1, 0]);
  useMotionValueEvent(p, "change", (v) => {
    const el = ref.current;
    if (!el || v < a || v > b) return;
    const t = (v - a) / (b - a);
    const pt = el.getPointAtLength(el.getTotalLength() * t);
    kx.set(pt.x);
    ky.set(pt.y);
  });

  return (
    <g>
      <motion.path
        ref={ref}
        d={jalur(r)}
        fill="none"
        stroke="#f2b33d"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ pathLength: diam ? 1 : panjang }}
        opacity="0.85"
      />
      <motion.g style={diam ? { opacity: 1, scale: 1 } : { opacity: titik, scale: titik }} className="[transform-box:fill-box] [transform-origin:center]">
        <circle cx={r.xy[0]} cy={r.xy[1]} r="5" fill="#eeeae1" />
        <circle cx={r.xy[0]} cy={r.xy[1]} r="9" fill="none" stroke="#eeeae1" strokeOpacity="0.5" />
      </motion.g>
      <motion.text
        style={{ opacity: diam ? 1 : titik }}
        x={r.xy[0] + (r.xy[0] > 900 ? -12 : 12)}
        y={r.xy[1] - 10}
        textAnchor={r.xy[0] > 900 ? "end" : "start"}
        className="font-[family-name:var(--font-jetbrains)] text-[13px]"
        fill="#eeeae1"
      >
        {r.kota}
      </motion.text>
      {!diam && (
        <motion.g style={{ x: kx, y: ky, opacity: kapal }}>
          <path d="M-9 -2 L9 -2 L6 4 L-6 4 Z" fill="#eeeae1" />
          <rect x="-4" y="-7" width="8" height="5" fill="#b8432f" />
        </motion.g>
      )}
    </g>
  );
}
