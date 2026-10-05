"use client";

import { CircleCheck, CircleX, Loader2, Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import { ATTENDANCE_LABEL, type Attendance, type Wish } from "./data";

// Versi demo dari form RSVP undangan Frisca & Arif. Di proyek aslinya form ini dikirim ke server (Supabase);
// di sini jawaban hanya ditambahkan ke daftar ucapan di browser, dengan pesan & validasi yang sama.

type Props = {
  defaultName: string | null;
  publicMaxPax: number;
  closed: boolean;
  onSubmit: (wish: Omit<Wish, "id" | "createdAt">) => void;
};

type RsvpState = { status: "idle" | "success" | "error"; message: string };

export function RsvpForm({ defaultName, publicMaxPax, closed, onSubmit }: Props) {
  const [state, setState] = useState<RsvpState>({ status: "idle", message: "" });
  const [pending, setPending] = useState(false);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const maxPax = publicMaxPax;
  const terkirim = state.status === "success"; // satu tamu satu ucapan: setelah terkirim form dikunci

  if (closed) {
    return <p className="rounded-2xl bg-white/70 p-5 text-center text-sm">Konfirmasi kehadiran sudah ditutup. Terima kasih.</p>;
  }

  async function action(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending || terkirim) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return setState({ status: "success", message: "Terima kasih!" });
    const pilih = String(data.get("attendance") ?? "") as Attendance;
    if (pilih !== "hadir" && pilih !== "tidak_hadir") return setState({ status: "error", message: "Silakan pilih konfirmasi kehadiran." });
    const name = String(data.get("name") ?? "").trim().slice(0, 120);
    if (!name) return setState({ status: "error", message: "Nama wajib diisi." });
    const message = String(data.get("message") ?? "").trim().slice(0, 500);
    if (!message) return setState({ status: "error", message: "Ucapan & doa wajib diisi." });
    setPending(true);
    await new Promise((r) => setTimeout(r, 500));
    onSubmit({ name, attendance: pilih, message });
    setPending(false);
    form.reset();
    setAttendance(null);
    setState({
      status: "success",
      message: pilih === "tidak_hadir" ? "Terima kasih atas doa dan ucapannya." : "Terima kasih, konfirmasi kehadiran Anda sudah kami terima.",
    });
  }

  const field = "w-full rounded-xl border border-[#ead3cf] bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-[#c9a09c] focus:ring-2 focus:ring-[#c9a09c]/20";

  return (
    <form onSubmit={action} className="space-y-4 rounded-3xl border border-[#b8976a]/30 bg-white/60 p-5 shadow-sm backdrop-blur">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-[#9c7880]">Nama</span>
        <input name="name" required maxLength={120} defaultValue={defaultName ?? ""} placeholder="Nama Anda" className={field} />
      </label>

      <fieldset>
        <legend className="mb-1.5 text-xs font-medium text-[#9c7880]">Konfirmasi Kehadiran</legend>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(ATTENDANCE_LABEL) as Attendance[]).map((value) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-sm font-medium transition ${
                attendance !== value
                  ? "border-[#ead3cf] bg-white/80 text-[#4a3a3e] hover:border-[#c9a09c]"
                  : value === "hadir"
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-red-500 bg-red-500 text-white"
              }`}
            >
              <input
                type="radio"
                name="attendance"
                value={value}
                required
                className="sr-only"
                onChange={() => setAttendance(value)}
              />
              {value === "hadir" ? <CircleCheck className="size-4" /> : <CircleX className="size-4" />}
              {ATTENDANCE_LABEL[value]}
            </label>
          ))}
        </div>
      </fieldset>

      {attendance === "hadir" && (
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-[#9c7880]">Jumlah yang hadir</span>
          <select name="pax" defaultValue={1} className={field}>
            {Array.from({ length: maxPax }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} orang
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-[#9c7880]">Ucapan & Doa</span>
        <textarea
          name="message"
          required
          rows={4}
          maxLength={500}
          placeholder="Tuliskan ucapan dan doa untuk kedua mempelai"
          className={`${field} resize-none`}
        />
      </label>

      {state.status !== "idle" && (
        <p className={`text-center text-sm ${state.status === "error" ? "text-red-700" : "text-[#6b4d55]"}`} role="status">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || terkirim}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6b4d55] py-3 text-sm font-medium text-[#fbf6f2] shadow-md transition hover:bg-[#9c7880] disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        Kirim
      </button>
    </form>
  );
}
