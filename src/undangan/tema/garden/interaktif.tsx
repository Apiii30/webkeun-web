"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { type FormEvent, type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useHitungMundur } from "../../pakai";
import type { Foto, Undangan } from "../../types";
import { LEMBUT, cormorant, italiana } from "./hias";
import s from "./garden.module.css";

// Bagian tema Garden Premium yang butuh state: hitung mundur, galeri dinding, amplop digital, RSVP.

const spring = { type: "spring", stiffness: 260, damping: 28 } as const;
export const tombolEmas = `${s.kilau} inline-flex items-center justify-center gap-2 rounded-full border border-[#f2e3b5]/60 bg-[linear-gradient(110deg,#a8843f_20%,#f1e0ae_40%,#a8843f_60%)] px-6 py-2.5 text-[12px] font-medium tracking-[0.22em] text-[#24434e] uppercase shadow-[0_10px_24px_-12px_rgb(20_40_48/0.8)]`;
export const tombolTeal = "inline-flex items-center justify-center gap-2 rounded-full bg-[#2f5563] px-6 py-2.5 text-[12px] font-medium tracking-[0.22em] text-[#f3efe3] uppercase shadow-[0_10px_22px_-12px_rgb(20_40_48/0.9)] ring-1 ring-[#dcc58f]/60";

// Lapisan modal dipasang di #gd-lapis (di akar tema): elemen fixed di dalam elemen ber-transform akan ikut bergeser.
const noop = () => () => {};
function Lapis({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const el = mounted ? document.getElementById("gd-lapis") : null;
  return el ? createPortal(children, el) : null;
}

/* ───────── Hitung mundur: kotak berpuncak lengkung bergaris emas ───────── */

export function Countdown({ target }: { target: string }) {
  const units = useHitungMundur(target);
  return (
    <motion.dl className="grid grid-cols-4 gap-2.5" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}>
      {units.map(([n, label]) => (
        <motion.div
          key={label}
          variants={{ hidden: { opacity: 0, transform: "translateY(26px) scale(0.9)" }, show: { opacity: 1, transform: "translateY(0px) scale(1)", transition: { duration: 1, ease: LEMBUT } } }}
          className="flex flex-col-reverse rounded-t-full rounded-b-lg border border-[#dcc58f]/60 bg-[#f3efe3]/8 px-1 pt-5 pb-2.5 text-center"
        >
          <dt className="mt-1 text-[9px] tracking-[0.25em] text-[#f3efe3]/75 uppercase">{label}</dt>
          {/* angka baru masuk lewat animasi CSS, kotaknya `contain: strict`: pergantian tiap detik tidak memaksa
              browser mengukur ulang seluruh halaman (di Safari itu membuat scroll tersendat sekali per detik) */}
          <dd className={`${italiana} relative h-9 overflow-hidden text-[1.9rem] leading-9 text-[#f3efe3] tabular-nums [contain:strict]`}>
            <span key={n ?? "x"} className={`${s.gulir} block`}>
              {n === null ? "–" : String(n).padStart(2, "0")}
            </span>
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}

/* ───────── Galeri dinding: pigura emas yang tergantung di paku & berayun saat muncul ───────── */

// Susunan pigura ala dinding museum: satu besar, lalu berpasangan dengan tinggi berbeda
const SUSUN = ["col-span-2 aspect-[4/3]", "aspect-[3/4]", "aspect-[3/4] mt-8", "col-span-2 aspect-[16/10]", "aspect-[4/5]", "aspect-[4/5] -mt-6", "col-span-2 aspect-[4/3]"];

export function Galeri({ photos }: { photos: Foto[] }) {
  const [open, setOpen] = useState<number | null>(null);

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
      <div className="grid grid-cols-2 gap-x-4 gap-y-7">
        {photos.map((p, i) => (
          <motion.div
            key={p.src}
            className={`relative ${SUSUN[i % SUSUN.length]}`}
            style={{ transformOrigin: "50% -14px" }}
            initial={{ opacity: 0, transform: `rotate(${i % 2 ? 9 : -9}deg)` }}
            whileInView={{ opacity: 1, transform: "rotate(0deg)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ opacity: { duration: 0.5 }, transform: { type: "spring", stiffness: 70, damping: 7, mass: 1.1 } }}
          >
            {/* tali & paku */}
            <svg viewBox="0 0 60 18" className="pointer-events-none absolute -top-[17px] left-1/2 w-14 -translate-x-1/2" aria-hidden="true">
              <path d="M6 18 30 3 54 18" fill="none" stroke="#b9975b" strokeWidth="1.2" />
              <circle cx="30" cy="3" r="2.6" fill="#dcc58f" stroke="#7a5c2a" strokeWidth=".8" />
            </svg>
            <motion.button
              type="button"
              onClick={() => setOpen(i)}
              whileTap={{ scale: 0.97 }}
              className={`${s.pigura} absolute inset-0 block rounded-[3px] p-[7px]`}
              aria-label={`Lihat foto: ${p.alt}`}
            >
              <span className="relative block h-full w-full overflow-hidden bg-[#eef1ec] p-[3px] shadow-[inset_0_0_0_1px_rgb(122_92_42/0.5)]">
                <span className="relative block h-full w-full overflow-hidden">
                  <span className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
                    <Image src={p.src} alt={p.alt} fill sizes={SUSUN[i % SUSUN.length].includes("col-span-2") ? "400px" : "200px"} className="object-cover" />
                  </span>
                </span>
              </span>
            </motion.button>
          </motion.div>
        ))}
      </div>

      <Lapis>
        <AnimatePresence>
          {open !== null && (
            <motion.div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-[#16282f]/94 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              role="dialog"
              aria-modal="true"
              aria-label={photos[open].alt}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={open}
                  initial={{ opacity: 0, transform: "scale(0.92)" }}
                  animate={{ opacity: 1, transform: "scale(1)" }}
                  exit={{ opacity: 0, transform: "scale(1.04)" }}
                  transition={{ duration: 0.45, ease: LEMBUT }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) < 60) return;
                    setOpen((o) => (o === null ? o : (o + (info.offset.x < 0 ? 1 : -1) + photos.length) % photos.length));
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`${s.pigura} relative w-full max-w-[420px] rounded-[3px] p-2`}
                  style={{ aspectRatio: `${photos[open].w} / ${photos[open].h}`, maxHeight: "78svh" }}
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <Image src={photos[open].src} alt={photos[open].alt} fill sizes="440px" className="pointer-events-none object-cover" />
                  </div>
                </motion.div>
              </AnimatePresence>
              <p className="absolute bottom-[calc(1.5rem+var(--demo-h,0px))] text-xs tracking-[0.3em] text-[#f3efe3]/70">
                {open + 1} / {photos.length}
              </p>
              <button type="button" onClick={() => setOpen(null)} className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/10 text-white" aria-label="Tutup">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Lapis>
    </>
  );
}

/* ───────── Amplop digital: lembar dari bawah berisi kartu rekening ───────── */

export function Amplop({ amplop }: { amplop: Undangan["amplop"] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => setOpen(true)} className={tombolEmas}>
        <svg viewBox="0 0 24 24" className={`${s.goyangKado} size-4`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="9" width="16" height="11" rx="1.5" />
          <path d="M3 9h18M12 9v11M12 9S10 4 7.5 5 9 9 12 9Zm0 0s2-5 4.5-4S15 9 12 9Z" />
        </svg>
        Amplop Digital
      </motion.button>

      <Lapis>
        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#16282f]/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Amplop digital"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={spring}
                onClick={(e) => e.stopPropagation()}
                className={`${s.kertas} max-h-[85svh] w-full max-w-[440px] overflow-y-auto rounded-t-[2rem] px-6 pt-4 pb-[calc(2rem+var(--demo-h,0px))] text-center text-[#24434e]`}
              >
                <span className="mx-auto block h-1 w-10 rounded-full bg-[#24434e]/20" />
                <p className={`${cormorant} mt-5 text-3xl italic`}>Amplop Digital</p>
                <p className="mt-2 text-sm text-[#24434e]/75">Silakan kirim tanda kasih melalui rekening berikut.</p>
                <div className="mt-6 space-y-4">
                  {amplop.map((a, i) => (
                    <KartuBank key={a.nomor} a={a} i={i} />
                  ))}
                </div>
                <button type="button" onClick={() => setOpen(false)} className="mt-6 text-sm text-[#24434e]/60 underline underline-offset-4">
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

// Kartu rekening teal berbingkai emas tipis, dengan siluet lengkung gapura samar
function KartuBank({ a, i }: { a: Undangan["amplop"][number]; i: number }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(30px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: LEMBUT }}
      className={`${s.panel} relative overflow-hidden rounded-2xl! p-5 text-left text-[#f3efe3] shadow-[0_24px_40px_-20px_rgb(20_40_48/0.9)]`}
    >
      <span className="pointer-events-none absolute inset-2 rounded-xl border border-[#dcc58f]/50" aria-hidden="true" />
      <svg viewBox="0 0 100 120" className="pointer-events-none absolute -right-4 -bottom-8 w-32 opacity-15" aria-hidden="true">
        <path d="M10 120V50a40 40 0 0 1 80 0v70h-14V50a26 26 0 0 0-52 0v70Z" fill="#f3efe3" />
      </svg>
      <p className="text-[10px] tracking-[0.3em] text-[#dcc58f] uppercase">{a.bank}</p>
      <p className={`${italiana} mt-3 text-[1.7rem] tracking-[0.08em] tabular-nums`}>{a.nomor}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[9px] tracking-[0.25em] text-[#f3efe3]/60 uppercase">Atas nama</p>
          <p className="text-sm">{a.atasNama}</p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(a.nomor.replace(/\s/g, ""));
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            } catch {}
          }}
          className="relative shrink-0 rounded-full border border-[#dcc58f]/70 px-4 py-1.5 text-xs text-[#dcc58f]"
        >
          {copied ? "Tersalin ✓" : "Salin"}
        </motion.button>
      </div>
    </motion.div>
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

  const field = "w-full rounded-xl border border-[#dcc58f]/40 bg-[#f3efe3] px-4 py-3 text-[15px] text-[#24434e] outline-none placeholder:text-[#24434e]/45 focus:border-[#dcc58f]";

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3 text-left">
        <input name="nama" required defaultValue={tamu} placeholder="Nama kamu" aria-label="Nama" className={field} />
        <textarea name="ucapan" rows={3} placeholder="Tulis ucapan & doa" aria-label="Ucapan dan doa" className={`${field} resize-none`} />
        <fieldset>
          <legend className="mb-2 text-sm text-[#f3efe3]/85">Konfirmasi kehadiran</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              [true, "Hadir"],
              [false, "Tidak hadir"],
            ].map(([val, label]) => (
              <label key={String(val)} className="relative cursor-pointer rounded-xl border border-[#dcc58f]/50 py-2.5 text-center text-sm text-[#f3efe3]/85 has-focus-visible:ring-2 has-focus-visible:ring-[#dcc58f]">
                <input type="radio" name="hadir" checked={hadir === val} onChange={() => setHadir(val as boolean)} className="sr-only" />
                {hadir === val && <motion.span layoutId="gd-hadir" transition={spring} className="absolute inset-0 rounded-[11px] bg-[#dcc58f]" />}
                <span className={`relative transition-colors ${hadir === val ? "font-medium text-[#24434e]" : ""}`}>{label as string}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <motion.button type="submit" whileTap={{ scale: 0.97 }} className={`${tombolEmas} w-full py-3.5`}>
          Kirim Ucapan
        </motion.button>
        <AnimatePresence>
          {sent && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-center text-sm text-[#f3efe3]/85">
              Terima kasih, ucapanmu sudah terkirim.
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <ul className="mt-6 max-h-[24rem] space-y-2.5 overflow-y-auto overscroll-contain rounded-2xl bg-[#24434e]/60 p-3 text-left">
        <AnimatePresence initial={false}>
          {letters.map((l) => (
            <motion.li key={l.id} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={spring} className={`${s.kertas} flex gap-3 rounded-xl p-3 text-[#24434e]`}>
              <span className={`${italiana} grid size-9 shrink-0 place-items-center rounded-full bg-[#2f5563] text-base text-[#dcc58f]`}>{l.name[0]?.toUpperCase()}</span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <span className="truncate">{l.name}</span>
                  <span className={`size-2 shrink-0 rounded-full ${l.hadir ? "bg-[#5a8a6a]" : "bg-[#b4553e]"}`} aria-label={l.hadir ? "Hadir" : "Tidak hadir"} />
                </p>
                <p className="text-[11px] text-[#24434e]/50">{l.waktu}</p>
                {l.message && <p className="mt-1 text-sm leading-relaxed text-[#24434e]/85">{l.message}</p>}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
