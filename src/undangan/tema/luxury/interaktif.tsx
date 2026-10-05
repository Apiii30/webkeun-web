"use client";

import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, type ReactNode, useState, useSyncExternalStore } from "react";
import { useBukuTamu } from "@/undangan/buku-tamu";
import { createPortal } from "react-dom";
import { useHitungMundur } from "../../pakai";
import type { Undangan } from "../../types";
import { bodoni } from "./hias";
import s from "./luxury.module.css";

// Bagian tema Luxury yang butuh state: hitung mundur, amplop digital, RSVP. Galeri ada di galeri.tsx.

const spring = { type: "spring", stiffness: 260, damping: 28 } as const;
const ease = [0.22, 1, 0.36, 1] as const;
export const tombolEmas = `${s.kilau} inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#b48d4b_20%,#f1dfae_40%,#b48d4b_60%)] px-6 py-2.5 text-[13px] font-semibold tracking-[0.12em] text-[#241d18] uppercase shadow-[0_10px_24px_-12px_rgb(36_29_24/0.8)]`;
export const tombolGaris = "inline-flex items-center justify-center gap-2 rounded-full border border-[#b48d4b] px-5 py-2 text-[12px] font-semibold tracking-[0.14em] text-[#8f6a32] uppercase";

// Lapisan modal dipasang di #lx-lapis (di akar tema), bukan di dalam bagian yang sedang dianimasikan:
// elemen fixed di dalam elemen ber-transform akan ikut bergeser.
const noop = () => () => {};
export function Lapis({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const el = mounted ? document.getElementById("lx-lapis") : null;
  return el ? createPortal(children, el) : null;
}

/* ───────── Hitung mundur ───────── */

export function Countdown({ target }: { target: string }) {
  const units = useHitungMundur(target);
  return (
    <motion.dl className="grid grid-cols-4 gap-2" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}>
      {units.map(([n, label]) => (
        <motion.div
          key={label}
          variants={{
            hidden: { opacity: 0, transform: "translateY(24px) rotateX(50deg)" },
            show: { opacity: 1, transform: "translateY(0px) rotateX(0deg)", transition: { duration: 0.9, ease } },
          }}
          className="flex flex-col-reverse rounded-t-full rounded-b-xl border border-[#f6f1e9]/50 bg-[#f6f1e9]/12 px-1 pt-5 pb-2.5 text-center"
        >
          <dt className="mt-0.5 text-[9px] tracking-[0.22em] text-[#f6f1e9]/80 uppercase">{label}</dt>
          <dd className={`${bodoni} relative h-9 overflow-hidden text-[1.75rem] leading-9 text-[#f6f1e9] tabular-nums`}>
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

/* ───────── Amplop digital: lembar dari bawah berisi kartu hitam metalik ───────── */

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
            <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#120e0b]/75" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Amplop digital"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={spring}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[85svh] w-full max-w-[440px] overflow-y-auto rounded-t-[2rem] bg-[#f6f1e9] px-6 pt-4 pb-[calc(2rem+var(--demo-h,0px))] text-center text-[#2b2420]"
              >
                <span className="mx-auto block h-1 w-10 rounded-full bg-[#2b2420]/20" />
                <p className={`${bodoni} mt-5 text-2xl italic`}>Amplop Digital</p>
                <p className="mt-2 text-sm text-[#2b2420]/70">Silakan kirim tanda kasih melalui rekening berikut.</p>
                <div className="mt-6 space-y-4">
                  {amplop.map((a, i) => (
                    <KartuBank key={a.nomor} a={a} i={i} />
                  ))}
                </div>
                <button type="button" onClick={() => setOpen(false)} className="mt-6 text-sm text-[#2b2420]/60 underline underline-offset-4">
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

// Kartu rekening bergaya kartu hitam metalik: chip emas, nomor timbul, kilau yang melintas
function KartuBank({ a, i }: { a: Undangan["amplop"][number]; i: number }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(30px) rotateX(30deg)" }}
      animate={{ opacity: 1, transform: "translateY(0px) rotateX(0deg)" }}
      transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease }}
      className="relative aspect-[1.586/1] overflow-hidden rounded-2xl bg-[radial-gradient(120%_90%_at_10%_0%,#3b322b_0%,#1a1512_55%,#0e0b09_100%)] p-5 text-left text-[#f6f1e9] shadow-[0_24px_40px_-18px_rgb(0_0_0/0.8)]"
    >
      <span className={`${s.kilauKartu} pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/12 to-transparent`} aria-hidden="true" />
      <div className="flex items-start justify-between">
        <p className={`${bodoni} text-lg italic`}>{a.bank}</p>
        <p className={`${s.teksEmas} text-[10px] font-semibold tracking-[0.3em]`}>WEDDING GIFT</p>
      </div>
      {/* chip */}
      <div className={`${s.emas} mt-4 h-8 w-11 rounded-md p-[3px]`} aria-hidden="true">
        <div className="grid h-full w-full grid-cols-3 gap-[2px] rounded-[4px] opacity-60">
          {Array.from({ length: 6 }, (_, k) => (
            <span key={k} className="border border-[#6b4f22]/60" />
          ))}
        </div>
      </div>
      <p className={`${bodoni} mt-3 text-[1.55rem] tracking-[0.12em] tabular-nums [text-shadow:0_1px_0_rgb(255_255_255/0.15),0_-1px_0_rgb(0_0_0/0.6)]`}>{a.nomor}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-[9px] tracking-[0.25em] text-[#f6f1e9]/50 uppercase">Atas nama</p>
          <p className="text-sm tracking-wide uppercase">{a.atasNama}</p>
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
          className="shrink-0 rounded-full border border-[#e9d5a1]/70 px-4 py-1.5 text-xs font-semibold text-[#e9d5a1]"
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
  const { letters, kirim, mengirim, galat } = useBukuTamu(contohSurat);
  const [hadir, setHadir] = useState(true);
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("nama") ?? "").trim();
    if (!name) return;
    void kirim(name, hadir, String(data.get("ucapan") ?? "").trim()).then((ok) => {
      if (!ok) return;
      setSent(true);
      form.reset();
    });
  }

  const field = "w-full rounded-xl border border-[#b2a28a]/50 bg-white px-4 py-3 text-[15px] text-[#2b2420] outline-none placeholder:text-[#2b2420]/40 focus:border-[#8f6a32]";

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3 text-left">
        <input name="nama" required defaultValue={tamu} placeholder="Nama kamu" aria-label="Nama" className={field} />
        <textarea name="ucapan" rows={3} placeholder="Tulis ucapan & doa" aria-label="Ucapan dan doa" className={`${field} resize-none`} />
        <fieldset>
          <legend className="mb-2 text-sm text-[#2b2420]/80">Konfirmasi kehadiran</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              [true, "Hadir"],
              [false, "Tidak hadir"],
            ].map(([val, label]) => (
              <label
                key={String(val)}
                className="relative cursor-pointer rounded-xl border border-[#b2a28a]/60 py-2.5 text-center text-sm font-semibold text-[#8f7f68] has-focus-visible:ring-2 has-focus-visible:ring-[#b48d4b]"
              >
                <input type="radio" name="hadir" checked={hadir === val} onChange={() => setHadir(val as boolean)} className="sr-only" />
                {hadir === val && <motion.span layoutId="lx-hadir" transition={spring} className="absolute inset-0 rounded-[11px] bg-[#8f7f68]" />}
                <span className={`relative transition-colors ${hadir === val ? "text-[#f6f1e9]" : ""}`}>{label as string}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <motion.button type="submit" disabled={mengirim} whileTap={{ scale: 0.97 }} className="w-full rounded-xl bg-[#241d18] py-3.5 text-sm font-semibold tracking-[0.15em] text-[#f6f1e9] uppercase disabled:opacity-60">
          Kirim
        </motion.button>
        <AnimatePresence>
          {sent && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-center text-sm text-[#2b2420]/80">
              Terima kasih, ucapanmu sudah terkirim.
            </motion.p>
          )}
        </AnimatePresence>
        {galat && (
          <p role="alert" className="text-center text-sm text-[#2b2420]/80">
            {galat}
          </p>
        )}
      </form>

      <ul className="mt-6 max-h-[24rem] space-y-2.5 overflow-y-auto overscroll-contain rounded-2xl bg-[#efe8dd] p-3 text-left">
        <AnimatePresence initial={false}>
          {letters.map((l) => (
            <motion.li key={l.id} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={spring} className="flex gap-3 rounded-xl bg-white p-3 text-[#2b2420]">
              <span className={`${bodoni} grid size-9 shrink-0 place-items-center rounded-full bg-[#241d18] text-sm text-[#e9d5a1] italic`}>{l.name[0]?.toUpperCase()}</span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <span className="truncate">{l.name}</span>
                  <span className={`size-2 shrink-0 rounded-full ${l.hadir ? "bg-[#4f8a5f]" : "bg-[#b4553e]"}`} aria-label={l.hadir ? "Hadir" : "Tidak hadir"} />
                </p>
                <p className="text-[11px] text-[#2b2420]/50">{l.waktu}</p>
                {l.message && <p className="mt-1 text-sm leading-relaxed text-[#2b2420]/85">{l.message}</p>}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
