"use client";

import { type FormEvent, useState } from "react";
import { services, waLink } from "@/lib/site";
import { Icon } from "../icons";

const needs = [...services.map((s) => s.title), "Belum tahu"];

// Formulir ini tidak mengirim ke server: isinya disusun jadi pesan lalu dibuka di WhatsApp
export function ContactForm() {
  const [need, setNeed] = useState(needs[0]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nama = String(data.get("nama") ?? "").trim();
    const usaha = String(data.get("usaha") ?? "").trim();
    const pesan = String(data.get("pesan") ?? "").trim();
    const lines = [
      `Halo Webkeun! Aku ${nama}${usaha ? ` dari ${usaha}` : ""}.`,
      need === "Belum tahu" ? "Aku belum tahu butuh website yang mana, bisa bantu?" : `Aku tertarik bikin ${need}.`,
      pesan,
    ];
    window.open(waLink(lines.filter(Boolean).join("\n\n")), "_blank", "noopener,noreferrer");
  }

  const field =
    "mt-2 w-full rounded-xl bg-lilac-soft px-4 py-3 text-ink ring-1 ring-transparent outline-none transition-shadow placeholder:text-ink/40 focus:bg-white focus:ring-2 focus:ring-brand";

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6 shadow-[0_30px_70px_-34px_rgb(21_19_43/0.35)] ring-1 ring-ink/5 sm:p-8">
      <h2 className="text-2xl font-bold">Tulis pesan</h2>
      <p className="mt-1 text-ink/65">Isi singkat aja, nanti pesannya kami lanjutkan di WhatsApp.</p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Nama kamu</span>
          <input name="nama" required autoComplete="name" placeholder="Misal: Rina" className={field} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">
            Nama usaha <span className="font-normal text-ink/50">(opsional)</span>
          </span>
          <input name="usaha" autoComplete="organization" placeholder="Misal: Kawalu Coffee" className={field} />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold">Butuh website apa?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {needs.map((n) => (
            <label
              key={n}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors has-focus-visible:ring-2 has-focus-visible:ring-brand ${
                need === n ? "bg-brand text-white" : "bg-lilac-soft text-ink/75 hover:text-brand"
              }`}
            >
              <input
                type="radio"
                name="kebutuhan"
                value={n}
                checked={need === n}
                onChange={() => setNeed(n)}
                className="sr-only"
              />
              {n}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-6 block">
        <span className="text-sm font-semibold">
          Ceritain sedikit <span className="font-normal text-ink/50">(opsional)</span>
        </span>
        <textarea
          name="pesan"
          rows={4}
          placeholder="Misal: usahaku jualan kue, pengin ada katalog dan tombol pesan."
          className={`${field} resize-none`}
        />
      </label>

      <button
        type="submit"
        className="group mt-7 inline-flex w-full items-center justify-between gap-3 rounded-full bg-brand py-2 pr-2 pl-6 text-lg font-semibold text-white transition-colors hover:bg-brand-deep sm:w-auto"
      >
        Kirim lewat WhatsApp
        <span className="grid size-10 place-items-center rounded-full bg-white text-brand transition-transform group-hover:translate-x-0.5">
          <Icon name="whatsapp" className="size-5" />
        </span>
      </button>
    </form>
  );
}
