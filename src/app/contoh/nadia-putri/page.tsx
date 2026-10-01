import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { DemoBanner } from "@/components/demo-banner";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-instrument" });

export const metadata: Metadata = {
  title: "Demo: Nadia Putri",
  robots: { index: false },
};

const works = [
  ["Rebranding Toko Roti Ibu", "Identitas visual", "bg-[#ff6b4a]", "md:col-span-2"],
  ["Aplikasi Kasir Warung", "UI/UX", "bg-[#1f1f1f]", ""],
  ["Kemasan Sambal Mamah", "Packaging", "bg-[#ffd23f]", ""],
  ["Poster Festival Kota", "Ilustrasi", "bg-[#7bc4c4]", "md:col-span-2"],
];

export default function NadiaPutri() {
  return (
    <div className={`${instrument.variable} min-h-screen bg-white text-[#1f1f1f]`}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm">
        <span className="font-semibold">Nadia Putri</span>
        <span className="flex items-center gap-2 text-[#1f1f1f]/60">
          <span className="size-2 rounded-full bg-[#3ccf6e]" />
          Terbuka untuk proyek baru
        </span>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <h1 className="font-[family-name:var(--font-instrument)] text-6xl leading-[0.95] md:text-[8.5rem]">
          Desainer grafis yang suka bikin brand kecil terlihat <em className="text-[#ff6b4a]">besar.</em>
        </h1>
        <div className="mt-12 flex flex-col gap-6 border-t border-[#1f1f1f] pt-6 text-[#1f1f1f]/70 md:flex-row md:justify-between">
          <p className="max-w-md">
            5 tahun membantu UMKM dan startup di Indonesia lewat identitas visual, kemasan, dan desain antarmuka.
          </p>
          <p>Yogyakarta · nadia@contoh.com</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-32">
        <h2 className="mb-6 text-sm font-semibold tracking-[0.2em] uppercase">Karya pilihan</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {works.map(([t, k, bg, span]) => (
            <div key={t} className={span}>
              <div className={`aspect-[4/3] rounded-xl ${bg} ${span ? "md:aspect-[8/3]" : ""}`} />
              <div className="mt-3 flex justify-between text-sm">
                <span className="font-semibold">{t}</span>
                <span className="text-[#1f1f1f]/50">{k}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <DemoBanner name="portofolio Nadia Putri" />
    </div>
  );
}
