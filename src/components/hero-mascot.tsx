"use client";

import { useEffect, useRef, useState } from "react";
import { MascotFace } from "./mascot";

const INK = "#15132B";
const MAX_LOOK = 4; // seberapa jauh mata boleh melirik (unit viewBox)

// Maskot hero: matanya ngikutin kursor, sesekali kedip,
// dan ketawa saat tombol "Yuk webkeun" di-hover (diatur di globals.css).
export function HeroMascot({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onMove(e: PointerEvent) {
      const svg = svgRef.current;
      const eyes = eyesRef.current;
      if (!svg || !eyes) return;
      const box = svg.getBoundingClientRect();
      const dx = e.clientX - (box.left + box.width / 2);
      const dy = e.clientY - (box.top + box.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(dist / 200, 1) * MAX_LOOK;
      eyes.style.transform = `translate(${(dx / dist) * reach}px, ${(dy / dist) * reach}px)`;
    }

    let timer: ReturnType<typeof setTimeout>;
    function scheduleBlink() {
      timer = setTimeout(
        () => {
          setBlink(true);
          timer = setTimeout(() => {
            setBlink(false);
            scheduleBlink();
          }, 260);
        },
        2800 + Math.random() * 3200,
      );
    }

    window.addEventListener("pointermove", onMove);
    scheduleBlink();
    return () => {
      window.removeEventListener("pointermove", onMove);
      clearTimeout(timer);
    };
  }, []);

  return (
    <svg ref={svgRef} viewBox="2 8 116 104" className={className} aria-hidden="true">
      <rect x="6" y="12" width="108" height="96" rx="26" fill="#E4DEFF" />
      <g className="mascot-normal transition-opacity duration-150">
        {blink ? (
          <MascotFace mood="kedip" />
        ) : (
          <>
            <g ref={eyesRef} className="transition-transform duration-100 ease-out">
              <circle cx="44" cy="54" r="7" fill={INK} />
              <circle cx="76" cy="54" r="7" fill={INK} />
            </g>
            <circle cx="28" cy="70" r="5" fill="#5B3DF5" />
            <circle cx="92" cy="70" r="5" fill="#5B3DF5" />
            <path
              d="M40 70 Q 46 86, 53 77 Q 60 68, 67 77 Q 74 86, 80 70"
              fill="none"
              stroke={INK}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </g>
      <g className="mascot-laugh opacity-0 transition-opacity duration-150">
        <MascotFace mood="tertawa" />
      </g>
    </svg>
  );
}
