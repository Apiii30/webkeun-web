"use client";

import { AnimatePresence, motion, MotionConfig } from "motion/react";
import Image from "next/image";
import { useCallback, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";
import { DaftarTamu } from "./daftar-tamu";
import type { BalasanTamu, TamuUndangan } from "./rekap";
import { DaftarUcapan } from "./ucapan";

// Halaman rekap pengantin (isi /rekap/<slug>): ringkasan, tab Daftar tamu (kirim undangan lewat WhatsApp) &
// Ucapan (balasan RSVP). Data awal dari server; perubahan disimpan lewat server action (rekap-aksi.ts) dan langsung
// diperbarui di layar tanpa memuat ulang halaman.

type Tab = "tamu" | "ucapan";
const tanpaLangganan = () => () => {};

export function RekapApp({
  slug,
  kunci,
  nama,
  tamuAwal,
  pesanAwal,
  balasanAwal,
}: {
  slug: string;
  kunci: string;
  nama: string;
  tamuAwal: TamuUndangan[] | "belum" | "gagal";
  pesanAwal: string | null;
  balasanAwal: BalasanTamu[];
}) {
  const asal = useSyncExternalStore(
    tanpaLangganan,
    () => location.origin,
    () => "",
  );
  const [tab, setTab] = useState<Tab>("tamu");
  const [tamu, setTamu] = useState<TamuUndangan[]>(Array.isArray(tamuAwal) ? tamuAwal : []);
  const [balasan, setBalasan] = useState(balasanAwal);
  const [notif, setNotif] = useState<{ id: number; teks: string; galat: boolean } | null>(null);

  const kabar = useCallback((teks: string, galat = false) => {
    const id = Date.now();
    setNotif({ id, teks, galat });
    setTimeout(() => setNotif((n) => (n?.id === id ? null : n)), 2600);
  }, []);

  const terkirim = tamu.filter((t) => t.terkirim).length;
  const hadir = balasan.filter((b) => b.hadir).length;
  const angka = [
    { label: "Undangan terkirim", nilai: `${terkirim}`, sub: tamu.length ? `dari ${tamu.length} tamu` : "belum ada tamu", bar: tamu.length ? terkirim / tamu.length : 0 },
    { label: "Membalas RSVP", nilai: `${balasan.length}`, sub: "tamu" },
    { label: "Akan hadir", nilai: `${hadir}`, sub: "tamu", warna: "text-mint" },
    { label: "Tidak hadir", nilai: `${balasan.length - hadir}`, sub: "tamu", warna: "text-[#f5a3b5]" },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <main className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 sm:py-8">
        {/* kepala: nama pengantin & ringkasan */}
        <header className="relative overflow-hidden rounded-[2rem] bg-ink p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-[radial-gradient(closest-side,rgb(91_61_245/0.55),transparent)]" aria-hidden="true" />
          <svg viewBox="0 0 100 100" className="pointer-events-none absolute top-6 right-[38%] hidden w-6 text-mint sm:block" aria-hidden="true">
            <path d="M50 0 C53 36 64 47 100 50 C64 53 53 64 50 100 C47 64 36 53 0 50 C36 47 47 36 50 0Z" fill="currentColor" />
          </svg>

          <div className="relative flex items-center justify-between gap-3">
            <Image src="/brand/logo-wk-putih.svg" alt="Webkeun" width={40} height={28} />
            <a
              href={`/u/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 transition-colors hover:bg-white/20"
            >
              Lihat undangan
              <Icon name="arrow" className="size-4 -rotate-45" strokeWidth={2.5} />
            </a>
          </div>

          <p className="relative mt-8 text-xs font-bold tracking-[0.16em] text-mint uppercase">Rekap undangan</p>
          <h1 className="relative mt-1.5 text-[2.2rem] leading-[1.05] font-bold tracking-[-0.02em] sm:text-5xl">{nama}</h1>
          <p className="relative mt-2 max-w-lg text-white/60">Kirim undangan ke tiap tamu dan pantau siapa saja yang akan hadir, semuanya dari halaman ini.</p>

          <dl className="relative mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {angka.map((a) => (
              <div key={a.label} className="rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10">
                <dt className="text-xs font-semibold text-white/55">{a.label}</dt>
                <dd className="mt-1">
                  <span className={`text-3xl font-bold tabular-nums ${a.warna ?? ""}`}>{a.nilai}</span>
                  <span className="ml-1.5 text-sm text-white/45">{a.sub}</span>
                </dd>
                {a.bar !== undefined && (
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div className="h-full rounded-full bg-mint" initial={false} animate={{ width: `${a.bar * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
                  </div>
                )}
              </div>
            ))}
          </dl>
        </header>

        {/* tab */}
        <div className="sticky top-3 z-30 mt-5 flex justify-center">
          <div role="tablist" aria-label="Bagian rekap" className="flex rounded-full bg-white/90 p-1.5 shadow-[0_12px_30px_-14px_rgb(21_19_43/0.4)] ring-1 ring-ink/10 backdrop-blur">
            {(
              [
                ["tamu", "Daftar tamu", tamu.length],
                ["ucapan", "Ucapan & RSVP", balasan.length],
              ] as const
            ).map(([k, label, n]) => (
              <button
                key={k}
                type="button"
                role="tab"
                id={`tab-${k}`}
                aria-selected={tab === k}
                aria-controls={`panel-${k}`}
                onClick={() => setTab(k)}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors sm:px-6 ${tab === k ? "text-white" : "text-ink/60 hover:text-ink"}`}
              >
                {tab === k && <motion.span layoutId="rekap-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">{label}</span>
                <span className={`relative rounded-full px-1.5 text-xs tabular-nums ${tab === k ? "bg-white/20" : "bg-ink/[0.06]"}`}>{n}</span>
              </button>
            ))}
          </div>
        </div>

        <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-6">
          {tab === "tamu" ? (
            tamuAwal === "belum" || tamuAwal === "gagal" ? (
              <p className="rounded-[1.75rem] bg-lilac-soft p-6 text-ink/70">
                {tamuAwal === "belum" ? "Daftar tamu belum disiapkan di database. Hubungi Webkeun supaya fitur ini diaktifkan." : "Daftar tamu gagal dimuat. Muat ulang halaman ini sebentar lagi."}
              </p>
            ) : (
              <DaftarTamu slug={slug} kunci={kunci} asal={asal} tamu={tamu} setTamu={setTamu} balasan={balasan} pesanAwal={pesanAwal} kabar={kabar} />
            )
          ) : (
            <DaftarUcapan slug={slug} kunci={kunci} balasan={balasan} setBalasan={setBalasan} kabar={kabar} />
          )}
        </div>

        <p className="mt-12 text-center text-xs text-ink/40">
          Halaman ini khusus untuk kalian berdua. Jangan bagikan link-nya ke tamu. · Dibuat oleh <span className="font-semibold">Webkeun</span>
        </p>
      </main>

      {/* notifikasi kecil */}
      <AnimatePresence>
        {notif && (
          <motion.p
            key={notif.id}
            role="status"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className={`fixed top-4 left-1/2 z-50 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-[0_16px_32px_-12px_rgb(21_19_43/0.5)] ${notif.galat ? "bg-[#c2334f] text-white" : "bg-ink text-white"}`}
          >
            <Icon name={notif.galat ? "close" : "check"} className={`size-4 shrink-0 ${notif.galat ? "" : "text-mint"}`} strokeWidth={3} />
            {notif.teks}
          </motion.p>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
