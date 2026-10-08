"use client";

import { AnimatePresence, motion } from "motion/react";
import { type Dispatch, type FormEvent, type SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { bacaTempelan, rapikanWa, tampilWa } from "./nomor";
import { Paginasi, usePaginasi } from "./paginasi";
import { isiPesan, PESAN_BAWAAN } from "./pesan";
import type { BalasanTamu, TamuUndangan } from "./rekap";
import { hapusTamu, simpanPesan, tambahTamu, tandaiTerkirim, ubahTamu } from "./rekap-aksi";

// Daftar tamu pengantin di halaman rekap: tambah satu-satu atau tempel banyak sekaligus (nama + nomor WhatsApp),
// lalu kirim undangannya langsung ke chat WhatsApp tiap tamu (wa.me/<nomor>) tanpa mencari kontak. Begitu tombol
// kirim ditekan, tamunya ditandai "Terkirim" & tersimpan di database, jadi status ini sama di HP kedua mempelai.
// Bar "Kirim berikutnya" di bawah layar membuka chat tamu berikutnya yang belum dikirimi, supaya kirim beruntun cepat.

type Saring = "semua" | "belum" | "terkirim" | "tanpa-nomor";
type Kabar = (teks: string, galat?: boolean) => void;

const jam = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
const tombol = "inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40";
const isian = "w-full rounded-xl bg-white px-3.5 py-2.5 text-[15px] ring-1 ring-ink/10 outline-none placeholder:text-ink/35 focus:ring-2 focus:ring-brand/50";

export function DaftarTamu({
  slug,
  kunci,
  asal,
  tamu,
  setTamu,
  balasan,
  pesanAwal,
  kabar,
}: {
  slug: string;
  kunci: string;
  asal: string;
  tamu: TamuUndangan[];
  setTamu: Dispatch<SetStateAction<TamuUndangan[]>>;
  balasan: BalasanTamu[];
  pesanAwal: string | null;
  kabar: Kabar;
}) {
  const [templat, setTemplat] = useState(pesanAwal ?? PESAN_BAWAAN);
  const [cari, setCari] = useState("");
  const [saring, setSaring] = useState<Saring>("semua");
  const [ubahId, setUbahId] = useState<number | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);

  const link = (nama: string) => `${asal}/u/${slug}?to=${encodeURIComponent(nama)}`;
  const pesan = (nama: string) => isiPesan(templat, nama, link(nama));
  const hrefWa = (t: TamuUndangan) => `https://wa.me/${t.wa}?text=${encodeURIComponent(pesan(t.nama))}`;

  // balasan RSVP dicocokkan lewat nama di link undangan (?to=...), atau nama yang diisi tamu
  const rsvp = useMemo(() => {
    const m = new Map<string, BalasanTamu>();
    for (const b of balasan.toReversed()) for (const n of [b.nama, b.tamu]) if (n) m.set(n.toLowerCase(), b);
    return m;
  }, [balasan]);

  const jumlah = {
    semua: tamu.length,
    belum: tamu.filter((t) => !t.terkirim).length,
    terkirim: tamu.filter((t) => t.terkirim).length,
    "tanpa-nomor": tamu.filter((t) => !t.wa).length,
  };
  const q = cari.trim().toLowerCase();
  // cari nomor: "0812…" juga cocok dengan nomor tersimpan "62812…"
  const qAngka = q.replace(/\D/g, "").replace(/^0/, "62");
  const tampil = tamu.filter(
    (t) =>
      (saring === "semua" || (saring === "belum" ? !t.terkirim : saring === "terkirim" ? !!t.terkirim : !t.wa)) &&
      (!q || t.nama.toLowerCase().includes(q) || (qAngka.length >= 3 && t.wa.includes(qAngka))),
  );
  const berikutnya = tamu.find((t) => !t.terkirim && t.wa);
  const halaman = usePaginasi(tampil, `${saring}|${q}`);
  const atasDaftar = useRef<HTMLElement>(null);

  async function kirim(t: TamuUndangan) {
    const sebelum = t.terkirim;
    setTamu((d) => d.map((x) => (x.id === t.id ? { ...x, terkirim: new Date().toISOString() } : x)));
    const h = await tandaiTerkirim(slug, kunci, t.id, true);
    if (h.ok) setTamu((d) => d.map((x) => (x.id === t.id ? { ...x, terkirim: h.data } : x)));
    else {
      setTamu((d) => d.map((x) => (x.id === t.id ? { ...x, terkirim: sebelum } : x)));
      kabar(h.pesan, true);
    }
  }

  async function aturStatus(t: TamuUndangan, terkirim: boolean) {
    const h = await tandaiTerkirim(slug, kunci, t.id, terkirim);
    if (h.ok) {
      setTamu((d) => d.map((x) => (x.id === t.id ? { ...x, terkirim: h.data } : x)));
      kabar(terkirim ? `${t.nama} ditandai sudah dikirim` : `${t.nama} ditandai belum dikirim`);
    } else kabar(h.pesan, true);
  }

  async function hapus(t: TamuUndangan) {
    if (!confirm(`Hapus ${t.nama} dari daftar tamu?`)) return;
    setTamu((d) => d.filter((x) => x.id !== t.id));
    if (await hapusTamu(slug, kunci, t.id)) kabar(`${t.nama} dihapus`);
    else {
      setTamu((d) => [...d, t].sort((a, b) => a.id - b.id));
      kabar("Gagal menghapus. Coba lagi.", true);
    }
  }

  async function salin(teks: string, kabarnya: string) {
    try {
      await navigator.clipboard.writeText(teks);
      kabar(kabarnya);
    } catch {
      window.prompt("Salin teks ini:", teks);
    }
  }

  function unduh() {
    const sel = (v: string) => `"${(/^[=+\-@]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
    const baris = [
      ["Nama", "WhatsApp", "Link undangan", "Status", "Waktu kirim (WIB)", "RSVP"],
      ...tamu.map((t) => {
        const r = rsvp.get(t.nama.toLowerCase());
        return [t.nama, tampilWa(t.wa), link(t.nama), t.terkirim ? "Terkirim" : "Belum dikirim", t.terkirim ? jam.format(new Date(t.terkirim)) : "", r ? (r.hadir ? "Hadir" : "Tidak hadir") : ""];
      }),
    ];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + baris.map((b) => b.map(sel).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
    a.download = `daftar-tamu-${slug}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-5 pb-28">
      {/* tamu baru ada di urutan paling akhir: langsung ke halaman terakhir supaya terlihat */}
      <FormTambah slug={slug} kunci={kunci} setTamu={setTamu} kabar={kabar} onDitambah={() => halaman.setHal(Infinity)} />

      <EditorPesan slug={slug} kunci={kunci} templat={templat} setTemplat={setTemplat} pesanAwal={pesanAwal} contoh={pesan(tamu[0]?.nama ?? "Budi Santoso")} kabar={kabar} />

      {tamu.length > 0 && (
        <section ref={atasDaftar} aria-label="Daftar tamu" className="scroll-mt-24">
          {/* kemajuan kirim */}
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
              <motion.div
                className="h-full rounded-full bg-mint"
                initial={false}
                animate={{ width: `${(jumlah.terkirim / tamu.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
            <p className="shrink-0 text-sm font-semibold text-ink/60 tabular-nums">
              {jumlah.terkirim}/{tamu.length} terkirim
            </p>
          </div>

          {/* cari, saring, unduh */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <label className="relative w-full sm:w-64">
              <span className="sr-only">Cari tamu</span>
              <Icon name="search" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/40" />
              <input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari nama atau nomor" className={`${isian} py-2 pl-9`} />
            </label>
            <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 py-1 sm:mx-0 sm:px-0">
              {(
                [
                  ["semua", "Semua"],
                  ["belum", "Belum dikirim"],
                  ["terkirim", "Terkirim"],
                  ["tanpa-nomor", "Tanpa nomor"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSaring(k)}
                  aria-pressed={saring === k}
                  className={`${tombol} shrink-0 px-3.5 py-1.5 text-sm ${saring === k ? "bg-ink text-white" : "bg-white text-ink/70 ring-1 ring-ink/10 hover:bg-lilac-soft"}`}
                >
                  {label}
                  <span className={`rounded-full px-1.5 text-xs tabular-nums ${saring === k ? "bg-white/20" : "bg-ink/[0.06]"}`}>{jumlah[k]}</span>
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-1.5">
              <button
                type="button"
                onClick={() => salin(tamu.map((t) => `${t.nama}\n${link(t.nama)}`).join("\n\n"), "Semua link tamu disalin")}
                className={`${tombol} bg-white px-3.5 py-2 text-sm ring-1 ring-ink/10 hover:bg-lilac-soft`}
              >
                <Icon name="copy" className="size-4" /> Salin semua link
              </button>
              <button type="button" onClick={unduh} className={`${tombol} bg-white px-3.5 py-2 text-sm ring-1 ring-ink/10 hover:bg-lilac-soft`}>
                <Icon name="download" className="size-4" /> CSV
              </button>
            </div>
          </div>

          {/* judul kolom (layar lebar) */}
          <div className="mt-4 hidden grid-cols-[2rem_minmax(0,1.5fr)_minmax(0,1fr)_11rem_13rem] gap-4 px-4 pb-2 text-xs font-bold tracking-[0.1em] text-ink/40 uppercase md:grid">
            <span>No</span>
            <span>Nama tamu</span>
            <span>WhatsApp</span>
            <span>Status</span>
            <span className="text-right">Kirim</span>
          </div>

          <ul className="mt-3 space-y-2 md:mt-0">
            {halaman.isi.map((t) =>
              ubahId === t.id ? (
                <BarisUbah key={t.id} t={t} slug={slug} kunci={kunci} setTamu={setTamu} selesai={() => setUbahId(null)} kabar={kabar} />
              ) : (
                <BarisTamu
                  key={t.id}
                  no={tamu.indexOf(t) + 1}
                  t={t}
                  r={rsvp.get(t.nama.toLowerCase())}
                  href={hrefWa(t)}
                  onKirim={() => kirim(t)}
                  menuBuka={menuId === t.id}
                  setMenu={(b) => setMenuId(b ? t.id : null)}
                  menu={[
                    { ikon: "copy", label: "Salin pesan", aksi: () => salin(pesan(t.nama), "Pesan undangan disalin") },
                    { ikon: "link", label: "Salin link undangan", aksi: () => salin(link(t.nama), "Link undangan disalin") },
                    { ikon: "edit", label: "Ubah nama / nomor", aksi: () => setUbahId(t.id) },
                    t.terkirim ? { ikon: "close", label: "Tandai belum dikirim", aksi: () => aturStatus(t, false) } : { ikon: "check", label: "Tandai sudah dikirim", aksi: () => aturStatus(t, true) },
                    { ikon: "trash", label: "Hapus", aksi: () => hapus(t), bahaya: true },
                  ]}
                />
              ),
            )}
            {!tampil.length && <li className="rounded-2xl bg-lilac-soft p-6 text-center text-sm text-ink/55">Tidak ada tamu yang cocok.</li>}
          </ul>
          <Paginasi {...halaman} gulirKe={atasDaftar} />
        </section>
      )}

      {/* kirim beruntun: chat tamu berikutnya yang belum dikirimi */}
      <AnimatePresence>
        {berikutnya && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-xl items-center gap-3 rounded-[1.4rem] bg-ink p-2 pl-4 text-white shadow-[0_20px_40px_-16px_rgb(21_19_43/0.7)]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold tracking-[0.12em] text-mint uppercase">
                Kirim berikutnya · {jumlah.terkirim}/{tamu.length}
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={berikutnya.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }} className="truncate font-bold">
                  {berikutnya.nama}
                  <span className="ml-2 text-sm font-medium text-white/50">{tampilWa(berikutnya.wa)}</span>
                </motion.p>
              </AnimatePresence>
            </div>
            <a
              href={hrefWa(berikutnya)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => kirim(berikutnya)}
              className={`${tombol} shrink-0 bg-wa px-4 py-3 text-sm text-white hover:brightness-95`}
            >
              <Icon name="whatsapp" className="size-4" /> Kirim
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ——— tambah tamu ———

function FormTambah({ slug, kunci, setTamu, kabar, onDitambah }: { slug: string; kunci: string; setTamu: Dispatch<SetStateAction<TamuUndangan[]>>; kabar: Kabar; onDitambah: () => void }) {
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [galat, setGalat] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const [tempel, setTempel] = useState(false);
  const [teks, setTeks] = useState("");
  const namaRef = useRef<HTMLInputElement>(null);
  const terbaca = bacaTempelan(teks);
  const tanpaNomor = terbaca.filter((b) => !b.wa).length;
  const nomorSalah = terbaca.filter((b) => b.nomorSalah).length;

  async function simpan(baris: { nama: string; wa: string }[]) {
    setSibuk(true);
    setGalat("");
    const h = await tambahTamu(slug, kunci, baris);
    setSibuk(false);
    if (!h.ok) {
      setGalat(h.pesan);
      return false;
    }
    setTamu((d) => [...d, ...h.data.baru]);
    if (h.data.baru.length) onDitambah();
    const { baru, dilewati } = h.data;
    kabar(baru.length ? `${baru.length} tamu ditambahkan${dilewati ? `, ${dilewati} sudah ada` : ""}` : "Nama itu sudah ada di daftar", !baru.length);
    return baru.length > 0;
  }

  async function tambahSatu(e: FormEvent) {
    e.preventDefault();
    if (!nama.trim()) return setGalat("Isi nama tamunya dulu.");
    if (rapikanWa(wa) === null) return setGalat("Nomor WhatsApp-nya kurang tepat. Contoh: 0812 3456 7890");
    if (await simpan([{ nama, wa }])) {
      setNama("");
      setWa("");
      namaRef.current?.focus();
    }
  }

  return (
    <section className="rounded-[1.75rem] bg-lilac-soft p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-bold">
          <span className="grid size-7 place-items-center rounded-full bg-brand text-white">
            <Icon name="plus" className="size-4" strokeWidth={2.5} />
          </span>
          Tambah tamu
        </h2>
        <button type="button" onClick={() => setTempel((v) => !v)} aria-expanded={tempel} className="text-sm font-semibold text-brand underline-offset-4 hover:underline">
          {tempel ? "Isi satu per satu" : "Tempel banyak sekaligus"}
        </button>
      </div>

      {tempel ? (
        <div className="mt-3">
          <textarea
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            rows={7}
            placeholder={"Budi Santoso, 0812 3456 7890\nKeluarga Pak RT, 0857 1111 2222\nRina & Pasangan"}
            className={`${isian} resize-y leading-relaxed`}
          />
          <p className="mt-2 text-sm text-ink/55">Satu tamu per baris: nama, lalu nomor WhatsApp (boleh dikosongkan). Bisa ditempel langsung dari Excel atau catatan HP.</p>
          {galat && <p className="mt-2 text-sm font-semibold text-[#c2334f]">{galat}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!terbaca.length || sibuk}
              onClick={async () => (await simpan(terbaca)) && (setTeks(""), setTempel(false))}
              className={`${tombol} bg-brand px-5 py-2.5 text-white hover:bg-brand-deep`}
            >
              {sibuk ? "Menyimpan…" : `Tambahkan ${terbaca.length} tamu`}
            </button>
            {terbaca.length > 0 && (
              <p className="text-sm text-ink/55">
                {terbaca.length - tanpaNomor} dengan nomor{tanpaNomor > 0 && `, ${tanpaNomor} tanpa nomor`}
                {nomorSalah > 0 && <span className="text-[#c2334f]"> ({nomorSalah} nomor tidak dikenali)</span>}
              </p>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={tambahSatu} className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]">
          <label>
            <span className="sr-only">Nama tamu</span>
            <input ref={namaRef} value={nama} onChange={(e) => setNama(e.target.value)} maxLength={60} placeholder="Nama tamu" autoComplete="off" className={isian} />
          </label>
          <label>
            <span className="sr-only">Nomor WhatsApp</span>
            <input value={wa} onChange={(e) => setWa(e.target.value)} inputMode="tel" placeholder="No. WhatsApp (0812…)" autoComplete="off" className={isian} />
          </label>
          <button type="submit" disabled={sibuk} className={`${tombol} bg-brand px-5 py-2.5 text-white hover:bg-brand-deep`}>
            <Icon name="plus" className="size-4" strokeWidth={2.5} />
            {sibuk ? "Menyimpan…" : "Tambah"}
          </button>
          {galat && <p className="text-sm font-semibold text-[#c2334f] sm:col-span-3">{galat}</p>}
        </form>
      )}
    </section>
  );
}

// ——— satu baris tamu ———

type ItemMenu = { ikon: IconName; label: string; aksi: () => void; bahaya?: boolean };

function BarisTamu({
  no,
  t,
  r,
  href,
  onKirim,
  menu,
  menuBuka,
  setMenu,
}: {
  no: number;
  t: TamuUndangan;
  r?: BalasanTamu;
  href: string;
  onKirim: () => void;
  menu: ItemMenu[];
  menuBuka: boolean;
  setMenu: (b: boolean) => void;
}) {
  const status = t.terkirim ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-mint/20 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-[#0f7a63]">
      <Icon name="check" className="size-3.5" strokeWidth={3} />
      Terkirim · {jam.format(new Date(t.terkirim))}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.05] px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-ink/50">
      <span className="size-1.5 rounded-full bg-ink/30" />
      Belum dikirim
    </span>
  );

  return (
    <li
      className={`relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 rounded-2xl p-3.5 ring-1 transition-colors duration-500 md:grid-cols-[2rem_minmax(0,1.5fr)_minmax(0,1fr)_11rem_13rem] md:gap-4 md:px-4 ${
        t.terkirim ? "bg-[#effcf8] ring-mint/45" : "bg-white ring-ink/10"
      }`}
    >
      {t.terkirim && <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-mint" aria-hidden="true" />}
      <span className="hidden text-sm text-ink/35 tabular-nums md:block">{no}</span>

      {/* HP: nama & nomor selebar baris, lalu status & tombol kirim berdampingan di bawahnya */}
      <div className="col-span-2 min-w-0 md:col-span-1">
        <p className="flex items-center gap-2">
          <span className="truncate font-semibold">{t.nama}</span>
          {r && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${r.hadir ? "bg-brand/10 text-brand" : "bg-[#fde3e9] text-[#b0415b]"}`}>{r.hadir ? "Hadir" : "Tidak hadir"}</span>
          )}
        </p>
        <p className="mt-0.5 text-sm text-ink/55 tabular-nums md:hidden">{tampilWa(t.wa) || "Belum ada nomor"}</p>
      </div>

      <p className={`hidden text-sm tabular-nums md:block ${t.wa ? "text-ink/70" : "text-ink/35"}`}>{tampilWa(t.wa) || "Belum ada nomor"}</p>
      <div className="min-w-0">{status}</div>

      <div className="flex items-center justify-end gap-1.5">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onKirim}
          title={t.wa ? `Buka chat WhatsApp ${tampilWa(t.wa)}` : "Belum ada nomor: pilih kontaknya di WhatsApp"}
          className={`${tombol} px-3.5 py-2 text-sm ${t.terkirim ? "bg-white text-[#0f7a63] ring-1 ring-mint/60 hover:bg-mint/10" : "bg-wa text-white hover:brightness-95"}`}
        >
          <Icon name="whatsapp" className="size-4" />
          {t.terkirim ? "Kirim ulang" : "Kirim"}
        </a>
        <Menu item={menu} buka={menuBuka} setBuka={setMenu} />
      </div>
    </li>
  );
}

function Menu({ item, buka, setBuka }: { item: ItemMenu[]; buka: boolean; setBuka: (b: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!buka) return;
    const tutup = (e: Event) => !ref.current?.contains(e.target as Node) && setBuka(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false);
    document.addEventListener("pointerdown", tutup);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", tutup);
      document.removeEventListener("keydown", esc);
    };
  }, [buka, setBuka]);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setBuka(!buka)} aria-label="Pilihan lain" aria-expanded={buka} className={`${tombol} size-9 text-ink/60 hover:bg-ink/[0.06]`}>
        <Icon name="more" className="size-5" strokeWidth={3} />
      </button>
      <AnimatePresence>
        {buka && (
          <motion.ul
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.14 }}
            className="absolute top-full right-0 z-30 mt-1 w-56 origin-top-right rounded-2xl bg-white p-1.5 shadow-[0_20px_40px_-12px_rgb(21_19_43/0.35)] ring-1 ring-ink/10"
          >
            {item.map((m) => (
              <li key={m.label}>
                <button
                  type="button"
                  onClick={() => {
                    setBuka(false);
                    m.aksi();
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium ${m.bahaya ? "text-[#c2334f] hover:bg-[#fde3e9]" : "hover:bg-lilac-soft"}`}
                >
                  <Icon name={m.ikon} className="size-4 opacity-70" />
                  {m.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function BarisUbah({
  t,
  slug,
  kunci,
  setTamu,
  selesai,
  kabar,
}: {
  t: TamuUndangan;
  slug: string;
  kunci: string;
  setTamu: Dispatch<SetStateAction<TamuUndangan[]>>;
  selesai: () => void;
  kabar: Kabar;
}) {
  const [nama, setNama] = useState(t.nama);
  const [wa, setWa] = useState(tampilWa(t.wa));
  const [galat, setGalat] = useState("");
  const [sibuk, setSibuk] = useState(false);

  async function simpan(e: FormEvent) {
    e.preventDefault();
    setSibuk(true);
    const h = await ubahTamu(slug, kunci, t.id, { nama, wa });
    setSibuk(false);
    if (!h.ok) return setGalat(h.pesan);
    setTamu((d) => d.map((x) => (x.id === t.id ? h.data : x)));
    kabar("Perubahan disimpan");
    selesai();
  }

  return (
    <li className="rounded-2xl bg-white p-3.5 ring-2 ring-brand/40">
      <form onSubmit={simpan} onKeyDown={(e) => e.key === "Escape" && selesai()} className="grid gap-2 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto]">
        <input value={nama} onChange={(e) => setNama(e.target.value)} maxLength={60} aria-label="Nama tamu" autoFocus className={isian} />
        <input value={wa} onChange={(e) => setWa(e.target.value)} inputMode="tel" placeholder="No. WhatsApp" aria-label="Nomor WhatsApp" className={isian} />
        <button type="submit" disabled={sibuk} className={`${tombol} bg-brand px-4 py-2.5 text-sm text-white hover:bg-brand-deep`}>
          {sibuk ? "Menyimpan…" : "Simpan"}
        </button>
        <button type="button" onClick={selesai} className={`${tombol} px-4 py-2.5 text-sm text-ink/60 hover:bg-ink/[0.06]`}>
          Batal
        </button>
        {galat && <p className="text-sm font-semibold text-[#c2334f] sm:col-span-4">{galat}</p>}
      </form>
    </li>
  );
}

// ——— teks pesan WhatsApp ———

function EditorPesan({
  slug,
  kunci,
  templat,
  setTemplat,
  pesanAwal,
  contoh,
  kabar,
}: {
  slug: string;
  kunci: string;
  templat: string;
  setTemplat: (v: string) => void;
  pesanAwal: string | null;
  contoh: string;
  kabar: Kabar;
}) {
  const [buka, setBuka] = useState(false);
  const [tersimpan, setTersimpan] = useState(pesanAwal ?? PESAN_BAWAAN);
  const [sibuk, setSibuk] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const berubah = templat !== tersimpan;

  function sisip(kode: string) {
    const el = ref.current;
    if (!el) return setTemplat(templat + kode);
    const [a, b] = [el.selectionStart, el.selectionEnd];
    setTemplat(templat.slice(0, a) + kode + templat.slice(b));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + kode.length, a + kode.length);
    });
  }

  async function simpan(teks: string) {
    setSibuk(true);
    const ok = await simpanPesan(slug, kunci, teks === PESAN_BAWAAN ? null : teks);
    setSibuk(false);
    if (!ok) return kabar("Gagal menyimpan pesan. Coba lagi.", true);
    setTemplat(teks);
    setTersimpan(teks);
    kabar("Teks pesan disimpan");
  }

  return (
    <section className="rounded-[1.75rem] ring-1 ring-ink/10">
      <button type="button" onClick={() => setBuka((v) => !v)} aria-expanded={buka} className="flex w-full items-center gap-3 p-4 text-left sm:p-5">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-wa/15 text-[#128c4a]">
          <Icon name="whatsapp" className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold">Teks pesan WhatsApp</span>
          <span className="block truncate text-sm text-ink/55">{berubah ? "Ada perubahan yang belum disimpan" : "Pesan yang terkirim bersama link undangan tiap tamu"}</span>
        </span>
        <Icon name="chevron" className={`size-5 shrink-0 text-ink/40 transition-transform ${buka ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {buka && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="grid gap-4 px-4 pb-5 sm:px-5 md:grid-cols-2">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-1.5 text-sm text-ink/55">
                  Sisipkan:
                  {["{nama}", "{link}"].map((k) => (
                    <button key={k} type="button" onClick={() => sisip(k)} className="rounded-lg bg-lilac-soft px-2 py-0.5 font-mono text-xs font-semibold text-brand hover:bg-lilac">
                      {k}
                    </button>
                  ))}
                </div>
                <textarea ref={ref} value={templat} onChange={(e) => setTemplat(e.target.value)} rows={13} maxLength={2000} className={`${isian} resize-y text-sm leading-relaxed`} />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" disabled={!berubah || sibuk} onClick={() => simpan(templat)} className={`${tombol} bg-brand px-5 py-2.5 text-sm text-white hover:bg-brand-deep`}>
                    {sibuk ? "Menyimpan…" : "Simpan pesan"}
                  </button>
                  {templat !== PESAN_BAWAAN && (
                    <button type="button" disabled={sibuk} onClick={() => simpan(PESAN_BAWAAN)} className={`${tombol} px-4 py-2.5 text-sm text-ink/60 hover:bg-ink/[0.06]`}>
                      Kembalikan teks bawaan
                    </button>
                  )}
                </div>
              </div>
              {/* pratinjau seperti gelembung chat WhatsApp */}
              <div className="rounded-2xl bg-[#efe7dd] p-4">
                <p className="mb-2 text-xs font-semibold text-ink/45">Pratinjau</p>
                <p className="ml-auto max-w-[95%] rounded-2xl rounded-tr-md bg-[#d9fdd3] px-3.5 py-2.5 text-[13px] leading-relaxed break-words whitespace-pre-line text-ink shadow-sm">{contoh}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
