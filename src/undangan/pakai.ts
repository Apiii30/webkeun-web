"use client";

import Lenis from "lenis";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Hook bersama untuk semua tema undangan.

// Undangan dibuka lewat sampul: halaman dikunci sampai tamu menekan "Buka undangan".
// halus: scroll dibuat halus dengan Lenis (dimatikan kalau tamu memilih "kurangi gerakan").
// Tema yang efek scroll-nya memakai CSS scroll-driven animation sebaiknya halus: false,
// karena Lenis menggeser halaman lewat JavaScript dan efeknya jadi tertinggal satu frame (terlihat kedut).
export function useBukaUndangan({ halus = true }: { halus?: boolean } = {}) {
  const [opened, setOpened] = useState(false);
  const lenis = useRef<Lenis | null>(null);
  useJedaAnimasiLuarLayar();

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

// Animasi berulang (kelopak hanyut, kilau air, burung, dst.) tetap dihitung browser walaupun bagiannya jauh dari layar.
// Satu tema bisa punya 100-200 animasi seperti ini, jadi di HP murah HP-nya cepat panas dan baterainya boros. Di sini
// animasi berulang dijeda (style inline animation-play-state) selama wadahnya lebih dari satu layar dari layar, lalu
// dilepas lagi sebelum terlihat. Animasi sekali jalan dan animasi ikut-gulir (animation-timeline) tidak disentuh, begitu
// juga elemen yang jedanya sudah diatur temanya sendiri lewat style inline.
export function useJedaAnimasiLuarLayar() {
  useEffect(() => {
    if (!document.getAnimations) return;
    type El = HTMLElement | SVGElement;
    const isi = new Map<Element, Set<El>>(); // wadah -> elemen beranimasi di dalamnya
    const dijeda = new Set<El>();
    const dikenal = new WeakSet<Element>();

    // Posisi diukur langsung, bukan dengan IntersectionObserver: observer tidak melihat posisi elemen yang sedang
    // digeser animasi CSS (dijalankan GPU), jadi burung yang terbang melintas dikira masih di luar layar.
    const periksa = () => {
      const h = innerHeight;
      for (const [wadah, daftar] of isi) {
        if (!wadah.isConnected) {
          for (const el of daftar) dijeda.delete(el);
          isi.delete(wadah);
          continue;
        }
        const r = wadah.getBoundingClientRect();
        const dekat = r.bottom > -h && r.top < 2 * h;
        for (const el of daftar) {
          if (dekat && dijeda.has(el)) {
            el.style.animationPlayState = "";
            dijeda.delete(el);
          } else if (!dekat && !dijeda.has(el) && !el.style.animationPlayState) {
            el.style.animationPlayState = "paused";
            dijeda.add(el);
          }
        }
      }
    };

    // Animasi baru muncul saat kelas berganti (undangan dibuka, bagian muncul), jadi dipindai ulang berkala
    const pindai = () => {
      for (const a of document.getAnimations()) {
        const efek = a.effect as KeyframeEffect | null;
        const el = efek?.target;
        if (!el || dikenal.has(el) || !(a instanceof CSSAnimation) || !(a.timeline instanceof DocumentTimeline) || efek.pseudoElement) continue;
        if (efek.getTiming().iterations !== Infinity || !(el instanceof HTMLElement || el instanceof SVGElement)) continue;
        dikenal.add(el);
        // wadah = induk terdekat yang tidak ikut bergerak; elemennya sendiri (kelopak jatuh, burung terbang) bisa
        // sedang di luar layar walaupun bagiannya terlihat
        let wadah: Element = el.parentElement ?? el;
        while (wadah.parentElement && (getComputedStyle(wadah).display === "contents" || wadah.getAnimations().some((x) => x.playState === "running"))) wadah = wadah.parentElement;
        isi.set(wadah, (isi.get(wadah) ?? new Set<El>()).add(el));
      }
      periksa();
    };

    let tunggu = 0;
    const saatGulir = () => {
      tunggu ||= window.setTimeout(() => {
        tunggu = 0;
        periksa();
      }, 150);
    };
    addEventListener("scroll", saatGulir, { capture: true, passive: true });
    pindai();
    const jam = setInterval(pindai, 2000);
    return () => {
      clearInterval(jam);
      clearTimeout(tunggu);
      removeEventListener("scroll", saatGulir, { capture: true });
      for (const el of dijeda) el.style.animationPlayState = "";
    };
  }, []);
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

// Parallax CSS (scroll-driven animation) hanya mulus bila browser menjalankannya di GPU, terpisah dari scroll
// halaman. Chrome/Edge/Android sudah lama begitu; Safari baru sejak versi 26.4 (sebelumnya dihitung di thread
// utama sehingga elemen tertinggal dari scroll dan terlihat bergetar). Browser lain & "kurangi gerakan": tanpa
// parallax. Tema memasang hasilnya sebagai atribut data-paralaks, dan CSS-nya hanya aktif di bawah atribut itu.
function paralaksMulus() {
  if (!CSS.supports("animation-timeline: view()") || matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const ua = navigator.userAgent;
  if (/Chrome\/|Chromium\//.test(ua)) return true;
  // Safari menulis versinya di "Version/26.4"; aplikasi lain di iPhone (WhatsApp, Instagram) tidak, dan
  // versi iOS di UA-nya dibekukan sejak iOS 26, jadi yang tidak jelas versinya dianggap tidak mendukung.
  const v = ua.match(/Version\/(\d+)\.(\d+)/);
  return !!v && (+v[1] > 26 || (+v[1] === 26 && +v[2] >= 4));
}
const ikutGerak = (cb: () => void) => {
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
export function useParalaks() {
  return useSyncExternalStore(ikutGerak, paralaksMulus, () => false);
}
