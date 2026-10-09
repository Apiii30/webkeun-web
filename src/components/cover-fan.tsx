import Image from "next/image";

// Tiga sampul undangan dari tema berbeda, dikipas seperti kartu. Saat induknya (class "group") di-hover,
// kipasnya makin terbuka. Lebar tiap HP 31% wadah, jadi kipas yang terbuka tetap muat di dalam wadahnya.
const SAMPUL = [
  { src: "/preview/undangan/hp-undangan-porselen-frisca-1.webp", alt: "Sampul undangan tema Biru Porselen" },
  { src: "/preview/undangan/hp-undangan-oriental-meilin-1.webp", alt: "Sampul undangan tema Oriental Peony" },
  { src: "/preview/undangan/hp-undangan-rimba-senja-1.webp", alt: "Sampul undangan tema Rimba" },
];

const POSISI = [
  "-translate-x-[135%] -rotate-[10deg] group-hover:-translate-x-[150%] group-hover:-rotate-[14deg]",
  "z-10 -translate-x-1/2 -translate-y-[4%] group-hover:-translate-y-[8%]",
  "translate-x-[35%] rotate-[10deg] group-hover:translate-x-[50%] group-hover:rotate-[14deg]",
];

export function CoverFan({ className = "", sizes }: { className?: string; sizes: string }) {
  return (
    <div className={`relative ${className}`}>
      {SAMPUL.map((s, i) => (
        <div
          key={s.src}
          className={`absolute bottom-0 left-1/2 aspect-[1/2] w-[31%] origin-bottom transition-[translate,rotate] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${POSISI[i]}`}
        >
          <div className="relative h-full overflow-hidden rounded-[1.1rem] bg-[#111018] p-[3.5%] shadow-[0_24px_44px_-20px_rgb(21_19_43/0.6)]">
            <div className="relative h-full overflow-hidden rounded-[0.85rem]">
              <Image src={s.src} alt={s.alt} fill sizes={sizes} className="object-cover object-top" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
