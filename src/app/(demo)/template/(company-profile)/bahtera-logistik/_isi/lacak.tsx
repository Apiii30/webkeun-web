"use client";

import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useState } from "react";
import { contohResi, lacak } from "./data";
import { MONO, STENSIL } from "./gaya";

// Lacak kiriman (demo). Bergaya surat jalan: nomor resi contoh menampilkan riwayat perjalanan barang.
// Di website sungguhan, bagian ini disambungkan ke sistem pelacakan perusahaan.

export function Lacak() {
  const [resi, setResi] = useState("");
  const [hasil, setHasil] = useState<"ada" | "tidak" | null>(null);

  function cari(e?: FormEvent, nilai = resi) {
    e?.preventDefault();
    setHasil(nilai.trim().toUpperCase() === contohResi ? "ada" : "tidak");
  }

  return (
    <section id="lacak" className="bg-[#eeeae1] py-20 text-[#10213a] md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:px-8">
        <div>
          <p className={`${MONO} text-[11px] tracking-[0.16em] text-[#b8432f] uppercase md:text-xs`}>● Lacak kiriman</p>
          <h2 className={`${STENSIL} mt-3 text-[12vw] leading-[0.88] md:text-[5vw]`}>
            Barangmu
            <br />
            sudah sampai mana?
          </h2>
          <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-[#10213a]/70 md:text-base">
            Masukkan nomor resi dari surat jalan. Status diperbarui tiap kali barang berpindah tangan.
          </p>
          <form onSubmit={cari} className="mt-8 flex flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="bh-resi">
              Nomor resi
            </label>
            <input
              id="bh-resi"
              value={resi}
              onChange={(e) => setResi(e.target.value)}
              placeholder="Contoh: BLN-2610-0451"
              autoComplete="off"
              className={`${MONO} min-w-0 flex-1 rounded border-2 border-[#10213a] bg-white px-4 py-3 text-sm uppercase outline-none placeholder:normal-case focus:border-[#b8432f]`}
            />
            <button type="submit" className="rounded bg-[#10213a] px-6 py-3 text-sm font-bold text-[#eeeae1] transition-colors hover:bg-[#b8432f]">
              Lacak
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setResi(contohResi);
              cari(undefined, contohResi);
            }}
            className={`${MONO} mt-3 text-xs text-[#10213a]/60 underline underline-offset-4 hover:text-[#b8432f]`}
          >
            Pakai nomor resi contoh
          </button>
        </div>

        {/* surat jalan */}
        <div className="relative rounded-sm bg-white p-5 shadow-[0_24px_50px_-30px_rgb(16_33_58/0.6)] ring-1 ring-[#10213a]/10 md:p-8">
          <div className={`${MONO} flex items-start justify-between gap-4 border-b-2 border-dashed border-[#10213a]/25 pb-4 text-[11px] uppercase md:text-xs`}>
            <div>
              <p className="text-[#10213a]/50">Surat jalan</p>
              <p className="mt-1 text-sm font-bold md:text-base">{hasil === "ada" ? lacak.resi : "— — —"}</p>
            </div>
            <p className="text-right text-[#10213a]/50">
              PT Bahtera Lintas
              <br />
              Nusantara
            </p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {hasil === "ada" ? (
              <motion.div key="ada" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <dl className={`${MONO} mt-4 grid grid-cols-2 gap-3 text-[11px] uppercase md:text-xs`}>
                  {[
                    ["Rute", lacak.rute],
                    ["Muatan", lacak.muatan],
                    ["Kapal", lacak.kapal],
                    ["Status", "Dalam pelayaran"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[#10213a]/50">{k}</dt>
                      <dd className={`mt-0.5 font-bold ${k === "Status" ? "text-[#b8432f]" : ""}`}>{v}</dd>
                    </div>
                  ))}
                </dl>
                <ol className="relative mt-6 space-y-5 border-l-2 border-[#10213a]/15 pl-6">
                  {lacak.langkah.map((l, i) => (
                    <motion.li
                      key={l.teks}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.12 }}
                      className="relative"
                    >
                      <span
                        className={`absolute top-1 -left-[1.95rem] size-3.5 rounded-full border-2 ${
                          l.selesai ? "border-[#10213a] bg-[#10213a]" : i === 3 ? "border-[#b8432f] bg-white" : "border-[#10213a]/30 bg-white"
                        }`}
                      />
                      <p className={`${MONO} text-[11px] text-[#10213a]/50 uppercase`}>{l.waktu}</p>
                      <p className={`mt-0.5 text-[15px] ${l.selesai ? "font-semibold" : "text-[#10213a]/60"}`}>{l.teks}</p>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            ) : (
              <motion.p key={hasil ?? "kosong"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-14 text-center text-[15px] text-[#10213a]/60">
                {hasil === "tidak" ? (
                  <>
                    Nomor resi tidak ditemukan.
                    <br />
                    <span className={`${MONO} text-xs`}>Ini demo, coba {contohResi}</span>
                  </>
                ) : (
                  "Riwayat perjalanan barang akan tampil di sini."
                )}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
