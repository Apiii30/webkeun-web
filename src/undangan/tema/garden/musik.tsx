"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { type PropsTombolMusik, atributTombol } from "../../musik";
import m from "../../musik.module.css";

// Tombol musik Garden Premium: kancing kaca teal kecil berbingkai karangan laurel emas yang berputar pelan saat lagu
// diputar, dengan equalizer emas di tengah. Saat dijeda: karangan diam & equalizer diganti ▶. (Judul lagu tidak lagi
// ditampilkan di tombol: kapsul "sedang diputar" terlalu lebar & menutupi judul beranda.)
export function TombolMusik({ main, onUbah, lagu }: PropsTombolMusik) {
  return (
    <motion.button {...atributTombol(main, lagu)} onClick={onUbah} whileTap={{ scale: 0.88 }} className={`relative block size-11 ${main ? "" : m.jeda}`}>
      <svg viewBox="0 0 44 44" className="size-full drop-shadow-[0_6px_10px_rgb(20_40_48/0.45)]" aria-hidden="true">
        <defs>
          <radialGradient id="gd-kaca" cx=".35" cy=".3" r=".85">
            <stop offset="0" stopColor="#3f6b7a" />
            <stop offset="1" stopColor="#1f3a44" />
          </radialGradient>
          <linearGradient id="gd-emas-musik" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8a6a33" />
            <stop offset=".4" stopColor="#f2e3b5" />
            <stop offset="1" stopColor="#a8843f" />
          </linearGradient>
        </defs>
        <circle cx="22" cy="22" r="20.5" fill="url(#gd-kaca)" stroke="url(#gd-emas-musik)" strokeWidth="1.4" />
        {/* karangan laurel: 12 helai daun di sekeliling, berputar saat lagu diputar */}
        <g className={m.putar} style={{ transformOrigin: "22px 22px", transformBox: "view-box" }}>
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse key={i} cx="22" cy="5.6" rx="1.5" ry="3.1" transform={`rotate(${i * 30} 22 22) rotate(28 22 5.6)`} fill="url(#gd-emas-musik)" />
          ))}
        </g>
        {main ? (
          [16, 19.3, 22.6, 26, 29.3].map((x, i) => (
            <rect
              key={x}
              x={x - 0.9}
              y="15"
              width="1.8"
              height="14"
              rx=".9"
              fill="#f2e3b5"
              className={m.eqTengah}
              style={{ transformBox: "fill-box", "--j": `${-i * 0.23}s`, "--t": `${0.5 + (i % 3) * 0.17}s` } as CSSProperties}
            />
          ))
        ) : (
          <path d="M19 15.6v12.8l10-6.4Z" fill="#f2e3b5" />
        )}
        <path d="M10 15a13 13 0 0 1 8-6" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity=".35" />
      </svg>
    </motion.button>
  );
}
