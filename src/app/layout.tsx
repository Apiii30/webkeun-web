import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ogDasar, judulUtama, SITUS } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Alamat situs yang sudah online, untuk link gambar pratinjau (mis. foto undangan saat link dibagikan di WhatsApp).
  // Diisi lewat SITUS_URL di .env.production sebelum build untuk hosting; tanpa itu gambarnya mengarah ke localhost.
  metadataBase: SITUS,
  title: { default: judulUtama, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: ogDasar,
  twitter: { card: "summary_large_image" },
};

// Saat halaman di-refresh, mulai lagi dari paling atas: matikan pemulihan scroll bawaan browser
// dan buang #anchor dari URL. Dijalankan inline di <head> supaya sempat sebelum browser melompat.
// Hanya untuk refresh; link dengan #anchor yang dibuka langsung tetap menuju section-nya.
// Setelah pengunjung mulai berinteraksi, pemulihan scroll dikembalikan supaya tombol back tetap normal.
const scrollTopOnReload = `(function () {
  try {
    var nav = performance.getEntriesByType("navigation")[0];
    if (!nav || nav.type !== "reload") return;
    history.scrollRestoration = "manual";
    if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
    var toTop = function () { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); };
    var restore = function () {
      history.scrollRestoration = "auto";
      ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (e) { removeEventListener(e, restore); });
    };
    toTop();
    addEventListener("load", function () {
      toTop();
      ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (e) {
        addEventListener(e, restore, { once: true, passive: true });
      });
    });
  } catch (e) {}
})();`;

// Paket gerak (lihat globals.css & components/gerak.tsx): <html> diberi .gerak sebelum halaman tampil supaya elemen
// bertanda data-gerak bisa disembunyikan dulu lalu dimunculkan saat digulir. Tidak dipasang untuk "kurangi gerakan".
// Pengaman: kalau dalam 3 detik pengamatnya belum jalan (JavaScript lambat/gagal), .gerak dilepas & semua terlihat.
const gerak = `(function () {
  try {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    var akar = document.documentElement;
    akar.classList.add("gerak");
    setTimeout(function () { if (!window.__gerak) akar.classList.remove("gerak"); }, 3000);
  } catch (e) {}
})();`;

// Penghalang ringan supaya desain tidak gampang dicontek: klik kanan, seret gambar, dan pintasan DevTools / lihat
// sumber / simpan halaman dimatikan. Ini hanya penghalang, bukan pengaman: kode yang sampai ke browser tetap bisa
// dilihat lewat menu browser. Klik kanan di kolom isian tetap boleh (untuk tempel), dan halaman /rekap tidak ikut
// karena dipakai klien untuk menyalin link. Hanya di hasil build, supaya saat `npm run dev` DevTools tetap bisa dipakai.
const penghalang = `(function () {
  var bebas = function () { return location.pathname.indexOf("/rekap") === 0; };
  addEventListener("contextmenu", function (e) {
    if (bebas() || (e.target.closest && e.target.closest("input, textarea, select, [contenteditable]"))) return;
    e.preventDefault();
  });
  addEventListener("dragstart", function (e) {
    if (!bebas() && e.target.tagName === "IMG") e.preventDefault();
  });
  addEventListener("keydown", function (e) {
    if (bebas()) return;
    var k = e.code, mod = e.ctrlKey || e.metaKey, alat = k === "KeyI" || k === "KeyJ" || k === "KeyC";
    if (k === "F12" || (mod && e.shiftKey && alat) || (e.metaKey && e.altKey && (alat || k === "KeyU")) || (mod && (k === "KeyU" || k === "KeyS"))) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior: scroll halus hanya untuk anchor di halaman yang sama;
    // saat pindah halaman Next langsung mulai dari atas (Next 16 tidak melakukannya otomatis lagi)
    // suppressHydrationWarning: kelas .gerak dipasang skrip sebelum React berjalan
    <html lang="id" data-scroll-behavior="smooth" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scrollTopOnReload }} />
        <script dangerouslySetInnerHTML={{ __html: gerak }} />
        {process.env.NODE_ENV === "production" && <script dangerouslySetInnerHTML={{ __html: penghalang }} />}
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
