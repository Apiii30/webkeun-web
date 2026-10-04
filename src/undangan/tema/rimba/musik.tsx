"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { type PropsTombolMusik, atributTombol } from "../../musik";
import m from "../../musik.module.css";

// Tombol musik Rimba: kaca hijau hutan dengan gelombang suara emas yang mengalir & kunang-kunang yang terbang
// naik darinya. Saat dijeda: gelombang jadi garis datar, kunang-kunang hilang, ▶ di tengah.

// dua periode gelombang sinus (lebar 2 × 40), digeser setengahnya supaya mengalir tanpa sambungan
const GELOMBANG = (() => {
  let d = "M0 20";
  for (let x = 1; x <= 80; x++) d += `L${x} ${Math.round((20 + Math.sin((x / 40) * Math.PI * 2) * (6 + 6 * Math.sin((x / 80) * Math.PI * 4 + 1) ** 2)) * 100) / 100}`;
  return d;
})();

export function TombolMusik({ main, onUbah, lagu }: PropsTombolMusik) {
  return (
    <motion.button {...atributTombol(main, lagu)} onClick={onUbah} whileTap={{ scale: 0.88 }} className={`relative grid size-14 place-items-center ${main ? "" : m.jeda}`}>
      {/* kunang-kunang */}
      {main &&
        [
          ["18%", "-8px", "-0.3s"],
          ["62%", "6px", "-1.2s"],
          ["40%", "-3px", "-2s"],
        ].map(([kiri, x, j]) => (
          <span
            key={kiri}
            className={`${m.naik} absolute top-[30%] size-[5px] rounded-full bg-[#f6e3a1] shadow-[0_0_8px_2px_rgb(246_227_161/0.8)]`}
            style={{ left: kiri, "--x": x, "--y": "-18px", "--j": j } as CSSProperties}
            aria-hidden="true"
          />
        ))}
      <span
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_25%,#2c4a36,#13251b_65%,#0b170f)] shadow-[0_10px_20px_-8px_rgb(0_0_0/0.8)] ring-1 ring-[#c79f55]/70"
        aria-hidden="true"
      />
      <span className="absolute inset-[3px] rounded-full border border-[#e9d7a6]/15" aria-hidden="true" />
      <span className="relative h-[46%] w-[64%] overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)]" aria-hidden="true">
        {main ? (
          <svg viewBox="0 0 80 40" preserveAspectRatio="none" className={`${m.alir} absolute inset-y-0 left-0 h-full w-[200%]`} style={{ "--t": "1.6s" } as CSSProperties}>
            <path d={GELOMBANG} fill="none" stroke="#e9d7a6" strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
        ) : (
          <svg viewBox="0 0 40 40" className="absolute inset-0 size-full">
            <path d="M0 20H13M27 20H40" stroke="#e9d7a6" strokeWidth="1.6" opacity=".6" />
            <path d="M16.5 13v14l11-7Z" fill="#e9d7a6" />
          </svg>
        )}
      </span>
    </motion.button>
  );
}
