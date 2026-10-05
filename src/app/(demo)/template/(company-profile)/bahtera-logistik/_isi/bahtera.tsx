"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { Armada } from "./armada";
import { Kepala } from "./kepala";
import { Kontak } from "./kontak";
import { Lacak } from "./lacak";
import { Layanan } from "./layanan";
import { Pembuka } from "./pembuka";
import { Rute } from "./rute";
import { Tentang } from "./tentang";

export function Bahtera() {
  // Scroll halus untuk roda mouse (layar sentuh tetap scroll bawaan). Dimatikan kalau "kurangi gerakan".
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    const l = new Lenis({ autoRaf: true, anchors: { offset: -56 }, lerp: 0.11 });
    return () => {
      l.destroy();
      root.style.scrollBehavior = "";
    };
  }, []);

  return (
    <>
      <Kepala />
      <main>
        <Pembuka />
        <Rute />
        <Layanan />
        <Armada />
        <Lacak />
        <Tentang />
        <Kontak />
      </main>
    </>
  );
}
