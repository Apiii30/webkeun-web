import Image from "next/image";
import type { CSSProperties } from "react";
import { facts, heroShots, waLink } from "@/lib/site";
import { PillLink, StrokeUnderline } from "../brand";
import { HeroMascot } from "../hero-mascot";
import { Icon } from "../icons";

// Kata muncul satu per satu
function Rise({ words, start = 0 }: { words: string; start?: number }) {
  return words.split(" ").map((w, i) => (
    <span key={i} className="inline-block animate-rise" style={{ animationDelay: `${start + i * 70}ms` }}>
      {w}&nbsp;
    </span>
  ));
}

function ShotColumn({
  shots,
  down,
  delay,
  className = "",
}: {
  shots: string[];
  down?: boolean;
  delay: number;
  className?: string;
}) {
  const card = (src: string, i: number, hidden?: boolean) => (
    <div
      key={`${src}-${i}`}
      className="animate-card-in overflow-hidden rounded-[1.4rem] bg-white p-1.5 shadow-[0_18px_40px_-18px_rgb(21_19_43/0.35)]"
      style={
        {
          animationDelay: `${delay + 250 + i * 140}ms`,
          "--enter-tilt": `${down ? -4 : 4}deg`,
        } as CSSProperties
      }
    >
      <Image
        src={src}
        alt={hidden ? "" : "Tampilan HP website contoh buatan Webkeun"}
        width={480}
        height={960}
        sizes="(min-width: 768px) 180px, 30vw"
        loading={hidden ? "lazy" : "eager"}
        className="w-full rounded-[1.05rem]"
      />
    </div>
  );

  return (
    <div
      className={`marquee animate-column-in overflow-hidden ${className}`}
      style={{ animationDelay: `${delay}ms`, "--enter-y": down ? "-7rem" : "7rem" } as CSSProperties}
    >
      <div className={`marquee-track flex flex-col ${down ? "animate-marquee-down" : "animate-marquee-up"}`}>
        <div className="flex flex-col gap-4 pb-4">{shots.map((s, i) => card(s, i))}</div>
        <div className="flex flex-col gap-4 pb-4" aria-hidden="true">
          {shots.map((s, i) => card(s, i, true))}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="beranda" className="hero relative overflow-hidden bg-lilac">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:min-h-184 md:grid-cols-[1.1fr_1fr] md:gap-12">
        <div className="pt-28 md:self-center md:pt-32 md:pb-24">
          <p className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-white/80 py-1 pr-4 pl-1 text-sm font-semibold">
            <HeroMascot className="size-8" />
            Halo! Konsultasinya gratis, kok.
          </p>

          <h1 className="text-[2.5rem] leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]">
            <span className="block">
              <Rise words="Jasa Pembuatan Website" />
            </span>
            <span className="block text-brand">
              <Rise words="biar usaha kamu" start={280} />
              <span className="inline-block animate-rise" style={{ animationDelay: "490ms" }}>
                <StrokeUnderline>dicari</StrokeUnderline>
              </span>
            </span>
          </h1>

          <p
            className="mt-6 max-w-lg animate-rise text-lg leading-relaxed text-ink/70"
            style={{ animationDelay: "650ms" }}
          >
            Website UMKM, company profile, dan portofolio yang rapi, cepat, dan enak dilihat di HP. Kamu fokus jualan,
            urusan web biar <strong className="font-semibold text-ink">Webkeun</strong> yang beresin.
          </p>

          <div className="mt-8 flex animate-rise flex-wrap items-center gap-3" style={{ animationDelay: "780ms" }}>
            <PillLink
              href={waLink("Halo Webkeun! Aku mau bikin website, bisa ngobrol dulu?")}
              external
              size="lg"
              className="hero-cta"
            >
              Yuk webkeun
            </PillLink>
            <PillLink href="#contoh" tone="white" size="lg" icon="browser">
              Lihat contoh
            </PillLink>
          </div>
        </div>

        {/* Kolom layar HP yang terus bergulir, dari demo website buatan Webkeun */}
        <div className="relative -mx-4 h-104 mask-[linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] sm:mx-0 sm:h-128 md:h-auto md:mask-none">
          <div className="absolute inset-0 grid grid-cols-3 gap-3 px-4 sm:gap-4 sm:px-0">
            <ShotColumn shots={heroShots[0]} delay={150} className="-mt-24" />
            <ShotColumn shots={heroShots[1]} delay={330} down />
            <ShotColumn shots={heroShots[2]} delay={510} className="-mt-40" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Facts() {
  return (
    <section className="bg-brand text-white">
      <ul className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 md:gap-8">
        {facts.map((f) => (
          <li key={f.title} className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-brand">
              <Icon name={f.icon} className="size-6" />
            </span>
            <span>
              <span className="block font-bold">{f.title}</span>
              <span className="block text-sm text-white/75">{f.desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
