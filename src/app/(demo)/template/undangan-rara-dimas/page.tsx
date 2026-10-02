import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";
import type { ReactNode } from "react";
import { DemoBanner } from "@/components/demo-banner";
import { CopyButton, Countdown, RsvpWishes } from "./interaktif";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-vibes" });

export const metadata: Metadata = {
  title: "Template: Undangan Rara & Dimas",
  robots: { index: false },
};

const HARI_H = "2026-12-12T08:00:00+07:00";
const VENUE = "Gedung Contoh Bahagia, Jl. Contoh Raya No. 12, Bandung";

const calendarLink = `https://calendar.google.com/calendar/render?${new URLSearchParams({
  action: "TEMPLATE",
  text: "Pernikahan Rara & Dimas",
  dates: "20261212T010000Z/20261212T070000Z",
  location: VENUE,
})}`;
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE)}`;

const story = [
  ["2019", "Pertama ketemu", "Satu kepanitiaan acara kampus, awalnya cuma saling pinjam spidol."],
  ["2024", "Lamaran", "Disaksikan dua keluarga, di ruang tamu rumah Rara yang sederhana."],
  ["2026", "Hari bahagia", "Kami memutuskan melangkah bersama, dan ingin kamu ikut merayakannya."],
];

const serif = "font-[family-name:var(--font-cormorant)]";
const script = "font-[family-name:var(--font-vibes)]";

// Ranting daun sederhana untuk pemanis
function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 12h112" stroke="currentColor" strokeWidth="1" />
      {[22, 42, 62, 82].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 12c4-6 10-8 14-8-2 4-7 8-14 8Z`} fill="currentColor" opacity={0.75 - i * 0.1} />
          <path d={`M${x} 12c4 6 10 8 14 8-2-4-7-8-14-8Z`} fill="currentColor" opacity={0.55 - i * 0.08} />
        </g>
      ))}
      <circle cx="104" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

function Arch({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-t-full border border-[#b08d57]/60 p-2 ${className}`}>
      <div className="grid h-full place-items-center rounded-t-full bg-[#3d4a36] text-[#f7f2e8]">{children}</div>
    </div>
  );
}

function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="px-7 py-16 text-center">
      <Sprig className="mx-auto w-28 text-[#8a9a74]" />
      <h2 className={`${serif} mt-4 text-4xl font-semibold`}>{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default async function UndanganRaraDimas({ searchParams }: PageProps<"/template/undangan-rara-dimas">) {
  const to = (await searchParams).to;
  const tamu = (Array.isArray(to) ? to[0] : to)?.slice(0, 60) || "Bapak/Ibu/Saudara/i";

  return (
    <div className={`${cormorant.variable} ${vibes.variable} min-h-screen bg-[#e8e1d1] text-[#2f3a2c] lg:grid lg:grid-cols-[1fr_30rem]`}>
      {/* Desktop: sampul besar di kiri, isi undangan bergulir di kanan */}
      <aside className="sticky top-0 hidden h-screen flex-col items-center justify-center overflow-hidden bg-[#3d4a36] p-12 text-center text-[#f7f2e8] lg:flex">
        <div className="absolute inset-10 rounded-t-full border border-[#b08d57]/50" aria-hidden="true" />
        <p className="text-sm tracking-[0.35em] uppercase opacity-80">The Wedding of</p>
        <p className={`${script} mt-6 text-8xl xl:text-9xl`}>Rara & Dimas</p>
        <Sprig className="mt-8 w-40 text-[#b08d57]" />
        <p className={`${serif} mt-6 text-2xl italic`}>Sabtu, 12 Desember 2026</p>
      </aside>

      <main className="mx-auto w-full max-w-[30rem] bg-[#f7f2e8] shadow-2xl lg:max-w-none">
        {/* Sampul */}
        {/* pb ekstra di HP supaya tombol tidak tertutup bar demo di bawah */}
        <section className="flex min-h-svh flex-col items-center justify-center px-8 pt-16 pb-36 text-center lg:pb-16">
          <p className="text-xs tracking-[0.35em] uppercase opacity-70">The Wedding of</p>
          <Arch className="mt-8 h-64 w-48">
            <span className={`${script} text-6xl`}>R&D</span>
          </Arch>
          <h1 className={`${script} mt-8 text-6xl`}>Rara & Dimas</h1>
          <p className={`${serif} mt-3 text-xl italic`}>Sabtu, 12 Desember 2026</p>
          <div className="mt-10 rounded-2xl border border-[#3d4a36]/15 bg-white/60 px-8 py-4">
            <p className="text-xs tracking-wide opacity-60">Kepada Yth.</p>
            <p className={`${serif} mt-1 text-2xl font-semibold`}>{tamu}</p>
          </div>
          <a
            href="#pembuka"
            className="mt-8 rounded-full bg-[#3d4a36] px-7 py-3 text-sm font-medium text-[#f7f2e8] transition-colors hover:bg-[#2f3a2c]"
          >
            Buka undangan
          </a>
        </section>

        {/* Pembuka & mempelai */}
        <Section id="pembuka" title="Dengan penuh syukur">
          <p className="leading-relaxed opacity-80">
            Dengan memohon rahmat Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami:
          </p>
          <div className="mt-10 space-y-6">
            {[
              ["Rara Ayuningtyas", "Putri dari Bapak Hendra & Ibu Sari", "R"],
              ["Dimas Pratama", "Putra dari Bapak Agus & Ibu Wulan", "D"],
            ].map(([name, parents, initial], i) => (
              <div key={name}>
                {i === 1 && <p className={`${script} mb-6 text-5xl text-[#b08d57]`}>&</p>}
                <Arch className="mx-auto h-48 w-36">
                  <span className={`${script} text-6xl`}>{initial}</span>
                </Arch>
                <p className={`${serif} mt-4 text-3xl font-semibold`}>{name}</p>
                <p className="mt-1 text-sm opacity-70">{parents}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Hitung mundur */}
        <section className="bg-[#e8e1d1] px-7 py-14 text-center">
          <p className={`${serif} text-2xl italic`}>Menuju hari bahagia</p>
          <div className="mt-6">
            <Countdown target={HARI_H} />
          </div>
          <a
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full border border-[#3d4a36] px-6 py-2.5 text-sm font-medium transition-colors hover:bg-[#3d4a36] hover:text-[#f7f2e8]"
          >
            Simpan ke kalender
          </a>
        </section>

        {/* Acara */}
        <Section title="Rangkaian acara">
          <div className="space-y-4">
            {[
              ["Akad Nikah", "08.00 – 10.00 WIB"],
              ["Resepsi", "11.00 – 14.00 WIB"],
            ].map(([name, time]) => (
              <div key={name} className="rounded-3xl border border-[#3d4a36]/15 bg-white/60 px-6 py-7">
                <p className={`${serif} text-3xl font-semibold`}>{name}</p>
                <p className="mt-2 text-sm opacity-80">Sabtu, 12 Desember 2026</p>
                <p className="text-sm opacity-80">{time}</p>
              </div>
            ))}
            <div className="rounded-3xl bg-[#3d4a36] px-6 py-7 text-[#f7f2e8]">
              <p className="text-xs tracking-[0.25em] uppercase opacity-70">Lokasi</p>
              <p className={`${serif} mt-2 text-2xl font-semibold`}>Gedung Contoh Bahagia</p>
              <p className="mt-1 text-sm opacity-80">Jl. Contoh Raya No. 12, Bandung</p>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block rounded-full bg-[#f7f2e8] px-6 py-2.5 text-sm font-medium text-[#3d4a36]"
              >
                Buka Google Maps
              </a>
            </div>
          </div>
        </Section>

        {/* Galeri */}
        <Section title="Galeri">
          <div className="grid grid-cols-2 gap-2">
            {["row-span-2 bg-[#8a9a74]", "bg-[#c9b99a]", "bg-[#3d4a36]", "col-span-2 bg-[#b08d57]/70"].map((c, i) => (
              <div key={i} className={`${c} min-h-32 rounded-2xl`} />
            ))}
          </div>
          <p className="mt-3 text-xs opacity-60">Foto prewedding kalian tampil di sini</p>
        </Section>

        {/* Kisah */}
        <Section title="Kisah kami">
          <ol className="relative space-y-8 border-l border-[#b08d57]/50 pl-6 text-left">
            {story.map(([year, title, desc]) => (
              <li key={year} className="relative">
                <span className="absolute top-1.5 -left-[1.95rem] size-3 rounded-full bg-[#b08d57]" />
                <p className="text-xs tracking-[0.25em] opacity-60">{year}</p>
                <p className={`${serif} text-2xl font-semibold`}>{title}</p>
                <p className="mt-1 text-sm opacity-75">{desc}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* Amplop digital */}
        <section className="bg-[#e8e1d1] px-7 py-14 text-center">
          <h2 className={`${serif} text-4xl font-semibold`}>Amplop digital</h2>
          <p className="mt-3 text-sm opacity-75">Doa restu kamu sudah lebih dari cukup. Kalau ingin memberi tanda kasih:</p>
          <div className="mt-6 rounded-3xl bg-[#f7f2e8] px-6 py-6">
            <p className="text-xs tracking-[0.25em] uppercase opacity-60">Bank Contoh</p>
            <p className={`${serif} mt-2 text-3xl font-semibold tabular-nums`}>1234 5678 90</p>
            <p className="mt-1 text-sm opacity-75">a.n. Rara Ayuningtyas</p>
            <div className="mt-4">
              <CopyButton text="1234 5678 90" />
            </div>
          </div>
        </section>

        {/* RSVP */}
        <Section title="RSVP & ucapan">
          <RsvpWishes />
        </Section>

        {/* Penutup */}
        <section className="bg-[#3d4a36] px-8 pt-16 pb-28 text-center text-[#f7f2e8]">
          <p className="leading-relaxed opacity-85">
            Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          </p>
          <p className={`${script} mt-8 text-6xl`}>Rara & Dimas</p>
          <Sprig className="mx-auto mt-6 w-28 text-[#b08d57]" />
        </section>
      </main>

      <DemoBanner name="Undangan Rara & Dimas" />
    </div>
  );
}
