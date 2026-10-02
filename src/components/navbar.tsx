"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { aboutLinks, navLinks, resourcesLinks, services, site, templateCategories, templates, waLink } from "@/lib/site";
import { Icon, type IconName } from "./icons";

type MenuKey = "layanan" | "template" | "resources";

function WaStrip({ title, desc, message, onNavigate }: { title: string; desc: string; message: string; onNavigate: () => void }) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      className="group mt-2 flex items-center justify-between gap-3 rounded-2xl bg-brand px-5 py-3.5 text-white transition-colors hover:bg-brand-deep"
    >
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-white/75">{desc}</span>
      </span>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-brand transition-transform group-hover:translate-x-0.5">
        <Icon name="whatsapp" className="size-4" />
      </span>
    </a>
  );
}

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
                  className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white"
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

      <WaStrip
        title="Bingung pilih yang mana?"
        desc="Konsultasi gratis lewat WhatsApp"
        message="Halo Webkeun! Aku masih bingung pilih layanan yang mana, bisa bantu?"
        onNavigate={onNavigate}
      />
    </>
  );
}

// Isi menu "Template": pilih kategori, langsung terfilter di halaman template
function TemplateMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <ul className="grid gap-1 p-1 md:grid-cols-2">
        {templateCategories.map((c) => {
          const count = templates.filter((t) => t.category === c.slug).length;
          return (
            <li key={c.slug}>
              <Link
                href={`/template?kategori=${c.slug}`}
                onClick={onNavigate}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-lilac-soft"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lilac-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">{c.label}</span>
                  <span className="block truncate text-sm text-ink/55">
                    {count} template · {c.desc}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href="/template"
        onClick={onNavigate}
        className="group mt-2 flex items-center justify-between gap-3 rounded-2xl bg-brand px-5 py-3.5 text-white transition-colors hover:bg-brand-deep"
      >
        <span>
          <span className="block font-semibold">Lihat semua template</span>
          <span className="block text-sm text-white/75">{templates.length} template siap pakai</span>
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-brand transition-transform group-hover:translate-x-0.5">
          <Icon name="arrow" className="size-4" strokeWidth={2.5} />
        </span>
      </Link>
    </>
  );
}

// Isi menu "Resources"
function ResourcesMenu({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <ul className="p-1">
        {resourcesLinks.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-lilac-soft ${
                pathname === l.href ? "bg-lilac-soft" : ""
              }`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lilac-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <Icon name={l.icon} className="size-5" />
              </span>
              <span>
                <span className="block font-semibold">{l.label}</span>
                <span className="block text-sm text-ink/55">{l.desc}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <WaStrip
        title="Chat WhatsApp"
        desc={site.whatsappDisplay}
        message="Halo Webkeun, aku mau tanya-tanya dulu nih."
        onNavigate={onNavigate}
      />
    </>
  );
}

const panelClass = (open: boolean) =>
  `absolute top-full mt-3 hidden rounded-3xl bg-white p-2 text-ink shadow-[0_30px_70px_-24px_rgb(21_19_43/0.4)] ring-1 ring-ink/5 transition-[opacity,translate,visibility] duration-300 ease-out before:absolute before:inset-x-0 before:-top-3 before:h-3 md:block ${
    open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
  }`;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuKey | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu bisa terbuka karena hover (sementara) atau karena panahnya diklik (terkunci sampai ditutup).
  // Hanya satu menu yang terbuka dalam satu waktu.
  const pinned = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const close = () => {
    clearTimeout(closeTimer.current);
    pinned.current = false;
    setOpen(null);
  };
  const toggle = (key: MenuKey) => {
    clearTimeout(closeTimer.current);
    if (open === key && pinned.current) return close();
    pinned.current = true;
    setOpen(key);
  };
  // Hover khusus mouse. Tutupnya diberi jeda supaya kursor sempat pindah ke panel.
  const hoverOpen = (key: MenuKey) => (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    if (open !== key) pinned.current = false;
    setOpen(key);
  };
  const hoverClose = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse" || pinned.current) return;
    closeTimer.current = setTimeout(() => setOpen(null), 180);
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

  // Tombol menu: tulisannya pindah halaman, panahnya membuka/mengunci dropdown
  const menuTrigger = (key: MenuKey, label: string, icon: IconName, href: string, active: boolean, panel?: ReactNode) => (
    <li
      onPointerEnter={hoverOpen(key)}
      onPointerLeave={hoverClose}
      // Panel Resources kecil, jadi menempel di bawah tombolnya; panel lain lebar dan berada di tengah navbar
      className={`${key === "resources" ? "relative" : ""} flex items-center rounded-xl transition-colors hover:bg-lilac-soft ${
        open === key || active ? "bg-lilac-soft text-brand" : "text-ink/80"
      }`}
    >
      <Link
        href={href}
        onClick={close}
        className="flex items-center gap-1.5 py-2 pl-3 text-[15px] font-medium transition-colors hover:text-brand"
      >
        <Icon name={icon} className="size-4" />
        {label}
      </Link>
      <button
        type="button"
        onClick={() => toggle(key)}
        aria-expanded={open === key}
        aria-controls={`menu-${key}`}
        aria-label={open === key ? `Tutup menu ${label.toLowerCase()}` : `Buka menu ${label.toLowerCase()}`}
        className="grid place-items-center self-stretch pr-2.5 pl-1 transition-colors hover:text-brand"
      >
        <Icon
          name="chevron"
          className={`size-4 transition-transform duration-300 ${open === key ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>
      {panel}
    </li>
  );

  const plainLink = (l: (typeof navLinks)[number]) => {
    return (
      <li key={l.href}>
        <Link
          href={l.href}
          onClick={close}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[15px] font-medium text-ink/80 transition-colors hover:bg-lilac-soft hover:text-brand"
        >
          <Icon name={l.icon} className="size-4" />
          {l.label}
        </Link>
      </li>
    );
  };

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
          {/* Dari halaman lain, "Layanan" membuka landing page dari atas; di landing page, menggulir ke section-nya */}
          {menuTrigger("layanan", "Layanan", "layers", pathname === "/" ? "/#layanan" : "/", false)}
          {menuTrigger(
            "template",
            "Template",
            "browser",
            "/template",
            pathname.startsWith("/template"),
            <div
              id="menu-template"
              inert={open !== "template"}
              className={`left-1/2 w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 ${panelClass(open === "template")}`}
            >
              <TemplateMenu onNavigate={close} />
            </div>,
          )}
          {menuTrigger(
            "resources",
            "Resources",
            "book",
            "/tentang",
            resourcesLinks.some((l) => pathname === l.href),
            <div
              id="menu-resources"
              inert={open !== "resources"}
              className={`left-1/2 w-[21rem] -translate-x-1/2 ${panelClass(open === "resources")}`}
            >
              <ResourcesMenu onNavigate={close} />
            </div>,
          )}
          {navLinks.map(plainLink)}
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

        {/* Panel Layanan lebar, jadi diletakkan di tengah navbar */}
        <div
          id="menu-layanan"
          inert={open !== "layanan"}
          onPointerEnter={hoverOpen("layanan")}
          onPointerLeave={hoverClose}
          className={`left-1/2 w-[min(46rem,calc(100vw-2rem))] -translate-x-1/2 ${panelClass(open === "layanan")}`}
        >
          <LayananMenu onNavigate={close} />
        </div>
      </nav>
    </header>
  );
}

const sheetTitle: Record<MenuKey, string> = { layanan: "Layanan", template: "Template", resources: "Resources" };

// Navigasi bawah ala aplikasi, hanya tampil di HP
export function BottomNav() {
  const pathname = usePathname();
  const [sheet, setSheet] = useState<MenuKey | null>(null);
  // Isi sheet tetap dipertahankan selama animasi menutup
  const [content, setContent] = useState<MenuKey>("layanan");
  const openSheet = (key: MenuKey) => {
    setContent(key);
    setSheet(key);
  };
  const closeSheet = () => setSheet(null);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const item = "flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors";
  const tone = (active: boolean) => (active ? "text-brand" : "text-ink/60");
  const sheetButton = (key: MenuKey, icon: IconName, active: boolean) => (
    <li className="flex-1">
      <button
        type="button"
        onClick={() => openSheet(key)}
        aria-expanded={sheet === key}
        className={`${item} ${tone(sheet === key || active)}`}
      >
        <Icon name={icon} className="size-5" />
        {sheetTitle[key]}
      </button>
    </li>
  );
  const link = (href: string, label: string, icon: IconName, active: boolean) => (
    <li className="flex-1">
      <Link href={href} className={`${item} ${tone(active)}`}>
        <Icon name={icon} className="size-5" />
        {label}
      </Link>
    </li>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-[visibility] duration-300 md:hidden ${sheet ? "visible" : "invisible"}`}
        inert={!sheet}
      >
        <button
          type="button"
          aria-label={`Tutup menu ${sheetTitle[content].toLowerCase()}`}
          onClick={closeSheet}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${sheet ? "opacity-100" : "opacity-0"}`}
        />
        <div
          role="dialog"
          aria-label={`Menu ${sheetTitle[content].toLowerCase()}`}
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform duration-300 ease-out ${
            sheet ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center justify-between px-3 pt-1 pb-2">
            <p className="text-lg font-bold">{sheetTitle[content]}</p>
            <button
              type="button"
              onClick={closeSheet}
              aria-label="Tutup"
              className="grid size-9 place-items-center rounded-full bg-lilac-soft"
            >
              <Icon name="close" className="size-4" strokeWidth={2.5} />
            </button>
          </div>
          {content === "layanan" && <LayananMenu onNavigate={closeSheet} />}
          {content === "template" && <TemplateMenu onNavigate={closeSheet} />}
          {content === "resources" && <ResourcesMenu onNavigate={closeSheet} />}
        </div>
      </div>

      <nav
        aria-label="Navigasi cepat"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <ul className="mx-auto flex max-w-md justify-between px-2">
          {link("/#beranda", "Beranda", "home", false)}
          {sheetButton("layanan", "layers", false)}
          {sheetButton("template", "browser", pathname.startsWith("/template"))}
          {sheetButton("resources", "book", resourcesLinks.some((l) => pathname === l.href))}
          {link("/#faq", "FAQ", "help", false)}
        </ul>
      </nav>
    </>
  );
}
