import type { Metadata } from "next";
import { halaman } from "@/lib/seo";
import { Badge, PillLink, SectionHeading } from "@/components/brand";
import { Icon } from "@/components/icons";
import { Mascot, type Mood } from "@/components/mascot";
import { ClosingCta } from "@/components/sections/closing";

export const metadata: Metadata = halaman({
  judul: "Tentang Kami",
  deskripsi:
    "Webkeun bantu UMKM, perusahaan, dan pekerja kreatif punya website yang rapi, cepat, dan gampang dicari, tanpa ribet urusan teknis.",
  path: "/tentang",
});

const principles = [
  {
    title: "Harga jelas dari awal",
    desc: "Kamu tahu bayar berapa dan dapat apa sebelum mulai. Nggak ada biaya tambahan yang muncul tiba-tiba.",
  },
  {
    title: "Bahasa yang gampang",
    desc: "Kami jelasin pakai bahasa sehari-hari, bukan istilah teknis. Kamu nggak perlu ngerti coding sama sekali.",
  },
  {
    title: "Progres bisa dipantau",
    desc: "Selama dikerjakan, kamu bisa lihat hasilnya langsung lewat link dan kasih masukan kapan aja.",
  },
  {
    title: "Dibantu sampai online",
    desc: "Domain, hosting, sampai website tayang, semuanya kami urus. Kamu tinggal share link-nya.",
  },
];

const moods: { mood: Mood; label: string; note: string }[] = [
  { mood: "senyum", label: "Senyum", note: "waktu kamu mampir" },
  { mood: "kedip", label: "Kedip", note: "waktu ada kabar baik" },
  { mood: "kaget", label: "Kaget", note: "waktu lihat harganya" },
  { mood: "tertawa", label: "Ketawa", note: "waktu website kamu online" },
];

export default function TentangPage() {
  return (
    <>
      <section className="bg-lilac">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-32 pb-16 sm:px-6 md:grid-cols-[1.4fr_1fr] md:pt-36 md:pb-20">
          <div>
            <Badge>Tentang kami</Badge>
            <h1 className="mt-5 text-4xl leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]">
              Kami bantu usaha kamu
              <span className="block text-brand">tampil meyakinkan di internet</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/70">
              Webkeun bikin website untuk UMKM, perusahaan, dan pekerja kreatif. Tujuannya sederhana: biar usaha kamu
              gampang ditemukan, kelihatan profesional, dan pelanggan gampang menghubungi kamu.
            </p>
          </div>
          <div className="relative mx-auto w-52 md:w-64" aria-hidden="true">
            <div className="absolute -inset-[5%] rotate-[9deg] rounded-[2.4rem] bg-brand" />
            <Mascot mood="senyum" className="relative w-full -rotate-3" />
          </div>
        </div>
      </section>

      {/* Arti nama */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
          <SectionHeading top="Kenapa namanya" bottom="Webkeun?" />
          <div className="rounded-3xl bg-lilac-soft p-7 sm:p-9">
            <p className="text-3xl font-bold tracking-tight sm:text-4xl">
              web<span className="text-brand">keun</span>
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink/75">
              Dalam bahasa Sunda, akhiran <strong className="font-semibold text-ink">“-keun”</strong> artinya kurang
              lebih “jadikan” atau “bikinin”. Jadi <strong className="font-semibold text-ink">webkeun</strong> berarti
              “bikinin web”. Makanya ajakan kami cuma satu: kalau usaha kamu belum punya website,{" "}
              <strong className="font-semibold text-brand">yuk webkeun</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Prinsip kerja */}
      <section className="bg-lilac-soft">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <SectionHeading top="Cara kami" bottom="bekerja bareng kamu" />
          <ol className="mt-12 grid gap-x-12 md:grid-cols-2">
            {principles.map((p, i) => (
              <li key={p.title} className="flex gap-5 border-t border-ink/10 py-7">
                <span className="text-sm font-bold text-brand tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-ink/70">{p.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Maskot */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <SectionHeading top="Kenalan sama" bottom="maskot kami" />
          <p className="max-w-md text-lg text-ink/70 md:justify-self-end">
            Bentuknya kotak kayak layar, ekspresinya macam-macam. Kamu bakal sering ketemu dia di seluruh website ini.
          </p>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {moods.map((m, i) => (
            <li key={m.mood} className="rounded-3xl bg-white p-6 text-center ring-1 ring-ink/8">
              <Mascot
                mood={m.mood}
                className={`mx-auto w-24 drop-shadow-[0_10px_18px_rgb(91_61_245/0.25)] ${i % 2 ? "rotate-3" : "-rotate-3"}`}
              />
              <p className="mt-5 font-bold">{m.label}</p>
              <p className="text-sm text-ink/60">{m.note}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-start gap-5 rounded-3xl bg-ink p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-mint">
              <Icon name="browser" className="size-6" />
            </span>
            <div>
              <p className="text-lg font-bold">Penasaran hasil kerja kami?</p>
              <p className="text-white/70">Lihat template website yang bisa kamu pakai.</p>
            </div>
          </div>
          <PillLink href="/template" tone="white" icon="arrow">
            Lihat template
          </PillLink>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
