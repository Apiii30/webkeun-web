"use client";

import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import type { Lagu } from "./lagu";

// Musik latar bersama untuk semua tema undangan. Tiap tema hanya menggambar tombolnya sendiri (musik.tsx di folder
// temanya); memutar, menjeda, dan aturan browser diurus di sini.

const GERAKAN = ["pointerdown", "touchend", "click", "keydown"] as const;

// Lagu mulai saat "Buka Undangan" ditekan (panggil `mulai` di dalam handler klik itu: browser hanya mengizinkan
// audio bersuara sesudah ada interaksi). Bila tetap ditolak (mis. Safari iPhone), lagu dimulai pada sentuhan
// berikutnya di mana saja. Volume naik pelan, berhenti sementara saat tab/aplikasi ditinggal, dan tidak dinyalakan
// lagi otomatis bila tamu sendiri yang mematikannya.
export function useMusik(lagu?: Lagu) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const dimatikan = useRef(false);
  const lepasGerakan = useRef<() => void>(() => {});
  const [main, setMain] = useState(false);
  const src = lagu?.src;

  useEffect(() => {
    if (!src) return;
    const el = new Audio(src);
    el.loop = true;
    el.preload = "metadata";
    const on = () => setMain(true);
    const off = () => setMain(false);
    el.addEventListener("play", on);
    el.addEventListener("pause", off);
    audio.current = el;

    let lanjut = false;
    const tampak = () => {
      if (document.hidden) {
        lanjut = !el.paused;
        el.pause();
      } else if (lanjut) {
        el.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", tampak);
    return () => {
      lepasGerakan.current();
      document.removeEventListener("visibilitychange", tampak);
      el.removeEventListener("play", on);
      el.removeEventListener("pause", off);
      el.pause();
      el.removeAttribute("src");
      el.load();
      audio.current = null;
    };
  }, [src]);

  // Volume naik dari 0 dalam ±1,5 detik (iPhone mengabaikan volume dari kode, di sana langsung penuh)
  const putar = useCallback(() => {
    const el = audio.current;
    if (!el) return Promise.reject();
    el.volume = 0;
    return el.play().then(() => {
      const t0 = performance.now();
      const naik = (t: number) => {
        const k = Math.min(1, (t - t0) / 1500);
        el.volume = k * k;
        if (k < 1 && !el.paused) requestAnimationFrame(naik);
      };
      requestAnimationFrame(naik);
    });
  }, []);

  const mulai = useCallback(() => {
    if (dimatikan.current || !audio.current) return;
    putar().catch(() => {
      const lepas = () => GERAKAN.forEach((g) => window.removeEventListener(g, coba, true));
      function coba(e: Event) {
        const el = audio.current;
        if (!el || dimatikan.current || !el.paused) return lepas();
        // sentuhan pada tombol musik diurus tombol itu sendiri
        if ((e.target as Element | null)?.closest?.("[data-tombol-musik]")) return lepas();
        putar().then(lepas, () => {});
      }
      lepasGerakan.current = lepas;
      GERAKAN.forEach((g) => window.addEventListener(g, coba, true));
    });
  }, [putar]);

  const ubah = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      dimatikan.current = false;
      putar().catch(() => {});
    } else {
      dimatikan.current = true;
      el.pause();
    }
  }, [putar]);

  return { main, mulai, ubah, ada: !!src };
}

// Tempat tombol musik: pojok kanan atas kolom undangan (selebar HP), di atas semua lapisan kecuali modal.
// Muncul pelan setelah undangan dibuka.
export function SlotMusik({ muncul, jeda = 1.2, children }: { muncul: boolean; jeda?: number; children: ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3.5 z-[60] flex justify-center">
      <div className="flex w-full max-w-[440px] justify-end px-3.5">
        <AnimatePresence>
          {muncul && (
            <motion.div
              className="pointer-events-auto"
              initial={{ opacity: 0, transform: "scale(0.5) rotate(-30deg)" }}
              animate={{ opacity: 1, transform: "scale(1) rotate(0deg)" }}
              transition={{ duration: 0.9, delay: jeda, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Properti bersama untuk tombol musik setiap tema
export type PropsTombolMusik = { main: boolean; onUbah: () => void; lagu: Lagu };

export function atributTombol(main: boolean, lagu: Lagu) {
  return {
    type: "button" as const,
    "data-tombol-musik": "",
    "aria-pressed": main,
    "aria-label": main ? `Matikan musik: ${lagu.judul}, ${lagu.penyanyi}` : `Putar musik: ${lagu.judul}, ${lagu.penyanyi}`,
    title: `${lagu.judul} · ${lagu.penyanyi}`,
  };
}
