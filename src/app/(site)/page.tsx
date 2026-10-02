import { ClosingCta } from "@/components/sections/closing";
import { Faq } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { Facts, Hero } from "@/components/sections/hero";
import { Portfolio } from "@/components/sections/portfolio";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Why } from "@/components/sections/why";

export default function Home() {
  return (
    <>
      <Hero />
      <Facts />
      <Why />
      <Features />
      <Services />
      <Portfolio />
      <Pricing />
      <Process />
      <Faq />
      <ClosingCta />
    </>
  );
}
