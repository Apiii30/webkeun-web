import { services, waLink } from "@/lib/site";
import { SectionHeading } from "../brand";
import { Icon } from "../icons";

export function Services() {
  return (
    <section id="layanan" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="grid gap-6 md:grid-cols-2 md:items-end">
        <SectionHeading top="Kamu butuh" bottom="website yang mana?" />
        <p className="max-w-md text-lg text-ink/70 md:justify-self-end">
          Bingung pilih? Chat aja dan ceritain usaha kamu. Nanti kami bantu tentuin yang paling pas.
        </p>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <li key={s.title}>
            <a
              href={waLink(`Halo Webkeun! Aku tertarik bikin ${s.title}. Bisa dibantu?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-3xl bg-lilac-soft p-7 ring-1 ring-transparent transition-[box-shadow,background-color] hover:bg-white hover:shadow-[0_20px_50px_-24px_rgb(91_61_245/0.45)] hover:ring-brand/15 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand text-white">
                  <Icon name={s.icon} className="size-6" />
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand ring-1 ring-brand/15">
                  {s.price}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2 flex-1 text-ink/70">{s.desc}</p>
              <p className="mt-5 text-sm text-ink/55">
                <span className="font-semibold text-ink/75">Cocok buat:</span> {s.fit}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-brand">
                Tanya soal ini
                <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
