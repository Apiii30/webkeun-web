"use client";

import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, type ReactNode, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useHitungMundur } from "../../pakai";
import type { Undangan } from "../../types";
import s from "./delima.module.css";
import { HALUS, naskah, prata } from "./hias";

// Bagian tema Merah Delima yang butuh state: hitung mundur, amplop digital, RSVP. Galeri di galeri.tsx.

const spring = { type: "spring", stiffness: 260, damping: 28 } as const;
export const tombolEmas = `${s.kilau} inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#b8914b_20%,#f2e0b0_40%,#b8914b_60%)] px-6 py-2.5 text-[12px] font-medium tracking-[0.2em] text-[#4a1219] uppercase shadow-[0_10px_24px_-12px_rgb(40_5_10/0.8)]`;
export const tombolMarun =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#6b1a26] px-6 py-2.5 text-[12px] font-medium tracking-[0.2em] text-[#fbf4f1] uppercase shadow-[0_10px_22px_-12px_rgb(40_5_10/0.9)] ring-1 ring-[#c9a35c]/60";

// Lapisan modal dipasang di #dm-lapis (di akar tema): elemen fixed di dalam elemen ber-transform akan ikut bergeser.
const noop = () => () => {};
export function Lapis({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const el = mounted ? document.getElementById("dm-lapis") : null;
  return el ? createPortal(children, el) : null;
}

/* ───────── Hitung mundur: ubin marun bertepi emas ───────── */

export function Countdown({ target }: { target: string }) {
  const units = useHitungMundur(target);
  return (
    <motion.dl className="grid grid-cols-4 gap-2.5" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}>
      {units.map(([n, label]) => (
        <motion.div
          key={label}
          variants={{ hidden: { opacity: 0, transform: "rotateY(90deg)" }, show: { opacity: 1, transform: "rotateY(0deg)", transition: { duration: 1.1, ease: HALUS } } }}
          className="flex flex-col-reverse rounded-xl bg-[#5a1520] px-1 pt-3 pb-2 text-center shadow-[0_12px_20px_-12px_rgb(0_0_0/0.6)] ring-1 ring-[#c9a35c]/55"
        >
          <dt className="text-[9px] tracking-[0.22em] text-[#f3dcd6]/70 uppercase">{label}</dt>
          {/* angka baru masuk lewat animasi CSS, kotaknya `contain: strict`: pergantian tiap detik tidak memaksa
              browser mengukur ulang seluruh halaman (di Safari itu membuat scroll tersendat sekali per detik) */}
          <dd className={`${prata} relative h-9 overflow-hidden text-[1.7rem] leading-9 text-[#f2e0b0] tabular-nums [contain:strict]`}>
            <span key={n ?? "x"} className={`${s.gulir} block`}>
              {n === null ? "–" : String(n).padStart(2, "0")}
            </span>
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}

/* ───────── Amplop digital ───────── */

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
            <motion.div
              className="fixed inset-0 z-[80] flex items-end justify-center bg-[#1e0509]/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Amplop digital"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={spring}
                onClick={(e) => e.stopPropagation()}
                className={`${s.kertas} max-h-[85svh] w-full max-w-[440px] overflow-y-auto rounded-t-[2rem] px-6 pt-4 pb-[calc(2rem+var(--demo-h,0px))] text-center text-[#4a1219]`}
              >
                <span className="mx-auto block h-1 w-10 rounded-full bg-[#4a1219]/20" />
                <p className={`${naskah} mt-4 text-[2.8rem] leading-tight`}>Amplop Digital</p>
                <p className="mt-1 text-sm text-[#4a1219]/75">Silakan kirim tanda kasih melalui rekening berikut.</p>
                <div className="mt-6 space-y-4">
                  {amplop.map((a, i) => (
                    <KartuBank key={a.nomor} a={a} i={i} />
                  ))}
                </div>
                <button type="button" onClick={() => setOpen(false)} className="mt-6 text-sm text-[#4a1219]/60 underline underline-offset-4">
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

// Kartu rekening marun beludru, bertepi emas tipis, dengan buah delima kecil di sudut
function KartuBank({ a, i }: { a: Undangan["amplop"][number]; i: number }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(30px) rotateX(25deg)" }}
      animate={{ opacity: 1, transform: "translateY(0px) rotateX(0deg)" }}
      transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: HALUS }}
      className={`${s.marun} relative overflow-hidden rounded-2xl p-5 text-left text-[#fbf4f1] shadow-[0_24px_40px_-20px_rgb(40_5_10/0.9)]`}
    >
      <span className="pointer-events-none absolute inset-2 rounded-xl border border-[#c9a35c]/50" aria-hidden="true" />
      <svg viewBox="0 0 40 40" className="pointer-events-none absolute -top-2 -right-2 size-20 opacity-25" aria-hidden="true">
        <path d="M20 8c8 0 13 6 13 13s-6 13-13 13S7 28 7 21 12 8 20 8Z" fill="#c0414f" />
        <path d="M16 8 20 3l4 5" fill="none" stroke="#c9a35c" strokeWidth="1.5" />
      </svg>
      <p className="relative text-[10px] tracking-[0.3em] text-[#e6cd96] uppercase">{a.bank}</p>
      <p className={`${prata} relative mt-3 text-[1.5rem] tracking-[0.1em] tabular-nums`}>{a.nomor}</p>
      <div className="relative mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[9px] tracking-[0.25em] text-[#fbf4f1]/60 uppercase">Atas nama</p>
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
          className="shrink-0 rounded-full border border-[#c9a35c]/70 px-4 py-1.5 text-xs text-[#e6cd96]"
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

  const field = "w-full rounded-xl border border-[#c9a35c]/40 bg-[#fbf4f1] px-4 py-3 text-[15px] text-[#4a1219] outline-none placeholder:text-[#4a1219]/45 focus:border-[#c9a35c]";

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3 text-left">
        <input name="nama" required defaultValue={tamu} placeholder="Nama kamu" aria-label="Nama" className={field} />
        <textarea name="ucapan" rows={3} placeholder="Tulis ucapan & doa" aria-label="Ucapan dan doa" className={`${field} resize-none`} />
        <fieldset>
          <legend className="mb-2 text-sm text-[#fbf4f1]/85">Konfirmasi kehadiran</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              [true, "Hadir"],
              [false, "Tidak hadir"],
            ].map(([val, label]) => (
              <label
                key={String(val)}
                className="relative cursor-pointer rounded-xl border border-[#c9a35c]/50 py-2.5 text-center text-sm text-[#fbf4f1]/85 has-focus-visible:ring-2 has-focus-visible:ring-[#c9a35c]"
              >
                <input type="radio" name="hadir" checked={hadir === val} onChange={() => setHadir(val as boolean)} className="sr-only" />
                {hadir === val && <motion.span layoutId="dm-hadir" transition={spring} className="absolute inset-0 rounded-[11px] bg-[#c9a35c]" />}
                <span className={`relative transition-colors ${hadir === val ? "font-medium text-[#4a1219]" : ""}`}>{label as string}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <motion.button type="submit" whileTap={{ scale: 0.97 }} className={`${tombolEmas} w-full py-3.5`}>
          Kirim Ucapan
        </motion.button>
        <AnimatePresence>
          {sent && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-center text-sm text-[#fbf4f1]/85">
              Terima kasih, ucapanmu sudah terkirim.
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <ul className="mt-6 max-h-[24rem] space-y-2.5 overflow-y-auto overscroll-contain rounded-2xl bg-[#2e080d]/50 p-3 text-left">
        <AnimatePresence initial={false}>
          {letters.map((l) => (
            <motion.li key={l.id} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={spring} className={`${s.kertas} flex gap-3 rounded-xl p-3 text-[#4a1219]`}>
              <span className={`${naskah} grid size-9 shrink-0 place-items-center rounded-full bg-[#6b1a26] text-2xl text-[#e6cd96]`}>{l.name[0]?.toUpperCase()}</span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <span className="truncate">{l.name}</span>
                  <span className={`size-2 shrink-0 rounded-full ${l.hadir ? "bg-[#4f8a6a]" : "bg-[#b4553e]"}`} aria-label={l.hadir ? "Hadir" : "Tidak hadir"} />
                </p>
                <p className="text-[11px] text-[#4a1219]/50">{l.waktu}</p>
                {l.message && <p className="mt-1 text-sm leading-relaxed text-[#4a1219]/85">{l.message}</p>}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
