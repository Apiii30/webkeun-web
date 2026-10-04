"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { type PropsTombolMusik, atributTombol } from "../../musik";
import m from "../../musik.module.css";

// Tombol musik Garden Premium: kapsul kaca teal bertepi emas berisi "now playing": tombol bundar dengan equalizer
// lima batang, lalu judul lagu & penyanyi yang berjalan pelan. Saat dijeda: equalizer diganti ▶ dan teks berhenti.
export function TombolMusik({ main, onUbah, lagu }: PropsTombolMusik) {
  const teks = `${lagu.judul} · ${lagu.penyanyi}`;
  return (
    <motion.button
      {...atributTombol(main, lagu)}
      onClick={onUbah}
      whileTap={{ scale: 0.94 }}
      className={`flex h-11 w-[10.25rem] items-center gap-2 rounded-full bg-[#24434e]/85 py-1 pr-3 pl-1 text-left text-[#f3efe3] shadow-[0_10px_22px_-10px_rgb(20_40_48/0.8)] ring-1 ring-[#dcc58f]/70 backdrop-blur-md ${main ? "" : m.jeda}`}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#a8843f,#f1e0ae_50%,#a8843f)]">
        <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
          {main ? (
            [4, 8, 12, 16, 20].map((x, i) => (
              <rect
                key={x}
                x={x - 1.1}
                y="5"
                width="2.2"
                height="14"
                rx="1.1"
                fill="#24434e"
                className={m.eqTengah}
                style={{ transformBox: "fill-box", "--j": `${-i * 0.23}s`, "--t": `${0.5 + (i % 3) * 0.17}s` } as CSSProperties}
              />
            ))
          ) : (
            <path d="M8.5 6.2v11.6l9.3-5.8Z" fill="#24434e" />
          )}
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[8px] tracking-[0.2em] whitespace-nowrap text-[#dcc58f] uppercase">{main ? "Sedang diputar" : "Musik dijeda"}</span>
        <span className="block overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_88%,transparent)]">
          <span className={`${m.geser} flex w-max gap-6 font-[family-name:var(--font-cormorant)] text-[14px] leading-tight whitespace-nowrap italic`}>
            <span>{teks}</span>
            <span aria-hidden="true">{teks}</span>
          </span>
        </span>
      </span>
    </motion.button>
  );
}
