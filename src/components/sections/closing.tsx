import Image from "next/image";
import Link from "next/link";
import { footerLinks, mailLink, services, site, waLink } from "@/lib/site";
import { PillLink } from "../brand";
import { Icon } from "../icons";
import { Mascot } from "../mascot";
import { IkonSosial } from "./sosial";

export function ClosingCta() {
  return (
    <section className="px-4 pb-20 sm:px-6 md:pb-28">
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-4xl bg-brand px-7 py-12 text-white sm:px-12 md:grid-cols-[1.6fr_1fr] md:py-16">
        <div className="relative">
          <h2 className="text-4xl leading-[1.05] font-bold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Udah kebayang?
            <span className="block text-mint">Yuk webkeun.</span>
          </h2>
          <p className="mt-5 max-w-lg text-lg text-white/80">
            Konsultasi gratis. Ceritain acara atau usaha kamu, nanti kami kasih saran yang paling pas, tanpa paksaan.
          </p>
          <PillLink
            href={waLink("Halo Webkeun! Aku udah kebayang undangan/website-nya, yuk ngobrol.")}
            external
            tone="white"
            size="lg"
            icon="whatsapp"
            className="mt-8"
          >
            Chat {site.whatsappDisplay}
          </PillLink>
        </div>
        <div className="relative mx-auto w-48 md:w-full md:max-w-60">
          <div className="absolute inset-4 rotate-6 rounded-4xl bg-white/15" aria-hidden="true" />
          <Mascot mood="tertawa" className="relative w-full -rotate-6" />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-lilac-soft">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Webkeun, ke beranda">
            <Image src="/brand/logo-wk.svg" alt="" width={42} height={30} />
            <Image src="/brand/tulisan.svg" alt="Webkeun" width={114} height={22} />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/65">{site.description}</p>
          <IkonSosial />
        </div>

        <div>
          <h2 className="text-sm font-bold">Layanan</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-ink/65">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/#${s.slug}`} className="hover:text-brand">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">Menu</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-ink/65">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">Kontak</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-ink/65">
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-brand">
                <Icon name="whatsapp" className="size-4 shrink-0 text-wa" />
                {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={mailLink()} className="inline-flex items-center gap-2 break-all hover:text-brand">
                <Icon name="mail" className="size-4 shrink-0 text-brand" />
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <p className="mx-auto max-w-6xl px-4 pt-6 pb-24 text-sm text-ink/55 sm:px-6 md:pb-6">
          © {new Date().getFullYear()} {site.name}. {site.tagline}.
        </p>
      </div>
    </footer>
  );
}
