"use client";

import { AnimatePresence, motion, type MotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useDiam } from "@/lib/diam";
import { serviceShowcase, services, waLink } from "@/lib/site";
import { PillLink, SectionHeading } from "../brand";
import { Icon } from "../icons";
import { Panggung } from "./services-stage";

// Section Layanan. Panggungnya sticky dan tiap layanan dapat jatah ¾ layar guliran (tinggi track = 100svh + 75svh × jumlah layanan): contoh website di
// panggung berganti, daftar di kiri (tab di HP) ikut pindah. Klik salah satu layanan = gulir ke jatahnya.
// "Kurangi gerakan": tidak sticky, layanan dipilih dengan klik saja.

const N = services.length;
type Layanan = (typeof services)[number];

export function Services() {
  const track = useRef<HTMLDivElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });
  const [dariScroll, setDariScroll] = useState(0);
  const [dariKlik, setDariKlik] = useState(0);
  useMotionValueEvent(p, "change", (v) => setDariScroll(Math.min(N - 1, Math.floor(v * N))));
  const aktif = diam ? dariKlik : dariScroll;

  function pilih(i: number) {
    const el = track.current;
    if (diam || !el) return setDariKlik(i);
    const atas = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: atas + (el.offsetHeight - window.innerHeight) * (i / N + 0.07), behavior: "smooth" });
  }

  return (
    <section id="layanan" className="relative">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pt-20 sm:px-6 md:grid-cols-2 md:items-end md:pt-28">
        <SectionHeading top="Undangan atau website," bottom="kamu butuh yang mana?" />
        <p className="max-w-md text-lg text-ink/70 md:justify-self-end">
          Bingung pilih? Chat aja dan ceritain acara atau usaha kamu. Nanti kami bantu tentuin yang paling pas.
        </p>
      </div>

      <div ref={track} className={`relative ${diam ? "pt-10 pb-20 md:pb-28" : "h-[475svh]"}`}>
        {/* tujuan link /#website-umkm dst. dari menu Layanan: tepat di jatah guliran tiap layanan
            (+6rem mengimbangi scroll-padding-top) */}
        {services.map((s, i) => (
          <span
            key={s.slug}
            id={s.slug}
            className="absolute left-0"
            style={{ top: diam ? 0 : `calc((100% - 100svh) * ${i / N + 0.07} + 6rem)` }}
          />
        ))}

        <div
          className={`${diam ? "" : "sticky top-0 h-svh"} flex flex-col justify-center pt-[4.75rem] pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:py-0`}
        >
          <div className="mx-auto grid w-full max-w-6xl items-center gap-5 px-4 sm:px-6 md:grid-cols-[0.82fr_1.18fr] md:gap-10 lg:gap-14">
            <Daftar p={p} aktif={aktif} diam={diam} pilih={pilih} />
            <Tab aktif={aktif} pilih={pilih} />
            <Panggung p={p} aktif={aktif} diam={diam} />
            <RincianHP s={services[aktif]} />
          </div>
        </div>
      </div>
    </section>
  );
}

// Desktop: daftar layanan + rel progres. Layanan aktif membuka rinciannya.
function Daftar({
  p,
  aktif,
  diam,
  pilih,
}: {
  p: MotionValue<number>;
  aktif: number;
  diam: boolean;
  pilih: (i: number) => void;
}) {
  const ujung = useTransform(p, [0, 1], ["0%", "100%"]);
  const isi = diam ? (aktif + 1) / N : p;

  return (
    <div className="relative hidden pl-10 md:block">
      {/* rel progres: garis tebal ujung bulat + titik mint, seperti goresan logo */}
      <div className="absolute top-3 bottom-3 left-0 w-1.5 rounded-full bg-lilac" aria-hidden="true">
        <motion.div style={{ scaleY: isi }} className="absolute inset-0 origin-top rounded-full bg-brand" />
        <motion.span
          style={{ top: diam ? `${((aktif + 1) / N) * 100}%` : ujung }}
          className="absolute left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint ring-4 ring-white"
        />
      </div>

      <ol>
        {services.map((s, i) => {
          const on = i === aktif;
          return (
            <li key={s.slug}>
              <button
                type="button"
                onClick={() => pilih(i)}
                aria-current={on ? "step" : undefined}
                className="group flex w-full items-baseline gap-4 py-2 text-left"
              >
                <span className={`w-6 shrink-0 text-sm font-bold tabular-nums transition-colors ${on ? "text-brand" : "text-ink/30"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`relative text-[1.75rem] leading-tight font-bold tracking-[-0.02em] transition-colors duration-300 lg:text-[2.1rem] ${
                    on ? "text-ink" : "text-ink/25 group-hover:text-ink/55"
                  }`}
                >
                  {s.title}
                  {on && <Coret />}
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden" inert={!on}>
                  <div className={`pt-2 pb-5 pl-10 transition-opacity duration-300 ${on ? "opacity-100 delay-150" : "opacity-0"}`}>
                    <Rincian s={s} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// Garis bawah judul aktif yang tergores, lalu titik mint muncul di ujungnya
function Coret() {
  return (
    <span className="pointer-events-none absolute inset-x-0 -bottom-1.5 h-3" aria-hidden="true">
      <svg viewBox="0 0 300 24" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        <motion.path
          d="M4 14 C 80 6, 220 6, 296 13"
          fill="none"
          stroke="#5B3DF5"
          strokeWidth="6"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.5 }}
        className="absolute -right-3 bottom-0.5 size-2 rounded-full bg-mint"
      />
    </span>
  );
}

function Rincian({ s }: { s: Layanan }) {
  const demo = serviceShowcase[s.slug].demo;
  return (
    <>
      <p className="max-w-md leading-relaxed text-ink/70">{s.desc}</p>
      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/55">
        <span className="rounded-full bg-lilac-soft px-3 py-1 font-semibold text-brand">{s.price}</span>
        <span>
          <span className="font-semibold text-ink/75">Cocok buat:</span> {s.fit}
        </span>
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <PillLink external href={waLink(`Halo Webkeun! Aku tertarik bikin ${s.title}. Bisa dibantu?`)}>
          Tanya soal ini
        </PillLink>
        {demo && <LihatContoh href={demo} />}
      </div>
    </>
  );
}

function LihatContoh({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-brand/30 decoration-2 underline-offset-4 transition-colors hover:decoration-brand"
    >
      Lihat contohnya
      <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
    </Link>
  );
}

// HP: tab layanan, latar putihnya meluncur ke tab yang aktif
function Tab({ aktif, pilih }: { aktif: number; pilih: (i: number) => void }) {
  return (
    <div className="grid grid-cols-5 gap-1 rounded-2xl bg-lilac-soft p-1 md:hidden">
      {services.map((s, i) => {
        const on = i === aktif;
        return (
          <button
            key={s.slug}
            type="button"
            onClick={() => pilih(i)}
            aria-current={on ? "step" : undefined}
            aria-label={s.title}
            className={`relative flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[11px] font-bold transition-colors ${
              on ? "text-brand" : "text-ink/50"
            }`}
          >
            {on && (
              <motion.span
                layoutId="tab-layanan"
                className="absolute inset-0 rounded-xl bg-white shadow-[0_4px_14px_-6px_rgb(21_19_43/0.25)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icon name={s.icon} className="relative size-[18px]" />
            <span className="relative">{serviceShowcase[s.slug].tab}</span>
          </button>
        );
      })}
    </div>
  );
}

// HP: rincian layanan aktif di bawah panggung
function RincianHP({ s }: { s: Layanan }) {
  const demo = serviceShowcase[s.slug].demo;
  return (
    <div className="min-h-[11.5rem] md:hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={s.slug}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-2xl font-bold tracking-tight">{s.title}</h3>
            <span className="shrink-0 text-sm font-semibold text-brand">{s.price}</span>
          </div>
          <p className="mt-1.5 line-clamp-3 text-[15px] leading-snug text-ink/70">{s.desc}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
            <PillLink external href={waLink(`Halo Webkeun! Aku tertarik bikin ${s.title}. Bisa dibantu?`)}>
              Tanya soal ini
            </PillLink>
            {demo && <LihatContoh href={demo} />}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
