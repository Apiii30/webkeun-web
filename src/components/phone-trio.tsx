import Image from "next/image";
import type { CSSProperties } from "react";
import { Icon } from "./icons";

type Props = {
  name: string;
  cover: string;
  screens: readonly string[];
  tone: { bg: string; accent: string };
  // lebar HP tengah kira-kira di layar, untuk sizes gambar
  width: number;
  className?: string;
};

// Panggung 3 HP untuk template undangan (undangan khusus tampilan HP, jadi tanpa tampilan laptop).
// Sampul di depan, mempelai & acara mengipas di belakangnya, di atas warna tema undangannya. Ukuran HP mengikuti
// tinggi panggung, jadi sama bagusnya di kartu kecil maupun panel besar. Saat induknya (class "group") di-hover,
// kipasnya makin terbuka dan HP tengah sedikit terangkat.
export function PhoneTrio({ name, cover, screens, tone, width, className = "" }: Props) {
  const [kiri, kanan] = screens;
  const gerak =
    "transition-[translate,rotate,scale] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none";

  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: tone.bg, "--aksen": tone.accent } as CSSProperties}
    >
      {/* riak lingkaran & cahaya lembut di belakang HP, warna aksen tema */}
      <div
        aria-hidden="true"
        className="absolute top-[62%] left-1/2 -z-10 aspect-square w-[max(150%,40rem)] -translate-1/2 rounded-full [background:repeating-radial-gradient(circle,transparent_0_6.5%,color-mix(in_oklab,var(--aksen)_22%,transparent)_6.5%_6.75%)] transition-[scale] duration-1000 ease-out group-hover:scale-110 motion-reduce:transition-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-[60%] left-1/2 -z-10 aspect-square w-[70%] -translate-1/2 rounded-full bg-(--aksen) opacity-25 blur-3xl"
      />
      {/* bayangan lantai di bawah HP */}
      <div
        aria-hidden="true"
        className="absolute bottom-[3%] left-1/2 -z-10 h-[7%] w-[72%] -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl"
      />
      <Kilau className="top-[16%] left-[12%] size-4" jeda="0s" />
      <Kilau className="top-[30%] right-[10%] size-3" jeda="-1.4s" />
      <Kilau className="top-[8%] right-[30%] size-2.5" jeda="-2.2s" />

      <Hp
        src={kiri}
        alt={`Bagian mempelai undangan ${name}`}
        sizes={`${Math.round(width * 0.85)}px`}
        className={`h-[70%] origin-bottom -translate-x-[152%] -rotate-9 group-hover:-translate-x-[164%] group-hover:-rotate-12 ${gerak}`}
        jeda="0.15s"
      />
      <Hp
        src={kanan}
        alt={`Bagian acara undangan ${name}`}
        sizes={`${Math.round(width * 0.85)}px`}
        className={`h-[70%] origin-bottom translate-x-[52%] rotate-9 group-hover:translate-x-[64%] group-hover:rotate-12 ${gerak}`}
        jeda="0.25s"
      />
      <Hp
        src={cover}
        alt={`Sampul undangan ${name}`}
        sizes={`${width}px`}
        className={`z-10 h-[84%] -translate-x-1/2 group-hover:-translate-y-[3%] group-hover:scale-[1.03] ${gerak}`}
        jeda="0s"
      />

      <span className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm backdrop-blur-sm">
        <Icon name="phone" className="size-3.5" />
        Khusus tampilan HP
      </span>
    </div>
  );
}

function Hp({
  src,
  alt,
  sizes,
  className,
  jeda,
}: {
  src: string;
  alt: string;
  sizes: string;
  className: string;
  jeda: string;
}) {
  return (
    <div className={`absolute bottom-[6%] left-1/2 aspect-[100/193] ${className}`}>
      <div
        className="relative h-full w-full animate-phone-in rounded-[17%/8.8%] bg-[#111018] p-[3.5%] shadow-[0_24px_40px_-24px_rgb(0_0_0/0.55)] ring-1 ring-white/15"
        style={{ animationDelay: jeda }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[13.5%/6.8%] bg-white">
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
          {/* kilap kaca */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

function Kilau({ className, jeda }: { className: string; jeda: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`absolute -z-10 animate-twinkle text-(--aksen) ${className}`}
      style={{ animationDelay: jeda }}
    >
      <path
        d="M12 0c.8 6.6 5.4 11.2 12 12-6.6.8-11.2 5.4-12 12-.8-6.6-5.4-11.2-12-12C6.6 11.2 11.2 6.6 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
