"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { type CSSProperties, type ReactNode, useId } from "react";
import { tepiPudar } from "../../tepi";
import { ASET, LENGKUNG, type NamaAset, maskerLengkung, maskerMihrab } from "./aset";
import s from "./sakinah.module.css";

// Ornamen tema Putih Sakinah: lengkung mihrab bertepi emas, lentera kuningan, untaian melati (ronce), bintang delapan,
// merpati emas, kuntum melati jatuh. Gerak masuk memakai `transform` utuh + opacity (dijalankan mesin animasi
// browser di GPU).

export const naskah = "font-[family-name:var(--font-corinthia)] font-bold"; // Corinthia
export const marcellus = "font-[family-name:var(--font-marcellus)]"; // Marcellus
export const arab = "font-[family-name:var(--font-amiri)]"; // Amiri Quran
export const HALUS = [0.22, 1, 0.36, 1] as const;

export const ZAMRUD = "#0f3a31";
export const TINTA = "#1d3d34";
export const EMAS = "#b8955a";

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
// angka dibulatkan: hasil sin/cos bisa beda di digit terakhir antara server & browser (hydration mismatch)
const b2 = (n: number) => Math.round(n * 100) / 100;

// Muncul saat terlihat: naik pelan (default), membesar, berputar, atau dari samping
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

/* ───────── Gradien emas ───────── */

export function DefsEmas({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8f6d34" />
        <stop offset=".35" stopColor="#f1e2b8" />
        <stop offset=".6" stopColor="#a98544" />
        <stop offset=".82" stopColor="#f6ebc8" />
        <stop offset="1" stopColor="#8f6d34" />
      </linearGradient>
    </defs>
  );
}

export const gradienEmas = "bg-[linear-gradient(135deg,#8f6d34,#f1e2b8_35%,#a98544_60%,#f6ebc8_82%,#8f6d34)]";

/* ───────── Bintang delapan (khatam) ───────── */

// Dua persegi bertumpuk (satu diputar 45°) di kotak -1..1
export const BINTANG8 = "M-.7071 -.7071H.7071V.7071H-.7071ZM0 -1 1 0 0 1 -1 0Z";
// Garis luar bintang delapan sebagai satu bentuk (16 titik), jari-jari luar 1
export const garisBintang = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 0.765 : 1;
    pts.push(`${b2(Math.cos(a) * r * 100) / 100} ${b2(Math.sin(a) * r * 100) / 100}`);
  }
  return `M${pts.join("L")}Z`;
})();

export function Bintang({ className = "", warna = EMAS, isi = "none", tebal = 0.06 }: { className?: string; warna?: string; isi?: string; tebal?: number }) {
  return (
    <svg viewBox="-1.1 -1.1 2.2 2.2" className={className} aria-hidden="true">
      <path d={garisBintang} fill={isi} stroke={warna} strokeWidth={tebal} strokeLinejoin="round" />
      <circle r=".28" fill="none" stroke={warna} strokeWidth={tebal * 0.8} />
    </svg>
  );
}

/* ───────── Lentera kuningan ───────── */

// Lentera bergaya Timur Tengah: kubah emas, badan segi enam berkaca hangat dengan kisi lengkung, berayun di rantainya.
// rantai: panjang rantai (CSS), lebar mengikuti pembungkus.
export function Lentera({ className = "", rantai = "4rem", d = 5, a = 2.4, jeda = 0, redup = false }: { className?: string; rantai?: string; d?: number; a?: number; jeda?: number; redup?: boolean }) {
  const id = useId().replace(/:/g, "");
  const emas = `url(#le${id})`;
  return (
    <div className={`pointer-events-none absolute top-0 ${className}`} aria-hidden="true">
      <div className={s.lentera} style={{ "--d": `${d}s`, "--a": `${a}deg`, animationDelay: `${jeda}s` } as CSSProperties}>
        <div className="mx-auto w-[3px] bg-[repeating-linear-gradient(180deg,#a98544_0_5px,#f1e2b8_5px_7px,#a98544_7px_9px,transparent_9px_11px)]" style={{ height: rantai }} />
        <div className="relative">
          {/* cahaya hangat di sekeliling lentera */}
          <div
            className={`${s.nyala} absolute top-[22%] left-1/2 aspect-square w-[260%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_226_160/0.55),rgb(255_226_160/0.18)_45%,transparent)] ${redup ? "opacity-60" : ""}`}
          />
          <svg viewBox="0 0 60 150" className="relative w-full overflow-visible">
            <DefsEmas id={`le${id}`} />
            <defs>
              <radialGradient id={`ka${id}`} cx=".5" cy=".55" r=".6">
                <stop offset="0" stopColor="#fffaf0" />
                <stop offset=".55" stopColor="#ffe6aa" />
                <stop offset="1" stopColor="#e9b55c" />
              </radialGradient>
            </defs>
            {/* cincin gantungan, bulan sabit & bola */}
            <circle cx="30" cy="3" r="2.6" fill="none" stroke={emas} strokeWidth="1.4" />
            <path d="M30 6V12" stroke={emas} strokeWidth="1.6" />
            <circle cx="30" cy="14" r="2.4" fill={emas} />
            {/* kubah */}
            <path d="M12 42C12 30 22 20 30 17 38 20 48 30 48 42Z" fill={emas} />
            <path d="M16 40C17 31 24 24 30 21" fill="none" stroke="#fff6dc" strokeWidth="1" opacity=".7" />
            <path d="M9 42H51L49 47H11Z" fill={emas} />
            {/* badan kaca segi enam */}
            <path d="M11 47H49L54 76 49 106H11L6 76Z" fill={`url(#ka${id})`} />
            {/* kisi lengkung di kaca */}
            <g fill="none" stroke={emas} strokeWidth="1.3">
              <path d="M11 47H49L54 76 49 106H11L6 76Z" strokeWidth="2.2" />
              <path d="M22 106V64C22 56 26 52 30 49 34 52 38 56 38 64V106" />
              <path d="M11 106V70C11 62 14 57 16 54M49 106V70C49 62 46 57 44 54" />
              <path d="M6 76H54" strokeWidth=".9" />
              <path d="M30 80 34 84 30 88 26 84Z" fill={emas} stroke="none" />
            </g>
            {/* kaki & jumbai */}
            <path d="M11 106H49L44 112H16Z" fill={emas} />
            <path d="M18 112H42L33 124H27Z" fill={emas} />
            <circle cx="30" cy="128" r="3" fill={emas} />
            <path d="M30 131V146" stroke={emas} strokeWidth="1.2" />
            <path d="M30 140 27 148M30 140 33 148M30 140V149" stroke={emas} strokeWidth=".8" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ───────── Ronce melati ───────── */

// Untaian kuncup melati yang menjuntai, diselingi manik emas, berujung kuntum mekar & jumbai.
export function Ronce({ className = "", n = 16, jeda = 0 }: { className?: string; n?: number; jeda?: number }) {
  const tinggi = n * 12 + 30;
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className={s.ronce} style={{ animationDelay: `${jeda}s` }}>
        <svg viewBox={`0 0 20 ${tinggi}`} className="w-full overflow-visible drop-shadow-[0_2px_2px_rgb(60_50_20/0.25)]">
          <path d={`M10 0V${tinggi - 22}`} stroke="#c9b27a" strokeWidth=".6" />
          {Array.from({ length: n }, (_, i) => {
            const y = 6 + i * 12;
            if (i % 5 === 4) return <circle key={i} cx="10" cy={y} r="2.1" fill="#d9bd7c" stroke="#a98544" strokeWidth=".5" />;
            const m = i % 2 ? 14 : -14;
            return (
              <g key={i} transform={`translate(10 ${y}) rotate(${m})`}>
                <ellipse rx="3.1" ry="5.4" fill="#fffdf6" stroke="#d8d2bd" strokeWidth=".5" />
                <path d="M-1.6 3.6Q0 6.5 1.6 3.6" fill="#8aa37a" />
              </g>
            );
          })}
          {/* kuntum mekar di ujung */}
          <g transform={`translate(10 ${tinggi - 18})`}>
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} cx="0" cy="-4.2" rx="2.8" ry="4.4" fill="#fffdf6" stroke="#d8d2bd" strokeWidth=".45" transform={`rotate(${r})`} />
            ))}
            <circle r="1.5" fill="#e8d59a" />
            <path d="M0 6V16M0 7-3 15M0 7 3 15" stroke="#b8955a" strokeWidth=".6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ───────── Merpati emas ───────── */

export function Kawanan({ className = "", jeda = 0, warna = "#a98544", n = 7 }: { className?: string; jeda?: number; warna?: string; n?: number }) {
  return (
    <div className={`${s.kawanan} pointer-events-none absolute w-[42%] ${className}`} style={{ animationDelay: `${jeda}s` }} aria-hidden="true">
      <div className="relative aspect-[3/1]">
        {Array.from({ length: n }, (_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 8"
            className={`${s.kepak} absolute`}
            style={{ left: `${b2(rnd(i + 4) * 86)}%`, top: `${b2(rnd(i + 23) * 70)}%`, width: `${b2(8 + rnd(i + 6) * 8)}%`, animationDelay: `${b2(-rnd(i + 8) * 0.4)}s` }}
          >
            <path d="M0 6Q5 0 10 5 15 0 20 6" fill="none" stroke={warna} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ))}
      </div>
    </div>
  );
}

// Kuntum melati kecil yang jatuh berputar
export function MelatiJatuh({ n = 7 }: { n?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-clip" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className={`${s.kelopak} absolute top-0`}
          style={
            {
              left: `${(rnd(i + 3) * 92).toFixed(1)}%`,
              "--x": `${Math.round((rnd(i + 9) - 0.3) * 110)}px`,
              "--d": `${(15 + rnd(i + 11) * 10).toFixed(1)}s`,
              animationDelay: `${(-rnd(i + 13) * 22).toFixed(1)}s`,
            } as CSSProperties
          }
        >
          <svg viewBox="-6 -6 12 12" style={{ width: `${(10 + rnd(i + 7) * 7).toFixed(1)}px` }} className="drop-shadow-[0_1px_1px_rgb(60_50_20/0.25)]">
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} cy="-2.6" rx="1.8" ry="2.8" fill="#fffdf6" stroke="#ddd6c0" strokeWidth=".3" transform={`rotate(${r})`} />
            ))}
            <circle r=".9" fill="#e8d59a" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/* ───────── Bingkai lengkung mihrab ───────── */

// Bulan sabit & bintang di puncak lengkung (koordinat puncak di 0,0)
function Puncak({ emas, y, id }: { emas: string; y: number; id: string }) {
  return (
    <g transform={`translate(150 ${y})`}>
      <mask id={id}>
        <rect x="-20" y="-50" width="40" height="40" fill="#fff" />
        <circle cy="-33" r="7.6" fill="#000" />
      </mask>
      <path d="M0 -4V-13" stroke={emas} strokeWidth="2" />
      <circle cy="-15" r="3" fill={emas} />
      <circle cy="-29" r="9" fill={emas} mask={`url(#${id})`} />
    </g>
  );
}

// Tepi bingkai bertingkat untuk lubang LENGKUNG (300 × 420): pita marmer, garis emas, pita zamrud, garis emas
// bertitik. Kotak gambarnya lebih besar 24 satuan di tiap sisi (viewBox -24 -24 348 468).
export function TepiLengkung({ className = "", style, sabit = true, tipis = false }: { className?: string; style?: CSSProperties; sabit?: boolean; tipis?: boolean }) {
  const id = useId().replace(/:/g, "");
  const emas = `url(#tl${id})`;
  const skala = (k: number) => `translate(150 210) scale(${k}) translate(-150 -210)`;
  return (
    <svg viewBox="-24 -24 348 468" className={`pointer-events-none absolute overflow-visible ${className}`} style={style} aria-hidden="true">
      <DefsEmas id={`tl${id}`} />
      {!tipis && <path d={LENGKUNG} fill="none" stroke="#fdfcf8" strokeWidth="30" strokeLinejoin="round" style={{ filter: "drop-shadow(0 10px 14px rgb(40 50 40 / 0.22))" }} />}
      <path d={LENGKUNG} fill="none" stroke={emas} strokeWidth={tipis ? 2.4 : 3.6} strokeLinejoin="round" />
      {!tipis && <path d={LENGKUNG} fill="none" stroke={ZAMRUD} strokeWidth="1.4" strokeLinejoin="round" transform={skala(1.055)} />}
      <path d={LENGKUNG} fill="none" stroke={emas} strokeWidth="1" strokeDasharray="1.5 4" strokeLinecap="round" strokeLinejoin="round" transform={skala(tipis ? 1.04 : 1.085)} />
      <path d={LENGKUNG} fill="none" stroke={emas} strokeWidth="1.1" strokeLinejoin="round" transform={skala(0.955)} />
      {sabit && <Puncak emas={emas} y={tipis ? -8 : -16} id={`ts${id}`} />}
      {/* bintang kecil di titik pangkal lengkung */}
      {!tipis &&
        [0, 300].map((x) => (
          <g key={x} transform={`translate(${x} 176) scale(9)`}>
            <path d={garisBintang} fill="#fdfcf8" stroke={emas} strokeWidth=".16" />
            <circle r=".3" fill={emas} />
          </g>
        ))}
    </svg>
  );
}

// Foto di dalam lengkung mihrab bertepi emas (rasio 300 : 420). pintu: detik saat dua daun pintu berkisi di depan
// foto berayun membuka (3D) dengan cahaya hangat dari baliknya (false = pintu masih tertutup, tanpa prop = tanpa pintu).
export function FotoLengkung({
  src,
  alt,
  sizes,
  className = "",
  posisi = "50% 30%",
  preload,
  tipis,
  sabit = true,
  pintu,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  posisi?: string;
  preload?: boolean;
  tipis?: boolean;
  sabit?: boolean;
  pintu?: number | false;
}) {
  const berpintu = pintu !== undefined;
  const buka = berpintu && pintu !== false;
  return (
    <div className={`relative aspect-[300/420] ${className}`}>
      <div className="absolute inset-0 overflow-clip" style={{ ...maskerLengkung, perspective: berpintu ? "700px" : undefined }}>
        {/* foto mundur pelan ke ukuran asli saat pintunya terbuka (pembungkus terpisah dari parallax scroll-nya) */}
        <motion.div
          className="absolute inset-0"
          initial={berpintu ? { transform: "scale(1.18)" } : false}
          animate={buka ? { transform: "scale(1)" } : undefined}
          transition={{ duration: 2.6, ease: [0.2, 0.7, 0.2, 1], delay: (pintu || 0) + 0.2 }}
        >
          <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
            <Image src={src} alt={alt} fill sizes={sizes} preload={preload} loading={preload ? "eager" : undefined} className="object-cover" style={{ objectPosition: posisi }} />
          </div>
        </motion.div>
        {berpintu && (
          <>
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_55%,#fffdf5,rgb(255_236_190/0.7)_45%,rgb(255_236_190/0))]"
              initial={{ opacity: 0 }}
              animate={buka ? { opacity: [0, 0.9, 0] } : undefined}
              transition={{ duration: 2.4, times: [0, 0.3, 1], ease: "easeInOut", delay: pintu || 0 }}
              aria-hidden="true"
            />
            {[false, true].map((kanan) => (
              <motion.div
                key={String(kanan)}
                className={`absolute inset-y-0 w-1/2 ${kanan ? "right-0" : "left-0"}`}
                style={{ transformOrigin: kanan ? "100% 50%" : "0% 50%" }}
                initial={{ transform: "rotateY(0deg)", opacity: 1 }}
                animate={buka ? { transform: `rotateY(${kanan ? 108 : -108}deg)`, opacity: 0 } : undefined}
                transition={{ duration: 1.9, ease: [0.5, 0, 0.25, 1], delay: pintu || 0, opacity: { duration: 0.4, delay: (pintu || 0) + 1.5 } }}
                aria-hidden="true"
              >
                <DaunPintu kanan={kanan} />
              </motion.div>
            ))}
          </>
        )}
      </div>
      <TepiLengkung className="top-[-5.71%] left-[-8%] h-[111.43%] w-[116%]" tipis={tipis} sabit={sabit} />
    </div>
  );
}

/* ───────── Kartu berpuncak mihrab (tinggi mengikuti isi) ───────── */

// Lapisan bertingkat: tepi emas tipis → isi warna kartu → garis emas dalam. Bayangan lewat drop-shadow di pembungkus.
export function KartuMihrab({ className = "", warna = "#fffdf8", garis = EMAS, children }: { className?: string; warna?: string; garis?: string; children: ReactNode }) {
  return (
    <div className={`relative [container-type:inline-size] ${className}`}>
      <div className="absolute inset-0 drop-shadow-[0_24px_26px_rgb(20_45_38/0.22)]">
        <div className="absolute inset-0" style={{ ...maskerMihrab(0), background: `linear-gradient(135deg,#a98544,#f1e2b8 40%,#b8955a 70%,#f6ebc8)` }} />
        <div className="absolute inset-[1.5px]" style={{ ...maskerMihrab(1.5), background: warna }} />
      </div>
      <div className="absolute inset-[9px]" style={{ ...maskerMihrab(9), background: garis }} />
      <div className="absolute inset-[10px]" style={{ ...maskerMihrab(10), background: warna }} />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ───────── Daun pintu mihrab ───────── */

// Satu daun pintu (kiri; kanan dicerminkan): pernis putih gading, bingkai emas, kisi bintang delapan di panel atas &
// bawah, medali bintang di tengah, gelang pegangan di tepi temu. Engsel di x=0, tepi temu di x=150.
export function DaunPintu({ kanan }: { kanan?: boolean }) {
  const id = useId().replace(/:/g, "");
  const emas = `url(#e${id})`;
  return (
    <svg viewBox="0 0 150 420" preserveAspectRatio="none" className={`absolute inset-0 h-full w-full ${kanan ? "-scale-x-100" : ""}`} aria-hidden="true">
      <DefsEmas id={`e${id}`} />
      <defs>
        <linearGradient id={`p${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#efe8d8" />
          <stop offset=".5" stopColor="#fffdf7" />
          <stop offset="1" stopColor="#f6f1e5" />
        </linearGradient>
        <pattern id={`k${id}`} width="22" height="22" patternUnits="userSpaceOnUse" x="9" y="4">
          <g fill="none" stroke="#a98544" strokeWidth=".9">
            <path d={BINTANG8} transform="translate(11 11) scale(6.2)" strokeWidth=".14" />
            <path d="M11 0V4.8M11 17.2V22M0 11H4.8M17.2 11H22" />
          </g>
        </pattern>
      </defs>
      <rect width="150" height="420" fill={`url(#p${id})`} />
      {/* panel atas (terpotong lengkung) & bawah berkisi */}
      <rect x="14" y="0" width="122" height="196" fill={`url(#k${id})`} opacity=".85" />
      <rect x="14" y="302" width="122" height="100" fill={`url(#k${id})`} opacity=".85" />
      <g fill="none" stroke={emas} strokeLinejoin="round">
        <path d="M14 0V196H136V0" strokeWidth="2.2" />
        <path d="M14 302H136V402H14Z" strokeWidth="2.2" />
        <path d="M8 0V412H142V0" strokeWidth="1.2" />
        <path d="M0 204H150M0 296H150" strokeWidth="1.4" />
      </g>
      {/* medali bintang delapan */}
      <g transform="translate(75 250)">
        <path d={garisBintang} transform="scale(40)" fill="#fffdf7" stroke={emas} strokeWidth=".05" />
        <path d={garisBintang} transform="scale(33)" fill="none" stroke={emas} strokeWidth=".03" />
        <path d={BINTANG8} transform="scale(18)" fill="none" stroke={emas} strokeWidth=".09" />
        <circle r="5" fill={emas} />
      </g>
      {/* tepi temu & gelang pegangan */}
      <path d="M147 0V420" stroke={emas} strokeWidth="5" />
      <path d="M2 0V420" stroke="#d9cfb8" strokeWidth="4" />
      <circle cx="132" cy="252" r="5" fill={emas} />
      <circle cx="132" cy="262" r="8" fill="none" stroke={emas} strokeWidth="2.2" />
    </svg>
  );
}

/* ───────── Monogram & pembatas ───────── */

export function Monogram({ a, b, className = "", terang = false }: { a: string; b: string; className?: string; terang?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`relative mx-auto grid aspect-square w-28 place-items-center ${className}`}>
      <svg viewBox="-1.15 -1.15 2.3 2.3" className={`${s.putar} absolute inset-0 h-full w-full`} aria-hidden="true">
        <DefsEmas id={`mo${id}`} />
        <path d={garisBintang} fill="none" stroke={`url(#mo${id})`} strokeWidth=".035" />
        <path d={garisBintang} fill="none" stroke={`url(#mo${id})`} strokeWidth=".012" transform="scale(.9)" />
        {Array.from({ length: 8 }, (_, i) => (
          <circle key={i} cx="0" cy="-1.06" r=".03" fill={EMAS} transform={`rotate(${i * 45 + 22.5})`} />
        ))}
      </svg>
      <p className={`${naskah} relative text-[2.7rem] leading-none ${terang ? "text-[#fbf8f1]" : "text-[#0f3a31]"}`}>
        {a}
        <span className="text-[#b8955a]">&amp;</span>
        {b}
      </p>
    </div>
  );
}

// Garis tipis dengan bintang delapan kecil di tengah
export function Pembatas({ className = "", terang = false }: { className?: string; terang?: boolean }) {
  const w = terang ? "#e9dcc0" : ZAMRUD;
  return (
    <svg viewBox="0 0 200 22" className={`mx-auto h-[22px] w-44 ${className}`} aria-hidden="true">
      <path d="M6 11h64M130 11h64" stroke={w} strokeWidth="1" strokeLinecap="round" opacity=".5" />
      <path d="M76 11h8M116 11h8" stroke={EMAS} strokeWidth="1.4" strokeLinecap="round" />
      <g transform="translate(100 11) scale(9)">
        <path d={garisBintang} fill={terang ? "#0f3a31" : "#fbfaf6"} stroke={EMAS} strokeWidth=".14" />
        <path d={BINTANG8} fill="none" stroke={EMAS} strokeWidth=".08" transform="scale(.55)" />
      </g>
      {[88, 112].map((x) => (
        <path key={x} d={`M${x} 8.6 ${x + 2.4} 11 ${x} 13.4 ${x - 2.4} 11Z`} fill={EMAS} />
      ))}
    </svg>
  );
}

// Tepi arkade (deretan lengkung mihrab kecil) di puncak bagian, berwarna sama dengan bagiannya
export function Arkade({ warna }: { warna: string }) {
  const enc = encodeURIComponent(warna);
  return (
    <div
      className={`${s.arkade} pointer-events-none absolute inset-x-0 top-0 h-[15px] -translate-y-[14px]`}
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='15'><path d='M0 15V10C0 6.5 3.5 4.6 7.5 3.4 11 2.3 13.6 1.4 15 0 16.4 1.4 19 2.3 22.5 3.4 26.5 4.6 30 6.5 30 10V15Z' fill='${enc}'/><circle cx='15' cy='7.5' r='1.3' fill='%23b8955a'/></svg>")`,
      }}
      aria-hidden="true"
    />
  );
}
