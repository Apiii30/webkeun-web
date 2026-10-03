"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { Undangan } from "../../types";
import { Danau, Gambar, Muncul, Pembatas, Perahu, gilda, naskah } from "./hias";
import s from "./porselen.module.css";

// Kisah cinta sebagai perjalanan horizontal: bagian ini setinggi n layar, isinya menempel di layar dan bab-bab
// bergeser ke samping mengikuti scroll. Lapisan latar (pegunungan & perahu) bergerak lebih lambat, bunga di depan
// lebih cepat, dan di dalam tiap bab foto, angka tahun & teks punya kecepatan masing-masing.
// Semua murni CSS scroll-driven (porselen.module.css). Tanpa dukungan browser, bab-bab tersusun ke bawah biasa.

const JALAN: Record<number, string | undefined> = { 2: s.jalan2, 3: s.jalan3, 4: s.jalan4, 5: s.jalan5, 6: s.jalan6 };

export function Kisah({ u }: { u: Undangan }) {
  const n = u.cerita.length;
  const foto = (i: number) => u.foto.galeri[(i * 2 + 1) % u.foto.galeri.length];
  // rentang timeline saat bab ke-i melintas (jalur bergerak di contain 4%–96%)
  const rentang = (i: number) => {
    const t = (k: number) => 4 + (92 * k) / Math.max(1, n - 1);
    return { animationRange: `contain ${t(i - 1).toFixed(2)}% contain ${t(i + 1).toFixed(2)}%` } as CSSProperties;
  };

  return (
    <section id="cerita" className={`${s.kisahLuar} relative`} style={{ "--n": n } as CSSProperties}>
      <svg viewBox="0 0 440 28" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-7 w-full -translate-y-[98%]" aria-hidden="true">
        <path d="M0 28V16C40 4 80 4 120 14s80 12 120 2 80-14 120-4 60 8 80 4V28Z" fill="#f6f3ec" />
      </svg>
      <div className={`${s.kisahLekat} ${s.kertas} relative`}>
        {/* lapisan latar & depan (hanya saat efek horizontal aktif) */}
        <div className={`${s.kisahLapis} pointer-events-none absolute inset-0`} aria-hidden="true">
          <div className={`${s.kisahJauh} absolute top-[50%] left-0 flex w-[150%] opacity-40 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]`}>
            <Gambar a="gunung" sizes="440px" className="w-1/2!" />
            <Gambar a="gunung" sizes="440px" flip className="w-1/2!" />
          </div>
          <Danau className="inset-x-0 bottom-0 h-[17%]" />
          <div className={`${s.kisahJauh} absolute bottom-[12%] left-0 h-[10%] w-[150%]`}>
            <Perahu className="bottom-0 left-[8%] w-[7%]" />
            <Perahu className="bottom-1 left-[52%] w-[5%]" jeda={-6} />
            <Perahu className="bottom-0 left-[84%] w-[6%]" jeda={-12} />
          </div>
          <div className={`${s.kisahDekat} absolute bottom-[-3%] left-0 flex h-[20%] w-[500%] items-end`}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="relative h-full flex-1">
                <div className={`absolute bottom-0 w-[60%] ${i % 2 ? "right-[6%]" : "left-[4%]"}`}>
                  <Gambar a={i % 3 === 1 ? "hortensia" : i % 3 === 2 ? "peonyBiru" : "peony"} sizes="160px" flip={i % 2 === 1} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* judul & penanda perjalanan */}
        <div className="relative z-10 px-6 pt-[max(4.5rem,9svh)] text-center">
          <p className="text-[10px] tracking-[0.45em] text-[#b8934f] uppercase">Perjalanan kami</p>
          <h2 className={`${naskah} text-[3rem] leading-tight text-[#1f3768]`}>Kisah Cinta</h2>
          <Pembatas />
          <div className={`${s.kisahBatang} mx-auto mt-3 h-[2px] w-40 origin-left bg-gradient-to-r from-[#27427a] to-[#d8b56e]`} />
        </div>

        {/* jalur bab */}
        <div className={`${s.kisahJalur} ${JALAN[n] ?? ""} relative`}>
          {u.cerita.map((c, i) => (
            <article key={c.tahun} className="relative px-8 pt-6 pb-16">
              <p
                className={`${s.babAngka} ${gilda} pointer-events-none absolute top-[2%] left-1/2 -translate-x-1/2 text-[7.5rem] leading-none text-transparent opacity-25 [-webkit-text-stroke:1.2px_#27427a]`}
                style={rentang(i)}
                aria-hidden="true"
              >
                {c.tahun}
              </p>
              <Muncul dari="scale(0.85)" amount={0.2} className="relative mx-auto w-[56%]">
                <div className={s.babFoto} style={rentang(i)}>
                  <div className={`${s.kawung} relative aspect-[3/4] rounded-t-full rounded-b-xl p-[6px] shadow-[0_18px_28px_-18px_rgb(20_35_70/0.9)]`}>
                    <div className="h-full w-full rounded-t-full rounded-b-lg bg-[#fbfaf6] p-[2px]">
                      <div className="relative h-full w-full overflow-hidden rounded-t-full rounded-b-md">
                        <Image src={foto(i).src} alt={foto(i).alt} fill sizes="240px" className="object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </Muncul>
              <Muncul jeda={0.15} amount={0.2} className="relative mt-5 text-center">
                <div className={s.babTeks} style={rentang(i)}>
                  <p className={`${gilda} text-[11px] tracking-[0.35em] text-[#b8934f] uppercase`}>
                    Bab {i + 1} · {c.tahun}
                  </p>
                  <h3 className={`${naskah} mt-1 text-[2.4rem] leading-none text-[#1f3768]`}>{c.judul}</h3>
                  <p className="mx-auto mt-3 max-w-[18rem] text-[13.5px] leading-relaxed text-[#27427a]/90">{c.isi}</p>
                </div>
              </Muncul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
