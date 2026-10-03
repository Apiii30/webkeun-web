"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import Image from "next/image";
import { type FormEvent, type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useHitungMundur } from "../../pakai";
import type { Foto, Undangan } from "../../types";
import { KembangKawung } from "./ornamen";
import s from "./jawa.module.css";

// Bagian tema Jawa Klasik yang butuh state: hitung mundur, galeri + tampilan penuh, amplop digital, RSVP.

const spring = { type: "spring", stiffness: 260, damping: 28 } as const;
const ease = [0.22, 1, 0.36, 1] as const;
const marcellus = "font-[family-name:var(--font-marcellus)]";
export const tombolHijau = `${s.kilau} inline-flex items-center justify-center gap-2 rounded-full border border-[#c9a35f]/60 bg-[linear-gradient(110deg,#3d5243_20%,#5f7b66_40%,#3d5243_60%)] px-6 py-2.5 text-sm font-semibold tracking-wide text-[#f4f1e4] shadow-[0_10px_22px_-12px_rgb(44_61_49/0.9)]`;
export const tombolEmas = `${s.kilau} inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#c9a35f_20%,#f1dea6_40%,#c9a35f_60%)] px-6 py-2.5 text-sm font-semibold tracking-wide text-[#2c3d31] shadow-[0_10px_22px_-12px_rgb(0_0_0/0.7)]`;

/* ───────── Hitung mundur ───────── */

// Kotak hijau berujung lengkung yang naik bergantian; angkanya bergulir saat berganti.
export function Countdown({ target }: { target: string }) {
  const units = useHitungMundur(target);
  return (
    <motion.dl className="grid grid-cols-4 gap-2" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}>
      {units.map(([n, label]) => (
        <motion.div
          key={label}
          variants={{
            hidden: { opacity: 0, transform: "translateY(26px) scale(0.85)" },
            show: { opacity: 1, transform: "translateY(0px) scale(1)", transition: { duration: 0.8, ease } },
          }}
          className={`${s.hijau} relative flex flex-col-reverse overflow-hidden rounded-t-[2.2rem] rounded-b-xl border border-[#c9a35f]/50 px-1 pt-5 pb-2 text-center shadow-[0_10px_20px_-12px_rgb(44_61_49/0.9)]`}
        >
          <KembangKawung className="absolute -top-3 -right-3 size-10 opacity-20" warna="#e3c98a" />
          <dt className="relative mt-0.5 text-[10px] tracking-[0.18em] text-[#d9c99a] uppercase">{label}</dt>
          <dd className={`${marcellus} relative h-9 overflow-hidden text-[1.7rem] leading-9 text-[#f4f1e4] tabular-nums`}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={n ?? "x"} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.45, ease }} className="block">
                {n === null ? "–" : String(n).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}

// Lapisan modal dipasang di #jw-lapis (di akar tema), bukan di dalam bagian yang sedang dianimasikan:
// elemen fixed di dalam elemen ber-transform akan ikut bergeser.
const noop = () => () => {};
function Lapis({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const el = mounted ? document.getElementById("jw-lapis") : null;
  return el ? createPortal(children, el) : null;
}

// Variasi cara foto galeri masuk. Semua memakai `transform` utuh supaya dijalankan mesin animasi browser.
const MASUK: Variants[] = [
  { hidden: { opacity: 0, transform: "translateY(50px) rotate(-5deg)" }, show: { opacity: 1, transform: "translateY(0px) rotate(0deg)" } },
  { hidden: { opacity: 0, transform: "scale(0.8)" }, show: { opacity: 1, transform: "scale(1)" } },
  { hidden: { opacity: 0, transform: "translateX(40px) rotate(5deg)" }, show: { opacity: 1, transform: "translateX(0px) rotate(0deg)" } },
  { hidden: { opacity: 0, transform: "translateY(60px)" }, show: { opacity: 1, transform: "translateY(0px)" } },
];

/* ───────── Galeri: dua kolom yang bergeser berlawanan, ketuk foto untuk tampilan penuh ───────── */

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
      <div className="grid grid-cols-2 gap-3">
        {kolom.map((list, k) => (
          <div key={k} className={`space-y-3 ${k === 1 ? `${s.pJauh} pt-14` : s.pDekat}`}>
            {list.map((p) => {
              const i = photos.indexOf(p);
              // foto pertama tiap kolom berujung lengkung seperti kori, sisanya sudut membulat
              const bentuk = i < 2 ? "rounded-t-full rounded-b-xl" : "rounded-xl";
              return (
                <motion.button
                  key={p.src}
                  type="button"
                  onClick={() => setOpen(i)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={MASUK[i % MASUK.length]}
                  transition={{ duration: 1, ease }}
                  className="block w-full"
                  aria-label={`Lihat foto: ${p.alt}`}
                >
                  <motion.div layoutId={`jw-foto-${i}`} className={`relative overflow-hidden border border-[#b08a4a]/70 p-1 ${bentuk}`} style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                    <div className={`relative h-full w-full overflow-hidden ${bentuk}`}>
                      <Image src={p.src} alt={p.alt} fill sizes="210px" className="object-cover" />
                    </div>
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
              className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1f2b22]/94 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              role="dialog"
              aria-modal="true"
              aria-label={photos[open].alt}
            >
              <motion.div
                layoutId={`jw-foto-${open}`}
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
              <div className="absolute inset-x-0 bottom-[calc(1.5rem+var(--demo-h,0px))] flex items-center justify-center gap-6 text-sm text-[#f4f1e4]" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => setOpen((open - 1 + photos.length) % photos.length)} className="grid size-10 place-items-center rounded-full border border-[#f4f1e4]/40" aria-label="Foto sebelumnya">
                  ‹
                </button>
                <span className="tabular-nums">
                  {open + 1} / {photos.length}
                </span>
                <button type="button" onClick={() => setOpen((open + 1) % photos.length)} className="grid size-10 place-items-center rounded-full border border-[#f4f1e4]/40" aria-label="Foto berikutnya">
                  ›
                </button>
              </div>
              <button type="button" onClick={() => setOpen(null)} className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-[#f4f1e4]/15 text-xl text-[#f4f1e4]" aria-label="Tutup">
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Lapis>
    </>
  );
}

/* ───────── Amplop digital: lembar yang naik dari bawah ───────── */

export function Amplop({ amplop }: { amplop: Undangan["amplop"] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => setOpen(true)} className={tombolHijau}>
        <svg viewBox="0 0 24 24" className={`${s.goyangKado} size-4`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="9" width="16" height="11" rx="1.5" />
          <path d="M3 9h18M12 9v11M12 9S10 4 7.5 5 9 9 12 9Zm0 0s2-5 4.5-4S15 9 12 9Z" />
        </svg>
        Amplop Digital
      </motion.button>

      <Lapis>
        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#1f2b22]/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Amplop digital"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={spring}
                onClick={(e) => e.stopPropagation()}
                className={`${s.kertas} relative max-h-[80svh] w-full max-w-[440px] overflow-y-auto rounded-t-[2rem] px-6 pt-4 pb-[calc(2rem+var(--demo-h,0px))] text-center text-[#2f3d33]`}
              >
                <span className="mx-auto block h-1 w-10 rounded-full bg-[#2f3d33]/25" />
                <p className={`${marcellus} mt-5 text-2xl text-[#3d5243]`}>Amplop Digital</p>
                <p className="mt-2 text-sm text-[#2f3d33]/75">Silakan kirim tanda kasih melalui rekening berikut.</p>
                <div className="mt-6 space-y-3">
                  {amplop.map((a, i) => (
                    <motion.div
                      key={a.nomor}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className={`${s.hijau} relative overflow-hidden rounded-2xl p-5 text-left text-[#f4f1e4]`}
                    >
                      <div className={`${s.kawung} absolute inset-y-0 right-0 w-1/2 opacity-20 [mask-image:linear-gradient(to_left,black,transparent)]`} />
                      <p className="relative text-xs font-semibold tracking-[0.2em] text-[#e3c98a] uppercase">{a.bank}</p>
                      <div className="relative mt-2 flex items-center justify-between gap-3">
                        <p className={`${marcellus} text-2xl tracking-wide tabular-nums`}>{a.nomor}</p>
                        <SalinNomor text={a.nomor} />
                      </div>
                      <p className="relative mt-1 text-sm text-[#f4f1e4]/75">a.n. {a.atasNama}</p>
                    </motion.div>
                  ))}
                </div>
                <button type="button" onClick={() => setOpen(false)} className="mt-6 text-sm text-[#2f3d33]/70 underline underline-offset-4">
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

function SalinNomor({ text }: { text: string }) {
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
      className="shrink-0 rounded-full border border-[#e3c98a] px-4 py-1.5 text-xs font-semibold text-[#f4f1e4] transition-colors active:bg-[#e3c98a] active:text-[#2c3d31]"
    >
      {copied ? "Tersalin ✓" : "Salin"}
    </motion.button>
  );
}

/* ───────── RSVP & ucapan ───────── */

type Surat = { id: number; name: string; hadir: boolean; message: string; waktu: string };

const contohSurat: Surat[] = [
  { id: 2, name: "Mbak Sekar", hadir: true, message: "Sugeng nempuh gesang enggal! Mugi dados kulawarga ingkang sakinah, mawaddah, warahmah.", waktu: "2 dinten kepengker" },
  { id: 1, name: "Mas Bayu", hadir: true, message: "Bahagia selalu kalian berdua, sampai jumpa di hari H!", waktu: "5 dinten kepengker" },
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
    setLetters((l) => [{ id: nextId.current++, name, hadir, message: String(data.get("ucapan") ?? "").trim(), waktu: "Nembe kemawon" }, ...l]);
    setSent(true);
    form.reset();
  }

  const field = "w-full rounded-xl border border-[#3d5243]/25 bg-white/70 px-4 py-3 text-[15px] text-[#2f3d33] outline-none placeholder:text-[#2f3d33]/40 focus:border-[#3d5243]";

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3 text-left">
        <input name="nama" required defaultValue={tamu} placeholder="Nama kamu" aria-label="Nama" className={field} />
        <textarea name="ucapan" rows={3} placeholder="Tulis ucapan & doa" aria-label="Ucapan dan doa" className={`${field} resize-none`} />
        <fieldset>
          <legend className="mb-2 text-sm text-[#2f3d33]/80">Konfirmasi kehadiran</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              [true, "Hadir"],
              [false, "Tidak hadir"],
            ].map(([val, label]) => (
              <label
                key={String(val)}
                className="relative cursor-pointer rounded-xl border border-[#3d5243]/30 py-2.5 text-center text-sm font-semibold text-[#3d5243] has-focus-visible:ring-2 has-focus-visible:ring-[#c9a35f]"
              >
                <input type="radio" name="hadir" checked={hadir === val} onChange={() => setHadir(val as boolean)} className="sr-only" />
                {hadir === val && <motion.span layoutId="jw-hadir" transition={spring} className="absolute inset-0 rounded-[11px] bg-[#3d5243]" />}
                <span className={`relative transition-colors ${hadir === val ? "text-[#f4f1e4]" : ""}`}>{label as string}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <motion.button type="submit" whileTap={{ scale: 0.97 }} className={`${tombolEmas} w-full rounded-xl py-3.5`}>
          Kirim
        </motion.button>
        <AnimatePresence>
          {sent && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-center text-sm text-[#2f3d33]/80">
              Matur nuwun, ucapanmu sudah terkirim.
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <ul className="mt-6 max-h-[24rem] space-y-2.5 overflow-y-auto overscroll-contain rounded-2xl border border-[#3d5243]/15 bg-white/40 p-3 text-left">
        <AnimatePresence initial={false}>
          {letters.map((l) => (
            <motion.li key={l.id} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={spring} className="flex gap-3 rounded-xl bg-white/75 p-3 text-[#2f3d33]">
              <span className={`${marcellus} grid size-9 shrink-0 place-items-center rounded-t-full rounded-b-md bg-[#3d5243] text-sm text-[#f4f1e4]`}>{l.name[0]?.toUpperCase()}</span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <span className="truncate">{l.name}</span>
                  <span className={`size-2 shrink-0 rounded-full ${l.hadir ? "bg-[#5f8a63]" : "bg-[#b9787a]"}`} aria-label={l.hadir ? "Hadir" : "Tidak hadir"} />
                </p>
                <p className="text-[11px] text-[#2f3d33]/50">{l.waktu}</p>
                {l.message && <p className="mt-1 text-sm leading-relaxed text-[#2f3d33]/85">{l.message}</p>}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
