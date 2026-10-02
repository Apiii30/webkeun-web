"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { type FormEvent, useEffect, useRef, useState } from "react";
import type { Foto } from "../../types";
import { Daisy } from "./bunga";
import { W } from "./warna";

// Bagian tema Floral yang butuh state: hitung mundur, salin rekening, tumpukan foto, dan RSVP.

const spring = { type: "spring", stiffness: 260, damping: 26 } as const;

export function Countdown({ target }: { target: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [target]);

  const units: [number | null, string][] = [
    [left === null ? null : Math.floor(left / 86_400_000), "Hari"],
    [left === null ? null : Math.floor(left / 3_600_000) % 24, "Jam"],
    [left === null ? null : Math.floor(left / 60_000) % 60, "Menit"],
    [left === null ? null : Math.floor(left / 1000) % 60, "Detik"],
  ];

  return (
    <dl className="grid grid-cols-4 gap-2">
      {units.map(([n, label], i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 30, rotate: i % 2 ? 6 : -6 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ ...spring, delay: i * 0.08 }}
          className="flex flex-col-reverse rounded-2xl bg-(--hijau) bg-(image:--noise) py-4 text-center text-(--kertas)"
        >
          <dt className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-(--kertas)/60 uppercase">{label}</dt>
          <dd className="relative h-9 overflow-hidden font-[family-name:var(--font-fraunces)] text-3xl leading-9 tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={n ?? "x"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="block"
              >
                {n === null ? "–" : String(n).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </dd>
        </motion.div>
      ))}
    </dl>
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
      className="rounded-full bg-(--hijau) px-4 py-2 text-xs font-semibold text-(--kertas)"
    >
      {copied ? "Tersalin ✓" : "Salin nomor"}
    </motion.button>
  );
}

// Foto-foto ditumpuk seperti cetakan. Geser foto paling atas (atau tekan tombol) untuk melihat berikutnya.
const TILT = [0, -5, 4, -3, 6, -6, 3];

export function Deck({ photos }: { photos: Foto[] }) {
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const next = () => setOrder((o) => [...o.slice(1), o[0]]);
  const prev = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  const current = photos[order[0]];

  return (
    <div>
      <div className="relative mx-auto aspect-[4/5] w-[80%]">
        {photos.map((p, i) => {
          const depth = order.indexOf(i);
          const top = depth === 0;
          const d = Math.min(depth, 3);
          return (
            <motion.div
              key={p.src}
              className={`absolute inset-0 overflow-hidden rounded-[1.75rem] border-[6px] border-(--kertas) bg-(--krem) shadow-[0_18px_40px_-18px_rgb(18_42_31/0.6)] ${top ? "cursor-grab active:cursor-grabbing" : ""}`}
              style={{ zIndex: photos.length - depth, touchAction: "pan-y" }}
              animate={{ rotate: TILT[depth % TILT.length], y: d * 12, scale: 1 - d * 0.05, opacity: depth > 3 ? 0 : 1 }}
              transition={spring}
              drag={top ? "x" : false}
              dragSnapToOrigin
              whileDrag={{ scale: 1.04 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 500) next();
              }}
            >
              <Image src={p.src} alt={p.alt} fill sizes="360px" draggable={false} className="pointer-events-none object-cover" />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 px-2">
        <button
          type="button"
          onClick={prev}
          aria-label="Foto sebelumnya"
          className="grid size-11 place-items-center rounded-full border-2 border-(--hijau) transition-colors active:bg-(--hijau) active:text-(--kertas)"
        >
          <Panah className="rotate-180" />
        </button>
        <div className="min-w-0 text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={current.src}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="truncate font-[family-name:var(--font-fraunces)] text-lg italic"
            >
              {current.alt}
            </motion.p>
          </AnimatePresence>
          <p className="mt-0.5 text-xs font-semibold tracking-[0.2em] text-(--hijau)/60 tabular-nums">
            {String(order[0] + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </p>
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Foto berikutnya"
          className="grid size-11 place-items-center rounded-full bg-(--hijau) text-(--kertas) transition-transform active:scale-90"
        >
          <Panah />
        </button>
      </div>
    </div>
  );
}

function Panah({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

type Surat = { id: number; name: string; status: string; message: string };

const contohSurat: Surat[] = [
  { id: 2, name: "Tante Mira", status: "Hadir", message: "Selamat ya, Nak! Semoga jadi keluarga yang penuh berkah, rukun sampai kakek-nenek." },
  { id: 1, name: "Raka", status: "Hadir", message: "Akhirnya! Bahagia selalu kalian berdua, ditunggu undangan makan-makannya." },
];

const OPSI = ["Hadir", "Tidak hadir", "Masih ragu"];
const WARNA_STATUS: Record<string, string> = { Hadir: W.daun, "Tidak hadir": W.koral, "Masih ragu": W.mentega };

export function Ucapan({ tamu }: { tamu?: string }) {
  const [letters, setLetters] = useState(contohSurat);
  const [hadir, setHadir] = useState(OPSI[0]);
  const [burst, setBurst] = useState(0);
  const nextId = useRef(contohSurat.length + 1);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("nama") ?? "").trim();
    if (!name) return;
    const letter = { id: nextId.current++, name, status: hadir, message: String(data.get("ucapan") ?? "").trim() };
    setLetters((l) => [letter, ...l]);
    setBurst((b) => b + 1);
    form.reset();
  }

  const field =
    "mt-2 w-full rounded-2xl border-2 border-(--hijau)/15 bg-white/60 px-4 py-3 text-base outline-none transition-colors placeholder:text-(--hijau)/35 focus:border-(--hijau)";

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-5">
        <label className="block text-sm font-semibold">
          Nama
          <input name="nama" required defaultValue={tamu} placeholder="Tulis namamu" className={`${field} font-normal`} />
        </label>
        <fieldset>
          <legend className="text-sm font-semibold">Kehadiran</legend>
          <div className="mt-2 flex gap-1 rounded-full bg-(--hijau)/8 p-1">
            {OPSI.map((o) => (
              <label key={o} className="relative flex-1 cursor-pointer rounded-full py-2.5 text-center text-sm font-semibold has-focus-visible:ring-2 has-focus-visible:ring-(--biru)">
                <input type="radio" name="hadir" value={o} checked={hadir === o} onChange={() => setHadir(o)} className="sr-only" />
                {hadir === o && <motion.span layoutId="floral-hadir" transition={spring} className="absolute inset-0 rounded-full bg-(--hijau)" />}
                <span className={`relative transition-colors ${hadir === o ? "text-(--kertas)" : ""}`}>{o}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm font-semibold">
          Ucapan & doa
          <textarea name="ucapan" rows={3} placeholder="Tulis ucapan untuk kedua mempelai" className={`${field} resize-none font-normal`} />
        </label>
        <div className="relative">
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="w-full rounded-full bg-(--koral) py-4 font-bold text-(--hijau-tua) shadow-[0_10px_24px_-10px_rgb(239_122_88/0.9)]"
          >
            Kirim ucapan
          </motion.button>
          {/* Bunga kecil berhamburan setiap kali ucapan terkirim */}
          <AnimatePresence>
            {burst > 0 && (
              <motion.div key={burst} className="pointer-events-none absolute inset-0" aria-hidden="true">
                {Array.from({ length: 10 }, (_, i) => {
                  const a = (Math.PI * 2 * i) / 10;
                  return (
                    <motion.span
                      key={i}
                      className="absolute top-1/2 left-1/2 -mt-3 -ml-3 size-6"
                      initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
                      animate={{ x: Math.cos(a) * 140, y: Math.sin(a) * 70 - 20, scale: 1, rotate: 180, opacity: 0 }}
                      transition={{ duration: 1.1, ease: [0.2, 0.8, 0.3, 1] }}
                    >
                      <Daisy className="size-full" warna={(["kuning", "biru", "putih"] as const)[i % 3]} petals={12} />
                    </motion.span>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {burst > 0 && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-center text-sm font-semibold text-(--hijau)">
              Terima kasih! Ucapanmu sudah tampil di bawah.
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <ul data-lenis-prevent className="mt-10 max-h-[26rem] space-y-3 overflow-y-auto overscroll-contain pr-1">
        <AnimatePresence initial={false}>
          {letters.map((l) => (
            <motion.li
              key={l.id}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={spring}
              className="rounded-3xl bg-white/70 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate font-bold">{l.name}</p>
                <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold text-(--hijau-tua)" style={{ background: WARNA_STATUS[l.status] }}>
                  {l.status}
                </span>
              </div>
              {l.message && <p className="mt-2 leading-relaxed text-(--hijau)/80">{l.message}</p>}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
