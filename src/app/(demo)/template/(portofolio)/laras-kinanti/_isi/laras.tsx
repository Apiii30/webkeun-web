"use client";

import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { Kepala, Kontak, Layanan, Tentang } from "./bagian";
import s from "./laras.module.css";
import { Lihat } from "./lihat";
import { Pembuka } from "./pembuka";
import { Rol } from "./rol";
import { Seri } from "./seri";

export function Laras() {
  const [buka, setBuka] = useState<number | null>(null);
  const lenis = useRef<Lenis | null>(null);

  // Scroll halus untuk roda mouse (layar sentuh tetap scroll bawaan). Dimatikan kalau "kurangi gerakan".
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    const l = new Lenis({ autoRaf: true, anchors: true, lerp: 0.11 });
    lenis.current = l;
    return () => {
      l.destroy();
      lenis.current = null;
      root.style.scrollBehavior = "";
    };
  }, []);

  // Kunci halaman selama galeri terbuka
  useEffect(() => {
    if (buka === null) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    lenis.current?.stop();
    return () => {
      root.style.overflow = "";
      lenis.current?.start();
    };
  }, [buka]);

  return (
    <>
      <Kepala />
      <main>
        <Pembuka />
        <Seri onBuka={setBuka} />
        <Rol />
        <Tentang />
        <Layanan />
        <Kontak />
      </main>
      <div className={s.butir} aria-hidden="true" />
      <Lihat buka={buka} onTutup={() => setBuka(null)} />
    </>
  );
}
