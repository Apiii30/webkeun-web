import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./icons";

// Garis tebal ujung bulat + titik mint, diambil dari bentuk logo "wk".
export function StrokeUnderline({ children, color = "#5B3DF5" }: { children: ReactNode; color?: string }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 300 24"
        preserveAspectRatio="none"
        className="absolute bottom-[-0.14em] left-0 h-[0.28em] w-full overflow-visible"
        aria-hidden="true"
      >
        <path
          d="M4 14 C 80 6, 220 6, 296 13"
          fill="none"
          stroke={color}
          style={{ strokeWidth: "0.1em" }}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          className="animate-draw"
        />
      </svg>
      <span
        className="absolute right-[-0.22em] bottom-[-0.08em] size-[0.16em] animate-pop rounded-full bg-mint"
        aria-hidden="true"
      />
    </span>
  );
}

// Label kecil di atas judul section
export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold tracking-[0.14em] text-brand uppercase ring-1 ring-brand/15 ${className}`}
    >
      <span className="size-2 rounded-full bg-mint" />
      {children}
    </p>
  );
}

// Judul dua baris: baris pertama tinta, baris kedua ungu brand
export function SectionHeading({
  top,
  bottom,
  center,
  className = "",
}: {
  top: ReactNode;
  bottom: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <h2
      className={`text-3xl leading-[1.12] font-bold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.75rem] ${
        center ? "text-center" : ""
      } ${className}`}
    >
      <span className="block">{top}</span>
      <span className="block text-brand">{bottom}</span>
    </h2>
  );
}

const pillTone = {
  brand: "bg-brand text-white hover:bg-brand-deep",
  ink: "bg-ink text-white hover:bg-ink/85",
  white: "bg-white text-ink hover:bg-lilac-soft",
  outline: "bg-white text-ink ring-1 ring-ink/15 hover:ring-brand/50",
};

const pillIconTone = {
  brand: "bg-white text-brand",
  ink: "bg-white text-ink",
  white: "bg-brand text-white",
  outline: "bg-brand text-white",
};

// Tombol pil: teks di kiri, lingkaran ikon di kanan
export function PillLink({
  href,
  children,
  tone = "brand",
  icon = "arrow",
  external,
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: keyof typeof pillTone;
  icon?: IconName;
  external?: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  const classes = `group inline-flex items-center justify-between gap-3 rounded-full font-semibold transition-colors ${
    size === "lg" ? "py-2 pr-2 pl-6 text-base sm:text-lg" : "py-1.5 pr-1.5 pl-5 text-[15px]"
  } ${pillTone[tone]} ${className}`;
  const content = (
    <>
      {children}
      <span
        className={`grid shrink-0 place-items-center rounded-full transition-transform group-hover:translate-x-0.5 ${
          size === "lg" ? "size-10" : "size-8"
        } ${pillIconTone[tone]}`}
      >
        <Icon name={icon} className={size === "lg" ? "size-5" : "size-4"} strokeWidth={2.5} />
      </span>
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
