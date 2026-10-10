"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

// Link ke halaman demo template. Bawaan Next menyiapkan (prefetch) halaman tujuan begitu link-nya terlihat di layar, ikut
// dengan font & CSS temanya. Galeri berisi belasan demo, jadi pengunjung yang sekadar menggulir ikut mengunduh ±1,5 MB
// untuk demo yang belum tentu dibuka. Di sini demo baru disiapkan saat link disentuh, ditunjuk kursor, atau difokus,
// jadi saat diklik tetap terasa cepat.
export function LinkDemo({ href, onPointerEnter, onFocus, ...props }: Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & { href: string }) {
  const router = useRouter();
  return (
    <Link
      href={href}
      prefetch={false}
      onPointerEnter={(e) => {
        router.prefetch(href);
        onPointerEnter?.(e);
      }}
      onFocus={(e) => {
        router.prefetch(href);
        onFocus?.(e);
      }}
      {...props}
    />
  );
}
