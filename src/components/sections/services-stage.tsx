"use client";

import { AnimatePresence, motion, type MotionValue, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { Fragment, type PointerEvent, type ReactNode, useEffect, useState } from "react";
import { serviceShowcase, services } from "@/lib/site";
import { Icon } from "../icons";
import { Mascot } from "../mascot";

// Panggung pratinjau section Layanan. Lapisannya bergerak dengan kecepatan berbeda (paralaks) saat digulir
// dan saat kursor digerakkan di atasnya: coretan latar paling pelan, lalu browser, HP, dan chip fitur paling
// cepat. Pergantian layanan: contoh website baru naik seperti tirai (HP sedikit telat), halamannya ikut
// "tergulir", warna panggung berubah, maskot menunduk lalu muncul dengan ekspresi baru.

const N = services.length;
const show = (i: number) => serviceShowcase[services[i].slug];
// Warna panggung per layanan (urutan sama dengan `services`): lilac, mint muda, ungu brand, merah muda, tinta.
// Berganti tepat di batas jatah tiap layanan.
const WARNA = ["#e4deff", "#c8f1e5", "#5b3df5", "#fadde4", "#15132b"];
const GANTI = Array.from({ length: N - 1 }, (_, k) => [(k + 1) / N - 0.04, (k + 1) / N + 0.04]).flat();
const GANTI_WARNA = Array.from({ length: N - 1 }, (_, k) => [WARNA[k], WARNA[k + 1]]).flat();

type Gerak = { p: MotionValue<number>; diam: boolean };

export function Panggung({ p, aktif, diam }: Gerak & { aktif: number }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 110, damping: 18 });
  const sy = useSpring(my, { stiffness: 110, damping: 18 });
  const latar = useTransform(p, GANTI, GANTI_WARNA);
  const putar = useTransform(p, [0, 1], [-10, 14]);
  const s = show(aktif);

  function ikutKursor(e: PointerEvent<HTMLDivElement>) {
    if (diam || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function lepas() {
    mx.set(0);
    my.set(0);
  }

  const lapis = { p, sx, sy, diam };

  return (
    <motion.div
      onPointerMove={ikutKursor}
      onPointerLeave={lepas}
      className="relative aspect-[5/4] w-full rounded-[2rem] md:rounded-[2.5rem]"
    >
      {/* latar dipisah per mode: warna statis tidak menimpa motion value yang sudah terpasang di elemen yang sama */}
      {diam ? (
        <div className="absolute inset-0 rounded-[inherit] transition-colors duration-500" style={{ backgroundColor: WARNA[aktif] }} />
      ) : (
        <motion.div className="absolute inset-0 rounded-[inherit]" style={{ backgroundColor: latar }} />
      )}
      {/* coretan tebal ujung bulat seperti goresan logo, plus titik mint */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
        <motion.svg
          style={{ rotate: diam ? 0 : putar }}
          viewBox="0 0 400 320"
          className="absolute -right-[12%] -bottom-[22%] w-[82%] overflow-visible text-white/35"
        >
          <path d="M20 270 C 80 130, 160 320, 225 175 S 330 80, 362 46" fill="none" stroke="currentColor" strokeWidth="30" strokeLinecap="round" />
          <circle cx="388" cy="18" r="17" fill="#2fd3b0" />
        </motion.svg>
      </div>

      {/* browser + maskot yang mengintip dari baliknya */}
      <Lapis {...lapis} dalam={10} naik={["4%", "-4%"]} className="top-[17%] left-[7%] w-[78%]">
        <div className="absolute top-0 left-[4%] w-[17%] -translate-y-[80%]" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={aktif}
              initial={{ y: "70%" }}
              animate={{ y: "0%", transition: { type: "spring", stiffness: 520, damping: 22 } }}
              exit={{ y: "70%", transition: { duration: 0.14, ease: "easeIn" } }}
            >
              <Mascot mood={s.mood} className="w-full" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute bottom-[calc(100%+0.4rem)] left-[23%] md:bottom-[calc(100%+0.7rem)]" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={aktif}
              initial={{ opacity: 0, scale: 0.6, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 480, damping: 24, delay: 0.12 } }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.12 } }}
              className="origin-bottom-left rounded-2xl rounded-bl-sm bg-white px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-ink shadow-[0_10px_24px_-12px_rgb(21_19_43/0.35)] md:px-4 md:py-2 md:text-sm"
            >
              {s.line}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-white shadow-[0_34px_70px_-30px_rgb(21_19_43/0.55)] md:rounded-2xl">
          <div className="flex items-center gap-1 bg-[#ece9f7] px-2.5 py-1.5 md:gap-1.5 md:px-3 md:py-2">
            <span className="size-1.5 rounded-full bg-[#ff6159] md:size-2" />
            <span className="size-1.5 rounded-full bg-[#ffbd2e] md:size-2" />
            <span className="size-1.5 rounded-full bg-[#28c840] md:size-2" />
            <span className="ml-2 flex h-4 min-w-0 flex-1 items-center gap-1.5 rounded-full bg-white px-2 text-[9px] font-semibold text-ink/60 md:h-6 md:px-3 md:text-xs">
              <span className="size-1.5 shrink-0 rounded-full bg-mint md:size-2" />
              <Ketik key={s.domain} teks={s.domain} diam={diam} />
            </span>
          </div>
          <div className="@container relative aspect-[16/10] overflow-hidden bg-lilac-soft">
            {services.map((x, i) => (
              <Layar key={x.slug} i={i} p={p} aktif={aktif} diam={diam} />
            ))}
          </div>
        </div>
      </Lapis>

      {/* HP: lebih dekat ke mata, jadi geraknya lebih jauh */}
      <Lapis {...lapis} dalam={22} naik={["14%", "-12%"]} className="right-[5%] bottom-[4%] w-[23%]">
        <div className="rotate-[4deg] rounded-[1rem] bg-white p-[3.5%] shadow-[0_30px_60px_-24px_rgb(21_19_43/0.6)] md:rounded-[1.3rem]">
          <div className="@container relative aspect-[1/2] overflow-hidden rounded-[0.8rem] bg-lilac-soft md:rounded-[1.05rem]">
            {services.map((x, i) => (
              <Layar key={x.slug} i={i} p={p} aktif={aktif} diam={diam} hp />
            ))}
          </div>
        </div>
      </Lapis>

      {/* chip fitur, tiap slot punya kedalaman sendiri */}
      {SLOT.map((slot, k) => (
        <Lapis key={k} {...lapis} dalam={slot.dalam} naik={slot.naik} className={slot.className}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={aktif}
              initial={{ opacity: 0, scale: 0.5, rotate: slot.miring * 3 }}
              animate={{ opacity: 1, scale: 1, rotate: slot.miring, transition: { type: "spring", stiffness: 420, damping: 22, delay: 0.1 + k * 0.08 } }}
              exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white py-1 pr-2.5 pl-1 text-[11px] font-semibold whitespace-nowrap text-ink shadow-[0_12px_30px_-12px_rgb(21_19_43/0.4)] md:gap-2 md:py-1.5 md:pr-4 md:pl-1.5 md:text-sm"
            >
              <span className="grid size-5 place-items-center rounded-full bg-brand text-white md:size-7">
                <Icon name={s.chips[k][0]} className="size-3 md:size-4" />
              </span>
              {s.chips[k][1]}
            </motion.span>
          </AnimatePresence>
        </Lapis>
      ))}
    </motion.div>
  );
}

const SLOT = [
  { className: "top-[52%] -left-[3%]", dalam: 30, naik: ["120%", "-160%"], miring: -4 },
  { className: "top-[25%] -right-[3%]", dalam: 26, naik: ["80%", "-110%"], miring: 5 },
  { className: "bottom-[6%] left-[12%]", dalam: 34, naik: ["70%", "-150%"], miring: -2 },
] as const;

// Satu lapisan paralaks: geser mengikuti kursor (dalam = jarak maksimum dalam px) dan naik mengikuti guliran
function Lapis({
  p,
  sx,
  sy,
  diam,
  dalam,
  naik,
  className,
  children,
}: Gerak & { sx: MotionValue<number>; sy: MotionValue<number>; dalam: number; naik: readonly [string, string]; className: string; children: ReactNode }) {
  const x = useTransform(sx, (v) => v * dalam);
  const y = useTransform(sy, (v) => v * dalam);
  const gulir = useTransform(p, [0, 1], [...naik]);
  return (
    <motion.div style={diam ? undefined : { x, y }} className={`absolute ${className}`}>
      <motion.div style={diam ? undefined : { y: gulir }}>{children}</motion.div>
    </motion.div>
  );
}

// Alamat website diketik ulang setiap layanan berganti
function Ketik({ teks, diam }: { teks: string; diam: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (diam) return;
    const id = setInterval(() => setN((v) => (v >= teks.length ? v : v + 1)), 42);
    return () => clearInterval(id);
  }, [teks, diam]);
  const habis = diam || n >= teks.length;
  return (
    <span className="flex min-w-0 items-center truncate">
      {habis ? teks : teks.slice(0, n)}
      {!habis && <span className="ml-px inline-block h-[1.1em] w-px bg-ink/60" />}
    </span>
  );
}

// Satu layar contoh website (browser atau HP) untuk layanan ke-i
function Layar({ i, p, aktif, diam, hp }: Gerak & { i: number; aktif: number; hp?: boolean }) {
  const b = i / N;
  const telat = hp ? 0.025 : 0; // tirai HP sedikit telat, biar terasa berlapis
  const a0 = Math.max(0, b - 0.04 + telat);
  const a1 = b + 0.04 + telat;
  const tirai = useTransform(p, [a0, a1], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]);
  const masuk = useTransform(p, [a0, a1], ["16%", "0%"]);
  const d = show(i);
  const gambar = hp ? d.hp : d.web;
  // halaman digulir sampai gambar terakhir di tumpukan terlihat
  const gulir = useTransform(p, [i ? a1 : 0.03, Math.min(1, (i + 1) / N + 0.04)], ["0%", `${-(1 - 1 / (gambar?.length ?? 1)) * 100}%`]);

  if (diam && i !== aktif) return null;
  const pertama = i === 0 || diam;

  return (
    <motion.div style={pertama ? undefined : { clipPath: tirai }} className="absolute inset-0">
      <motion.div style={pertama ? undefined : { y: masuk }} className="absolute inset-0">
        {gambar ? (
          <motion.div style={diam ? undefined : { y: gulir }}>
            {gambar.map((src, k) => (
              <div key={src} className={`relative ${hp ? "aspect-[1/2]" : "aspect-[16/10]"}`}>
                <Image
                  src={src}
                  alt={k ? "" : `Contoh website ${d.nama} di ${hp ? "HP" : "laptop"}`}
                  fill
                  sizes={hp ? "(min-width: 768px) 150px, 26vw" : "(min-width: 768px) 480px, 80vw"}
                  className="object-cover object-top"
                />
              </div>
            ))}
          </motion.div>
        ) : hp ? (
          <RancanganHP />
        ) : (
          <RancanganWeb p={p} diam={diam} />
        )}
      </motion.div>
    </motion.div>
  );
}

// ---------- Custom: rancangan sistem booking, digambar langsung ----------

const HARI = ["Sen", "Sel", "Rab", "Kam", "Jum"];
const JAM = ["09.00", "11.00", "13.00", "15.00"];
// [hari, jam, nama]; muncul satu per satu mengikuti guliran di jatah layanan terakhir, seperti booking yang masuk
const BOOKING: [number, number, string][] = [
  [0, 0, "Rina"],
  [2, 0, "Bayu"],
  [1, 1, "Sari"],
  [3, 1, "Dodi"],
  [2, 2, "Nisa"],
  [4, 2, "Wulan"],
  [0, 3, "Asep"],
];

function RancanganWeb({ p, diam }: Gerak) {
  return (
    <div className="absolute inset-0 flex bg-white text-[2cqw] text-ink" aria-label="Rancangan dashboard sistem booking" role="img">
      <div className="flex w-[18%] flex-col gap-[2.2cqw] bg-ink p-[2.4cqw]">
        <span className="flex items-center gap-[1cqw] font-bold text-white">
          <span className="size-[1.8cqw] rounded-full bg-mint" />
          Booking
        </span>
        {[72, 56, 64, 48].map((w, k) => (
          <span key={w} className={`h-[1.2cqw] rounded-full ${k ? "bg-white/25" : "bg-white/70"}`} style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="flex-1 p-[3cqw]">
        <div className="flex items-center justify-between">
          <p className="text-[3.4cqw] font-bold tracking-tight">Jadwal minggu ini</p>
          <span className="rounded-full bg-lilac-soft px-[1.8cqw] py-[0.6cqw] font-semibold text-brand">{BOOKING.length} booking</span>
        </div>
        <div className="mt-[2.4cqw] grid grid-cols-[auto_repeat(5,1fr)] gap-[1cqw]">
          <span />
          {HARI.map((h) => (
            <span key={h} className="text-center font-semibold text-ink/45">
              {h}
            </span>
          ))}
          {JAM.map((j, r) => (
            <Fragment key={j}>
              <span className="self-center pr-[1cqw] text-ink/40">{j}</span>
              {HARI.map((h, c) => {
                const k = BOOKING.findIndex(([bc, br]) => bc === c && br === r);
                return <Slot key={h} k={k} p={p} diam={diam} />;
              })}
            </Fragment>
          ))}
        </div>
      </div>
      <span className="absolute right-[2.5cqw] bottom-[2.5cqw] rotate-[-5deg] rounded-[1cqw] bg-mint px-[1.8cqw] py-[0.8cqw] font-bold">Rancangan v1</span>
    </div>
  );
}

function Slot({ k, p, diam }: Gerak & { k: number }) {
  const mulai = (N - 1) / N + 0.05;
  const a = mulai + Math.max(0, k) * ((0.97 - mulai) / BOOKING.length);
  const muncul = useTransform(p, [a, a + 0.03], [0, 1]);
  const skala = useTransform(p, [a, a + 0.03], [0.5, 1]);
  return (
    <span className="relative h-[7cqw] rounded-[1cqw] border border-dashed border-ink/15">
      {k >= 0 && (
        <motion.span
          style={diam ? undefined : { opacity: muncul, scale: skala }}
          className={`absolute inset-[0.4cqw] flex items-center rounded-[0.8cqw] px-[1cqw] font-semibold ${k % 2 ? "bg-mint text-ink" : "bg-brand text-white"}`}
        >
          {BOOKING[k][2]}
        </motion.span>
      )}
    </span>
  );
}

function RancanganHP() {
  return (
    <div className="absolute inset-0 flex flex-col bg-white p-[8cqw] text-[6cqw] text-ink" aria-hidden="true">
      <p className="text-[9cqw] leading-tight font-bold">Pilih jam</p>
      <div className="mt-[5cqw] flex gap-[2.5cqw]">
        {["Sen", "Sel", "Rab"].map((h, k) => (
          <span key={h} className={`flex-1 rounded-[3cqw] py-[2.5cqw] text-center font-semibold ${k === 1 ? "bg-ink text-white" : "bg-lilac-soft"}`}>
            {h}
          </span>
        ))}
      </div>
      <div className="mt-[5cqw] space-y-[3cqw]">
        {JAM.map((j, k) => (
          <div
            key={j}
            className={`flex items-center justify-between rounded-[3.5cqw] border px-[4cqw] py-[3.5cqw] ${
              k === 2 ? "border-brand bg-brand text-white" : "border-dashed border-ink/20"
            }`}
          >
            <span className="font-semibold">{j}</span>
            <span className="text-[5cqw] opacity-70">{k === 0 ? "Penuh" : k === 2 ? "Dipilih" : "Kosong"}</span>
          </div>
        ))}
      </div>
      <span className="mt-auto rounded-full bg-mint py-[4cqw] text-center font-bold">Pesan slot</span>
    </div>
  );
}
