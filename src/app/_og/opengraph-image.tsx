import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Sumber gambar pratinjau link halaman Webkeun (public/brand/pratinjau.png, dipasang di src/lib/seo.ts). Situs memakai
// PNG jadinya, bukan berkas ini: pembuat gambar next/og menambah ±0,8 MB ke server Cloudflare (batas paket gratis 3 MB),
// padahal gambarnya cukup dibuat sekali. Folder _og tidak ikut menjadi halaman.
// Membuat ulang setelah desain diubah: salin berkas ini ke src/app/opengraph-image.tsx di salinan project, jalankan
// `next build` di sana, lalu ambil .next/server/app/opengraph-image.body sebagai pratinjau.png yang baru.

export const alt = "Webkeun: undangan digital pernikahan dan jasa pembuatan website";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// alamat berkas ditulis utuh (bukan dirangkai dari variabel) supaya hanya berkas ini yang ikut ke server, bukan
// seluruh folder project
const svg = async (isi: Promise<Buffer>) => `data:image/svg+xml;base64,${(await isi).toString("base64")}`;

export default async function Image() {
  const [tebal, sedang, logo, maskot] = await Promise.all([
    readFile(join(process.cwd(), "src/app/_og/jakarta-800.ttf")),
    readFile(join(process.cwd(), "src/app/_og/jakarta-600.ttf")),
    svg(readFile(join(process.cwd(), "public/brand/logo-webkeun.svg"))),
    svg(readFile(join(process.cwd(), "public/brand/maskot-senyum.svg"))),
  ]);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#E4DEFF", color: "#15132B", fontFamily: "Jakarta", padding: "64px 72px" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <img src={logo} width={293} height={38} alt="" />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 70, fontWeight: 800, letterSpacing: -2, lineHeight: 1.08 }}>Undangan Digital</div>
            <div style={{ display: "flex", alignItems: "flex-end", fontSize: 62, fontWeight: 800, letterSpacing: -2, lineHeight: 1.1, color: "#5B3DF5" }}>
              & Pembuatan Website
              {/* garis miring mint, seperti di logo */}
              <div style={{ width: 13, height: 46, background: "#2FD3B0", transform: "skewX(-12.4deg)", marginLeft: 16, marginBottom: 12 }} />
            </div>
            <div style={{ marginTop: 26, fontSize: 25, fontWeight: 600, color: "rgba(21,19,43,0.68)" }}>Pernikahan · UMKM · Company Profile · Portofolio</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ display: "flex", background: "#15132B", color: "#FFFFFF", borderRadius: 999, padding: "12px 26px", fontSize: 26, fontWeight: 800 }}>webkeun.id</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "rgba(21,19,43,0.68)" }}>Konsultasi gratis lewat WhatsApp</div>
          </div>
        </div>

        <div style={{ display: "flex", position: "relative", width: 330, alignItems: "center", justifyContent: "center", marginLeft: 24 }}>
          <div style={{ position: "absolute", width: 290, height: 290, borderRadius: 64, background: "#5B3DF5", transform: "rotate(9deg)" }} />
          <img src={maskot} width={300} height={269} style={{ transform: "rotate(-4deg)" }} alt="" />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Jakarta", data: tebal, weight: 800, style: "normal" },
        { name: "Jakarta", data: sedang, weight: 600, style: "normal" },
      ],
    },
  );
}
