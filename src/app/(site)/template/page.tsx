import type { Metadata } from "next";
import { Badge, SectionHeading } from "@/components/brand";
import { Mascot } from "@/components/mascot";
import { ClosingCta } from "@/components/sections/closing";
import { TemplateGallery } from "@/components/sections/template-gallery";
import { templates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Template Website",
  description:
    "Pilih template website UMKM, company profile, atau portofolio. Warna, foto, dan isinya kami sesuaikan dengan usaha kamu.",
};

const steps = [
  { title: "Pilih template", desc: "Cari yang gayanya paling dekat sama usaha kamu." },
  { title: "Kirim materi", desc: "Logo, foto, dan info usaha. Belum lengkap? Kami bantu rapikan." },
  { title: "Kami sesuaikan", desc: "Warna & isi diganti sesuai brand kamu, lalu website online." },
];

export default function TemplatePage() {
  return (
    <>
      <section className="bg-lilac">
        <div className="mx-auto grid max-w-6xl items-end gap-8 px-4 pt-32 pb-14 sm:px-6 md:grid-cols-[1fr_auto] md:pt-36">
          <div>
            <Badge>{templates.length} template siap pakai</Badge>
            <h1 className="mt-5 text-4xl leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]">
              Template website
              <span className="block text-brand">siap kamu pakai</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/70">
              Lihat demonya langsung, pilih yang kamu suka, lalu kami sesuaikan warna, foto, dan isinya dengan usaha
              kamu.
            </p>
          </div>
          <div className="relative hidden w-56 md:block" aria-hidden="true">
            <span className="absolute -top-16 -left-20 z-10 rotate-[-6deg] rounded-2xl bg-white px-4 py-2.5 text-sm font-bold shadow-md">
              Pilih yang paling kamu suka!
            </span>
            <div className="absolute -inset-[5%] rotate-[9deg] rounded-[2.2rem] bg-brand" />
            <Mascot mood="senyum" className="relative w-full -rotate-3" />
          </div>
        </div>
      </section>

      <TemplateGallery />

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
