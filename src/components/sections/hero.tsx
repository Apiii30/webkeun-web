import { facts } from "@/lib/site";
import { PillLink, StrokeUnderline } from "../brand";
import { HeroMascot } from "../hero-mascot";
import { HeroPanggung } from "../hero-panggung";
import { Icon } from "../icons";

export function Hero() {
  return (
    <section id="beranda" className="hero relative overflow-hidden bg-lilac">
      {/* Dinding semua demo yang bergulir, bergantian dengan maskot (lihat hero-panggung.tsx). Teks hero ada di lapisan atasnya. */}
      <HeroPanggung>
        <p className="mb-6 inline-flex animate-tempel items-center gap-2.5 rounded-full bg-white/80 py-1 pr-4 pl-1 text-sm font-semibold">
          <HeroMascot className="size-8" />
          Halo! Konsultasinya gratis, kok.
        </p>

        <h1 className="text-[2.5rem] leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]">
          {/* produk utama (undangan digital) disebut duluan, lalu website. Tiap baris naik dari balik garis potong;
              ruang bawahnya dilebihkan supaya garis bawah "sebar" tidak terpotong. */}
          <span className="baris" style={{ paddingBottom: "0.3em", marginBottom: "-0.3em" }}>
            <span className="animate-naik" style={{ animationDelay: "150ms" }}>
              Undangan Digital & Website
            </span>
          </span>
          <span className="baris text-brand" style={{ paddingBottom: "0.3em", marginBottom: "-0.3em" }}>
            <span className="animate-naik" style={{ animationDelay: "300ms" }}>
              tinggal kamu <StrokeUnderline>sebar</StrokeUnderline>
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
      </HeroPanggung>
    </section>
  );
}

export function Facts() {
  return (
    <section className="bg-brand text-white">
      <ul data-gerak="stiker-anak" className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 md:gap-8">
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
