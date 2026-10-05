"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { kedai, struk, waPesan } from "./data";
import { useDiam } from "./diam";
import { JUDUL, MONO, TANGAN } from "./gaya";
import s from "./kawalu.module.css";

// Pesan antar. Struk paket keluar dari celah printer kasir mengikuti scroll (makin digulir, makin panjang).

const rp = (n: number) => n.toLocaleString("id-ID");

export function Pesan() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 80%", "start 10%"] });
  const cetak = useTransform(p, [0, 1], ["-100%", "0%"]);
  const total = struk.baris.reduce((a, [, , h]) => a + h, 0) - struk.potongan;
  const teksWA = `Halo ${kedai.nama}! Aku mau pesan ${struk.paket} (Rp${rp(total)}). Diantar ke: `;

  return (
    <section ref={ref} id="pesan" className="relative bg-[#f3ead8] pt-[18svh] pb-20 text-[#22140e] md:pt-[20svh] md:pb-28">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 md:grid-cols-[1fr_1.1fr] md:gap-16 md:px-8">
        {/* printer kasir + struk */}
        <div className="mx-auto w-full max-w-[330px] md:order-1">
          <div className="relative z-10 rounded-2xl bg-[#2b221c] px-5 pt-4 pb-3 shadow-[0_18px_30px_-18px_rgb(0_0_0/0.6)]">
            <div className="flex items-center justify-between">
              <span className={`${MONO} text-[10px] tracking-[0.2em] text-[#f3ead8]/50 uppercase`}>Kasir 01</span>
              <span className="size-2 rounded-full bg-[#3fbf6a]" />
            </div>
            <div className="mt-3 h-2 rounded-full bg-black/70" />
          </div>
          <div className="-mt-1 overflow-hidden px-3">
            <motion.div style={diam ? undefined : { y: cetak }} className={`${s.gerigi} ${MONO} bg-[#fffdf6] px-5 pt-6 pb-8 text-[12.5px] leading-relaxed shadow-[0_10px_24px_-14px_rgb(0_0_0/0.4)]`}>
              <p className="text-center font-bold tracking-[0.12em] uppercase">{kedai.nama}</p>
              <p className="text-center text-[11px] text-[#22140e]/60">Cipocok Jaya · Kota Serang</p>
              <p className="my-3 border-t border-dashed border-[#22140e]/40" />
              <p className="font-bold uppercase">{struk.paket}</p>
              {struk.baris.map(([n, nama, h]) => (
                <div key={nama} className="flex justify-between gap-3">
                  <span>
                    {n}× {nama}
                  </span>
                  <span>{rp(h)}</span>
                </div>
              ))}
              <div className="flex justify-between gap-3 text-[#c3312b]">
                <span>Potongan paket</span>
                <span>-{rp(struk.potongan)}</span>
              </div>
              <p className="my-3 border-t border-dashed border-[#22140e]/40" />
              <div className="flex justify-between text-base font-bold">
                <span>TOTAL</span>
                <span>Rp{rp(total)}</span>
              </div>
              <p className="mt-1 text-[11px] text-[#22140e]/60">Ongkir gratis ≤ 3 km</p>
              <p className="my-3 border-t border-dashed border-[#22140e]/40" />
              <p className="text-center text-[11px] tracking-[0.1em] uppercase">Terima kasih, sampai ketemu lagi!</p>
              <div className={`${s.barcode} mx-auto mt-3 h-10 w-[85%]`} />
              <p className="mt-1 text-center text-[10px] tracking-[0.3em]">0021 0507 2026</p>
            </motion.div>
          </div>
        </div>

        <div className="md:order-2 md:pt-6">
          <p className={`${MONO} text-[11px] tracking-[0.16em] uppercase md:text-xs`}>
            <span className="text-[#c3312b]">●</span> Pesan antar
          </p>
          <h2 className={`${JUDUL} mt-3 text-[15vw] leading-[0.82] md:text-[6.5vw]`}>
            Mager?
            <br />
            Kami antar.
          </h2>
          <p className={`${TANGAN} mt-4 text-[1.7rem] leading-tight text-[#c3312b]`}>paket ngopi berdua lagi hemat 10rb</p>
          <ul className="mt-6 space-y-3 text-[16px] md:text-lg">
            {[
              "Gratis ongkir sampai 3 km dari kedai, minimal belanja 50rb.",
              "Diantar kurir kami sendiri, es kopinya dijamin belum cair.",
              "Antar tiap hari pukul 09.00–21.00.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <svg viewBox="0 0 20 20" className="mt-1 size-5 shrink-0 text-[#2f4b2f]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m4 10.5 4 4 8-9" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={waPesan(teksWA)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#c3312b] px-6 py-3.5 text-center font-bold text-[#f3ead8] transition-transform hover:-translate-y-0.5"
            >
              Pesan lewat WhatsApp
            </a>
            <div className="flex gap-2">
              {[
                ["GoFood", "https://gofood.co.id"],
                ["GrabFood", "https://food.grab.com/id/id/"],
                ["ShopeeFood", "https://shopee.co.id/m/shopeefood"],
              ].map(([n, u]) => (
                <a
                  key={n}
                  href={u}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full border-2 border-[#22140e] px-4 py-3 text-center text-sm font-bold transition-colors hover:bg-[#22140e] hover:text-[#f3ead8]"
                >
                  {n}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
