"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, waLink } from "@/lib/site";
import { Icon } from "./icons";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        className={`mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl pr-2.5 pl-4 backdrop-blur-md transition-[background-color,box-shadow] duration-300 sm:pl-5 ${
          scrolled ? "bg-white/90 shadow-[0_8px_30px_-12px_rgb(21_19_43/0.25)]" : "bg-white/70"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="Webkeun, ke beranda">
          <Image src="/brand/logo-wk.svg" alt="" width={38} height={27} preload />
          <Image src="/brand/tulisan.svg" alt="Webkeun" width={104} height={20} preload />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[15px] font-medium text-ink/80 transition-colors hover:bg-lilac-soft hover:text-brand"
              >
                <Icon name={l.icon} className="size-4" />
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 rounded-full bg-brand py-1.5 pr-1.5 pl-4 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          Chat WA
          <span className="grid size-8 place-items-center rounded-full bg-white text-brand">
            <Icon name="whatsapp" className="size-4" />
          </span>
        </a>
      </nav>
    </header>
  );
}

const bottomLinks = [
  { href: "#beranda", label: "Beranda", icon: "home" },
  ...navLinks.filter((l) => l.href !== "#cara-kerja"),
] as const;

// Navigasi bawah ala aplikasi, hanya tampil di HP
export function BottomNav() {
  return (
    <nav
      aria-label="Navigasi cepat"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto flex max-w-md justify-between px-2">
        {bottomLinks.map((l) => (
          <li key={l.href} className="flex-1">
            <a
              href={l.href}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-ink/60 transition-colors active:text-brand"
            >
              <Icon name={l.icon} className="size-5" />
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
