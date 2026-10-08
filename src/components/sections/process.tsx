"use client";

import { AnimatePresence, motion, MotionConfig, useAnimationFrame, useInView, useMotionValue, useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";
import { type KeyboardEvent, type ReactNode, useRef, useState } from "react";
import { hargaPaket, steps } from "@/lib/site";
import { SectionHeading, Stabilo } from "../brand";
import { Icon } from "../icons";
import { Mascot } from "../mascot";

// Alur pemesanan 8 langkah (SOP Webkeun). Kiri: daftar langkah (di HP jadi rel yang bisa digeser). Kanan: panggung
// yang memperagakan langkah aktif dengan tampilan mini (chat WA, meeting, bukti bayar, form brief, dst.) dan meteran
// pembayarannya. Langkah berjalan sendiri selama terlihat di layar; berhenti saat disentuh, di-hover, atau dipilih.
// hanya="undangan": versi halaman undangan (durasi pengerjaan undangan saja).

const DURASI = 5200;
const pegas = { type: "spring", stiffness: 380, damping: 26 } as const;
const muncul: Variants = { awal: { opacity: 0, y: 14, scale: 0.94 }, tampil: { opacity: 1, y: 0, scale: 1, transition: pegas } };
const urut: Variants = { awal: {}, tampil: { transition: { staggerChildren: 0.28, delayChildren: 0.15 } } };

type Jenis = "undangan" | undefined;

export function Process({ hanya }: { hanya?: "undangan" }) {
  const [aktif, setAktif] = useState(0);
  const [otomatis, setOtomatis] = useState(true);
  const [ditahan, setDitahan] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const rel = useRef<HTMLDivElement>(null);
  const terlihat = useInView(ref, { amount: 0.45 });
  const kurangiGerak = useReducedMotion();
  const progres = useMotionValue(0);
  const jalan = otomatis && !kurangiGerak && terlihat && !ditahan;
  const s = steps[aktif];

  function ke(i: number, dariPengguna = true) {
    const n = (i + steps.length) % steps.length;
    setAktif(n);
    progres.set(0);
    if (dariPengguna) setOtomatis(false);
    // geser rel langkah (HP) supaya langkah aktif kelihatan, tanpa ikut menggulir halaman
    const r = rel.current;
    const tab = r?.querySelector<HTMLElement>(`[data-langkah="${n}"]`);
    if (r && tab && r.scrollWidth > r.clientWidth) r.scrollTo({ left: tab.offsetLeft - r.clientWidth / 2 + tab.offsetWidth / 2, behavior: "smooth" });
  }

  useAnimationFrame((_, delta) => {
    if (!jalan) return;
    const p = progres.get() + delta / DURASI;
    if (p >= 1) ke(aktif + 1, false);
    else progres.set(p);
  });

  function tombol(e: KeyboardEvent) {
    const arah = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (e.key === "Home" || e.key === "End" || arah) {
      e.preventDefault();
      const n = e.key === "Home" ? 0 : e.key === "End" ? steps.length - 1 : aktif + arah!;
      ke(n);
      rel.current?.querySelector<HTMLElement>(`[data-langkah="${(n + steps.length) % steps.length}"]`)?.focus();
    }
  }

  const terakhir = aktif === steps.length - 1;

  return (
    <MotionConfig reducedMotion="user">
      <section id="cara-kerja" className="relative overflow-hidden bg-lilac-soft">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <SectionHeading
              top={hanya ? "Cara pesan undangan," : "Alur pemesanan,"}
              bottom={
                <>
                  dari chat WA sampai <Stabilo>link aktif</Stabilo>
                </>
              }
            />
            <p className="max-w-sm text-lg text-ink/70 md:justify-self-end">{steps.length} langkah yang jelas dari awal. Kamu selalu tahu pesanan kamu lagi sampai mana.</p>
          </div>

          <div
            ref={ref}
            className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8"
            onPointerEnter={(e) => e.pointerType === "mouse" && setDitahan(true)}
            onPointerLeave={() => setDitahan(false)}
          >
            {/* daftar langkah */}
            <div
              ref={rel}
              role="tablist"
              aria-label="Langkah pemesanan"
              aria-orientation="vertical"
              onKeyDown={tombol}
              className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:py-0 [&::-webkit-scrollbar]:hidden"
            >
              {steps.map((l, i) => {
                const on = i === aktif;
                const lewat = i < aktif;
                return (
                  <button
                    key={l.title}
                    type="button"
                    role="tab"
                    id={`langkah-${i}`}
                    data-langkah={i}
                    aria-selected={on}
                    aria-controls="langkah-panggung"
                    tabIndex={on ? 0 : -1}
                    onClick={() => ke(i)}
                    className={`group relative flex shrink-0 snap-center items-center gap-3 rounded-2xl py-2.5 pr-4 pl-2.5 text-left transition-colors lg:gap-4 lg:py-3 lg:pr-5 lg:pl-3 ${
                      on ? "text-ink" : "text-ink/60 hover:bg-white/60 hover:text-ink"
                    }`}
                  >
                    {on && (
                      <motion.span layoutId="langkah-aktif" className="absolute inset-0 rounded-2xl bg-white shadow-[0_18px_40px_-22px_rgb(91_61_245/0.55)] ring-1 ring-brand/10" transition={pegas} />
                    )}
                    <span
                      className={`relative grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors lg:size-10 ${
                        on ? (i === steps.length - 1 ? "bg-mint text-ink" : "bg-brand text-white") : lewat ? "bg-mint/25 text-[#0f8f74]" : "bg-white text-brand ring-1 ring-brand/15"
                      }`}
                    >
                      {lewat ? <Icon name="check" className="size-4" strokeWidth={3} /> : i + 1}
                    </span>
                    <span className="relative min-w-0">
                      <span className="block font-bold whitespace-nowrap lg:text-[17px]">{l.title}</span>
                      <span className={`hidden text-sm lg:block ${on ? "text-ink/65" : "text-ink/50"}`}>{ringkas(l, i, hanya)}</span>
                    </span>
                    {on && (
                      <span className="absolute inset-x-4 bottom-1 h-[3px] overflow-hidden rounded-full bg-lilac lg:right-5 lg:left-[4.25rem]" aria-hidden="true">
                        <motion.span className="block h-full origin-left rounded-full bg-brand" style={{ scaleX: otomatis && !kurangiGerak ? progres : 1 }} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* panggung langkah aktif */}
            <div
              id="langkah-panggung"
              role="tabpanel"
              aria-labelledby={`langkah-${aktif}`}
              className={`relative flex flex-col overflow-hidden rounded-4xl transition-colors duration-500 ${terakhir ? "bg-mint text-ink" : "bg-brand text-white"}`}
              onFocus={() => setDitahan(true)}
              onBlur={() => setDitahan(false)}
            >
              <Bintang className={`top-20 right-7 w-7 ${terakhir ? "text-white" : "text-mint"}`} />
              <Bintang className={`bottom-[45%] left-6 w-4 ${terakhir ? "text-white/70" : "text-mint/60"}`} />

              <div className="relative flex items-center justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-6">
                <p className={`text-xs font-bold tracking-[0.16em] uppercase ${terakhir ? "text-ink/60" : "text-white/65"}`}>
                  Langkah {aktif + 1}/{steps.length} · {s.tahap}
                </p>
                {!kurangiGerak && (
                  <button
                    type="button"
                    onClick={() => setOtomatis(!otomatis)}
                    aria-label={otomatis ? "Jeda pergantian langkah otomatis" : "Putar langkah otomatis"}
                    className={`grid size-8 place-items-center rounded-full transition-colors ${terakhir ? "bg-ink/10 hover:bg-ink/15" : "bg-white/15 hover:bg-white/25"}`}
                  >
                    <Icon name={otomatis ? "pause" : "play"} className="size-3.5" strokeWidth={2.75} />
                  </button>
                )}
              </div>

              {/* adegan; di HP bisa digeser kiri/kanan */}
              <motion.div
                className="relative grid h-[19rem] touch-pan-y place-items-center px-5 sm:h-[21rem] sm:px-7"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) ke(aktif + 1);
                  else if (info.offset.x > 60) ke(aktif - 1);
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={aktif}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
                    exit={{ opacity: 0, x: -24, transition: { duration: 0.18 } }}
                    className="pointer-events-none w-full max-w-sm select-none"
                    aria-hidden="true"
                  >
                    <Adegan i={aktif} hanya={hanya} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <div className={`relative mx-2 mb-2 rounded-[1.6rem] p-5 sm:p-6 ${terakhir ? "bg-white/45" : "bg-white text-ink"}`}>
                <div className="flex items-start gap-4">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${terakhir ? "bg-ink text-mint" : "bg-lilac-soft text-brand"}`}>
                    <Icon name={s.icon} className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold sm:text-2xl">{s.title}</h3>
                    <p className="mt-1 text-ink/70">{desc(s, aktif, hanya)}</p>
                  </div>
                </div>
                <MeteranBayar persen={s.bayar} />
                <div className="mt-4 flex items-center justify-between gap-3 lg:hidden">
                  <button type="button" onClick={() => ke(aktif - 1)} className="grid size-10 place-items-center rounded-full bg-lilac-soft text-ink" aria-label="Langkah sebelumnya">
                    <Icon name="arrow" className="size-4 rotate-180" strokeWidth={2.5} />
                  </button>
                  <span className="text-xs text-ink/50">Geser untuk pindah langkah</span>
                  <button type="button" onClick={() => ke(aktif + 1)} className="grid size-10 place-items-center rounded-full bg-ink text-white" aria-label="Langkah berikutnya">
                    <Icon name="arrow" className="size-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

function ringkas(l: (typeof steps)[number], i: number, hanya: Jenis) {
  return hanya === "undangan" && i === 4 ? "Undangan jadi sekitar 3–5 hari" : l.ringkas;
}
function desc(l: (typeof steps)[number], i: number, hanya: Jenis) {
  return hanya === "undangan" && i === 4 ? "Kami mulai mengerjakan undangan kalian. Biasanya jadi sekitar 3–5 hari." : l.desc;
}

// Meteran pembayaran: DP 50% di awal, pelunasan 50% sebelum rilis
function MeteranBayar({ persen }: { persen: number }) {
  return (
    <div className="mt-5 border-t border-ink/10 pt-4">
      <div className="flex items-center justify-between text-xs font-semibold text-ink/55">
        <span>Pembayaran</span>
        <span className="tabular-nums">
          <motion.span key={persen} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="inline-block font-bold text-ink">
            {persen === 0 ? "Belum bayar" : persen === 50 ? "DP 50%" : "Lunas 100%"}
          </motion.span>
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {[50, 100].map((batas) => (
          <span key={batas} className="relative h-2 overflow-hidden rounded-full bg-ink/10">
            <motion.span
              className={`absolute inset-0 origin-left rounded-full ${batas === 50 ? "bg-brand" : "bg-mint"}`}
              initial={false}
              animate={{ scaleX: persen >= batas ? 1 : 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </span>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5 text-[11px] text-ink/45">
        <span>DP 50% · langkah 3</span>
        <span>Pelunasan · langkah 7</span>
      </div>
    </div>
  );
}

function Bintang({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`pointer-events-none absolute transition-colors duration-500 ${className}`} aria-hidden="true">
      <path d="M50 0 C53 36 64 47 100 50 C64 53 53 64 50 100 C47 64 36 53 0 50 C36 47 47 36 50 0Z" fill="currentColor" />
    </svg>
  );
}

// ——— adegan per langkah ———

function Adegan({ i, hanya }: { i: number; hanya: Jenis }) {
  const isi = [
    <Konsultasi key={0} hanya={hanya} />,
    <Meeting key={1} />,
    <Dp key={2} />,
    <Brief key={3} />,
    <Pengerjaan key={4} hanya={hanya} />,
    <Revisi key={5} />,
    <Pelunasan key={6} />,
    <SerahTerima key={7} />,
  ];
  return (
    <motion.div variants={urut} initial="awal" animate="tampil">
      {isi[i]}
    </motion.div>
  );
}

function Kartu({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={muncul} className={`rounded-2xl bg-white text-ink shadow-[0_20px_44px_-20px_rgb(21_19_43/0.55)] ${className}`}>
      {children}
    </motion.div>
  );
}

function Konsultasi({ hanya }: { hanya: Jenis }) {
  return (
    <div className="flex flex-col gap-2.5 text-[13px] sm:text-sm">
      <motion.p variants={muncul} className="max-w-[80%] origin-bottom-left self-start rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-ink shadow-md">
        Halo Webkeun! Mau tanya paket {hanya ? "undangan" : "undangan & website"} dong 🙏
      </motion.p>
      <motion.div variants={muncul} className="w-[88%] origin-bottom-right self-end rounded-2xl rounded-br-md bg-[#dcf8c6] px-3.5 py-2.5 text-ink shadow-md">
        <p>Halo! Ini pilihan paketnya ya:</p>
        <ul className="mt-2 divide-y divide-ink/10 rounded-xl bg-white/80 px-3">
          {hargaPaket.undangan.paket.map((p) => (
            <li key={p.nama} className="flex items-center justify-between py-1.5">
              <span>
                Undangan {p.nama}
                {p.sorot && <span className="ml-1.5 rounded-full bg-mint/30 px-1.5 py-px text-[10px] font-bold text-[#0f8f74]">{p.sorot}</span>}
              </span>
              <span className="font-bold">Rp{p.harga}</span>
            </li>
          ))}
          {!hanya && (
            <li className="flex items-center justify-between py-1.5">
              <span>Website</span>
              <span className="font-bold">mulai Rp{hargaPaket.website.paket[0].harga}</span>
            </li>
          )}
        </ul>
        <p className="mt-1 text-right text-[10px] text-ink/45">09.41 ✓✓</p>
      </motion.div>
    </div>
  );
}

function Meeting() {
  return (
    <Kartu className="overflow-hidden bg-ink! p-2.5 text-white!">
      <div className="flex items-center justify-between px-1.5 pb-2 text-[11px] text-white/70">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 animate-pulse rounded-full bg-[#ff5c5c]" />
          Meeting konsep · 1×
        </span>
        <span>GMeet / Zoom</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="relative grid aspect-[4/3] place-items-center rounded-xl bg-[#2a2747]">
          <span className="grid size-14 place-items-center rounded-full bg-lilac text-xl font-bold text-brand">K</span>
          <span className="absolute bottom-1.5 left-2 text-[11px]">Kamu</span>
        </div>
        <div className="relative grid aspect-[4/3] place-items-center rounded-xl bg-brand ring-2 ring-mint">
          <Mascot mood="senyum" className="w-14" />
          <span className="absolute bottom-1.5 left-2 text-[11px]">Webkeun</span>
        </div>
      </div>
      <motion.div variants={urut} className="mt-2.5 flex flex-wrap justify-center gap-1.5 text-[11px] font-semibold">
        {["Konsep & gaya", "Warna", "Fitur yang dibutuhkan"].map((c) => (
          <motion.span key={c} variants={muncul} className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1">
            <Icon name="check" className="size-3 text-mint" strokeWidth={3.5} />
            {c}
          </motion.span>
        ))}
      </motion.div>
      <div className="mt-2.5 flex justify-center gap-2 pb-1">
        <span className="size-7 rounded-full bg-white/15" />
        <span className="size-7 rounded-full bg-white/15" />
        <span className="h-7 w-11 rounded-full bg-[#ff5c5c]" />
      </div>
    </Kartu>
  );
}

function Dp() {
  return (
    <div className="relative">
      <Kartu className="p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-ink/50">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Icon name="receipt" className="size-4 text-brand" />
            Bukti pembayaran
          </span>
          <span className="rounded-full bg-mint/25 px-2 py-0.5 font-bold text-[#0f8f74]">Berhasil</span>
        </div>
        <p className="mt-3 text-sm text-ink/55">Down payment</p>
        <p className="text-3xl font-extrabold tracking-tight">DP 50%</p>
        <div className="mt-3 flex gap-2 text-xs font-semibold">
          <span className="rounded-lg bg-lilac-soft px-2.5 py-1.5">Transfer bank</span>
          <span className="text-ink/35 self-center">atau</span>
          <span className="rounded-lg bg-lilac-soft px-2.5 py-1.5">QRIS</span>
        </div>
      </Kartu>
      <motion.div
        variants={{ awal: { opacity: 0, scale: 0.6, rotate: -18 }, tampil: { opacity: 1, scale: 1, rotate: -6, transition: { type: "spring", stiffness: 420, damping: 14 } } }}
        className="absolute -right-2 -bottom-8 flex items-center gap-2.5 rounded-2xl bg-ink px-3.5 py-2.5 text-white shadow-xl sm:-right-5"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-mint text-ink">
          <Icon name="lock" className="size-5" strokeWidth={2.25} />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-bold">Jadwal dikunci</span>
          <span className="block text-[11px] text-white/60">Slot pengerjaan kamu aman</span>
        </span>
      </motion.div>
    </div>
  );
}

function Brief() {
  const ketik: Variants = { awal: { clipPath: "inset(0 100% 0 0)" }, tampil: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.9, ease: "linear" } } };
  return (
    <Kartu className="overflow-hidden">
      <div className="h-2 bg-brand" />
      <div className="p-4 sm:p-5">
        <p className="font-bold">Brief pesanan</p>
        <p className="text-xs text-ink/50">Google Form dari Webkeun</p>
        <div className="mt-3 space-y-2.5 text-xs">
          {[
            ["Nama yang ditampilkan", "Fara & Aditya"],
            ["Tanggal & lokasi", "Sabtu, 20 Maret · Bandung"],
          ].map(([label, isi]) => (
            <div key={label}>
              <p className="text-ink/50">{label}</p>
              <div className="mt-1 border-b-2 border-brand/40 pb-1 text-[13px] font-semibold">
                <motion.span variants={ketik} className="inline-block whitespace-nowrap">
                  {isi}
                </motion.span>
              </div>
            </div>
          ))}
          <div>
            <p className="text-ink/50">Kirim aset (foto, logo, teks)</p>
            <motion.div variants={urut} className="mt-1.5 flex gap-1.5">
              {["/preview/undangan/hp-undangan-sunda-2.webp", "/preview/undangan/hp-undangan-luxury-2.webp", "/preview/undangan/hp-undangan-garden-2.webp"].map((src) => (
                <motion.span key={src} variants={muncul} className="relative size-11 overflow-hidden rounded-lg bg-lilac">
                  <Image src={src} alt="" fill sizes="44px" className="object-cover object-top" />
                </motion.span>
              ))}
              <motion.span variants={muncul} className="grid size-11 place-items-center rounded-lg border-2 border-dashed border-brand/30 text-brand">
                <Icon name="image" className="size-4" />
              </motion.span>
            </motion.div>
          </div>
        </div>
      </div>
    </Kartu>
  );
}

function Pengerjaan({ hanya }: { hanya: Jenis }) {
  const jalur = [{ label: "Undangan", dari: 3, sampai: 5, warna: "bg-mint" }, ...(hanya ? [] : [{ label: "Website", dari: 5, sampai: 10, warna: "bg-lilac" }])];
  return (
    <Kartu className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="font-bold">Lama pengerjaan</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-lilac-soft px-2.5 py-1 text-[11px] font-bold text-brand">
          <Icon name="hammer" className="size-3.5" />
          Sedang dikerjakan
        </span>
      </div>
      <div className="mt-4 grid grid-cols-10 text-center text-[10px] text-ink/40 tabular-nums">
        {Array.from({ length: 10 }, (_, d) => (
          <span key={d}>{d + 1}</span>
        ))}
      </div>
      <div className="mt-1.5 space-y-3">
        {jalur.map((j) => (
          <div key={j.label}>
            <div className="relative h-8 rounded-lg bg-[repeating-linear-gradient(90deg,rgb(21_19_43/0.06)_0_1px,transparent_1px_10%)]">
              <motion.span
                variants={{ awal: { scaleX: 0 }, tampil: { scaleX: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } }}
                className={`absolute inset-y-0 left-0 flex origin-left items-center rounded-lg px-2.5 text-xs font-bold text-ink ${j.warna}`}
                style={{ width: `${j.dari * 10}%` }}
              >
                {j.label}
              </motion.span>
              <motion.span
                variants={{ awal: { opacity: 0 }, tampil: { opacity: 1, transition: { delay: 0.5 } } }}
                className="absolute inset-y-0 rounded-r-lg bg-[repeating-linear-gradient(135deg,rgb(91_61_245/0.18)_0_6px,transparent_6px_12px)]"
                style={{ left: `${j.dari * 10}%`, width: `${(j.sampai - j.dari) * 10}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] font-semibold text-ink/55">
              {j.label} sekitar {j.dari}–{j.sampai} hari
            </p>
          </div>
        ))}
      </div>
    </Kartu>
  );
}

function Revisi() {
  return (
    <div className="relative mx-auto flex w-full max-w-[19rem] items-center gap-3">
      <motion.div variants={muncul} className="w-[7.5rem] shrink-0 rounded-[1.4rem] bg-ink p-1.5 shadow-xl">
        <div className="relative aspect-[1/2] overflow-hidden rounded-[1.1rem] bg-white">
          <Image src="/preview/undangan/hp-undangan-sunda-2.webp" alt="" fill sizes="120px" className="object-cover" />
          <motion.span
            variants={{ awal: { opacity: 0, scale: 0 }, tampil: { opacity: 1, scale: 1, transition: { delay: 0.5, ...pegas } } }}
            className="absolute top-[38%] left-[46%] grid size-6 place-items-center rounded-full bg-[#ff9f1c] text-[11px] font-bold text-white ring-2 ring-white"
          >
            1
          </motion.span>
        </div>
      </motion.div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 text-[12px] sm:text-[13px]">
        <motion.p variants={muncul} className="origin-bottom-left rounded-2xl rounded-bl-md bg-white px-3 py-2 text-ink shadow-md">
          <span className="mr-1 inline-grid size-4 place-items-center rounded-full bg-[#ff9f1c] text-[10px] font-bold text-white">1</span>
          Fotonya ganti yang ini ya 🙏
        </motion.p>
        <motion.p variants={muncul} className="origin-bottom-right rounded-2xl rounded-br-md bg-[#dcf8c6] px-3 py-2 text-ink shadow-md">
          Siap, sudah diganti! Cek lagi ya ✓
        </motion.p>
        <motion.span variants={muncul} className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
          <Icon name="edit" className="size-3.5" />
          Revisi sesuai jatah paket
        </motion.span>
      </div>
    </div>
  );
}

function Pelunasan() {
  return (
    <div className="relative">
      <Kartu className="p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-ink/50">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Icon name="receipt" className="size-4 text-brand" />
            Tagihan pelunasan
          </span>
          <span>Sebelum rilis</span>
        </div>
        <div className="mt-3 space-y-1.5 text-sm">
          <p className="flex justify-between text-ink/45 line-through">
            <span>DP 50%</span>
            <span>dibayar</span>
          </p>
          <p className="flex justify-between font-bold">
            <span>Sisa 50%</span>
            <span>dilunasi</span>
          </p>
        </div>
        <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-ink/10">
          <span className="w-1/2 bg-brand" />
          <motion.span variants={{ awal: { scaleX: 0 }, tampil: { scaleX: 1, transition: { delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }} className="w-1/2 origin-left bg-mint" />
        </div>
      </Kartu>
      <motion.span
        variants={{ awal: { opacity: 0, scale: 2.2, rotate: 0 }, tampil: { opacity: 1, scale: 1, rotate: -12, transition: { delay: 0.7, type: "spring", stiffness: 500, damping: 18 } } }}
        className="absolute -top-5 -right-1 rounded-xl border-[3px] border-mint bg-ink px-3 py-1 text-xl font-extrabold tracking-[0.12em] text-mint shadow-lg sm:-right-4"
      >
        LUNAS
      </motion.span>
    </div>
  );
}

function SerahTerima() {
  return (
    <div className="relative flex flex-col gap-3">
      <Kartu className="flex items-center gap-3 p-3 pr-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-mint">
          <Icon name="link" className="size-5" strokeWidth={2.25} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#0f8f74]">
            <span className="size-1.5 animate-pulse rounded-full bg-mint" />
            Link aktif
          </span>
          <span className="block truncate text-sm font-semibold">faraaditya.my.id</span>
        </span>
        <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white">Salin</span>
      </Kartu>
      <Kartu className="flex items-center gap-3 p-3 pr-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lilac text-brand">
          <Icon name="book" className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Panduan penggunaan</span>
          <span className="block text-[11px] text-ink/50">Cara pakai & sebar link-nya</span>
        </span>
        <Icon name="check" className="size-5 text-[#0f8f74]" strokeWidth={3} />
      </Kartu>
      <motion.div
        variants={{ awal: { opacity: 0, y: 20, rotate: 0 }, tampil: { opacity: 1, y: 0, rotate: 8, transition: { delay: 0.6, ...pegas } } }}
        className="absolute -top-14 -right-1 w-14 sm:-right-3"
      >
        <Mascot mood="tertawa" className="w-full drop-shadow-lg" />
      </motion.div>
    </div>
  );
}
