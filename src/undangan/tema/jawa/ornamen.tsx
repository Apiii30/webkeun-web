"use client";

import { motion } from "motion/react";
import Image, { getImageProps } from "next/image";
import { type CSSProperties, type ReactNode, useId } from "react";
import { ASET, type Kembang } from "./aset";
import s from "./jawa.module.css";

// Ornamen khas Jawa yang digambar sendiri (gunungan wayang, janur melengkung, bingkai kori, kembang kawung)
// dan lapisan lanskap (langit, gunung, bukit, kabut, rumput) yang dipakai sampul, beranda, penutup & panel layar lebar.
// Gerakan terus-menerusnya CSS (transform/opacity) di jawa.module.css.

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const v = (o: Record<string, string | number>) => o as CSSProperties;

const EMAS_TUA = "#8d6a35";
const HIJAU_TUA = "#34493b";

/* ───────── Gunungan (kayon): pembuka & penutup lakon wayang ───────── */

const GUNUNGAN =
  "M100 2 C108 22 120 42 134 62 C150 84 170 104 182 128 C194 152 196 178 190 202 C186 218 184 232 184 248 L184 262 L16 262 L16 248 C16 232 14 218 10 202 C4 178 6 152 18 128 C30 104 50 84 66 62 C80 42 92 22 100 2 Z";
const skala = (k: number) => `translate(100 140) scale(${k}) translate(-100 -140)`;

// Cabang pohon hayat: ikal di ujung, daun kecil di sepanjangnya. Separuh kiri; kanan dicerminkan.
const CABANG = [
  { y: 206, w: 64 },
  { y: 176, w: 68 },
  { y: 146, w: 62 },
  { y: 118, w: 52 },
  { y: 92, w: 38 },
  { y: 70, w: 24 },
].map(({ y, w }) => ({
  d: `M100 ${y} C${100 - w * 0.4} ${y - 2} ${100 - w * 0.9} ${y - 6} ${100 - w} ${y - 20} C${100 - w * 1.05} ${y - 30} ${100 - w * 0.7} ${y - 34} ${100 - w * 0.62} ${y - 26} C${100 - w * 0.56} ${y - 20} ${100 - w * 0.7} ${y - 14} ${100 - w * 0.78} ${y - 19}`,
  daun: [
    [100 - w * 0.45, y - 4, -60],
    [100 - w * 0.8, y - 8, -30],
    [100 - w * 0.98, y - 30, 20],
  ] as const,
}));

// foto: diisi foto mempelai di bagian dalam (pohon hayat tidak digambar). Ukuran mengikuti lebar pembungkus (2:3).
// Foto dipotong dengan clipPath SVG, bukan CSS mask: di Safari, elemen ber-mask di dalam transform 3D (gunungan
// diputar saat sampul dibuka) memunculkan garis kotak tipis di tepinya.
export function Gunungan({ className = "", foto, alt = "", children }: { className?: string; foto?: string; alt?: string; children?: ReactNode }) {
  const id = useId();
  const img = foto ? getImageProps({ src: foto, alt, width: 260, height: 350 }).props : null;
  return (
    <div className={`relative aspect-[2/3] ${className}`} role={foto ? "img" : undefined} aria-label={foto ? alt : undefined}>
      <svg viewBox="0 0 200 300" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}e`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3e2ae" />
            <stop offset=".45" stopColor="#c9a35f" />
            <stop offset="1" stopColor="#8d6a35" />
          </linearGradient>
          <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4d6a55" />
            <stop offset="1" stopColor="#2c3d31" />
          </linearGradient>
        </defs>
        <path d={GUNUNGAN} fill={`url(#${id}e)`} stroke={EMAS_TUA} strokeWidth="1.2" />
        <path d={GUNUNGAN} transform={skala(0.93)} fill={`url(#${id}h)`} />
        <path d={GUNUNGAN} transform={skala(0.9)} fill="none" stroke="#e8d39b" strokeWidth=".8" strokeDasharray="2 3" opacity=".7" />
        {img && (
          <>
            <clipPath id={`${id}c`}>
              <path d={GUNUNGAN} transform={skala(0.86)} />
            </clipPath>
            <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
              <stop offset=".62" stopColor="#2c3d31" stopOpacity="0" />
              <stop offset="1" stopColor="#2c3d31" stopOpacity=".7" />
            </linearGradient>
            <g clipPath={`url(#${id}c)`}>
              <rect x="14" y="18" width="172" height="232" fill="#dfe5d8" />
              <image href={img.src} x="14" y="18" width="172" height="232" preserveAspectRatio="xMidYMin slice" />
              <rect x="14" y="18" width="172" height="232" fill={`url(#${id}g)`} />
            </g>
          </>
        )}
        {!foto && (
          <g fill="none" stroke="#e3c98a" strokeLinecap="round" strokeLinejoin="round">
            <path d="M100 240 C97 204 103 172 99 140 C96 110 102 80 100 44" strokeWidth="3" />
            {[false, true].map((cermin) => (
              <g key={String(cermin)} transform={cermin ? "translate(200 0) scale(-1 1)" : undefined}>
                {CABANG.map((c) => (
                  <g key={c.d}>
                    <path d={c.d} strokeWidth="1.6" />
                    {c.daun.map(([x, y, r]) => (
                      <ellipse key={`${x}${y}`} cx={x} cy={y} rx="2.2" ry="5" transform={`rotate(${r} ${x} ${y})`} fill="#c9a35f" stroke="none" />
                    ))}
                  </g>
                ))}
              </g>
            ))}
            <circle cx="100" cy="38" r="4" fill="#e3c98a" stroke="none" />
            <path d="M100 30 C96 22 98 14 100 10 C102 14 104 22 100 30 Z" fill="#c9a35f" stroke="none" />
          </g>
        )}
      </svg>

      {/* garis dalam, gapura & palemahan di depan foto */}
      <svg viewBox="0 0 200 300" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <path d={GUNUNGAN} transform={skala(0.86)} fill="none" stroke="#e8d39b" strokeWidth="1.4" />
        <g stroke={EMAS_TUA} strokeWidth="1" strokeLinejoin="round">
          <path d="M100 186 L109 198 H91 Z" fill="#e3c98a" />
          <path d="M88 198 H112 L118 208 H82 Z" fill="#c9a35f" />
          <path d="M78 208 H122 L128 220 H72 Z" fill="#c9a35f" />
          <rect x="80" y="220" width="40" height="42" fill={HIJAU_TUA} />
          <path d="M91 262 V240 C91 232 109 232 109 240 V262 Z" fill="#1f2b22" />
          <path d="M100 236 V262" stroke="#c9a35f" />
          <rect x="66" y="232" width="8" height="30" fill="#c9a35f" />
          <rect x="126" y="232" width="8" height="30" fill="#c9a35f" />
          <path d="M64 232 H76 L70 224 Z M124 232 H136 L130 224 Z" fill="#e3c98a" />
          <path d="M8 262 H192 L184 282 H16 Z" fill="#c9a35f" />
        </g>
        <path d={Array.from({ length: 13 }, (_, i) => `M${22 + i * 12.5} 279 L${28.25 + i * 12.5} 266 L${34.5 + i * 12.5} 279`).join(" ")} fill="none" stroke={HIJAU_TUA} strokeWidth="1.1" />
        <rect x="97" y="282" width="6" height="18" rx="2" fill={EMAS_TUA} />
      </svg>
      {children}
    </div>
  );
}

/* ───────── Bingkai kori: lengkung berujung runcing seperti pintu keraton ───────── */

// Sama dengan .topengKori di jawa.module.css (foto = skala .94)
const KORI =
  "M150 4 C166 4 176 18 190 28 C204 38 224 38 234 52 C242 64 244 80 262 88 C280 96 296 100 296 118 V344 C296 356 290 362 278 364 C262 367 250 378 244 396 H56 C50 378 38 367 22 364 C10 362 4 356 4 344 V118 C4 100 20 96 38 88 C56 80 58 64 66 52 C76 38 96 38 110 28 C124 18 134 4 150 4 Z";

export function BingkaiKori({
  src,
  alt,
  className = "",
  sizes,
  preload,
  posisi = "50% 30%",
  fotoClass = "",
  terang = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  preload?: boolean;
  posisi?: string;
  fotoClass?: string;
  terang?: boolean; // garis lebih terang untuk latar hijau tua
}) {
  return (
    <div className={`relative aspect-[3/4] ${className}`}>
      <div className={`${s.topengKori} absolute inset-0 overflow-hidden bg-[#dfe5d8]`}>
        <div className={`absolute inset-x-0 inset-y-[-8%] ${fotoClass}`}>
          <Image src={src} alt={alt} fill preload={preload} sizes={sizes} className="object-cover" style={{ objectPosition: posisi }} />
        </div>
      </div>
      <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <path d={KORI} fill="none" stroke={terang ? "#e3c98a" : "#b08a4a"} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d={KORI} transform="translate(150 200) scale(.97) translate(-150 -200)" fill="none" stroke={terang ? "#e3c98a" : "#b08a4a"} strokeWidth="1" opacity=".6" vectorEffect="non-scaling-stroke" />
        <path d={KORI} transform="translate(150 200) scale(.9) translate(-150 -200)" fill="none" stroke="#f4f1e4" strokeWidth="1" strokeDasharray="3 4" opacity=".8" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/* ───────── Janur kuning melengkung: tanda ada hajat pernikahan ───────── */

const RUAS = [
  [19, 384],
  [18, 336],
  [19, 288],
  [21, 240],
  [24, 196],
  [29, 156],
  [37, 118],
  [49, 84],
  [65, 56],
  [85, 36],
  [105, 26],
] as const;

export function Janur({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`pointer-events-none ${className}`} style={style} aria-hidden="true">
      <svg viewBox="0 0 150 420" className={`${s.janur} h-full w-auto overflow-visible`}>
        <path d="M18 420 C16 300 18 190 30 120 C42 52 80 14 124 24" fill="none" stroke="#a8873f" strokeWidth="5" strokeLinecap="round" />
        <path d="M18 420 C16 300 18 190 30 120 C42 52 80 14 124 24" fill="none" stroke="#ead492" strokeWidth="1.6" strokeLinecap="round" />
        {RUAS.map(([x, y], i) => (
          <g key={i} fill="#dcc17a" stroke="#a8873f" strokeWidth=".8" strokeLinejoin="round">
            <path d={`M${x} ${y} Q${x + 10} ${y - 10} ${x + 24} ${y - 6} Q${x + 12} ${y - 1} ${x} ${y} Z`} />
            <path d={`M${x} ${y} Q${x - 9} ${y - 10} ${x - 20} ${y - 8} Q${x - 10} ${y - 2} ${x} ${y} Z`} />
          </g>
        ))}
        {/* rumbai yang menjuntai dari lengkungan */}
        {[
          [62, 58, 46, 0],
          [86, 38, 58, -0.8],
          [108, 28, 52, -1.6],
        ].map(([x, y, p, d]) => (
          <g key={x} className={s.rumbai} style={{ animationDelay: `${d}s` }}>
            {[-4, 0, 4].map((o) => (
              <path key={o} d={`M${x + o} ${y} C${x + o + 3} ${y + p * 0.35} ${x + o - 3} ${y + p * 0.7} ${x + o + 1} ${y + p}`} fill="none" stroke="#d2b46a" strokeWidth="1.6" strokeLinecap="round" />
            ))}
          </g>
        ))}
        <g className={s.rumbai} style={{ animationDelay: "-0.4s" }}>
          {[-6, -2, 2, 6].map((o, i) => (
            <path key={o} d={`M${124 + o} 24 C${127 + o} ${44 + i * 3} ${119 + o} ${66 + i * 4} ${125 + o} ${84 + i * 6}`} fill="none" stroke={i % 2 ? "#ead492" : "#c9a35f"} strokeWidth="2.2" strokeLinecap="round" />
          ))}
          <circle cx="124" cy="24" r="5" fill="#ead492" stroke="#a8873f" />
        </g>
      </svg>
    </div>
  );
}

/* ───────── Kembang kawung & pembatas ───────── */

export function KembangKawung({ className = "", warna = "#c9a35f" }: { className?: string; warna?: string }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} aria-hidden="true">
      {[45, 135, 225, 315].map((r) => (
        <ellipse key={r} cx="0" cy="-5.6" rx="3.4" ry="5.4" transform={`rotate(${r})`} fill="none" stroke={warna} strokeWidth="1.1" />
      ))}
      <circle r="1.6" fill={warna} />
    </svg>
  );
}

export function Pemisah({ className = "", terang = false }: { className?: string; terang?: boolean }) {
  const garis = terang ? "bg-[#e3c98a]/70" : "bg-[#b08a4a]/60";
  return (
    <div className={`flex items-center justify-center gap-2.5 ${className}`} aria-hidden="true">
      <span className={`h-px w-14 ${garis}`} />
      <span className={`size-1 rotate-45 ${terang ? "bg-[#e3c98a]" : "bg-[#b08a4a]"}`} />
      <KembangKawung className={`${s.putar} size-6`} warna={terang ? "#e3c98a" : "#b08a4a"} />
      <span className={`size-1 rotate-45 ${terang ? "bg-[#e3c98a]" : "bg-[#b08a4a]"}`} />
      <span className={`h-px w-14 ${garis}`} />
    </div>
  );
}

/* ───────── Tepi bagian: siluet perbukitan dua lapis ───────── */

export function Tepi({ warna, className = "" }: { warna: string; className?: string }) {
  return (
    <svg viewBox="0 0 440 40" preserveAspectRatio="none" className={`pointer-events-none block h-10 w-full ${className}`} aria-hidden="true">
      <path d="M0 40 V24 C40 14 70 6 110 12 C150 18 170 2 210 4 C250 6 270 20 310 18 C350 16 380 6 440 14 V40 Z" fill={warna} opacity=".45" />
      <path d="M0 40 V30 C50 22 90 20 130 26 C170 32 200 18 250 20 C300 22 330 34 380 30 C410 28 430 24 440 26 V40 Z" fill={warna} />
    </svg>
  );
}

/* ───────── Lanskap: langit, matahari, gunung, bukit, kabut, rumput ───────── */

export function Langit({ senja = false, className = "" }: { senja?: boolean; className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      <div className={`${s.langit} absolute inset-0`} />
      {senja && <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#e9d6c8_0%,#efd9c9_40%,#d9c2b4_70%,transparent_100%)] opacity-80" />}
    </div>
  );
}

export function Matahari({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className={`${s.matahari} relative aspect-square w-full`}>
        <div className="absolute -inset-[70%] rounded-full bg-[radial-gradient(circle,rgb(247_236_204/0.85)_0%,rgb(247_236_204/0.35)_35%,transparent_68%)]" />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_35%,#fbf3da,#efd9a2)]" />
      </div>
    </div>
  );
}

// Litografi Gunung Sumbing (tinta transparan), pudar di bagian atas supaya melebur ke langit
export function Gunung({ className = "", posisi = "48% 100%", preload, sizes = "100vw" }: { className?: string; posisi?: string; preload?: boolean; sizes?: string }) {
  return (
    <div className={`pointer-events-none absolute [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%)] ${className}`} aria-hidden="true">
      <Image src={ASET.gunung.src} alt="" fill preload={preload} loading={preload ? "eager" : undefined} sizes={sizes} className="object-cover" style={{ objectPosition: posisi }} />
    </div>
  );
}

// Pohon kelapa: batang melengkung, pelepah berbentuk daun panjang
function Kelapa({ x, y, h, condong = 1 }: { x: number; y: number; h: number; condong?: number }) {
  const cx = x + 10 * condong;
  const cy = y - h;
  return (
    <g>
      <path d={`M${x} ${y} C${x + 1 * condong} ${y - h * 0.4} ${x + 5 * condong} ${y - h * 0.75} ${cx} ${cy}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {[-160, -125, -95, -60, -25, 10, 185].map((a, i) => {
        const r = (a * Math.PI) / 180;
        const L = 22 + (i % 3) * 4;
        const ex = cx + L * Math.cos(r);
        const ey = cy + L * Math.sin(r) + 9;
        const qx = cx + L * 0.55 * Math.cos(r);
        const qy = cy + L * 0.55 * Math.sin(r) - 5;
        return <path key={a} d={`M${cx} ${cy} Q${qx} ${qy - 3} ${ex} ${ey} Q${qx} ${qy + 3} ${cx} ${cy} Z`} fill="currentColor" />;
      })}
    </g>
  );
}

// Pohon kelapa di punggung bukit tengah: x = posisi (% lebar), h = tinggi (% tinggi bukit)
const KELAPA = [
  { x: 14, h: 68, c: 1 },
  { x: 19, h: 52, c: -1 },
  { x: 85, h: 72, c: -1 },
];

// lapis tengah: bukit sage pucat dengan pohon kelapa; lapis depan: bukit lebih gelap.
// Bukit direntang mengikuti lebar layar (preserveAspectRatio none); kelapa digambar terpisah supaya tidak ikut melar.
export function Bukit({ lapis, className = "" }: { lapis: "tengah" | "depan"; className?: string }) {
  if (lapis === "tengah") {
    return (
      <div className={`pointer-events-none absolute text-[#9fb39a] ${className}`} aria-hidden="true">
        {KELAPA.map((k) => (
          <svg key={k.x} viewBox="-45 -95 95 97" className="absolute -translate-x-1/2 overflow-visible" style={{ left: `${k.x}%`, bottom: "34%", height: `${k.h}%` }}>
            <Kelapa x={0} y={0} h={60} condong={k.c} />
          </svg>
        ))}
        <svg viewBox="0 0 440 160" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M0 108 C40 92 80 86 120 96 C160 106 190 80 240 78 C290 76 320 100 360 94 C400 88 420 84 440 88 V160 H0 Z" fill="currentColor" />
        </svg>
      </div>
    );
  }
  return (
    <svg viewBox="0 0 440 120" preserveAspectRatio="none" className={`pointer-events-none absolute w-full text-[#71876f] ${className}`} aria-hidden="true">
      <path d="M0 52 C50 34 100 32 150 44 C200 56 250 30 300 32 C350 34 400 50 440 42 V120 H0 Z" fill="currentColor" />
      <path d="M0 52 C50 34 100 32 150 44 C200 56 250 30 300 32 C350 34 400 50 440 42" fill="none" stroke="#5c7360" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// Rumpun rumput: tiga kelompok helai yang condong bergantian tertiup angin. Satu petak selebar 440px diulang
// ke samping, jadi kerapatan helainya sama di HP maupun layar lebar.
const HELAI = Array.from({ length: 54 }, (_, i) => {
  const x = i * 8.2 + rnd(i) * 6;
  const h = 18 + rnd(i + 40) * 34;
  const b = (rnd(i + 80) - 0.5) * 22;
  return { d: `M${x.toFixed(1)} 60 Q${(x + b * 0.25).toFixed(1)} ${(60 - h * 0.6).toFixed(1)} ${(x + b).toFixed(1)} ${(60 - h).toFixed(1)}`, k: i % 3 };
});
const WARNA_RUMPUT = ["#5f7a63", "#87a083", "#a9bca3"];
const PETAK = HELAI.reduce<string[]>((a, h) => ((a[h.k] = `${a[h.k] ?? ""} ${h.d}`), a), []);

export function Rumput({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute flex justify-center overflow-x-clip ${className}`} aria-hidden="true">
      {Array.from({ length: 6 }, (_, n) => (
        <svg key={n} viewBox="0 0 440 60" preserveAspectRatio="none" className="h-full w-[440px] shrink-0 overflow-visible">
          {PETAK.map((d, k) => (
            <g key={k} className={s.angin} style={{ animationDelay: `${-k * 1.7 - n * 0.6}s`, animationDuration: `${4.5 + k * 1.2}s` }}>
              <path d={d} fill="none" stroke={WARNA_RUMPUT[k]} strokeWidth="1.6" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      ))}
    </div>
  );
}

// Kabut tipis selebar dua layar yang berarak pelan
export function Kabut({ className = "", balik = false }: { className?: string; balik?: boolean }) {
  return (
    <div className={`pointer-events-none absolute -left-1/2 w-[200%] ${balik ? s.kabutBalik : s.kabut} ${className}`} aria-hidden="true">
      <div className="h-full w-full bg-[radial-gradient(22%_55%_at_18%_60%,rgb(248_249_243/0.85),transparent_70%),radial-gradient(18%_45%_at_42%_45%,rgb(248_249_243/0.7),transparent_70%),radial-gradient(24%_55%_at_68%_60%,rgb(248_249_243/0.8),transparent_70%),radial-gradient(16%_40%_at_90%_50%,rgb(248_249_243/0.7),transparent_70%)]" />
    </div>
  );
}

// Tiga burung terbang beriringan
export function Burung({ className = "", delay = 0, size = 22 }: { className?: string; delay?: number; size?: number }) {
  return (
    <div className={`${s.burung} pointer-events-none absolute ${className}`} style={{ animationDelay: `${delay}s` }} aria-hidden="true">
      {[
        [0, 0, 1],
        [-22, 10, 0.75],
        [-10, -14, 0.6],
      ].map(([x, y, k], i) => (
        <svg key={i} viewBox="0 0 24 10" className="absolute" style={{ width: size * k, left: x, top: y }}>
          <g className={s.kepak} style={{ animationDelay: `${-i * 0.23}s` }}>
            <path d="M1 6 Q6 0 12 6 Q18 0 23 6" fill="none" stroke="#4e6452" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      ))}
    </div>
  );
}

/* ───────── Kelopak bunga & kuncup melati yang jatuh pelan ───────── */

export function KelopakJatuh({ n = 8, className = "" }: { n?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const melati = i % 3 === 0;
        return (
          <span
            key={i}
            className={`${s.kelopak} absolute top-0`}
            style={v({
              left: `${(rnd(i + 3) * 92).toFixed(1)}%`,
              "--x": `${Math.round((rnd(i + 9) - 0.3) * 110)}px`,
              "--d": `${(13 + rnd(i + 11) * 11).toFixed(1)}s`,
              animationDelay: `${(-rnd(i + 13) * 24).toFixed(1)}s`,
            })}
          >
            {melati ? (
              <svg viewBox="0 0 20 20" style={{ width: `${(9 + rnd(i + 7) * 6).toFixed(1)}px` }}>
                {[0, 72, 144, 216, 288].map((r) => (
                  <ellipse key={r} cx="10" cy="5" rx="3.2" ry="5" fill="#fffdf6" stroke="#d6d9cb" strokeWidth=".5" transform={`rotate(${r} 10 10)`} />
                ))}
                <circle cx="10" cy="10" r="2" fill="#efe2b8" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 16" style={{ width: `${(7 + rnd(i + 7) * 6).toFixed(1)}px` }}>
                <path d="M6 1 C11 4 11 11 6 15 C1 11 1 4 6 1 Z" fill={i % 2 ? "#dcaaa6" : "#e8c4bd"} stroke="#c08883" strokeWidth=".5" />
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
}

/* ───────── Rumpun bunga dari ilustrasi botani ───────── */

// Saat pertama terlihat, tiap tanaman tumbuh dari pangkalnya. Gerak masuknya memakai `transform` utuh supaya
// dijalankan mesin animasi browser (bukan dihitung JavaScript tiap frame), lalu bergoyang pelan dengan CSS.
// tampil: dikendalikan dari luar (mis. baru tumbuh setelah undangan dibuka) alih-alih saat terlihat.
export function Rumpun({ items, className = "", muncul = true, jeda = 0, tampil, lebar = 440 }: { items: Kembang[]; className?: string; muncul?: boolean; jeda?: number; tampil?: boolean; lebar?: number }) {
  const pemicu = tampil === undefined ? { whileInView: "show", viewport: { once: true, amount: 0.05 } } : { animate: tampil ? "show" : "hidden" };
  return (
    <motion.div className={`pointer-events-none absolute ${className}`} aria-hidden="true" initial={muncul ? "hidden" : false} {...pemicu}>
      {items.map((t, i) => {
        const a = ASET[t.a];
        return (
          <div key={i} className="absolute" style={{ left: `${t.x}%`, bottom: `${t.b}%`, width: `${t.w}%`, zIndex: t.z ?? 0, rotate: `${t.r ?? 0}deg` }}>
            <motion.div
              style={{ transformOrigin: "50% 100%" }}
              variants={{
                hidden: { opacity: 0, transform: `scale(0.55, 0.3) rotate(${i % 2 ? 12 : -12}deg)` },
                show: { opacity: 1, transform: "scale(1, 1) rotate(0deg)", transition: { duration: 1.3, ease: [0.22, 1.2, 0.36, 1], delay: jeda + i * 0.09 } },
              }}
            >
              <div className={s.goyang} style={{ animationDelay: `${-i * 1.7}s`, animationDuration: `${6 + (i % 3) * 1.5}s` }}>
                <Image src={a.src} alt="" width={a.w} height={a.h} sizes={`${Math.round((t.w * lebar) / 100)}px`} className={`h-auto w-full ${t.flip ? "-scale-x-100" : ""}`} />
              </div>
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ───────── Aksara Jawa ───────── */

// Teks hiasan dalam aksara Jawa (Unicode), selalu disertai teks Latin di dekatnya untuk pembaca.
export function Aksara({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p lang="jv" className={`font-[family-name:var(--font-aksara-jawa)] ${className}`} aria-hidden="true">
      {children}
    </p>
  );
}
