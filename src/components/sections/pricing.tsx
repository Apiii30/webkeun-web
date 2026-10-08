"use client";

import { AnimatePresence, motion, MotionConfig } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { hargaPaket, type JenisHarga, type Paket, persenHemat, rupiahSingkat, waLink } from "@/lib/site";
import { PillLink } from "../brand";
import { Icon } from "../icons";
import { Mascot } from "../mascot";

// Daftar harga: undangan digital (produk utama, tampil duluan) dan pembuatan website, dipilih lewat tombol geser.
// hanya: tampilkan satu jenis saja tanpa tombol geser (dipakai di halaman /template/undangan).

const urutan: JenisHarga[] = ["undangan", "website"];
const lembut = [0.16, 1, 0.3, 1] as const;

// Harga normal yang dicoret goresan tangan (tergambar saat kartunya terlihat) + emblem "Hemat x%" seperti stiker
function HargaCoret({ p, sorot }: { p: Paket; sorot: boolean }) {
  if (!p.coret) return null;
  return (
    <div className="mt-6 flex items-center gap-3">
      <span className={`relative text-lg font-bold ${sorot ? "text-white/55" : "text-ink/40"}`}>
        <span className="sr-only">Harga normal </span>Rp{rupiahSingkat(p.coret)}
        <svg
          viewBox="0 0 100 24"
          preserveAspectRatio="none"
          className="pointer-events-none absolute -inset-x-1.5 top-1/2 h-4 w-[calc(100%+0.75rem)] -translate-y-1/2 overflow-visible"
          aria-hidden="true"
        >
          <motion.path
            d="M3 15 C 28 9, 55 13, 97 6"
            fill="none"
            stroke="#ff5c7a"
            strokeWidth="3.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.35 }}
          />
        </svg>
      </span>
      <motion.span
        initial={{ opacity: 0, scale: 0.5, rotate: -18 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 320, damping: 13, delay: 0.7 }}
        className="inline-flex items-center gap-1 rounded-lg bg-[#ff5c7a] px-2 py-1 text-[11px] leading-none font-extrabold tracking-wide text-white uppercase shadow-[0_8px_18px_-8px_rgb(255_92_122/0.9)]"
      >
        Hemat {persenHemat(p)}%
      </motion.span>
    </div>
  );
}

// "1,5jt" → angka "1,5" + satuan "jt", supaya angkanya bisa dibuat besar
function Harga({ p, sorot }: { p: Paket; sorot: boolean }) {
  const [, angka, satuan] = p.harga.match(/^([\d,]+)(\D+)$/) ?? [, p.harga, ""];
  return (
    <p className={`${p.coret ? "mt-2" : "mt-6"} flex items-end gap-1 leading-none font-extrabold tracking-tight`}>
      {p.mulai && <span className={`mr-1 mb-1.5 text-sm font-semibold ${sorot ? "text-white/70" : "text-ink/50"}`}>mulai</span>}
      <span className={`mb-[0.55rem] text-xl ${sorot ? "text-mint" : "text-brand"}`}>Rp</span>
      <span className="text-[3.6rem]">{angka}</span>
      <span className={`mb-1.5 text-3xl ${sorot ? "text-white/80" : "text-ink/70"}`}>{satuan}</span>
    </p>
  );
}

function Kartu({ p, jenis, i }: { p: Paket; jenis: JenisHarga; i: number }) {
  const sorot = !!p.sorot;
  const label = hargaPaket[jenis].label;
  return (
    <motion.li
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: lembut, delay: i * 0.08 } }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }}
      className={`relative ${sorot ? "mt-14 md:mt-0 lg:-my-4" : ""}`}
    >
      {sorot && (
        <div className="pointer-events-none absolute -top-[4.2rem] right-3 z-10 flex items-start gap-1" aria-hidden="true">
          <span className="mt-2 -rotate-6 rounded-2xl bg-white px-3 py-1.5 text-sm font-bold text-ink shadow-md">Segini doang?!</span>
          <Mascot mood="kaget" className="w-[4.5rem] drop-shadow-[0_10px_18px_rgb(47_211_176/0.35)]" />
        </div>
      )}

      <div
        className={`relative flex h-full flex-col rounded-[1.75rem] p-7 sm:p-8 ${
          sorot ? "bg-brand text-white shadow-[0_30px_80px_-24px_rgb(91_61_245/0.9)] ring-2 ring-mint lg:py-12" : "bg-white text-ink"
        }`}
      >
        {sorot && <span className="absolute -top-3.5 left-7 rounded-full bg-mint px-3.5 py-1 text-xs font-extrabold tracking-[0.14em] text-ink uppercase sm:left-8">{p.sorot}</span>}

        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold">{p.nama}</h3>
            <p className={`mt-1 text-sm ${sorot ? "text-white/75" : "text-ink/60"}`}>{p.untuk}</p>
          </div>
          {p.aktif && (
            <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${sorot ? "bg-white/15 text-white" : "bg-lilac-soft text-brand"}`}>
              <Icon name="clock" className="size-3.5" strokeWidth={2.5} />
              Aktif {p.aktif}
            </span>
          )}
        </div>

        <HargaCoret p={p} sorot={sorot} />
        <Harga p={p} sorot={sorot} />

        <ul className={`mt-7 flex-1 space-y-3 border-t pt-7 ${sorot ? "border-white/20" : "border-ink/10"}`}>
          {p.dasar && (
            <li className={`flex items-center gap-3 text-sm font-semibold ${sorot ? "text-white/75" : "text-ink/55"}`}>
              <span className={`grid size-5 shrink-0 place-items-center rounded-full ${sorot ? "bg-white/15" : "bg-lilac-soft text-brand"}`}>
                <Icon name="layers" className="size-3" strokeWidth={2.5} />
              </span>
              Semua fitur {p.dasar}, plus:
            </li>
          )}
          {p.fitur.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${sorot ? "bg-mint text-ink" : "bg-mint/20 text-[#0f8f74]"}`}>
                <Icon name="check" className="size-3" strokeWidth={3.5} />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <PillLink
          href={waLink(`Halo Webkeun! Aku mau pesan ${label.toLowerCase()} paket ${p.nama} (${p.mulai ? "mulai " : ""}Rp${p.harga}). Bisa dibantu?`)}
          external
          tone={sorot ? "white" : "brand"}
          className="mt-9 w-full"
        >
          Pilih {p.nama}
        </PillLink>
      </div>
    </motion.li>
  );
}

export function Pricing({ hanya }: { hanya?: JenisHarga }) {
  const [jenis, setJenis] = useState<JenisHarga>(hanya ?? "undangan");
  const data = hargaPaket[jenis];

  return (
    <MotionConfig reducedMotion="user">
      <section id="harga" className="relative overflow-hidden bg-ink text-white">
        {/* cahaya ungu & bintang mint, sama seperti daftar harga cetaknya */}
        {/* gradasi, bukan filter blur: blur sebesar ini berkedip di Safari saat kartu di atasnya beranimasi */}
        <div
          className="pointer-events-none absolute -top-64 left-1/2 h-[46rem] w-[80rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(91_61_245/0.42),rgb(91_61_245/0.14)_55%,transparent)]"
          aria-hidden="true"
        />
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute top-16 right-[6%] hidden w-20 text-mint md:block" aria-hidden="true">
          <path d="M50 0 C53 36 64 47 100 50 C64 53 53 64 50 100 C47 64 36 53 0 50 C36 47 47 36 50 0Z" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute bottom-24 left-[5%] hidden w-9 text-mint/60 md:block" aria-hidden="true">
          <path d="M50 0 C53 36 64 47 100 50 C64 53 53 64 50 100 C47 64 36 53 0 50 C36 47 47 36 50 0Z" fill="currentColor" />
        </svg>

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <div className="flex flex-col items-center text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-[0.14em] text-mint uppercase ring-1 ring-white/15">
              <span className="size-2 rounded-full bg-mint" />
              Daftar harga
            </p>
            <h2 className="mt-5 text-3xl leading-[1.12] font-bold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.75rem]">
              <span className="block">{hanya === "undangan" ? "Harga undangan digital," : "Harganya jelas,"}</span>
              <span className="block text-mint">{hanya === "undangan" ? "pilih yang pas buat kalian" : "nggak pakai drama"}</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/70">{hanya ? `${data.ket}.` : "Undangan digital mulai 99rb, website mulai 450rb."} Bayar lewat transfer bank atau QRIS.</p>

            {!hanya && (
              <>
                <div role="tablist" aria-label="Jenis layanan" className="mt-9 flex rounded-full bg-white/10 p-1.5 ring-1 ring-white/15">
                  {urutan.map((j) => {
                    const aktif = j === jenis;
                    return (
                      <button
                        key={j}
                        type="button"
                        role="tab"
                        id={`harga-tab-${j}`}
                        aria-selected={aktif}
                        aria-controls="harga-paket"
                        onClick={() => setJenis(j)}
                        className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors sm:px-6 sm:text-base ${
                          aktif ? "text-ink" : "text-white/70 hover:text-white"
                        }`}
                      >
                        {aktif && <motion.span layoutId="harga-geser" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                        <Icon name={hargaPaket[j].ikon} className={`relative size-4 ${aktif ? "text-brand" : ""}`} strokeWidth={2.5} />
                        <span className="relative sm:hidden">{j === "undangan" ? "Undangan" : "Website"}</span>
                        <span className="relative hidden sm:inline">{hargaPaket[j].label}</span>
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={jenis}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 text-sm text-white/55"
                  >
                    {data.ket}
                  </motion.p>
                </AnimatePresence>
              </>
            )}
          </div>

          <div id="harga-paket" role={hanya ? undefined : "tabpanel"} aria-labelledby={hanya ? undefined : `harga-tab-${jenis}`} className="mt-20 lg:mt-24">
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul key={jenis} className="grid gap-5 md:grid-cols-3 md:items-stretch">
                {data.paket.map((p, i) => (
                  <Kartu key={p.nama} p={p} jenis={jenis} i={i} />
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl bg-white/[0.06] px-6 py-5 text-center ring-1 ring-white/10 sm:flex-row sm:text-left">
            <p className="text-white/75">
              {jenis === "undangan" ? "Bingung pilih paket yang mana?" : "Belum yakin butuh berapa halaman?"} <span className="text-white">Konsultasi dulu gratis, kok.</span>
            </p>
            <Link href={hanya ? "#tema" : jenis === "undangan" ? "/template/undangan" : "/template"} className="group inline-flex shrink-0 items-center gap-2 font-semibold text-mint">
              {hanya ? "Lihat temanya lagi" : jenis === "undangan" ? "Lihat semua tema undangan" : "Lihat template website"}
              <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
