import Image from "next/image";
import type { CSSProperties } from "react";
import { facts, heroShots, waLink } from "@/lib/site";
import { PillLink, StrokeUnderline } from "../brand";
import { HeroCameo } from "../hero-cameo";
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

type Shot = { src: string; url: string };

// Kartu desktop: bingkai browser kecil dengan alamat website demonya
function DesktopCard({ shot, eager, hidden }: { shot: Shot; eager: boolean; hidden?: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-1.5 shadow-[0_22px_44px_-20px_rgb(21_19_43/0.4)]">
      <div className="flex items-center gap-1 px-1.5 pt-0.5 pb-1.5 sm:gap-1.5">
        <span className="size-1.5 shrink-0 rounded-full bg-[#ff6159] sm:size-2" />
        <span className="size-1.5 shrink-0 rounded-full bg-[#ffbd2e] sm:size-2" />
        <span className="size-1.5 shrink-0 rounded-full bg-[#28c840] sm:size-2" />
        <span className="ml-1 truncate rounded-full bg-lilac-soft px-2 py-0.5 text-[9px] font-medium text-ink/50 sm:ml-2 sm:text-[11px]">
          {shot.url}
        </span>
      </div>
      <Image
        src={shot.src}
        alt={hidden ? "" : `Tampilan desktop website contoh ${shot.url}`}
        width={1280}
        height={800}
        sizes="(min-width: 768px) 340px, 58vw"
        loading={eager ? "eager" : "lazy"}
        className="w-full rounded-xl"
      />
    </div>
  );
}

function PhoneCard({ shot, eager, hidden }: { shot: Shot; eager: boolean; hidden?: boolean }) {
  return (
    <div className="relative rounded-[1.4rem] bg-white p-1.5 shadow-[0_18px_40px_-18px_rgb(21_19_43/0.35)]">
      <span className="absolute top-2.5 left-1/2 z-10 h-1.5 w-8 -translate-x-1/2 rounded-full bg-ink/80 sm:h-2 sm:w-10" />
      <Image
        src={shot.src}
        alt={hidden ? "" : `Tampilan HP website contoh ${shot.url}`}
        width={480}
        height={960}
        sizes="(min-width: 768px) 190px, 34vw"
        loading={eager ? "eager" : "lazy"}
        className="w-full rounded-[1.05rem]"
      />
    </div>
  );
}

// Satu kolom yang terus bergulir; isinya digandakan supaya putarannya nyambung
function ShotColumn({
  shots,
  kind,
  down,
  delay,
  duration,
  className = "",
}: {
  shots: Shot[];
  kind: "desktop" | "phone";
  down?: boolean;
  delay: number;
  duration: string;
  className?: string;
}) {
  const Card = kind === "desktop" ? DesktopCard : PhoneCard;
  const set = (hidden?: boolean) => (
    <div className="flex flex-col gap-4 pb-4" aria-hidden={hidden || undefined}>
      {shots.map((shot, i) => (
        <div
          key={`${shot.src}-${i}`}
          className="animate-card-in"
          style={
            {
              animationDelay: `${delay + 250 + i * 140}ms`,
              "--enter-tilt": `${down ? -4 : 4}deg`,
            } as CSSProperties
          }
        >
          <Card shot={shot} eager={!hidden && i < 3} hidden={hidden} />
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`marquee animate-column-in overflow-hidden ${className}`}
      style={{ animationDelay: `${delay}ms`, "--enter-y": down ? "-7rem" : "7rem" } as CSSProperties}
    >
      <div
        className={`marquee-track flex flex-col ${down ? "animate-marquee-down" : "animate-marquee-up"}`}
        style={{ animationDuration: duration }}
      >
        {set()}
        {set(true)}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="beranda" className="hero relative overflow-hidden bg-lilac">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:min-h-184 md:grid-cols-[1.1fr_1fr] md:gap-12 xl:grid-cols-[1fr_1.15fr]">
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
            <PillLink href="/template" tone="white" size="lg" icon="browser">
              Lihat template
            </PillLink>
          </div>
        </div>

        {/* Kolom tampilan desktop & HP yang terus bergulir, dari demo website buatan Webkeun */}
        <div className="relative -mx-4 h-104 mask-[linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] sm:mx-0 sm:h-128 md:h-auto md:mask-none">
          <div className="stage-shots absolute inset-0 grid grid-cols-[1.7fr_1fr] gap-3 px-4 sm:gap-4 sm:px-0 xl:grid-cols-[1fr_1.9fr_1fr]">
            <ShotColumn
              shots={heroShots.phone.toReversed()}
              kind="phone"
              delay={380}
              duration="84s"
              down
              className="-mt-56 hidden xl:block"
            />
            <ShotColumn shots={heroShots.desktop} kind="desktop" delay={150} duration="58s" className="-mt-16" />
            <ShotColumn shots={heroShots.phone} kind="phone" delay={520} duration="90s" down />
          </div>
          {/* Sesekali kolom contoh minggir dan maskot nongol */}
          <HeroCameo />
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
