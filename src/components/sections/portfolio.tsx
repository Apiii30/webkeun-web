"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { templates } from "@/lib/site";
import { SectionHeading } from "../brand";
import { Icon } from "../icons";

export function Portfolio() {
  const [active, setActive] = useState(0);
  const d = templates[active];

  return (
    <section id="template" className="border-t border-ink/10">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <SectionHeading top="Pilih template," bottom="kami sesuaikan buat kamu" />
            <p className="mt-4 max-w-2xl text-lg text-ink/70">
              Mulai dari template yang paling dekat sama usaha kamu. Warna, foto, dan isinya nanti kami ganti sesuai
              brand kamu.
            </p>
          </div>
          <Link
            href="/template"
            className="group inline-flex items-center gap-2 justify-self-start font-semibold text-brand md:justify-self-end"
          >
            Lihat semua template
            <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>
        </div>

        <div role="tablist" aria-label="Pilih template" className="mt-8 flex flex-wrap gap-2">
          {templates.map((demo, i) => (
            <button
              key={demo.slug}
              type="button"
              role="tab"
              id={`tab-${demo.slug}`}
              aria-selected={i === active}
              aria-controls="panel-template"
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                i === active ? "bg-brand text-white" : "bg-lilac-soft text-ink/75 hover:text-brand"
              }`}
            >
              {demo.kind}
            </button>
          ))}
        </div>

        <div
          id="panel-template"
          role="tabpanel"
          aria-labelledby={`tab-${d.slug}`}
          className="mt-6 grid gap-8 rounded-3xl bg-lilac p-4 sm:p-6 lg:grid-cols-[1fr_17rem] lg:items-end lg:p-8"
        >
          <div className="relative pb-8 sm:pb-0">
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-30px_rgb(21_19_43/0.5)]">
              <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-2.5">
                <span className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#ff6159]" />
                  <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                </span>
                <span className="truncate rounded-full bg-lilac-soft px-3 py-1 text-xs font-medium text-ink/60">
                  {d.url}
                </span>
              </div>
              <Image
                key={d.laptop}
                src={d.laptop}
                alt={`Tampilan laptop website ${d.name}`}
                width={1280}
                height={800}
                sizes="(min-width: 1024px) 760px, 92vw"
                className="w-full animate-rise"
              />
            </div>
            <div className="absolute -right-1 -bottom-2 w-[26%] max-w-40 overflow-hidden rounded-[1.25rem] bg-white p-1 shadow-2xl sm:-right-3 sm:-bottom-6">
              <Image
                key={d.phone}
                src={d.phone}
                alt={`Tampilan HP website ${d.name}`}
                width={480}
                height={960}
                sizes="160px"
                className="w-full animate-rise rounded-2xl"
              />
            </div>
          </div>

          <div className="px-2 pb-2 lg:px-0 lg:pb-0">
            <p className="text-sm font-semibold text-brand">{d.kind}</p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight">{d.name}</h3>
            <p className="mt-3 text-ink/70">{d.desc}</p>
            <Link
              href={`/template/${d.slug}`}
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-5 text-[15px] font-semibold text-white transition-colors hover:bg-ink/85"
            >
              Lihat template
              <span className="grid size-8 place-items-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-0.5">
                <Icon name="arrow" className="size-4" strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
