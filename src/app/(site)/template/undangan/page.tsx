import type { Metadata } from "next";
import { halaman, katalogHarga, SITUS } from "@/lib/seo";
import { Badge, PillLink, SectionHeading } from "@/components/brand";
import { CoverFan } from "@/components/cover-fan";
import { Icon, type IconName } from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { templates, waLink } from "@/lib/site";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { UndanganGallery } from "@/components/sections/undangan-gallery";
import { Testimonials } from "@/components/sections/testimonials";

export const metadata: Metadata = halaman({
  judul: "Template Undangan Digital Pernikahan",
  deskripsi: "Undangan pernikahan digital mulai Rp99rb: nama tamu di tiap link, galeri foto, peta lokasi, RSVP, amplop digital, dan musik. Tinggal sebar lewat WhatsApp.",
  path: "/template/undangan",
});

// Galeri undangan dipisah dari template website karena pengunjungnya (calon pengantin), isi, dan cara pesannya beda.
// Harga paket undangan ada di src/lib/site.ts (hargaPaket.undangan), sama dengan yang tampil di beranda.

// Data terstruktur untuk Google: layanan undangan digital Webkeun beserta paket & harganya
const dataLayanan = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Undangan Digital Pernikahan",
  serviceType: "Undangan digital",
  url: `${SITUS.origin}/template/undangan`,
  areaServed: { "@type": "Country", name: "Indonesia" },
  provider: { "@id": `${SITUS.origin}/#organisasi` },
  hasOfferCatalog: katalogHarga("undangan", `${SITUS.origin}/template/undangan#harga`),
};

const undangan = templates.filter((t) => t.category === "undangan");
const pesan = "Halo Webkeun! Aku mau pesan undangan digital.";

// Fitur yang ada di semua tema
const fitur: [IconName, string][] = [
  ["user", "Nama tamu di tiap link"],
  ["clock", "Hitung mundur acara"],
  ["image", "Galeri & love story"],
  ["pin", "Peta lokasi acara"],
  ["heart", "RSVP & ucapan"],
  ["wallet", "Amplop digital & musik"],
];

const tanya = [
  {
    q: "Undangannya disebar gimana?",
    a: "Kamu dapat satu link undangan. Nama tamu bisa ditulis langsung di link-nya, jadi tiap tamu disapa dengan namanya sendiri waktu membuka undangan.",
  },
  {
    q: "Bisa pakai foto dan data kami sendiri?",
    a: "Bisa. Nama, tanggal, lokasi, foto, dan cerita kalian menggantikan isi contoh yang ada di demo.",
  },
  {
    q: "Harus dibuka dari HP?",
    a: "Undangan dibuat khusus untuk layar HP, karena kebanyakan tamu membukanya dari WhatsApp. Dibuka dari laptop pun tetap rapi di tengah layar.",
  },
  {
    q: "Harganya berapa?",
    a: "Mulai Rp99rb untuk paket Basic, Rp229rb untuk Premium, dan Rp499rb untuk Exclusive dengan desain custom. Rinciannya ada di bagian Harga di atas.",
  },
];

export default function UndanganPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dataLayanan).replace(/</g, "\\u003c") }} />
      <section className="overflow-hidden bg-[#fadde4]">
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pt-32 sm:px-6 md:grid-cols-[1.1fr_1fr] md:gap-10 md:pt-36">
          <div className="md:pb-16">
            <Badge>{undangan.length} tema undangan</Badge>
            <h1 className="mt-5 text-4xl leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]">
              Undangan digital
              <span className="block text-brand">tinggal sebar ke tamu</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/70">
              Satu link untuk semua tamu, dengan nama mereka tertulis di undangannya. Pilih temanya, kirim data acara kalian, sisanya kami yang siapkan.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <PillLink href="#tema" icon="chevron">
                Lihat semua tema
              </PillLink>
              <a href={waLink(pesan)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-ink/75 hover:text-brand">
                <Icon name="whatsapp" className="size-4 text-wa" />
                Tanya dulu
              </a>
            </div>
          </div>
          <CoverFan className="group h-80 sm:h-96 md:h-[28rem]" sizes="(min-width: 768px) 200px, 150px" />
        </div>
      </section>

      <section className="border-b border-ink/10">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-4 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:grid-cols-6">
          {fitur.map(([icon, label]) => (
            <li key={label} className="flex items-center gap-2.5 text-sm font-semibold">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#fadde4] text-[#b0415b]">
                <Icon name={icon} className="size-[18px]" />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </section>

      <section id="tema" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <SectionHeading top="Pilih tema," bottom="lihat demonya langsung" />
          <p className="inline-flex max-w-sm items-center gap-2 text-ink/60 md:justify-self-end">
            <Icon name="phone" className="size-4 shrink-0 text-brand" />
            Semua tema dibuat untuk HP, jadi paling terasa kalau demonya dibuka dari HP.
          </p>
        </div>
        <UndanganGallery />
      </section>

      <Pricing hanya="undangan" />

      <Process hanya="undangan" />

      <Testimonials />

      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHeading top="FAQ undangan" bottom="Yang sering ditanyain" />
          <dl className="mt-10 grid gap-x-14 gap-y-9 md:grid-cols-2">
            {tanya.map((f) => (
              <div key={f.q}>
                <dt className="text-lg font-bold">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-ink/70">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-4xl bg-brand px-7 py-12 text-white sm:px-12 md:grid-cols-[1.6fr_1fr] md:py-16">
          <div>
            <h2 className="text-4xl leading-[1.05] font-bold tracking-[-0.03em] sm:text-5xl">
              Udah naksir satu tema?
              <span className="block text-mint">Yuk, siapin undangannya.</span>
            </h2>
            <p className="mt-5 max-w-lg text-lg text-white/80">Kirim tema pilihan dan tanggal acara kalian. Kami bantu dari isi sampai link-nya siap disebar.</p>
            <PillLink href={waLink(pesan)} external tone="white" size="lg" icon="whatsapp" className="mt-8">
              Pesan lewat WhatsApp
            </PillLink>
          </div>
          <div className="relative mx-auto w-44 md:w-full md:max-w-56">
            <div className="absolute inset-4 rotate-6 rounded-4xl bg-white/15" aria-hidden="true" />
            <Mascot mood="kedip" className="relative w-full -rotate-6" />
          </div>
        </div>
      </section>
    </>
  );
}
