import { waLink } from "@/lib/site";
import { ArrowIcon, StrokeUnderline } from "../brand";
import { HeroMascot } from "../hero-mascot";

const facts = ["Mulai 499rb", "Jadi ±3–7 hari", "Konsultasi gratis"];

export function Hero() {
  return (
    <section className="hero relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 md:grid-cols-[1.5fr_1fr] md:pb-28 md:pt-16">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3.5 py-1.5 text-sm font-bold">
            <span className="size-2.5 rounded-full bg-mint" />
            Jasa pembuatan website
          </p>

          <h1 className="font-display text-[2.75rem] leading-[0.98] font-extrabold tracking-[-0.03em] text-balance sm:text-6xl lg:text-[4.75rem]">
            Biar usaha kamu gampang <StrokeUnderline>dicari</StrokeUnderline> &amp; dipercaya.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/75">
            Webkeun bikinin website UMKM, company profile, dan portofolio yang rapi, cepat, dan enak dilihat di HP. Kamu
            fokus jualan, urusan web biar kami.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={waLink("Halo Webkeun! Aku mau bikin website, bisa ngobrol dulu?")}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta group inline-flex items-center gap-3 rounded-full bg-brand py-4 pl-7 pr-5 text-lg font-bold text-white transition-colors hover:bg-brand-deep"
            >
              Yuk webkeun
              <span className="grid size-8 place-items-center rounded-full bg-mint text-ink transition-transform group-hover:translate-x-1">
                <ArrowIcon className="size-4" />
              </span>
            </a>
            <a
              href="#contoh"
              className="rounded-full px-5 py-4 text-lg font-bold underline decoration-2 decoration-lilac-strong underline-offset-[6px] transition-colors hover:decoration-brand"
            >
              Lihat contoh dulu
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink/70">
            {facts.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-brand" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm md:max-w-none">
          <div
            className="absolute inset-x-6 top-10 bottom-0 rotate-[4deg] rounded-[40px] bg-brand"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-10 top-16 -bottom-4 -rotate-[3deg] rounded-[40px] bg-mint"
            aria-hidden="true"
          />

          <div className="relative px-10 pt-24 pb-8">
            <div className="absolute top-0 left-0 max-w-[15rem] rounded-3xl border-2 border-ink bg-white px-5 py-3.5 font-display text-lg leading-snug font-bold sm:left-2">
              Halo! Mau dibikinin website apa?
              <span
                className="absolute -bottom-[11px] left-12 size-5 rotate-45 border-r-2 border-b-2 border-ink bg-white"
                aria-hidden="true"
              />
            </div>
            <HeroMascot className="w-full animate-float drop-shadow-[0_6px_0_#15132B]" />
          </div>

          <div className="pointer-events-none absolute right-0 -bottom-6 flex flex-col items-end gap-2 sm:right-2">
            <span className="rotate-[6deg] rounded-full border-2 border-ink bg-white px-3.5 py-1.5 text-sm font-bold">
              Company profile
            </span>
            <span className="-rotate-[4deg] rounded-full bg-ink px-3.5 py-1.5 text-sm font-bold text-white">
              Website UMKM
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
