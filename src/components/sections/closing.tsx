import Image from "next/image";
import Link from "next/link";
import { navLinks, site, waLink } from "@/lib/site";
import { ArrowIcon, WhatsAppIcon } from "../brand";
import { Mascot } from "../mascot";

export function ClosingCta() {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1.5fr_1fr] md:py-28">
        <div>
          <h2 className="font-display text-5xl leading-[0.95] font-extrabold tracking-[-0.03em] sm:text-6xl lg:text-8xl">
            Udah kebayang?
            <br />
            <span className="text-lilac-strong">Yuk webkeun.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-white/70">
            Konsultasi gratis. Ceritain usaha kamu, nanti kami kasih saran paket yang paling pas, tanpa paksaan.
          </p>
          <a
            href={waLink("Halo Webkeun! Aku udah kebayang websitenya, yuk ngobrol.")}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-mint py-4 pr-5 pl-7 text-lg font-bold text-ink transition-transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="size-5" />
            Chat {site.whatsappDisplay}
            <ArrowIcon className="size-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
        <Mascot mood="tertawa" className="mx-auto w-56 rotate-[5deg] md:w-full md:max-w-xs" />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 border-t-2 border-white/15 py-10 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Webkeun, ke beranda">
            <Image src="/brand/logo-wk-putih.svg" alt="" width={44} height={32} />
            <Image src="/brand/tulisan-putih.svg" alt="Webkeun" width={120} height={23} />
          </Link>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/70">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={`/${l.href}`} className="hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2 pb-24 text-sm text-white/50 sm:flex-row sm:justify-between md:pb-10 md:pr-44">
          <p>
            © {new Date().getFullYear()} {site.name}. {site.tagline}.
          </p>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            WhatsApp {site.whatsappDisplay}
          </a>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWa() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full border-2 border-ink bg-white p-1.5 font-bold sm:pr-4 shadow-[0_4px_0_#15132B] transition-transform hover:-translate-y-0.5 sm:right-6 sm:bottom-6"
      aria-label="Chat Webkeun di WhatsApp"
    >
      <Mascot mood="kedip" className="w-10 transition-transform group-hover:rotate-[-8deg]" />
      <span className="hidden text-sm sm:inline">Chat kami</span>
    </a>
  );
}
