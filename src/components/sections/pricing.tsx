import { packages, waLink } from "@/lib/site";
import { SectionLabel } from "../brand";
import { Mascot } from "../mascot";

const cardTone = ["bg-white", "bg-ink text-white", "bg-mint"];

export function Pricing() {
  return (
    <section id="harga" className="bg-lilac">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="max-w-2xl">
          <SectionLabel>Harga</SectionLabel>
          <h2 className="font-display text-4xl leading-[1.02] font-extrabold tracking-[-0.02em] sm:text-5xl lg:text-6xl">
            Harganya jelas, nggak pakai drama.
          </h2>
          <p className="mt-5 text-lg text-ink/70">
            Sekali bayar, domain &amp; hosting tahun pertama sudah termasuk. Tahun berikutnya cukup bayar perpanjangan.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:mt-24 lg:grid-cols-3">
          {packages.map((p, i) => (
            <div key={p.name} className={`relative ${p.highlight ? "mt-20 lg:mt-0" : ""}`}>
              {p.highlight && (
                <div className="absolute -top-[4.6rem] right-6 flex items-start gap-1" aria-hidden="true">
                  <span className="mt-2 -rotate-6 rounded-2xl border-2 border-ink bg-white px-3 py-1.5 font-display text-sm font-bold">
                    Segini doang?!
                  </span>
                  <Mascot mood="kaget" outline className="w-24" />
                </div>
              )}

              <div className={`relative flex h-full flex-col rounded-blob p-7 sm:p-8 ${cardTone[i]}`}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl font-extrabold">{p.name}</h3>
                  {p.highlight && (
                    <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-ink">Rekomendasi kami</span>
                  )}
                </div>
                <p className={`mt-1 text-sm ${p.highlight ? "text-lilac" : "text-ink/65"}`}>{p.for}</p>

                <p className="mt-8 flex items-baseline gap-2">
                  <span
                    className={`font-display font-extrabold tracking-tight ${/\d/.test(p.price) ? "text-5xl" : "text-4xl"}`}
                  >
                    {p.price}
                  </span>
                </p>
                <p className={`text-sm ${p.highlight ? "text-lilac" : "text-ink/65"}`}>{p.priceNote}</p>

                <ul className="mt-8 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span
                        className={`mt-[0.45rem] size-2.5 shrink-0 rounded-full ${i === 2 ? "bg-ink" : "bg-mint"}`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={waLink(`Halo Webkeun! Aku tertarik paket ${p.name}. Bisa dijelasin lebih lanjut?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-10 rounded-full py-4 text-center font-bold transition-transform hover:-translate-y-0.5 ${
                    p.highlight ? "bg-brand text-white" : "bg-ink text-white"
                  }`}
                >
                  {p.name === "Custom" ? "Konsultasi dulu" : `Pilih ${p.name}`}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
