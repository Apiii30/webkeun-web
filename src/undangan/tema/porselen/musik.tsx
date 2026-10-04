"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { type PropsTombolMusik, atributTombol } from "../../musik";
import m from "../../musik.module.css";

// Tombol musik Biru Porselen: piring porselen putih-kobalt bermotif kawung yang berputar seperti piringan hitam,
// dengan not balok kobalt yang melayang keluar. Saat dijeda: piring diam, not hilang, label tengah menampilkan ▶.
export function TombolMusik({ main, onUbah, lagu }: PropsTombolMusik) {
  return (
    <motion.button {...atributTombol(main, lagu)} onClick={onUbah} whileTap={{ scale: 0.88 }} className={`relative block size-14 ${main ? "" : m.jeda}`}>
      {/* not balok melayang */}
      {main &&
        [
          ["♪", "-30px", "-4px", "-0.2s", "40%"],
          ["♫", "-26px", "14px", "-1.1s", "30%"],
          ["♪", "-34px", "4px", "-1.9s", "50%"],
        ].map(([n, x, y, j, atas], i) => (
          <span
            key={i}
            className={`${m.naik} absolute left-0 text-[14px] leading-none text-[#27427a] [text-shadow:0_0_4px_#f6f3ec]`}
            style={{ top: atas, "--x": x, "--y": y, "--j": j } as CSSProperties}
            aria-hidden="true"
          >
            {n}
          </span>
        ))}
      <svg viewBox="0 0 56 56" className="size-full drop-shadow-[0_6px_10px_rgb(15_28_56/0.4)]" aria-hidden="true">
        <defs>
          <radialGradient id="pr-glasir" cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".7" stopColor="#f2f0ea" />
            <stop offset="1" stopColor="#dcdcd6" />
          </radialGradient>
        </defs>
        <g className={m.putar} style={{ transformOrigin: "28px 28px", transformBox: "view-box" }}>
          <circle cx="28" cy="28" r="26" fill="url(#pr-glasir)" stroke="#d8b56e" strokeWidth="1.2" />
          <circle cx="28" cy="28" r="23" fill="none" stroke="#27427a" strokeWidth="1.6" />
          <circle cx="28" cy="28" r="21.4" fill="none" stroke="#27427a" strokeWidth=".5" strokeDasharray="1 1.6" />
          {/* kawung: empat kelopak lonjong di tiap arah, berselang */}
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 45} 28 28)`}>
              <ellipse cx="28" cy="13.2" rx="2.6" ry="4.4" fill={i % 2 ? "#5d7bb5" : "#27427a"} />
              <ellipse cx="28" cy="13.2" rx=".9" ry="1.8" fill="#f6f3ec" />
            </g>
          ))}
          <circle cx="28" cy="28" r="8.6" fill="#27427a" />
          <circle cx="28" cy="28" r="7.6" fill="none" stroke="#d8b56e" strokeWidth=".6" />
        </g>
        {main ? <circle cx="28" cy="28" r="1.6" fill="#f6f3ec" /> : <path d="M25.6 24.2v7.6l6.2-3.8Z" fill="#f6f3ec" />}
        {/* kilau glasir (tidak ikut berputar) */}
        <path d="M11 20a18 18 0 0 1 12-10" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".8" />
      </svg>
    </motion.button>
  );
}
