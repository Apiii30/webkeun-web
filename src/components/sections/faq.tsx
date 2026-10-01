import { faqs, waLink } from "@/lib/site";
import { SectionLabel, WhatsAppIcon } from "../brand";
import { Mascot } from "../mascot";

export function Faq() {
  return (
    <section id="faq" className="border-t-2 border-ink bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.5fr] md:py-28">
        <div className="md:sticky md:top-28 md:self-start">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-display text-4xl leading-[1.02] font-extrabold tracking-[-0.02em] sm:text-5xl">
            Yang sering ditanyain.
          </h2>

          <div className="mt-10 flex items-center gap-4 rounded-blob bg-paper p-5">
            <Mascot mood="senyum" className="w-20 shrink-0" />
            <div>
              <p className="font-display text-lg font-bold leading-snug">Masih ada yang bikin bingung?</p>
              <a
                href={waLink("Halo Webkeun, aku mau tanya dulu nih.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 font-bold text-brand underline decoration-2 underline-offset-4"
              >
                <WhatsAppIcon className="size-4" />
                Tanya langsung aja
              </a>
            </div>
          </div>
        </div>

        <div className="border-t-[3px] border-ink">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b-[3px] border-ink">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl font-bold sm:text-2xl">
                {f.q}
                <span
                  className="relative grid size-10 shrink-0 place-items-center rounded-full bg-lilac transition-colors group-open:bg-brand"
                  aria-hidden="true"
                >
                  <span className="absolute h-[3px] w-4 rounded-full bg-ink group-open:bg-white" />
                  <span className="faq-plus-v absolute h-4 w-[3px] rounded-full bg-ink transition-transform" />
                </span>
              </summary>
              <p className="max-w-2xl pb-7 text-lg leading-relaxed text-ink/75">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
