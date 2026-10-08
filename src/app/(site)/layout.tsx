import { ChatWidget } from "@/components/chat-widget";
import { PengamatGerak } from "@/components/gerak";
import { BottomNav, Navbar } from "@/components/navbar";
import { Footer } from "@/components/sections/closing";

// Kerangka halaman marketing: navbar, footer, dan tombol chat dipakai bersama
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
      <BottomNav />
      <PengamatGerak />
    </>
  );
}
