"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { waLink } from "@/lib/site";

const noop = () => () => {};

// Banner kecil di halaman demo. Disembunyikan saat demo tampil sebagai pratinjau (iframe) di beranda.
export function DemoBanner({ name }: { name: string }) {
  const inIframe = useSyncExternalStore(
    noop,
    () => window.self !== window.top,
    () => true,
  );
  if (inIframe) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 rounded-full bg-[#15132B] py-2 pr-2 pl-5 font-sans text-sm text-white shadow-[0_20px_40px_-16px_rgb(21_19_43/0.6)] max-sm:rounded-3xl max-sm:p-3">
      <p>
        <span className="font-bold text-[#2FD3B0]">Demo</span> · {name} adalah contoh website buatan{" "}
        <Link href="/" className="font-bold underline underline-offset-2">
          Webkeun
        </Link>
      </p>
      <a
        href={waLink(`Halo Webkeun! Aku lihat demo ${name}, mau dibikinin yang mirip.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-[#2FD3B0] px-4 py-2 font-bold text-[#15132B] max-sm:w-full max-sm:text-center"
      >
        Mau yang kayak gini
      </a>
    </div>
  );
}
