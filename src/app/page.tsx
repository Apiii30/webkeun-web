import { Navbar } from "@/components/navbar";
import { ClosingCta, FloatingWa, Footer } from "@/components/sections/closing";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Portfolio } from "@/components/sections/portfolio";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Pricing />
        <Process />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
      <FloatingWa />
    </>
  );
}
