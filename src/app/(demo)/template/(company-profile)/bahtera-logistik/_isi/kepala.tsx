import { pt } from "./data";
import { MONO, STENSIL } from "./gaya";

// Header tetap: logo kontainer kecil + nama, menu, dan tombol penawaran.
export function Kepala() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#10213a]/95 text-[#eeeae1] shadow-[0_1px_0_rgb(238_234_225/0.1)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <a href="#atas" className="flex items-center gap-2.5">
          <svg viewBox="0 0 32 20" className="h-5 w-8" aria-hidden="true">
            <rect width="32" height="20" rx="1.5" fill="#b8432f" />
            {[5, 10, 15, 20, 25].map((x) => (
              <rect key={x} x={x} y="3" width="2" height="14" fill="#7a2a1c" />
            ))}
          </svg>
          <span className={`${STENSIL} text-2xl leading-none tracking-[0.04em]`}>{pt.singkat}</span>
          <span className={`${MONO} hidden text-[10px] leading-tight text-[#eeeae1]/55 uppercase lg:block`}>
            Lintas
            <br />
            Nusantara
          </span>
        </a>
        <nav className={`${MONO} hidden items-center gap-6 text-xs uppercase md:flex`}>
          <a href="#rute" className="hover:text-[#f2b33d]">Rute</a>
          <a href="#layanan" className="hover:text-[#f2b33d]">Layanan</a>
          <a href="#armada" className="hover:text-[#f2b33d]">Armada</a>
          <a href="#lacak" className="hover:text-[#f2b33d]">Lacak</a>
          <a href="#tentang" className="hover:text-[#f2b33d]">Tentang</a>
        </nav>
        <a href="#penawaran" className="rounded bg-[#f2b33d] px-4 py-2 text-sm font-bold text-[#10213a]">
          Minta penawaran
        </a>
      </div>
    </header>
  );
}
