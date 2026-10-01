import Link from "next/link";
import { demos } from "@/lib/site";
import { ArrowIcon, SectionLabel } from "../brand";

export function Portfolio() {
  return (
    <section id="contoh" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end">
        <div>
          <SectionLabel>Contoh</SectionLabel>
          <h2 className="font-display text-4xl leading-[1.02] font-extrabold tracking-[-0.02em] sm:text-5xl lg:text-6xl">
            Kira-kira hasilnya kayak gini.
          </h2>
        </div>
        <p className="max-w-md text-lg text-ink/70 md:justify-self-end">
          Ini website demo yang kami bikin supaya kamu kebayang gayanya. Masing-masing beda karakter, dan punyamu nanti
          dibikin khusus buat usaha kamu.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 md:grid-rows-2">
        {demos.map((d, i) => (
          <Link
            key={d.slug}
            href={`/contoh/${d.slug}`}
            className={`group flex flex-col overflow-hidden rounded-blob border-2 border-ink bg-white transition-transform hover:-translate-y-1 ${
              i === 0 ? "md:row-span-2" : ""
            }`}
          >
            <div className="flex items-center gap-3 border-b-2 border-ink px-4 py-3">
              <span className="size-3 rounded-full bg-mint" />
              <span className="truncate rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink/60">
                {d.url}
              </span>
            </div>

            <div
              className={`relative overflow-hidden ${d.bg} ${i === 0 ? "aspect-[4/3] md:aspect-auto md:flex-1" : "aspect-[16/9]"}`}
            >
              <iframe
                src={`/contoh/${d.slug}`}
                title={`Pratinjau ${d.name}`}
                loading="lazy"
                tabIndex={-1}
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 h-[250%] w-[250%] origin-top-left scale-[0.4] border-0"
              />
            </div>

            <div className="flex items-center justify-between gap-4 border-t-2 border-ink px-5 py-4">
              <div>
                <p className="font-display text-xl font-extrabold">{d.name}</p>
                <p className="text-sm text-ink/60">{d.kind}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-lilac px-4 py-2 text-sm font-bold transition-colors group-hover:bg-brand group-hover:text-white">
                Lihat demo
                <ArrowIcon className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
