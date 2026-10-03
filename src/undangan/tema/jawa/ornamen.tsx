"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ASET, SISI, type Kembang, type NamaAset } from "./aset";
import s from "./jawa.module.css";

// Ornamen tema Jawa Klasik: gapura, janur, wayang, pohon, gunung, rumpun bunga, bingkai foto berukir,
// gunungan, burung, kupu-kupu, butiran cahaya.
// Gerak masuknya meniru undangan referensi: tiap ornamen "tumbuh" dari sudutnya dengan jeda bertahap, jadi
// lapisan-lapisannya muncul bertumpuk. Semuanya `transform` utuh + opacity, dijalankan mesin animasi browser (GPU).
// Gerak ikut scroll (parallax) ada di kelas CSS-nya (jawa.module.css), selalu di elemen pembungkus yang berbeda
// dari elemen yang dianimasikan motion, supaya keduanya tidak saling menimpa.

export const kaushan = "font-[family-name:var(--font-kaushan)]";
export const cinzel = "font-[family-name:var(--font-cinzel)]";

type Sudut = "tl" | "t" | "tr" | "l" | "c" | "r" | "bl" | "b" | "br";
const ASAL: Record<Sudut, string> = {
  tl: "0% 0%",
  t: "50% 0%",
  tr: "100% 0%",
  l: "0% 50%",
  c: "50% 50%",
  r: "100% 50%",
  bl: "0% 100%",
  b: "50% 100%",
  br: "100% 100%",
};

// Kurva yang cepat di awal lalu mengendap pelan: gerak tumbuh terasa lentur, tidak kaku
export const LENTUR = [0.16, 1, 0.3, 1] as const;

// Pemicu: wadah tanpa transform yang memulai animasi anak-anaknya (Tumbuh dengan `ikut`) saat terlihat,
// atau saat `tampil` menjadi true. Dibutuhkan untuk ornamen yang tumbuh dari titik di luar layar: elemen yang
// masih berskala 0 di luar layar tidak pernah dianggap "terlihat", sedangkan wadahnya punya ukuran penuh.
function pemicu(tampil: boolean | undefined, amount: number) {
  return tampil === undefined
    ? { initial: "hidden", whileInView: "show", viewport: { once: true, amount } }
    : { initial: "hidden", animate: tampil ? "show" : "hidden" };
}
export function Pemicu({ tampil, amount = 0.15, className = "", children }: { tampil?: boolean; amount?: number; className?: string; children: ReactNode }) {
  return (
    <motion.div className={className} {...pemicu(tampil, amount)}>
      {children}
    </motion.div>
  );
}

// Tumbuh dari sudut saat terlihat (atau saat `tampil` menjadi true, mis. setelah undangan dibuka).
// awal: skala awal (0 = dari titik, 0.7 = membesar sedikit seperti foto di referensi).
// ikut: tidak punya pemicu sendiri, mengikuti Pemicu di atasnya.
export function Tumbuh({
  dari = "c",
  jeda = 0,
  durasi = 2,
  awal = 0,
  amount = 0.15,
  ikut = false,
  tampil,
  className = "",
  style,
  children,
}: {
  dari?: Sudut;
  jeda?: number;
  durasi?: number;
  awal?: number;
  amount?: number;
  ikut?: boolean;
  tampil?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <motion.div
      className={className}
      style={{ ...style, transformOrigin: ASAL[dari] }}
      {...(ikut ? {} : pemicu(tampil, amount))}
      variants={{
        hidden: { opacity: 0, transform: `scale(${awal})` },
        show: { opacity: 1, transform: "scale(1)", transition: { duration: durasi, ease: LENTUR, delay: jeda } },
      }}
    >
      {children}
    </motion.div>
  );
}

const AYUN = [s.ayunA, s.ayunB, s.ayunC, s.ayunD];

export function Gambar({ a, className = "", sizes = "200px", flip = false, preload }: { a: NamaAset; className?: string; sizes?: string; flip?: boolean; preload?: boolean }) {
  const g = ASET[a];
  return <Image src={g.src} alt="" width={g.w} height={g.h} sizes={sizes} preload={preload} className={`h-auto w-full ${flip ? "-scale-x-100" : ""} ${className}`} />;
}

// Letak akhir satu bunga, supaya kotak gambarnya setelah dimiringkan (ditambah sedikit ruang untuk goyangannya)
// tetap di dalam batas: lebar rumpun, diperluas `lebih` persen ke kiri & kanan.
// - tanpa `lebih`: bunga digeser ke dalam (dan dikecilkan bila tetap tidak muat). Untuk rumpun di tepi layar.
// - dengan `lebih`: tepi dalam bunga dipertahankan dan bunganya dikecilkan. Untuk bunga di bingkai foto,
//   supaya tidak bergeser menutupi fotonya. `lebih` = jarak wadah ke tepi layar, dalam persen lebar wadah.
const RUANG = 3;
function dalamWadah(k: Kembang, lebih?: number) {
  const g = ASET[k.a];
  const rad = ((k.r ?? 0) * Math.PI) / 180;
  const separuh = (k.w / 2) * Math.abs(Math.cos(rad)) + ((k.w * g.h) / g.w / 2) * Math.abs(Math.sin(rad));
  const tengah = k.x + k.w / 2;
  if (lebih !== undefined) {
    const kiri = -lebih + RUANG;
    const kanan = 100 + lebih - RUANG;
    let f = 1;
    if (tengah - separuh < kiri) f = Math.min(f, (tengah + separuh - kiri) / (2 * separuh));
    if (tengah + separuh > kanan) f = Math.min(f, (kanan - (tengah - separuh)) / (2 * separuh));
    if (f === 1) return { x: k.x, w: k.w };
    const c = tengah - separuh < kiri ? tengah + separuh - separuh * f : tengah - separuh + separuh * f;
    return { x: c - (k.w * f) / 2, w: k.w * f };
  }
  const f = Math.min(1, (50 - RUANG) / separuh);
  const w = k.w * f;
  const c = Math.min(Math.max(tengah, separuh * f + RUANG), 100 - separuh * f - RUANG);
  return { x: c - w / 2, w };
}

// Rumpun bunga di sudut. cermin: dibalik kiri-kanan (untuk sudut kanan).
export function Rumpun({
  items,
  className = "",
  cermin = false,
  tampil,
  jeda = 0,
  atas = false,
  dari,
  lebih,
}: {
  items: Kembang[];
  className?: string;
  cermin?: boolean;
  tampil?: boolean;
  jeda?: number;
  atas?: boolean;
  dari?: Sudut;
  lebih?: number;
}) {
  return (
    <Pemicu tampil={tampil} amount={0.1} className={`pointer-events-none absolute ${cermin ? "-scale-x-100" : ""} ${className}`}>
      {items.map((k, i) => {
        const { x, w } = dalamWadah(k, lebih);
        return (
        <Tumbuh
          key={i}
          ikut
          dari={dari ?? (atas ? "tl" : "bl")}
          jeda={jeda + (k.d ?? i * 0.2)}
          className="absolute"
          style={{ left: `${x}%`, bottom: `${k.b}%`, width: `${w}%`, zIndex: k.z ?? 0 }}
        >
          <div style={{ rotate: `${k.r ?? 0}deg` }}>
            <div className={AYUN[i % 4]} style={{ transformOrigin: atas ? "50% 0%" : "50% 100%", animationDelay: `${-i * 1.3}s` }}>
              <Gambar a={k.a} flip={k.flip} sizes={`${Math.round(w * 2.2)}px`} />
            </div>
          </div>
        </Tumbuh>
        );
      })}
    </Pemicu>
  );
}

// Janur kuning yang menjuntai dari sudut atas
export function Janur({ sisi, className = "", tampil, jeda = 0 }: { sisi: "kiri" | "kanan"; className?: string; tampil?: boolean; jeda?: number }) {
  const kiri = sisi === "kiri";
  return (
    <Pemicu tampil={tampil} className={`pointer-events-none absolute ${className}`}>
      <Tumbuh ikut dari={kiri ? "tl" : "tr"} jeda={jeda}>
        <div className={kiri ? "-scale-x-100" : ""}>
          <div className={s.janur}>
            <Gambar a="janur" sizes="180px" />
          </div>
        </div>
      </Tumbuh>
    </Pemicu>
  );
}

// Kepala wayang di sudut bawah, digerakkan patah-patah seperti sedang dimainkan dalang
export function Wayang({ sisi, className = "", tampil, jeda = 0 }: { sisi: "kiri" | "kanan"; className?: string; tampil?: boolean; jeda?: number }) {
  const kiri = sisi === "kiri";
  return (
    <Pemicu tampil={tampil} className={`pointer-events-none absolute ${className}`}>
      <Tumbuh ikut dari={kiri ? "bl" : "br"} jeda={jeda}>
        <div className={s.wayang} style={{ animationDelay: kiri ? "0s" : "-1.2s" }}>
          <Gambar a="wayang" flip={!kiri} sizes="160px" className="drop-shadow-[0_8px_10px_rgb(91_59_71/0.3)]" />
        </div>
      </Tumbuh>
    </Pemicu>
  );
}

// Pohon ungu di sisi bawah
export function Pohon({ sisi, className = "", tampil, jeda = 0 }: { sisi: "kiri" | "kanan"; className?: string; tampil?: boolean; jeda?: number }) {
  const kiri = sisi === "kiri";
  return (
    <Pemicu tampil={tampil} className={`pointer-events-none absolute ${className}`}>
      <Tumbuh ikut dari={kiri ? "bl" : "br"} jeda={jeda}>
        <div className={s.ayunD} style={{ transformOrigin: "50% 100%" }}>
          <Gambar a="pohon" flip={!kiri} sizes="200px" />
        </div>
      </Tumbuh>
    </Pemicu>
  );
}

// Gunung berkabut: membesar dari bawah (skala 0.7 → 1)
export function Gunung({ className = "", tampil, jeda = 0, preload }: { className?: string; tampil?: boolean; jeda?: number; preload?: boolean }) {
  return (
    <Pemicu tampil={tampil} className={`pointer-events-none absolute ${className}`}>
      <Tumbuh ikut dari="b" awal={0.7} jeda={jeda}>
        <Gambar a="gunung" sizes="440px" preload={preload} />
      </Tumbuh>
    </Pemicu>
  );
}

// Monogram inisial yang saling bertumpuk
export function Monogram({ a, b, className = "" }: { a: string; b: string; className?: string }) {
  return (
    <p className={`${cinzel} flex items-end justify-center leading-none font-bold text-[#5b3b47] ${className}`} aria-hidden="true">
      <span>{a}</span>
      <span className="-ml-[0.32em] translate-y-[0.12em] text-[#7b5563]">{b}</span>
    </p>
  );
}

/* ───────── Bingkai foto berukir (plum) ───────── */

// Bentuk kori (pintu Jawa): sisi tegak, bahu melengkung, puncak meruncing. k = jarak ke dalam.
const kori = (k: number) =>
  `M${10 + k} ${370 - k} V122 C${10 + k} ${102 + k * 0.4} ${36 + k} ${96 + k * 0.6} ${68 + k * 0.4} ${92 + k * 0.7} C${94} ${88 + k * 0.8} ${100} ${66 + k} ${116} ${54 + k} C${132} ${42 + k} ${142} ${28 + k} 150 ${12 + k} C158 ${28 + k} ${168} ${42 + k} ${184} ${54 + k} C${200} ${66 + k} ${206} ${88 + k * 0.8} ${232 - k * 0.4} ${92 + k * 0.7} C${264 - k} ${96 + k * 0.6} ${290 - k} ${102 + k * 0.4} ${290 - k} 122 V${370 - k} Z`;
const MASKER = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 380' preserveAspectRatio='none'><path d='${kori(16)}'/></svg>`)}")`;

// Foto di dalamnya sedikit lebih tinggi dari bingkai dan bergeser lebih lambat dari halaman (parallax).
export function BingkaiUkir({ src, alt, className = "", sizes, preload, posisi = "50% 25%" }: { src: string; alt: string; className?: string; sizes: string; preload?: boolean; posisi?: string }) {
  return (
    <div className={`relative aspect-[300/380] ${className}`}>
      <div className="absolute inset-0 overflow-hidden" style={{ maskImage: MASKER, WebkitMaskImage: MASKER, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}>
        <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
          <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" style={{ objectPosition: posisi }} />
        </div>
      </div>
      <svg viewBox="0 0 300 380" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_10px_14px_rgb(91_59_71/0.35)]" aria-hidden="true">
        <defs>
          <linearGradient id="jw-bingkai" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9a6f80" />
            <stop offset=".45" stopColor="#6e4757" />
            <stop offset="1" stopColor="#4e3240" />
          </linearGradient>
        </defs>
        <path d={`${kori(0)} ${kori(16)}`} fillRule="evenodd" fill="url(#jw-bingkai)" stroke="#432a36" strokeWidth="1.2" />
        <path d={kori(8)} fill="none" stroke="#d9b7c2" strokeWidth="1" strokeDasharray="2 4" opacity=".8" />
        {/* mahkota kecil di puncak */}
        <g transform="translate(150 6)">
          {[-24, 0, 24].map((r) => (
            <path key={r} d="M0 0 C6 -8 6 -18 0 -24 C-6 -18 -6 -8 0 0 Z" transform={`rotate(${r})`} fill="#7b5563" stroke="#432a36" strokeWidth="1" />
          ))}
          <circle r="3.5" fill="#e2c070" stroke="#432a36" strokeWidth=".8" />
        </g>
        {/* roset di sudut bawah */}
        {[18, 282].map((x) => (
          <g key={x} transform={`translate(${x} 362)`}>
            {[0, 60, 120, 180, 240, 300].map((r) => (
              <ellipse key={r} cx="0" cy="-6" rx="3.2" ry="6" transform={`rotate(${r})`} fill="#9a6f80" stroke="#432a36" strokeWidth=".7" />
            ))}
            <circle r="2.6" fill="#e2c070" />
          </g>
        ))}
        {/* ikal di bahu */}
        {[-1, 1].map((sx) => (
          <path key={sx} d={`M${150 + sx * 82} 96 c${sx * 12} -10 ${sx * 26} -4 ${sx * 22} 8 c${sx * -3} 8 ${sx * -12} 6 ${sx * -10} 0`} fill="none" stroke="#e2c070" strokeWidth="1.6" strokeLinecap="round" />
        ))}
      </svg>
    </div>
  );
}

/* ───────── Kelopak mawar yang jatuh ───────── */

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export function KelopakJatuh({ n = 6, className = "" }: { n?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className={`${s.kelopak} absolute top-0`}
          style={
            {
              left: `${(rnd(i + 3) * 90).toFixed(1)}%`,
              "--x": `${Math.round((rnd(i + 9) - 0.3) * 110)}px`,
              "--d": `${(14 + rnd(i + 11) * 10).toFixed(1)}s`,
              animationDelay: `${(-rnd(i + 13) * 22).toFixed(1)}s`,
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 20 24" style={{ width: `${(9 + rnd(i + 7) * 7).toFixed(1)}px` }}>
            <path d="M10 1C16 4 19 11 17 17s-7 7-7 7-6-1-8-7S4 4 10 1Z" fill={i % 2 ? "#e6a9b6" : "#f2c9d1"} opacity=".9" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/* ───────── Gapura berlapis ───────── */

// Gapura yang membingkai satu bagian setinggi apa pun, dipasang di belakang isi (bagian induknya perlu `isolate`).
// Masuknya bertumpuk: lengkung tumbuh dari atas, pilar kiri & kanan bergeser masuk dari tepi layar,
// lalu kaki gapura tumbuh dari bawah saat dasar bagian terlihat.
// Pilar dimulai tepat di titik potong gambarnya (550/900 lebar), memakai margin persen yang dihitung dari lebar.
const GESER = {
  hidden: (kiri: boolean) => ({ opacity: 0, transform: `translateX(${kiri ? -36 : 36}%)` }),
  show: { opacity: 1, transform: "translateX(0%)", transition: { duration: 1.6, ease: LENTUR, delay: 0.25 } },
};
export function Gapura({ lengkung = false, kaki = true }: { lengkung?: boolean; kaki?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {!lengkung &&
        [true, false].map((kiri) => (
          <motion.div
            key={String(kiri)}
            custom={kiri}
            variants={GESER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            className={`absolute top-0 bottom-0 mt-[61.1%] w-1/2 ${kiri ? `left-0 ${s.tiangKiri}` : `right-0 ${s.tiangKanan}`} ${kaki ? "mb-[20%]" : ""}`}
          />
        ))}
      {!lengkung && kaki && (
        <Tumbuh dari="b" awal={0.8} durasi={1.6} className="absolute inset-x-0 bottom-0">
          <Gambar a="gapuraKaki" sizes="440px" />
        </Tumbuh>
      )}
      <Tumbuh dari="t" awal={0.6} durasi={1.8} className="absolute inset-x-0 top-0">
        <Gambar a="gapuraAtas" sizes="440px" />
      </Tumbuh>
    </div>
  );
}

/* ───────── Penyambung antarbagian ───────── */

// Rumpun bunga di kedua tepi tepat di garis pertemuan dua bagian, menutup sambungannya.
// Bergerak lebih cepat dari halaman (parallax dekat), jadi terasa melayang di depan isi.
// Bagian di sekitarnya diberi ruang kosong di tepi atas/bawah supaya bunganya tidak menutupi teks.
export function Sambung({ items = SISI, className = "", lebar = "w-[24%]" }: { items?: Kembang[]; className?: string; lebar?: string }) {
  return (
    <div className={`pointer-events-none relative z-20 h-0 ${className}`} aria-hidden="true">
      <div className={`${s.pDekat} absolute top-0 left-0 ${lebar} -translate-y-1/2`}>
        <Rumpun items={items} dari="l" className="relative! block aspect-[1/1.35] w-full" />
      </div>
      <div className={`${s.pDekat} absolute top-0 right-0 ${lebar} -translate-y-1/2`}>
        <Rumpun items={items} dari="l" cermin jeda={0.15} className="relative! block aspect-[1/1.35] w-full" />
      </div>
    </div>
  );
}

/* ───────── Gunungan wayang (kayon), samar di belakang teks ───────── */

const CABANG = [78, 102, 126, 150, 174];
export function Gunungan({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <Tumbuh dari="b" awal={0.5} durasi={2.2}>
        <svg viewBox="0 0 200 290" className={`${s.napas} h-auto w-full`} fill="none" stroke="#5b3b47" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M100 6C118 40 150 70 172 112C192 150 194 196 180 226L176 262H24L20 226C6 196 8 150 28 112C50 70 82 40 100 6Z"
            fill="#5b3b47"
            fillOpacity=".08"
          />
          <path d="M100 22C116 52 142 78 160 114C176 148 178 190 166 218H34C22 190 24 148 40 114C58 78 84 52 100 22Z" strokeDasharray="3 5" />
          <path d="M100 214V44" strokeWidth="2.4" />
          {CABANG.map((y, i) => {
            const p = 34 - i * 3;
            return (
              <g key={y}>
                {[-1, 1].map((k) => (
                  <path key={k} d={`M100 ${y + 14}C${100 + k * p * 0.4} ${y + 2} ${100 + k * p} ${y + 6} ${100 + k * p} ${y - 6}c0-7 ${-k * 8} -8 ${-k * 9} -2`} />
                ))}
                <circle cx="100" cy={y - 4} r="3" fill="#5b3b47" fillOpacity=".25" />
              </g>
            );
          })}
          <path d="M60 218L100 190L140 218" strokeWidth="2" />
          <path d="M70 218V262M130 218V262M86 262V236Q100 222 114 236V262" />
          <path d="M14 262H186V276H14Z" fill="#5b3b47" fillOpacity=".1" />
        </svg>
      </Tumbuh>
    </div>
  );
}

/* ───────── Makhluk & cahaya yang membuat halaman hidup ───────── */

export function Burung({ className = "", delay = 0, size = 15 }: { className?: string; delay?: number; size?: number }) {
  return (
    <div className={`${s.burung} pointer-events-none absolute ${className}`} style={{ animationDelay: `${delay}s` }} aria-hidden="true">
      <svg viewBox="0 0 20 8" className={s.kepakBurung} style={{ width: size }}>
        <path d="M0 6Q5 0 10 5 15 0 20 6" fill="none" stroke="#5b3b47" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// dekat: ikut parallax, bergerak lebih cepat dari halaman seolah terbang di depan layar
export function Kupu({ a = "kupu1", className = "", delay = 0, w = 34, dekat = true }: { a?: "kupu1" | "kupu2"; className?: string; delay?: number; w?: number; dekat?: boolean }) {
  const g = ASET[a];
  return (
    <div className={`${dekat ? s.pDekat : ""} pointer-events-none absolute z-20 ${className}`} aria-hidden="true">
      <div className={s.terbang} style={{ animationDelay: `${delay}s` }}>
        <div className={s.kepak} style={{ animationDelay: `${delay / 4}s` }}>
          <Image src={g.src} alt="" width={g.w} height={g.h} sizes={`${w * 2}px`} style={{ width: w, height: "auto" }} />
        </div>
      </div>
    </div>
  );
}

// Butiran cahaya keemasan yang turun pelan di depan seluruh halaman
export function Butir({ n = 16 }: { n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const size = 2.5 + rnd(i + 30) * 4;
        return (
          <span
            key={i}
            className={`${s.butir} absolute top-0 rounded-full`}
            style={
              {
                left: `${(rnd(i + 50) * 96).toFixed(1)}%`,
                width: `${size.toFixed(1)}px`,
                height: `${size.toFixed(1)}px`,
                background: i % 3 ? "radial-gradient(circle, #fffaf0 0%, rgb(255 250 240 / 0) 70%)" : "radial-gradient(circle, #fbe7a6 0%, rgb(226 192 112 / 0) 70%)",
                "--x": `${Math.round((rnd(i + 70) - 0.5) * 90)}px`,
                "--d": `${(13 + rnd(i + 90) * 12).toFixed(1)}s`,
                animationDelay: `${(-rnd(i + 110) * 25).toFixed(1)}s`,
              } as CSSProperties
            }
          />
        );
      })}
    </>
  );
}
