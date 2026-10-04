"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { type PropsTombolMusik, atributTombol } from "../../musik";
import m from "../../musik.module.css";
import { garisBintang } from "./hias";

// Tombol musik Putih Sakinah: lingkaran zamrud dengan bintang delapan emas yang berputar pelan, gelombang suara
// emas yang memancar keluar, dan tiga batang equalizer di tengah. Saat dijeda: bintang diam, gelombang hilang, ▶.
export function TombolMusik({ main, onUbah, lagu }: PropsTombolMusik) {
  return (
    <motion.button {...atributTombol(main, lagu)} onClick={onUbah} whileTap={{ scale: 0.88 }} className={`relative grid size-13 place-items-center ${main ? "" : m.jeda}`}>
      {/* gelombang suara */}
      {main &&
        [0, -0.8, -1.6].map((j) => <span key={j} className={`${m.riak} absolute inset-0 rounded-full border border-[#d9bd7c]`} style={{ "--j": `${j}s` } as CSSProperties} aria-hidden="true" />)}
      <span
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#1d5a4b,#0f3a31_60%,#0a2b24)] shadow-[0_8px_16px_-6px_rgb(10_30_25/0.7)] ring-1 ring-[#b8955a]/80"
        aria-hidden="true"
      />
      <svg viewBox="-1.2 -1.2 2.4 2.4" className={`${m.putarLambat} absolute inset-[5%]`} aria-hidden="true">
        <path d={garisBintang} fill="none" stroke="#d9bd7c" strokeWidth=".05" />
        <path d={garisBintang} fill="none" stroke="#d9bd7c" strokeWidth=".02" strokeDasharray=".04 .06" transform="scale(.84)" />
      </svg>
      <svg viewBox="0 0 24 24" className="relative size-[42%]" aria-hidden="true">
        {main ? (
          [6.5, 12, 17.5].map((x, i) => (
            <rect
              key={x}
              x={x - 1.4}
              y="5"
              width="2.8"
              height="14"
              rx="1.4"
              fill="#f1e2b8"
              className={m.eqTengah}
              style={{ transformBox: "fill-box", "--j": `${-i * 0.3}s`, "--t": `${0.6 + i * 0.15}s` } as CSSProperties}
            />
          ))
        ) : (
          <path d="M8.5 6.2v11.6l9.3-5.8Z" fill="#f1e2b8" />
        )}
      </svg>
    </motion.button>
  );
}
