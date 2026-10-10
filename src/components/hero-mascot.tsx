import { Mascot } from "./mascot";

// Kepala Webi kecil di hero dan tombol chat. Matanya jadi hati saat tombol utama hero / tombol chat di-hover
// (diatur di globals.css lewat .mascot-normal & .mascot-laugh).
export function HeroMascot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-grid ${className}`} aria-hidden="true">
      <Mascot mood="kepala-senang" eager className="mascot-normal col-start-1 row-start-1 h-auto w-full transition-opacity duration-150" />
      <Mascot mood="kepala-cinta" eager className="mascot-laugh col-start-1 row-start-1 h-auto w-full opacity-0 transition-opacity duration-150" />
    </span>
  );
}
