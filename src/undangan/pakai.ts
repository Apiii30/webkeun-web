"use client";

import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

// Hook bersama untuk semua tema undangan.

// Undangan dibuka lewat sampul: halaman dikunci sampai tamu menekan "Buka undangan".
// halus: scroll dibuat halus dengan Lenis (dimatikan kalau tamu memilih "kurangi gerakan").
// Tema yang efek scroll-nya memakai CSS scroll-driven animation sebaiknya halus: false,
// karena Lenis menggeser halaman lewat JavaScript dan efeknya jadi tertinggal satu frame (terlihat kedut).
export function useBukaUndangan({ halus = true }: { halus?: boolean } = {}) {
  const [opened, setOpened] = useState(false);
  const lenis = useRef<Lenis | null>(null);

  // Mulai dari paling atas setiap kali dibuka, lalu nyalakan scroll halus
  useEffect(() => {
    const root = document.documentElement;
    history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!halus) {
      return () => {
        history.scrollRestoration = "auto";
      };
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.style.scrollBehavior = "auto"; // supaya tidak bentrok dengan Lenis
    const l = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
    lenis.current = l;
    return () => {
      l.destroy();
      lenis.current = null;
      root.style.scrollBehavior = "";
      history.scrollRestoration = "auto";
    };
  }, [halus]);

  // Halaman dikunci sampai undangan dibuka
  useEffect(() => {
    if (opened) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    lenis.current?.stop();
    return () => {
      root.style.overflow = "";
      lenis.current?.start();
    };
  }, [opened]);

  function open() {
    window.scrollTo({ top: 0, behavior: "instant" });
    lenis.current?.scrollTo(0, { immediate: true, force: true });
    setOpened(true);
  }

  return { opened, open };
}

// Sisa waktu menuju acara, diperbarui tiap detik. Bernilai null sebelum dihitung di browser
// (supaya HTML dari server dan browser sama).
export function useHitungMundur(target: string) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [target]);

  const units: [number | null, string][] = [
    [left === null ? null : Math.floor(left / 86_400_000), "Hari"],
    [left === null ? null : Math.floor(left / 3_600_000) % 24, "Jam"],
    [left === null ? null : Math.floor(left / 60_000) % 60, "Menit"],
    [left === null ? null : Math.floor(left / 1000) % 60, "Detik"],
  ];
  return units;
}

// Link "simpan ke Google Calendar" untuk acara pernikahan
export function calendarLink(u: { wanita: { panggilan: string }; pria: { panggilan: string }; mulai: string; selesai: string; lokasi: { nama: string; alamat: string } }) {
  const z = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: `Pernikahan ${u.wanita.panggilan} & ${u.pria.panggilan}`,
    dates: `${z(u.mulai)}/${z(u.selesai)}`,
    location: `${u.lokasi.nama}, ${u.lokasi.alamat}`,
  })}`;
}
