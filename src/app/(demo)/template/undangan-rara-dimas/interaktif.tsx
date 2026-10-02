"use client";

import { type FormEvent, useEffect, useState } from "react";

// Bagian undangan yang butuh JavaScript: hitung mundur, salin rekening, RSVP & ucapan.

export function Countdown({ target }: { target: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [target]);

  const parts =
    left === null
      ? null
      : [
          [Math.floor(left / 86_400_000), "Hari"],
          [Math.floor(left / 3_600_000) % 24, "Jam"],
          [Math.floor(left / 60_000) % 60, "Menit"],
          [Math.floor(left / 1000) % 60, "Detik"],
        ];

  return (
    <div className="grid grid-cols-4 gap-2" aria-live="off">
      {(parts ?? [["–", "Hari"], ["–", "Jam"], ["–", "Menit"], ["–", "Detik"]]).map(([n, label]) => (
        <div key={label} className="rounded-2xl bg-[#3d4a36] py-4 text-center text-[#f7f2e8]">
          <p className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold tabular-nums">
            {typeof n === "number" ? String(n).padStart(2, "0") : n}
          </p>
          <p className="text-[11px] tracking-[0.2em] text-[#f7f2e8]/70 uppercase">{label}</p>
        </div>
      ))}
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text.replace(/\s/g, ""));
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {}
      }}
      className="rounded-full border border-[#3d4a36] px-4 py-1.5 text-sm font-medium transition-colors hover:bg-[#3d4a36] hover:text-[#f7f2e8]"
    >
      {copied ? "Tersalin ✓" : "Salin nomor"}
    </button>
  );
}

type Wish = { name: string; status: string; message: string };

const sampleWishes: Wish[] = [
  { name: "Tante Lina", status: "Hadir", message: "Selamat menempuh hidup baru, semoga jadi keluarga yang sakinah dan bahagia selalu." },
  { name: "Bagas", status: "Hadir", message: "Akhirnya! Lancar sampai hari H ya, kalian berdua." },
];

export function RsvpWishes() {
  const [wishes, setWishes] = useState(sampleWishes);
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const wish = {
      name: String(data.get("nama") ?? "").trim(),
      status: String(data.get("hadir") ?? ""),
      message: String(data.get("ucapan") ?? "").trim(),
    };
    if (!wish.name) return;
    setWishes((w) => [wish, ...w]);
    setSent(true);
    form.reset();
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-[#3d4a36]/20 bg-white/70 px-4 py-3 outline-none transition-colors placeholder:text-[#2f3a2c]/40 focus:border-[#3d4a36]";

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-4 text-left">
        <label className="block text-sm">
          Nama
          <input name="nama" required placeholder="Nama kamu" className={field} />
        </label>
        <fieldset className="text-sm">
          <legend>Konfirmasi kehadiran</legend>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {["Hadir", "Tidak hadir", "Masih ragu"].map((s, i) => (
              <label
                key={s}
                className="cursor-pointer rounded-xl border border-[#3d4a36]/20 bg-white/70 px-2 py-2.5 text-center has-checked:border-[#3d4a36] has-checked:bg-[#3d4a36] has-checked:text-[#f7f2e8] has-focus-visible:ring-2 has-focus-visible:ring-[#b08d57]"
              >
                <input type="radio" name="hadir" value={s} defaultChecked={i === 0} className="sr-only" />
                {s}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm">
          Ucapan & doa
          <textarea name="ucapan" rows={3} placeholder="Tulis ucapan untuk kedua mempelai" className={`${field} resize-none`} />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-[#3d4a36] py-3 font-medium text-[#f7f2e8] transition-colors hover:bg-[#2f3a2c]"
        >
          Kirim
        </button>
        {sent && <p className="text-center text-sm text-[#3d4a36]">Terima kasih! Ucapanmu sudah masuk.</p>}
      </form>

      <ul className="mt-8 max-h-80 space-y-3 overflow-y-auto text-left">
        {wishes.map((w, i) => (
          <li key={`${w.name}-${i}`} className="rounded-2xl bg-white/70 p-4">
            <p className="flex items-center justify-between gap-3 text-sm font-semibold">
              {w.name}
              <span className="rounded-full bg-[#8a9a74]/20 px-2.5 py-0.5 text-xs font-medium">{w.status}</span>
            </p>
            {w.message && <p className="mt-1.5 text-sm text-[#2f3a2c]/75">{w.message}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
