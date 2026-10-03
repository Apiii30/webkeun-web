"use client";

import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, type ReactNode, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useHitungMundur } from "../../pakai";
import type { Undangan } from "../../types";
import { EMAS, HALUS, garisBintang, marcellus, naskah } from "./hias";
import s from "./sakinah.module.css";

// Bagian tema Putih Sakinah yang butuh state: hitung mundur, amplop digital, RSVP & doa. Galeri di galeri.tsx.

const spring = { type: "spring", stiffness: 260, damping: 28 } as const;
export const tombolEmas = `${s.kilau} inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#a98544_20%,#f1e2b8_40%,#a98544_60%)] px-6 py-2.5 text-[12px] font-medium tracking-[0.2em] text-[#0f3a31] uppercase shadow-[0_10px_24px_-12px_rgb(20_45_38/0.7)]`;
export const tombolZamrud =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#0f3a31] px-6 py-2.5 text-[12px] font-medium tracking-[0.2em] text-[#fbf8f1] uppercase shadow-[0_10px_22px_-12px_rgb(10_30_25/0.9)] ring-1 ring-[#b8955a]/70";

// Lapisan modal dipasang di #sk-lapis (di akar tema): elemen fixed di dalam elemen ber-transform akan ikut bergeser.
const noop = () => () => {};
export function Lapis({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const el = mounted ? document.getElementById("sk-lapis") : null;
  return el ? createPortal(children, el) : null;
}

/* ───────── Hitung mundur: angka di dalam bintang delapan ───────── */

export function Countdown({ target, terang = false }: { target: string; terang?: boolean }) {
  const units = useHitungMundur(target);
  return (
    <motion.dl className="grid grid-cols-4 gap-2" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}>
      {units.map(([n, label]) => (
        <motion.div
          key={label}
          variants={{ hidden: { opacity: 0, transform: "rotate(-45deg) scale(0.6)" }, show: { opacity: 1, transform: "rotate(0deg) scale(1)", transition: { duration: 1.2, ease: HALUS } } }}
          className="flex flex-col-reverse items-center"
        >
          <dt className={`mt-2 text-[9.5px] tracking-[0.22em] uppercase ${terang ? "text-[#e9dcc0]/80" : "text-[#1d3d34]/70"}`}>{label}</dt>
          <div className="relative grid aspect-square w-full place-items-center">
            <svg viewBox="-1.08 -1.08 2.16 2.16" className="absolute inset-0 h-full w-full drop-shadow-[0_10px_12px_rgb(10_30_25/0.3)]" aria-hidden="true">
              <path d={garisBintang} fill="#0f3a31" stroke={EMAS} strokeWidth=".05" />
              <path d={garisBintang} fill="none" stroke={EMAS} strokeWidth=".018" strokeDasharray=".03 .05" transform="scale(.86)" />
            </svg>
            {/* angka baru masuk lewat animasi CSS, kotaknya `contain: strict`: pergantian tiap detik tidak memaksa
                browser mengukur ulang seluruh halaman */}
            <dd className={`${marcellus} relative h-8 w-[70%] overflow-hidden text-center text-[1.5rem] leading-8 text-[#f1e2b8] tabular-nums [contain:strict]`}>
              <span key={n ?? "x"} className={`${s.gulir} block`}>
                {n === null ? "–" : String(n).padStart(2, "0")}
              </span>
            </dd>
          </div>
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
              className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0a241e]/70"
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
                className={`${s.marmer} max-h-[85svh] w-full max-w-[440px] overflow-y-auto rounded-t-[2rem] px-6 pt-4 pb-[calc(2rem+var(--demo-h,0px))] text-center text-[#1d3d34]`}
              >
                <span className="mx-auto block h-1 w-10 rounded-full bg-[#0f3a31]/20" />
                <p className={`${naskah} mt-4 text-[3rem] leading-tight text-[#0f3a31]`}>Amplop Digital</p>
                <p className="mt-1 text-[15px] text-[#1d3d34]/75">Silakan kirim tanda kasih melalui rekening berikut.</p>
                <div className="mt-6 space-y-4">
                  {amplop.map((a, i) => (
                    <KartuBank key={a.nomor} a={a} i={i} />
                  ))}
                </div>
                <button type="button" onClick={() => setOpen(false)} className="mt-6 text-sm text-[#1d3d34]/60 underline underline-offset-4">
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

// Kartu rekening zamrud bertepi emas, bermotif kisi bintang samar
function KartuBank({ a, i }: { a: Undangan["amplop"][number]; i: number }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(30px) rotateX(25deg)" }}
      animate={{ opacity: 1, transform: "translateY(0px) rotateX(0deg)" }}
      transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: HALUS }}
      className={`${s.zamrud} relative overflow-hidden rounded-2xl p-5 text-left text-[#fbf8f1] shadow-[0_24px_40px_-20px_rgb(10_30_25/0.9)]`}
    >
      <div className={`${s.polaTerang} pointer-events-none absolute inset-0 opacity-[0.12]`} aria-hidden="true" />
      <span className="pointer-events-none absolute inset-2 rounded-xl border border-[#b8955a]/55" aria-hidden="true" />
      <p className="relative text-[10px] tracking-[0.3em] text-[#e9d29c] uppercase">{a.bank}</p>
      <p className={`${marcellus} relative mt-3 text-[1.5rem] tracking-[0.1em] tabular-nums`}>{a.nomor}</p>
      <div className="relative mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[9px] tracking-[0.25em] text-[#fbf8f1]/60 uppercase">Atas nama</p>
          <p className="text-[15px]">{a.atasNama}</p>
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
          className="shrink-0 rounded-full border border-[#b8955a]/70 px-4 py-1.5 text-xs text-[#e9d29c]"
        >
          {copied ? "Tersalin ✓" : "Salin"}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ───────── RSVP & doa ───────── */

type Surat = { id: number; name: string; hadir: boolean; message: string; waktu: string };

const contohSurat: Surat[] = [
  {
    id: 2,
    name: "Ustadzah Rahma",
    hadir: true,
    message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Semoga menjadi keluarga sakinah, mawaddah, warahmah.",
    waktu: "2 hari lalu",
  },
  { id: 1, name: "Raka", hadir: true, message: "Selamat menempuh hidup baru, semoga Allah mudahkan segala urusan kalian berdua. Sampai jumpa di hari H!", waktu: "5 hari lalu" },
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

  const field = "w-full rounded-xl border border-[#b8955a]/45 bg-[#fdfcf8] px-4 py-3 text-[16px] text-[#1d3d34] outline-none placeholder:text-[#1d3d34]/45 focus:border-[#b8955a]";

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3 text-left">
        <input name="nama" required defaultValue={tamu} placeholder="Nama kamu" aria-label="Nama" className={field} />
        <textarea name="ucapan" rows={3} placeholder="Tulis doa & ucapan" aria-label="Doa dan ucapan" className={`${field} resize-none`} />
        <fieldset>
          <legend className="mb-2 text-[15px] text-[#fbf8f1]/85">Konfirmasi kehadiran</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              [true, "Hadir"],
              [false, "Tidak hadir"],
            ].map(([val, label]) => (
              <label
                key={String(val)}
                className="relative cursor-pointer rounded-xl border border-[#b8955a]/55 py-2.5 text-center text-[15px] text-[#fbf8f1]/85 has-focus-visible:ring-2 has-focus-visible:ring-[#b8955a]"
              >
                <input type="radio" name="hadir" checked={hadir === val} onChange={() => setHadir(val as boolean)} className="sr-only" />
                {hadir === val && <motion.span layoutId="sk-hadir" transition={spring} className="absolute inset-0 rounded-[11px] bg-[#b8955a]" />}
                <span className={`relative transition-colors ${hadir === val ? "font-medium text-[#0f3a31]" : ""}`}>{label as string}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <motion.button type="submit" whileTap={{ scale: 0.97 }} className={`${tombolEmas} w-full py-3.5`}>
          Kirim Doa &amp; Ucapan
        </motion.button>
        <AnimatePresence>
          {sent && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-center text-[15px] text-[#fbf8f1]/85">
              Jazakallahu khairan, doamu sudah terkirim.
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <ul className="mt-6 max-h-[24rem] space-y-2.5 overflow-y-auto overscroll-contain rounded-2xl bg-[#0a2b24]/60 p-3 text-left">
        <AnimatePresence initial={false}>
          {letters.map((l) => (
            <motion.li key={l.id} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={spring} className={`${s.marmer} flex gap-3 rounded-xl p-3 text-[#1d3d34]`}>
              <span className={`${marcellus} grid size-9 shrink-0 place-items-center rounded-full bg-[#0f3a31] text-[1.05rem] text-[#e9d29c] ring-1 ring-[#b8955a]/60`}>
                {l.name[0]?.toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[15px] font-medium">
                  <span className="truncate">{l.name}</span>
                  <span className={`size-2 shrink-0 rounded-full ${l.hadir ? "bg-[#3f8a6a]" : "bg-[#b4553e]"}`} aria-label={l.hadir ? "Hadir" : "Tidak hadir"} />
                </p>
                <p className="text-[11px] text-[#1d3d34]/50">{l.waktu}</p>
                {l.message && <p className="mt-1 text-[15px] leading-relaxed text-[#1d3d34]/85">{l.message}</p>}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
