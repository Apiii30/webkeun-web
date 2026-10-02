import { steps } from "@/lib/site";
import { SectionHeading } from "../brand";

export function Process() {
  return (
    <section id="cara-kerja" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="grid gap-6 md:grid-cols-2 md:items-end">
        <SectionHeading top="Dari ngobrol sampai online," bottom="cuma 4 langkah" />
        <p className="max-w-md text-lg text-ink/70 md:justify-self-end">
          Prosesnya terbuka dari awal sampai akhir. Kamu selalu tahu websitenya lagi sampai mana.
        </p>
      </div>

      <ol className="relative mt-14 grid gap-4 md:grid-cols-4">
        {/* garis penghubung, bentuknya diambil dari stroke logo */}
        <span
          className="absolute top-12 right-[12%] left-[12%] hidden h-1.5 rounded-full bg-lilac md:block"
          aria-hidden="true"
        />
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li
              key={s.title}
              className={`relative rounded-3xl p-6 ${last ? "bg-brand text-white" : "bg-lilac-soft"}`}
            >
              <span
                className={`grid size-12 place-items-center rounded-full text-lg font-bold ${
                  last ? "bg-mint text-ink" : "bg-white text-brand ring-4 ring-lilac"
                }`}
              >
                {i + 1}
              </span>
              <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
              <p className={`mt-2 ${last ? "text-white/80" : "text-ink/70"}`}>{s.desc}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
