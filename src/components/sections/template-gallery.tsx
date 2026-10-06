"use client";

import { AnimatePresence, motion, MotionConfig } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { type KategoriWebsite, kategoriWebsite, templateIntro, templates, waLink } from "@/lib/site";
import { Badge, PillLink } from "../brand";
import { Icon } from "../icons";
import { Mascot } from "../mascot";
import { TemplateCard } from "../template-card";

// Halaman /template: khusus template website (undangan punya halaman sendiri di /template/undangan).
// Halamannya statis: HTML-nya berisi semua template, lalu kategori dari link (?kategori=) dipilih di browser.
// Filter berjalan di browser: URL diganti tanpa memuat ulang, judul berganti, kartu bergeser ke posisi barunya.

const website = templates.filter((t) => t.category !== "undangan");
const jumlahUndangan = templates.length - website.length;
const pilihan = [{ slug: null, label: "Semua" }, ...kategoriWebsite];
const lembut = { duration: 0.45, ease: [0.16, 1, 0.3, 1] } as const;

// Galeri yang mengikuti ?kategori= di link, termasuk saat kategori dipilih dari menu navbar di halaman ini juga
export function TemplateGalleryDariLink() {
  const k = useSearchParams().get("kategori");
  return <TemplateGallery awal={kategoriWebsite.find((c) => c.slug === k)?.slug ?? null} />;
}

export function TemplateGallery({ awal }: { awal: KategoriWebsite | null }) {
  const [kat, setKat] = useState(awal);
  // kategori di link berganti (menu navbar): ikuti. Pilihan lewat tombol filter juga mengganti link, tapi nilainya
  // sudah sama dengan kat, jadi tidak mengubah apa-apa.
  const [awalTadi, setAwalTadi] = useState(awal);
  if (awal !== awalTadi) {
    setAwalTadi(awal);
    setKat(awal);
  }
  const shown = kat ? website.filter((t) => t.category === kat) : website;
  const teks = templateIntro[kat ?? "semua"];

  function pilih(slug: KategoriWebsite | null) {
    setKat(slug);
    window.history.replaceState(null, "", slug ? `/template?kategori=${slug}` : "/template");
  }

  // Kartu "custom" mengisi sisa kolom di baris terakhir supaya grid selalu penuh
  const lgSpan = ["lg:col-span-3 lg:flex-row lg:items-center lg:px-10", "lg:col-span-2 lg:flex-row lg:items-center", ""][shown.length % 3];
  const mdSpan = shown.length % 2 === 0 ? "md:col-span-2" : "";
  const wide = shown.length % 3 !== 2;

  return (
    <MotionConfig reducedMotion="user">
      <section className="bg-lilac">
        <div className="mx-auto grid max-w-6xl items-end gap-8 px-4 pt-32 pb-14 sm:px-6 md:grid-cols-[1fr_auto] md:pt-36">
          <div>
            <Badge>
              {shown.length} template {kat ? kategoriWebsite.find((c) => c.slug === kat)?.label : "website"}
            </Badge>
            <h1 className="mt-5 text-4xl leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]">
              Template website
              <span className="block overflow-hidden pb-[0.08em] text-brand">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={kat ?? "semua"}
                    className="block"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1, transition: lembut }}
                    exit={{ y: "-60%", opacity: 0, transition: { duration: 0.18 } }}
                  >
                    {teks.judul}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={kat ?? "semua"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.1 } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="mt-5 max-w-xl text-lg text-ink/70"
              >
                {teks.intro}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="relative hidden w-56 md:block" aria-hidden="true">
            <span className="absolute -top-16 -left-20 z-10 -rotate-6 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold shadow-md">
              Pilih yang paling kamu suka!
            </span>
            <div className="absolute inset-[-5%] rotate-[9deg] rounded-[2.2rem] bg-brand" />
            <Mascot mood="senyum" className="relative w-full -rotate-3" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Filter kategori template website" className="flex flex-wrap gap-2">
            {pilihan.map((c) => {
              const on = kat === c.slug;
              const n = c.slug ? website.filter((t) => t.category === c.slug).length : website.length;
              return (
                <button
                  key={c.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pilih(c.slug)}
                  className={`relative inline-flex items-center gap-2 rounded-full py-2 pr-2 pl-4 text-sm font-semibold transition-colors ${
                    on ? "text-white" : "bg-lilac-soft text-ink/75 hover:text-brand"
                  }`}
                >
                  {on && <motion.span layoutId="filter-template" className="absolute inset-0 rounded-full bg-brand" transition={lembut} />}
                  <span className="relative">{c.label}</span>
                  <span
                    className={`relative grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-xs tabular-nums transition-colors ${
                      on ? "bg-white/20" : "bg-white text-ink/55"
                    }`}
                  >
                    {n}
                  </span>
                </button>
              );
            })}
          </div>
          <span className="mx-1 hidden h-6 w-px bg-ink/15 sm:block" aria-hidden="true" />
          <Link
            href="/template/undangan"
            className="group inline-flex items-center gap-2 rounded-full bg-[#fadde4] py-2 pr-3 pl-3.5 text-sm font-semibold text-ink transition-colors hover:bg-[#f6ccd7]"
          >
            <Icon name="heart" className="size-4 text-[#b0415b]" />
            Undangan Digital
            <span className="grid min-w-6 place-items-center rounded-full bg-white px-1.5 py-0.5 text-xs text-ink/55 tabular-nums">{jumlahUndangan}</span>
            <Icon name="arrow" className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
          </Link>
        </div>

        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((t) => (
              <motion.li
                key={t.slug}
                layout
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                transition={lembut}
                className="flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink/8"
              >
                <TemplateCard t={t} />
              </motion.li>
            ))}

            <motion.li
              key="custom"
              layout
              transition={lembut}
              className={`flex flex-col items-start justify-between gap-8 rounded-3xl bg-brand p-7 text-white ${mdSpan} ${lgSpan}`}
            >
              <div className={wide ? "lg:flex lg:items-center lg:gap-8" : ""}>
                <Mascot mood="kedip" className="w-20 shrink-0 -rotate-6" />
                <div className={wide ? "mt-6 lg:mt-0" : "mt-6"}>
                  <h2 className="text-2xl leading-tight font-bold">
                    Nggak nemu yang pas?
                    <span className="block text-mint">Kami bikinin dari nol.</span>
                  </h2>
                  <p className="mt-3 text-white/80">
                    Ceritain usaha dan selera kamu. Desainnya kami rancang khusus, nggak harus mulai dari template.
                  </p>
                </div>
              </div>
              <PillLink
                href={waLink("Halo Webkeun! Aku mau website dengan desain custom, bisa ngobrol dulu?")}
                external
                tone="white"
                icon="whatsapp"
                className="shrink-0 whitespace-nowrap"
              >
                Konsultasi custom
              </PillLink>
            </motion.li>
          </AnimatePresence>
        </ul>
      </section>
    </MotionConfig>
  );
}
