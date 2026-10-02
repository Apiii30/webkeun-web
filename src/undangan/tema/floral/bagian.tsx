"use client";

import { type MotionValue, motion, useMotionValue, useScroll, useTransform, type Variants } from "motion/react";
import Image from "next/image";
import { type CSSProperties, Fragment, type ReactNode, useEffect, useRef } from "react";
import type { Undangan } from "../../types";
import { Bloom, Cat, Daisy, Gerbera, Leaf, Sprig, Tulip, type Warna } from "./bunga";
import s from "./floral.module.css";
import { CopyButton, Countdown, Deck, Ucapan } from "./interaktif";
import { kertasWarna, W, type Wash } from "./warna";

// Isi undangan tema Floral. Setiap bagian sengaja memakai gerakan yang berbeda:
// parallax, kartu bertumpuk, lingkaran yang membuka, geser ke samping, amplop terbuka, bunga tumbuh.

const display = "font-[family-name:var(--font-fraunces)]";
const ease = [0.22, 1, 0.36, 1] as const;
const spring = { type: "spring", stiffness: 140, damping: 18 } as const;

function calendarLink(u: Undangan) {
  const z = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: `Pernikahan ${u.wanita.panggilan} & ${u.pria.panggilan}`,
    dates: `${z(u.mulai)}/${z(u.selesai)}`,
    location: `${u.lokasi.nama}, ${u.lokasi.alamat}`,
  })}`;
}

// Tanggal dihitung di zona WIB supaya sama dengan yang tertulis
function tanggalAngka(iso: string) {
  const d = new Date(new Date(iso).getTime() + 7 * 3_600_000);
  const p = (n: number) => String(n).padStart(2, "0");
  return { dd: p(d.getUTCDate()), mm: p(d.getUTCMonth() + 1), yyyy: String(d.getUTCFullYear()) };
}

/* ───────── pembantu ───────── */

function Label({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] uppercase ${light ? "text-(--mentega)" : "text-(--koral)"}`}>
      <Daisy className="size-5" petals={12} warna={light ? "kuning" : "koral"} />
      {children}
    </p>
  );
}

// Judul yang kata-katanya naik satu per satu dari balik garis
function Judul({ children, className = "", size = "text-[2.6rem]" }: { children: string; className?: string; size?: string }) {
  const words = children.split(" ");
  return (
    <motion.h2
      className={`${display} ${size} leading-[1.02] tracking-tight ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: 0.07 }}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="inline-block overflow-hidden pb-1 align-top">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: "110%", rotate: 8 }, show: { y: 0, rotate: 0, transition: { duration: 0.7, ease } } }}
            >
              {w}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </motion.h2>
  );
}

const gaya = {
  naik: { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } },
  kiri: { hidden: { opacity: 0, x: -70, rotate: -6 }, show: { opacity: 1, x: 0, rotate: 0 } },
  kanan: { hidden: { opacity: 0, x: 70, rotate: 6 }, show: { opacity: 1, x: 0, rotate: 0 } },
  zoom: { hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } },
  blur: { hidden: { opacity: 0, filter: "blur(12px)", y: 20 }, show: { opacity: 1, filter: "blur(0px)", y: 0 } },
} satisfies Record<string, Variants>;

function Muncul({ as = "naik", delay = 0, className, children }: { as?: keyof typeof gaya; delay?: number; className?: string; children: ReactNode }) {
  return (
    <motion.div
      className={className}
      variants={gaya[as]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

// Tepi bergelombang di atas bagian berwarna
function Gelombang({ color }: { color: string }) {
  return <div className={`${s.wave} absolute inset-x-0 -top-[13px]`} style={{ "--wave": color } as CSSProperties} aria-hidden="true" />;
}

/* ───────── 1. Pembuka: foto lengkung dengan parallax berlapis ───────── */

function Hero({ u, opened }: { u: Undangan; opened: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(p, [0, 1], ["0%", "22%"]);
  const archScale = useTransform(p, [0, 1], [1, 0.82]);
  const archRadius = useTransform(p, [0, 1], ["999px 999px 28px 28px", "999px 999px 999px 999px"]);
  const fast = useTransform(p, [0, 1], [0, -260]);
  const mid = useTransform(p, [0, 1], [0, -140]);
  const slow = useTransform(p, [0, 1], [0, 120]);
  const spin = useTransform(p, [0, 1], [0, 220]);
  const titleY = useTransform(p, [0, 1], [0, 90]);
  const fade = useTransform(p, [0, 0.6], [1, 0]);
  const show = opened ? "show" : "hidden";

  const bunga = (delay: number): Variants => ({
    hidden: { scale: 0, rotate: -120 },
    show: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 90, damping: 11, delay } },
  });

  return (
    <section ref={ref} id="beranda" className="relative flex h-svh min-h-[40rem] flex-col items-center overflow-clip pt-16">
      {/* matahari di belakang foto */}
      <motion.div style={{ y: slow }} className="absolute top-[14%] -right-24 w-80" aria-hidden="true">
        <Cat warna="kuning" className="w-full" />
      </motion.div>
      <motion.div style={{ y: mid }} className="absolute top-[48%] -left-28 w-64 opacity-70" aria-hidden="true">
        <Cat warna="biru" className="w-full" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={opened ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative text-[11px] font-bold tracking-[0.35em] text-(--koral) uppercase"
      >
        The wedding of
      </motion.p>

      <motion.div
        style={{ scale: archScale, borderRadius: archRadius }}
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={opened ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
        transition={{ duration: 1.3, ease, delay: 0.2 }}
        className="relative mt-5 aspect-[3/4] h-[52svh] max-h-[30rem] overflow-hidden border-[6px] border-(--kertas) bg-(--krem) shadow-[0_30px_60px_-30px_rgb(18_42_31/0.7)]"
      >
        <motion.div style={{ y: imgY }} className="absolute inset-x-0 -top-[12%] h-[124%]">
          <Image src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} fill preload sizes="340px" className="object-cover object-[50%_30%]" />
        </motion.div>
        {/* bagian bawah foto memudar ke warna kertas supaya nama di atasnya tetap terbaca */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-(--kertas) via-(--kertas)/60 to-transparent" />
      </motion.div>

      {/* bunga di sekitar foto, tiap lapis bergerak dengan kecepatan berbeda saat di-scroll */}
      <motion.div style={{ y: fast, rotate: spin }} className="absolute top-[13%] left-[6%] w-24" variants={bunga(0.9)} initial="hidden" animate={show}>
        <Daisy className="w-full" />
      </motion.div>
      <motion.div style={{ y: mid }} className="absolute top-[42%] right-[4%] w-20" variants={bunga(1.05)} initial="hidden" animate={show}>
        <Bloom className={`${s.float} w-full`} />
      </motion.div>
      <motion.div style={{ y: slow }} className="absolute top-[56%] left-[3%] w-16" variants={bunga(1.2)} initial="hidden" animate={show}>
        <Tulip className={`${s.sway} w-full`} />
      </motion.div>
      <motion.div style={{ y: fast }} className="absolute top-[30%] right-[14%] w-10" variants={bunga(1.3)} initial="hidden" animate={show}>
        <Gerbera warna="koral" className={`${s.spin} w-full`} />
      </motion.div>

      <motion.div style={{ y: titleY, opacity: fade }} className="relative -mt-14 text-center">
        <h1 className={`${display} text-[4.2rem] leading-[0.9] font-medium tracking-tight italic`}>
          {[u.wanita.panggilan, "&", u.pria.panggilan].map((w, i) => (
            <span key={i} className={`block overflow-hidden ${i === 1 ? "-my-1 text-[2.6rem] text-(--koral)" : ""}`}>
              <motion.span
                className="inline-block"
                initial={{ y: "105%" }}
                animate={opened ? { y: 0 } : {}}
                transition={{ duration: 1, ease, delay: 0.7 + i * 0.12 }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={opened ? { opacity: 1, scale: 1 } : {}}
          transition={{ ...spring, delay: 1.2 }}
          className="mt-4 inline-block rounded-full bg-(--hijau) px-4 py-2 text-sm font-semibold text-(--kertas)"
        >
          {u.tanggal} · {u.kota}
        </motion.p>
      </motion.div>

      <motion.div style={{ opacity: fade }} className="absolute bottom-6 flex flex-col items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-(--hijau)/60 uppercase">
        Gulir
        <span className="relative h-8 w-px overflow-hidden bg-(--hijau)/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-3 bg-(--hijau)"
            animate={{ y: [-12, 32] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

/* ───────── 2. Pita silang yang bergerak mengikuti scroll ───────── */

function Pita({ u }: { u: Undangan }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const a = useTransform(p, [0, 1], ["5%", "-25%"]);
  const b = useTransform(p, [0, 1], ["-25%", "5%"]);
  const { dd, mm, yyyy } = tanggalAngka(u.mulai);
  const isi = [`${u.wanita.panggilan} & ${u.pria.panggilan}`, `${dd}.${mm}.${yyyy}`, u.kota, "Save the date"];

  const baris = (dark?: boolean) => (
    <div className={`flex w-max items-center gap-5 py-3 ${dark ? s.marquee : s.marqueeReverse}`}>
      {[0, 1].map((k) => (
        <div key={k} className="flex items-center gap-5">
          {isi.map((t) => (
            <span key={t} className="flex items-center gap-5">
              <span className={`${display} text-2xl whitespace-nowrap italic`}>{t}</span>
              <Daisy className="size-7 shrink-0" petals={14} warna={dark ? "kuning" : "putih"} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={ref} className="relative h-44 overflow-clip" aria-hidden="true">
      <motion.div style={{ x: a }} className={`${s.grain} absolute top-8 -left-10 w-[160%] -rotate-[5deg] bg-(--hijau) text-(--kertas)`}>
        {baris(true)}
      </motion.div>
      <motion.div style={{ x: b, ...kertasWarna("mentega") }} className="absolute top-20 -left-10 w-[160%] rotate-[4deg] text-(--hijau)">
        {baris()}
      </motion.div>
    </div>
  );
}

/* ───────── 3. Salam: kata demi kata menyala saat di-scroll ───────── */

function Kata({ p, i, n, children }: { p: MotionValue<number>; i: number; n: number; children: string }) {
  const opacity = useTransform(p, [i / n, (i + 1) / n], [0.15, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

function Salam({ u }: { u: Undangan }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = u.pembuka.split(" ");
  const tumbuh = useTransform(p, [0, 1], [0, 1]);

  return (
    <section id="salam" className="relative px-6 pt-16 pb-24">
      <Label>Kabar bahagia</Label>
      <Judul className="mt-4">Kabar bahagia untukmu</Judul>
      <p ref={ref} className={`${display} mt-6 text-[1.45rem] leading-snug`}>
        {words.map((w, i) => (
          <Kata key={i} p={p} i={i} n={words.length}>
            {w}
          </Kata>
        ))}
      </p>
      <motion.div style={{ scaleY: tumbuh }} className="absolute right-3 bottom-4 w-14 origin-bottom">
        <Sprig className="w-full" />
      </motion.div>
    </section>
  );
}

/* ───────── 4. Mempelai: kartu-kartu bertumpuk (sticky stack) ───────── */

type KartuData = { label: string; title: string; text: string; foto: string; bg: Wash; flower: ReactNode };

function Kartu({ c, i, n, p }: { c: KartuData; i: number; n: number; p: MotionValue<number> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress: masuk } = useScroll({ target: wrap, offset: ["start end", "start start"] });
  const rotate = useTransform(masuk, [0, 1], [i % 2 ? 9 : -9, i % 2 ? 1.5 : -1.5]);
  const scale = useTransform(p, [i / n, 1], [1, 1 - (n - 1 - i) * 0.07]);
  const dim = useTransform(p, [i / n, 1], [0, (n - 1 - i) * 0.22]);
  const imgScale = useTransform(masuk, [0, 1], [1.35, 1]);

  return (
    <div ref={wrap} className="sticky top-0 flex h-svh items-center px-4" style={{ paddingTop: `${i * 1.25}rem` }}>
      <motion.article
        style={{ scale, rotate, ...kertasWarna(c.bg) }}
        className="relative flex h-[min(36rem,80svh)] w-full origin-top flex-col overflow-hidden rounded-[2rem] p-4 text-(--hijau-tua) shadow-[0_-12px_40px_-20px_rgb(18_42_31/0.5)]"
      >
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.4rem] bg-(--hijau)/10">
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Image src={c.foto} alt={c.title} fill sizes="410px" className="object-cover object-[50%_20%]" />
          </motion.div>
        </div>
        <div className="relative px-2 pt-4 pb-1">
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase opacity-70">{c.label}</p>
          <h3 className={`${display} mt-1 text-[2rem] leading-tight`}>{c.title}</h3>
          <p className="mt-1 text-sm leading-relaxed opacity-80">{c.text}</p>
        </div>
        <div className="absolute top-2 right-2 w-20">{c.flower}</div>
        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-(--hijau-tua)" />
      </motion.article>
    </div>
  );
}

function Mempelai({ u }: { u: Undangan }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const cards: KartuData[] = [
    { label: "Mempelai wanita", title: u.wanita.nama, text: u.wanita.keterangan, foto: u.wanita.foto, bg: "mentega", flower: <Daisy className={`${s.spin} w-full`} /> },
    { label: "Mempelai pria", title: u.pria.nama, text: u.pria.keterangan, foto: u.pria.foto, bg: "biru", flower: <Bloom className={`${s.float} w-full`} warna="putih" /> },
    {
      label: "Kini bersama",
      title: `${u.wanita.panggilan} & ${u.pria.panggilan}`,
      text: "Dua keluarga, satu doa. Terima kasih sudah menjadi bagian dari perjalanan kami.",
      foto: u.foto.galeri[1]?.src ?? u.foto.sampul,
      bg: "koral",
      flower: <Gerbera className={`${s.spin} w-full`} warna="kuning" />,
    },
  ];

  return (
    <section id="mempelai" className={`${s.grain} relative bg-(--krem) pt-20`}>
      <Gelombang color={W.krem} />
      <div className="px-6">
        <Label>Mempelai</Label>
        <Judul className="mt-4">Dua hati, satu cerita</Judul>
        <Muncul as="blur" delay={0.2}>
          <p className="mt-4 text-(--hijau)/75">Gulir pelan-pelan, kartunya akan bertumpuk satu per satu.</p>
        </Muncul>
      </div>
      <div ref={ref} className="relative mt-4 pb-[10svh]">
        {cards.map((c, i) => (
          <Kartu key={c.label} c={c} i={i} n={cards.length} p={p} />
        ))}
      </div>
    </section>
  );
}

/* ───────── 5. Kutipan: lingkaran yang membesar membuka foto ───────── */

function Kutipan({ u }: { u: Undangan }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clip = useTransform(p, [0, 0.55], ["circle(22% at 50% 50%)", "circle(75% at 50% 50%)"]);
  const imgScale = useTransform(p, [0, 0.7], [1.5, 1]);
  const ringScale = useTransform(p, [0, 0.55], [1, 3.2]);
  const ringRotate = useTransform(p, [0, 1], [0, 160]);
  const ringOpacity = useTransform(p, [0.3, 0.55], [1, 0]);
  const hintOpacity = useTransform(p, [0, 0.15], [1, 0]);
  const textOpacity = useTransform(p, [0.5, 0.7], [0, 1]);
  const textY = useTransform(p, [0.5, 0.75], [60, 0]);

  const ring = [Daisy, Bloom, Gerbera, Daisy, Bloom, Gerbera, Daisy, Bloom];
  const ringWarna: Warna[] = ["putih", "koral", "kuning", "biru", "kuning", "koral", "putih", "biru"];

  return (
    <section ref={ref} className={`${s.grain} relative h-[230svh] bg-(--krem)`}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 bg-(--hijau-tua)">
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Image src={u.foto.kutipan} alt="" fill sizes="440px" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-(--hijau-tua)/20 via-(--hijau-tua)/45 to-(--hijau-tua)/85" />
        </motion.div>

        <motion.div style={{ scale: ringScale, rotate: ringRotate, opacity: ringOpacity }} className="pointer-events-none absolute inset-0" aria-hidden="true">
          {ring.map((F, i) => {
            const a = (Math.PI * 2 * i) / ring.length;
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -mt-7 -ml-7 size-14"
                style={{ transform: `translate(${Math.cos(a) * 118}px, ${Math.sin(a) * 118}px)` }}
              >
                <F className="size-full" warna={ringWarna[i]} />
              </div>
            );
          })}
        </motion.div>

        <motion.p
          style={{ opacity: hintOpacity }}
          className="absolute inset-x-0 top-[18%] text-center text-[11px] font-bold tracking-[0.3em] text-(--hijau)/60 uppercase"
        >
          Terus gulir
        </motion.p>

        <motion.blockquote style={{ opacity: textOpacity, y: textY }} className="absolute inset-x-0 bottom-[16%] px-8 text-center text-(--kertas)">
          <Daisy className="mx-auto size-12" warna="kuning" />
          <p className={`${display} mt-5 text-[2.1rem] leading-tight italic`}>“{u.kutipan}”</p>
          <footer className="mt-5 text-[11px] font-bold tracking-[0.3em] text-(--mentega) uppercase">
            {u.wanita.panggilan} & {u.pria.panggilan}
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}

/* ───────── 6. Cerita: digeser ke samping sambil scroll ke bawah ───────── */

const WARNA_CERITA: Wash[] = ["mentega", "koral", "biru", "daun"];

function Cerita({ u }: { u: Undangan }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const jarak = useMotionValue(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(() => -jarak.get() * Math.min(1, Math.max(0, (p.get() - 0.04) / 0.92)));
  const height = useTransform(() => `calc(100svh + ${jarak.get()}px)`);
  const garis = useTransform(p, [0.04, 0.96], [0, 1]);

  // Lebar geser = lebar seluruh kartu dikurangi lebar layar; dihitung ulang saat ukuran berubah
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(() => jarak.set(Math.max(0, el.scrollWidth - (el.parentElement?.clientWidth ?? 0))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [jarak]);

  return (
    <motion.section ref={ref} id="cerita" style={{ height }} className={`${s.grain} relative bg-(--hijau) text-(--kertas)`}>
      <Gelombang color={W.hijau} />
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="px-6">
          <Label light>Cerita kami</Label>
          <Judul className="mt-4">Bab demi bab</Judul>
        </div>

        <div className="relative mt-8">
          {/* tangkai yang memanjang seiring cerita berjalan */}
          <div className="absolute inset-x-6 top-0 h-0.5 bg-(--kertas)/15">
            <motion.div style={{ scaleX: garis }} className="h-full origin-left bg-(--mentega)" />
          </div>
          <motion.div ref={track} style={{ x }} className="flex w-max gap-4 px-6 pt-8">
            {u.cerita.map((c, i) => (
              <article
                key={c.tahun}
                className="relative flex h-[22rem] w-[17rem] shrink-0 flex-col rounded-[1.75rem] p-6 text-(--hijau-tua)"
                style={{ ...kertasWarna(WARNA_CERITA[i % WARNA_CERITA.length]), rotate: `${i % 2 ? 2 : -2}deg` }}
              >
                <span className="absolute -top-[2.6rem] left-6 size-5 rounded-full border-4 border-(--hijau) bg-(--mentega)" aria-hidden="true" />
                <p className={`${display} text-7xl leading-none font-semibold tracking-tighter`}>{c.tahun}</p>
                <h3 className={`${display} mt-auto text-3xl italic`}>{c.judul}</h3>
                <p className="mt-2 leading-relaxed opacity-85">{c.isi}</p>
                <div className="absolute top-5 right-5 w-12">
                  {i % 2 ? <Bloom className={`${s.spin} w-full`} warna="putih" /> : <Daisy className={`${s.spin} w-full`} />}
                </div>
              </article>
            ))}
            <div className="flex w-[13rem] shrink-0 flex-col items-center justify-center text-center">
              <Tulip className={`${s.sway} w-16`} warna="kuning" />
              <p className={`${display} mt-4 text-2xl italic`}>Bab berikutnya ditulis bersama kamu.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

/* ───────── 7. Acara: kartu tanggal membalik, tiket berputar 3D ───────── */

function Acara({ u }: { u: Undangan }) {
  const { dd, mm, yyyy } = tanggalAngka(u.mulai);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(p, [0, 1], [-60, 120]);
  const hari = u.tanggal.split(",")[0];

  return (
    <section id="acara" className="relative px-6 pt-24 pb-20">
      <Label>Acara</Label>
      <Judul className="mt-4">Simpan tanggalnya</Judul>

      <motion.div
        className="mt-8 grid grid-cols-3 gap-2 [perspective:800px]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        transition={{ staggerChildren: 0.15 }}
      >
        {[
          [dd, "Tanggal", "mentega"],
          [mm, "Bulan", "koral"],
          [yyyy.slice(2), yyyy, "biru"],
        ].map(([n, l, bg]) => (
          <motion.div
            key={l}
            variants={{ hidden: { rotateX: -100, opacity: 0 }, show: { rotateX: 0, opacity: 1, transition: { type: "spring", stiffness: 90, damping: 12 } } }}
            className="origin-top rounded-3xl py-5 text-center"
            style={kertasWarna(bg as Wash)}
          >
            <p className={`${display} text-6xl leading-none font-semibold tracking-tighter`}>{n}</p>
            <p className="mt-2 text-[10px] font-bold tracking-[0.25em] uppercase opacity-70">{l}</p>
          </motion.div>
        ))}
      </motion.div>
      <Muncul as="blur" delay={0.2}>
        <p className={`${display} mt-4 text-center text-xl italic`}>{hari}, sampai jumpa di sana</p>
      </Muncul>

      <div className="mt-10 space-y-4 [perspective:1000px]">
        {u.acara.map((a, i) => (
          <motion.div
            key={a.nama}
            initial={{ rotateY: i % 2 ? -80 : 80, opacity: 0 }}
            whileInView={{ rotateY: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: "spring", stiffness: 70, damping: 13 }}
            className="relative flex items-center justify-between gap-4 rounded-3xl border-2 border-dashed border-(--hijau)/25 bg-white/60 px-6 py-5"
          >
            {/* lubang tiket */}
            <span className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-(--kertas)" aria-hidden="true" />
            <span className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-(--kertas)" aria-hidden="true" />
            <div>
              <p className="text-[11px] font-bold tracking-[0.25em] text-(--koral) uppercase">Acara {i + 1}</p>
              <h3 className={`${display} mt-1 text-[1.75rem]`}>{a.nama}</h3>
            </div>
            <p className="text-right text-sm font-semibold">{a.jam}</p>
          </motion.div>
        ))}
      </div>

      <div ref={ref} className="relative mt-6">
        <Muncul as="zoom">
          <div className={`${s.grain} relative overflow-hidden rounded-[2rem] bg-(--hijau) p-6 text-(--kertas)`}>
            <motion.div style={{ rotate }} className="absolute -right-14 -bottom-14 w-32">
              <Bloom className="w-full" warna="koral" />
            </motion.div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-(--mentega) uppercase">Lokasi</p>
            <h3 className={`${display} relative mt-2 text-[1.75rem] leading-tight`}>{u.lokasi.nama}</h3>
            <p className="relative mt-2 max-w-[15rem] text-(--kertas)/75">{u.lokasi.alamat}</p>
            <div className="relative mt-6 flex flex-wrap gap-2">
              <a href={u.lokasi.maps} target="_blank" rel="noopener noreferrer" className="rounded-full bg-(--mentega) px-5 py-3 text-sm font-bold text-(--hijau-tua)">
                Buka peta
              </a>
              <a href={calendarLink(u)} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-(--kertas)/40 px-5 py-3 text-sm font-bold">
                Simpan ke kalender
              </a>
            </div>
          </div>
        </Muncul>
      </div>

      <div className="mt-10">
        <p className="mb-3 text-center text-[11px] font-bold tracking-[0.25em] text-(--hijau)/60 uppercase">Menuju hari bahagia</p>
        <Countdown target={u.mulai} />
      </div>
    </section>
  );
}

/* ───────── 8. Galeri: tumpukan foto yang bisa digeser ───────── */

function Galeri({ u }: { u: Undangan }) {
  return (
    <section id="galeri" className={`${s.grain} relative overflow-clip bg-(--krem) px-6 pt-20 pb-24`}>
      <Gelombang color={W.krem} />
      <Leaf className={`${s.float} absolute top-10 right-6 w-9`} />
      <Label>Galeri</Label>
      <Judul className="mt-4">Momen lamaran</Judul>
      <Muncul as="blur" delay={0.2}>
        <p className="mt-3 mb-12 text-(--hijau)/75">Geser foto paling atas ke kiri atau kanan.</p>
      </Muncul>
      <Muncul as="zoom">
        <Deck photos={u.foto.galeri} />
      </Muncul>
    </section>
  );
}

/* ───────── 9. Kado: amplop yang terbuka sendiri ───────── */

function Kado({ u }: { u: Undangan }) {
  const [utama, ...lain] = u.amplop;
  return (
    <section id="kado" className={`${s.grain} relative bg-(--hijau) px-6 pt-20 pb-24 text-(--kertas)`}>
      <Gelombang color={W.hijau} />
      <Label light>Tanda kasih</Label>
      <Judul className="mt-4">Amplop digital</Judul>
      <Muncul as="blur" delay={0.2}>
        <p className="mt-3 text-(--kertas)/75">Doa restumu sudah lebih dari cukup. Kalau ingin memberi tanda kasih, bisa lewat sini.</p>
      </Muncul>

      {utama && (
        <motion.div
          className="relative mx-auto mt-40 h-52 max-w-[22rem] [perspective:900px]"
          initial="tutup"
          whileInView="buka"
          viewport={{ once: true, amount: 0.8 }}
        >
          {/* badan amplop */}
          <div className="absolute inset-0 rounded-2xl" style={{ backgroundImage: `var(--noise), linear-gradient(170deg, #e98a6b, #cf6143)` }} />
          {/* kartu rekening yang keluar dari amplop */}
          <motion.div
            variants={{ tutup: { y: 0 }, buka: { y: -150, transition: { delay: 0.55, type: "spring", stiffness: 80, damping: 14 } } }}
            className="absolute inset-x-4 top-3 z-10 rounded-2xl bg-(--kertas) p-5 text-(--hijau-tua)"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold tracking-[0.25em] text-(--koral) uppercase">{utama.bank}</p>
              <Daisy className="size-8" petals={14} warna="kuning" />
            </div>
            <p className={`${display} mt-3 text-[1.9rem] tracking-wide tabular-nums`}>{utama.nomor}</p>
            <p className="mt-1 text-sm opacity-75">a.n. {utama.atasNama}</p>
            <div className="mt-4">
              <CopyButton text={utama.nomor} />
            </div>
          </motion.div>
          {/* kantong depan */}
          <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 z-20 h-[78%] w-full" aria-hidden="true">
            <path d="M0 0 50 34 100 0v56a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4Z" fill="url(#fl-amplop)" />
          </svg>
          {/* tutup amplop */}
          <motion.svg
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-0 h-[62%] w-full origin-top"
            variants={{
              tutup: { rotateX: 0, zIndex: 30 },
              buka: { rotateX: 180, zIndex: 5, transition: { duration: 0.6, ease: "easeInOut", zIndex: { delay: 0.3 } } },
            }}
            aria-hidden="true"
          >
            <path d="M0 4a4 4 0 0 1 4-4h92a4 4 0 0 1 4 4L50 50Z" fill="url(#fl-amplop-tutup)" />
          </motion.svg>
          <div className="absolute -bottom-6 left-1/2 z-30 -translate-x-1/2">
            <Bloom className="w-16" warna="kuning" />
          </div>
        </motion.div>
      )}

      {lain.map((a) => (
        <Muncul key={a.nomor} as="naik" className="mt-6">
          <div className="rounded-2xl bg-(--kertas) p-5 text-(--hijau-tua)">
            <p className="text-[11px] font-bold tracking-[0.25em] text-(--koral) uppercase">{a.bank}</p>
            <p className={`${display} mt-2 text-[1.75rem] tabular-nums`}>{a.nomor}</p>
            <p className="mt-1 text-sm opacity-75">a.n. {a.atasNama}</p>
            <div className="mt-4">
              <CopyButton text={a.nomor} />
            </div>
          </div>
        </Muncul>
      ))}
    </section>
  );
}

/* ───────── 10. Ucapan ───────── */

function BagianUcapan({ tamu }: { tamu?: string }) {
  return (
    <section id="ucapan" className={`${s.grain} relative bg-(--kertas) px-6 pt-20 pb-24`}>
      <Gelombang color={W.kertas} />
      <Label>RSVP</Label>
      <Judul className="mt-4">Konfirmasi & ucapan</Judul>
      <Muncul as="blur" delay={0.2}>
        <p className="mt-3 mb-8 text-(--hijau)/75">Kabari kami kalau kamu bisa datang, dan tinggalkan doa terbaikmu.</p>
      </Muncul>
      <Muncul as="naik">
        <Ucapan tamu={tamu} />
      </Muncul>
    </section>
  );
}

/* ───────── 11. Penutup: taman bunga yang tumbuh ───────── */

const TAMAN: { F: "tulip" | "daisy" | "bloom" | "gerbera"; x: string; h: string; c: Warna; d: number }[] = [
  { F: "tulip", x: "4%", h: "9rem", c: "biru", d: 0 },
  { F: "daisy", x: "20%", h: "12rem", c: "putih", d: 0.15 },
  { F: "bloom", x: "40%", h: "8rem", c: "koral", d: 0.3 },
  { F: "gerbera", x: "60%", h: "11rem", c: "putih", d: 0.1 },
  { F: "tulip", x: "78%", h: "8.5rem", c: "koral", d: 0.25 },
];

function Penutup({ u }: { u: Undangan }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const photoY = useTransform(p, [0, 1], [80, 0]);
  const photoRotate = useTransform(p, [0, 1], [-8, -2]);

  return (
    <section ref={ref} className={`${s.grain} relative overflow-clip bg-(--mentega) px-6 pt-20 pb-[calc(14rem+var(--demo-h,0px))] text-center`}>
      <Gelombang color={W.mentega} />
      <motion.div style={{ y: photoY, rotate: photoRotate }} className="relative mx-auto aspect-[3/4] w-[62%] overflow-hidden rounded-t-full border-[6px] border-(--kertas) shadow-[0_24px_50px_-24px_rgb(18_42_31/0.6)]">
        <Image src={u.foto.belakang} alt={`${u.wanita.panggilan} & ${u.pria.panggilan} membawa buket bunga`} fill sizes="280px" className="object-cover object-[50%_30%]" />
      </motion.div>

      <div className="relative mt-10">
        <Judul size="text-[3rem]">Terima kasih</Judul>
        <Muncul as="blur" delay={0.2}>
          <p className="mx-auto mt-4 max-w-xs text-(--hijau-tua)/80">
            Merupakan kebahagiaan bagi kami apabila kamu berkenan hadir dan memberikan doa restu.
          </p>
          <p className={`${display} mt-6 text-4xl italic`}>
            {u.wanita.panggilan} <span className="text-(--koral)">&</span> {u.pria.panggilan}
          </p>
        </Muncul>
      </div>

      {/* bunga-bunga tumbuh dari bawah: tangkai memanjang, lalu kelopaknya mekar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[var(--demo-h,0px)] h-52" aria-hidden="true">
        {TAMAN.map((t, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 flex w-16 flex-col items-center"
            style={{ left: t.x, height: t.h }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {t.F === "tulip" ? (
              <motion.div
                className="absolute inset-x-0 bottom-0 h-full origin-bottom"
                variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 1, ease, delay: t.d } } }}
              >
                <Tulip className={`${s.sway} h-full w-full`} warna={t.c} />
              </motion.div>
            ) : (
              <>
                <motion.span
                  className="absolute bottom-0 left-1/2 w-1 -translate-x-1/2 origin-bottom rounded-full bg-linear-to-r from-[#557f4c] via-[#86ad78] to-[#557f4c]"
                  style={{ height: "calc(100% - 2rem)" }}
                  variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 0.9, ease, delay: t.d } } }}
                />
                <motion.div
                  className="absolute top-0 size-16"
                  variants={{ hidden: { scale: 0, rotate: -180 }, show: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 120, damping: 10, delay: t.d + 0.7 } } }}
                >
                  {t.F === "daisy" ? (
                    <Daisy className={`${s.spin} size-full`} warna={t.c} />
                  ) : t.F === "bloom" ? (
                    <Bloom className="size-full" warna={t.c} />
                  ) : (
                    <Gerbera className={`${s.spin} size-full`} warna={t.c} />
                  )}
                </motion.div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Isi({ u, opened, tamu }: { u: Undangan; opened: boolean; tamu?: string }) {
  return (
    <>
      <Hero u={u} opened={opened} />
      <Pita u={u} />
      <Salam u={u} />
      <Mempelai u={u} />
      <Kutipan u={u} />
      <Cerita u={u} />
      <Acara u={u} />
      <Galeri u={u} />
      <Kado u={u} />
      <BagianUcapan tamu={tamu} />
      <Penutup u={u} />
    </>
  );
}
