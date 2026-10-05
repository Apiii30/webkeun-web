"use client";

import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import Image from "next/image";
import { type PointerEvent, useRef, useState } from "react";
import { catatan, layanan, pameran, profil } from "./data";
import { JUDUL, MONO, SERIF } from "./gaya";
import { useDiam } from "./diam";
import s from "./laras.module.css";

// Header melayang. mix-blend-difference membuat teks putihnya otomatis gelap di atas kertas dan terang di
// atas foto/latar gelap, jadi satu header cukup untuk semua bagian.
export function Kepala() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <div className={`${MONO} flex items-center justify-between px-[4vw] py-5 text-[11px] tracking-[0.12em] uppercase md:text-xs`}>
        <a href="#atas" className={`${JUDUL} pointer-events-auto text-xl tracking-[0.02em] md:text-2xl`}>
          {profil.nama}
        </a>
        <nav className="pointer-events-auto hidden gap-8 md:flex">
          <a href="#seri">Seri</a>
          <a href="#potret">Potret</a>
          <a href="#tentang">Tentang</a>
          <a href="#layanan">Harga</a>
        </nav>
        <a href="#kontak" className="pointer-events-auto flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-white" />
          Kontak
        </a>
      </div>
    </header>
  );
}

export function Tentang() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bingkaiY = useTransform(p, [0, 1], ["9%", "-9%"]);
  const fotoY = useTransform(p, [0, 1], ["-10%", "10%"]);
  const stikerY = useTransform(p, [0, 1], ["60%", "-90%"]);
  const latarX = useTransform(p, [0, 1], ["-6%", "-30%"]);
  return (
    <section ref={ref} id="tentang" className="relative overflow-hidden bg-[#16130f] px-[4vw] py-24 text-[#ece5d8] md:py-36">
      <motion.p
        style={diam ? undefined : { x: latarX }}
        className={`${JUDUL} ${s.garis} pointer-events-none absolute top-6 left-0 text-[38vw] leading-none whitespace-nowrap text-[#ece5d8]/10 md:top-10 md:text-[24vw]`}
        aria-hidden="true"
      >
        Halo halo halo
      </motion.p>
      <div className="relative grid gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-[6vw]">
        <div className="relative">
          <motion.div style={diam ? undefined : { y: bingkaiY }} className="relative aspect-[4/5] overflow-hidden">
            <motion.div style={diam ? undefined : { y: fotoY }} className="absolute inset-x-0 -inset-y-[12%]">
              <Image src={profil.potretTentang.src} alt={profil.potretTentang.alt} fill sizes="(min-width: 768px) 42vw, 92vw" className="object-cover object-[50%_30%]" />
            </motion.div>
          </motion.div>
          <motion.p
            style={diam ? { rotate: -4 } : { y: stikerY, rotate: -4 }}
            className={`${MONO} absolute -right-1 bottom-0 bg-[#c9361f] px-3 py-2 text-[10px] leading-snug tracking-[0.08em] uppercase md:-right-8 md:text-[11px]`}
          >
            Foto: Dimas,
            <br />
            asisten yang sabar
          </motion.p>
        </div>

        <div className="md:pt-10">
          <p className={`${MONO} text-[11px] tracking-[0.12em] uppercase md:text-xs`}>
            <span className="text-[#c9361f]">●</span> Tentang saya
          </p>
          <h2 className={`${SERIF} mt-5 text-[3.4rem] leading-[0.95] md:text-[6vw]`}>Halo, saya Laras.</h2>
          <div className="mt-8 max-w-[52ch] space-y-4 text-[1.05rem] leading-relaxed text-[#ece5d8]/80 md:text-lg">
            <p>
              Saya mulai memotret pakai kamera film peninggalan bapak, di pasar dekat rumah. Sampai sekarang, cara kerja
              saya masih sama: datang lebih awal, ngobrol dulu, baru angkat kamera.
            </p>
            <p>
              Delapan tahun terakhir saya memotret untuk keluarga, UMKM, komunitas, dan beberapa media lokal. Yang saya
              cari selalu sama: orangnya terlihat seperti dirinya sendiri, bukan seperti sedang difoto.
            </p>
          </div>
          <dl className={`${MONO} mt-10 grid grid-cols-2 gap-x-6 gap-y-5 text-xs md:text-[13px]`}>
            {catatan.map(([k, v]) => (
              <div key={k} className="border-t border-[#ece5d8]/20 pt-3">
                <dt className="tracking-[0.12em] text-[#ece5d8]/50 uppercase">{k}</dt>
                <dd className="mt-1">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12">
            <p className={`${MONO} text-[11px] tracking-[0.12em] text-[#ece5d8]/50 uppercase md:text-xs`}>Pameran & cetak</p>
            <ul className="mt-3">
              {pameran.map(([th, judul, tempat]) => (
                <li key={judul} className="grid grid-cols-[3.5rem_1fr] gap-x-3 border-b border-[#ece5d8]/15 py-3 md:grid-cols-[4.5rem_1fr_auto]">
                  <span className={`${MONO} text-sm text-[#c9361f]`}>{th}</span>
                  <span>{judul}</span>
                  <span className={`${MONO} col-start-2 text-xs text-[#ece5d8]/50 uppercase md:col-start-3 md:text-[13px]`}>{tempat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// Daftar harga. Di laptop, foto contoh mengikuti kursor saat baris disorot dan miring mengikuti arah gerakannya.
export function Layanan() {
  const [aktif, setAktif] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28 });
  const sy = useSpring(y, { stiffness: 260, damping: 28 });
  const miring = useTransform(useVelocity(sx), [-1500, 1500], [-12, 12], { clamp: true });
  const ref = useRef<HTMLDivElement>(null);
  const gerak = (e: PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <section id="layanan" className="bg-[#ece5d8] px-[4vw] py-24 text-[#16130f] md:py-32">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className={`${MONO} text-[11px] tracking-[0.12em] uppercase md:text-xs`}>
            <span className="text-[#c9361f]">●</span> Layanan & harga
          </p>
          <h2 className={`${JUDUL} mt-5 text-[18vw] leading-[0.8] md:text-[10vw]`}>Mau dipotret?</h2>
        </div>
        <p className={`${SERIF} max-w-[26ch] text-2xl leading-tight md:pb-3 md:text-[2vw]`}>
          Semua harga sudah termasuk transport di Bandung Raya.
        </p>
      </div>

      <div ref={ref} onPointerMove={gerak} onPointerLeave={() => setAktif(null)} className="relative mt-14 md:mt-20">
        {layanan.map((l, i) => (
          <motion.div
            key={l.nama}
            onPointerEnter={(e) => e.pointerType === "mouse" && setAktif(i)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="group grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-3 border-t border-[#16130f] py-6 last:border-b md:grid-cols-[4rem_1.1fr_1fr_auto] md:gap-x-8 md:py-8"
          >
            <span className={`${MONO} text-xs text-[#c9361f] md:text-sm`}>0{i + 1}</span>
            <h3 className={`${JUDUL} text-[2.6rem] leading-[0.9] transition-transform duration-500 md:text-[4.4vw] md:group-hover:translate-x-3`}>{l.nama}</h3>
            <p className={`${MONO} text-right text-sm font-medium whitespace-nowrap md:order-last md:text-lg`}>{l.harga}</p>
            <p className="col-start-2 col-end-4 mt-2 max-w-[44ch] text-[15px] leading-relaxed text-[#16130f]/70 md:col-start-3 md:col-end-4 md:row-start-1 md:mt-0">
              {l.isi}
            </p>
          </motion.div>
        ))}

        {/* foto contoh yang mengikuti kursor */}
        <motion.div style={{ x: sx, y: sy, rotate: miring }} className="pointer-events-none absolute top-0 left-0 z-10 hidden md:block" aria-hidden="true">
          <AnimatePresence>
            {aktif !== null && (
              <motion.div
                key={aktif}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -top-[9.5rem] -left-[7.5rem] w-60 bg-[#f7f2e8] p-2.5 pb-8 shadow-[0_24px_50px_-20px_rgb(22_19_15/0.6)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={layanan[aktif].f.src} alt="" fill sizes="240px" className="object-cover" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export function Kontak() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const satu = useTransform(p, [0, 1], ["0%", "-28%"]);
  const dua = useTransform(p, [0, 1], ["-30%", "-4%"]);
  const ulang = (t: string) => Array.from({ length: 4 }, () => t).join(" ● ") + " ●";
  const wa = `https://wa.me/${profil.wa}?text=${encodeURIComponent("Halo Laras, aku mau tanya jadwal sesi foto.")}`;

  return (
    <section ref={ref} id="kontak" className="relative overflow-hidden bg-[#16130f] pt-24 pb-36 text-[#ece5d8] md:pt-32">
      <div aria-hidden="true" className={`${JUDUL} text-[22vw] leading-[0.86] whitespace-nowrap md:text-[13vw]`}>
        <motion.p style={diam ? undefined : { x: satu }} className="text-[#c9361f]">{ulang("Mari foto bareng")}</motion.p>
        <motion.p style={diam ? undefined : { x: dua }} className={s.garis}>
          {ulang("Tanya jadwal dulu")}
        </motion.p>
      </div>

      <div className="mt-16 grid gap-12 px-[4vw] md:mt-24 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className={`${MONO} flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase md:text-xs`}>
            <span className={`${s.kedip} size-2 rounded-full bg-[#c9361f]`} />
            {profil.slot}
          </p>
          <a
            href={`mailto:${profil.email}`}
            className={`${SERIF} mt-5 block text-[2.4rem] leading-none break-all underline decoration-[#c9361f] decoration-1 underline-offset-[0.18em] transition-colors hover:text-[#c9361f] md:text-[4.6vw] md:break-normal`}
          >
            {profil.email}
          </a>
        </div>
        <div className="flex flex-col gap-3 md:items-end md:justify-end">
          <a href={wa} target="_blank" rel="noopener noreferrer" className={`${MONO} flex items-center justify-between gap-6 bg-[#c9361f] px-5 py-4 text-sm tracking-[0.08em] uppercase transition-colors hover:bg-[#ece5d8] hover:text-[#16130f] md:w-80`}>
            Chat WhatsApp
            <svg viewBox="0 0 14 14" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M3 11 11 3M4.5 3H11v6.5" />
            </svg>
          </a>
          <a href={`https://instagram.com/${profil.instagram}`} target="_blank" rel="noopener noreferrer" className={`${MONO} flex items-center justify-between gap-6 border border-[#ece5d8] px-5 py-4 text-sm tracking-[0.08em] uppercase transition-colors hover:bg-[#ece5d8] hover:text-[#16130f] md:w-80`}>
            @{profil.instagram}
            <svg viewBox="0 0 14 14" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M3 11 11 3M4.5 3H11v6.5" />
            </svg>
          </a>
        </div>
      </div>

      <div className={`${MONO} mt-20 flex flex-wrap justify-between gap-3 border-t border-[#ece5d8]/20 px-[4vw] pt-5 text-[11px] tracking-[0.1em] uppercase md:text-xs`}>
        <span>© 2026 {profil.nama}</span>
        <span>{profil.kota}</span>
        <a href="#atas">Kembali ke atas ↑</a>
      </div>
    </section>
  );
}
