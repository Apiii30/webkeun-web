"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { type PropsTombolMusik, atributTombol } from "../../musik";
import m from "../../musik.module.css";

// Tombol musik Luxury: lencana hitam metalik bergaya majalah, dengan tulisan melingkar "NOW PLAYING · judul lagu"
// berwarna emas yang berputar mengelilingi tombol putar/jeda bundar di tengahnya.
export function TombolMusik({ main, onUbah, lagu }: PropsTombolMusik) {
  const id = useId().replace(/:/g, "");
  const teks = `Now Playing · ${lagu.judul} · `;
  return (
    <motion.button {...atributTombol(main, lagu)} onClick={onUbah} whileTap={{ scale: 0.88 }} className={`relative block size-[3.75rem] ${main ? "" : m.jeda}`}>
      <span
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,#4a3d33,#241d18_55%,#15110e)] shadow-[0_10px_20px_-8px_rgb(20_15_10/0.8)] ring-1 ring-[#b48d4b]/80"
        aria-hidden="true"
      />
      <svg viewBox="0 0 60 60" className={`${m.putarLambat} absolute inset-0 size-full`} aria-hidden="true">
        <defs>
          <path id={`lx${id}`} d="M30 30m-21.5 0a21.5 21.5 0 1 1 43 0a21.5 21.5 0 1 1-43 0" />
        </defs>
        <text fill="#e9d5a1" style={{ fontFamily: "var(--font-bodoni)", fontSize: "6.2px", letterSpacing: "1.6px", textTransform: "uppercase" }}>
          <textPath href={`#lx${id}`} textLength="132" lengthAdjust="spacing">
            {teks.length > 34 ? `${teks.slice(0, 31)}… · ` : teks}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-[29%] grid place-items-center rounded-full bg-[linear-gradient(135deg,#b48d4b,#f1dfae_50%,#b48d4b)]" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="size-[55%]">
          {main ? <path d="M8 6h3v12H8zM13 6h3v12h-3z" fill="#241d18" /> : <path d="M9 6.2v11.6l9-5.8Z" fill="#241d18" />}
        </svg>
      </span>
    </motion.button>
  );
}
