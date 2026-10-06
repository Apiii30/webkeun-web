import type { Metadata } from "next";
import { ClosingCta } from "@/components/sections/closing";
import { Faq } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { Facts, Hero } from "@/components/sections/hero";
import { Portfolio } from "@/components/sections/portfolio";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";
import { Why } from "@/components/sections/why";
import { halaman, SITUS } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = halaman({ deskripsi: site.description, path: "/" });

// Data terstruktur untuk Google: siapa Webkeun (nama, logo, kontak) dan nama situsnya, supaya hasil pencarian
// menampilkan "Webkeun" sebagai nama situs, bukan alamat domainnya.
const asal = SITUS.origin;
const dataTerstruktur = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${asal}/#organisasi`,
      name: site.name,
      url: `${asal}/`,
      logo: `${asal}/brand/logo-wk.svg`,
      description: site.description,
      slogan: site.tagline,
      email: site.email,
      areaServed: { "@type": "Country", name: "Indonesia" },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: `+${site.whatsapp}`,
        email: site.email,
        availableLanguage: ["Indonesian"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${asal}/#situs`,
      name: site.name,
      alternateName: SITUS.host,
      url: `${asal}/`,
      inLanguage: "id-ID",
      publisher: { "@id": `${asal}/#organisasi` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dataTerstruktur).replace(/</g, "\\u003c") }} />
      <Hero />
      <Facts />
      <Why />
      <Features />
      <Services />
      <Portfolio />
      <Testimonials />
      <Pricing />
      <Process />
      <Faq />
      <ClosingCta />
    </>
  );
}
