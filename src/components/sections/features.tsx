"use client";

import { animate, AnimatePresence, motion, MotionConfig, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { features } from "@/lib/site";
import { Badge, SectionHeading, Stabilo } from "../brand";
import { Icon } from "../icons";

// "Semua yang usaha kamu butuh, ada di dalamnya": sebuah website contoh (usahakamu.id) dirakit di depan mata.
// Saat section terlihat, fiturnya terpasang satu per satu: domain terketik, katalog & peta masuk, tombol WA muncul,
// hasil Google tampil, versi HP muncul, dst. Setelah itu tiap fitur bisa diklik untuk diperagakan lagi.
// Dengan "kurangi gerakan", semua fitur langsung terpasang.

type Kunci = (typeof features)[number]["icon"];
const pegas = { type: "spring", stiffness: 380, damping: 26 } as const;
const lembut = [0.16, 1, 0.3, 1] as const;
const JEDA = 950;
// warna aksen website contoh; berganti saat fitur "Bisa revisi" diperagakan
const AKSEN = ["#5b3df5", "#e8590c", "#0f8f74"];
const produk = [
  ["Kopi susu", "18rb", "linear-gradient(135deg,#c08552,#8c5a3c)"],
  ["Roti bakar", "15rb", "linear-gradient(135deg,#f2b880,#d98c4a)"],
  ["Brownies", "25rb", "linear-gradient(135deg,#6b4226,#3e2617)"],
] as const;

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const terlihat = useInView(ref, { amount: 0.35, once: true });
  const kurangiGerak = useReducedMotion();
  const [jumlah, setJumlah] = useState(0); // berapa fitur yang sudah terpasang
  const [aktif, setAktif] = useState(-1);
  const [putar, setPutar] = useState(0); // naik tiap kali fitur yang sama diperagakan ulang
  const otomatis = useRef(true);
  const n = kurangiGerak ? features.length : jumlah;

  // pasang fitur satu per satu
  useEffect(() => {
    if (!terlihat || kurangiGerak || !otomatis.current || jumlah >= features.length) return;
    const t = setTimeout(
      () => {
        setJumlah(jumlah + 1);
        setAktif(jumlah);
      },
      jumlah === 0 ? 400 : JEDA,
    );
    return () => clearTimeout(t);
  }, [terlihat, kurangiGerak, jumlah]);

  function pilih(i: number) {
    otomatis.current = false;
    setJumlah(features.length);
    setAktif(i);
    setPutar((p) => p + 1);
  }
  function rakitUlang() {
    otomatis.current = true;
    setAktif(-1);
    setJumlah(0);
  }

  const ada = (k: Kunci) => features.findIndex((f) => f.icon === k) < n;
  const sorot = (k: Kunci) => features[aktif]?.icon === k;
  const f = features[aktif];

  return (
    <MotionConfig reducedMotion="user">
      <section id="fitur" className="overflow-hidden bg-lilac-soft">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <div className="flex flex-col items-center text-center">
            <Badge>Sudah termasuk</Badge>
            <SectionHeading
              center
              className="mt-5"
              top="Semua yang usaha kamu butuh,"
              bottom={
                <>
                  ada <Stabilo>di dalamnya</Stabilo>
                </>
              }
            />
            <p className="mt-4 max-w-xl text-lg text-ink/70">Nggak perlu bayar tambahan buat hal-hal dasar. Lihat sendiri apa saja yang terpasang di website Webkeun.</p>
          </div>

          <div ref={ref} className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-10">
            <Rakitan ada={ada} sorot={sorot} putar={putar} />

            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-ink/60">
                  <span className="text-brand tabular-nums">{n}</span>/{features.length} fitur terpasang
                </p>
                {!kurangiGerak && (
                  <button type="button" onClick={rakitUlang} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-brand hover:bg-white">
                    <Icon name="play" className="size-3.5" strokeWidth={2.5} />
                    Rakit ulang
                  </button>
                )}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-lilac">
                <motion.div className="h-full origin-left rounded-full bg-brand" animate={{ scaleX: n / features.length }} transition={{ duration: 0.5, ease: lembut }} />
              </div>

              <ul className="mt-5 grid grid-cols-2 gap-2.5">
                {features.map((fi, i) => {
                  const on = i === aktif;
                  const pasang = i < n;
                  return (
                    <li key={fi.title}>
                      <button
                        type="button"
                        onClick={() => pilih(i)}
                        aria-pressed={on}
                        className={`flex h-full w-full items-center gap-2.5 rounded-2xl p-2.5 text-left text-sm font-bold transition-[background-color,box-shadow,color] duration-300 sm:p-3 ${
                          on ? "bg-white text-ink shadow-[0_16px_32px_-18px_rgb(91_61_245/0.6)] ring-2 ring-brand" : pasang ? "bg-white/70 text-ink hover:bg-white" : "bg-white/35 text-ink/45"
                        }`}
                      >
                        <span
                          className={`relative grid size-9 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${
                            on ? "bg-brand text-white" : pasang ? "bg-lilac text-brand" : "bg-ink/5 text-ink/35"
                          }`}
                        >
                          <Icon name={fi.icon} className="size-[18px]" />
                          <AnimatePresence>
                            {pasang && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, transition: pegas }}
                                exit={{ scale: 0 }}
                                className="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-mint text-ink ring-2 ring-white"
                              >
                                <Icon name="check" className="size-2.5" strokeWidth={4} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                        <span className="leading-snug">{fi.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 min-h-[6.5rem] rounded-2xl bg-ink p-5 text-white" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={f?.title ?? "awal"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                    {f ? (
                      <>
                        <p className="flex items-center gap-2 font-bold">
                          <Icon name={f.icon} className="size-4 text-mint" />
                          {f.title}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-white/75">{f.desc}</p>
                      </>
                    ) : (
                      <p className="text-sm text-white/70">Sebentar, websitenya lagi dirakit…</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

// ——— panggung: website contoh yang dirakit ———

type PropsRakitan = { ada: (k: Kunci) => boolean; sorot: (k: Kunci) => boolean; putar: number };

function Muncul({ tampil, children, className = "", style }: { tampil: boolean; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <AnimatePresence>
      {tampil && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: pegas }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
          className={className}
          style={style}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// bagian halaman yang "tumbuh" masuk ke dalam website
function Bagian({ id, tampil, children, sorot }: { id: Kunci; tampil: boolean; children: ReactNode; sorot: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {tampil && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1, transition: { duration: 0.5, ease: lembut } }}
          exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
          className="overflow-hidden"
          data-bagian={id}
        >
          <div className={`mx-2.5 mt-1.5 rounded-lg p-1.5 transition-shadow duration-300 sm:mx-3 ${sorot ? "shadow-[0_0_0_2px_var(--color-mint)]" : ""}`}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Rakitan({ ada, sorot, putar }: PropsRakitan) {
  const [warna, setWarna] = useState(0);
  const revisi = sorot("edit");
  useEffect(() => {
    if (!revisi) return;
    const t = setInterval(() => setWarna((w) => (w + 1) % AKSEN.length), 1100);
    return () => clearInterval(t);
  }, [revisi]);
  const aksen = AKSEN[warna];
  const cincin = (on: boolean) => (on ? "ring-2 ring-mint ring-offset-2 ring-offset-ink" : "");

  // halaman contoh menggulir sendiri ke bagian yang sedang diperagakan (katalog / peta), lalu kembali ke atas
  const layar = useRef<HTMLDivElement>(null);
  const [gulir, setGulir] = useState(0);
  const tujuan = sorot("pin") || sorot("whatsapp") ? "pin" : sorot("image") ? "image" : null;
  useEffect(() => {
    // tunggu bagian barunya selesai "tumbuh" dulu, baru diukur
    const t = setTimeout(() => {
      const wadah = layar.current;
      const el = tujuan && wadah?.querySelector<HTMLElement>(`[data-bagian="${tujuan}"]`);
      setGulir(el && wadah ? Math.max(0, el.offsetTop + el.offsetHeight + 6 - wadah.clientHeight) : 0);
    }, 550);
    return () => clearTimeout(t);
  }, [tujuan, putar]);

  return (
    <div
      className="relative aspect-[10/9] w-full overflow-hidden rounded-4xl bg-ink bg-[radial-gradient(rgb(255_255_255/0.09)_1px,transparent_1px)] [background-size:22px_22px] sm:aspect-[10/8]"
      style={{ "--aksen": aksen } as CSSProperties}
      aria-hidden="true"
    >
      <div className="absolute -top-24 -left-24 size-80 bg-[radial-gradient(closest-side,rgb(91_61_245/0.45),transparent)]" />

      {/* Cepat dibuka */}
      <Muncul
        tampil={ada("zap")}
        className={`absolute top-[5%] left-[6%] z-20 inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 text-[11px] font-bold text-ink transition-shadow sm:text-xs ${cincin(sorot("zap"))}`}
      >
        <Icon name="zap" className="size-3.5" strokeWidth={2.5} />
        Halaman ringan
      </Muncul>

      {/* jendela browser */}
      <div className="absolute top-[15%] bottom-[14%] left-[6%] flex w-[68%] flex-col overflow-hidden rounded-xl bg-white shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] sm:rounded-2xl">
        <div className="flex items-center gap-1 border-b border-ink/8 bg-[#f3f1fa] px-2 py-1.5 sm:gap-1.5 sm:px-2.5">
          <span className="size-1.5 rounded-full bg-[#ff6159] sm:size-2" />
          <span className="size-1.5 rounded-full bg-[#ffbd2e] sm:size-2" />
          <span className="size-1.5 rounded-full bg-[#28c840] sm:size-2" />
          <span
            className={`ml-1 flex h-4 min-w-0 flex-1 items-center gap-1 rounded-full bg-white px-2 text-[8px] font-semibold text-ink/65 transition-shadow sm:h-5 sm:text-[10px] ${sorot("globe") ? "shadow-[0_0_0_2px_var(--color-mint)]" : ""}`}
          >
            {ada("globe") ? (
              <>
                <Icon name="lock" className="size-2.5 shrink-0 text-[#0f8f74] sm:size-3" strokeWidth={2.5} />
                <Ketik key={putar + (sorot("globe") ? 1 : 0)} teks="usahakamu.id" />
              </>
            ) : (
              <span className="h-1.5 w-1/3 rounded-full bg-ink/10" />
            )}
          </span>
        </div>
        {/* garis muat cepat */}
        <div className="h-0.5 bg-transparent">
          {sorot("zap") && (
            <motion.div
              key={putar}
              className="h-full origin-left bg-mint"
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 1, opacity: [1, 1, 0] }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          )}
        </div>

        <div ref={layar} className="relative min-h-0 flex-1 overflow-hidden text-ink">
          <motion.div animate={{ y: -gulir }} transition={{ duration: 0.8, ease: lembut }}>
            {/* navigasi */}
            <div className="flex items-center justify-between px-2.5 pt-2 sm:px-3">
              <span className="flex items-center gap-1 text-[8px] font-extrabold sm:text-[10px]">
                <span className="size-2.5 rounded-full transition-colors duration-500 sm:size-3" style={{ background: "var(--aksen)" }} />
                Usaha Kamu
              </span>
              <span className="flex gap-1.5">
                <span className="h-1 w-5 rounded-full bg-ink/15" />
                <span className="h-1 w-5 rounded-full bg-ink/15" />
                <span className="h-1 w-5 rounded-full bg-ink/15" />
              </span>
            </div>
            {/* pembuka */}
            <div className="mx-2.5 mt-2 grid grid-cols-[1.6fr_1fr] items-center gap-2 rounded-lg bg-[#fbf6ef] p-2 sm:mx-3 sm:p-2.5">
              <div>
                <p className="text-[11px] leading-tight font-extrabold sm:text-sm">Kue & kopi rumahan</p>
                <span className="mt-1 block h-1 w-full rounded-full bg-ink/10" />
                <span className="mt-1 block h-1 w-2/3 rounded-full bg-ink/10" />
                <span className="mt-2 inline-flex rounded-full px-2 py-0.5 text-[7px] font-bold text-white transition-colors duration-500 sm:text-[9px]" style={{ background: "var(--aksen)" }}>
                  Pesan sekarang
                </span>
              </div>
              <div className="relative aspect-[5/4] overflow-hidden rounded-lg bg-[linear-gradient(160deg,#f6d6a8,#e9a46a)]">
                <span className="absolute top-[18%] right-[18%] size-[34%] rounded-full bg-[#fff3df]/80" />
                <span className="absolute inset-x-0 bottom-0 h-[38%] rounded-t-[50%] bg-[#8c5a3c]" />
              </div>
            </div>

            {/* katalog */}
            <Bagian id="image" tampil={ada("image")} sorot={sorot("image")}>
              <p className="text-[8px] font-extrabold sm:text-[10px]">Menu favorit</p>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {produk.map(([nama, harga, bg], k) => (
                  <motion.div key={`${nama}-${putar}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 + k * 0.08 } }} className="rounded-md bg-[#faf7f2] p-1">
                    <span className="block aspect-[2/1] rounded" style={{ background: bg }} />
                    <span className="mt-0.5 block truncate text-[7px] font-bold sm:text-[9px]">{nama}</span>
                    <span className="block text-[7px] font-bold transition-colors duration-500 sm:text-[8px]" style={{ color: "var(--aksen)" }}>
                      {harga}
                    </span>
                  </motion.div>
                ))}
              </div>
            </Bagian>

            {/* peta lokasi */}
            <Bagian id="pin" tampil={ada("pin")} sorot={sorot("pin")}>
              <div className="relative h-10 overflow-hidden rounded-md bg-[#e6efe2] sm:h-14">
                <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="absolute inset-0 size-full">
                  <path d="M-5 58 C40 50 70 66 110 52 S170 30 205 38" stroke="#fff" strokeWidth="7" fill="none" />
                  <path d="M62 -5 L78 85" stroke="#fff" strokeWidth="5" fill="none" />
                  <path d="M140 -5 C135 30 150 50 145 85" stroke="#fff" strokeWidth="4" fill="none" />
                  <path d="M-5 20 C30 26 50 14 90 22" stroke="#cfe0f0" strokeWidth="6" fill="none" />
                </svg>
                <motion.span
                  key={`pin-${putar}-${sorot("pin")}`}
                  initial={{ y: -28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 14, delay: 0.25 } }}
                  className="absolute top-[18%] left-[52%] -translate-x-1/2"
                >
                  <Icon name="pin" className="size-5 fill-[#ea4335] text-white sm:size-6" strokeWidth={1.5} />
                </motion.span>
                <span className="absolute bottom-1 left-1.5 rounded bg-white px-1 text-[7px] font-bold sm:text-[8px]">Petunjuk arah</span>
              </div>
            </Bagian>
          </motion.div>

          {/* tombol WhatsApp */}
          <Muncul
            tampil={ada("whatsapp")}
            className={`absolute right-2.5 bottom-2.5 z-10 grid size-7 place-items-center rounded-full bg-wa text-white shadow-lg sm:size-9 ${cincin(sorot("whatsapp"))}`}
          >
            <Icon name="whatsapp" className="size-4 sm:size-5" />
          </Muncul>
          <AnimatePresence>
            {sorot("whatsapp") && (
              <motion.p
                key={`wa-${putar}`}
                initial={{ opacity: 0, scale: 0.8, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { ...pegas, delay: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="absolute right-2.5 bottom-11 z-10 max-w-[70%] origin-bottom-right rounded-xl rounded-br-sm bg-[#d9fdd3] px-2 py-1.5 text-[8px] font-semibold shadow-md sm:bottom-14 sm:text-[10px]"
              >
                Halo kak, mau pesan 2 kopi susu ya 🙌
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* hasil Google */}
      <Muncul
        tampil={ada("search")}
        className={`absolute top-[5%] right-[4%] z-20 w-[44%] rounded-xl bg-white p-2 text-ink shadow-[0_20px_40px_-16px_rgb(0_0_0/0.6)] sm:p-2.5 ${cincin(sorot("search"))}`}
      >
        <div className="flex items-center gap-1.5 rounded-full bg-[#f1f3f4] px-2 py-1">
          <Icon name="search" className="size-2.5 text-ink/50 sm:size-3" strokeWidth={2.5} />
          <span className="truncate text-[7px] text-ink/70 sm:text-[9px]">kopi susu dekat sini</span>
        </div>
        <p className="mt-1.5 truncate text-[7px] text-ink/55 sm:text-[8px]">usahakamu.id › menu</p>
        <p className="truncate text-[9px] leading-tight font-semibold text-[#1a0dab] sm:text-[11px]">Usaha Kamu · Kue & Kopi Rumahan</p>
        <span className="mt-1 block h-1 w-full rounded-full bg-ink/10" />
        <span className="mt-0.5 block h-1 w-3/4 rounded-full bg-ink/10" />
      </Muncul>

      {/* versi HP */}
      <Muncul
        tampil={ada("phone")}
        className={`absolute right-[5%] bottom-[7%] z-20 w-[23%] rounded-[1.1rem] bg-[#0d0c14] p-1 shadow-[0_24px_40px_-14px_rgb(0_0_0/0.7)] ring-1 ring-white/15 ${cincin(sorot("phone"))}`}
      >
        <motion.div
          key={`hp-${putar}-${sorot("phone")}`}
          initial={{ rotate: sorot("phone") ? -12 : 0 }}
          animate={{ rotate: 0, transition: { type: "spring", stiffness: 300, damping: 12 } }}
          className="overflow-hidden rounded-[0.85rem] bg-white"
        >
          <div className="flex items-center gap-1 px-1.5 pt-2.5 pb-1">
            <span className="size-1.5 rounded-full transition-colors duration-500" style={{ background: "var(--aksen)" }} />
            <span className="h-1 w-8 rounded-full bg-ink/20" />
          </div>
          <div className="mx-1 rounded bg-[#fbf6ef] p-1.5">
            <span className="block h-1.5 w-4/5 rounded-full bg-ink/70" />
            <span className="mt-1 block h-1 w-full rounded-full bg-ink/10" />
            <span className="mt-1.5 block h-2 w-3/5 rounded-full transition-colors duration-500" style={{ background: "var(--aksen)" }} />
          </div>
          <div className="mx-1 mt-1 grid grid-cols-2 gap-1 pb-1.5">
            {produk.slice(0, 2).map(([nama, , bg]) => (
              <span key={nama} className="block aspect-square rounded" style={{ background: bg }} />
            ))}
          </div>
        </motion.div>
      </Muncul>

      {/* revisi warna */}
      <Muncul
        tampil={ada("edit")}
        className={`absolute bottom-[3.5%] left-[6%] z-20 flex items-center gap-2 rounded-full bg-white py-1.5 pr-3 pl-1.5 text-[10px] font-bold text-ink shadow-lg sm:text-xs ${cincin(revisi)}`}
      >
        <span className="flex -space-x-1">
          {AKSEN.map((a, k) => (
            <span key={a} className={`size-4 rounded-full ring-2 transition-transform duration-300 sm:size-5 ${k === warna ? "scale-110 ring-ink" : "ring-white"}`} style={{ background: a }} />
          ))}
        </span>
        {revisi ? "Ganti warna? Bisa!" : "Revisi"}
      </Muncul>
    </div>
  );
}

function Ketik({ teks }: { teks: string }) {
  const n = useMotionValue(0);
  const tampil = useTransform(n, (v) => teks.slice(0, Math.round(v)));
  useEffect(() => {
    const c = animate(n, teks.length, { duration: teks.length * 0.05, ease: "linear", delay: 0.15 });
    return () => c.stop();
  }, [teks, n]);
  return <motion.span className="truncate">{tampil}</motion.span>;
}
