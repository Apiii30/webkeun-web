"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { type CSSProperties, type ReactNode, useId } from "react";
import { tepiPudar } from "../../tepi";
import { ASET, type NamaAset, SHUANGXI } from "./aset";
import s from "./oriental.module.css";

// Ornamen tema Oriental Peony: gerbang paifang merah beratap giok, lentera merah, bangau terbang, awan keberuntungan,
// 囍, bingkai jendela bulan, pita meander. Gerak masuk memakai `transform` utuh + opacity (dijalankan GPU).

export const naskah = "font-[family-name:var(--font-delafield)]"; // Mrs Saint Delafield
export const yuji = "font-[family-name:var(--font-yuji)]"; // Yuji Syuku
export const HALUS = [0.22, 1, 0.36, 1] as const;

export const MERAH = "#b3242b";
export const MERAH_TUA = "#7d1418";
export const EMAS = "#c99a3e";
export const GIOK = "#2f6b63";
export const TINTA = "#3b1d16";

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
// angka dibulatkan: hasil sin/cos bisa beda di digit terakhir antara server & browser (hydration mismatch)
const b2 = (n: number) => Math.round(n * 100) / 100;

export function Muncul({
  jeda = 0,
  durasi = 1.2,
  dari = "translateY(36px)",
  amount = 0.3,
  className,
  style,
  children,
}: {
  jeda?: number;
  durasi?: number;
  dari?: string;
  amount?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const akhir = dari.startsWith("scale") ? "scale(1)" : dari.startsWith("translateX") ? "translateX(0px)" : dari.startsWith("rotate") ? "rotate(0deg)" : "translateY(0px)";
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, transform: dari }}
      whileInView={{ opacity: 1, transform: akhir }}
      viewport={{ once: true, amount }}
      transition={{ duration: durasi, ease: HALUS, delay: jeda }}
    >
      {children}
    </motion.div>
  );
}

export function Gambar({ a, className = "", sizes = "200px", flip = false, preload }: { a: NamaAset; className?: string; sizes?: string; flip?: boolean; preload?: boolean }) {
  const g: (typeof ASET)[NamaAset] & { tepi?: string; pudar?: number } = ASET[a];
  return (
    <Image src={g.src} alt="" width={g.w} height={g.h} sizes={sizes} preload={preload} loading={preload ? "eager" : undefined} style={tepiPudar(g)} className={`h-auto w-full ${flip ? "-scale-x-100" : ""} ${className}`} />
  );
}

// Bunga yang bergoyang pelan dari pangkalnya
export function Bunga({
  a,
  className = "",
  sizes = "200px",
  flip,
  varian = "A",
  asal = "50% 100%",
  style,
}: {
  a: NamaAset;
  className?: string;
  sizes?: string;
  flip?: boolean;
  varian?: "A" | "B";
  asal?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={style} aria-hidden="true">
      <div className={varian === "A" ? s.ayunA : s.ayunB} style={{ transformOrigin: asal }}>
        <Gambar a={a} sizes={sizes} flip={flip} />
      </div>
    </div>
  );
}

export function DefsEmas({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9b7224" />
        <stop offset=".35" stopColor="#f6dc94" />
        <stop offset=".6" stopColor="#b98b33" />
        <stop offset=".82" stopColor="#fbe7ac" />
        <stop offset="1" stopColor="#9b7224" />
      </linearGradient>
    </defs>
  );
}

export const gradienEmas = "bg-[linear-gradient(135deg,#9b7224,#f6dc94_35%,#b98b33_60%,#fbe7ac_82%,#9b7224)]";

/* ───────── 囍 ───────── */

export function Shuangxi({ className = "", warna = MERAH, tebal = 16 }: { className?: string; warna?: string; tebal?: number }) {
  return (
    <svg viewBox="-6 -6 198 198" className={className} aria-hidden="true">
      <path d={SHUANGXI} fill="none" stroke={warna} strokeWidth={tebal} />
    </svg>
  );
}

/* ───────── Atap bergenteng giok dengan ujung melengkung ke atas ───────── */

// cx: tengah; yr: tinggi bubungan; ht: setengah lebar bubungan; ye: tinggi tepi bawah atap; he: setengah lebar tepi
function Atap({ cx, yr, ht, ye, he, emas, gradien, id }: { cx: number; yr: number; ht: number; ye: number; he: number; emas: string; gradien: string; id: string }) {
  const badan = `M${cx - ht} ${yr}H${cx + ht}C${cx + ht + 12} ${ye - 10} ${cx + he - 22} ${ye - 3} ${cx + he} ${ye - 12}L${cx + he - 5} ${ye}Q${cx} ${ye - 9} ${cx - he + 5} ${ye}L${cx - he} ${ye - 12}C${cx - he + 22} ${ye - 3} ${cx - ht - 12} ${ye - 10} ${cx - ht} ${yr}Z`;
  const garis = Array.from({ length: Math.floor((2 * he) / 7) }, (_, i) => cx - he + 6 + i * 7);
  return (
    <g>
      <clipPath id={`ap${id}`}>
        <path d={badan} />
      </clipPath>
      <path d={badan} fill={gradien} />
      <g clipPath={`url(#ap${id})`} stroke="#1c4440" strokeWidth="1.1" opacity=".55">
        {garis.map((x) => (
          <path key={x} d={`M${x} ${yr - 2}L${cx + (x - cx) * 1.06} ${ye + 2}`} />
        ))}
      </g>
      {/* tepi atap emas & bubungan */}
      <path d={`M${cx - he + 5} ${ye}Q${cx} ${ye - 9} ${cx + he - 5} ${ye}`} fill="none" stroke={emas} strokeWidth="2.4" />
      <rect x={cx - ht - 7} y={yr - 7} width={2 * ht + 14} height="8" rx="2" fill="#1c4440" />
      <rect x={cx - ht - 7} y={yr - 2} width={2 * ht + 14} height="1.6" fill={emas} />
      {/* hiasan ujung bubungan */}
      {[-1, 1].map((k) => (
        <path
          key={k}
          d={`M${cx + k * (ht + 7)} ${yr - 6}c${k * 4} -4 ${k * 4} -12 ${-k * 2} -14c${-k * 5} -2 ${-k * 7} 4 ${-k * 3} 7`}
          fill="none"
          stroke={emas}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      ))}
      {/* ujung tepi yang melengkung naik */}
      {[-1, 1].map((k) => (
        <circle key={k} cx={cx + k * he} cy={ye - 13} r="2.2" fill={emas} />
      ))}
    </g>
  );
}

// Deretan siku penyangga (dougong) di bawah atap
function Dougong({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const n = Math.floor((x1 - x0) / 11);
  return (
    <g>
      <rect x={x0} y={y} width={x1 - x0} height="10" fill="#2a5a7a" />
      {Array.from({ length: n }, (_, i) => (
        <g key={i} transform={`translate(${x0 + 5.5 + i * 11} ${y})`}>
          <rect x="-3.5" y="1.5" width="7" height="3.5" fill="#3f8f74" />
          <rect x="-2" y="5" width="4" height="4" fill="#d9b25f" />
        </g>
      ))}
    </g>
  );
}

// Balok berlukis (caihua): pita biru-hijau dengan bingkai emas & medali di tengah
function Balok({ x0, x1, y, t }: { x0: number; x1: number; y: number; t: number }) {
  const w = x1 - x0;
  return (
    <g>
      <rect x={x0} y={y} width={w} height={t} fill="#2a5a7a" />
      <rect x={x0 + w * 0.16} y={y + 2} width={w * 0.68} height={t - 4} rx={(t - 4) / 2} fill="#3f8f74" stroke="#d9b25f" strokeWidth="1.2" />
      {[x0 + 4, x1 - w * 0.14].map((x) => (
        <rect key={x} x={x} y={y + 2} width={w * 0.1} height={t - 4} fill="#2f6b63" stroke="#d9b25f" strokeWidth=".8" />
      ))}
      <ellipse cx={x0 + w / 2} cy={y + t / 2} rx={Math.min(16, w * 0.12)} ry={t / 2 - 3} fill="#b3242b" stroke="#d9b25f" strokeWidth="1" />
      <rect x={x0} y={y} width={w} height="1.5" fill="#d9b25f" />
      <rect x={x0} y={y + t - 1.5} width={w} height="1.5" fill="#d9b25f" />
    </g>
  );
}

// Tiang merah pernis berumpak batu, bercincin emas
function Tiang({ x, y0, y1, w = 16, emas, id }: { x: number; y0: number; y1: number; w?: number; emas: string; id: string }) {
  return (
    <g>
      <rect x={x - w / 2} y={y0} width={w} height={y1 - y0} fill={`url(#tm${id})`} />
      <rect x={x - w / 2 - 1} y={y0 + 4} width={w + 2} height="3" fill={emas} />
      <rect x={x - w / 2 - 1} y={y1 - 22} width={w + 2} height="3" fill={emas} />
      {/* umpak batu */}
      <path d={`M${x - w / 2 - 6} ${y1}h${w + 12}l-3 -14h${-w - 6}Z`} fill="#e9e1cf" stroke="#b8ab8e" strokeWidth=".8" />
      <rect x={x - w / 2 - 8} y={y1} width={w + 16} height="6" fill="#d8ccb2" />
    </g>
  );
}

/* ───────── Gerbang paifang ───────── */

// Gerbang kehormatan bertiang empat, tiga lorong, tiga atap genteng giok (tengah paling tinggi), papan 囍 di tengah.
// Kotak gambar 400 × 440; kaki tiang di y = 434.
export function Paifang({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, "");
  const emas = `url(#pe${id})`;
  return (
    <svg viewBox="0 0 400 440" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <DefsEmas id={`pe${id}`} />
      <defs>
        <linearGradient id={`tm${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#7d1418" />
          <stop offset=".45" stopColor="#c8363c" />
          <stop offset="1" stopColor="#861a1f" />
        </linearGradient>
        <linearGradient id={`gt${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c9a8c" />
          <stop offset="1" stopColor="#245650" />
        </linearGradient>
      </defs>
      {/* bayangan di tanah */}
      <ellipse cx="200" cy="440" rx="190" ry="8" fill="#3b1d16" opacity=".18" />
      {/* tiang luar & dalam */}
      <Tiang x={48} y0={196} y1={434} emas={emas} id={id} />
      <Tiang x={352} y0={196} y1={434} emas={emas} id={id} />
      <Tiang x={146} y0={118} y1={434} w={19} emas={emas} id={id} />
      <Tiang x={254} y0={118} y1={434} w={19} emas={emas} id={id} />
      {/* balok lorong samping & panel kisi */}
      {[
        [40, 154],
        [246, 360],
      ].map(([a, b]) => (
        <g key={a}>
          <Balok x0={a} x1={b} y={222} t={16} />
          <rect x={a + 12} y={238} width={b - a - 24} height="16" fill="#9e1c22" />
          <path d={Array.from({ length: Math.floor((b - a - 24) / 10) }, (_, i) => `M${a + 17 + i * 10} 239v14`).join("")} stroke="#d9b25f" strokeWidth="1.2" />
          <rect x={a + 12} y={238} width={b - a - 24} height="16" fill="none" stroke="#d9b25f" strokeWidth="1" />
        </g>
      ))}
      {/* balok lorong tengah, papan nama 囍 */}
      <Balok x0={136} x1={264} y={180} t={20} />
      <Balok x0={136} x1={264} y={238} t={12} />
      <rect x="168" y="124" width="64" height="54" rx="3" fill="#9e1c22" stroke={emas} strokeWidth="3" />
      <rect x="173" y="129" width="54" height="44" rx="2" fill="none" stroke="#f6dc94" strokeWidth=".8" />
      <g transform="translate(184 135) scale(.17)">
        <path d={SHUANGXI} fill="none" stroke="#f6dc94" strokeWidth="18" />
      </g>
      {/* atap samping */}
      <Dougong x0={28} x1={170} y={196} />
      <Dougong x0={230} x1={372} y={196} />
      <Atap cx={99} yr={160} ht={42} ye={198} he={82} emas={emas} gradien={`url(#gt${id})`} id={`${id}a`} />
      <Atap cx={301} yr={160} ht={42} ye={198} he={82} emas={emas} gradien={`url(#gt${id})`} id={`${id}b`} />
      {/* atap tengah */}
      <Dougong x0={126} x1={274} y={112} />
      <Atap cx={200} yr={64} ht={58} ye={114} he={104} emas={emas} gradien={`url(#gt${id})`} id={`${id}c`} />
      {/* mutiara di puncak */}
      <circle cx="200" cy="50" r="6" fill={emas} />
      <path d="M200 38v6" stroke={emas} strokeWidth="2" />
    </svg>
  );
}

/* ───────── Lentera merah ───────── */

export function Lentera({ className = "", tali = "4rem", d = 5, a = 3, jeda = 0, style }: { className?: string; tali?: string; d?: number; a?: number; jeda?: number; style?: CSSProperties }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`pointer-events-none absolute top-0 ${className}`} style={style} aria-hidden="true">
      <div className={s.lentera} style={{ "--d": `${d}s`, "--a": `${a}deg`, animationDelay: `${jeda}s` } as CSSProperties}>
        <div className="mx-auto w-[2px] bg-[#7d1418]" style={{ height: tali }} />
        <div className="relative">
          <div
            className={`${s.nyala} absolute top-[10%] left-1/2 aspect-square w-[210%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_170_90/0.45),rgb(255_150_80/0.12)_50%,transparent)]`}
          />
          <svg viewBox="0 0 60 100" className="relative w-full overflow-visible">
            <DefsEmas id={`le${id}`} />
            <defs>
              <radialGradient id={`lb${id}`} cx=".45" cy=".42" r=".65">
                <stop offset="0" stopColor="#ff8a5c" />
                <stop offset=".55" stopColor="#d8302f" />
                <stop offset="1" stopColor="#8e1418" />
              </radialGradient>
            </defs>
            <rect x="20" y="0" width="20" height="8" rx="2" fill={`url(#le${id})`} />
            <ellipse cx="30" cy="36" rx="28" ry="27" fill={`url(#lb${id})`} />
            {/* rusuk lentera */}
            <g fill="none" stroke="#7d1418" strokeWidth="1" opacity=".55">
              <ellipse cx="30" cy="36" rx="18" ry="27" />
              <ellipse cx="30" cy="36" rx="8" ry="27" />
              <path d="M30 9v54" />
            </g>
            <path d="M8 22c4-6 10-10 16-12" stroke="#ffd0a8" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".55" />
            <rect x="20" y="61" width="20" height="7" rx="2" fill={`url(#le${id})`} />
            <g className={s.jumbai} style={{ transformOrigin: "30px 68px", transformBox: "view-box" } as CSSProperties}>
              <circle cx="30" cy="72" r="3" fill={`url(#le${id})`} />
              <path d="M27 75h6l2 22h-10Z" fill="#c8242b" />
              <path d="M28 76v20M30 76v21M32 76v20" stroke="#8e1418" strokeWidth=".6" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ───────── Bangau terbang ───────── */

// Satu bangau mahkota merah terbang ke kanan; sayapnya mengepak (kelas kepak, pusat di punggung)
export function Bangau({ className = "", jeda = 0, style }: { className?: string; jeda?: number; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 60" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <path d="M42 33 14 35M42 34.5 12 38.5" stroke="#3a3a3a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M41 30q-6 0-11 3 6 1.5 11 1.5Z" fill="#1f1f1f" />
      <ellipse cx="55" cy="32" rx="16" ry="5.6" fill="#fbfaf5" />
      <path d="M68 30q14-4 28-6" stroke="#1f1f1f" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="98" cy="23.6" r="2.7" fill="#fbfaf5" />
      <circle cx="98.6" cy="22.2" r="1.3" fill="#d4222b" />
      <path d="M100.3 23.3 111 24.6l-10.7 1.3Z" fill="#b9a678" />
      <g className={s.kepak} style={{ transformOrigin: "56px 30px", transformBox: "view-box", animationDelay: `${jeda}s` } as CSSProperties}>
        <path d="M47 30C50 13 66 4 86 2 75 10 67 18 63 30Z" fill="#fbfaf5" stroke="#d9d4c4" strokeWidth=".5" />
        <path d="M71 6.5C77 3.5 82 2.4 86 2c-5 5-9 8-13 11Z" fill="#1f1f1f" />
      </g>
    </svg>
  );
}

// Kawanan bangau melintas (beberapa ekor dengan jarak & ukuran berbeda)
export function KawananBangau({ className = "", d = 32, jeda = 0, n = 3 }: { className?: string; d?: number; jeda?: number; n?: number }) {
  return (
    <div className={`${s.melintas} pointer-events-none absolute left-0 w-[34%] ${className}`} style={{ "--d": `${d}s`, "--j": `${jeda}s` } as CSSProperties} aria-hidden="true">
      <div className="relative aspect-[2/1]">
        {Array.from({ length: n }, (_, i) => (
          <Bangau
            key={i}
            className="absolute"
            jeda={b2(-rnd(i + 4) * 0.9)}
            style={{ left: `${b2(i * 26 + rnd(i + 2) * 8)}%`, top: `${b2(rnd(i + 12) * 50)}%`, width: `${b2(34 + rnd(i + 7) * 18)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ───────── Awan keberuntungan (xiangyun) ───────── */

export function Awan({ className = "", style, warna = "#fffaf0", garis = EMAS }: { className?: string; style?: CSSProperties; warna?: string; garis?: string }) {
  return (
    <svg viewBox="0 0 120 50" className={`pointer-events-none overflow-visible ${className}`} style={style} aria-hidden="true">
      <path d="M12 40c-7 0-9-9-2-11 0-10 13-14 19-6 3-12 22-14 27-3 6-8 21-5 21 6 4-4 13-2 13 5 9-1 11 9 4 9Z" fill={warna} stroke={garis} strokeWidth="1.4" strokeLinejoin="round" />
      <g fill="none" stroke={garis} strokeWidth="1.2" strokeLinecap="round">
        <path d="M26 36c0-5 7-5 7 0 0 2.5-3.5 2.5-3.5 0" />
        <path d="M51 33c0-6 9-6 9 0 0 3-4.5 3-4.5 0" />
        <path d="M78 36c0-4 6-4 6 0 0 2-3 2-3 0" />
      </g>
    </svg>
  );
}

/* ───────── Bingkai jendela bulan ───────── */

// Foto bundar dalam bingkai jendela bulan: cincin kayu merah, garis emas, kisi meander di sekeliling
// singkap: detik mulai foto tersingkap melingkar dari tengah (false = belum, tanpa prop = langsung tampil)
export function JendelaBulan({
  src,
  alt,
  sizes,
  className = "",
  posisi = "50% 30%",
  preload,
  singkap,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  posisi?: string;
  preload?: boolean;
  singkap?: number | false;
}) {
  const animasi = singkap !== undefined;
  const id = useId().replace(/:/g, "");
  return (
    <div className={`relative aspect-square ${className}`}>
      <div className="absolute inset-[9%] overflow-hidden rounded-full bg-[#f8efdc]">
        <motion.div
          className="absolute inset-0"
          initial={animasi ? { clipPath: "circle(0% at 50% 50%)" } : false}
          animate={animasi && singkap !== false ? { clipPath: "circle(71% at 50% 50%)" } : undefined}
          transition={{ duration: 1.4, ease: [0.5, 0, 0.3, 1], delay: singkap || 0 }}
        >
          <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
            <Image src={src} alt={alt} fill sizes={sizes} preload={preload} loading={preload ? "eager" : undefined} className="object-cover" style={{ objectPosition: posisi }} />
          </div>
        </motion.div>
      </div>
      <svg viewBox="-110 -110 220 220" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_14px_18px_rgb(60_15_10/0.3)]" aria-hidden="true">
        <DefsEmas id={`jb${id}`} />
        <circle r="96" fill="none" stroke="#9e1c22" strokeWidth="16" />
        <circle r="104" fill="none" stroke={`url(#jb${id})`} strokeWidth="2.4" />
        <circle r="88" fill="none" stroke={`url(#jb${id})`} strokeWidth="2" />
        {/* kisi meander di cincin */}
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d="M-4 -99h8v5h-5v-2h2" fill="none" stroke="#f6dc94" strokeWidth="1.1" transform={`rotate(${i * 15})`} />
        ))}
        {/* awan kecil di empat penjuru */}
        {[45, 135, 225, 315].map((r) => (
          <g key={r} transform={`rotate(${r}) translate(0 -96)`}>
            <circle r="9" fill="#9e1c22" stroke={`url(#jb${id})`} strokeWidth="1.6" />
            <path d="M-4 1c0-4 5-4 5 0 0 2-2.5 2-2.5 0" fill="none" stroke="#f6dc94" strokeWidth="1.2" strokeLinecap="round" transform="rotate(-45)" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ───────── Kelopak jatuh & kerlip ───────── */

export function KelopakJatuh({ n = 8 }: { n?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className={`${s.kelopak} absolute top-0`}
          style={
            {
              left: `${(rnd(i + 3) * 92).toFixed(1)}%`,
              "--x": `${Math.round((rnd(i + 9) - 0.3) * 110)}px`,
              "--d": `${(14 + rnd(i + 11) * 10).toFixed(1)}s`,
              animationDelay: `${(-rnd(i + 13) * 22).toFixed(1)}s`,
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 20 24" style={{ width: `${(9 + rnd(i + 7) * 8).toFixed(1)}px` }}>
            <path d="M10 1C16 4 19 11 17 17s-7 7-7 7-6-1-8-7S4 4 10 1Z" fill={i % 3 === 0 ? "#f6c9c4" : i % 3 === 1 ? "#e57a7f" : "#c8363c"} />
          </svg>
        </span>
      ))}
    </div>
  );
}

// Kilau emas berbentuk bintang empat yang berkelip
export function Kerlip({ className = "", jeda = 0, d = 2.4 }: { className?: string; jeda?: number; d?: number }) {
  return (
    <svg viewBox="-10 -10 20 20" className={`${s.kerlip} pointer-events-none absolute ${className}`} style={{ "--j": `${jeda}s`, "--d": `${d}s` } as CSSProperties} aria-hidden="true">
      <path d="M0-10C1-3 3-1 10 0 3 1 1 3 0 10-1 3-3 1-10 0-3-1-1-3 0-10Z" fill="#f6dc94" />
    </svg>
  );
}

/* ───────── Pembatas & tepi ───────── */

// Garis tipis dengan 囍 kecil di tengah dalam belah ketupat
export function Pembatas({ className = "", terang = false }: { className?: string; terang?: boolean }) {
  const w = terang ? "#f6dc94" : MERAH;
  return (
    <svg viewBox="0 0 200 24" className={`mx-auto h-6 w-44 ${className}`} aria-hidden="true">
      <path d="M6 12h66M128 12h66" stroke={w} strokeWidth="1" strokeLinecap="round" opacity=".55" />
      <path d="M74 12h8M118 12h8" stroke={EMAS} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M100 0 112 12 100 24 88 12Z" fill={terang ? "#7d1418" : "#9e1c22"} stroke={EMAS} strokeWidth="1.2" />
      <g transform="translate(94.2 6.2) scale(.0625)">
        <path d={SHUANGXI} fill="none" stroke="#f6dc94" strokeWidth="22" />
      </g>
    </svg>
  );
}

// Tepi genteng di puncak bagian: ujung genteng bundar berjajar, warnanya sama dengan bagiannya
export function Genteng({ warna }: { warna: string }) {
  const enc = encodeURIComponent(warna);
  return (
    <div
      className={`${s.genteng} pointer-events-none absolute inset-x-0 top-0 h-[15px] -translate-y-[14px]`}
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='15'><path d='M0 15V9A13 9 0 0 1 26 9V15Z' fill='${enc}'/><circle cx='13' cy='9' r='4.2' fill='none' stroke='%23c99a3e' stroke-width='1'/><circle cx='13' cy='9' r='1.4' fill='%23c99a3e'/></svg>")`,
      }}
      aria-hidden="true"
    />
  );
}

// Pita meander emas mendatar
export function PitaMeander({ className = "" }: { className?: string }) {
  return <div className={`${s.huiwen} pointer-events-none h-4 ${className}`} aria-hidden="true" />;
}
