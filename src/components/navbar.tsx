"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { aboutLinks, navLinks, services, waLink } from "@/lib/site";
import { Icon } from "./icons";

// Isi menu "Layanan", dipakai di dropdown desktop dan bottom sheet HP
function LayananMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <div className="grid gap-2 md:grid-cols-[1.25fr_1fr]">
        <div className="p-2">
          <p className="px-3 pb-2 text-xs font-bold tracking-[0.14em] text-ink/45 uppercase">Jenis website</p>
          <ul>
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/#${s.slug}`}
                  onClick={onNavigate}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-lilac-soft"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lilac-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon name={s.icon} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{s.title}</span>
                    <span className="block truncate text-sm text-ink/55">{s.short}</span>
                  </span>
                  <span className="hidden shrink-0 text-xs font-semibold text-brand sm:block">{s.price}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-lilac-soft p-2">
          <p className="px-3 pt-2 pb-2 text-xs font-bold tracking-[0.14em] text-ink/45 uppercase">Kenali Webkeun</p>
          <ul>
            {aboutLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={onNavigate}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white"
                >
                  <Icon name={l.icon} className="size-[18px] shrink-0 text-brand" />
                  <span>
                    <span className="block text-[15px] font-semibold">{l.label}</span>
                    <span className="block text-sm text-ink/55">{l.desc}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <a
        href={waLink("Halo Webkeun! Aku masih bingung pilih layanan yang mana, bisa bantu?")}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className="group mt-2 flex items-center justify-between gap-3 rounded-2xl bg-brand px-5 py-3.5 text-white transition-colors hover:bg-brand-deep"
      >
        <span>
          <span className="block font-semibold">Bingung pilih yang mana?</span>
          <span className="block text-sm text-white/75">Konsultasi gratis lewat WhatsApp</span>
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-brand transition-transform group-hover:translate-x-0.5">
          <Icon name="whatsapp" className="size-4" />
        </span>
      </a>
    </>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu bisa terbuka karena hover (sementara) atau karena panahnya diklik (terkunci sampai ditutup)
  const pinned = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const close = () => {
    clearTimeout(closeTimer.current);
    pinned.current = false;
    setOpen(false);
  };
  const toggle = () => {
    clearTimeout(closeTimer.current);
    if (open && pinned.current) return close();
    pinned.current = true;
    setOpen(true);
  };
  // Hover khusus mouse. Tutupnya diberi jeda supaya kursor sempat pindah ke panel.
  const hoverOpen = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hoverClose = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse" || pinned.current) return;
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Tutup dropdown saat klik di luar navbar atau tekan Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkClass = (active: boolean) =>
    `flex items-center gap-1.5 rounded-xl px-3 py-2 text-[15px] font-medium transition-colors hover:bg-lilac-soft hover:text-brand ${
      active ? "bg-lilac-soft text-brand" : "text-ink/80"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        ref={navRef}
        aria-label="Menu utama"
        className={`relative mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl pr-2.5 pl-4 backdrop-blur-md transition-[background-color,box-shadow] duration-300 sm:pl-5 ${
          scrolled || open ? "bg-white/90 shadow-[0_8px_30px_-12px_rgb(21_19_43/0.25)]" : "bg-white/70"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="Webkeun, ke beranda">
          <Image src="/brand/logo-wk.svg" alt="" width={38} height={27} preload />
          <Image src="/brand/tulisan.svg" alt="Webkeun" width={104} height={20} preload />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {/* Tulisan "Layanan" menuju section layanan; panahnya membuka menu */}
          <li
            onPointerEnter={hoverOpen}
            onPointerLeave={hoverClose}
            className={`flex items-center rounded-xl transition-colors hover:bg-lilac-soft ${
              open ? "bg-lilac-soft text-brand" : "text-ink/80"
            }`}
          >
            <Link
              href="/#layanan"
              onClick={close}
              className="flex items-center gap-1.5 py-2 pl-3 text-[15px] font-medium transition-colors hover:text-brand"
            >
              <Icon name="layers" className="size-4" />
              Layanan
            </Link>
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls="menu-layanan"
              aria-label={open ? "Tutup menu layanan" : "Buka menu layanan"}
              className="grid place-items-center self-stretch pr-2.5 pl-1 transition-colors hover:text-brand"
            >
              <Icon
                name="chevron"
                className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                strokeWidth={2.5}
              />
            </button>
          </li>
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={close}
                className={linkClass(l.href === "/template" && pathname.startsWith("/template"))}
              >
                <Icon name={l.icon} className="size-4" />
                {l.label}
              </Link>
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

        <div
          id="menu-layanan"
          inert={!open}
          onPointerEnter={hoverOpen}
          onPointerLeave={hoverClose}
          className={`absolute top-full left-1/2 mt-3 hidden before:absolute before:inset-x-0 before:-top-3 before:h-3 w-[min(46rem,calc(100vw-2rem))] -translate-x-1/2 rounded-3xl bg-white p-2 shadow-[0_30px_70px_-24px_rgb(21_19_43/0.4)] ring-1 ring-ink/5 transition-[opacity,translate,visibility] duration-300 ease-out md:block ${
            open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <LayananMenu onNavigate={close} />
        </div>
      </nav>
    </header>
  );
}

// Navigasi bawah ala aplikasi, hanya tampil di HP
export function BottomNav() {
  const pathname = usePathname();
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const item = "flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors";
  const tone = (active: boolean) => (active ? "text-brand" : "text-ink/60");

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-[visibility] duration-300 md:hidden ${sheet ? "visible" : "invisible"}`}
        inert={!sheet}
      >
        <button
          type="button"
          aria-label="Tutup menu layanan"
          onClick={() => setSheet(false)}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${sheet ? "opacity-100" : "opacity-0"}`}
        />
        <div
          role="dialog"
          aria-label="Menu layanan"
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform duration-300 ease-out ${
            sheet ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center justify-between px-3 pt-1 pb-2">
            <p className="text-lg font-bold">Layanan</p>
            <button
              type="button"
              onClick={() => setSheet(false)}
              aria-label="Tutup"
              className="grid size-9 place-items-center rounded-full bg-lilac-soft"
            >
              <Icon name="close" className="size-4" strokeWidth={2.5} />
            </button>
          </div>
          <LayananMenu onNavigate={() => setSheet(false)} />
        </div>
      </div>

      <nav
        aria-label="Navigasi cepat"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <ul className="mx-auto flex max-w-md justify-between px-2">
          <li className="flex-1">
            <Link href="/#beranda" className={`${item} ${tone(false)}`}>
              <Icon name="home" className="size-5" />
              Beranda
            </Link>
          </li>
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setSheet(true)}
              aria-expanded={sheet}
              className={`${item} ${tone(sheet)}`}
            >
              <Icon name="layers" className="size-5" />
              Layanan
            </button>
          </li>
          {navLinks.map((l) => (
            <li key={l.href} className="flex-1">
              <Link
                href={l.href}
                className={`${item} ${tone(l.href === "/template" && pathname.startsWith("/template"))}`}
              >
                <Icon name={l.icon} className="size-5" />
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
