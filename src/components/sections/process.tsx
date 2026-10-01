import { steps } from "@/lib/site";
import { SectionLabel } from "../brand";

export function Process() {
  return (
    <section id="cara-kerja" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <SectionLabel>Cara kerja</SectionLabel>
      <h2 className="max-w-3xl font-display text-4xl leading-[1.02] font-extrabold tracking-[-0.02em] sm:text-5xl lg:text-6xl">
        Dari ngobrol sampai online, cuma 4 langkah.
      </h2>

      <div className="relative mt-16">
        {/* garis penghubung, bentuknya diambil dari stroke logo */}
        <div
          className="absolute top-0 bottom-0 left-[1.1875rem] w-1.5 rounded-full bg-ink md:top-[1.1875rem] md:right-8 md:bottom-auto md:left-0 md:h-1.5 md:w-auto"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-3 size-5 rounded-full bg-mint md:top-3 md:right-0 md:bottom-auto md:left-auto"
          aria-hidden="true"
        />

        <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="relative grid grid-cols-[3.5rem_1fr] gap-4 md:block">
              <span
                className={`relative grid size-11 place-items-center rounded-full font-display text-lg font-extrabold ${
                  i === steps.length - 1 ? "bg-brand text-white" : "border-[3px] border-ink bg-paper"
                }`}
              >
                {i + 1}
              </span>
              <div className="md:mt-7 md:pr-4">
                <h3 className="font-display text-2xl font-extrabold">{s.title}</h3>
                <p className="mt-2 text-ink/70">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
