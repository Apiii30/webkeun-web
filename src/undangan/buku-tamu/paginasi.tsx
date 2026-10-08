"use client";

import { type RefObject, useState } from "react";
import { Icon } from "@/components/icons";

// Pagination daftar di halaman rekap (daftar tamu & ucapan): 10 per halaman. Kembali ke halaman 1 setiap saringan
// atau pencarian berubah; nomor halaman dijaga tetap valid kalau isinya berkurang (misalnya tamu dihapus).

export const PER_HALAMAN = 10;

export function usePaginasi<T>(isi: T[], kunciReset: string) {
  const [hal, setHal] = useState(1);
  const [kunci, setKunci] = useState(kunciReset);
  if (kunci !== kunciReset) {
    setKunci(kunciReset);
    setHal(1);
  }
  const total = Math.max(1, Math.ceil(isi.length / PER_HALAMAN));
  const h = Math.min(Math.max(1, hal), total);
  return { isi: isi.slice((h - 1) * PER_HALAMAN, h * PER_HALAMAN), hal: h, total, jumlah: isi.length, setHal };
}

// 1 … 4 5 6 … 12: halaman pertama, terakhir, dan tetangga halaman aktif
function nomor(hal: number, total: number): (number | "…")[] {
  const tampil = [...new Set([1, hal - 1, hal, hal + 1, total])].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  return tampil.flatMap((n, i) => (i && n - tampil[i - 1] > 1 ? ["…" as const, n] : [n]));
}

export function Paginasi({ hal, total, jumlah, setHal, gulirKe }: { hal: number; total: number; jumlah: number; setHal: (n: number) => void; gulirKe?: RefObject<HTMLElement | null> }) {
  if (total <= 1) return null;
  const ke = (n: number) => {
    setHal(n);
    gulirKe?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const kotak = "grid size-9 place-items-center rounded-full text-sm font-semibold tabular-nums transition-colors disabled:pointer-events-none disabled:opacity-35";

  return (
    <nav aria-label="Halaman" className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-ink/55 tabular-nums">
        {(hal - 1) * PER_HALAMAN + 1}–{Math.min(hal * PER_HALAMAN, jumlah)} dari {jumlah}
      </p>
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => ke(hal - 1)} disabled={hal === 1} aria-label="Halaman sebelumnya" className={`${kotak} text-ink/70 ring-1 ring-ink/10 hover:bg-lilac-soft`}>
          <Icon name="chevron" className="size-4 rotate-90" strokeWidth={2.5} />
        </button>
        {nomor(hal, total).map((n, i) =>
          n === "…" ? (
            <span key={`e${i}`} className="w-6 text-center text-ink/35">
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => ke(n)}
              aria-current={n === hal ? "page" : undefined}
              className={`${kotak} ${n === hal ? "bg-ink text-white" : "text-ink/70 hover:bg-lilac-soft"}`}
            >
              {n}
            </button>
          ),
        )}
        <button type="button" onClick={() => ke(hal + 1)} disabled={hal === total} aria-label="Halaman berikutnya" className={`${kotak} text-ink/70 ring-1 ring-ink/10 hover:bg-lilac-soft`}>
          <Icon name="chevron" className="size-4 -rotate-90" strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  );
}
