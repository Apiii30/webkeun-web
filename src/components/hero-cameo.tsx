import type { CSSProperties } from "react";
import { MascotFace } from "./mascot";

// Percikan titik saat maskot tertawa, arahnya diatur lewat --dx / --dy
const dots = [
  { dx: "-5.5rem", dy: "-3rem", className: "bg-mint size-4" },
  { dx: "5rem", dy: "-3.5rem", className: "bg-brand size-3.5" },
  { dx: "-3rem", dy: "-5.5rem", className: "bg-white size-3" },
  { dx: "3.5rem", dy: "-6rem", className: "bg-mint size-3" },
];

// Maskot yang muncul bergantian dengan kolom contoh di hero.
// Murni CSS: semua lapisan memakai siklus yang sama (lihat "Panggung hero" di globals.css).
export function HeroCameo() {
  return (
    <div className="stage-cameo pointer-events-none absolute inset-0 flex items-center justify-center pt-24 md:pt-28" aria-hidden="true">
      <div className="relative w-44 sm:w-52 md:w-60">
        <p className="stage-bubble-1 absolute bottom-full left-1/2 mb-20 -translate-x-1/2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold whitespace-nowrap shadow-[0_14px_30px_-14px_rgb(21_19_43/0.4)] sm:text-base">
          Psst… lagi cari website?
        </p>
        <p className="stage-bubble-2 absolute bottom-full left-1/2 mb-20 -translate-x-1/2 rounded-2xl bg-brand px-4 py-2.5 text-sm font-bold whitespace-nowrap text-white shadow-[0_14px_30px_-14px_rgb(91_61_245/0.7)] sm:text-base">
          Yuk webkeun!
        </p>

        {dots.map((d) => (
          <span
            key={d.dx}
            className={`stage-dot absolute top-[22%] left-1/2 rounded-full ${d.className}`}
            style={{ "--dx": d.dx, "--dy": d.dy } as CSSProperties}
          />
        ))}

        <div className="stage-mascot relative origin-bottom">
          <div className="absolute -inset-[5%] rotate-[9deg] rounded-[2.4rem] bg-brand" />
          <svg viewBox="2 8 116 104" className="relative w-full -rotate-3 drop-shadow-[0_14px_22px_rgb(21_19_43/0.25)]">
            <rect x="6" y="12" width="108" height="96" rx="26" fill="#E4DEFF" />
            <g className="stage-face-kaget">
              <MascotFace mood="kaget" />
            </g>
            <g className="stage-face-senyum">
              <MascotFace mood="senyum" />
            </g>
            <g className="stage-face-kedip">
              <MascotFace mood="kedip" />
            </g>
            <g className="stage-face-tawa">
              <MascotFace mood="tertawa" />
            </g>
          </svg>
        </div>

        <div className="stage-shadow mx-auto mt-4 h-5 w-3/4 rounded-full bg-[radial-gradient(closest-side,rgb(21_19_43/0.3),transparent)]" />
      </div>
    </div>
  );
}
