"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/site";
import { Icon } from "./icons";
import { Mascot } from "./mascot";

const topics = [
  { label: "Website UMKM", msg: "Halo Webkeun! Aku mau bikin website buat usahaku." },
  { label: "Company profile", msg: "Halo Webkeun! Aku mau bikin company profile perusahaan." },
  { label: "Portofolio", msg: "Halo Webkeun! Aku mau bikin website portofolio." },
  { label: "Tanya harga", msg: "Halo Webkeun! Aku mau tanya-tanya soal harga paketnya." },
];

// Tombol chat melayang: maskot sebagai "admin", pilih topik lalu lanjut ke WhatsApp
export function ChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed right-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 sm:right-6 md:bottom-6">
      {open && (
        <div
          id="chat-webkeun"
          role="dialog"
          aria-label="Chat dengan Webkeun"
          className="absolute right-0 bottom-[4.5rem] w-[min(20rem,calc(100vw-2rem))] origin-bottom-right animate-rise overflow-hidden rounded-3xl bg-white shadow-[0_30px_70px_-20px_rgb(21_19_43/0.45)]"
        >
          <div className="flex items-center gap-3 bg-brand px-4 py-3.5 text-white">
            <span className="grid size-10 place-items-center rounded-full bg-lilac">
              <Mascot mood="senyum" className="w-8" />
            </span>
            <div className="flex-1">
              <p className="font-bold">Webkeun</p>
              <p className="flex items-center gap-1.5 text-xs text-white/80">
                <span className="size-2 rounded-full bg-mint" />
                Lewat WhatsApp
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-8 place-items-center rounded-full hover:bg-white/15"
              aria-label="Tutup chat"
            >
              <Icon name="close" className="size-4" strokeWidth={2.5} />
            </button>
          </div>

          <div className="space-y-3 bg-lilac-soft p-4">
            <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm">
              Halo! 👋 Mau dibikinin website apa? Pilih aja topiknya, nanti lanjut ngobrol di WhatsApp.
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              {topics.map((t) => (
                <a
                  key={t.label}
                  href={waLink(t.msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-brand ring-1 ring-brand/25 hover:bg-brand hover:text-white"
                >
                  {t.label}
                </a>
              ))}
            </div>
          </div>

          <div className="p-3">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-wa py-2.5 font-bold text-white hover:brightness-95"
            >
              <Icon name="whatsapp" className="size-5" />
              Mulai chat WhatsApp
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-webkeun"
        aria-label={open ? "Tutup chat" : "Chat Webkeun di WhatsApp"}
        className="group relative grid size-15 place-items-center rounded-[1.4rem] bg-lilac shadow-[0_14px_30px_-10px_rgb(91_61_245/0.6)] ring-4 ring-white transition-transform hover:-translate-y-0.5"
      >
        <Mascot mood={open ? "senyum" : "kedip"} className="w-12 transition-transform group-hover:-rotate-6" />
        {!open && (
          <span className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-wa text-white ring-2 ring-white">
            <Icon name="whatsapp" className="size-3.5" />
          </span>
        )}
      </button>
    </div>
  );
}
