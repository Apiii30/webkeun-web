import { services, waLink } from "@/lib/site";
import { ArrowIcon, SectionLabel } from "../brand";

export function Services() {
  return (
    <section id="layanan" className="bg-brand text-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <SectionLabel tone="light">Layanan</SectionLabel>
            <h2 className="font-display text-4xl leading-[1.02] font-extrabold tracking-[-0.02em] sm:text-5xl lg:text-6xl">
              Kamu butuh yang mana?
            </h2>
          </div>
          <p className="max-w-md text-lg text-lilac md:justify-self-end">
            Bingung pilih? Chat aja dan ceritain usaha kamu. Nanti kami bantu tentuin yang paling pas.
          </p>
        </div>

        <ol>
          {services.map((s, i) => (
            <li
              key={s.title}
              className="border-t-[3px] border-lilac-strong/50 transition-colors last:border-b-[3px] hover:border-t-mint"
            >
              <a
                href={waLink(`Halo Webkeun! Aku tertarik bikin ${s.title}. Bisa dibantu?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-x-8 gap-y-3 py-8 md:grid-cols-[5rem_1fr_1.2fr_auto] md:items-center"
              >
                <span className="font-display text-xl font-bold text-lilac-strong">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-3xl font-extrabold tracking-tight transition-transform group-hover:translate-x-2 sm:text-4xl">
                  {s.title}
                </span>
                <span>
                  <span className="block text-white/90">{s.desc}</span>
                  <span className="mt-2 block text-sm text-lilac">Cocok buat: {s.fit}</span>
                </span>
                <span className="mt-2 inline-flex items-center gap-3 justify-self-start md:mt-0 md:justify-self-end">
                  <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-bold whitespace-nowrap">
                    {s.price}
                  </span>
                  <span className="grid size-11 place-items-center rounded-full bg-white text-ink transition-colors group-hover:bg-mint">
                    <ArrowIcon className="size-5 -rotate-45 transition-transform group-hover:rotate-0" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
