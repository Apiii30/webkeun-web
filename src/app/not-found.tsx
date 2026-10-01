import Link from "next/link";
import { Mascot } from "@/components/mascot";

export default function NotFound() {
  return (
    <main className="grid flex-1 place-items-center px-4 py-24 text-center">
      <div>
        <Mascot mood="kaget" className="mx-auto w-40 -rotate-6" />
        <h1 className="mt-8 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
          Eh, halamannya nggak ada.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink/70">
          Mungkin link-nya salah ketik, atau halaman ini memang belum di-webkeun.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-brand px-7 py-4 font-bold text-white hover:bg-brand-deep"
        >
          Balik ke beranda
        </Link>
      </div>
    </main>
  );
}
