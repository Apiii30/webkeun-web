"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { type PropsTombolMusik, atributTombol } from "../../musik";
import m from "../../musik.module.css";

// Tombol musik Art Sunda: papan kecapi bata bertepi krem dengan lima senar emas. Saat musik jalan senarnya bergetar
// (masing-masing dengan nada & kecepatan sendiri); saat dijeda senar diam dan muncul ▶ di tengah.
export function TombolMusik({ main, onUbah, lagu }: PropsTombolMusik) {
  const senar = [
    [14, 1.6, 0.07],
    [21, 2.4, 0.09],
    [28, 3, 0.06],
    [35, 2.2, 0.08],
    [42, 1.4, 0.1],
  ];
  return (
    <motion.button {...atributTombol(main, lagu)} onClick={onUbah} whileTap={{ scale: 0.88 }} className={`relative block size-14 ${main ? "" : m.jeda}`}>
      <svg viewBox="0 0 56 56" className="size-full drop-shadow-[0_6px_10px_rgb(80_35_20/0.45)]" aria-hidden="true">
        <defs>
          <linearGradient id="sd-papan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a5634a" />
            <stop offset=".55" stopColor="#8a4b35" />
            <stop offset="1" stopColor="#6e3826" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="52" height="52" rx="16" fill="url(#sd-papan)" stroke="#d9bd85" strokeWidth="1.2" />
        <rect x="6" y="6" width="44" height="44" rx="12" fill="none" stroke="#f8f1e4" strokeWidth=".6" strokeDasharray="1.5 2" opacity=".55" />
        {/* pasak senar atas & bawah */}
        <path d="M11 11.5h34M11 44.5h34" stroke="#d9bd85" strokeWidth="1.6" strokeLinecap="round" />
        {senar.map(([x, lengkung, t], i) => (
          <g key={x} opacity={main ? 1 : 0.55} style={{ transition: "opacity .4s" }}>
            <circle cx={x} cy="11.5" r="1.5" fill="#f3dfa6" />
            <circle cx={x} cy="44.5" r="1.5" fill="#f3dfa6" />
            <path
              d={`M${x} 12Q${x + (main ? lengkung : 0)} 28 ${x} 44`}
              fill="none"
              stroke="#f3dfa6"
              strokeWidth={i === 2 ? 1.2 : 0.9}
              className={m.getar}
              style={{ transformBox: "fill-box", transformOrigin: `0px 50%`, "--t": `${t}s`, "--j": `${-i * 0.03}s` } as CSSProperties}
            />
          </g>
        ))}
        {!main && (
          <g>
            <circle cx="28" cy="28" r="9" fill="#f8f1e4" />
            <path d="M25.4 23.6v8.8l7-4.4Z" fill="#8a4b35" />
          </g>
        )}
      </svg>
    </motion.button>
  );
}
