import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name}: Jasa Pembuatan Website UMKM, Company Profile & Portofolio`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    locale: "id_ID",
    type: "website",
  },
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scrollTopOnReload }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
