"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import Image from "next/image";
import { type FormEvent, type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useHitungMundur } from "../../pakai";
import type { Foto, Undangan } from "../../types";
import s from "./rimba.module.css";

// Bagian tema Rimba yang butuh state: hitung mundur, galeri + tampilan penuh, amplop digital, RSVP.

const spring = { type: "spring", stiffness: 260, damping: 28 } as const;
const cinzel = "font-[family-name:var(--font-cinzel)]";
export const tombolEmas = `${s.kilau} inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#c79f55_20%,#f3dfa6_40%,#c79f55_60%)] px-6 py-2.5 text-sm font-semibold text-[#1b2a1f] shadow-[0_8px_20px_-8px_rgb(0_0_0/0.7)]`;

// Hitung mundur: tiap satuan waktu di dalam bingkai lengkung emas kecil, membalik masuk bergantian.
// Pemicu "terlihat" dipasang di daftar luar (bukan di kotak yang sedang terlipat 90°, yang tingginya nol).
export function Countdown({ target }: { target: string }) {
  const units = useHitungMundur(target);
  return (
    <div>
      <p className={`${cinzel} mb-4 text-[11px] tracking-[0.3em] text-[#c9a45c] uppercase`}>Menuju hari bahagia</p>
      <motion.dl
        className="grid grid-cols-4 gap-2.5 [perspective:600px]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ staggerChildren: 0.12, delayChildren: 0.4 }}
      >
        {units.map(([n, label]) => (
          <motion.div
            key={label}
            variants={{ hidden: { rotateX: -90, opacity: 0 }, show: { rotateX: 0, opacity: 1, transition: { type: "spring", stiffness: 90, damping: 12 } } }}
            className={`${s.emas} origin-top rounded-t-full p-px shadow-[0_10px_24px_-10px_rgb(0_0_0/0.8)]`}
          >
            <div className="flex flex-col-reverse rounded-t-full bg-[#0d1a12]/85 px-1 pt-5 pb-3 text-center">
              <dt className="mt-1.5 text-[9px] tracking-[0.2em] text-[#e9dcc0]/70 uppercase">{label}</dt>
              <dd className={`${cinzel} relative h-9 overflow-hidden text-[1.7rem] leading-9 font-semibold text-[#e9d7a6] tabular-nums`}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={n ?? "x"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="block"
                  >
                    {n === null ? "–" : String(n).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </dd>
            </div>
          </motion.div>
        ))}
      </motion.dl>
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text.replace(/\s/g, ""));
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {}
      }}
      className="rounded-full border border-[#c9a45c] px-4 py-1.5 text-xs font-semibold text-[#e9d7a6] transition-colors active:bg-[#c9a45c] active:text-[#1b2a1f]"
    >
      {copied ? "Tersalin ✓" : "Salin"}
    </motion.button>
  );
}

// Lapisan modal dipasang di #rb-lapis (di akar tema), bukan di dalam bagian yang sedang dianimasikan:
// elemen fixed di dalam elemen ber-transform akan ikut bergeser.
const noop = () => () => {};
function Lapis({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const el = mounted ? document.getElementById("rb-lapis") : null;
  return el ? createPortal(children, el) : null;
}

// Variasi cara foto galeri masuk: dari samping berputar, naik dari bawah, membesar, dan berbalik 3D
const MASUK: Variants[] = [
  { hidden: { opacity: 0, x: -50, rotate: -8 }, show: { opacity: 1, x: 0, rotate: 0 } },
  { hidden: { opacity: 0, y: 70 }, show: { opacity: 1, y: 0 } },
  { hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1 } },
  { hidden: { opacity: 0, rotateY: 70, x: 30 }, show: { opacity: 1, rotateY: 0, x: 0 } },
];

/* ───────── Galeri: susunan dua kolom, ketuk foto untuk tampilan penuh ───────── */

export function Galeri({ photos }: { photos: Foto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const kolom = [photos.filter((_, i) => i % 2 === 0), photos.filter((_, i) => i % 2 === 1)];

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + photos.length) % photos.length));
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, photos.length]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5 [perspective:900px]">
        {kolom.map((list, k) => (
          // dua kolom bergeser berlawanan arah saat di-scroll
          <div key={k} className={`space-y-2.5 ${k === 1 ? `${s.pJauh} pt-10` : s.pDekat}`}>
            {list.map((p) => {
              const i = photos.indexOf(p);
              return (
                <motion.button
                  key={p.src}
                  type="button"
                  onClick={() => setOpen(i)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={MASUK[i % MASUK.length]}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  whileTap={{ scale: 0.96 }}
                  className="block w-full"
                  aria-label={`Lihat foto: ${p.alt}`}
                >
                  <motion.div layoutId={`rb-foto-${i}`} className="relative overflow-hidden rounded-xl ring-1 ring-[#e9d7a6]/40" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                    <motion.div
                      className="absolute inset-0"
                      variants={{ hidden: { scale: 1.35 }, show: { scale: 1, transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] } } }}
                    >
                      <Image src={p.src} alt={p.alt} fill sizes="210px" className="object-cover" />
                    </motion.div>
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      <Lapis>
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#050a07]/92 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={photos[open].alt}
          >
            <motion.div
              layoutId={`rb-foto-${open}`}
              className="relative max-h-[78svh] w-full max-w-[420px] overflow-hidden rounded-xl"
              style={{ aspectRatio: `${photos[open].w} / ${photos[open].h}` }}
              drag="x"
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) setOpen((open + 1) % photos.length);
                else if (info.offset.x > 70) setOpen((open - 1 + photos.length) % photos.length);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={photos[open].src} alt={photos[open].alt} fill sizes="440px" className="pointer-events-none object-cover" draggable={false} />
            </motion.div>
            <div className="absolute inset-x-0 bottom-[calc(1.5rem+var(--demo-h,0px))] flex items-center justify-center gap-6 text-sm text-[#e9dcc0]" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => setOpen((open - 1 + photos.length) % photos.length)} className="grid size-10 place-items-center rounded-full border border-[#e9dcc0]/40" aria-label="Foto sebelumnya">
                ‹
              </button>
              <span className="tabular-nums">
                {open + 1} / {photos.length}
              </span>
              <button type="button" onClick={() => setOpen((open + 1) % photos.length)} className="grid size-10 place-items-center rounded-full border border-[#e9dcc0]/40" aria-label="Foto berikutnya">
                ›
              </button>
            </div>
            <button type="button" onClick={() => setOpen(null)} className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-[#e9dcc0]/15 text-xl text-[#e9dcc0]" aria-label="Tutup">
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </Lapis>
    </>
  );
}

/* ───────── Amplop digital: tombol membuka lembar dari bawah ───────── */

export function Amplop({ amplop }: { amplop: Undangan["amplop"] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => setOpen(true)} className={tombolEmas}>
        <svg viewBox="0 0 24 24" className={`${s.goyangKado} size-4`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="9" width="16" height="11" rx="1.5" />
          <path d="M3 9h18M12 9v11M12 9S10 4 7.5 5 9 9 12 9Zm0 0s2-5 4.5-4S15 9 12 9Z" />
        </svg>
        Amplop Digital
      </motion.button>

      <Lapis>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#050a07]/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Amplop digital"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={spring}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent
              className="max-h-[80svh] w-full max-w-[440px] overflow-y-auto rounded-t-[2rem] border-t border-[#c9a45c]/50 bg-[#13251b] px-6 pt-4 pb-[calc(2rem+var(--demo-h,0px))] text-center"
            >
              <span className="mx-auto block h-1 w-10 rounded-full bg-[#e9dcc0]/30" />
              <p className={`${cinzel} mt-5 text-xl tracking-[0.15em] text-[#e9d7a6]`}>Amplop Digital</p>
              <p className="mt-2 text-sm text-[#e9dcc0]/75">Silakan kirim tanda kasih melalui rekening berikut.</p>
              <div className="mt-6 space-y-3">
                {amplop.map((a, i) => (
                  <motion.div
                    key={a.nomor}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="rounded-2xl border border-[#c9a45c]/40 bg-[#0d1a12]/70 p-5 text-left"
                  >
                    <p className="text-xs font-semibold tracking-[0.2em] text-[#c9a45c] uppercase">{a.bank}</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className={`${cinzel} text-2xl tracking-wide tabular-nums`}>{a.nomor}</p>
                      <CopyButton text={a.nomor} />
                    </div>
                    <p className="mt-1 text-sm text-[#e9dcc0]/70">a.n. {a.atasNama}</p>
                  </motion.div>
                ))}
              </div>
              <button type="button" onClick={() => setOpen(false)} className="mt-6 text-sm text-[#e9dcc0]/70 underline underline-offset-4">
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </Lapis>
    </>
  );
}

/* ───────── RSVP & ucapan ───────── */

type Surat = { id: number; name: string; hadir: boolean; message: string; waktu: string };

const contohSurat: Surat[] = [
  { id: 2, name: "Tante Mira", hadir: true, message: "Selamat ya, Nak! Semoga jadi keluarga yang sakinah, mawaddah, warahmah.", waktu: "2 hari lalu" },
  { id: 1, name: "Raka", hadir: true, message: "Bahagia selalu kalian berdua, sampai jumpa di hari H!", waktu: "5 hari lalu" },
];

export function Ucapan({ tamu }: { tamu?: string }) {
  const [letters, setLetters] = useState(contohSurat);
  const [hadir, setHadir] = useState(true);
  const [sent, setSent] = useState(false);
  const nextId = useRef(contohSurat.length + 1);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("nama") ?? "").trim();
    if (!name) return;
    setLetters((l) => [{ id: nextId.current++, name, hadir, message: String(data.get("ucapan") ?? "").trim(), waktu: "Baru saja" }, ...l]);
    setSent(true);
    form.reset();
  }

  const field = "w-full rounded-xl border border-[#1b2a1f]/20 bg-white/80 px-4 py-3 text-[15px] text-[#1b2a1f] outline-none placeholder:text-[#1b2a1f]/40 focus:border-[#1b2a1f]/60";

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3 text-left">
        <input name="nama" required defaultValue={tamu} placeholder="Nama kamu" aria-label="Nama" className={field} />
        <textarea name="ucapan" rows={3} placeholder="Tulis ucapan & doa" aria-label="Ucapan dan doa" className={`${field} resize-none`} />
        <fieldset>
          <legend className="mb-2 text-sm text-[#1b2a1f]/80">Konfirmasi kehadiran</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              [true, "Hadir"],
              [false, "Tidak hadir"],
            ].map(([v, label]) => (
              <label
                key={String(v)}
                className="relative cursor-pointer rounded-xl border border-[#1b2a1f]/25 py-2.5 text-center text-sm font-semibold text-[#1b2a1f] has-focus-visible:ring-2 has-focus-visible:ring-[#c9a45c]"
              >
                <input type="radio" name="hadir" checked={hadir === v} onChange={() => setHadir(v as boolean)} className="sr-only" />
                {hadir === v && <motion.span layoutId="rb-hadir" transition={spring} className="absolute inset-0 rounded-[11px] bg-[#1b2a1f]" />}
                <span className={`relative transition-colors ${hadir === v ? "text-[#f3ede0]" : ""}`}>{label as string}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <motion.button type="submit" whileTap={{ scale: 0.97 }} className="w-full rounded-xl bg-[#1b2a1f] py-3.5 font-semibold text-[#f3ede0]">
          Kirim
        </motion.button>
        <AnimatePresence>
          {sent && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-center text-sm text-[#1b2a1f]/80">
              Terima kasih, ucapanmu sudah terkirim.
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <ul data-lenis-prevent className="mt-6 max-h-[24rem] space-y-2.5 overflow-y-auto overscroll-contain rounded-2xl bg-white/50 p-3 text-left">
        <AnimatePresence initial={false}>
          {letters.map((l) => (
            <motion.li
              key={l.id}
              layout
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={spring}
              className="flex gap-3 rounded-xl bg-white/80 p-3 text-[#1b2a1f]"
            >
              <span className={`${cinzel} grid size-9 shrink-0 place-items-center rounded-full bg-[#1b2a1f] text-sm text-[#e9d7a6]`}>{l.name[0]?.toUpperCase()}</span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <span className="truncate">{l.name}</span>
                  <span className={`size-2 shrink-0 rounded-full ${l.hadir ? "bg-[#4f9a5f]" : "bg-[#c4563f]"}`} aria-label={l.hadir ? "Hadir" : "Tidak hadir"} />
                </p>
                <p className="text-[11px] text-[#1b2a1f]/50">{l.waktu}</p>
                {l.message && <p className="mt-1 text-sm leading-relaxed text-[#1b2a1f]/85">{l.message}</p>}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
