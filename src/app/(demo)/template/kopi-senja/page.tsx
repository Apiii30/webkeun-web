import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { DemoBanner } from "@/components/demo-banner";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Template: Kopi Senja",
  robots: { index: false },
};

const menu = [
  {
    cat: "Kopi",
    items: [
      ["Kopi Susu Senja", "22"],
      ["Americano", "20"],
      ["Cappuccino", "26"],
      ["V60 Manual Brew", "28"],
    ],
  },
  {
    cat: "Non-kopi",
    items: [
      ["Cokelat Panas", "24"],
      ["Teh Serai Madu", "18"],
      ["Matcha Latte", "27"],
    ],
  },
  {
    cat: "Teman ngopi",
    items: [
      ["Roti Bakar Srikaya", "18"],
      ["Pisang Goreng Keju", "20"],
      ["Croissant Mentega", "22"],
    ],
  },
];

export default function KopiSenja() {
  return (
    <div className={`${fraunces.variable} min-h-screen bg-[#f3e9dc] text-[#3b2418]`}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold italic">Kopi Senja</span>
        <nav className="hidden gap-8 text-sm font-semibold sm:flex">
          <a href="#menu">Menu</a>
          <a href="#lokasi">Lokasi</a>
        </nav>
        <a href="#lokasi" className="rounded-full bg-[#3b2418] px-5 py-2.5 text-sm font-semibold text-[#f3e9dc]">
          Pesan antar
        </a>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-10 pb-24 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-[#c8553d] uppercase">Sejak 2019 · Bandung</p>
          <h1 className="mt-5 font-[family-name:var(--font-fraunces)] text-6xl leading-[0.95] font-medium md:text-7xl">
            Kopi enak buat sore yang <em className="text-[#c8553d]">pelan.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#3b2418]/75">
            Biji kopi lokal dari Garut &amp; Pangalengan, disangrai sendiri setiap minggu. Duduk lama juga nggak
            apa-apa.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#menu" className="rounded-full bg-[#c8553d] px-6 py-3.5 font-semibold text-white">
              Lihat menu
            </a>
            <a href="#lokasi" className="rounded-full border-2 border-[#3b2418] px-6 py-3 font-semibold">
              Cara ke sini
            </a>
          </div>
        </div>

        {/* ilustrasi cangkir dari bentuk sederhana */}
        <div className="relative mx-auto aspect-square w-full max-w-md" aria-hidden="true">
          <div className="absolute inset-0 rounded-full bg-[#e6a15a]" />
          <div className="absolute inset-[18%] rounded-full bg-[#f3e9dc]" />
          <div className="absolute inset-[26%] rounded-full bg-[#5a3422]" />
          <div className="absolute inset-[36%] rounded-full bg-[#7a4a32]" />
          <div className="absolute top-[44%] left-[44%] h-[12%] w-[12%] rounded-full bg-[#f3e9dc]/80" />
          <div className="absolute top-[47%] -right-[4%] h-[14%] w-[16%] rounded-r-full border-[10px] border-l-0 border-[#f3e9dc]" />
        </div>
      </section>

      <section id="menu" className="bg-[#3b2418] text-[#f3e9dc]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-[family-name:var(--font-fraunces)] text-5xl font-medium">Menu</h2>
          <p className="mt-2 text-[#f3e9dc]/60">Harga dalam ribuan rupiah</p>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {menu.map((m) => (
              <div key={m.cat}>
                <h3 className="font-[family-name:var(--font-fraunces)] text-2xl text-[#e6a15a] italic">{m.cat}</h3>
                <ul className="mt-5 space-y-4">
                  {m.items.map(([name, price]) => (
                    <li key={name} className="flex items-baseline gap-2">
                      <span>{name}</span>
                      <span className="flex-1 border-b border-dotted border-[#f3e9dc]/30" />
                      <span className="font-semibold">{price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lokasi" className="mx-auto grid max-w-6xl gap-10 px-6 py-20 pb-32 md:grid-cols-3">
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-4xl font-medium">Mampir, yuk.</h2>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-[#c8553d] uppercase">Alamat</p>
          <p className="mt-3 text-lg">Jl. Contoh Senja No. 17, Coblong, Bandung</p>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-[#c8553d] uppercase">Jam buka</p>
          <p className="mt-3 text-lg">
            Senin–Jumat · 10.00–22.00
            <br />
            Sabtu–Minggu · 08.00–23.00
          </p>
        </div>
      </section>

      <DemoBanner name="Kopi Senja" />
    </div>
  );
}
