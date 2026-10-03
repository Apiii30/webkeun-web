import { Amiri, Cormorant_Garamond, Great_Vibes, Montserrat } from "next/font/google";
import { photo } from "./photos";
import { wedding } from "./data";
import {
  Closing,
  Couple,
  Events,
  GallerySection,
  GiftSection,
  Hero,
  LoveStorySection,
  Opening,
  RsvpSection,
} from "./sections";
import { InvitationShell } from "./shell";

// Undangan Frisca & Arif: undangan pertama yang dibuat (proyek wedding-invitation), dipasang sebagai template demo.
// Nuansa rose & plum dengan motif geometri Islami dan sentuhan Sunda, foto bingkai lengkung, galeri coverflow,
// love story bergaris waktu, kartu acara bertumpuk, musik latar. RSVP & ucapan di sini hanya tersimpan di browser.

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-fr-serif" });
const sans = Montserrat({ subsets: ["latin"], variable: "--font-fr-sans" });
const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-fr-script" });
const arab = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-fr-arabic" });

const names = `${wedding.bride.nickname} & ${wedding.groom.nickname}`;

// tamu: nama dari link (?to=...). Kosong berarti "Tamu Undangan".
export function TemaFrisca({ tamu }: { tamu?: string }) {
  const guestName = tamu ?? null;
  return (
    <div className={`${serif.variable} ${sans.variable} ${script.variable} ${arab.variable}`}>
      <InvitationShell guestName={guestName} names={names} cover={photo(wedding.photos.cover)} music={wedding.music} hasGifts={wedding.gifts.length > 0 || !!wedding.giftAddress}>
        <Hero />
        <Opening />
        <Couple />
        <LoveStorySection />
        <Events />
        <GallerySection />
        <RsvpSection tamu={guestName} />
        <GiftSection guestName={guestName} />
        <Closing />
      </InvitationShell>
    </div>
  );
}
