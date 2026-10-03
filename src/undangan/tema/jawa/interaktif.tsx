"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { type FormEvent, type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useHitungMundur } from "../../pakai";
import type { Foto, Undangan } from "../../types";
import { Tumbuh, cinzel, kaushan } from "./ornamen";
import s from "./jawa.module.css";

// Bagian tema Jawa Klasik yang butuh state: hitung mundur, galeri + tampilan penuh, amplop digital, RSVP.

const spring = { type: "spring", stiffness: 260, damping: 28 } as const;
const ease = [0.22, 1, 0.36, 1] as const;
export const tombolPlum = `${s.kilau} inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#5b3b47_20%,#8a6070_40%,#5b3b47_60%)] px-5 py-2 text-sm text-[#f7efe9] shadow-[0_8px_18px_-10px_rgb(91_59_71/0.9)]`;

/* ───────── Hitung mundur: angka besar yang bergulir ───────── */

export function Countdown({ target }: { target: string }) {
  const units = useHitungMundur(target);
  return (
    <dl className="grid grid-cols-4 gap-1">
      {units.map(([n, label], i) => (
        <Tumbuh key={label} dari="b" awal={0.4} durasi={1.4} jeda={0.2 + i * 0.15} className="text-center">
          {/* Angka baru masuk dari bawah lewat animasi CSS, dan kotaknya diberi `contain: strict`:
              pergantian angka tiap detik tidak memaksa browser mengukur ulang seluruh halaman
              (di Safari, pengukuran ulang itu membuat scroll tersendat sekali tiap detik). */}
          <dd className={`${cinzel} relative h-10 overflow-hidden text-[2rem] leading-10 font-semibold text-[#5b3b47] tabular-nums [contain:strict]`}>
            <span key={n ?? "x"} className={`${s.gulir} block`}>
              {n === null ? "–" : String(n).padStart(2, "0")}
            </span>
          </dd>
          <dt className="text-xs text-[#5b3b47]/80">{label}</dt>
        </Tumbuh>
      ))}
    </dl>
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

/* ───────── Galeri: satu foto lebar lalu dua kolom; tiap foto tumbuh dari sudut berbeda ───────── */

const ASAL = ["tl", "tr", "bl", "br"] as const;

export function Galeri({ photos }: { photos: Foto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [utama, ...sisa] = photos;
  const kolom = [sisa.filter((_, i) => i % 2 === 0), sisa.filter((_, i) => i % 2 === 1)];

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

  const foto = (p: Foto, i: number, lebar = false) => (
    <Tumbuh key={p.src} dari={ASAL[i % 4]} jeda={0.1 * (i % 3)} className={lebar ? "mb-2.5" : ""}>
      <motion.button
        type="button"
        onClick={() => setOpen(i)}
        whileTap={{ scale: 0.97 }}
        className="relative block w-full overflow-hidden rounded-lg shadow-[0_10px_20px_-14px_rgb(91_59_71/0.8)]"
        style={{ aspectRatio: lebar ? "4 / 3" : `${p.w} / ${p.h}` }}
        aria-label={`Lihat foto: ${p.alt}`}
      >
        <Image src={p.src} alt={p.alt} fill sizes={lebar ? "400px" : "200px"} className="object-cover" />
      </motion.button>
    </Tumbuh>
  );

  return (
    <>
      {utama && foto(utama, 0, true)}
      <div className="grid grid-cols-2 gap-2.5">
        {kolom.map((list, k) => (
          // kolom kanan bergeser lebih lambat dari kolom kiri (parallax), diberi jarak atas supaya tidak menimpa foto lebar
          <div key={k} className={`space-y-2.5 ${k === 1 ? `${s.pJauh} pt-14` : s.pSedang}`}>
            {list.map((p) => foto(p, photos.indexOf(p)))}
          </div>
        ))}
      </div>

      <Lapis>
        <AnimatePresence>
          {open !== null && (
            <motion.div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2b1c22]/94 p-4"
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
                  initial={{ opacity: 0, transform: "scale(0.9)" }}
                  animate={{ opacity: 1, transform: "scale(1)" }}
                  exit={{ opacity: 0, transform: "scale(1.04)" }}
                  transition={{ duration: 0.45, ease }}
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
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-[calc(1.5rem+var(--demo-h,0px))] flex items-center justify-center gap-6 text-sm text-[#f7efe9]" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => setOpen((open - 1 + photos.length) % photos.length)} className="grid size-10 place-items-center rounded-full border border-[#f7efe9]/40" aria-label="Foto sebelumnya">
                  ‹
                </button>
                <span className="tabular-nums">
                  {open + 1} / {photos.length}
                </span>
                <button type="button" onClick={() => setOpen((open + 1) % photos.length)} className="grid size-10 place-items-center rounded-full border border-[#f7efe9]/40" aria-label="Foto berikutnya">
                  ›
                </button>
              </div>
              <button type="button" onClick={() => setOpen(null)} className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-[#f7efe9]/15 text-xl text-[#f7efe9]" aria-label="Tutup">
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Lapis>
    </>
  );
}

/* ───────── Amplop digital ───────── */

export function Amplop({ amplop }: { amplop: Undangan["amplop"] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => setOpen(true)} className={tombolPlum}>
        <svg viewBox="0 0 24 24" className={`${s.goyangKado} size-4`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="9" width="16" height="11" rx="1.5" />
          <path d="M3 9h18M12 9v11M12 9S10 4 7.5 5 9 9 12 9Zm0 0s2-5 4.5-4S15 9 12 9Z" />
        </svg>
        Amplop Digital
      </motion.button>

      <Lapis>
        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#2b1c22]/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Amplop digital"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={spring}
                onClick={(e) => e.stopPropagation()}
                className={`${s.kertas} max-h-[80svh] w-full max-w-[440px] overflow-y-auto rounded-t-[2rem] px-6 pt-4 pb-[calc(2rem+var(--demo-h,0px))] text-center text-[#4a3a40]`}
              >
                <span className="mx-auto block h-1 w-10 rounded-full bg-[#5b3b47]/25" />
                <p className={`${kaushan} mt-5 text-3xl text-[#5b3b47]`}>Wedding Gift</p>
                <p className="mt-2 text-sm text-[#4a3a40]/75">Silakan transfer hadiah melalui rekening berikut.</p>
                <div className="mt-6 space-y-3">
                  {amplop.map((a, i) => (
                    <motion.div
                      key={a.nomor}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className="rounded-2xl border border-[#5b3b47]/25 bg-white/70 p-5 text-left"
                    >
                      <p className={`${cinzel} text-xs font-semibold tracking-[0.2em] text-[#7b5563]`}>{a.bank}</p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className={`${cinzel} text-2xl font-semibold tracking-wide text-[#5b3b47] tabular-nums`}>{a.nomor}</p>
                        <SalinNomor text={a.nomor} />
                      </div>
                      <p className="mt-1 text-sm text-[#4a3a40]/70">a.n. {a.atasNama}</p>
                    </motion.div>
                  ))}
                </div>
                <button type="button" onClick={() => setOpen(false)} className="mt-6 text-sm text-[#4a3a40]/70 underline underline-offset-4">
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
      className="shrink-0 rounded-full bg-[#5b3b47] px-4 py-1.5 text-xs text-[#f7efe9]"
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

  const field = "w-full rounded-lg border border-[#5b3b47]/30 bg-white/80 px-4 py-2.5 text-[15px] text-[#4a3a40] outline-none placeholder:text-[#4a3a40]/45 focus:border-[#5b3b47]";

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3 text-left">
        <input name="nama" required defaultValue={tamu} placeholder="Nama Kamu" aria-label="Nama" className={field} />
        <textarea name="ucapan" rows={3} placeholder="Berikan Ucapan & Doa" aria-label="Ucapan dan doa" className={`${field} resize-none`} />
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-[#5b3b47]">Konfirmasi Kehadiran ?</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              [true, "Hadir"],
              [false, "Tidak Hadir"],
            ].map(([val, label]) => (
              <label
                key={String(val)}
                className="relative cursor-pointer rounded-lg border border-[#5b3b47]/40 py-2 text-center text-sm text-[#5b3b47] has-focus-visible:ring-2 has-focus-visible:ring-[#c9a245]"
              >
                <input type="radio" name="hadir" checked={hadir === val} onChange={() => setHadir(val as boolean)} className="sr-only" />
                {hadir === val && <motion.span layoutId="jw-hadir" transition={spring} className="absolute inset-0 rounded-[7px] bg-[#5b3b47]" />}
                <span className={`relative transition-colors ${hadir === val ? "text-[#f7efe9]" : ""}`}>{label as string}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <motion.button type="submit" whileTap={{ scale: 0.97 }} className="w-full rounded-lg bg-[#5b3b47] py-3 font-semibold text-[#f7efe9]">
          Kirim
        </motion.button>
        <AnimatePresence>
          {sent && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-center text-sm text-[#4a3a40]/80">
              Matur nuwun, ucapanmu sudah terkirim.
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <ul className="mt-6 max-h-[24rem] space-y-3 overflow-y-auto overscroll-contain text-left">
        <AnimatePresence initial={false}>
          {letters.map((l) => (
            <motion.li key={l.id} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={spring} className="flex gap-3 text-[#4a3a40]">
              <span className={`${cinzel} grid size-9 shrink-0 place-items-center rounded-full bg-[#5b3b47] text-sm font-semibold text-[#f7efe9]`}>{l.name[0]?.toUpperCase()}</span>
              <div className="min-w-0 flex-1 border-b border-[#5b3b47]/15 pb-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <span className="truncate">{l.name}</span>
                  <span className={`grid size-3.5 shrink-0 place-items-center rounded-full text-[8px] text-white ${l.hadir ? "bg-[#4f9a5f]" : "bg-[#b4553e]"}`} aria-label={l.hadir ? "Hadir" : "Tidak hadir"}>
                    {l.hadir ? "✓" : "×"}
                  </span>
                </p>
                <p className="text-[11px] text-[#4a3a40]/50">{l.waktu}</p>
                {l.message && <p className="mt-1 text-sm leading-relaxed text-[#4a3a40]/90">{l.message}</p>}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
