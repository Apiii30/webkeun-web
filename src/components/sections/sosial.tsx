import { sosial } from "@/lib/site";
import { SectionHeading } from "../brand";
import { Icon, TikTokIcon } from "../icons";
import { Mascot } from "../mascot";

// Akun media sosial Webkeun. Sosial: dua kartu besar bernuansa warna khas tiap aplikasi (beranda).
// TautanSosial: versi baris ringkas (halaman kontak). IkonSosial: tombol bulat kecil (footer).

const ig = sosial.find((s) => s.id === "instagram")!;
const tt = sosial.find((s) => s.id === "tiktok")!;
const gradasiIg = "radial-gradient(circle at 18% 110%, #fdd55a 0%, #f9a33a 16%, #f0436b 42%, #c72d9b 62%, #6a3ee8 92%)";
// logo TikTok bertumpuk cyan & merah seperti logo aslinya; makin bergeser saat kartunya di-hover
const geser = "transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none";

function LogoTikTok({ className = "", depan = "text-white" }: { className?: string; depan?: string }) {
  return (
    <span className={`inline-block ${className.includes("absolute") ? "" : "relative"} ${className}`} aria-hidden="true">
      <TikTokIcon className={`absolute inset-0 size-full text-[#25f4ee] -translate-x-[4%] -translate-y-[3%] group-hover:-translate-x-[8%] group-hover:-translate-y-[6%] ${geser}`} />
      <TikTokIcon className={`absolute inset-0 size-full text-[#fe2c55] translate-x-[4%] translate-y-[3%] group-hover:translate-x-[8%] group-hover:translate-y-[6%] ${geser}`} />
      <TikTokIcon className={`relative size-full transition-colors duration-300 ${depan}`} />
    </span>
  );
}

export function Sosial() {
  return (
    <section className="px-4 pb-16 sm:px-6 md:pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <SectionHeading top="Kepoin Webkeun" bottom="di sosial media" />
          <p className="max-w-sm text-lg text-ink/70 md:justify-self-end">Ikuti kami buat lihat karya dan kabar terbaru dari Webkeun.</p>
        </div>

        <div data-gerak="buka" className="relative mt-10 grid gap-5 md:grid-cols-2">
          {/* maskot mengintip dari atas kartu TikTok */}
          <Mascot mood="kedip" className="stiker absolute -top-11 right-8 z-10 w-16 rotate-6 max-md:hidden" />

          <a
            href={ig.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative isolate flex min-h-64 flex-col justify-between overflow-hidden rounded-4xl p-7 text-white shadow-[0_30px_60px_-30px_rgb(199_45_155/0.7)] transition-transform duration-500 hover:-translate-y-1 sm:p-9"
            style={{ background: gradasiIg }}
          >
            <Icon
              name="instagram"
              strokeWidth={1.4}
              className="absolute -right-10 -bottom-12 -z-10 size-64 text-white/15 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6"
            />
            <span className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/35 backdrop-blur-sm">
                <Icon name="instagram" className="size-6" />
              </span>
              <span className="text-sm font-bold tracking-[0.14em] uppercase">{ig.nama}</span>
            </span>
            <span className="mt-10 block">
              <span className="block text-3xl font-extrabold tracking-[-0.02em] break-all sm:text-4xl">{ig.handle}</span>
              <span className="mt-1.5 block text-white/85">{ig.ajakan}</span>
            </span>
            <span className="mt-7 inline-flex items-center gap-3 self-start rounded-full bg-white py-1.5 pr-1.5 pl-5 text-[15px] font-bold text-[#c72d9b]">
              {ig.tombol} di Instagram
              <span className="grid size-8 place-items-center rounded-full bg-[#c72d9b] text-white transition-transform group-hover:translate-x-0.5">
                <Icon name="arrow" className="size-4" strokeWidth={2.5} />
              </span>
            </span>
          </a>

          <a
            href={tt.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative isolate flex min-h-64 flex-col justify-between overflow-hidden rounded-4xl bg-[#0d0c14] p-7 text-white shadow-[0_30px_60px_-30px_rgb(13_12_20/0.8)] transition-transform duration-500 hover:-translate-y-1 sm:p-9"
          >
            <div aria-hidden="true" className="absolute -top-24 -left-20 -z-10 size-72 bg-[radial-gradient(closest-side,rgb(37_244_238/0.22),transparent)]" />
            <div aria-hidden="true" className="absolute -right-20 -bottom-24 -z-10 size-80 bg-[radial-gradient(closest-side,rgb(254_44_85/0.25),transparent)]" />
            <LogoTikTok className="absolute -right-6 -bottom-8 -z-10 size-56 opacity-25 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" />
            <span className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <LogoTikTok className="size-6" />
              </span>
              <span className="text-sm font-bold tracking-[0.14em] uppercase">{tt.nama}</span>
            </span>
            <span className="mt-10 block">
              <span className="block text-3xl font-extrabold tracking-[-0.02em] break-all [text-shadow:-2px_-1px_0_#25f4ee,2px_1px_0_#fe2c55] sm:text-4xl">{tt.handle}</span>
              <span className="mt-1.5 block text-white/75">{tt.ajakan}</span>
            </span>
            <span className="mt-7 inline-flex items-center gap-3 self-start rounded-full bg-[#fe2c55] py-1.5 pr-1.5 pl-5 text-[15px] font-bold text-white">
              {tt.tombol} di TikTok
              <span className="grid size-8 place-items-center rounded-full bg-white text-[#0d0c14] transition-transform group-hover:translate-x-0.5">
                <Icon name="arrow" className="size-4" strokeWidth={2.5} />
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

// Baris ringkas untuk halaman kontak, gayanya sama dengan baris email di sana
export function TautanSosial() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {sosial.map((s) => (
        <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3.5 rounded-3xl p-4 ring-1 ring-ink/10 transition-colors hover:bg-lilac-soft">
          <span
            className={`grid size-12 shrink-0 place-items-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6 ${
              s.id === "tiktok" ? "bg-[#0d0c14]" : ""
            }`}
            style={s.id === "instagram" ? { background: gradasiIg } : undefined}
          >
            {s.id === "tiktok" ? <LogoTikTok className="size-6" /> : <Icon name="instagram" className="size-6" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink/55">{s.nama}</span>
            <span className="block truncate font-bold tracking-tight">{s.handle}</span>
          </span>
          <Icon name="arrow" className="size-4 shrink-0 -rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
        </a>
      ))}
    </div>
  );
}

// Tombol bulat kecil untuk footer
export function IkonSosial() {
  return (
    <ul className="mt-5 flex gap-2.5">
      {sosial.map((s) => (
        <li key={s.id}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.nama} Webkeun (${s.handle})`}
            title={`${s.nama} ${s.handle}`}
            className="group relative grid size-11 place-items-center overflow-hidden rounded-full bg-white text-ink ring-1 ring-ink/10 transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-white"
          >
            <span
              aria-hidden="true"
              className={`absolute inset-0 scale-0 rounded-full transition-transform duration-300 group-hover:scale-100 ${s.id === "tiktok" ? "bg-[#0d0c14]" : ""}`}
              style={s.id === "instagram" ? { background: gradasiIg } : undefined}
            />
            {s.id === "tiktok" ? <LogoTikTok className="size-5" depan="text-ink group-hover:text-white" /> : <Icon name="instagram" className="relative size-5" />}
          </a>
        </li>
      ))}
    </ul>
  );
}
