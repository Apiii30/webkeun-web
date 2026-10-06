import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Sumber ikon layar utama iPhone/iPad (src/app/apple-icon.png; Safari tidak memakai icon.svg). Situs memakai PNG-nya;
// cara membuat ulang sama seperti opengraph-image.tsx di folder ini (hasilnya .next/server/app/apple-icon.body).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const logo = `data:image/svg+xml;base64,${(await readFile(join(process.cwd(), "public/brand/logo-wk-putih.svg"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#5B3DF5" }}>
        <img src={logo} width={118} height={84} alt="" />
      </div>
    ),
    size,
  );
}
