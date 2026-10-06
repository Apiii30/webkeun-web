"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { type FormEvent, type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useBukuTamu } from "@/undangan/buku-tamu";
import { createPortal } from "react-dom";
import { useHitungMundur } from "../../pakai";
import type { Foto, Undangan } from "../../types";
import { LEMBUT, cormorant, italiana } from "./hias";
import s from "./garden.module.css";

// Bagian tema Garden Premium yang butuh state: hitung mundur, galeri carousel, amplop digital, RSVP.

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

/* ───────── Hitung mundur: kotak berpuncak lengkung bergaris emas, masuk berputar satu per satu ───────── */

export function Countdown({ target }: { target: string }) {
  const units = useHitungMundur(target);
  return (
    <motion.dl className="grid grid-cols-4 gap-2.5" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}>
      {units.map(([n, label]) => (
        <motion.div
          key={label}
          variants={{
            hidden: { opacity: 0, transform: "perspective(700px) rotateY(-75deg) translateY(14px)" },
            show: { opacity: 1, transform: "perspective(700px) rotateY(0deg) translateY(0px)", transition: { duration: 1.1, ease: LEMBUT } },
          }}
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

/* ───────── Galeri: tumpukan kartu foto berpigura emas ───────── */

// Foto-foto bertumpuk seperti kartu di atas meja taman: pigura emas berpasparto krem, kartu di belakangnya sedikit
// bergeser & miring. Geser (atau tombol panah) melempar kartu teratas ke samping sambil berputar, lalu kartu itu
// masuk lagi ke dasar tumpukan; mundur menarik kartu terakhir kembali ke atas. Berganti sendiri tiap ±4 detik saat
// terlihat (berhenti sebentar setelah disentuh). Ketuk kartu teratas: diperbesar.
const TUMPUK = [
  { x: 0, y: 0, r: 0, s: 1 },
  { x: 7, y: 3, r: 5, s: 0.95 },
  { x: -7, y: 6, r: -6, s: 0.91 },
  { x: 3, y: 9, r: 3, s: 0.87 },
];
const posisi = (p: number) => {
  const q = TUMPUK[Math.min(p, TUMPUK.length - 1)];
  return `translate(${q.x}%, ${q.y}%) rotate(${q.r}deg) scale(${q.s})`;
};
const LEMPAR = "translate(-128%, -6%) rotate(-26deg) scale(1)";

export function Galeri({ photos }: { photos: Foto[] }) {
  const n = photos.length;
  const [aktif, setAktif] = useState(0);
  const [arah, setArah] = useState<1 | -1>(1);
  const [open, setOpen] = useState<number | null>(null);
  // setelah disentuh, putar otomatis berhenti dulu & baru jalan lagi 8 detik sesudah sentuhan terakhir
  const [sentuh, setSentuh] = useState(0);
  const [diam, setDiam] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const terlihat = useInView(ref, { amount: 0.4 });
  const kurangi = useReducedMotion();

  const ke = (i: number, dir: 1 | -1 = i >= aktif ? 1 : -1) => {
    setArah(dir);
    setAktif(((i % n) + n) % n);
    setDiam(true);
    setSentuh((x) => x + 1);
  };

  useEffect(() => {
    if (!diam) return;
    const id = setTimeout(() => setDiam(false), 8000);
    return () => clearTimeout(id);
  }, [diam, sentuh]);

  useEffect(() => {
    if (!terlihat || open !== null || kurangi || diam) return;
    const id = setTimeout(() => {
      setArah(1);
      setAktif((a) => (a + 1) % n);
    }, 4200);
    return () => clearTimeout(id);
  }, [terlihat, open, kurangi, diam, aktif, n]);

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
      <div ref={ref}>
        <motion.div
          className="relative mx-auto aspect-[4/5] w-[70%] max-w-[17.5rem]"
          style={{ touchAction: "pan-y" }}
          onPanEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 40) ke(aktif + (info.offset.x < 0 ? 1 : -1), info.offset.x < 0 ? 1 : -1);
          }}
          role="region"
          aria-roledescription="carousel"
          aria-label="Galeri foto"
        >
          {photos.map((p, i) => {
            const k = (i - aktif + n) % n; // urutan dalam tumpukan, 0 = teratas
            const dilempar = arah === 1 && k === n - 1; // baru saja dilempar dari atas
            const kembali = arah === -1 && k === 0; // ditarik kembali dari dasar ke atas
            const target = dilempar
              ? { transform: [null, LEMPAR, posisi(3)], opacity: [1, 1, 0], zIndex: [n + 1, n + 1, 0] }
              : kembali
                ? { transform: [LEMPAR, posisi(0)], opacity: [1, 1], zIndex: n + 1 }
                : { transform: posisi(k), opacity: k < TUMPUK.length ? 1 : 0, zIndex: n - k };
            return (
              <motion.button
                key={p.src}
                type="button"
                onClick={() => setOpen(i)}
                disabled={k !== 0}
                className={`${s.pigura} absolute inset-0 block rounded-[4px] p-[7px] disabled:cursor-default`}
                initial={false}
                animate={target as never}
                transition={dilempar ? { duration: 0.95, times: [0, 0.55, 1], ease: [0.4, 0, 0.2, 1] } : { duration: 0.75, ease: LEMBUT }}
                aria-label={`Perbesar foto: ${p.alt}`}
                aria-hidden={k !== 0}
                tabIndex={k === 0 ? 0 : -1}
              >
                <span className="block h-full w-full bg-[#f6f2e6] p-[9px] shadow-[inset_0_0_0_1px_rgb(122_92_42/0.45),inset_0_2px_8px_rgb(122_92_42/0.25)]">
                  <span className="relative block h-full w-full overflow-clip shadow-[0_0_0_1px_rgb(122_92_42/0.5)]">
                    <Image src={p.src} alt={p.alt} fill sizes="(min-width: 440px) 260px, 62vw" className="object-cover" />
                  </span>
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* panah, nomor foto, thumbnail */}
        <div className="mt-10 flex items-center justify-center gap-5">
          <TombolGeser arah="kiri" onClick={() => ke(aktif - 1, -1)} />
          <p className={`${italiana} min-w-[4.5rem] text-center text-[1.15rem] tracking-[0.18em] text-[#f3efe3]`}>
            {String(aktif + 1).padStart(2, "0")} <span className="text-[#dcc58f]">/</span> {String(n).padStart(2, "0")}
          </p>
          <TombolGeser arah="kanan" onClick={() => ke(aktif + 1, 1)} />
        </div>
        <div className="mt-5 flex justify-center gap-2">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => ke(i)}
              aria-label={`Foto ${i + 1}`}
              className={`relative size-10 overflow-clip rounded-md ring-1 transition-[transform,opacity] duration-500 ${i === aktif ? "-translate-y-1 opacity-100 ring-2 ring-[#dcc58f]" : "opacity-50 ring-[#f3efe3]/30"}`}
            >
              <Image src={p.src} alt="" fill sizes="40px" className="object-cover" />
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-[11px] tracking-[0.12em] text-[#f3efe3]/60">Geser kartu untuk foto berikutnya · ketuk untuk memperbesar</p>
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

function TombolGeser({ arah, onClick }: { arah: "kiri" | "kanan"; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={arah === "kiri" ? "Foto sebelumnya" : "Foto berikutnya"}
      className="grid size-10 place-items-center rounded-full border border-[#dcc58f]/70 bg-[#24434e]/60 text-[#f2e3b5]"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={arah === "kiri" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
      </svg>
    </motion.button>
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
  const { letters, kirim, mengirim, galat, terkirim } = useBukuTamu(contohSurat);
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

  const field = "w-full rounded-xl border border-[#dcc58f]/40 bg-[#f3efe3] px-4 py-3 text-[15px] text-[#24434e] outline-none placeholder:text-[#24434e]/45 focus:border-[#dcc58f]";

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3 text-left">
        <input name="nama" required defaultValue={tamu} placeholder="Nama kamu" aria-label="Nama" className={field} />
        <textarea name="ucapan" required rows={3} placeholder="Tulis ucapan & doa" aria-label="Ucapan dan doa" className={`${field} resize-none`} />
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
        <motion.button type="submit" disabled={mengirim || terkirim} whileTap={{ scale: 0.97 }} className={`${tombolEmas} w-full py-3.5 disabled:opacity-60`}>
          Kirim Ucapan
        </motion.button>
        <AnimatePresence>
          {terkirim && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-center text-sm text-[#f3efe3]/85">
              Terima kasih, ucapanmu sudah terkirim.
            </motion.p>
          )}
        </AnimatePresence>
        {galat && (
          <p role="alert" className="text-center text-sm text-[#f3efe3]/85">
            {galat}
          </p>
        )}
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
