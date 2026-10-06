import { SectionHeading } from "../brand";
import { Icon, type IconName } from "../icons";
import { Mascot } from "../mascot";

const promises = ["Harga jelas dari awal", "Progres bisa dipantau", "Dibantu sampai online"];

const chips: { icon: IconName; label: string; className: string }[] = [
  { icon: "phone", label: "Rapi di HP", className: "top-2 -left-2 -rotate-6 sm:left-0" },
  { icon: "zap", label: "Cepat dibuka", className: "top-1/2 -right-2 rotate-[5deg] sm:right-0" },
  { icon: "search", label: "Gampang dicari", className: "bottom-4 left-2 -rotate-3" },
];

export function Why() {
  return (
    <section id="kenapa" className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 md:grid-cols-[1.35fr_1fr] md:py-28">
      <div>
        <SectionHeading top="Kenapa" bottom="harus Webkeun?" />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
          Undangan dan website sama-sama kesan pertama: yang dilihat tamu sebelum datang ke acaramu, dan pelanggan
          sebelum mampir ke usahamu. Webkeun bikinin undangan digital dan website yang{" "}
          <strong className="font-semibold text-ink">rapi di HP</strong>,{" "}
          <strong className="font-semibold text-ink">cepat dibuka</strong>, dan{" "}
          <strong className="font-semibold text-ink">gampang dibagikan</strong>, tanpa kamu harus pusing urusan teknis.
          Kamu cukup cerita, sisanya kami yang kerjakan.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {promises.map((p) => (
            <li
              key={p}
              className="inline-flex items-center gap-2 rounded-full bg-lilac-soft px-4 py-2 text-sm font-semibold"
            >
              <span className="grid size-5 place-items-center rounded-full bg-mint text-ink">
                <Icon name="check" className="size-3" strokeWidth={3.5} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto w-full max-w-72 sm:max-w-sm">
        <div className="absolute inset-8 rotate-6 rounded-[2.5rem] bg-brand" aria-hidden="true" />
        <Mascot mood="senyum" className="relative w-full -rotate-3 p-10" />
        {chips.map((c) => (
          <span
            key={c.label}
            className={`absolute inline-flex items-center gap-2 rounded-full bg-white py-2 pr-4 pl-2 text-sm font-semibold shadow-[0_12px_30px_-12px_rgb(21_19_43/0.3)] ${c.className}`}
          >
            <span className="grid size-7 place-items-center rounded-full bg-brand text-white">
              <Icon name={c.icon} className="size-4" />
            </span>
            {c.label}
          </span>
        ))}
      </div>
    </section>
  );
}
