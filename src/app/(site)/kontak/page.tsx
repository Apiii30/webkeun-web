import type { Metadata } from "next";
import Link from "next/link";
import { Badge, PillLink } from "@/components/brand";
import { Icon } from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { ContactForm } from "@/components/sections/contact-form";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontak",
  description: `Konsultasi gratis soal pembuatan website. Chat Webkeun lewat WhatsApp di ${site.whatsappDisplay}.`,
};

const prep = [
  "Nama usaha & apa yang kamu jual",
  "Contoh website yang kamu suka (kalau ada)",
  "Logo dan foto produk/usaha (kalau ada)",
  "Kisaran budget yang kamu siapkan",
];

export default function KontakPage() {
  return (
    <>
      <section className="bg-lilac">
        <div className="mx-auto max-w-6xl px-4 pt-32 pb-16 sm:px-6 md:pt-36 md:pb-20">
          <Badge>Kontak</Badge>
          <h1 className="mt-5 text-4xl leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]">
            Ngobrol dulu aja,
            <span className="block text-brand">gratis kok</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/70">
            Ceritain usaha kamu, nanti kami bantu tentuin website yang paling pas. Nggak ada kewajiban apa-apa.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1fr_1.35fr] lg:items-start">
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-3xl bg-brand p-7 text-white">
            <Mascot mood="kedip" className="absolute -right-5 -bottom-6 w-28 rotate-12 opacity-90" />
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-wa">
              <Icon name="whatsapp" className="size-6" />
            </span>
            <p className="mt-5 text-sm font-semibold text-white/70">WhatsApp</p>
            <p className="text-2xl font-bold tracking-tight">{site.whatsappDisplay}</p>
            <p className="mt-2 max-w-[15rem] text-white/80">Cara paling cepat buat tanya-tanya atau mulai pesan.</p>
            <PillLink href={waLink()} external tone="white" icon="whatsapp" className="mt-6">
              Chat sekarang
            </PillLink>
          </div>

          <div className="rounded-3xl bg-lilac-soft p-7">
            <h2 className="text-lg font-bold">Biar ngobrolnya lancar, siapkan ini</h2>
            <ul className="mt-4 space-y-3">
              {prep.map((p) => (
                <li key={p} className="flex items-start gap-3 text-ink/75">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint text-ink">
                    <Icon name="check" className="size-3" strokeWidth={3.5} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-ink/60">Belum lengkap juga nggak apa-apa, kita rapikan bareng.</p>
          </div>

          <Link
            href="/#faq"
            className="group flex items-center justify-between gap-4 rounded-3xl p-5 ring-1 ring-ink/10 transition-colors hover:bg-lilac-soft"
          >
            <span className="flex items-center gap-3">
              <Icon name="help" className="size-5 text-brand" />
              <span className="font-semibold">Lihat pertanyaan yang sering ditanyain</span>
            </span>
            <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>
        </div>

        <ContactForm />
      </section>
    </>
  );
}
