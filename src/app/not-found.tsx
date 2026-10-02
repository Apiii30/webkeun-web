import { PillLink } from "@/components/brand";
import { Mascot } from "@/components/mascot";

export default function NotFound() {
  return (
    <main className="grid flex-1 place-items-center bg-lilac-soft px-4 py-24 text-center">
      <div>
        <Mascot mood="kaget" className="mx-auto w-36 -rotate-6" />
        <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
          Eh, halamannya <span className="text-brand">nggak ada.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink/70">
          Mungkin link-nya salah ketik, atau halaman ini memang belum di-webkeun.
        </p>
        <PillLink href="/" size="lg" icon="home" className="mt-8">
          Balik ke beranda
        </PillLink>
      </div>
    </main>
  );
}
