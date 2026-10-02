import Link from "next/link";
import { waLink } from "@/lib/site";

// Bar melayang di halaman demo template: balik ke daftar template atau langsung pakai.
// compact: satu baris kecil selebar HP, untuk demo undangan yang tampilannya khusus HP.
export function DemoBanner({ name, compact }: { name: string; compact?: boolean }) {
  if (compact) {
    return (
      <div className="fixed inset-x-3 bottom-3 z-[70] mx-auto flex max-w-[416px] items-center gap-2 rounded-full bg-ink p-1.5 font-sans text-xs text-white shadow-[0_16px_32px_-12px_rgb(21_19_43/0.6)]">
        <Link
          href="/template"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          aria-label="Kembali ke daftar template"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 12H5M11 6l-6 6 6 6" />
          </svg>
        </Link>
        <p className="min-w-0 flex-1 truncate">
          <span className="font-bold text-mint">Template</span> · {name}
        </p>
        <a
          href={waLink(`Halo Webkeun! Aku mau pakai template ${name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-mint px-3.5 py-2 font-bold text-ink"
        >
          Pakai template ini
        </a>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 rounded-full bg-ink py-2 pr-2 pl-3 font-sans text-sm text-white shadow-[0_20px_40px_-16px_rgb(21_19_43/0.6)] max-sm:rounded-3xl max-sm:p-3">
      <div className="flex items-center gap-3">
        <Link
          href="/template"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          aria-label="Kembali ke daftar template"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 12H5M11 6l-6 6 6 6" />
          </svg>
        </Link>
        <p>
          <span className="font-bold text-mint">Template</span> · {name} oleh{" "}
          <Link href="/" className="font-bold underline underline-offset-2">
            Webkeun
          </Link>
        </p>
      </div>
      <a
        href={waLink(`Halo Webkeun! Aku mau pakai template ${name} buat usahaku.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-mint px-4 py-2 font-bold text-ink max-sm:w-full max-sm:text-center"
      >
        Pakai template ini
      </a>
    </div>
  );
}
