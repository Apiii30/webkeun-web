import Image from "next/image";

// Webi, maskot Webkeun (gambarnya di public/brand/webi-maskot-webkeun/). Pose berbadan penuh untuk ilustrasi, pose
// "kepala-*" untuk ikon & avatar kecil, "profil" untuk avatar yang butuh latar (kepala di atas kotak lavender).
const DIR = "/brand/webi-maskot-webkeun/";
const BADAN = [208, 222] as const;
const KEPALA = [200, 164] as const;
const POSE = {
  utama: ["webi-utama", ...BADAN],
  melambai: ["webi-senang-melambai", ...BADAN],
  kedip: ["webi-mengedip-jempol", ...BADAN],
  kaget: ["webi-kaget", ...BADAN],
  semangat: ["webi-semangat-hp", ...BADAN],
  cinta: ["webi-cinta-undangan", ...BADAN],
  sedih: ["webi-sedih", ...BADAN],
  grr: ["webi-grr", ...BADAN],
  "kepala-utama": ["webi-kepala-utama", ...KEPALA],
  "kepala-senang": ["webi-kepala-senang", ...KEPALA],
  "kepala-cinta": ["webi-kepala-cinta", ...KEPALA],
  "kepala-grr": ["webi-kepala-grr", ...KEPALA],
  profil: ["foto-profil-webi-lavender", 200, 200],
} as const;

export type Mood = keyof typeof POSE;

export function Mascot({ mood, className, eager }: { mood: Mood; className?: string; eager?: boolean }) {
  const [nama, w, h] = POSE[mood];
  return <Image src={`${DIR}${nama}.svg`} alt="" aria-hidden="true" width={w} height={h} loading={eager ? "eager" : undefined} draggable={false} className={className} />;
}
