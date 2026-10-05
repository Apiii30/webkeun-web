"use client";

import { type FormEvent, useState } from "react";
import s from "./bahtera.module.css";
import { pt, waLink } from "./data";
import { MONO, STENSIL } from "./gaya";

// Minta penawaran. Formulir tidak dikirim ke server: isinya disusun jadi pesan WhatsApp ke bagian marketing.

const MUATAN = ["Kontainer 20 kaki", "Kontainer 40 kaki", "LCL (sebagian kontainer)", "Trucking darat", "Gudang", "Belum tahu"];

export function Kontak() {
  const [muatan, setMuatan] = useState(MUATAN[0]);

  function kirim(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const isi = (k: string) => String(d.get(k) ?? "").trim();
    const teks = [
      `Halo ${pt.singkat}, saya ${isi("nama")}${isi("perusahaan") ? ` dari ${isi("perusahaan")}` : ""}.`,
      `Minta penawaran: ${muatan}`,
      `Rute: ${isi("asal")} → ${isi("tujuan")}`,
      isi("barang") && `Barang: ${isi("barang")}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(waLink(teks), "_blank", "noopener,noreferrer");
  }

  const kolom =
    "mt-1.5 w-full rounded border-2 border-[#eeeae1]/20 bg-[#eeeae1]/[0.06] px-3.5 py-2.5 text-[15px] text-[#eeeae1] outline-none transition-colors placeholder:text-[#eeeae1]/35 focus:border-[#f2b33d]";

  return (
    <section id="penawaran" className="relative bg-[#10213a] text-[#eeeae1]">
      <div className={`${s.bahaya} h-3`} aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:px-8 md:py-28">
        <div>
          <p className={`${MONO} text-[11px] tracking-[0.16em] text-[#f2b33d] uppercase md:text-xs`}>● Minta penawaran</p>
          <h2 className={`${STENSIL} mt-3 text-[12vw] leading-[0.88] md:text-[5vw]`}>
            Ceritakan
            <br />
            muatanmu
          </h2>
          <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-[#eeeae1]/70 md:text-base">
            Tim marketing kami membalas di hari kerja yang sama dengan perkiraan biaya dan jadwal kapal terdekat.
          </p>
          <div className="mt-10 space-y-5">
            {pt.kantor.map((k) => (
              <div key={k.kota} className="border-t border-[#eeeae1]/15 pt-4">
                <p className={`${MONO} text-[11px] text-[#f2b33d] uppercase md:text-xs`}>
                  {k.kota} · {k.peran}
                </p>
                <p className="mt-1 text-[15px] text-[#eeeae1]/80">{k.alamat}</p>
              </div>
            ))}
            <p className={`${MONO} border-t border-[#eeeae1]/15 pt-4 text-sm`}>
              {pt.telepon}
              <br />
              <a href={`mailto:${pt.email}`} className="underline underline-offset-4 hover:text-[#f2b33d]">
                {pt.email}
              </a>
            </p>
          </div>
        </div>

        <form onSubmit={kirim} className="rounded-sm border-2 border-[#eeeae1]/15 p-5 md:p-8">
          <fieldset>
            <legend className={`${MONO} text-[11px] text-[#eeeae1]/60 uppercase md:text-xs`}>Jenis layanan</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {MUATAN.map((m) => (
                <label
                  key={m}
                  className={`cursor-pointer rounded border-2 px-3 py-1.5 text-sm font-semibold transition-colors has-focus-visible:ring-2 has-focus-visible:ring-[#f2b33d] ${
                    muatan === m ? "border-[#f2b33d] bg-[#f2b33d] text-[#10213a]" : "border-[#eeeae1]/20 hover:border-[#eeeae1]/50"
                  }`}
                >
                  <input type="radio" name="muatan" value={m} checked={muatan === m} onChange={() => setMuatan(m)} className="sr-only" />
                  {m}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className={`${MONO} block text-[11px] text-[#eeeae1]/60 uppercase md:text-xs`}>
              Kota asal
              <input name="asal" required placeholder="Surabaya" className={`${kolom} font-[family-name:var(--font-archivo)] normal-case`} />
            </label>
            <label className={`${MONO} block text-[11px] text-[#eeeae1]/60 uppercase md:text-xs`}>
              Kota tujuan
              <input name="tujuan" required placeholder="Makassar" className={`${kolom} font-[family-name:var(--font-archivo)] normal-case`} />
            </label>
            <label className={`${MONO} block text-[11px] text-[#eeeae1]/60 uppercase sm:col-span-2 md:text-xs`}>
              Jenis barang & perkiraan berat
              <input name="barang" placeholder="Misal: keramik, ±18 ton" className={`${kolom} font-[family-name:var(--font-archivo)] normal-case`} />
            </label>
            <label className={`${MONO} block text-[11px] text-[#eeeae1]/60 uppercase md:text-xs`}>
              Nama
              <input name="nama" required autoComplete="name" className={`${kolom} font-[family-name:var(--font-archivo)] normal-case`} />
            </label>
            <label className={`${MONO} block text-[11px] text-[#eeeae1]/60 uppercase md:text-xs`}>
              Perusahaan
              <input name="perusahaan" autoComplete="organization" className={`${kolom} font-[family-name:var(--font-archivo)] normal-case`} />
            </label>
          </div>
          <button type="submit" className="mt-7 w-full rounded bg-[#f2b33d] px-6 py-3.5 font-bold text-[#10213a] transition-transform hover:-translate-y-0.5">
            Kirim lewat WhatsApp
          </button>
        </form>
      </div>

      <footer className="border-t border-[#eeeae1]/10">
        <p className={`${STENSIL} overflow-hidden px-3 pt-8 text-center text-[24vw] leading-[0.8] whitespace-nowrap text-[#eeeae1]/[0.07] md:text-[19vw]`} aria-hidden="true">
          Bahtera
        </p>
        <div className={`${MONO} mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-5 pt-6 pb-28 text-[11px] text-[#eeeae1]/55 uppercase md:px-8 md:text-xs`}>
          <span>© 2026 {pt.nama}</span>
          <span>NIB 9120 0000 0000 · PPJK terdaftar</span>
          <a href="#atas" className="hover:text-[#eeeae1]">
            Kembali ke atas ↑
          </a>
        </div>
      </footer>
    </section>
  );
}
