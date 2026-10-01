export type Mood = "senyum" | "kedip" | "kaget" | "tertawa";

const INK = "#15132B";

export function MascotFace({ mood }: { mood: Mood }) {
  switch (mood) {
    case "senyum":
      return (
        <>
          <circle cx="44" cy="54" r="7" fill={INK} />
          <circle cx="76" cy="54" r="7" fill={INK} />
          <circle cx="28" cy="70" r="5" fill="#5B3DF5" />
          <circle cx="92" cy="70" r="5" fill="#5B3DF5" />
          <path
            d="M40 70 Q 46 86, 53 77 Q 60 68, 67 77 Q 74 86, 80 70"
            fill="none"
            stroke={INK}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    case "kedip":
      return (
        <>
          <circle cx="44" cy="54" r="7" fill={INK} />
          <path d="M68 56 Q 76 47, 84 56" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
          <path d="M42 72 Q 60 88, 78 72" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        </>
      );
    case "kaget":
      return (
        <>
          <circle cx="44" cy="52" r="8" fill={INK} />
          <circle cx="76" cy="52" r="8" fill={INK} />
          <ellipse cx="60" cy="78" rx="8" ry="10" fill={INK} />
        </>
      );
    case "tertawa":
      return (
        <>
          <path d="M36 56 Q 44 46, 52 56" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
          <path d="M68 56 Q 76 46, 84 56" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
          <path d="M40 68 Q 60 98, 80 68 Z" fill={INK} />
        </>
      );
  }
}

export function Mascot({ mood, className, outline }: { mood: Mood; className?: string; outline?: boolean }) {
  return (
    <svg viewBox="2 8 116 104" className={className} aria-hidden="true">
      <rect
        x="6"
        y="12"
        width="108"
        height="96"
        rx="26"
        fill="#E4DEFF"
        stroke={outline ? INK : undefined}
        strokeWidth={outline ? 4 : undefined}
      />
      <MascotFace mood={mood} />
    </svg>
  );
}
