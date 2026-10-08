"use client";

import { useEffect } from "react";

// Pengamat "Paket gerak Webkeun": menambahkan .tampil pada elemen bertanda data-gerak saat masuk layar (atau sudah
// terlewat di atas), termasuk elemen yang muncul belakangan (pindah halaman, filter, dsb.). Efeknya diatur di
// globals.css. Berjalan setelah hydration supaya React tidak melihat kelas yang berubah sebelum ia selesai.
export function PengamatGerak() {
  useEffect(() => {
    const akar = document.documentElement;
    (window as { __gerak?: boolean }).__gerak = true;
    if (!akar.classList.contains("gerak")) return;

    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
            e.target.classList.add("tampil");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const amati = (el: Element) => {
      if (el.matches("[data-gerak]:not(.tampil)")) io.observe(el);
      el.querySelectorAll("[data-gerak]:not(.tampil)").forEach((x) => io.observe(x));
    };
    amati(document.body);
    const mo = new MutationObserver((ms) => {
      for (const m of ms) m.addedNodes.forEach((n) => n instanceof Element && amati(n));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
