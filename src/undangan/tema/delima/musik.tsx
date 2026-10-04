"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { type PropsTombolMusik, atributTombol } from "../../musik";
import m from "../../musik.module.css";

// tepi lilin yang tidak rata: lingkaran bergelombang kecil (angka dibulatkan supaya sama di server & browser)
const TEPI_LILIN = (() => {
  let d = "";
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const r = 15.2 + (i % 2 ? 0.9 : -0.5);
    d += `${i ? "L" : "M"}${Math.round((28 + r * Math.cos(a)) * 100) / 100} ${Math.round((28 + r * Math.sin(a)) * 100) / 100}`;
  }
  return `${d}Z`;
})();

// Tombol musik Merah Delima: segel lilin marun dikelilingi cincin equalizer emas (20 batang yang memancar). Saat
// musik jalan, batangnya berdenyut & segelnya berputar pelan; saat dijeda, semuanya diam dan segel menampilkan ▶.
export function TombolMusik({ main, onUbah, lagu }: PropsTombolMusik) {
  return (
    <motion.button {...atributTombol(main, lagu)} onClick={onUbah} whileTap={{ scale: 0.88 }} className={`relative block size-14 ${main ? "" : m.jeda}`}>
      <svg viewBox="0 0 56 56" className="size-full overflow-visible drop-shadow-[0_6px_10px_rgb(40_5_10/0.45)]" aria-hidden="true">
        <defs>
          <radialGradient id="dm-lilin" cx=".38" cy=".32" r=".8">
            <stop offset="0" stopColor="#c0414f" />
            <stop offset=".55" stopColor="#8e1f2c" />
            <stop offset="1" stopColor="#5e0f19" />
          </radialGradient>
        </defs>
        {/* alas blush bertepi emas, supaya tombol tetap terbaca di atas gambar apa pun */}
        <circle cx="28" cy="28" r="27.5" fill="#fbf4f1" fillOpacity=".92" stroke="#c9a35c" strokeWidth=".8" />
        {/* cincin equalizer */}
        <g opacity={main ? 1 : 0.45} style={{ transition: "opacity .4s" }}>
          {Array.from({ length: 20 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 18} 28 28)`}>
              <rect
                x="27.1"
                y="3"
                width="1.8"
                height="6"
                rx="1"
                fill="#b8914b"
                className={m.eq}
                style={{ transformBox: "fill-box", "--j": `${-((i * 7) % 11) * 0.09}s`, "--t": `${0.55 + ((i * 5) % 7) * 0.08}s` } as CSSProperties}
              />
            </g>
          ))}
        </g>
        {/* segel lilin */}
        <g className={m.putarLambat} style={{ transformOrigin: "28px 28px", transformBox: "view-box" }}>
          <path d={TEPI_LILIN} fill="url(#dm-lilin)" />
          <circle cx="28" cy="28" r="11.5" fill="none" stroke="#5e0f19" strokeWidth="1.2" opacity=".7" />
          <circle cx="28" cy="28" r="11.5" fill="none" stroke="#e7a3a9" strokeWidth=".5" opacity=".5" transform="translate(-.5 -.5)" />
        </g>
        {main ? (
          <g fill="#f2e0b0">
            <ellipse cx="25.6" cy="32" rx="2.9" ry="2.2" transform="rotate(-22 25.6 32)" />
            <rect x="27.5" y="21" width="1.3" height="11" rx=".6" />
            <path d="M28.6 21c2.6.7 4.6 2.4 4.3 5.3-.9-1.6-2.5-2.4-4.3-2.5Z" />
          </g>
        ) : (
          <path d="M25.2 22.6v10.8l8.6-5.4Z" fill="#f2e0b0" strokeLinejoin="round" />
        )}
      </svg>
    </motion.button>
  );
}
