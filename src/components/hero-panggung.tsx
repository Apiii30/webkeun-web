"use client";

import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import Image from "next/image";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { templates } from "@/lib/site";
import { Mascot, type Mood } from "./mascot";

// Panggung hero "dinding demo". Dua babak yang bergantian terus:
// 1. Demo (±8 dtk): semua demo Webkeun (undangan & website) tersusun di dinding miring 3D selebar hero, enam kolom
//    bergulir berlawanan arah (CSS .dinding-jalur di globals.css). Dindingnya ada di bawah lapisan teks; tepi yang mentok
//    tulisan memudar (.dinding-tepi). Sengaja hanya hiasan (tidak bisa diklik, tanpa efek hover/kursor) supaya ringan;
//    gerak guliran murni CSS transform.
// 2. Maskot (±6 dtk): dinding turun & menghilang, Webi besar melompat naik dan berganti pose (kaget → melambai →
//    kedip → semangat) sambil berceloteh, lalu turun lagi dan dindingnya kembali.

const lembut = [0.16, 1, 0.3, 1] as const;
const LAMA_DEMO = 8000;
const LAMA_MASKOT = 6000;

type Kartu = { nama: string; src: string; bentuk: "hp" | "web" | "trio"; url?: string; screens?: string[]; tone?: { bg: string; accent: string } };
type Template = (typeof templates)[number];

// "Fara & Aditya · Art Sunda" → "Art Sunda"
const namaPendek = (nama: string) => nama.split(" · ").at(-1) ?? nama;
const u = templates.filter((t) => t.category === "undangan");
const w = templates.filter((t) => t.category !== "undangan");

const hp = (t: Template): Kartu => ({ nama: namaPendek(t.name), src: t.phone, bentuk: "hp", tone: t.tone });
const web = (t: Template, src = t.laptop ?? t.phone): Kartu => ({ nama: t.name, src, bentuk: "web", url: t.url });
const trio = (t: Template): Kartu => ({ ...hp(t), bentuk: "trio", screens: t.screens });

// Enam kolom: kolom lebar (website di browser & undangan tiga layar) di paling pinggir, empat kolom HP di tengah.
// Di HP yang terlihat hanya kolom-kolom HP di tengah, jadi keempatnya sudah memuat semua demo.
const kolom: { isi: Kartu[]; lama: number; lebar?: boolean; turun?: boolean; geser: string }[] = [
  { isi: [web(w[0]), trio(u[7]), web(w[1]), trio(u[8]), web(w[0], "/preview/umkm/web-kawalu-2.webp"), trio(u[3])], lama: 96, lebar: true, turun: true, geser: "-mt-24" },
  { isi: [hp(u[0]), hp(w[0]), hp(u[4]), hp(u[8]), hp(w[2]), hp(u[6])], lama: 70, geser: "mt-16" },
  { isi: [hp(u[1]), hp(u[5]), hp(w[1]), hp(u[3]), hp(u[7]), hp(u[2])], lama: 80, turun: true, geser: "-mt-10" },
  { isi: [hp(u[2]), hp(u[7]), hp(u[0]), hp(w[2]), hp(u[4]), hp(u[8])], lama: 66, geser: "mt-24" },
  { isi: [hp(u[3]), hp(w[1]), hp(u[6]), hp(u[1]), hp(w[0]), hp(u[5])], lama: 84, turun: true, geser: "mt-2" },
  {
    isi: [web(w[2]), trio(u[6]), web(w[1], "/preview/company-profile/web-bahtera-2.webp"), trio(u[1]), web(w[2], "/preview/portofolio/web-laras-2.webp"), trio(u[4])],
    lama: 104,
    geser: "-mt-40",
    lebar: true,
  },
];

export function HeroPanggung({ children }: { children: ReactNode }) {
  const kurangiGerak = useReducedMotion();
  const [babak, setBabak] = useState<"demo" | "maskot">("demo");
  const [putaran, setPutaran] = useState(0);

  // pergantian babak
  useEffect(() => {
    if (kurangiGerak) return;
    const t = setTimeout(
      () => {
        if (babak === "demo") setBabak("maskot");
        else {
          setBabak("demo");
          setPutaran((p) => p + 1);
        }
      },
      babak === "demo" ? LAMA_DEMO : LAMA_MASKOT,
    );
    return () => clearTimeout(t);
  }, [babak, kurangiGerak]);

  const tampilDemo = babak === "demo";

  return (
    <MotionConfig reducedMotion="user">
      {/* lapisan dinding (hiasan): di HP menempati bagian bawah hero, di layar lebar sisi kanan sampai tepi layar */}
      <div aria-hidden="true" className="dinding-tepi pointer-events-none absolute inset-x-0 bottom-0 h-[30rem] overflow-hidden [perspective:1400px] sm:h-[36rem] md:top-0 md:left-[36%] md:h-auto">
        <motion.div
          animate={tampilDemo ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 90, scale: 0.94 }}
          transition={tampilDemo ? { duration: 0.9, ease: lembut } : { duration: 0.6, ease: [0.5, 0, 0.75, 0] }}
          className="absolute inset-0"
        >
          <div style={{ transform: "translate(-50%, -50%) rotate(-9deg) rotateX(10deg) rotateY(-6deg)" }} className="absolute top-1/2 left-1/2 flex h-[170%] gap-2.5 sm:gap-4 md:left-[55%]">
            {kolom.map((k, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: k.turun ? -90 : 90 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: lembut, delay: 0.15 + Math.abs(i - 2.5) * 0.1 }}
                className={`shrink-0 ${k.lebar ? "w-44 sm:w-64 lg:w-72" : "w-[5.5rem] sm:w-32 lg:w-36"} ${k.geser}`}
              >
                <div className={`dinding-jalur flex flex-col ${k.turun ? "[animation-direction:reverse]" : ""}`} style={{ animationDuration: `${k.lama}s` } as CSSProperties}>
                  <Set isi={k.isi} eagerHingga={k.lebar ? 0 : 2} />
                  <Set isi={k.isi} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* lapisan teks di atas dinding */}
      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:min-h-184 md:grid-cols-[1.1fr_1fr] md:gap-12 xl:grid-cols-[1fr_1.15fr]">
        <div className="pt-28 md:self-center md:pt-32 md:pb-24">{children}</div>

        <div className="pointer-events-none relative h-[22rem] sm:h-[28rem] md:h-auto">
          {/* babak maskot */}
          <div className="absolute inset-0 flex items-center justify-center pt-10 md:pt-24" aria-hidden="true">
            <AnimatePresence>{babak === "maskot" && <BabakMaskot key={putaran} putaran={putaran} />}</AnimatePresence>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

// Satu set kartu dalam kolom; isinya dirender dua kali supaya putarannya nyambung
function Set({ isi, eagerHingga = 0 }: { isi: Kartu[]; eagerHingga?: number }) {
  return (
    <div className="flex flex-col gap-2.5 pb-2.5 sm:gap-4 sm:pb-4">
      {isi.map((k, i) => (
        <div key={`${k.src}-${i}`}>
          {k.bentuk === "hp" && <KartuHp k={k} eager={i < eagerHingga} />}
          {k.bentuk === "web" && <KartuWeb k={k} eager={i < eagerHingga} />}
          {k.bentuk === "trio" && <KartuTrio k={k} eager={i < eagerHingga} />}
        </div>
      ))}
    </div>
  );
}

// label nama demo yang menempel di kartu
function Label({ k }: { k: Kartu }) {
  return (
    <span className="absolute bottom-1.5 left-1.5 flex max-w-[calc(100%-0.75rem)] items-center gap-1 rounded-full bg-white/95 py-0.5 pr-1.5 pl-1 text-[8px] font-bold text-ink shadow-sm sm:bottom-2 sm:left-2 sm:gap-1.5 sm:py-1 sm:pr-2 sm:pl-1.5 sm:text-[11px]">
      <span className="size-1.5 shrink-0 rounded-full sm:size-2" style={{ background: k.tone?.accent ?? "var(--color-brand)" }} />
      <span className="truncate">{k.nama}</span>
    </span>
  );
}

const bayang = "shadow-[0_22px_40px_-20px_rgb(21_19_43/0.45)]";

function KartuHp({ k, eager }: { k: Kartu; eager: boolean }) {
  return (
    <div className={`rounded-[1rem] bg-ink p-[3px] sm:rounded-[1.4rem] sm:p-1 ${bayang}`}>
      <div className="relative aspect-[1/2] overflow-hidden rounded-[0.8rem] bg-lilac-soft sm:rounded-[1.1rem]">
        <Image src={k.src} alt="" fill sizes="(min-width: 1024px) 144px, (min-width: 640px) 128px, 88px" loading={eager ? "eager" : "lazy"} className="object-cover object-top" />
        <Label k={k} />
      </div>
    </div>
  );
}

function KartuWeb({ k, eager }: { k: Kartu; eager: boolean }) {
  return (
    <div className={`rounded-2xl bg-white p-1.5 ${bayang}`}>
      <div className="flex items-center gap-1 px-1 pb-1.5">
        <span className="size-1.5 shrink-0 rounded-full bg-[#ff6159]" />
        <span className="size-1.5 shrink-0 rounded-full bg-[#ffbd2e]" />
        <span className="size-1.5 shrink-0 rounded-full bg-[#28c840]" />
        <span className="ml-1 truncate rounded-full bg-lilac-soft px-2 py-px text-[9px] font-medium text-ink/50 sm:text-[10px]">{k.url}</span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-lilac-soft">
        <Image src={k.src} alt="" fill sizes="(min-width: 1024px) 288px, (min-width: 640px) 256px, 176px" loading={eager ? "eager" : "lazy"} className="object-cover object-top" />
        <Label k={k} />
      </div>
    </div>
  );
}

// undangan tiga layar (sampul di tengah) di atas warna temanya
function KartuTrio({ k, eager }: { k: Kartu; eager: boolean }) {
  const layar = [k.screens?.[0], k.src, k.screens?.[1]];
  return (
    <div className={`relative aspect-[16/12] overflow-hidden rounded-2xl ${bayang}`} style={{ background: k.tone?.bg }}>
      <div className="absolute inset-x-0 top-[9%] flex justify-center">
        {layar.map((src, i) =>
          src ? (
            <div
              key={src}
              className={`relative aspect-[1/2] w-[27%] overflow-hidden rounded-lg border-2 border-ink bg-ink shadow-lg sm:rounded-xl sm:border-[3px] ${
                i === 1 ? "z-10 -mt-[3%]" : i === 0 ? "translate-x-[22%] translate-y-[6%] -rotate-[8deg]" : "-translate-x-[22%] translate-y-[6%] rotate-[8deg]"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" loading={eager ? "eager" : "lazy"} className="object-cover object-top" />
            </div>
          ) : null,
        )}
      </div>
      <Label k={k} />
    </div>
  );
}

// ——— babak maskot ———

// urutan pose Webi dalam satu babak (ms sejak maskot muncul); gelembung 0/1 = kalimat pertama/kedua
const POSE = ["kaget", "melambai", "kedip", "semangat"] as const satisfies readonly Mood[];
const adegan: { t: number; pose: (typeof POSE)[number]; gelembung?: 0 | 1 }[] = [
  { t: 0, pose: "kaget" },
  { t: 1100, pose: "melambai", gelembung: 0 },
  { t: 2500, pose: "kedip", gelembung: 0 },
  { t: 3500, pose: "semangat", gelembung: 1 },
];
// kalimatnya berganti tiap putaran
const kalimat: [string, string][] = [
  ["Psst… lagi cari undangan?", "Yuk webkeun!"],
  ["Mau website buat usaha?", "Webkeun aja!"],
  [`Sudah lihat ${templates.length} demonya?`, "Konsultasi gratis, kok!"],
];
// percikan titik saat semangat
const percikan = [
  { x: -88, y: -40, c: "bg-mint size-4" },
  { x: 84, y: -52, c: "bg-brand size-3.5" },
  { x: -52, y: -96, c: "bg-white size-3" },
  { x: 60, y: -104, c: "bg-mint size-3" },
  { x: -104, y: 12, c: "bg-brand size-2.5" },
  { x: 100, y: 4, c: "bg-white size-2.5" },
];

function BabakMaskot({ putaran }: { putaran: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const ts = adegan.slice(1).map((a, i) => setTimeout(() => setN(i + 1), a.t));
    return () => ts.forEach(clearTimeout);
  }, []);
  const { pose, gelembung } = adegan[n];
  const teks = gelembung === undefined ? null : kalimat[putaran % kalimat.length][gelembung];

  return (
    <motion.div
      className="relative w-44 sm:w-52 md:w-60"
      initial={{ y: "130%", opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 210, damping: 13, delay: 0.35 } }}
      exit={{ y: "130%", opacity: 0, transition: { duration: 0.5, ease: [0.5, 0, 0.75, 0] } }}
    >
      {/* gelembung celoteh; z-20 supaya selalu di depan tubuh maskot & percikannya */}
      <div className="absolute bottom-full left-1/2 z-20 mb-6 -translate-x-1/2">
        <AnimatePresence mode="wait">
          {teks && (
            <motion.p
              key={teks}
              initial={{ opacity: 0, y: 10, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className={`relative rounded-2xl px-4 py-2.5 text-sm font-bold whitespace-nowrap shadow-[0_14px_30px_-14px_rgb(21_19_43/0.5)] sm:text-base ${
                gelembung === 1 ? "bg-brand text-white" : "bg-white text-ink"
              }`}
            >
              {teks}
              <span className={`absolute top-full left-1/2 size-3 -translate-x-1/2 -translate-y-1.5 rotate-45 ${gelembung === 1 ? "bg-brand" : "bg-white"}`} />
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* percikan & hati saat semangat */}
      <AnimatePresence>
        {pose === "semangat" &&
          percikan.map((p, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 1, 0], x: p.x, y: p.y, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: "easeOut", delay: i * 0.04 }}
              className={`absolute top-[22%] left-1/2 rounded-full ${p.c}`}
            />
          ))}
        {pose === "semangat" &&
          [-30, 10, 40].map((dx, i) => (
            <motion.span
              key={`h${dx}`}
              initial={{ opacity: 0, x: dx * 0.3, y: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], x: dx, y: -80 - i * 14, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, delay: 0.2 + i * 0.15, ease: "easeOut" }}
              className="absolute top-0 left-1/2 text-2xl leading-none text-mint"
            >
              ♥
            </motion.span>
          ))}
      </AnimatePresence>

      {/* tubuh: kaget = melompat, semangat = bergoyang, selainnya bernapas. Semua pose dimuat sekaligus dan ditumpuk,
          supaya tidak berkedip kosong saat berganti. */}
      <motion.div
        key={pose}
        className="relative origin-bottom"
        animate={
          pose === "kaget"
            ? { y: [0, -26, 0, -8, 0], scaleY: [1, 1.08, 0.9, 1.03, 1], scaleX: [1, 0.94, 1.08, 0.98, 1] }
            : pose === "semangat"
              ? { rotate: [0, -5, 5, -4, 4, -2, 0], scaleY: [1, 0.96, 1.03, 0.97, 1.02, 1, 1] }
              : { scaleY: [1, 1.03, 1], scaleX: [1, 0.99, 1] }
        }
        transition={
          pose === "kaget" ? { duration: 0.8, ease: "easeOut", delay: 0.45 } : pose === "semangat" ? { duration: 1.2, ease: "easeInOut" } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <div className="grid drop-shadow-[0_18px_26px_rgb(21_19_43/0.3)]">
          {POSE.map((p) => (
            <Mascot key={p} mood={p} eager className={`col-start-1 row-start-1 h-auto w-full ${p === pose ? "" : "opacity-0"}`} />
          ))}
        </div>
      </motion.div>

      {/* bayangan di lantai */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { delay: 0.55, duration: 0.4 } }}
        className="mx-auto mt-4 h-5 w-3/4 rounded-full bg-[radial-gradient(closest-side,rgb(21_19_43/0.3),transparent)]"
      />
    </motion.div>
  );
}
