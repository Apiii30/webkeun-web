"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { Biji } from "./biji";
import { Cerita } from "./cerita";
import { Kepala } from "./kepala";
import { Lokasi } from "./lokasi";
import { Menu } from "./menu";
import { Pembuka } from "./pembuka";
import { Pesan } from "./pesan";
import { Suasana } from "./suasana";

export function Kawalu() {
  // Scroll halus untuk roda mouse (layar sentuh tetap scroll bawaan). Dimatikan kalau "kurangi gerakan".
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    const l = new Lenis({ autoRaf: true, anchors: { offset: -60 }, lerp: 0.11 });
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
        <Cerita />
        <Menu />
        <Pesan />
        <Biji />
        <Suasana />
        <Lokasi />
      </main>
    </>
  );
}
