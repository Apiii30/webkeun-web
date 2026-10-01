"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, waLink } from "@/lib/site";
import { WhatsAppIcon } from "./brand";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-paper transition-[border-color] ${
        scrolled || open ? "border-b-2 border-ink" : "border-b-2 border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Webkeun, ke beranda">
          <Image src="/brand/logo-wk.svg" alt="" width={40} height={29} priority />
          <Image src="/brand/tulisan.svg" alt="Webkeun" width={108} height={21} priority className="hidden sm:block" />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors hover:bg-lilac"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-paper transition-transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="size-4 text-mint" />
            Chat WA
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full hover:bg-lilac md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 h-[3px] w-5 rounded-full bg-ink transition-transform ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-[3px] rounded-full bg-ink transition-all ${
                  open ? "top-1.5 w-5 -rotate-45" : "top-3 w-3.5"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <ul id="menu-mobile" className="border-t-2 border-ink px-4 pb-5 pt-2 md:hidden">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-ink/10 py-3.5 font-display text-2xl font-bold"
              >
                {l.label}
                <span className="size-2.5 rounded-full bg-mint" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
