import { packages, waLink } from "@/lib/site";
import { Badge, PillLink, SectionHeading } from "../brand";
import { Icon } from "../icons";
import { Mascot } from "../mascot";

export function Pricing() {
  return (
    <section id="harga" className="bg-lilac-soft">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="flex flex-col items-center text-center">
          <Badge>Harga</Badge>
          <SectionHeading center className="mt-5" top="Harganya jelas," bottom="nggak pakai drama" />
          <p className="mt-4 max-w-xl text-lg text-ink/70">
            Sekali bayar, domain &amp; hosting tahun pertama sudah termasuk. Tahun berikutnya cukup bayar perpanjangan.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:mt-24 lg:grid-cols-3 lg:items-stretch">
          {packages.map((p) => (
            <div key={p.name} className={`relative ${p.highlight ? "mt-16 lg:mt-0" : ""}`}>
              {p.highlight && (
                <div className="absolute top-[-4.4rem] right-6 flex items-start gap-1" aria-hidden="true">
                  <span className="mt-2 -rotate-6 rounded-2xl bg-white px-3 py-1.5 text-sm font-bold shadow-md">
                    Segini doang?!
                  </span>
                  <Mascot mood="kaget" className="w-20 drop-shadow-[0_10px_18px_rgb(91_61_245/0.35)]" />
                </div>
              )}

              <div
                className={`relative flex h-full flex-col rounded-3xl p-7 sm:p-8 ${
                  p.highlight ? "bg-brand text-white shadow-[0_30px_60px_-30px_rgb(91_61_245/0.8)]" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  {p.highlight && (
                    <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-ink">Rekomendasi kami</span>
                  )}
                </div>
                <p className={`mt-1 text-sm ${p.highlight ? "text-white/75" : "text-ink/60"}`}>{p.for}</p>

                <p
                  className={`mt-7 font-bold tracking-tight ${/\d/.test(p.price) ? "text-5xl" : "text-4xl"} ${
                    p.highlight ? "" : "text-ink"
                  }`}
                >
                  {p.price}
                </p>
                <p className={`mt-1 text-sm ${p.highlight ? "text-white/75" : "text-ink/60"}`}>{p.priceNote}</p>

                <ul
                  className={`mt-7 flex-1 space-y-3 border-t pt-7 ${p.highlight ? "border-white/20" : "border-ink/10"}`}
                >
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                          p.highlight ? "bg-mint text-ink" : "bg-lilac text-brand"
                        }`}
                      >
                        <Icon name="check" className="size-3" strokeWidth={3.5} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <PillLink
                  href={waLink(`Halo Webkeun! Aku tertarik paket ${p.name}. Bisa dijelasin lebih lanjut?`)}
                  external
                  tone={p.highlight ? "white" : "brand"}
                  className="mt-9 w-full"
                >
                  {p.name === "Custom" ? "Konsultasi dulu" : `Pilih ${p.name}`}
                </PillLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
