"use client";

import { AnimatePresence, motion, MotionConfig, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { type CSSProperties, type PointerEvent, useState } from "react";
import { type GayaUndangan, gayaUndangan, hargaPaket, rupiahSingkat, templates, waLink } from "@/lib/site";
import { PillLink } from "../brand";
import { Icon } from "../icons";
import { LinkDemo } from "../link-demo";
import { Mascot } from "../mascot";

// Galeri tema undangan di /template/undangan, dikelompokkan per gaya (Adat & Budaya, Islami, dst.). Filter di atasnya
// menampilkan satu bagian saja. Tiap kartu: panggung 3 HP yang miring mengikuti kursor, dan pilihan paket
// (Basic/Premium/Exclusive) yang langsung mengisi pesan WhatsApp-nya. HTML statisnya berisi semua tema.

type Tema = (typeof templates)[number];
const undangan = templates.filter((t) => t.category === "undangan");
const pilihan = [{ slug: null, label: "Semua tema" }, ...gayaUndangan];
const paket = hargaPaket.undangan.paket;
const awalPaket = Math.max(
  0,
  paket.findIndex((p) => p.sorot),
);
const lembut = { duration: 0.45, ease: [0.16, 1, 0.3, 1] } as const;
const jumlah = (g: GayaUndangan | null) => (g ? undangan.filter((t) => t.gaya === g).length : undangan.length);

export function UndanganGallery() {
  const [gaya, setGaya] = useState<GayaUndangan | null>(null);
  const bagian = gayaUndangan.filter((g) => !gaya || g.slug === gaya);

  return (
    <MotionConfig reducedMotion="user">
      {/* py: ruang untuk garis tepi tombol, karena baris yang bisa digeser memotong apa pun di luar kotaknya */}
      <div
        role="group"
        aria-label="Filter gaya tema undangan"
        className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {pilihan.map((g) => {
          const on = gaya === g.slug;
          return (
            <button
              key={g.label}
              type="button"
              aria-pressed={on}
              onClick={() => setGaya(g.slug)}
              className={`relative inline-flex shrink-0 items-center gap-2 rounded-full py-2 pr-2 pl-4 text-sm font-semibold transition-colors ${
                on ? "text-white" : "bg-white text-ink/75 ring-1 ring-ink/10 ring-inset hover:text-brand hover:ring-brand/30"
              }`}
            >
              {on && <motion.span layoutId="filter-gaya" className="absolute inset-0 rounded-full bg-ink" transition={lembut} />}
              <span className="relative">{g.label}</span>
              <span className={`relative grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-xs tabular-nums ${on ? "bg-white/20" : "bg-lilac-soft text-ink/55"}`}>{jumlah(g.slug)}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {jumlah(gaya)} tema ditampilkan
      </p>

      <div className="mt-8 space-y-14 md:space-y-16">
        <AnimatePresence mode="popLayout" initial={false}>
          {bagian.map((g) => {
            const isi = undangan.filter((t) => t.gaya === g.slug);
            return (
              <motion.section
                key={g.slug}
                layout
                aria-labelledby={`gaya-${g.slug}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: lembut }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <div className="flex items-center gap-3">
                  <h3 id={`gaya-${g.slug}`} className="text-2xl font-bold tracking-[-0.01em] sm:text-[1.75rem]">
                    {g.label}
                  </h3>
                  <span className="shrink-0 rounded-full bg-lilac px-2.5 py-0.5 text-sm font-bold text-brand tabular-nums">{isi.length} tema</span>
                  <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
                </div>
                <p className="mt-1.5 text-ink/60">{g.desc}</p>
                <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {isi.map((t) => (
                    <li
                      key={t.slug}
                      className="flex flex-col overflow-hidden rounded-[2rem] bg-white ring-1 ring-ink/8 transition-shadow duration-500 hover:shadow-[0_34px_70px_-40px_rgb(21_19_43/0.45)]"
                    >
                      <KartuTema t={t} />
                    </li>
                  ))}
                </ul>
              </motion.section>
            );
          })}
          <motion.div key="custom" layout transition={lembut}>
            <KartuCustom />
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

function KartuTema({ t }: { t: Tema }) {
  const [pilih, setPilih] = useState(awalPaket);
  const p = paket[pilih];
  const tema = t.name.split(" · ").at(-1)!;

  return (
    <>
      <Panggung t={t} tema={tema} />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-brand">
          <span className="size-2.5 rounded-full ring-2 ring-white" style={{ background: t.tone?.accent, boxShadow: `0 0 0 3px ${t.tone?.bg}` }} />
          {t.nuansa}
        </p>
        <h4 className="mt-1.5 text-[1.375rem] font-bold tracking-[-0.01em]">{tema}</h4>
        <p className="mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-ink/65">{t.desc}</p>

        <fieldset className="mt-5">
          <legend className="flex w-full items-center justify-between text-xs font-bold tracking-[0.12em] text-ink/45 uppercase">
            Pilih paket
            <a href="#harga" className="text-[11px] font-semibold tracking-normal text-brand normal-case hover:underline">
              Bandingkan paket
            </a>
          </legend>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-2xl bg-lilac-soft p-1">
            {paket.map((q, i) => {
              const on = i === pilih;
              return (
                <label key={q.nama} className={`relative cursor-pointer rounded-xl px-1 py-2 text-center transition-colors ${on ? "text-white" : "text-ink hover:bg-white/70"}`}>
                  <input type="radio" name={`paket-${t.slug}`} value={q.nama} checked={on} onChange={() => setPilih(i)} className="peer sr-only" />
                  {on && <motion.span layoutId={`paket-${t.slug}`} className="absolute inset-0 rounded-xl bg-brand shadow-[0_10px_20px_-10px_rgb(91_61_245/0.8)]" transition={lembut} />}
                  <span className="absolute inset-0 rounded-xl ring-brand ring-offset-2 peer-focus-visible:ring-2" />
                  {q.sorot && (
                    <span
                      className={`absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-px text-[9px] font-extrabold tracking-wider whitespace-nowrap uppercase ${on ? "bg-mint text-ink" : "bg-ink text-white"}`}
                    >
                      {q.sorot}
                    </span>
                  )}
                  <span className={`relative block text-xs font-semibold ${on ? "text-white/80" : "text-ink/55"}`}>{q.nama}</span>
                  {q.coret && (
                    <span className={`relative block text-[10px] leading-tight font-semibold line-through decoration-[#ff5c7a] decoration-2 ${on ? "text-white/60" : "text-ink/40"}`}>
                      <span className="sr-only">Harga normal </span>
                      {rupiahSingkat(q.coret)}
                    </span>
                  )}
                  <span className="relative block text-[15px] leading-tight font-extrabold tracking-tight">{q.harga}</span>
                </label>
              );
            })}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={p.nama}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="mt-2.5 flex items-center gap-1.5 text-[13px] text-ink/60"
            >
              <Icon name="clock" className="size-3.5 shrink-0 text-brand" strokeWidth={2.5} />
              <span className="truncate">
                Aktif {p.aktif} · {p.untuk}
              </span>
            </motion.p>
          </AnimatePresence>
        </fieldset>

        <div className="mt-auto grid grid-cols-[1fr_auto] items-center gap-2 pt-5">
          <PillLink href={`/template/${t.slug}`} icon="eye" demo className="w-full">
            Lihat demo
          </PillLink>
          <a
            href={waLink(`Halo Webkeun! Aku mau pesan undangan tema ${tema} paket ${p.nama} (Rp${p.harga}). Bisa dibantu?`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Pesan tema ${tema} paket ${p.nama} lewat WhatsApp`}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-wa/12 pr-4 pl-3 text-sm font-bold text-[#128c4a] transition-colors hover:bg-wa/20"
          >
            <Icon name="whatsapp" className="size-5" />
            Pesan
          </a>
        </div>
      </div>
    </>
  );
}

// Panggung 3 HP di depan lengkung (seperti pelaminan / gapura) berwarna tema. Dengan mouse, panggungnya miring
// mengikuti kursor dan HP-nya mengipas; di layar sentuh tampil diam.
function Panggung({ t, tema }: { t: Tema; tema: string }) {
  const kurangiGerak = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 18 });
  const sy = useSpring(y, { stiffness: 140, damping: 18 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const rotX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const geserLengkung = useTransform(sx, [-0.5, 0.5], [10, -10]);
  const [kiri, kanan] = t.screens ?? [];
  if (!t.tone || !kiri || !kanan) return null;

  function gerak(e: PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType !== "mouse" || kurangiGerak) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }
  function lepas() {
    x.set(0);
    y.set(0);
  }

  const gelap = t.tone.bg === "#1d2b22";
  const transisi = "transition-[translate,rotate,scale] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none";

  return (
    <LinkDemo
      href={`/template/${t.slug}`}
      aria-label={`Lihat demo tema undangan ${tema}`}
      onPointerMove={gerak}
      onPointerLeave={lepas}
      className="group relative isolate block aspect-[6/5] overflow-hidden [perspective:900px]"
      style={{ background: t.tone.bg, "--aksen": t.tone.accent } as CSSProperties}
    >
      {/* cahaya dari atas & butiran halus */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_70%_at_50%_0%,rgb(255_255_255/0.55),transparent_60%)] opacity-70 mix-blend-soft-light" />

      {/* lengkung pelaminan, bergeser berlawanan arah kursor */}
      <motion.div aria-hidden="true" style={{ x: geserLengkung }} className="absolute inset-x-[9%] top-[5%] -bottom-px -z-10">
        <div className="absolute inset-0 rounded-t-full bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--aksen)_24%,transparent),color-mix(in_oklab,var(--aksen)_8%,transparent))] transition-[scale] duration-700 group-hover:scale-[1.03]" />
        <div className="absolute inset-[4%] bottom-0 rounded-t-full border-[1.5px] border-b-0 border-[color-mix(in_oklab,var(--aksen)_45%,transparent)]" />
      </motion.div>

      <Kilau className="top-[13%] left-[9%] size-4" jeda="0s" />
      <Kilau className="top-[26%] right-[8%] size-3" jeda="-1.3s" />
      <Kilau className="top-[6%] right-[27%] size-2.5" jeda="-2.1s" />

      {/* lantai */}
      <div aria-hidden="true" className="absolute bottom-[4%] left-1/2 -z-10 h-[8%] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl" />

      <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }} className="absolute inset-0">
        <Hp
          src={kiri}
          alt={`Bagian mempelai undangan ${tema}`}
          className={`h-[66%] -translate-x-[150%] -rotate-[10deg] group-hover:-translate-x-[166%] group-hover:-rotate-[14deg] ${transisi}`}
          z={-30}
          jeda="0.12s"
        />
        <Hp
          src={kanan}
          alt={`Bagian acara undangan ${tema}`}
          className={`h-[66%] translate-x-[50%] rotate-[10deg] group-hover:translate-x-[66%] group-hover:rotate-[14deg] ${transisi}`}
          z={-30}
          jeda="0.22s"
        />
        <Hp src={t.phone} alt={`Sampul undangan ${tema}`} className={`z-10 h-[82%] -translate-x-1/2 group-hover:-translate-y-[3%] group-hover:scale-[1.04] ${transisi}`} z={40} jeda="0s" utama />
      </motion.div>

      <span
        className={`absolute top-3.5 left-3.5 z-20 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm ${
          gelap ? "bg-white/15 text-white" : "bg-white/80 text-ink"
        }`}
      >
        <Icon name="phone" className="size-3.5" />
        Untuk HP
      </span>

      <span className="absolute bottom-4 left-1/2 z-20 inline-flex -translate-x-1/2 translate-y-3 items-center gap-2 rounded-full bg-ink py-1.5 pr-1.5 pl-4 text-sm font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition-[opacity,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        Buka demo
        <span className="grid size-7 place-items-center rounded-full bg-white text-ink">
          <Icon name="arrow" className="size-3.5" strokeWidth={2.5} />
        </span>
      </span>
    </LinkDemo>
  );
}

function Hp({ src, alt, className, z, jeda, utama }: { src: string; alt: string; className: string; z: number; jeda: string; utama?: boolean }) {
  return (
    <div className={`absolute bottom-[6%] left-1/2 aspect-[100/193] ${className}`} style={{ transform: `translateZ(${z}px)` }}>
      <div
        className={`relative h-full w-full animate-phone-in rounded-[17%/8.8%] bg-[#111018] p-[3.5%] ring-1 ring-white/15 ${
          utama ? "shadow-[0_30px_50px_-22px_rgb(0_0_0/0.65)]" : "shadow-[0_20px_36px_-22px_rgb(0_0_0/0.55)]"
        }`}
        style={{ animationDelay: jeda }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[13.5%/6.8%] bg-white">
          <Image src={src} alt={alt} fill sizes={utama ? "170px" : "130px"} className="object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

function Kilau({ className, jeda }: { className: string; jeda: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`absolute -z-10 animate-twinkle text-(--aksen) ${className}`} style={{ animationDelay: jeda }}>
      <path d="M12 0c.8 6.6 5.4 11.2 12 12-6.6.8-11.2 5.4-12 12-.8-6.6-5.4-11.2-12-12C6.6 11.2 11.2 6.6 12 0Z" fill="currentColor" />
    </svg>
  );
}

// Kartu penutup grid: tema yang benar-benar baru lewat paket Exclusive (desain custom)
function KartuCustom() {
  const exclusive = paket.at(-1)!; // paket tertinggi, yang desainnya custom
  return (
    <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-[2rem] bg-ink p-7 text-white sm:p-8 md:flex-row md:items-center lg:px-10">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-40 size-[28rem] bg-[radial-gradient(closest-side,rgb(91_61_245/0.5),transparent)]" />
      <div className="relative">
        <p className="text-xs font-bold tracking-[0.14em] text-mint uppercase">Belum nemu yang pas?</p>
        <h3 className="mt-3 text-2xl leading-tight font-bold sm:text-3xl">Bikin tema yang cuma punya kalian.</h3>
        <p className="mt-3 max-w-md text-white/70">
          Lewat paket {exclusive.nama} (Rp{exclusive.harga}), desainnya dibuat custom penuh sesuai konsep kalian.
        </p>
      </div>
      <div className="relative flex shrink-0 items-end justify-between gap-4 md:flex-col md:items-end">
        <Mascot mood="cinta" className="stiker w-16 shrink-0 -rotate-6 md:order-2 md:w-20" />
        <PillLink href={waLink(`Halo Webkeun! Aku mau tanya undangan paket ${exclusive.nama} dengan desain custom.`)} external tone="white" icon="whatsapp">
          Ceritain konsepnya
        </PillLink>
      </div>
    </div>
  );
}
