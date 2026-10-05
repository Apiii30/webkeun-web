"use client";

import { useState, useSyncExternalStore } from "react";

// Pembuat link per tamu di halaman rekap: tempel daftar nama (satu per baris), keluar link undangan dengan nama
// tamunya (?to=...) beserta pesan WhatsApp siap kirim. Semua diproses di browser, tidak ada yang disimpan.

const TEMPLAT = `Kepada Yth.
Bapak/Ibu/Saudara/i
{nama}

Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.

Info lengkap acara bisa dilihat di sini:
{link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.`;

const tanpaLangganan = () => () => {};

export function PembuatLink({ slug, sudah }: { slug: string; sudah: string[] }) {
  const asal = useSyncExternalStore(tanpaLangganan, () => location.origin, () => "");
  const [daftar, setDaftar] = useState("");
  const [templat, setTemplat] = useState(TEMPLAT);
  const [disalin, setDisalin] = useState<string | null>(null);

  const sudahMembalas = new Set(sudah.map((n) => n.toLowerCase()));
  // satu baris satu nama; spasi dirapikan, baris kosong & nama dobel (beda huruf besar-kecil pun) dibuang
  const nama = [
    ...new Map(
      daftar
        .split("\n")
        .map((n) => n.replace(/\s+/g, " ").trim().slice(0, 60))
        .filter(Boolean)
        .map((n) => [n.toLowerCase(), n] as const),
    ).values(),
  ].slice(0, 2000);
  const link = (n: string) => `${asal}/u/${slug}?to=${encodeURIComponent(n)}`;
  const pesan = (n: string) => templat.replaceAll("{nama}", n).replaceAll("{link}", link(n));

  async function salin(teks: string, id: string) {
    try {
      await navigator.clipboard.writeText(teks);
      setDisalin(id);
      setTimeout(() => setDisalin((d) => (d === id ? null : d)), 1600);
    } catch {
      window.prompt("Salin teks ini:", teks);
    }
  }

  function unduh() {
    const sel = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const isi = "﻿" + [["Nama", "Link", "Pesan"], ...nama.map((n) => [n, link(n), pesan(n)])].map((b) => b.map(sel).join(",")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([isi], { type: "text/csv;charset=utf-8" }));
    a.download = `link-tamu-${slug}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const tombol = "rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40";

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-semibold">Daftar nama tamu</span>
          <span className="block text-sm text-ink/55">Satu nama per baris. Bisa ditempel langsung dari Excel atau catatan.</span>
          <textarea
            value={daftar}
            onChange={(e) => setDaftar(e.target.value)}
            rows={8}
            placeholder={"Budi Santoso\nKeluarga Pak RT\nRina & Pasangan"}
            className="mt-2 w-full rounded-2xl bg-lilac-soft p-4 text-[15px] outline-none focus:ring-2 focus:ring-brand/40"
          />
        </label>
        <details className="rounded-2xl ring-1 ring-ink/10">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">Ubah teks pesan WhatsApp</summary>
          <div className="px-4 pb-4">
            <p className="text-sm text-ink/55">
              <code className="rounded bg-lilac-soft px-1">{"{nama}"}</code> diganti nama tamu,{" "}
              <code className="rounded bg-lilac-soft px-1">{"{link}"}</code> diganti link undangannya.
            </p>
            <textarea
              value={templat}
              onChange={(e) => setTemplat(e.target.value)}
              rows={12}
              className="mt-2 w-full rounded-xl bg-lilac-soft p-3 text-sm outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
        </details>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-auto text-sm font-semibold">{nama.length} link tamu</p>
          <button
            type="button"
            disabled={!nama.length}
            onClick={() => salin(nama.map((n) => `${n}\n${link(n)}`).join("\n\n"), "semua")}
            className={`${tombol} bg-lilac-soft hover:bg-lilac`}
          >
            {disalin === "semua" ? "Tersalin!" : "Salin semua link"}
          </button>
          <button type="button" disabled={!nama.length} onClick={unduh} className={`${tombol} bg-brand text-white hover:bg-brand-deep`}>
            Unduh CSV
          </button>
        </div>
        <ul className="mt-3 max-h-[32rem] space-y-2 overflow-y-auto pr-1">
          {nama.map((n) => (
            <li key={n} className="flex items-center gap-3 rounded-2xl p-3 ring-1 ring-ink/10">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-semibold">
                  <span className="truncate">{n}</span>
                  {sudahMembalas.has(n.toLowerCase()) && (
                    <span className="shrink-0 rounded-full bg-mint/25 px-2 py-0.5 text-[11px] font-bold text-[#0f7a63]">Sudah membalas</span>
                  )}
                </p>
                <p className="truncate text-xs text-ink/50">{link(n)}</p>
              </div>
              <button type="button" onClick={() => salin(pesan(n), n)} className={`${tombol} shrink-0 bg-lilac-soft hover:bg-lilac`}>
                {disalin === n ? "Tersalin!" : "Salin pesan"}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(pesan(n))}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${tombol} shrink-0 bg-wa text-white hover:opacity-90`}
              >
                WA
              </a>
            </li>
          ))}
          {!nama.length && <li className="rounded-2xl bg-lilac-soft p-6 text-center text-sm text-ink/55">Link tamu muncul di sini setelah nama diisi.</li>}
        </ul>
      </div>
    </div>
  );
}
