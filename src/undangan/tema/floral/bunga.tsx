import { type CSSProperties, Fragment } from "react";
import s from "./floral.module.css";

// Bunga bergaya ilustrasi botani: kelopak bergradasi dari pangkal ke ujung, ada urat dan bayangan,
// dan setiap kelopak sedikit berbeda ukuran/arah supaya tidak kaku. Semuanya SVG murni.
// Gradasi & filter didefinisikan sekali di <BungaDefs />, yang harus dirender satu kali di halaman.

export type Warna = "putih" | "kuning" | "koral" | "biru";
type P = { className?: string; style?: CSSProperties };

// [pangkal, tengah, ujung]
const KELOPAK: Record<Warna, [string, string, string]> = {
  putih: ["#d9ccb4", "#f5efe3", "#fffdf8"],
  kuning: ["#de952b", "#f4cd6c", "#fff3cc"],
  koral: ["#cc5234", "#ee9878", "#ffe2d4"],
  biru: ["#4b63bd", "#92a7ea", "#e6ebff"],
};
const CAT: Record<Warna | "daun", string> = { putih: "#efe6d4", kuning: "#f2c75f", koral: "#f09a7b", biru: "#98abec", daun: "#a3c196" };

// Angka acak yang selalu sama untuk seed yang sama, supaya hasil server & browser identik
const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const f = (n: number) => n.toFixed(2);

export function BungaDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {Object.entries(KELOPAK).map(([k, [pangkal, tengah, ujung]]) => (
          <Fragment key={k}>
            {/* untuk satu kelopak yang menghadap ke atas: gelap di pangkal, terang di ujung */}
            <linearGradient id={`fl-${k}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={pangkal} />
              <stop offset="0.5" stopColor={tengah} />
              <stop offset="1" stopColor={ujung} />
            </linearGradient>
            {/* untuk mawar: gelap di tengah bunga, terang di tepi luar */}
            <radialGradient id={`fl-${k}-r`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="50">
              <stop offset="0" stopColor={pangkal} />
              <stop offset="0.5" stopColor={tengah} />
              <stop offset="1" stopColor={ujung} />
            </radialGradient>
          </Fragment>
        ))}
        <radialGradient id="fl-pusat" cx="0.38" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#fbe39a" />
          <stop offset="0.45" stopColor="#e5a43a" />
          <stop offset="1" stopColor="#8f5219" />
        </radialGradient>
        <radialGradient id="fl-pusat-gelap" cx="0.4" cy="0.38" r="0.75">
          <stop offset="0" stopColor="#7a5634" />
          <stop offset="0.6" stopColor="#3f2a17" />
          <stop offset="1" stopColor="#22160b" />
        </radialGradient>
        <radialGradient id="fl-bayang" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="24">
          <stop offset="0.45" stopColor="#4a2c10" stopOpacity="0.35" />
          <stop offset="1" stopColor="#4a2c10" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fl-daun" x1="0" y1="0" x2="1" y2="0.25">
          <stop offset="0" stopColor="#4f7c52" />
          <stop offset="0.5" stopColor="#8db383" />
          <stop offset="1" stopColor="#5f8c5c" />
        </linearGradient>
        <radialGradient id="fl-euka" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#d9e4d3" />
          <stop offset="0.55" stopColor="#a1b8a2" />
          <stop offset="1" stopColor="#6b8b79" />
        </radialGradient>
        <linearGradient id="fl-amplop" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#f7bca4" />
          <stop offset="1" stopColor="#e5845f" />
        </linearGradient>
        <linearGradient id="fl-amplop-tutup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbd3c1" />
          <stop offset="1" stopColor="#f0a080" />
        </linearGradient>
        {/* tepi bergelombang & sedikit luntur seperti cat air */}
        <filter id="fl-cat" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="18" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="1.4" />
        </filter>
      </defs>
    </svg>
  );
}

// Kelopak menghadap ke atas, pangkal di titik (0,0). Ujungnya bisa bertakik (daisy) atau runcing-bulat.
function kelopak(L: number, w: number, takik = true) {
  const ujung = `Q0 ${f(-L * (takik ? 0.93 : 1.06))} ${f(w * 0.3)} ${f(-L)}`;
  return `M0 0C${f(-w)} ${f(-L * 0.22)} ${f(-w * 1.15)} ${f(-L * 0.78)} ${f(-w * 0.3)} ${f(-L)}${ujung}C${f(w * 1.15)} ${f(-L * 0.78)} ${f(w)} ${f(-L * 0.22)} 0 0Z`;
}

// Biji di tengah bunga, disusun spiral seperti bunga asli (sudut emas)
function Biji({ n, r, color }: { n: number; r: number; color: string }) {
  return (
    <>
      {Array.from({ length: n }, (_, k) => {
        const a = k * 2.39996;
        const d = r * Math.sqrt(k / n);
        return <circle key={k} cx={f(Math.cos(a) * d)} cy={f(Math.sin(a) * d)} r={f(0.55 + (k / n) * 0.5)} fill={color} />;
      })}
    </>
  );
}

const cls = (className?: string) => `${s.bayang} ${className ?? ""}`;

export function Daisy({ warna = "putih", petals = 18, className, style }: P & { warna?: Warna; petals?: number }) {
  const lapis = (seed: number, offset: number, skala: number) =>
    Array.from({ length: petals }, (_, i) => {
      const r = rnd(seed + i);
      const L = (35 + r * 8) * skala;
      const w = (6.5 + rnd(seed + i + 40) * 2.5) * skala;
      const rot = (360 / petals) * i + offset + (r - 0.5) * 9;
      return (
        <g key={i} transform={`rotate(${f(rot)})`}>
          <path d={kelopak(L, w)} fill={`url(#fl-${warna})`} stroke="#5b4428" strokeOpacity="0.16" strokeWidth="0.5" />
          <path d={`M0 -6Q${f(w * 0.12)} ${f(-L * 0.5)} 0 ${f(-L * 0.85)}`} fill="none" stroke="#5b4428" strokeOpacity="0.12" strokeWidth="0.5" />
        </g>
      );
    });
  return (
    <svg viewBox="-50 -50 100 100" className={cls(className)} style={style} aria-hidden="true">
      <g opacity="0.9">{lapis(100, 180 / petals, 0.9)}</g>
      {lapis(1, 0, 1)}
      <circle r="24" fill="url(#fl-bayang)" />
      <circle r="11" fill="url(#fl-pusat)" />
      <Biji n={46} r={9.5} color="#7a4310" />
      <ellipse cx="-3.5" cy="-4" rx="4" ry="2.6" fill="#fff6d8" opacity="0.45" />
    </svg>
  );
}

// Mawar: kelopak lebar yang melengkung, berlapis makin ke dalam makin rapat dan gelap
export function Bloom({ warna = "koral", className, style }: P & { warna?: Warna }) {
  const lapisan = [
    { n: 6, L: 46, w: 30, off: 0 },
    { n: 5, L: 36, w: 24, off: 34 },
    { n: 5, L: 27, w: 18, off: 10 },
    { n: 4, L: 18, w: 13, off: 52 },
  ];
  const [, , ujung] = KELOPAK[warna];
  return (
    <svg viewBox="-50 -50 100 100" className={cls(className)} style={style} aria-hidden="true">
      {lapisan.map((l, li) =>
        Array.from({ length: l.n }, (_, i) => {
          const r = rnd(li * 20 + i);
          const L = l.L * (0.92 + r * 0.12);
          const w = l.w * (0.9 + rnd(li * 20 + i + 9) * 0.2);
          const rot = (360 / l.n) * i + l.off + (r - 0.5) * 14;
          return (
            <g key={`${li}-${i}`} transform={`rotate(${f(rot)})`}>
              <path d={kelopak(L, w, false)} fill={`url(#fl-${warna}-r)`} stroke="#5a2414" strokeOpacity="0.18" strokeWidth="0.6" />
              {/* tepi kelopak yang tergulung, tertimpa cahaya */}
              <path d={`M${f(-w * 0.62)} ${f(-L * 0.86)}Q0 ${f(-L * 1.05)} ${f(w * 0.62)} ${f(-L * 0.86)}`} fill="none" stroke={ujung} strokeOpacity="0.7" strokeWidth="1.3" strokeLinecap="round" />
            </g>
          );
        }),
      )}
      {/* pusaran di tengah mawar */}
      <path d="M-5 3C-8-3-1-9 5-5 9-2 6 5 0 5-3 5-4 1-1-1 2-3 4 0 2 2" fill="none" stroke="#5a2414" strokeOpacity="0.35" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// Gerbera: kelopak tipis dua lapis dengan pusat gelap dan benang sari kuning
export function Gerbera({ warna = "kuning", className, style }: P & { warna?: Warna }) {
  const ring = (n: number, L: number, w: number, off: number, seed: number) =>
    Array.from({ length: n }, (_, i) => {
      const r = rnd(seed + i);
      return (
        <path
          key={i}
          d={kelopak(L * (0.93 + r * 0.12), w, false)}
          fill={`url(#fl-${warna})`}
          stroke="#5b3a18"
          strokeOpacity="0.15"
          strokeWidth="0.4"
          transform={`rotate(${f((360 / n) * i + off + (r - 0.5) * 6)})`}
        />
      );
    });
  return (
    <svg viewBox="-50 -50 100 100" className={cls(className)} style={style} aria-hidden="true">
      {ring(24, 46, 5, 7, 300)}
      {ring(20, 36, 4.2, 0, 400)}
      <circle r="22" fill="url(#fl-bayang)" />
      <circle r="13" fill="url(#fl-pusat-gelap)" />
      {Array.from({ length: 30 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 30;
        return <circle key={i} cx={f(Math.cos(a) * 10.5)} cy={f(Math.sin(a) * 10.5)} r="1.1" fill="#f3c55a" />;
      })}
      <Biji n={30} r={7} color="#1a1008" />
    </svg>
  );
}

export function Tulip({ warna = "biru", className, style }: P & { warna?: Warna }) {
  const [, , ujung] = KELOPAK[warna];
  return (
    <svg viewBox="0 0 60 120" className={cls(className)} style={style} aria-hidden="true">
      <path d="M30 119C29 98 31.5 76 30 52" fill="none" stroke="#6a9560" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M30 113C13 105 4 84 8 58c11 11 20 28 22 55Z" fill="url(#fl-daun)" />
      <path d="M29 108C21 93 14 78 9.5 63" fill="none" stroke="#eef4e4" strokeOpacity="0.4" strokeWidth="0.9" />
      <path d="M31 98c12-5 18-17 19-30-10 6-17 16-19 30Z" fill="url(#fl-daun)" opacity="0.85" />
      {/* kelopak belakang, lalu dua kelopak depan yang saling menutup */}
      <path d="M30 13c-8 4-12 16-10 30 3 10 17 10 20 0 2-14-2-26-10-30Z" fill={`url(#fl-${warna})`} />
      <path d="M15 19c-1 17 3 31 15 36-4-11-6-25 0-39-6-2-12-1-15 3Z" fill={`url(#fl-${warna})`} stroke="#2b2350" strokeOpacity="0.15" strokeWidth="0.5" />
      <path d="M45 19c1 17-3 31-15 36 4-11 6-25 0-39 6-2 12-1 15 3Z" fill={`url(#fl-${warna})`} stroke="#2b2350" strokeOpacity="0.15" strokeWidth="0.5" />
      <path d="M17 22c0 12 3 22 9 28M43 22c0 12-3 22-9 28" fill="none" stroke={ujung} strokeOpacity="0.6" strokeWidth="1" strokeLinecap="round" />
      <path d="M22 30c1 8 3 14 6 19M38 30c-1 8-3 14-6 19" fill="none" stroke="#2b2350" strokeOpacity="0.1" strokeWidth="0.6" />
    </svg>
  );
}

export function Leaf({ className, style }: P) {
  return (
    <svg viewBox="0 0 40 100" className={cls(className)} style={style} aria-hidden="true">
      <path d="M20 2C36 22 39 64 21 98 6 71 2 30 20 2Z" fill="url(#fl-daun)" />
      <path d="M20 8C22 40 22.5 70 21 94" fill="none" stroke="#eef4e4" strokeOpacity="0.45" strokeWidth="1" />
      {[22, 34, 46, 58, 70, 80].map((y, i) => (
        <path
          key={y}
          d={`M${f(21 + (i % 2 ? 0.4 : 0))} ${y}Q${i % 2 ? 28 : 14} ${y - 6} ${i % 2 ? 32 : 9} ${y - 12}`}
          fill="none"
          stroke="#eef4e4"
          strokeOpacity="0.25"
          strokeWidth="0.7"
        />
      ))}
    </svg>
  );
}

// Ranting eucalyptus: daun bulat keperakan di kiri-kanan tangkai
export function Sprig({ className, style }: P) {
  const daun = [
    [27, 100, 8.5, -1],
    [31, 86, 8, 1],
    [35, 72, 7.6, -1],
    [41, 58, 7, 1],
    [45, 45, 6.4, -1],
    [51, 32, 5.6, 1],
    [54, 20, 4.8, -1],
    [57, 10, 4, 1],
  ];
  return (
    <svg viewBox="0 0 80 120" className={cls(className)} style={style} aria-hidden="true">
      <path d="M20 118C28 86 36 52 59 6" fill="none" stroke="#7b8d6a" strokeWidth="1.8" strokeLinecap="round" />
      {daun.map(([x, y, r, side], i) => {
        const cx = x + side * (r + 1);
        return (
          <g key={i}>
            <path d={`M${x} ${y}L${f(cx)} ${y}`} stroke="#7b8d6a" strokeWidth="1" />
            <ellipse cx={f(cx)} cy={y} rx={r} ry={f(r * 0.92)} fill="url(#fl-euka)" stroke="#557262" strokeOpacity="0.3" strokeWidth="0.5" transform={`rotate(${f(side * 18)} ${f(cx)} ${y})`} />
            <path d={`M${f(cx - side * r * 0.7)} ${y}Q${f(cx)} ${f(y - 1.5)} ${f(cx + side * r * 0.7)} ${y}`} fill="none" stroke="#eef4ea" strokeOpacity="0.35" strokeWidth="0.6" />
          </g>
        );
      })}
    </svg>
  );
}

// Sapuan cat air: pengganti bidang warna polos
export function Cat({ warna = "kuning", className, style }: P & { warna?: Warna | "daun" }) {
  const c = CAT[warna];
  return (
    <svg viewBox="-60 -60 120 120" className={className} style={style} aria-hidden="true">
      <g filter="url(#fl-cat)">
        <circle r="44" fill={c} opacity="0.5" />
        <circle cx="-9" cy="-7" r="27" fill={c} opacity="0.35" />
        <circle cx="12" cy="14" r="18" fill={c} opacity="0.25" />
        <circle r="44" fill="none" stroke={c} strokeWidth="2.5" opacity="0.7" />
      </g>
    </svg>
  );
}
