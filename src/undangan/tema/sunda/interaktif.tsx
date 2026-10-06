"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import Image from "next/image";
import { type FormEvent, type ReactNode, useEffect, useState, useSyncExternalStore } from "react";
import { useBukuTamu } from "@/undangan/buku-tamu";
import { createPortal } from "react-dom";
import { useHitungMundur } from "../../pakai";
import type { Foto, Undangan } from "../../types";
import { MegaMendung } from "./ornamen";
import s from "./sunda.module.css";

// Bagian tema Art Sunda yang butuh state: hitung mundur, galeri + tampilan penuh, amplop digital, RSVP.

const spring = { type: "spring", stiffness: 260, damping: 28 } as const;
const ease = [0.22, 1, 0.36, 1] as const;
const rozha = "font-[family-name:var(--font-rozha)]";
export const tombolBata = `${s.kilau} inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#8a4b35_20%,#b77a5f_40%,#8a4b35_60%)] px-6 py-2.5 text-sm font-medium tracking-wide text-[#f8f1e4] shadow-[0_10px_22px_-12px_rgb(138_75_53/0.9)]`;

/* ───────── Hitung mundur ───────── */

// Kotak-kotak nila yang naik bergantian; angkanya bergeser saat berganti.
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
          className="relative flex flex-col-reverse overflow-hidden rounded-xl bg-[#2f4560] px-1 pt-3 pb-2 text-center shadow-[0_10px_20px_-12px_rgb(47_69_96/0.9)]"
        >
          <MegaMendung warna="emas" className="absolute -right-4 -bottom-3 w-16 opacity-25" />
          <dt className="relative mt-0.5 text-[10px] tracking-[0.18em] text-[#d9c9a6] uppercase">{label}</dt>
          <dd className={`${rozha} relative h-9 overflow-hidden text-[1.7rem] leading-9 text-[#f8f1e4] tabular-nums`}>
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

// Lapisan modal dipasang di #sd-lapis (di akar tema), bukan di dalam bagian yang sedang dianimasikan:
// elemen fixed di dalam elemen ber-transform akan ikut bergeser.
const noop = () => () => {};
function Lapis({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const el = mounted ? document.getElementById("sd-lapis") : null;
  return el ? createPortal(children, el) : null;
}

// Variasi cara foto galeri masuk. Semua memakai `transform` utuh supaya dijalankan mesin animasi browser.
const MASUK: Variants[] = [
  { hidden: { opacity: 0, transform: "translateX(-40px) rotate(-6deg)" }, show: { opacity: 1, transform: "translateX(0px) rotate(0deg)" } },
  { hidden: { opacity: 0, transform: "translateY(60px) scale(1)" }, show: { opacity: 1, transform: "translateY(0px) scale(1)" } },
  { hidden: { opacity: 0, transform: "scale(0.75)" }, show: { opacity: 1, transform: "scale(1)" } },
  { hidden: { opacity: 0, transform: "translateX(40px) rotate(6deg)" }, show: { opacity: 1, transform: "translateX(0px) rotate(0deg)" } },
];

/* ───────── Galeri: dua kolom bergeser berlawanan, foto melengkung seperti tabung; ketuk untuk tampilan penuh ───────── */

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
      <div className="grid grid-cols-2 gap-2.5">
        {kolom.map((list, k) => (
          // dua kolom bergeser berlawanan arah saat di-scroll
          <div key={k} className={`space-y-2.5 ${k === 1 ? `${s.pJauh} pt-12` : s.pDekat}`}>
            {list.map((p) => {
              const i = photos.indexOf(p);
              return (
                // tiap foto melengkung seperti di permukaan tabung saat lewat (kDrum, mengikuti scroll)
                <div key={p.src} className={s.kDrum}>
                  <motion.button
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
                    <motion.div
                      layoutId={`sd-foto-${i}`}
                      className={`relative overflow-clip border-[1.5px] border-[#8a4b35]/70 p-1 ${i % 3 === 0 ? "rounded-t-full rounded-b-lg" : "rounded-lg"}`}
                      style={{ aspectRatio: `${p.w} / ${p.h}` }}
                    >
                      <div className={`relative h-full w-full overflow-clip ${i % 3 === 0 ? "rounded-t-full rounded-b-md" : "rounded-md"}`}>
                        <Image src={p.src} alt={p.alt} fill sizes="210px" className="object-cover" />
                      </div>
                    </motion.div>
                  </motion.button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <Lapis>
        <AnimatePresence>
          {open !== null && (
            <motion.div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-[#16212f]/94 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              role="dialog"
              aria-modal="true"
              aria-label={photos[open].alt}
            >
              <motion.div
                layoutId={`sd-foto-${open}`}
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
              <div className="absolute inset-x-0 bottom-[calc(1.5rem+var(--demo-h,0px))] flex items-center justify-center gap-6 text-sm text-[#f4eee2]" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => setOpen((open - 1 + photos.length) % photos.length)} className="grid size-10 place-items-center rounded-full border border-[#f4eee2]/40" aria-label="Foto sebelumnya">
                  ‹
                </button>
                <span className="tabular-nums">
                  {open + 1} / {photos.length}
                </span>
                <button type="button" onClick={() => setOpen((open + 1) % photos.length)} className="grid size-10 place-items-center rounded-full border border-[#f4eee2]/40" aria-label="Foto berikutnya">
                  ›
                </button>
              </div>
              <button type="button" onClick={() => setOpen(null)} className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-[#f4eee2]/15 text-xl text-[#f4eee2]" aria-label="Tutup">
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
      <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => setOpen(true)} className={tombolBata}>
        <svg viewBox="0 0 24 24" className={`${s.goyangKado} size-4`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="9" width="16" height="11" rx="1.5" />
          <path d="M3 9h18M12 9v11M12 9S10 4 7.5 5 9 9 12 9Zm0 0s2-5 4.5-4S15 9 12 9Z" />
        </svg>
        Amplop Digital
      </motion.button>

      <Lapis>
        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#16212f]/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Amplop digital"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={spring}
                onClick={(e) => e.stopPropagation()}
                className={`${s.kertas} relative max-h-[80svh] w-full max-w-[440px] overflow-y-auto rounded-t-[2rem] px-6 pt-4 pb-[calc(2rem+var(--demo-h,0px))] text-center text-[#3a3330]`}
              >
                <span className="mx-auto block h-1 w-10 rounded-full bg-[#3a3330]/25" />
                <p className={`${rozha} mt-5 text-2xl text-[#8a4b35]`}>Amplop Digital</p>
                <p className="mt-2 text-sm text-[#3a3330]/75">Silakan kirim tanda kasih melalui rekening berikut.</p>
                <div className="mt-6 space-y-3">
                  {amplop.map((a, i) => (
                    <motion.div
                      key={a.nomor}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className="relative overflow-hidden rounded-2xl bg-[#2f4560] p-5 text-left text-[#f4eee2]"
                    >
                      <MegaMendung warna="emas" className="absolute -right-6 -bottom-6 w-36 opacity-30" />
                      <p className="relative text-xs font-medium tracking-[0.2em] text-[#d9bd85] uppercase">{a.bank}</p>
                      <div className="relative mt-2 flex items-center justify-between gap-3">
                        <p className={`${rozha} text-2xl tracking-wide tabular-nums`}>{a.nomor}</p>
                        <CopyButtonTerang text={a.nomor} />
                      </div>
                      <p className="relative mt-1 text-sm text-[#f4eee2]/75">a.n. {a.atasNama}</p>
                    </motion.div>
                  ))}
                </div>
                <button type="button" onClick={() => setOpen(false)} className="mt-6 text-sm text-[#3a3330]/70 underline underline-offset-4">
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

function CopyButtonTerang({ text }: { text: string }) {
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
      className="shrink-0 rounded-full border border-[#d9bd85] px-4 py-1.5 text-xs font-medium text-[#f4eee2] transition-colors active:bg-[#d9bd85] active:text-[#2f4560]"
    >
      {copied ? "Tersalin ✓" : "Salin"}
    </motion.button>
  );
}

/* ───────── RSVP & ucapan ───────── */

type Surat = { id: number; name: string; hadir: boolean; message: string; waktu: string };

const contohSurat: Surat[] = [
  { id: 2, name: "Ceu Euis", hadir: true, message: "Wilujeng nikah! Mugia janten kulawarga sakinah, mawaddah, warahmah.", waktu: "2 dinten kapengker" },
  { id: 1, name: "Kang Asep", hadir: true, message: "Bahagia selalu kalian berdua, sampai jumpa di hari H!", waktu: "5 dinten kapengker" },
];

export function Ucapan({ tamu }: { tamu?: string }) {
  const { letters, kirim, mengirim, galat, terkirim } = useBukuTamu(contohSurat, "Nembe pisan");
  const [hadir, setHadir] = useState(true);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("nama") ?? "").trim();
    if (!name) return;
    void kirim(name, hadir, String(data.get("ucapan") ?? "").trim()).then((ok) => {
      if (ok) form.reset();
    });
  }

  const field = "w-full rounded-xl border border-[#8a4b35]/30 bg-white/70 px-4 py-3 text-[15px] text-[#3a3330] outline-none placeholder:text-[#3a3330]/40 focus:border-[#8a4b35]";

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3 text-left">
        <input name="nama" required defaultValue={tamu} placeholder="Nama kamu" aria-label="Nama" className={field} />
        <textarea name="ucapan" required rows={3} placeholder="Tulis ucapan & doa" aria-label="Ucapan dan doa" className={`${field} resize-none`} />
        <fieldset>
          <legend className="mb-2 text-sm text-[#3a3330]/80">Konfirmasi kehadiran</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              [true, "Hadir"],
              [false, "Tidak hadir"],
            ].map(([val, label]) => (
              <label
                key={String(val)}
                className="relative cursor-pointer rounded-xl border border-[#8a4b35]/35 py-2.5 text-center text-sm font-medium text-[#8a4b35] has-focus-visible:ring-2 has-focus-visible:ring-[#2f4560]"
              >
                <input type="radio" name="hadir" checked={hadir === val} onChange={() => setHadir(val as boolean)} className="sr-only" />
                {hadir === val && <motion.span layoutId="sd-hadir" transition={spring} className="absolute inset-0 rounded-[11px] bg-[#8a4b35]" />}
                <span className={`relative transition-colors ${hadir === val ? "text-[#f8f1e4]" : ""}`}>{label as string}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <motion.button type="submit" disabled={mengirim || terkirim} whileTap={{ scale: 0.97 }} className="w-full rounded-xl bg-[#2f4560] py-3.5 font-medium tracking-wide text-[#f4eee2] disabled:opacity-60">
          Kirim
        </motion.button>
        <AnimatePresence>
          {terkirim && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-center text-sm text-[#3a3330]/80">
              Hatur nuhun, ucapanmu sudah terkirim.
            </motion.p>
          )}
        </AnimatePresence>
        {galat && (
          <p role="alert" className="text-center text-sm text-[#3a3330]/80">
            {galat}
          </p>
        )}
      </form>

      <ul className="mt-6 max-h-[24rem] space-y-2.5 overflow-y-auto overscroll-contain rounded-2xl border border-[#8a4b35]/15 bg-white/40 p-3 text-left">
        <AnimatePresence initial={false}>
          {letters.map((l) => (
            <motion.li key={l.id} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={spring} className="flex gap-3 rounded-xl bg-white/75 p-3 text-[#3a3330]">
              <span className={`${rozha} grid size-9 shrink-0 place-items-center rounded-full bg-[#2f4560] text-sm text-[#f4eee2]`}>{l.name[0]?.toUpperCase()}</span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <span className="truncate">{l.name}</span>
                  <span className={`size-2 shrink-0 rounded-full ${l.hadir ? "bg-[#4f8a5f]" : "bg-[#b4553e]"}`} aria-label={l.hadir ? "Hadir" : "Tidak hadir"} />
                </p>
                <p className="text-[11px] text-[#3a3330]/50">{l.waktu}</p>
                {l.message && <p className="mt-1 text-sm leading-relaxed text-[#3a3330]/85">{l.message}</p>}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
