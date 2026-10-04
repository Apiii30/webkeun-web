"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { type PropsTombolMusik, atributTombol } from "../../musik";
import m from "../../musik.module.css";

// Tombol musik Oriental Peony: lentera merah bertutup emas. Saat musik jalan, lentera berayun, cahayanya berdenyut,
// dan empat batang equalizer emas menyala di dalamnya; saat dijeda: lentera diam, redup, dan menampilkan ▶.
export function TombolMusik({ main, onUbah, lagu }: PropsTombolMusik) {
  return (
    <motion.button {...atributTombol(main, lagu)} onClick={onUbah} whileTap={{ scale: 0.88 }} className={`relative block h-[3.9rem] w-12 ${main ? "" : m.jeda}`}>
      {/* cahaya lentera */}
      <span
        className={`${m.denyut} absolute top-[18%] left-1/2 aspect-square w-[150%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_150_80/0.55),transparent)] ${main ? "" : "opacity-0!"}`}
        aria-hidden="true"
      />
      <svg viewBox="0 0 48 62" className="relative size-full overflow-visible drop-shadow-[0_6px_8px_rgb(60_10_10/0.45)]" aria-hidden="true">
        <defs>
          <radialGradient id="or-mlentera" cx=".45" cy=".42" r=".65">
            <stop offset="0" stopColor={main ? "#ff9a66" : "#d9574f"} />
            <stop offset=".55" stopColor="#d1302f" />
            <stop offset="1" stopColor="#8e1418" />
          </radialGradient>
          <linearGradient id="or-memas" x1="0" x2="1">
            <stop offset="0" stopColor="#9b7224" />
            <stop offset=".5" stopColor="#f6dc94" />
            <stop offset="1" stopColor="#9b7224" />
          </linearGradient>
        </defs>
        <g className={m.ayun} style={{ transformOrigin: "24px 0px", transformBox: "view-box" }}>
          <rect x="16" y="2" width="16" height="6" rx="1.5" fill="url(#or-memas)" />
          <ellipse cx="24" cy="26" rx="21" ry="19" fill="url(#or-mlentera)" stroke="#f6dc94" strokeWidth=".8" />
          <g fill="none" stroke="#7d1418" strokeWidth=".8" opacity=".5">
            <ellipse cx="24" cy="26" rx="13" ry="19" />
            <ellipse cx="24" cy="26" rx="5" ry="19" />
          </g>
          {main ? (
            [15, 21, 27, 33].map((x, i) => (
              <rect
                key={x}
                x={x - 1.3}
                y="18"
                width="2.6"
                height="16"
                rx="1.3"
                fill="#fff1d6"
                className={m.eqTengah}
                style={{ transformBox: "fill-box", "--j": `${-i * 0.27}s`, "--t": `${0.55 + (i % 2) * 0.2}s` } as CSSProperties}
              />
            ))
          ) : (
            <path d="M20 19v14l11-7Z" fill="#fff1d6" />
          )}
          <rect x="16" y="44" width="16" height="5" rx="1.5" fill="url(#or-memas)" />
          <circle cx="24" cy="52" r="2.2" fill="#f6dc94" />
          <path d="M22 54h4l1.5 8h-7Z" fill="#c8242b" />
        </g>
      </svg>
    </motion.button>
  );
}
