"use client";

import { AnimatePresence, motion } from "motion/react";
import { type CSSProperties, type FormEvent, type ReactNode, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useHitungMundur } from "../../pakai";
import type { Undangan } from "../../types";
import { HALUS, Shuangxi, naskah, yuji } from "./hias";
import s from "./oriental.module.css";

// Bagian tema Oriental Peony yang butuh state: hitung mundur dalam lentera, angpao digital, RSVP & ucapan. Galeri di galeri.tsx.

const spring = { type: "spring", stiffness: 260, damping: 28 } as const;
export const tombolEmas = `${s.kilau} inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#b98b33_20%,#f6dc94_40%,#b98b33_60%)] px-6 py-2.5 text-[12px] font-semibold tracking-[0.2em] text-[#7d1418] uppercase shadow-[0_10px_24px_-12px_rgb(90_15_15/0.7)]`;
export const tombolMerah =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#b3242b] px-6 py-2.5 text-[12px] font-semibold tracking-[0.2em] text-[#fff6e6] uppercase shadow-[0_10px_22px_-12px_rgb(90_15_15/0.9)] ring-1 ring-[#f6dc94]/80";

// Lapisan modal dipasang di #or-lapis (di akar tema): elemen fixed di dalam elemen ber-transform akan ikut bergeser.
const noop = () => () => {};
export function Lapis({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const el = mounted ? document.getElementById("or-lapis") : null;
  return el ? createPortal(children, el) : null;
}

/* ───────── Hitung mundur: angka di dalam lentera merah yang tergantung ───────── */

export function Countdown({ target }: { target: string }) {
  const units = useHitungMundur(target);
  return (
    <motion.dl className="grid grid-cols-4 gap-2.5" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} transition={{ staggerChildren: 0.14, delayChildren: 0.1 }}>
      {units.map(([n, label], i) => (
        <motion.div
          key={label}
          variants={{
            hidden: { opacity: 0, transform: "translateY(-60px) rotate(8deg)" },
            show: { opacity: 1, transform: "translateY(0px) rotate(0deg)", transition: { duration: 1.3, ease: HALUS } },
          }}
          className="flex flex-col-reverse items-center"
        >
          <dt className={`${yuji} mt-1.5 text-[10px] tracking-[0.2em] text-[#fff1d6]/85 uppercase`}>{label}</dt>
          <div className={`${s.lentera} relative w-full`} style={{ "--d": `${4 + i * 0.6}s`, "--a": "2.5deg" } as CSSProperties}>
            <div className="mx-auto h-4 w-[2px] bg-[#f6dc94]/70" />
            <div className="mx-auto h-2 w-[42%] rounded-t-sm bg-[linear-gradient(90deg,#9b7224,#f6dc94,#9b7224)]" />
            <div className="relative grid aspect-[1/0.9] place-items-center rounded-[46%] bg-[radial-gradient(circle_at_45%_40%,#ff8a5c,#d8302f_55%,#8e1418)] shadow-[0_10px_18px_-8px_rgb(40_5_5/0.7),0_0_22px_rgb(255_140_80/0.35)]">
              <span className="pointer-events-none absolute inset-y-0 left-1/2 w-[56%] -translate-x-1/2 rounded-[50%] border-x border-[#7d1418]/40" aria-hidden="true" />
              {/* angka baru masuk lewat animasi CSS, kotaknya `contain: strict`: pergantian tiap detik tidak memaksa
                  browser mengukur ulang seluruh halaman */}
              <dd className={`${yuji} relative h-8 w-[80%] overflow-hidden text-center text-[1.45rem] leading-8 text-[#fff1d6] tabular-nums [contain:strict]`}>
                <span key={n ?? "x"} className={`${s.gulir} block`}>
                  {n === null ? "–" : String(n).padStart(2, "0")}
                </span>
              </dd>
            </div>
            <div className="mx-auto h-2 w-[42%] rounded-b-sm bg-[linear-gradient(90deg,#9b7224,#f6dc94,#9b7224)]" />
            <div className="mx-auto h-5 w-[14%] rounded-b-full bg-[linear-gradient(180deg,#c8242b,#8e1418)]" />
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
        Angpao Digital
      </motion.button>

      <Lapis>
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-[80] flex items-end justify-center bg-[#2a0a0b]/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Angpao digital"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={spring}
                onClick={(e) => e.stopPropagation()}
                className={`${s.kertas} max-h-[85svh] w-full max-w-[440px] overflow-y-auto rounded-t-[2rem] px-6 pt-4 pb-[calc(2rem+var(--demo-h,0px))] text-center text-[#3b1d16]`}
              >
                <span className="mx-auto block h-1 w-10 rounded-full bg-[#7d1418]/20" />
                <p className={`${naskah} mt-4 text-[3rem] leading-tight text-[#9e1c22]`}>Angpao Digital</p>
                <p className="mt-1 text-[15px] text-[#3b1d16]/75">Silakan kirim tanda kasih melalui rekening berikut.</p>
                <div className="mt-6 space-y-4">
                  {amplop.map((a, i) => (
                    <KartuBank key={a.nomor} a={a} i={i} />
                  ))}
                </div>
                <button type="button" onClick={() => setOpen(false)} className="mt-6 text-sm text-[#3b1d16]/60 underline underline-offset-4">
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

// Kartu rekening berupa angpao merah: 囍 emas di sudut, tepi emas, garis lipat di atas
function KartuBank({ a, i }: { a: Undangan["amplop"][number]; i: number }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(30px) rotateX(25deg)" }}
      animate={{ opacity: 1, transform: "translateY(0px) rotateX(0deg)" }}
      transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: HALUS }}
      className={`${s.merah} relative overflow-hidden rounded-2xl p-5 pt-9 text-left text-[#fff6e6] shadow-[0_24px_40px_-20px_rgb(60_10_10/0.9)]`}
    >
      <div className={`${s.polaAwan} pointer-events-none absolute inset-0 opacity-[0.18]`} aria-hidden="true" />
      <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-7 w-full" aria-hidden="true">
        <path d="M0 0H100V6L50 18 0 6Z" fill="#7d1418" />
        <path d="M0 6 50 18 100 6" fill="none" stroke="#f6dc94" strokeWidth=".6" />
      </svg>
      <span className="pointer-events-none absolute inset-2 rounded-xl border border-[#f6dc94]/55" aria-hidden="true" />
      <Shuangxi className="pointer-events-none absolute right-4 bottom-4 size-14 opacity-25" warna="#f6dc94" />
      <p className="relative text-[10px] tracking-[0.3em] text-[#f6dc94] uppercase">{a.bank}</p>
      <p className={`${yuji} relative mt-2 text-[1.5rem] tracking-[0.1em] tabular-nums`}>{a.nomor}</p>
      <div className="relative mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[9px] tracking-[0.25em] text-[#fff6e6]/60 uppercase">Atas nama</p>
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
          className="shrink-0 rounded-full border border-[#f6dc94]/70 px-4 py-1.5 text-xs text-[#f6dc94]"
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
  { id: 2, name: "Tante Lily", hadir: true, message: "Selamat menempuh hidup baru! Semoga rukun, bahagia, dan langgeng sampai kakek-nenek.", waktu: "2 hari lalu" },
  { id: 1, name: "Kevin", hadir: true, message: "Akhirnya! Happy wedding, kalian berdua. Sampai jumpa di hari H!", waktu: "5 hari lalu" },
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

  const field = "w-full rounded-xl border border-[#c99a3e]/50 bg-[#fffaf0] px-4 py-3 text-[16px] text-[#3b1d16] outline-none placeholder:text-[#3b1d16]/45 focus:border-[#c99a3e]";

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3 text-left">
        <input name="nama" required defaultValue={tamu} placeholder="Nama kamu" aria-label="Nama" className={field} />
        <textarea name="ucapan" rows={3} placeholder="Tulis ucapan & doa" aria-label="Ucapan dan doa" className={`${field} resize-none`} />
        <fieldset>
          <legend className="mb-2 text-[15px] text-[#fff6e6]/85">Konfirmasi kehadiran</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              [true, "Hadir"],
              [false, "Tidak hadir"],
            ].map(([val, label]) => (
              <label
                key={String(val)}
                className="relative cursor-pointer rounded-xl border border-[#f6dc94]/55 py-2.5 text-center text-[15px] text-[#fff6e6]/85 has-focus-visible:ring-2 has-focus-visible:ring-[#f6dc94]"
              >
                <input type="radio" name="hadir" checked={hadir === val} onChange={() => setHadir(val as boolean)} className="sr-only" />
                {hadir === val && <motion.span layoutId="or-hadir" transition={spring} className="absolute inset-0 rounded-[11px] bg-[#f6dc94]" />}
                <span className={`relative transition-colors ${hadir === val ? "font-medium text-[#7d1418]" : ""}`}>{label as string}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <motion.button type="submit" whileTap={{ scale: 0.97 }} className={`${tombolEmas} w-full py-3.5`}>
          Kirim Ucapan
        </motion.button>
        <AnimatePresence>
          {sent && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-center text-[15px] text-[#fff6e6]/85">
              Terima kasih, ucapanmu sudah terkirim.
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <ul className="mt-6 max-h-[24rem] space-y-2.5 overflow-y-auto overscroll-contain rounded-2xl bg-[#5e0f13]/60 p-3 text-left">
        <AnimatePresence initial={false}>
          {letters.map((l) => (
            <motion.li key={l.id} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={spring} className={`${s.kertas} flex gap-3 rounded-xl p-3 text-[#3b1d16]`}>
              <span className={`${yuji} grid size-9 shrink-0 place-items-center rounded-full bg-[#b3242b] text-[1.05rem] text-[#f6dc94] ring-1 ring-[#c99a3e]/70`}>{l.name[0]?.toUpperCase()}</span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[15px] font-medium">
                  <span className="truncate">{l.name}</span>
                  <span className={`size-2 shrink-0 rounded-full ${l.hadir ? "bg-[#3f8a6a]" : "bg-[#b4553e]"}`} aria-label={l.hadir ? "Hadir" : "Tidak hadir"} />
                </p>
                <p className="text-[11px] text-[#3b1d16]/50">{l.waktu}</p>
                {l.message && <p className="mt-1 text-[15px] leading-relaxed text-[#3b1d16]/85">{l.message}</p>}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
