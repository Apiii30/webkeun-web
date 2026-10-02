import { faqs, waLink } from "@/lib/site";
import { PillLink, SectionHeading } from "../brand";
import { Mascot } from "../mascot";

export function Faq() {
  return (
    <section id="faq" className="border-t border-ink/10">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading top="FAQ" bottom="Yang sering ditanyain" />

        <dl className="mt-12 grid gap-x-14 gap-y-9 md:grid-cols-2">
          {faqs.map((f) => (
            <div key={f.q}>
              <dt className="text-lg font-bold">{f.q}</dt>
              <dd className="mt-2 leading-relaxed text-ink/70">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 flex flex-col items-start gap-5 rounded-3xl bg-lilac-soft p-6 sm:flex-row sm:items-center sm:p-7">
          <Mascot mood="kedip" className="w-16 shrink-0" />
          <div className="flex-1">
            <p className="text-lg font-bold">Masih ada yang bikin bingung?</p>
            <p className="text-ink/70">Tanya langsung aja, kami jawab lewat WhatsApp.</p>
          </div>
          <PillLink href={waLink("Halo Webkeun, aku mau tanya dulu nih.")} external icon="whatsapp">
            Tanya langsung
          </PillLink>
        </div>
      </div>
    </section>
  );
}
