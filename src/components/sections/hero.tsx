import { facts } from "@/lib/site";
import { PillLink, StrokeUnderline } from "../brand";
import { HeroMascot } from "../hero-mascot";
import { HeroPanggung } from "../hero-panggung";
import { Icon } from "../icons";

// Kata muncul satu per satu
function Rise({ words, start = 0 }: { words: string; start?: number }) {
  return words.split(" ").map((w, i) => (
    <span key={i} className="inline-block animate-rise" style={{ animationDelay: `${start + i * 70}ms` }}>
      {w}&nbsp;
    </span>
  ));
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
            {/* produk utama (undangan digital) disebut duluan, lalu website */}
            <span className="block">
              <Rise words="Undangan Digital & Website" />
            </span>
            <span className="block text-brand">
              <Rise words="tinggal kamu" start={350} />
              <span className="inline-block animate-rise" style={{ animationDelay: "490ms" }}>
                <StrokeUnderline>sebar</StrokeUnderline>
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-lg animate-rise text-lg leading-relaxed text-ink/70" style={{ animationDelay: "650ms" }}>
            Undangan pernikahan digital dengan nama tiap tamu, RSVP, dan musik, juga website UMKM, company profile, dan portofolio yang rapi di HP. Kamu fokus ke acara dan usaha, urusan teknis biar{" "}
            <strong className="font-semibold text-ink">Webkeun</strong> yang beresin.
          </p>

          <div className="mt-8 flex animate-rise flex-wrap items-center gap-3" style={{ animationDelay: "780ms" }}>
            <PillLink href="/template/undangan" size="lg" icon="heart" className="hero-cta">
              Tema undangan
            </PillLink>
            <PillLink href="/template" tone="white" size="lg" icon="browser">
              Template website
            </PillLink>
          </div>
        </div>

        {/* Panggung: undangan disebar lewat WhatsApp + contoh website (lihat hero-panggung.tsx) */}
        <div className="relative h-[25rem] sm:h-[31rem] md:mt-20 md:h-[36rem] md:self-center lg:h-[38rem]">
          <HeroPanggung />
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
