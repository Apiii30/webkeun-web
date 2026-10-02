"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { templateCategories, templates, waLink } from "@/lib/site";
import { PillLink } from "../brand";
import { Icon } from "../icons";
import { Mascot } from "../mascot";

const categories = [{ slug: null, label: "Semua" }, ...templateCategories];

// Kategori aktif disimpan di URL (?kategori=...), jadi bisa dibuka langsung dari navbar atau dibagikan
export function TemplateGallery() {
  const param = useSearchParams().get("kategori");
  const filter = templateCategories.some((c) => c.slug === param) ? param : null;
  const shown = filter ? templates.filter((t) => t.category === filter) : templates;

  // Kartu "custom" mengisi sisa kolom di baris terakhir supaya grid selalu penuh
  const lgSpan = ["lg:col-span-3 lg:flex-row lg:items-center lg:px-10", "lg:col-span-2 lg:flex-row lg:items-center", ""][
    shown.length % 3
  ];
  const mdSpan = shown.length % 2 === 0 ? "md:col-span-2" : "";
  const wide = shown.length % 3 !== 2;

  const choose = (slug: string | null) =>
    window.history.replaceState(null, "", slug ? `/template?kategori=${slug}` : "/template");

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <div role="group" aria-label="Filter kategori template" className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.label}
            type="button"
            aria-pressed={filter === c.slug}
            onClick={() => choose(c.slug)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === c.slug ? "bg-brand text-white" : "bg-lilac-soft text-ink/75 hover:text-brand"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => (
          <li key={t.slug} className="flex animate-rise flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink/8">
            <Link
              href={`/template/${t.slug}`}
              className="group relative block bg-lilac p-5 pb-8"
              aria-label={`Lihat demo template ${t.name}`}
            >
              <div className="overflow-hidden rounded-xl bg-white shadow-[0_20px_40px_-24px_rgb(21_19_43/0.5)] transition-transform duration-500 group-hover:-translate-y-1">
                <div className="flex items-center gap-1.5 border-b border-ink/10 px-3 py-2">
                  <span className="size-2 rounded-full bg-[#ff6159]" />
                  <span className="size-2 rounded-full bg-[#ffbd2e]" />
                  <span className="size-2 rounded-full bg-[#28c840]" />
                  <span className="ml-1.5 truncate rounded-full bg-lilac-soft px-2 py-0.5 text-[11px] text-ink/50">
                    {t.url}
                  </span>
                </div>
                <Image
                  src={t.laptop}
                  alt={`Tampilan laptop template ${t.name}`}
                  width={1280}
                  height={800}
                  sizes="(min-width: 1024px) 340px, (min-width: 768px) 45vw, 90vw"
                  className="w-full"
                />
              </div>
              <div className="absolute right-4 bottom-3 w-[24%] rotate-[4deg] overflow-hidden rounded-2xl bg-white p-1 shadow-xl transition-transform duration-500 group-hover:rotate-0">
                <Image
                  src={t.phone}
                  alt={`Tampilan HP template ${t.name}`}
                  width={480}
                  height={960}
                  sizes="100px"
                  className="w-full rounded-xl"
                />
              </div>
            </Link>

            <div className="flex flex-1 flex-col p-6">
              <p className="text-sm font-semibold text-brand">{t.kind}</p>
              <h2 className="mt-1 text-xl font-bold">{t.name}</h2>
              <p className="mt-2 text-ink/70">{t.desc}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {t.includes.map((inc) => (
                  <li key={inc} className="rounded-full bg-lilac-soft px-2.5 py-1 text-xs font-medium text-ink/70">
                    {inc}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-6">
                <PillLink href={`/template/${t.slug}`}>Lihat demo</PillLink>
                <a
                  href={waLink(`Halo Webkeun! Aku mau pakai template ${t.name} buat usahaku.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink/75 hover:text-brand"
                >
                  <Icon name="whatsapp" className="size-4 text-wa" />
                  Pakai template ini
                </a>
              </div>
            </div>
          </li>
        ))}

        <li className={`flex flex-col items-start justify-between gap-8 rounded-3xl bg-brand p-7 text-white ${mdSpan} ${lgSpan}`}>
          <div className={wide ? "lg:flex lg:items-center lg:gap-8" : ""}>
            <Mascot mood="kedip" className="w-20 shrink-0 -rotate-6" />
            <div className={wide ? "mt-6 lg:mt-0" : "mt-6"}>
              <h2 className="text-2xl leading-tight font-bold">
                Nggak nemu yang pas?
                <span className="block text-mint">Kami bikinin dari nol.</span>
              </h2>
              <p className="mt-3 text-white/80">
                Ceritain usaha dan selera kamu. Desainnya kami rancang khusus, nggak harus mulai dari template.
              </p>
            </div>
          </div>
          <PillLink
            href={waLink("Halo Webkeun! Aku mau website dengan desain custom, bisa ngobrol dulu?")}
            external
            tone="white"
            icon="whatsapp"
            className="shrink-0 whitespace-nowrap"
          >
            Konsultasi custom
          </PillLink>
        </li>
      </ul>
    </section>
  );
}
