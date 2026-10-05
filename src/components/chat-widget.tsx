"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { waLink } from "@/lib/site";
import { HeroMascot } from "./hero-mascot";
import { Icon } from "./icons";
import { Mascot } from "./mascot";

const topics = [
  { label: "Website UMKM", msg: "Halo Webkeun! Aku mau bikin website buat usahaku." },
  { label: "Company profile", msg: "Halo Webkeun! Aku mau bikin company profile perusahaan." },
  { label: "Portofolio", msg: "Halo Webkeun! Aku mau bikin website portofolio." },
  { label: "Undangan digital", msg: "Halo Webkeun! Aku mau pesan undangan digital." },
  { label: "Tanya harga", msg: "Halo Webkeun! Aku mau tanya-tanya soal harga paketnya." },
];

// Sapaan menyesuaikan halaman. Halaman tanpa sapaan (mis. /kontak) tidak disapa.
const greetings: Record<string, string> = {
  "/": "Halo! 👋 Mau dibikinin website apa?",
  "/template": "Naksir template yang mana? Tanya aja 😄",
  "/template/undangan": "Lagi cari tema undangan? Tanya aja 😄",
  "/tentang": "Ada yang mau ditanyain soal Webkeun?",
};
const pricingGreeting = "Bingung pilih paket? Sini aku bantu pilihin!";

type Teaser = "hidden" | "typing" | "shown";

// Tombol chat melayang: maskot sebagai "admin". Matanya mengikuti kursor, sesekali menyapa,
// lalu pengunjung memilih topik dan lanjut ke WhatsApp.
export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState<Teaser>("hidden");
  const [message, setMessage] = useState("");
  const [unread, setUnread] = useState(false);
  const [calm, setCalm] = useState(false); // berhenti goyang setelah pengunjung berinteraksi
  const seen = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => timers.current.forEach(clearTimeout);
  // Setelah sapaan ditutup atau chat dibuka, jangan menyapa lagi sampai halaman di-refresh.
  // Ingatannya hanya di memori: pindah halaman tetap diingat, refresh mulai dari awal lagi.
  const markSeen = () => {
    seen.current = true;
    setCalm(true);
    clearTimers();
  };

  // Tampilkan "sedang mengetik…", lalu pesannya, lalu sembunyikan lagi setelah beberapa detik
  const greet = useCallback((text: string, delay: number) => {
    if (seen.current) return;
    timers.current.forEach(clearTimeout);
    timers.current = [
      setTimeout(() => {
        setMessage(text);
        setTeaser("typing");
      }, delay),
      setTimeout(() => {
        setTeaser("shown");
        setUnread(true);
      }, delay + 1300),
      setTimeout(() => setTeaser("hidden"), delay + 1300 + 9000),
    ];
  }, []);

  useEffect(() => {

    const text = greetings[pathname];
    if (text) greet(text, 3500);

    // Di beranda, sapa sekali lagi saat pengunjung sampai di section harga
    const harga = pathname === "/" ? document.getElementById("harga") : null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        greet(pricingGreeting, 600);
      },
      { threshold: 0.35 },
    );
    if (harga) io.observe(harga);

    return () => {
      io.disconnect();
      clearTimers();
    };
  }, [pathname, greet]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = () => {
    markSeen();
    setTeaser("hidden");
    setUnread(false);
    setOpen((v) => !v);
  };
  const dismiss = () => {
    markSeen();
    setTeaser("hidden");
    setUnread(false);
  };

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
              Halo! 👋 Mau dibikinin apa? Pilih aja topiknya, nanti lanjut ngobrol di WhatsApp.
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

      {/* Gelembung sapaan */}
      {!open && teaser !== "hidden" && (
        <div
          role="status"
          className="absolute right-0 bottom-[4.75rem] w-max max-w-[min(16rem,calc(100vw-2rem))] origin-bottom-right animate-bubble-in"
        >
          <div className="relative rounded-2xl rounded-br-md bg-white px-4 py-3 shadow-[0_18px_40px_-16px_rgb(21_19_43/0.45)] ring-1 ring-ink/5">
            {teaser === "typing" ? (
              <span className="flex items-center gap-1 py-1" aria-label="Webkeun sedang mengetik">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="size-2 animate-typing rounded-full bg-brand"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </span>
            ) : (
              <>
                <button type="button" onClick={toggle} className="block pr-3 text-left">
                  <span className="block text-[15px] font-semibold">{message}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                    Chat sekarang
                    <Icon name="arrow" className="size-3.5" strokeWidth={2.5} />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label="Tutup sapaan"
                  className="absolute -top-2 -left-2 grid size-6 place-items-center rounded-full bg-ink text-white shadow"
                >
                  <Icon name="close" className="size-3" strokeWidth={3} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="chat-webkeun"
        aria-label={open ? "Tutup chat" : "Chat Webkeun di WhatsApp"}
        className="chat-fab group relative grid size-15 animate-fab-in place-items-center rounded-[1.4rem] bg-lilac shadow-[0_14px_30px_-10px_rgb(91_61_245/0.6)] ring-4 ring-white transition-[translate] hover:-translate-y-1"
      >
        {/* Goyang kecil sesekali untuk menarik perhatian, berhenti setelah chat pernah dibuka */}
        <span className={open || calm ? "" : "animate-fab-attn"}>
          <HeroMascot className="w-12" />
        </span>
        {!open &&
          (unread ? (
            <span className="absolute -top-1.5 -right-1.5 grid size-6 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#ff5a5f]/60" />
              <span className="relative grid size-6 place-items-center rounded-full bg-[#ff5a5f] text-xs font-bold text-white ring-2 ring-white">
                1
              </span>
            </span>
          ) : (
            <span className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-wa text-white ring-2 ring-white">
              <Icon name="whatsapp" className="size-3.5" />
            </span>
          ))}
      </button>
    </div>
  );
}
