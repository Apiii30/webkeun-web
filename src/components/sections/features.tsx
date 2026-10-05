"use client";

import Image from "next/image";
import { useState } from "react";
import { features } from "@/lib/site";
import { Badge, SectionHeading } from "../brand";
import { Icon } from "../icons";

export function Features() {
  const [open, setOpen] = useState(0);

  return (
    <section id="fitur" className="bg-lilac-soft">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="flex flex-col items-center text-center">
          <Badge>Sudah termasuk</Badge>
          <SectionHeading center className="mt-5" top="Semua yang usaha kamu butuh," bottom="ada di dalamnya" />
          <p className="mt-4 max-w-xl text-lg text-ink/70">
            Nggak perlu bayar tambahan buat hal-hal dasar. Ini yang kamu dapat di setiap website Webkeun.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 md:items-start">
          <ul className="order-2 space-y-3 md:order-1">
            {features.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.title} className="rounded-2xl bg-white">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`fitur-${i}`}
                    className={`flex w-full items-center gap-3 px-5 py-4 text-left font-bold transition-colors ${
                      isOpen ? "text-brand" : "hover:text-brand"
                    }`}
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-xl transition-colors ${
                        isOpen ? "bg-brand text-white" : "bg-lilac-soft text-ink"
                      }`}
                    >
                      <Icon name={f.icon} className="size-[18px]" />
                    </span>
                    <span className="flex-1">{f.title}</span>
                    <Icon
                      name="chevron"
                      className={`size-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      strokeWidth={2.5}
                    />
                  </button>
                  <div
                    id={`fitur-${i}`}
                    className={`grid transition-[grid-template-rows] duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <p className="overflow-hidden px-5 text-ink/70" inert={!isOpen}>
                      <span className="block pb-5 pl-12">{f.desc}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="order-1 overflow-hidden rounded-3xl bg-ink text-white md:sticky md:top-28 md:order-2">
            <div className="p-7 sm:p-8">
              <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Website siap <span className="text-mint">jualan</span>
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {features.map((f) => (
                  <li key={f.title} className="rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-white/30">
                    {f.title}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-white/75">Dari pertama online, pelanggan sudah bisa lihat, cari, dan hubungi kamu.</p>
            </div>

            <div className="relative px-7 sm:px-8">
              <div className="overflow-hidden rounded-t-xl bg-white">
                <div className="flex items-center gap-1.5 bg-[#ece9f7] px-3 py-2">
                  <span className="size-2 rounded-full bg-[#ff6159]" />
                  <span className="size-2 rounded-full bg-[#ffbd2e]" />
                  <span className="size-2 rounded-full bg-[#28c840]" />
                </div>
                <Image
                  src="/preview/umkm/laptop-kawalu-coffee.webp"
                  alt="Contoh website Kawalu Coffee di laptop"
                  width={1280}
                  height={800}
                  sizes="(min-width: 768px) 520px, 90vw"
                  className="w-full"
                />
              </div>
              <div className="absolute right-4 -bottom-10 w-[28%] rotate-[4deg] overflow-hidden rounded-[1.1rem] bg-white p-1 shadow-2xl sm:right-5">
                <Image
                  src="/preview/umkm/hp-kawalu-1.webp"
                  alt="Contoh website Kawalu Coffee di HP"
                  width={480}
                  height={960}
                  sizes="160px"
                  className="w-full rounded-[0.85rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
