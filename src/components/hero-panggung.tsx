"use client";

import { animate, AnimatePresence, motion, MotionConfig, type MotionValue, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { heroPanggung } from "@/lib/site";
import { Icon } from "./icons";

// Panggung hero "tinggal kamu sebar". HP memperagakan undangan yang disebar: link dikirim ke tamu lewat WhatsApp →
// diketuk → undangan terbuka dengan nama tamunya → RSVP masuk. Lalu tamu & temanya berganti. Di belakangnya jendela
// browser bergantian menampilkan contoh website, alamatnya terketik. Dengan mouse, lapisan-lapisannya bergeser
// (parallax). Berhenti saat tidak terlihat; dengan "kurangi gerakan", tampil diam di undangan yang sudah terbuka.

const { undangan, website } = heroPanggung;
// lama tiap fase (ms): 0 pesan masuk, 1 link diketuk, 2 undangan terbuka, 3 RSVP masuk
const JADWAL = [1900, 650, 1300, 2600];
const lembut = [0.16, 1, 0.3, 1] as const;
const pegas = { type: "spring", stiffness: 360, damping: 26 } as const;
// ukuran gambar sampul sama di semua tempat, supaya browser cukup mengunduh satu kali
const UKURAN_SAMPUL = "(min-width: 768px) 240px, 160px";

export function HeroPanggung() {
  const ref = useRef<HTMLDivElement>(null);
  const terlihat = useInView(ref, { amount: 0.3 });
  const kurangiGerak = useReducedMotion();
  const [i, setI] = useState(0);
  const [fase, setFase] = useState(0);
  const jalan = terlihat && !kurangiGerak;
  const f = kurangiGerak ? 2 : fase;
  const u = undangan[i];
  const w = i % website.length;

  useEffect(() => {
    if (!jalan) return;
    const t = setTimeout(() => {
      if (fase < JADWAL.length - 1) setFase(fase + 1);
      else {
        setFase(0);
        setI((i + 1) % undangan.length);
      }
    }, JADWAL[fase]);
    return () => clearTimeout(t);
  }, [fase, i, jalan]);

  // parallax mengikuti mouse: browser bergeser sedikit, HP lebih jauh, kartu melayang paling jauh
  const mx = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const lapisBrowser = useGeser(mx, my, -10);
  const lapisHp = useGeser(mx, my, 14);
  const lapisKartu = useGeser(mx, my, 24);
  function gerak(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || kurangiGerak) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={ref}
        onPointerMove={gerak}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="absolute inset-0"
      >
        {/* latar: lingkaran lembut & bintang */}
        <div aria-hidden="true" className="absolute top-[6%] right-[-6%] aspect-square w-[78%] rounded-full bg-white/45" />
        <div aria-hidden="true" className="absolute top-[14%] right-[4%] aspect-square w-[58%] rounded-full border-2 border-dashed border-brand/15" />
        <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute top-[2%] right-[8%] w-9 animate-twinkle text-mint">
          <path d="M50 0 C53 36 64 47 100 50 C64 53 53 64 50 100 C47 64 36 53 0 50 C36 47 47 36 50 0Z" fill="currentColor" />
        </svg>

        {/* jendela browser: contoh website bergantian */}
        <motion.div
          style={lapisBrowser}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1, ease: lembut, delay: 0.2 } }}
          className="absolute top-[3%] left-0 w-[86%] sm:w-[82%]"
        >
          <div className="rounded-2xl bg-white p-1.5 shadow-[0_30px_60px_-28px_rgb(21_19_43/0.45)] sm:rounded-[1.2rem]">
            <div className="flex items-center gap-1.5 px-1.5 pt-0.5 pb-1.5">
              <span className="size-2 shrink-0 rounded-full bg-[#ff6159]" />
              <span className="size-2 shrink-0 rounded-full bg-[#ffbd2e]" />
              <span className="size-2 shrink-0 rounded-full bg-[#28c840]" />
              <span className="ml-1.5 flex min-w-0 flex-1 items-center gap-1 rounded-full bg-lilac-soft px-2.5 py-0.5 text-[10px] font-medium text-ink/60 sm:text-[11px]">
                <Icon name="lock" className="size-3 shrink-0 text-[#0f8f74]" strokeWidth={2.5} />
                <Ketik teks={website[w].url} diam={!!kurangiGerak} />
              </span>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-lilac-soft">
              {website.map((s, k) => (
                <motion.div key={s.src} className="absolute inset-0" initial={false} animate={{ opacity: k === w ? 1 : 0, scale: k === w ? 1 : 1.04 }} transition={{ duration: 0.8, ease: lembut }}>
                  <Image
                    src={s.src}
                    alt={k === w ? `Contoh website ${s.jenis.toLowerCase()} ${s.url}` : ""}
                    fill
                    sizes="(min-width: 768px) 470px, 80vw"
                    priority={k === 0}
                    className="object-cover object-top"
                  />
                </motion.div>
              ))}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={website[w].jenis}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm sm:text-xs"
                >
                  <Icon name="browser" className="size-3.5 text-mint" strokeWidth={2.5} />
                  {website[w].jenis}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* HP: undangan disebar lewat WhatsApp */}
        <motion.div
          style={lapisHp}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1.1, ease: lembut, delay: 0.45 } }}
          className="absolute right-[2%] bottom-[1%] z-10 w-[42%] max-w-[15.5rem] sm:w-[37%]"
        >
          <motion.div animate={kurangiGerak ? undefined : { y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <div className="rounded-[2.3rem] bg-ink p-[5%] shadow-[0_40px_70px_-30px_rgb(21_19_43/0.7)] ring-1 ring-white/10">
              <div className="relative aspect-[9/19] overflow-hidden rounded-[1.85rem] bg-[#efe7de]">
                <LayarChat u={u} i={i} fase={f} />
                <AnimatePresence>{f >= 2 && <LayarUndangan key={`buka-${i}`} u={u} />}</AnimatePresence>
                <span aria-hidden="true" className="absolute top-[1.6%] left-1/2 z-20 h-[3.2%] w-[32%] -translate-x-1/2 rounded-full bg-ink" />
              </div>
            </div>
          </motion.div>
          {/* gambar sampul berikutnya dimuat diam-diam supaya langsung tampil saat gilirannya */}
          <span className="pointer-events-none absolute size-px overflow-hidden opacity-0" aria-hidden="true">
            <Image src={undangan[(i + 1) % undangan.length].sampul} alt="" width={240} height={480} sizes={UKURAN_SAMPUL} />
          </span>
        </motion.div>

        {/* kartu yang melayang di depan */}
        <motion.div style={lapisKartu} className="pointer-events-none absolute inset-0 z-20">
          <AnimatePresence>
            {f >= 2 && (
              <motion.span
                key={`stiker-${i}`}
                initial={{ opacity: 0, scale: 0.6, rotate: -14 }}
                animate={{ opacity: 1, scale: 1, rotate: -6, transition: { ...pegas, delay: 0.5 } }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                className="absolute top-[47%] right-[37%] inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[11px] font-bold whitespace-nowrap text-white shadow-[0_12px_24px_-10px_rgb(91_61_245/0.8)] sm:right-[33%] sm:text-xs"
              >
                <Icon name="user" className="size-3.5" strokeWidth={2.5} />
                Nama tamu otomatis
              </motion.span>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {f === 3 && (
              <motion.div
                key={`rsvp-${i}`}
                initial={{ opacity: 0, x: 24, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1, transition: pegas }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                className="absolute right-[40%] bottom-[12%] flex items-center gap-2.5 rounded-2xl bg-white py-2 pr-3.5 pl-2 shadow-[0_20px_40px_-18px_rgb(21_19_43/0.5)] ring-1 ring-ink/5 sm:right-[36%]"
              >
                <span className="grid size-8 place-items-center rounded-full bg-mint text-sm font-bold text-ink sm:size-9">{u.tamu[0]}</span>
                <span className="leading-tight">
                  <span className="block text-[10px] font-semibold text-ink/50 sm:text-[11px]">RSVP masuk</span>
                  <span className="block text-[13px] font-bold sm:text-sm">{u.tamu} · Hadir</span>
                </span>
                <span className="grid size-5 place-items-center rounded-full bg-[#0f8f74] text-white">
                  <Icon name="check" className="size-3" strokeWidth={3.5} />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

function useGeser(mx: MotionValue<number>, my: MotionValue<number>, jarak: number) {
  return { x: useTransform(mx, (v) => v * jarak), y: useTransform(my, (v) => v * jarak) };
}

type Undangan = (typeof undangan)[number];

function LayarChat({ u, i, fase }: { u: Undangan; i: number; fase: number }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center gap-1.5 bg-[#008069] px-2.5 pt-[18%] pb-2 text-white sm:gap-2 sm:px-3 sm:pt-[17%]">
        <Icon name="arrow" className="size-3 shrink-0 rotate-180" strokeWidth={2.5} />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={u.tamu} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/25 text-[10px] font-bold sm:size-7 sm:text-xs">{u.tamu[0]}</span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[11px] font-bold sm:text-[13px]">{u.tamu}</span>
              <span className="block text-[8px] text-white/75 sm:text-[9px]">online</span>
            </span>
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex flex-1 flex-col justify-end bg-[radial-gradient(rgb(0_0_0/0.06)_1px,transparent_1px)] [background-size:11px_11px] p-2 sm:p-2.5">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`pesan-${i}`}
            initial={{ opacity: 0, y: 18, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { ...pegas, delay: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="ml-auto w-[92%] origin-bottom-right rounded-xl rounded-tr-sm bg-[#d9fdd3] p-1 shadow-sm sm:p-1.5"
          >
            <div className="relative overflow-hidden rounded-lg bg-white/75">
              <div className="relative aspect-[16/9]">
                <Image src={u.sampul} alt="" fill sizes={UKURAN_SAMPUL} className="object-cover object-[50%_28%]" />
              </div>
              <div className="px-1.5 py-1 sm:px-2 sm:py-1.5">
                <p className="truncate text-[9px] leading-tight font-bold sm:text-[10.5px]">The Wedding of {u.pasangan}</p>
                <p className="truncate text-[8px] text-[#027eb5] sm:text-[9.5px]">
                  {u.url}/?to={u.tamu}
                </p>
              </div>
              {/* sentuhan jari saat link diketuk */}
              <AnimatePresence>
                {fase === 1 && (
                  <motion.span
                    initial={{ opacity: 0.7, scale: 0.3 }}
                    animate={{ opacity: 0, scale: 2.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="absolute top-[38%] left-1/2 size-8 -translate-1/2 rounded-full bg-ink/30"
                  />
                )}
              </AnimatePresence>
            </div>
            <p className="px-1 pt-1 text-[9px] leading-snug sm:text-[10.5px]">Halo {u.tamu}! Dengan hormat, kami mengundang kamu ke pernikahan kami 🙏</p>
            <p className="flex items-center justify-end gap-0.5 px-1 text-[7.5px] text-ink/45 sm:text-[8.5px]">
              09.41
              <svg viewBox="0 0 18 11" className="h-2 w-3 text-[#53bdeb]" aria-hidden="true">
                <path d="M1 6l3.5 3.5L11 2M7 9.5l.5.5L16 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1.5 px-2 pb-[9%] sm:px-2.5">
        <span className="h-6 flex-1 rounded-full bg-white sm:h-7" />
        <span className="grid size-6 place-items-center rounded-full bg-[#008069] text-white sm:size-7">
          <Icon name="arrow" className="size-3" strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
}

function LayarUndangan({ u }: { u: Undangan }) {
  return (
    <motion.div
      initial={{ clipPath: "inset(52% 8% 30% 12% round 14px)", opacity: 0.4 }}
      animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1, transition: { duration: 0.7, ease: lembut } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="absolute inset-0 z-10"
    >
      <Image src={u.sampul} alt={`Undangan ${u.pasangan} untuk ${u.tamu}`} fill sizes={UKURAN_SAMPUL} className="object-cover" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0, transition: { ...pegas, delay: 0.45 } }}
        className="absolute inset-x-[8%] bottom-[14%] rounded-2xl bg-white/90 px-2 py-2 text-center text-ink shadow-lg backdrop-blur-sm sm:py-2.5"
      >
        <p className="text-[7px] font-semibold tracking-[0.22em] text-ink/50 uppercase sm:text-[8px]">Kepada Yth.</p>
        <p className="font-serif text-base leading-tight italic sm:text-lg">{u.tamu}</p>
        <p className="mx-auto mt-1 inline-flex rounded-full bg-ink px-2.5 py-0.5 text-[7.5px] font-semibold text-white sm:text-[8.5px]">Buka undangan</p>
      </motion.div>
    </motion.div>
  );
}

// Teks yang terketik huruf demi huruf (alamat website di jendela browser)
function Ketik({ teks, diam }: { teks: string; diam: boolean }) {
  const n = useMotionValue(diam ? teks.length : 0);
  const tampil = useTransform(n, (v) => teks.slice(0, Math.round(v)));
  useEffect(() => {
    if (diam) {
      n.set(teks.length);
      return;
    }
    n.set(0);
    const c = animate(n, teks.length, { duration: teks.length * 0.05, ease: "linear", delay: 0.3 });
    return () => c.stop();
  }, [teks, diam, n]);
  return (
    <span className="truncate">
      <motion.span>{tampil}</motion.span>
      <span className="ml-px inline-block h-[1em] w-px translate-y-[0.15em] animate-pulse bg-ink/50" />
    </span>
  );
}
