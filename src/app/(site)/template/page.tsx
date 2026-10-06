import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SectionHeading } from "@/components/brand";
import { CoverFan } from "@/components/cover-fan";
import { Icon } from "@/components/icons";
import { ClosingCta } from "@/components/sections/closing";
import { TemplateGallery, TemplateGalleryDariLink } from "@/components/sections/template-gallery";
import { templates } from "@/lib/site";

const steps = [
  { title: "Pilih template", desc: "Cari yang gayanya paling dekat sama usaha kamu." },
  { title: "Kirim materi", desc: "Logo, foto, dan info usaha. Belum lengkap? Kami bantu rapikan." },
  { title: "Kami sesuaikan", desc: "Warna & isi diganti sesuai brand kamu, lalu website online." },
];

const jumlahUndangan = templates.filter((t) => t.category === "undangan").length;

export const metadata: Metadata = {
  title: "Template Website",
  description: "Pilih template website UMKM, company profile, atau portofolio. Warna, foto, dan isinya kami sesuaikan buat kamu.",
};

// Halaman ini statis (dibuat sekali saat build). Kategori dari link (?kategori=umkm) dibaca galerinya di browser;
// link lama ?kategori=undangan diarahkan ke /template/undangan lewat next.config.ts.
export default function TemplatePage() {
  return (
    <>
      {/* HTML statisnya menampilkan semua template; kategori dari link dipilih begitu halaman jalan di browser */}
      <Suspense fallback={<TemplateGallery awal={null} />}>
        <TemplateGalleryDariLink />
      </Suspense>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-20">
        <Link
          href="/template/undangan"
          className="group grid overflow-hidden rounded-4xl bg-[#fadde4] transition-colors hover:bg-[#f8d3dc] md:grid-cols-[1.25fr_1fr]"
        >
          <div className="p-7 sm:p-10">
            <p className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.14em] text-[#b0415b] uppercase">
              <Icon name="heart" className="size-4" />
              Undangan digital
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-bold tracking-[-0.02em] sm:text-4xl">Lagi nyiapin pernikahan?</h2>
            <p className="mt-3 max-w-md text-lg text-ink/70">
              Ada {jumlahUndangan} tema undangan digital. Tinggal sebar lewat WhatsApp, nama tiap tamu tertulis di undangannya.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-ink">
              Lihat {jumlahUndangan} tema undangan
              <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </span>
          </div>
          <CoverFan className="h-64 md:h-auto md:min-h-72" sizes="140px" />
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
        <SectionHeading top="Cara pakai template" bottom="cuma 3 langkah" />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-3xl bg-lilac-soft p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white font-bold text-brand ring-4 ring-lilac">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-ink/70">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <ClosingCta />
    </>
  );
}
