import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { DemoBanner } from "@/components/demo-banner";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });

export const metadata: Metadata = {
  title: "Template: Arunika Konstruksi",
  robots: { index: false },
};

const services = [
  ["Konstruksi gedung", "Kantor, ruko, gudang, dan fasilitas pendidikan, dari desain struktur sampai serah terima."],
  ["Renovasi & interior", "Perbaikan dan pembaruan bangunan dengan gangguan seminimal mungkin untuk operasional Anda."],
  ["Manajemen proyek", "Pengawasan jadwal, anggaran, dan mutu supaya proyek selesai sesuai rencana."],
];

const projects = [
  ["Gedung Kantor 4 Lantai", "Cimahi", "bg-[#d9a441]"],
  ["Gudang Logistik", "Karawang", "bg-[#4f7a94]"],
  ["Gedung Sekolah", "Sumedang", "bg-[#8aa1ad]"],
];

export default function ArunikaKonstruksi() {
  return (
    <div
      className={`${archivo.variable} min-h-screen bg-[#f4f6f7] font-[family-name:var(--font-archivo)] text-[#0f2a3d]`}
    >
      <header className="bg-[#0f2a3d] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="flex items-center gap-3 text-lg font-bold tracking-wide">
            <span className="grid size-9 place-items-center bg-[#d9a441] font-black text-[#0f2a3d]">A</span>
            ARUNIKA
          </span>
          <nav className="hidden gap-8 text-sm sm:flex">
            <a href="#layanan">Layanan</a>
            <a href="#proyek">Proyek</a>
            <a href="#kontak">Kontak</a>
          </nav>
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-16 pb-24">
          <p className="text-sm font-semibold tracking-[0.25em] text-[#d9a441] uppercase">PT Arunika Konstruksi</p>
          <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] font-extrabold tracking-tight md:text-7xl">
            Membangun dengan presisi, sejak fondasi.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Kontraktor umum untuk bangunan komersial dan publik di Jawa Barat.
          </p>
          <div className="mt-14 grid max-w-2xl grid-cols-3 border-t border-white/20 pt-8">
            {[
              ["12+", "tahun pengalaman"],
              ["80+", "proyek selesai"],
              ["0", "kecelakaan kerja 2025"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="text-4xl font-extrabold text-[#d9a441]">{n}</p>
                <p className="mt-1 text-sm text-white/60">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section id="layanan" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-extrabold md:text-4xl">Layanan kami</h2>
        <div className="mt-10 grid gap-px bg-[#0f2a3d]/15 md:grid-cols-3">
          {services.map(([t, d], i) => (
            <div key={t} className="bg-[#f4f6f7] p-8 md:first:pl-0">
              <p className="text-sm font-bold text-[#d9a441]">0{i + 1}</p>
              <h3 className="mt-3 text-xl font-bold">{t}</h3>
              <p className="mt-3 text-[#0f2a3d]/70">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="proyek" className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-extrabold md:text-4xl">Proyek terbaru</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {projects.map(([t, loc, bg]) => (
              <div key={t}>
                <div className={`aspect-[4/3] ${bg}`} />
                <h3 className="mt-4 text-lg font-bold">{t}</h3>
                <p className="text-sm text-[#0f2a3d]/60">{loc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="kontak"
        className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-20 pb-32 md:flex-row md:items-center md:justify-between"
      >
        <h2 className="max-w-lg text-3xl font-extrabold md:text-4xl">
          Punya rencana pembangunan? Diskusikan dengan tim kami.
        </h2>
        <span className="bg-[#d9a441] px-7 py-4 font-bold">Hubungi kami</span>
      </section>

      <DemoBanner name="Arunika Konstruksi" />
    </div>
  );
}
